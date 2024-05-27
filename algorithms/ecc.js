// ecc.js

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
        this.a = a; // коэффициент a кривой
        this.b = b; // коэффициент b кривой
        this.p = p; // модуль
        this.G = G; // базовая точка
        this.n = n; // порядок группы
    }

    modInverse(k, p) {
        if (k < 0) {
            return p - this.modInverse(-k, p);
        }
        let s = 0, old_s = 1;
        let t = 1, old_t = 0;
        let r = p, old_r = k;
        while (r !== 0) {
            const quotient = Math.floor(old_r / r);
            [old_r, r] = [r, old_r - quotient * r];
            [old_s, s] = [s, old_s - quotient * s];
            [old_t, t] = [t, old_t - quotient * t];
        }
        return (old_s + p) % p;
    }

    addPoints(P, Q) {
        if (P.isInfinity()) return Q;
        if (Q.isInfinity()) return P;

        if (P.equals(Q)) {
            const s = ((3 * P.x * P.x + this.a) * this.modInverse(2 * P.y, this.p)) % this.p;
            const x = (s * s - 2 * P.x) % this.p;
            const y = (s * (P.x - x) - P.y) % this.p;
            return new Point((x + this.p) % this.p, (y + this.p) % this.p);
        } else {
            const s = ((Q.y - P.y) * this.modInverse(Q.x - P.x, this.p)) % this.p;
            const x = (s * s - P.x - Q.x) % this.p;
            const y = (s * (P.x - x) - P.y) % this.p;
            return new Point((x + this.p) % this.p, (y + this.p) % this.p);
        }
    }

    multiplyPoint(k, P) {
        let N = P;
        let Q = new Point(null, null); // "infinity" point

        while (k > 0) {
            if (k % 2 === 1) {
                Q = this.addPoints(Q, N);
            }
            N = this.addPoints(N, N);
            k = Math.floor(k / 2);
        }
        return Q;
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
        // Преобразуем сообщение в точку на кривой (упрощенный пример)
        const x = message.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % this.p;
        const y = Math.sqrt(x * x * x + this.a * x + this.b) % this.p;
        return new Point(x, y);
    }

    decodeMessage(point) {
        // Преобразуем точку обратно в сообщение (упрощенный пример)
        return String.fromCharCode(point.x % 256);
    }
}

module.exports = { ECC, Point };
