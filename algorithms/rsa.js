
function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function modInverse(e, phi) {
    let m0 = phi, t, q;
    let x0 = 0, x1 = 1;

    if (phi === 1) return 0;

    while (e > 1) {
        q = Math.floor(e / phi);
        t = phi;

        phi = e % phi;
        e = t;
        t = x0;

        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0) x1 += m0;

    return x1;
}

function modPow(base, exponent, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if ((exponent % 2) === 1) {
            result = (result * base) % modulus;
        }
        exponent = exponent >> 1;
        base = (base * base) % modulus;
    }
    return result;
}

function encrypt(message, publicKey) {
    const { e, n } = publicKey;
    const messageCode = message.split('').map(char => char.charCodeAt(0));
    const encryptedMessage = messageCode.map(charCode => modPow(charCode, e, n));
    return encryptedMessage;
}

function decrypt(encryptedMessage, privateKey) {
    const { d, n } = privateKey;
    const decryptedMessage = encryptedMessage.map(charCode => modPow(charCode, d, n));
    return String.fromCharCode(...decryptedMessage);
}

module.exports = { encrypt, decrypt };
