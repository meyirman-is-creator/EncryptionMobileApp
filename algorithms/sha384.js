// sha384.js

function rotateRight64(n, x) {
    return (x >>> n) | (x << (64 - n));
}

function add64(a, b) {
    let lsw = (a.low & 0xFFFF) + (b.low & 0xFFFF);
    let msw = (a.low >>> 16) + (b.low >>> 16) + (lsw >>> 16);
    let low = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    lsw = (a.high & 0xFFFF) + (b.high & 0xFFFF) + (msw >>> 16);
    msw = (a.high >>> 16) + (b.high >>> 16) + (lsw >>> 16);
    let high = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    return { high, low };
}

function sigma0_512(x) {
    return {
        high: rotateRight64(28, x).high ^ rotateRight64(34, x).high ^ rotateRight64(39, x).high,
        low: rotateRight64(28, x).low ^ rotateRight64(34, x).low ^ rotateRight64(39, x).low,
    };
}

function sigma1_512(x) {
    return {
        high: rotateRight64(14, x).high ^ rotateRight64(18, x).high ^ rotateRight64(41, x).high,
        low: rotateRight64(14, x).low ^ rotateRight64(18, x).low ^ rotateRight64(41, x).low,
    };
}

function sigma0_256(x) {
    return {
        high: rotateRight64(1, x).high ^ rotateRight64(8, x).high ^ (x.high >>> 7),
        low: rotateRight64(1, x).low ^ rotateRight64(8, x).low ^ (x.low >>> 7),
    };
}

function sigma1_256(x) {
    return {
        high: rotateRight64(19, x).high ^ rotateRight64(61, x).high ^ (x.high >>> 6),
        low: rotateRight64(19, x).low ^ rotateRight64(61, x).low ^ (x.low >>> 6),
    };
}

function choice(x, y, z) {
    return {
        high: (x.high & y.high) ^ (~x.high & z.high),
        low: (x.low & y.low) ^ (~x.low & z.low),
    };
}

function majority(x, y, z) {
    return {
        high: (x.high & y.high) ^ (x.high & z.high) ^ (y.high & z.high),
        low: (x.low & y.low) ^ (x.low & z.low) ^ (y.low & z.low),
    };
}

function toHexStr64(n) {
    let s = "", v;
    for (let i = 7; i >= 0; i--) {
        v = (n.low >>> (i * 4)) & 0x0f;
        s += v.toString(16);
    }
    for (let i = 7; i >= 0; i--) {
        v = (n.high >>> (i * 4)) & 0x0f;
        s += v.toString(16);
    }
    return s;
}

function sha384(message) {
    const H = [
        { high: 0xcbbb9d5d, low: 0xc1059ed8 }, { high: 0x629a292a, low: 0x367cd507 },
        { high: 0x9159015a, low: 0x3070dd17 }, { high: 0x152fecd8, low: 0xf70e5939 },
        { high: 0x67332667, low: 0xffc00b31 }, { high: 0x8eb44a87, low: 0x68581511 },
        { high: 0xdb0c2e0d, low: 0x64f98fa7 }, { high: 0x47b5481d, low: 0xbefa4fa4 }
    ];

    const K = [
        { high: 0x428a2f98, low: 0xd728ae22 }, { high: 0x71374491, low: 0x23ef65cd },
        { high: 0xb5c0fbcf, low: 0xec4d3b2f }, { high: 0xe9b5dba5, low: 0x8189dbbc },
        { high: 0x3956c25b, low: 0xf348b538 }, { high: 0x59f111f1, low: 0xb605d019 },
        { high: 0x923f82a4, low: 0xaf194f9b }, { high: 0xab1c5ed5, low: 0xda6d8118 },
        { high: 0xd807aa98, low: 0xa3030242 }, { high: 0x12835b01, low: 0x45706fbe },
        { high: 0x243185be, low: 0x4ee4b28c }, { high: 0x550c7dc3, low: 0xd5ffb4e2 },
        { high: 0x72be5d74, low: 0xf27b896f }, { high: 0x80deb1fe, low: 0x3b1696b1 },
        { high: 0x9bdc06a7, low: 0x25c71235 }, { high: 0xc19bf174, low: 0xcf692694 },
        { high: 0xe49b69c1, low: 0x9ef14ad2 }, { high: 0xefbe4786, low: 0x384f25e3 },
        { high: 0x0fc19dc6, low: 0x8b8cd5b5 }, { high: 0x240ca1cc, low: 0x77ac9c65 },
        { high: 0x2de92c6f, low: 0x592b0275 }, { high: 0x4a7484aa, low: 0x6ea6e483 },
        { high: 0x5cb0a9dc, low: 0xbd41fbd4 }, { high: 0x76f988da, low: 0x831153b5 },
        { high: 0x983e5152, low: 0xee66dfab }, { high: 0xa831c66d, low: 0x2db43210 },
        { high: 0xb00327c8, low: 0x98fb213f }, { high: 0xbf597fc7, low: 0xbeef0ee4 },
        { high: 0xc6e00bf3, low: 0x3da88fc2 }, { high: 0xd5a79147, low: 0x930aa725 },
        { high: 0x06ca6351, low: 0xe003826f }, { high: 0x14292967, low: 0x0a0e6e70 },
        { high: 0x27b70a85, low: 0x46d22ffc }, { high: 0x2e1b2138, low: 0x5c26c926 },
        { high: 0x4d2c6dfc, low: 0x5ac42aed }, { high: 0x53380d13, low: 0x9d95b3df },
        { high: 0x650a7354, low: 0x8baf63de }, { high: 0x766a0abb, low: 0x3c77b2a8 },
        { high: 0x81c2c92e, low: 0x47edaee6 }, { high: 0x92722c85, low: 0x1482353b },
        { high: 0xa2bfe8a1, low: 0x4cf10364 }, { high: 0xa81a664b, low: 0xbc423001 },
        { high: 0xc24b8b70, low: 0xd0f89791 }, { high: 0xc76c51a3, low: 0x0654be30 },
        { high: 0xd192e819, low: 0xd6ef5218 }, { high: 0xd6990624, low: 0x5565a910 },
        { high: 0xf40e3585, low: 0x5771202a }, { high: 0x106aa070, low: 0x32bbd1b8 },
        { high: 0x19a4c116, low: 0xb8d2d0c8 }, { high: 0x1e376c08, low: 0x5141ab53 },
        { high: 0x2748774c, low: 0xdf8eeb99 }, { high: 0x34b0bcb5, low: 0xe19b48a8 },
        { high: 0x391c0cb3, low: 0xc5c95a63 }, { high: 0x4ed8aa4a, low: 0xe3418acb },
        { high: 0x5b9cca4f, low: 0x7763e373 }, { high: 0x682e6ff3, low: 0xd6b2b8a3 },
        { high: 0x748f82ee, low: 0x5defb2fc }, { high: 0x78a5636f, low: 0x43172f60 },
        { high: 0x84c87814, low: 0xa1f0ab72 }, { high: 0x8cc70208, low: 0x1a6439ec },
        { high: 0x90befffa, low: 0x23631e28 }, { high: 0xa4506ceb, low: 0xde82bde9 },
        { high: 0xbef9a3f7, low: 0xb2c67915 }, { high: 0xc67178f2, low: 0xe372532b },
        { high: 0xca273ece, low: 0xea26619c }, { high: 0xd186b8c7, low: 0x21c0c207 },
        { high: 0xeada7dd6, low: 0xcde0eb1e }, { high: 0xf57d4f7f, low: 0xee6ed178 },
        { high: 0x06f067aa, low: 0x72176fba }, { high: 0x0a637dc5, low: 0xa2c898a6 },
        { high: 0x113f9804, low: 0xbef90dae }, { high: 0x1b710b35, low: 0x131c471b },
        { high: 0x28db77f5, low: 0x23047d84 }, { high: 0x32caab7b, low: 0x40c72493 },
        { high: 0x3c9ebe0a, low: 0x15c9bebc }, { high: 0x431d67c4, low: 0x9c100d4c },
        { high: 0x4cc5d4be, low: 0xcb3e42b6 }, { high: 0x597f299c, low: 0xfc657e2a },
        { high: 0x5fcb6fab, low: 0x3ad6faec }, { high: 0x6c44198c, low: 0x4a475817 }
    ];

    message += String.fromCharCode(0x80);

    const originalLength = message.length;
    while (message.length % 128 !== 112) {
        message += String.fromCharCode(0x00);
    }

    const messageLengthBits = originalLength * 8;
    for (let i = 0; i < 16; i++) {
        message += String.fromCharCode((messageLengthBits >>> ((15 - i) * 8)) & 0xff);
    }

    const w = new Array(80).fill({ high: 0, low: 0 });
    for (let i = 0; i < message.length / 128; i++) {
        for (let j = 0; j < 16; j++) {
            const index = i * 128 + j * 8;
            w[j] = {
                high: (message.charCodeAt(index) << 24) |
                      (message.charCodeAt(index + 1) << 16) |
                      (message.charCodeAt(index + 2) << 8) |
                      (message.charCodeAt(index + 3)),
                low: (message.charCodeAt(index + 4) << 24) |
                     (message.charCodeAt(index + 5) << 16) |
                     (message.charCodeAt(index + 6) << 8) |
                     (message.charCodeAt(index + 7))
            };
        }

        for (let j = 16; j < 80; j++) {
            const s0 = sigma0_256(w[j - 15]);
            const s1 = sigma1_256(w[j - 2]);
            w[j] = add64(add64(add64(s1, w[j - 7]), s0), w[j - 16]);
        }

        let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

        for (let j = 0; j < 80; j++) {
            const s1 = sigma1_512(e);
            const ch = choice(e, f, g);
            const temp1 = add64(add64(add64(add64(h, s1), ch), K[j]), w[j]);
            const s0 = sigma0_512(a);
            const maj = majority(a, b, c);
            const temp2 = add64(s0, maj);

            h = g;
            g = f;
            f = e;
            e = add64(d, temp1);
            d = c;
            c = b;
            b = a;
            a = add64(temp1, temp2);
        }

        H[0] = add64(H[0], a);
        H[1] = add64(H[1], b);
        H[2] = add64(H[2], c);
        H[3] = add64(H[3], d);
        H[4] = add64(H[4], e);
        H[5] = add64(H[5], f);
        H[6] = add64(H[6], g);
        H[7] = add64(H[7], h);
    }

    return toHexStr64(H[0]) + toHexStr64(H[1]) + toHexStr64(H[2]) + toHexStr64(H[3]) +
           toHexStr64(H[4]) + toHexStr64(H[5]);
}

module.exports = sha384;
