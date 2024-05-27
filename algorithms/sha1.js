function rotateLeft(n, s) {
    return (n << s) | (n >>> (32 - s));
}

function cvtHex(val) {
    let str = '';
    let i;
    let v;
    for (i = 7; i >= 0; i--) {
        v = (val >>> (i * 4)) & 0x0f;
        str += v.toString(16);
    }
    return str;
}

function utf8Encode(str) {
    return unescape(encodeURIComponent(str));
}

function sha1(msg) {
    msg = utf8Encode(msg);
    
    let msgLen = msg.length;

    let wordArray = [];
    for (let i = 0; i < msgLen - 3; i += 4) {
        let j = msg.charCodeAt(i) << 24 |
                msg.charCodeAt(i + 1) << 16 |
                msg.charCodeAt(i + 2) << 8 |
                msg.charCodeAt(i + 3);
        wordArray.push(j);
    }

    let i;
    switch (msgLen % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msgLen - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = msg.charCodeAt(msgLen - 2) << 24 | msg.charCodeAt(msgLen - 1) << 16 | 0x08000;
            break;
        case 3:
            i = msg.charCodeAt(msgLen - 3) << 24 | msg.charCodeAt(msgLen - 2) << 16 | msg.charCodeAt(msgLen - 1) << 8 | 0x80;
            break;
    }

    wordArray.push(i);

    while ((wordArray.length % 16) !== 14) {
        wordArray.push(0);
    }

    wordArray.push(msgLen >>> 29);
    wordArray.push((msgLen << 3) & 0x0ffffffff);

    let H0 = 0x67452301;
    let H1 = 0xEFCDAB89;
    let H2 = 0x98BADCFE;
    let H3 = 0x10325476;
    let H4 = 0xC3D2E1F0;

    let W = new Array(80);

    for (let blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
        for (let i = 0; i < 16; i++) {
            W[i] = wordArray[blockstart + i];
        }
        for (let i = 16; i <= 79; i++) {
            W[i] = rotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        }

        let A = H0;
        let B = H1;
        let C = H2;
        let D = H3;
        let E = H4;

        for (let i = 0; i <= 19; i++) {
            let temp = (rotateLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotateLeft(B, 30);
            B = A;
            A = temp;
        }

        for (let i = 20; i <= 39; i++) {
            let temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotateLeft(B, 30);
            B = A;
            A = temp;
        }

        for (let i = 40; i <= 59; i++) {
            let temp = (rotateLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotateLeft(B, 30);
            B = A;
            A = temp;
        }

        for (let i = 60; i <= 79; i++) {
            let temp = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotateLeft(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }

    let temp = cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4);
    return temp.toLowerCase();
}

module.exports = sha1;
