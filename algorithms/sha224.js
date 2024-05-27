function rotateRight(n, x) {
    return (x >>> n) | (x << (32 - n));
}

function choice(x, y, z) {
    return (x & y) ^ (~x & z);
}

function majority(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
}

function sha256Sigma0(x) {
    return rotateRight(2, x) ^ rotateRight(13, x) ^ rotateRight(22, x);
}

function sha256Sigma1(x) {
    return rotateRight(6, x) ^ rotateRight(11, x) ^ rotateRight(25, x);
}

function sha256sigma0(x) {
    return rotateRight(7, x) ^ rotateRight(18, x) ^ (x >>> 3);
}

function sha256sigma1(x) {
    return rotateRight(17, x) ^ rotateRight(19, x) ^ (x >>> 10);
}

function toHexStr(n) {
    let s = "", v;
    for (let i = 7; i >= 0; i--) {
        v = (n >>> (i * 4)) & 0x0f;
        s += v.toString(16);
    }
    return s;
}

function sha224(message) {
    let h0 = 0xc1059ed8, h1 = 0x367cd507, h2 = 0x3070dd17, h3 = 0xf70e5939,
        h4 = 0xffc00b31, h5 = 0x68581511, h6 = 0x64f98fa7, h7 = 0xbefa4fa4;

    const k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    message += String.fromCharCode(0x80);

    let l = message.length / 4 + 2;
    let n = Math.ceil(l / 16);
    let m = new Array(n);

    for (let i = 0; i < n; i++) {
        m[i] = new Array(16);
        for (let j = 0; j < 16; j++) {
            m[i][j] = (message.charCodeAt(i * 64 + j * 4 + 0) << 24) |
                      (message.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                      (message.charCodeAt(i * 64 + j * 4 + 2) << 8) |
                      (message.charCodeAt(i * 64 + j * 4 + 3) << 0);
        }
    }

    m[n - 1][14] = ((message.length - 1) * 8) >>> 32;
    m[n - 1][15] = ((message.length - 1) * 8) & 0xffffffff;

    for (let i = 0; i < n; i++) {
        let w = new Array(64);

        for (let t = 0; t < 16; t++) w[t] = m[i][t];
        for (let t = 16; t < 64; t++) {
            w[t] = (sha256sigma1(w[t - 2]) + w[t - 7] + sha256sigma0(w[t - 15]) + w[t - 16]) & 0xffffffff;
        }

        let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

        for (let t = 0; t < 64; t++) {
            let T1 = h + sha256Sigma1(e) + choice(e, f, g) + k[t] + w[t];
            let T2 = sha256Sigma0(a) + majority(a, b, c);
            h = g;
            g = f;
            f = e;
            e = (d + T1) & 0xffffffff;
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) & 0xffffffff;
        }

        h0 = (h0 + a) & 0xffffffff;
        h1 = (h1 + b) & 0xffffffff;
        h2 = (h2 + c) & 0xffffffff;
        h3 = (h3 + d) & 0xffffffff;
        h4 = (h4 + e) & 0xffffffff;
        h5 = (h5 + f) & 0xffffffff;
        h6 = (h6 + g) & 0xffffffff;
        h7 = (h7 + h) & 0xffffffff;
    }

    return toHexStr(h0) + toHexStr(h1) + toHexStr(h2) + toHexStr(h3) + toHexStr(h4) + toHexStr(h5) + toHexStr(h6);
}

module.exports = sha224;
