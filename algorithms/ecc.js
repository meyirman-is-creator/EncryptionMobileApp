class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    isInfinity() {
        return this.x === null && this.y === null;
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
}

class ECC {
    constructor(a, b, p, G, n) {
        this.a = a;
        this.b = b;
        this.p = p;
        this.G = G;
        this.n = n;
    }

    modInverse(k, p) {
        k = k % p;
        for (let x = 1; x < p; x++) {
            if ((k * x) % p === 1) {
                return x;
            }
        }
        return 1;
    }

    addPoints(P, Q) {
        if (P.isInfinity()) return Q;
        if (Q.isInfinity()) return P;

        let s;
        if (P.equals(Q)) {
            s = (3 * P.x * P.x + this.a) * this.modInverse(2 * P.y, this.p);
        } else {
            s = (Q.y - P.y) * this.modInverse(Q.x - P.x, this.p);
        }
        s = s % this.p;

        const x = (s * s - P.x - Q.x) % this.p;
        const y = (s * (P.x - x) - P.y) % this.p;

        return new Point((x + this.p) % this.p, (y + this.p) % this.p);
    }

    multiplyPoint(k, P) {
        let result = new Point(null, null); // Point at infinity
        let addend = P;

        while (k > 0) {
            if (k % 2 === 1) {
                result = this.addPoints(result, addend);
            }
            addend = this.addPoints(addend, addend);
            k = Math.floor(k / 2);
        }
        return result;
    }

    generateKeyPair() {
        const privateKey = Math.floor(Math.random() * (this.n - 1)) + 1;
        const publicKey = this.multiplyPoint(privateKey, this.G);
        return { privateKey, publicKey };
    }

    encrypt(message, publicKey) {
        const k = Math.floor(Math.random() * (this.n - 1)) + 1;
        const C1 = this.multiplyPoint(k, this.G);
        const C2 = this.addPoints(message, this.multiplyPoint(k, publicKey));
        return { C1, C2 };
    }

    decrypt(C, privateKey) {
        const { C1, C2 } = C;
        const S = this.multiplyPoint(privateKey, C1);
        return this.addPoints(C2, new Point(S.x, -S.y));
    }

    encodeMessage(message) {
        const x = message.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % this.p;
        const y = Math.sqrt(x * x * x + this.a * x + this.b) % this.p;
        return new Point(x, y);
    }

    decodeMessage(point) {
        const charCode = point.x % 256;
        return String.fromCharCode(charCode);
    }
}

module.exports = { ECC, Point };
