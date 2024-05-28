const SBox = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

const InvSBox = [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
    0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
    0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
    0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
    0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
    0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
    0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
    0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
    0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
    0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
    0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
];

const Rcon = [
    0x00000000, 0x01000000, 0x02000000, 0x04000000,
    0x08000000, 0x10000000, 0x20000000, 0x40000000,
    0x80000000, 0x1b000000, 0x36000000
];


function keyExpansion(key) {
    const expandedKey = new Array(44);
    for (let i = 0; i < 4; i++) {
        expandedKey[i] = (key[4 * i] << 24) | (key[4 * i + 1] << 16) | (key[4 * i + 2] << 8) | key[4 * i + 3];
    }
    for (let i = 4; i < 44; i++) {
        let temp = expandedKey[i - 1];
        if (i % 4 === 0) {
            temp = subWord(rotWord(temp)) ^ Rcon[i / 4];
        }
        expandedKey[i] = expandedKey[i - 4] ^ temp;
    }
    return expandedKey;
}

function subWord(word) {
    return (SBox[(word >>> 24) & 0xff] << 24) |
        (SBox[(word >>> 16) & 0xff] << 16) |
        (SBox[(word >>> 8) & 0xff] << 8) |
        SBox[word & 0xff];
}

function rotWord(word) {
    return ((word << 8) | (word >>> 24)) & 0xffffffff;
}

function subBytes(state) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            state[i][j] = SBox[state[i][j]];
        }
    }
}

function invSubBytes(state) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            state[i][j] = InvSBox[state[i][j]];
        }
    }
}

function shiftRows(state) {
    const temp = new Array(4);
    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            temp[j] = state[i][(j + i) % 4];
        }
        for (let j = 0; j < 4; j++) {
            state[i][j] = temp[j];
        }
    }
}

function invShiftRows(state) {
    const temp = new Array(4);
    for (let i = 1; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            temp[(j + i) % 4] = state[i][j];
        }
        for (let j = 0; j < 4; j++) {
            state[i][j] = temp[j];
        }
    }
}

function mixColumns(state) {
    for (let i = 0; i < 4; i++) {
        const t0 = state[0][i];
        const t1 = state[1][i];
        const t2 = state[2][i];
        const t3 = state[3][i];
        state[0][i] = mul(t0, 2) ^ mul(t1, 3) ^ t2 ^ t3;
        state[1][i] = t0 ^ mul(t1, 2) ^ mul(t2, 3) ^ t3;
        state[2][i] = t0 ^ t1 ^ mul(t2, 2) ^ mul(t3, 3);
        state[3][i] = mul(t0, 3) ^ t1 ^ t2 ^ mul(t3, 2);
    }
}

function invMixColumns(state) {
    for (let i = 0; i < 4; i++) {
        const t0 = state[0][i];
        const t1 = state[1][i];
        const t2 = state[2][i];
        const t3 = state[3][i];
        state[0][i] = mul(t0, 0xe) ^ mul(t1, 0xb) ^ mul(t2, 0xd) ^ mul(t3, 0x9);
        state[1][i] = mul(t0, 0x9) ^ mul(t1, 0xe) ^ mul(t2, 0xb) ^ mul(t3, 0xd);
        state[2][i] = mul(t0, 0xd) ^ mul(t1, 0x9) ^ mul(t2, 0xe) ^ mul(t3, 0xb);
        state[3][i] = mul(t0, 0xb) ^ mul(t1, 0xd) ^ mul(t2, 0x9) ^ mul(t3, 0xe);
    }
}

function addRoundKey(state, roundKey) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            state[j][i] ^= (roundKey[i] >>> (24 - j * 8)) & 0xff;
        }
    }
}

function mul(a, b) {
    let p = 0;
    for (let counter = 0; counter < 8; counter++) {
        if (b & 1) p ^= a;
        let hiBitSet = a & 0x80;
        a <<= 1;
        if (hiBitSet) a ^= 0x1b;
        b >>= 1;
    }
    return p & 0xff;
}

function aesEncryptBlock(block, key) {
    const state = [
        [block[0], block[1], block[2], block[3]],
        [block[4], block[5], block[6], block[7]],
        [block[8], block[9], block[10], block[11]],
        [block[12], block[13], block[14], block[15]],
    ];

    const expandedKey = keyExpansion(key);

    addRoundKey(state, expandedKey.slice(0, 4));

    for (let round = 1; round < 10; round++) {
        subBytes(state);
        shiftRows(state);
        mixColumns(state);
        addRoundKey(state, expandedKey.slice(round * 4, round * 4 + 4));
    }

    subBytes(state);
    shiftRows(state);
    addRoundKey(state, expandedKey.slice(40, 44));

    return state.flat();
}

function aesDecryptBlock(block, key) {
    const state = [
        [block[0], block[1], block[2], block[3]],
        [block[4], block[5], block[6], block[7]],
        [block[8], block[9], block[10], block[11]],
        [block[12], block[13], block[14], block[15]],
    ];

    const expandedKey = keyExpansion(key);

    addRoundKey(state, expandedKey.slice(40, 44));

    for (let round = 9; round > 0; round--) {
        invShiftRows(state);
        invSubBytes(state);
        addRoundKey(state, expandedKey.slice(round * 4, round * 4 + 4));
        invMixColumns(state);
    }

    invShiftRows(state);
    invSubBytes(state);
    addRoundKey(state, expandedKey.slice(0, 4));

    return state.flat();
}

function pkcs7Pad(data, blockSize) {
    const padLength = blockSize - (data.length % blockSize);
    return data.concat(Array(padLength).fill(padLength));
}

function pkcs7Unpad(data) {
    const padLength = data[data.length - 1];
    return data.slice(0, -padLength);
}

function iso10126Pad(data, blockSize) {
    const padLength = blockSize - (data.length % blockSize);
    return data.concat(Array(padLength - 1).fill().map(() => Math.floor(Math.random() * 256)), [padLength]);
}

function iso10126Unpad(data) {
    const padLength = data[data.length - 1];
    return data.slice(0, -padLength);
}

function ansiX923Pad(data, blockSize) {
    const padLength = blockSize - (data.length % blockSize);
    return data.concat(Array(padLength - 1).fill(0), [padLength]);
}

function ansiX923Unpad(data) {
    const padLength = data[data.length - 1];
    return data.slice(0, -padLength);
}

function iso7816Pad(data, blockSize) {
    const padLength = blockSize - (data.length % blockSize);
    return data.concat([0x80], Array(padLength - 1).fill(0));
}

function iso7816Unpad(data) {
    let padIndex = data.length - 1;
    while (data[padIndex] === 0) {
        padIndex--;
    }
    if (data[padIndex] !== 0x80) {
        throw new Error('Invalid ISO7816 padding');
    }
    return data.slice(0, padIndex);
}

function zeroPaddingPad(data, blockSize) {
    const padLength = blockSize - (data.length % blockSize);
    return data.concat(Array(padLength).fill(0));
}

function zeroPaddingUnpad(data) {
    let padIndex = data.length - 1;
    while (data[padIndex] === 0 && padIndex >= 0) {
        padIndex--;
    }
    return data.slice(0, padIndex + 1);
}

function noPaddingPad(data, blockSize) {
    if (data.length % blockSize !== 0) {
        throw new Error('Data length is not a multiple of block size');
    }
    return data;
}

function noPaddingUnpad(data) {
    return data;
}

function hexToBytes(hex) {
    const bytes = [];
    for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}

function base64ToBytes(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function bytesToHex(bytes) {
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

function bytesToBase64(bytes) {
    return btoa(String.fromCharCode(...bytes));
}

function getKeyBytes(key, keySize) {
    const keyBytes = key.split('').map(char => char.charCodeAt(0));
    if (keySize === '128') {
        return keyBytes.slice(0, 16);
    } else if (keySize === '192') {
        return keyBytes.slice(0, 24);
    } else if (keySize === '256') {
        return keyBytes.slice(0, 32);
    } else {
        throw new Error(`Unsupported key size: ${keySize}`);
    }
}

function encryptAES(text, key, iv, keySize, mode, padding, outputFormat) {
    const keyBytes = getKeyBytes(key, keySize);
    let ivBytes = iv ? hexToBytes(iv) : new Array(16).fill(0);

    let paddedText;
    switch (padding) {
        case 'Pkcs7':
            paddedText = pkcs7Pad([...text].map(char => char.charCodeAt(0)), 16);
            break;
        case 'Iso10126':
            paddedText = iso10126Pad([...text].map(char => char.charCodeAt(0)), 16);
            break;
        case 'AnsiX923':
            paddedText = ansiX923Pad([...text].map(char => char.charCodeAt(0)), 16);
            break;
        case 'Iso7816':
            paddedText = iso7816Pad([...text].map(char => char.charCodeAt(0)), 16);
            break;
        case 'ZeroPadding':
            paddedText = zeroPaddingPad([...text].map(char => char.charCodeAt(0)), 16);
            break;
        case 'NoPadding':
            paddedText = noPaddingPad([...text].map(char => char.charCodeAt(0)), 16);
            break;
        default:
            throw new Error(`Unsupported padding: ${padding}`);
    }

    const encryptedText = [];

    for (let i = 0; i < paddedText.length; i += 16) {
        const block = paddedText.slice(i, i + 16);
        let encryptedBlock;
        if (mode === 'ECB') {
            encryptedBlock = aesEncryptBlock(block, keyBytes);
        } else if (mode === 'CBC') {
            const xorBlock = block.map((byte, index) => byte ^ ivBytes[index]);
            encryptedBlock = aesEncryptBlock(xorBlock, keyBytes);
            ivBytes = encryptedBlock;
        } else if (mode === 'CFB') {
            const encryptedIv = aesEncryptBlock(ivBytes, keyBytes);
            encryptedBlock = block.map((byte, index) => byte ^ encryptedIv[index]);
            ivBytes = encryptedBlock;
        } else if (mode === 'OFB') {
            const encryptedIv = aesEncryptBlock(ivBytes, keyBytes);
            encryptedBlock = block.map((byte, index) => byte ^ encryptedIv[index]);
            ivBytes = encryptedIv;
        }
        encryptedText.push(...encryptedBlock);
    }

    return outputFormat === 'Base64' ? bytesToBase64(encryptedText) : bytesToHex(encryptedText);
}

function decryptAES(encryptedText, key, iv, keySize, mode, padding, inputFormat) {
    const keyBytes = getKeyBytes(key, keySize);
    let ivBytes = iv ? hexToBytes(iv) : new Array(16).fill(0);

    let encryptedBytes;
    if (inputFormat === 'Base64') {
        encryptedBytes = base64ToBytes(encryptedText);
    } else {
        encryptedBytes = hexToBytes(encryptedText);
    }

    const decryptedText = [];

    for (let i = 0; i < encryptedBytes.length; i += 16) {
        const block = encryptedBytes.slice(i, i + 16);
        let decryptedBlock;
        if (mode === 'ECB') {
            decryptedBlock = aesDecryptBlock(block, keyBytes);
        } else if (mode === 'CBC') {
            decryptedBlock = aesDecryptBlock(block, keyBytes);
            decryptedBlock = decryptedBlock.map((byte, index) => byte ^ ivBytes[index]);
            ivBytes = block;
        } else if (mode === 'CFB') {
            const encryptedIv = aesEncryptBlock(ivBytes, keyBytes);
            decryptedBlock = block.map((byte, index) => byte ^ encryptedIv[index]);
            ivBytes = block;
        } else if (mode === 'OFB') {
            const encryptedIv = aesEncryptBlock(ivBytes, keyBytes);
            decryptedBlock = block.map((byte, index) => byte ^ encryptedIv[index]);
            ivBytes = encryptedIv;
        }
        decryptedText.push(...decryptedBlock);
    }

    let unpaddedText;
    switch (padding) {
        case 'Pkcs7':
            unpaddedText = pkcs7Unpad(decryptedText);
            break;
        case 'Iso10126':
            unpaddedText = iso10126Unpad(decryptedText);
            break;
        case 'AnsiX923':
            unpaddedText = ansiX923Unpad(decryptedText);
            break;
        case 'Iso7816':
            unpaddedText = iso7816Unpad(decryptedText);
            break;
        case 'ZeroPadding':
            unpaddedText = zeroPaddingUnpad(decryptedText);
            break;
        case 'NoPadding':
            unpaddedText = noPaddingUnpad(decryptedText);
            break;
        default:
            throw new Error(`Unsupported padding: ${padding}`);
    }

    return String.fromCharCode(...unpaddedText);
}

module.exports = { encryptAES, decryptAES };