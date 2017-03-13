var dbits;
var canary = 0xdeadbeefcafe;
var j_lm = 15715070 == (16777215 & canary);

function BigInteger(t, e, i) {
    if (null != t)
        if ("number" == typeof t) this.fromNumber(t, e, i);
        else if (null == e && "string" != typeof t) this.fromString(t, 256);
    else this.fromString(t, e) }

function nbi() {
    return new BigInteger(null) }

function am1(t, e, i, n, r, s) {
    for (; --s >= 0;) {
        var o = e * this[t++] + i[n] + r;
        r = Math.floor(o / 67108864);
        i[n++] = 67108863 & o }
    return r }

function am2(t, e, i, n, r, s) {
    var o = 32767 & e,
        a = e >> 15;
    for (; --s >= 0;) {
        var _ = 32767 & this[t];
        var c = this[t++] >> 15;
        var h = a * _ + c * o;
        _ = o * _ + ((32767 & h) << 15) + i[n] + (1073741823 & r);
        r = (_ >>> 30) + (h >>> 15) + a * c + (r >>> 30);
        i[n++] = 1073741823 & _ }
    return r }

function am3(t, e, i, n, r, s) {
    var o = 16383 & e,
        a = e >> 14;
    for (; --s >= 0;) {
        var _ = 16383 & this[t];
        var c = this[t++] >> 14;
        var h = a * _ + c * o;
        _ = o * _ + ((16383 & h) << 14) + i[n] + r;
        r = (_ >> 28) + (h >> 14) + a * c;
        i[n++] = 268435455 & _ }
    return r }
if (j_lm && "Microsoft Internet Explorer" == navigator.appName) { BigInteger.prototype.am = am2;
    dbits = 30 } else if (j_lm && "Netscape" != navigator.appName) { BigInteger.prototype.am = am1;
    dbits = 26 } else { BigInteger.prototype.am = am3;
    dbits = 28 }
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array;
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(t) {
    return BI_RM.charAt(t) }

function intAt(t, e) {
    var i = BI_RC[t.charCodeAt(e)];
    return null == i ? -1 : i }

function bnpCopyTo(t) {
    for (var e = this.t - 1; e >= 0; --e) t[e] = this[e];
    t.t = this.t;
    t.s = this.s }

function bnpFromInt(t) { this.t = 1;
    this.s = t < 0 ? -1 : 0;
    if (t > 0) this[0] = t;
    else if (t < -1) this[0] = t + DV;
    else this.t = 0 }

function nbv(t) {
    var e = nbi();
    e.fromInt(t);
    return e }

function bnpFromString(t, e) {
    var i;
    if (16 == e) i = 4;
    else if (8 == e) i = 3;
    else if (256 == e) i = 8;
    else if (2 == e) i = 1;
    else if (32 == e) i = 5;
    else if (4 == e) i = 2;
    else { this.fromRadix(t, e);
        return }
    this.t = 0;
    this.s = 0;
    var n = t.length,
        r = !1,
        s = 0;
    for (; --n >= 0;) {
        var o = 8 == i ? 255 & t[n] : intAt(t, n);
        if (!(o < 0)) { r = !1;
            if (0 == s) this[this.t++] = o;
            else if (s + i > this.DB) { this[this.t - 1] |= (o & (1 << this.DB - s) - 1) << s;
                this[this.t++] = o >> this.DB - s } else this[this.t - 1] |= o << s;
            s += i;
            if (s >= this.DB) s -= this.DB } else if ("-" == t.charAt(n)) r = !0 }
    if (8 == i && 0 != (128 & t[0])) { this.s = -1;
        if (s > 0) this[this.t - 1] |= (1 << this.DB - s) - 1 << s }
    this.clamp();
    if (r) BigInteger.ZERO.subTo(this, this) }

function bnpClamp() {
    var t = this.s & this.DM;
    for (; this.t > 0 && this[this.t - 1] == t;) --this.t }

function bnToString(t) {
    if (this.s < 0) return "-" + this.negate().toString(t);
    var e;
    if (16 == t) e = 4;
    else if (8 == t) e = 3;
    else if (2 == t) e = 1;
    else if (32 == t) e = 5;
    else if (4 == t) e = 2;
    else return this.toRadix(t);
    var i = (1 << e) - 1,
        n, r = !1,
        s = "",
        o = this.t;
    var a = this.DB - o * this.DB % e;
    if (o-- > 0) {
        if (a < this.DB && (n = this[o] >> a) > 0) { r = !0;
            s = int2char(n) }
        for (; o >= 0;) {
            if (a < e) { n = (this[o] & (1 << a) - 1) << e - a;
                n |= this[--o] >> (a += this.DB - e) } else { n = this[o] >> (a -= e) & i;
                if (a <= 0) { a += this.DB;--o } }
            if (n > 0) r = !0;
            if (r) s += int2char(n) } }
    return r ? s : "0" }

function bnNegate() {
    var t = nbi();
    BigInteger.ZERO.subTo(this, t);
    return t }

function bnAbs() {
    return this.s < 0 ? this.negate() : this }

function bnCompareTo(t) {
    var e = this.s - t.s;
    if (0 != e) return e;
    var i = this.t;
    e = i - t.t;
    if (0 != e) return this.s < 0 ? -e : e;
    for (; --i >= 0;)
        if (0 != (e = this[i] - t[i])) return e;
    return 0 }

function nbits(t) {
    var e = 1,
        i;
    if (0 != (i = t >>> 16)) { t = i;
        e += 16 }
    if (0 != (i = t >> 8)) { t = i;
        e += 8 }
    if (0 != (i = t >> 4)) { t = i;
        e += 4 }
    if (0 != (i = t >> 2)) { t = i;
        e += 2 }
    if (0 != (i = t >> 1)) { t = i;
        e += 1 }
    return e }

function bnBitLength() {
    if (this.t <= 0) return 0;
    else return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM) }

function bnpDLShiftTo(t, e) {
    var i;
    for (i = this.t - 1; i >= 0; --i) e[i + t] = this[i];
    for (i = t - 1; i >= 0; --i) e[i] = 0;
    e.t = this.t + t;
    e.s = this.s }

function bnpDRShiftTo(t, e) {
    for (var i = t; i < this.t; ++i) e[i - t] = this[i];
    e.t = Math.max(this.t - t, 0);
    e.s = this.s }

function bnpLShiftTo(t, e) {
    var i = t % this.DB;
    var n = this.DB - i;
    var r = (1 << n) - 1;
    var s = Math.floor(t / this.DB),
        o = this.s << i & this.DM,
        a;
    for (a = this.t - 1; a >= 0; --a) { e[a + s + 1] = this[a] >> n | o;
        o = (this[a] & r) << i }
    for (a = s - 1; a >= 0; --a) e[a] = 0;
    e[s] = o;
    e.t = this.t + s + 1;
    e.s = this.s;
    e.clamp() }

function bnpRShiftTo(t, e) { e.s = this.s;
    var i = Math.floor(t / this.DB);
    if (!(i >= this.t)) {
        var n = t % this.DB;
        var r = this.DB - n;
        var s = (1 << n) - 1;
        e[0] = this[i] >> n;
        for (var o = i + 1; o < this.t; ++o) { e[o - i - 1] |= (this[o] & s) << r;
            e[o - i] = this[o] >> n }
        if (n > 0) e[this.t - i - 1] |= (this.s & s) << r;
        e.t = this.t - i;
        e.clamp() } else e.t = 0 }

function bnpSubTo(t, e) {
    var i = 0,
        n = 0,
        r = Math.min(t.t, this.t);
    for (; i < r;) { n += this[i] - t[i];
        e[i++] = n & this.DM;
        n >>= this.DB }
    if (t.t < this.t) { n -= t.s;
        for (; i < this.t;) { n += this[i];
            e[i++] = n & this.DM;
            n >>= this.DB }
        n += this.s } else { n += this.s;
        for (; i < t.t;) { n -= t[i];
            e[i++] = n & this.DM;
            n >>= this.DB }
        n -= t.s }
    e.s = n < 0 ? -1 : 0;
    if (n < -1) e[i++] = this.DV + n;
    else if (n > 0) e[i++] = n;
    e.t = i;
    e.clamp() }

function bnpMultiplyTo(t, e) {
    var i = this.abs(),
        n = t.abs();
    var r = i.t;
    e.t = r + n.t;
    for (; --r >= 0;) e[r] = 0;
    for (r = 0; r < n.t; ++r) e[r + i.t] = i.am(0, n[r], e, r, 0, i.t);
    e.s = 0;
    e.clamp();
    if (this.s != t.s) BigInteger.ZERO.subTo(e, e) }

function bnpSquareTo(t) {
    var e = this.abs();
    var i = t.t = 2 * e.t;
    for (; --i >= 0;) t[i] = 0;
    for (i = 0; i < e.t - 1; ++i) {
        var n = e.am(i, e[i], t, 2 * i, 0, 1);
        if ((t[i + e.t] += e.am(i + 1, 2 * e[i], t, 2 * i + 1, n, e.t - i - 1)) >= e.DV) { t[i + e.t] -= e.DV;
            t[i + e.t + 1] = 1 } }
    if (t.t > 0) t[t.t - 1] += e.am(i, e[i], t, 2 * i, 0, 1);
    t.s = 0;
    t.clamp() }

function bnpDivRemTo(t, e, i) {
    var n = t.abs();
    if (!(n.t <= 0)) {
        var r = this.abs();
        if (!(r.t < n.t)) {
            if (null == i) i = nbi();
            var s = nbi(),
                o = this.s,
                a = t.s;
            var _ = this.DB - nbits(n[n.t - 1]);
            if (_ > 0) { n.lShiftTo(_, s);
                r.lShiftTo(_, i) } else { n.copyTo(s);
                r.copyTo(i) }
            var c = s.t;
            var h = s[c - 1];
            if (0 != h) {
                var u = h * (1 << this.F1) + (c > 1 ? s[c - 2] >> this.F2 : 0);
                var l = this.FV / u,
                    d = (1 << this.F1) / u,
                    f = 1 << this.F2;
                var m = i.t,
                    p = m - c,
                    g = null == e ? nbi() : e;
                s.dlShiftTo(p, g);
                if (i.compareTo(g) >= 0) { i[i.t++] = 1;
                    i.subTo(g, i) }
                BigInteger.ONE.dlShiftTo(c, g);
                g.subTo(s, s);
                for (; s.t < c;) s[s.t++] = 0;
                for (; --p >= 0;) {
                    var v = i[--m] == h ? this.DM : Math.floor(i[m] * l + (i[m - 1] + f) * d);
                    if ((i[m] += s.am(0, v, i, p, 0, c)) < v) { s.dlShiftTo(p, g);
                        i.subTo(g, i);
                        for (; i[m] < --v;) i.subTo(g, i) } }
                if (null != e) { i.drShiftTo(c, e);
                    if (o != a) BigInteger.ZERO.subTo(e, e) }
                i.t = c;
                i.clamp();
                if (_ > 0) i.rShiftTo(_, i);
                if (o < 0) BigInteger.ZERO.subTo(i, i) } } else {
            if (null != e) e.fromInt(0);
            if (null != i) this.copyTo(i) } } }

function bnMod(t) {
    var e = nbi();
    this.abs().divRemTo(t, null, e);
    if (this.s < 0 && e.compareTo(BigInteger.ZERO) > 0) t.subTo(e, e);
    return e }

function Classic(t) { this.m = t }

function cConvert(t) {
    if (t.s < 0 || t.compareTo(this.m) >= 0) return t.mod(this.m);
    else return t }

function cRevert(t) {
    return t }

function cReduce(t) { t.divRemTo(this.m, null, t) }

function cMulTo(t, e, i) { t.multiplyTo(e, i);
    this.reduce(i) }

function cSqrTo(t, e) { t.squareTo(e);
    this.reduce(e) }
Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

function bnpInvDigit() {
    if (this.t < 1) return 0;
    var t = this[0];
    if (0 == (1 & t)) return 0;
    var e = 3 & t;
    e = e * (2 - (15 & t) * e) & 15;
    e = e * (2 - (255 & t) * e) & 255;
    e = e * (2 - ((65535 & t) * e & 65535)) & 65535;
    e = e * (2 - t * e % this.DV) % this.DV;
    return e > 0 ? this.DV - e : -e }

function Montgomery(t) { this.m = t;
    this.mp = t.invDigit();
    this.mpl = 32767 & this.mp;
    this.mph = this.mp >> 15;
    this.um = (1 << t.DB - 15) - 1;
    this.mt2 = 2 * t.t }

function montConvert(t) {
    var e = nbi();
    t.abs().dlShiftTo(this.m.t, e);
    e.divRemTo(this.m, null, e);
    if (t.s < 0 && e.compareTo(BigInteger.ZERO) > 0) this.m.subTo(e, e);
    return e }

function montRevert(t) {
    var e = nbi();
    t.copyTo(e);
    this.reduce(e);
    return e }

function montReduce(t) {
    for (; t.t <= this.mt2;) t[t.t++] = 0;
    for (var e = 0; e < this.m.t; ++e) {
        var i = 32767 & t[e];
        var n = i * this.mpl + ((i * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
        i = e + this.m.t;
        t[i] += this.m.am(0, n, t, e, 0, this.m.t);
        for (; t[i] >= t.DV;) { t[i] -= t.DV;
            t[++i]++ } }
    t.clamp();
    t.drShiftTo(this.m.t, t);
    if (t.compareTo(this.m) >= 0) t.subTo(this.m, t) }

function montSqrTo(t, e) { t.squareTo(e);
    this.reduce(e) }

function montMulTo(t, e, i) { t.multiplyTo(e, i);
    this.reduce(i) }
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

function bnpIsEven() {
    return 0 == (this.t > 0 ? 1 & this[0] : this.s) }

function bnpExp(t, e) {
    if (t > 4294967295 || t < 1) return BigInteger.ONE;
    var i = nbi(),
        n = nbi(),
        r = e.convert(this),
        s = nbits(t) - 1;
    r.copyTo(i);
    for (; --s >= 0;) { e.sqrTo(i, n);
        if ((t & 1 << s) > 0) e.mulTo(n, r, i);
        else {
            var o = i;
            i = n;
            n = o } }
    return e.revert(i) }

function bnModPowInt(t, e) {
    var i;
    if (t < 256 || e.isEven()) i = new Classic(e);
    else i = new Montgomery(e);
    return this.exp(t, i) }
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

function bnClone() {
    var t = nbi();
    this.copyTo(t);
    return t }

function bnIntValue() {
    if (this.s < 0) {
        if (1 == this.t) return this[0] - this.DV;
        else if (0 == this.t) return -1 } else if (1 == this.t) return this[0];
    else if (0 == this.t) return 0;
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0] }

function bnByteValue() {
    return 0 == this.t ? this.s : this[0] << 24 >> 24 }

function bnShortValue() {
    return 0 == this.t ? this.s : this[0] << 16 >> 16 }

function bnpChunkSize(t) {
    return Math.floor(Math.LN2 * this.DB / Math.log(t)) }

function bnSigNum() {
    if (this.s < 0) return -1;
    else if (this.t <= 0 || 1 == this.t && this[0] <= 0) return 0;
    else return 1 }

function bnpToRadix(t) {
    if (null == t) t = 10;
    if (0 == this.signum() || t < 2 || t > 36) return "0";
    var e = this.chunkSize(t);
    var i = Math.pow(t, e);
    var n = nbv(i),
        r = nbi(),
        s = nbi(),
        o = "";
    this.divRemTo(n, r, s);
    for (; r.signum() > 0;) {
        o = (i + s.intValue()).toString(t).substr(1) + o;
        r.divRemTo(n, r, s)
    }
    return s.intValue().toString(t) + o
}

function bnpFromRadix(t, e) { this.fromInt(0);
    if (null == e) e = 10;
    var i = this.chunkSize(e);
    var n = Math.pow(e, i),
        r = !1,
        s = 0,
        o = 0;
    for (var a = 0; a < t.length; ++a) {
        var _ = intAt(t, a);
        if (!(_ < 0)) { o = e * o + _;
            if (++s >= i) { this.dMultiply(n);
                this.dAddOffset(o, 0);
                s = 0;
                o = 0 } } else if ("-" == t.charAt(a) && 0 == this.signum()) r = !0 }
    if (s > 0) { this.dMultiply(Math.pow(e, s));
        this.dAddOffset(o, 0) }
    if (r) BigInteger.ZERO.subTo(this, this) }

function bnpFromNumber(t, e, i) {
    if ("number" == typeof e)
        if (t < 2) this.fromInt(1);
        else { this.fromNumber(t, i);
            if (!this.testBit(t - 1)) this.bitwiseTo(BigInteger.ONE.shiftLeft(t - 1), op_or, this);
            if (this.isEven()) this.dAddOffset(1, 0);
            for (; !this.isProbablePrime(e);) { this.dAddOffset(2, 0);
                if (this.bitLength() > t) this.subTo(BigInteger.ONE.shiftLeft(t - 1), this) } }
    else {
        var n = new Array,
            r = 7 & t;
        n.length = (t >> 3) + 1;
        e.nextBytes(n);
        if (r > 0) n[0] &= (1 << r) - 1;
        else n[0] = 0;
        this.fromString(n, 256) } }

function bnToByteArray() {
    var t = this.t,
        e = new Array;
    e[0] = this.s;
    var i = this.DB - t * this.DB % 8,
        n, r = 0;
    if (t-- > 0) {
        if (i < this.DB && (n = this[t] >> i) != (this.s & this.DM) >> i) e[r++] = n | this.s << this.DB - i;
        for (; t >= 0;) {
            if (i < 8) { n = (this[t] & (1 << i) - 1) << 8 - i;
                n |= this[--t] >> (i += this.DB - 8) } else { n = this[t] >> (i -= 8) & 255;
                if (i <= 0) { i += this.DB;--t } }
            if (0 != (128 & n)) n |= -256;
            if (0 == r && (128 & this.s) != (128 & n)) ++r;
            if (r > 0 || n != this.s) e[r++] = n } }
    return e }

function bnEquals(t) {
    return 0 == this.compareTo(t) }

function bnMin(t) {
    return this.compareTo(t) < 0 ? this : t }

function bnMax(t) {
    return this.compareTo(t) > 0 ? this : t }

function bnpBitwiseTo(t, e, i) {
    var n, r, s = Math.min(t.t, this.t);
    for (n = 0; n < s; ++n) i[n] = e(this[n], t[n]);
    if (t.t < this.t) { r = t.s & this.DM;
        for (n = s; n < this.t; ++n) i[n] = e(this[n], r);
        i.t = this.t } else { r = this.s & this.DM;
        for (n = s; n < t.t; ++n) i[n] = e(r, t[n]);
        i.t = t.t }
    i.s = e(this.s, t.s);
    i.clamp() }

function op_and(t, e) {
    return t & e }

function bnAnd(t) {
    var e = nbi();
    this.bitwiseTo(t, op_and, e);
    return e }

function op_or(t, e) {
    return t | e }

function bnOr(t) {
    var e = nbi();
    this.bitwiseTo(t, op_or, e);
    return e }

function op_xor(t, e) {
    return t ^ e }

function bnXor(t) {
    var e = nbi();
    this.bitwiseTo(t, op_xor, e);
    return e }

function op_andnot(t, e) {
    return t & ~e }

function bnAndNot(t) {
    var e = nbi();
    this.bitwiseTo(t, op_andnot, e);
    return e }

function bnNot() {
    var t = nbi();
    for (var e = 0; e < this.t; ++e) t[e] = this.DM & ~this[e];
    t.t = this.t;
    t.s = ~this.s;
    return t }

function bnShiftLeft(t) {
    var e = nbi();
    if (t < 0) this.rShiftTo(-t, e);
    else this.lShiftTo(t, e);
    return e }

function bnShiftRight(t) {
    var e = nbi();
    if (t < 0) this.lShiftTo(-t, e);
    else this.rShiftTo(t, e);
    return e }

function lbit(t) {
    if (0 == t) return -1;
    var e = 0;
    if (0 == (65535 & t)) { t >>= 16;
        e += 16 }
    if (0 == (255 & t)) { t >>= 8;
        e += 8 }
    if (0 == (15 & t)) { t >>= 4;
        e += 4 }
    if (0 == (3 & t)) { t >>= 2;
        e += 2 }
    if (0 == (1 & t)) ++e;
    return e }

function bnGetLowestSetBit() {
    for (var t = 0; t < this.t; ++t)
        if (0 != this[t]) return t * this.DB + lbit(this[t]);
    if (this.s < 0) return this.t * this.DB;
    else return -1 }

function cbit(t) {
    var e = 0;
    for (; 0 != t;) { t &= t - 1;++e }
    return e }

function bnBitCount() {
    var t = 0,
        e = this.s & this.DM;
    for (var i = 0; i < this.t; ++i) t += cbit(this[i] ^ e);
    return t }

function bnTestBit(t) {
    var e = Math.floor(t / this.DB);
    if (e >= this.t) return 0 != this.s;
    else return 0 != (this[e] & 1 << t % this.DB) }

function bnpChangeBit(t, e) {
    var i = BigInteger.ONE.shiftLeft(t);
    this.bitwiseTo(i, e, i);
    return i }

function bnSetBit(t) {
    return this.changeBit(t, op_or) }

function bnClearBit(t) {
    return this.changeBit(t, op_andnot) }

function bnFlipBit(t) {
    return this.changeBit(t, op_xor) }

function bnpAddTo(t, e) {
    var i = 0,
        n = 0,
        r = Math.min(t.t, this.t);
    for (; i < r;) { n += this[i] + t[i];
        e[i++] = n & this.DM;
        n >>= this.DB }
    if (t.t < this.t) { n += t.s;
        for (; i < this.t;) { n += this[i];
            e[i++] = n & this.DM;
            n >>= this.DB }
        n += this.s } else { n += this.s;
        for (; i < t.t;) { n += t[i];
            e[i++] = n & this.DM;
            n >>= this.DB }
        n += t.s }
    e.s = n < 0 ? -1 : 0;
    if (n > 0) e[i++] = n;
    else if (n < -1) e[i++] = this.DV + n;
    e.t = i;
    e.clamp() }

function bnAdd(t) {
    var e = nbi();
    this.addTo(t, e);
    return e }

function bnSubtract(t) {
    var e = nbi();
    this.subTo(t, e);
    return e }

function bnMultiply(t) {
    var e = nbi();
    this.multiplyTo(t, e);
    return e }

function bnSquare() {
    var t = nbi();
    this.squareTo(t);
    return t }

function bnDivide(t) {
    var e = nbi();
    this.divRemTo(t, e, null);
    return e }

function bnRemainder(t) {
    var e = nbi();
    this.divRemTo(t, null, e);
    return e }

function bnDivideAndRemainder(t) {
    var e = nbi(),
        i = nbi();
    this.divRemTo(t, e, i);
    return new Array(e, i) }

function bnpDMultiply(t) { this[this.t] = this.am(0, t - 1, this, 0, 0, this.t);++this.t;
    this.clamp() }

function bnpDAddOffset(t, e) {
    if (0 != t) {
        for (; this.t <= e;) this[this.t++] = 0;
        this[e] += t;
        for (; this[e] >= this.DV;) { this[e] -= this.DV;
            if (++e >= this.t) this[this.t++] = 0;++this[e] } } }

function NullExp() {}

function nNop(t) {
    return t }

function nMulTo(t, e, i) { t.multiplyTo(e, i) }

function nSqrTo(t, e) { t.squareTo(e) }
NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

function bnPow(t) {
    return this.exp(t, new NullExp) }

function bnpMultiplyLowerTo(t, e, i) {
    var n = Math.min(this.t + t.t, e);
    i.s = 0;
    i.t = n;
    for (; n > 0;) i[--n] = 0;
    var r;
    for (r = i.t - this.t; n < r; ++n) i[n + this.t] = this.am(0, t[n], i, n, 0, this.t);
    for (r = Math.min(t.t, e); n < r; ++n) this.am(0, t[n], i, n, 0, e - n);
    i.clamp() }

function bnpMultiplyUpperTo(t, e, i) {--e;
    var n = i.t = this.t + t.t - e;
    i.s = 0;
    for (; --n >= 0;) i[n] = 0;
    for (n = Math.max(e - this.t, 0); n < t.t; ++n) i[this.t + n - e] = this.am(e - n, t[n], i, 0, 0, this.t + n - e);
    i.clamp();
    i.drShiftTo(1, i) }

function Barrett(t) { this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * t.t, this.r2);
    this.mu = this.r2.divide(t);
    this.m = t }

function barrettConvert(t) {
    if (t.s < 0 || t.t > 2 * this.m.t) return t.mod(this.m);
    else if (t.compareTo(this.m) < 0) return t;
    else {
        var e = nbi();
        t.copyTo(e);
        this.reduce(e);
        return e } }

function barrettRevert(t) {
    return t }

function barrettReduce(t) { t.drShiftTo(this.m.t - 1, this.r2);
    if (t.t > this.m.t + 1) { t.t = this.m.t + 1;
        t.clamp() }
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    for (; t.compareTo(this.r2) < 0;) t.dAddOffset(1, this.m.t + 1);
    t.subTo(this.r2, t);
    for (; t.compareTo(this.m) >= 0;) t.subTo(this.m, t) }

function barrettSqrTo(t, e) { t.squareTo(e);
    this.reduce(e) }

function barrettMulTo(t, e, i) { t.multiplyTo(e, i);
    this.reduce(i) }
Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

function bnModPow(t, e) {
    var i = t.bitLength(),
        n, r = nbv(1),
        s;
    if (i <= 0) return r;
    else if (i < 18) n = 1;
    else if (i < 48) n = 3;
    else if (i < 144) n = 4;
    else if (i < 768) n = 5;
    else n = 6;
    if (i < 8) s = new Classic(e);
    else if (e.isEven()) s = new Barrett(e);
    else s = new Montgomery(e);
    var o = new Array,
        a = 3,
        _ = n - 1,
        c = (1 << n) - 1;
    o[1] = s.convert(this);
    if (n > 1) {
        var h = nbi();
        s.sqrTo(o[1], h);
        for (; a <= c;) { o[a] = nbi();
            s.mulTo(h, o[a - 2], o[a]);
            a += 2 } }
    var u = t.t - 1,
        l, d = !0,
        f = nbi(),
        m;
    i = nbits(t[u]) - 1;
    for (; u >= 0;) {
        if (i >= _) l = t[u] >> i - _ & c;
        else { l = (t[u] & (1 << i + 1) - 1) << _ - i;
            if (u > 0) l |= t[u - 1] >> this.DB + i - _ }
        a = n;
        for (; 0 == (1 & l);) { l >>= 1;--a }
        if ((i -= a) < 0) { i += this.DB;--u }
        if (d) { o[l].copyTo(r);
            d = !1 } else {
            for (; a > 1;) { s.sqrTo(r, f);
                s.sqrTo(f, r);
                a -= 2 }
            if (a > 0) s.sqrTo(r, f);
            else { m = r;
                r = f;
                f = m }
            s.mulTo(f, o[l], r) }
        for (; u >= 0 && 0 == (t[u] & 1 << i);) { s.sqrTo(r, f);
            m = r;
            r = f;
            f = m;
            if (--i < 0) { i = this.DB - 1;--u } } }
    return s.revert(r) }

function bnGCD(t) {
    var e = this.s < 0 ? this.negate() : this.clone();
    var i = t.s < 0 ? t.negate() : t.clone();
    if (e.compareTo(i) < 0) {
        var n = e;
        e = i;
        i = n }
    var r = e.getLowestSetBit(),
        s = i.getLowestSetBit();
    if (s < 0) return e;
    if (r < s) s = r;
    if (s > 0) { e.rShiftTo(s, e);
        i.rShiftTo(s, i) }
    for (; e.signum() > 0;) {
        if ((r = e.getLowestSetBit()) > 0) e.rShiftTo(r, e);
        if ((r = i.getLowestSetBit()) > 0) i.rShiftTo(r, i);
        if (e.compareTo(i) >= 0) { e.subTo(i, e);
            e.rShiftTo(1, e) } else { i.subTo(e, i);
            i.rShiftTo(1, i) } }
    if (s > 0) i.lShiftTo(s, i);
    return i }

function bnpModInt(t) {
    if (t <= 0) return 0;
    var e = this.DV % t,
        i = this.s < 0 ? t - 1 : 0;
    if (this.t > 0)
        if (0 == e) i = this[0] % t;
        else
            for (var n = this.t - 1; n >= 0; --n) i = (e * i + this[n]) % t;
    return i }

function bnModInverse(t) {
    var e = t.isEven();
    if (this.isEven() && e || 0 == t.signum()) return BigInteger.ZERO;
    var i = t.clone(),
        n = this.clone();
    var r = nbv(1),
        s = nbv(0),
        o = nbv(0),
        a = nbv(1);
    for (; 0 != i.signum();) {
        for (; i.isEven();) { i.rShiftTo(1, i);
            if (e) {
                if (!r.isEven() || !s.isEven()) { r.addTo(this, r);
                    s.subTo(t, s) }
                r.rShiftTo(1, r) } else if (!s.isEven()) s.subTo(t, s);
            s.rShiftTo(1, s) }
        for (; n.isEven();) { n.rShiftTo(1, n);
            if (e) {
                if (!o.isEven() || !a.isEven()) { o.addTo(this, o);
                    a.subTo(t, a) }
                o.rShiftTo(1, o) } else if (!a.isEven()) a.subTo(t, a);
            a.rShiftTo(1, a) }
        if (i.compareTo(n) >= 0) { i.subTo(n, i);
            if (e) r.subTo(o, r);
            s.subTo(a, s) } else { n.subTo(i, n);
            if (e) o.subTo(r, o);
            a.subTo(s, a) } }
    if (0 != n.compareTo(BigInteger.ONE)) return BigInteger.ZERO;
    if (a.compareTo(t) >= 0) return a.subtract(t);
    if (a.signum() < 0) a.addTo(t, a);
    else return a;
    if (a.signum() < 0) return a.add(t);
    else return a }
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];

function bnIsProbablePrime(t) {
    var e, i = this.abs();
    if (1 == i.t && i[0] <= lowprimes[lowprimes.length - 1]) {
        for (e = 0; e < lowprimes.length; ++e)
            if (i[0] == lowprimes[e]) return !0;
        return !1 }
    if (i.isEven()) return !1;
    e = 1;
    for (; e < lowprimes.length;) {
        var n = lowprimes[e],
            r = e + 1;
        for (; r < lowprimes.length && n < lplim;) n *= lowprimes[r++];
        n = i.modInt(n);
        for (; e < r;)
            if (n % lowprimes[e++] == 0) return !1 }
    return i.millerRabin(t) }

function bnpMillerRabin(t) {
    var e = this.subtract(BigInteger.ONE);
    var i = e.getLowestSetBit();
    if (i <= 0) return !1;
    var n = e.shiftRight(i);
    t = t + 1 >> 1;
    if (t > lowprimes.length) t = lowprimes.length;
    var r = nbi();
    for (var s = 0; s < t; ++s) { r.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
        var o = r.modPow(n, this);
        if (0 != o.compareTo(BigInteger.ONE) && 0 != o.compareTo(e)) {
            var a = 1;
            for (; a++ < i && 0 != o.compareTo(e);) { o = o.modPowInt(2, this);
                if (0 == o.compareTo(BigInteger.ONE)) return !1 }
            if (0 != o.compareTo(e)) return !1 } }
    return !0 }
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
BigInteger.prototype.square = bnSquare;
if ("object" != typeof JSON) JSON = {};
! function() { "use strict";

    function f(t) {
        return t < 10 ? "0" + t : t }

    function quote(t) { escapable.lastIndex = 0;
        return escapable.test(t) ? '"' + t.replace(escapable, function(t) {
            var e = meta[t];
            return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + t + '"' }

    function str(t, e) {
        var i, n, r, s, o = gap,
            a, _ = e[t];
        if (_ && "object" == typeof _ && "function" == typeof _.toJSON) _ = _.toJSON(t);
        if ("function" == typeof rep) _ = rep.call(e, t, _);
        switch (typeof _) {
            case "string":
                return quote(_);
            case "number":
                return isFinite(_) ? String(_) : "null";
            case "boolean":
            case "null":
                return String(_);
            case "object":
                if (!_) return "null";
                gap += indent;
                a = [];
                if ("[object Array]" === Object.prototype.toString.apply(_)) { s = _.length;
                    for (i = 0; i < s; i += 1) a[i] = str(i, _) || "null";
                    r = 0 === a.length ? "[]" : gap ? "[\n" + gap + a.join(",\n" + gap) + "\n" + o + "]" : "[" + a.join(",") + "]";
                    gap = o;
                    return r }
                if (rep && "object" == typeof rep) { s = rep.length;
                    for (i = 0; i < s; i += 1)
                        if ("string" == typeof rep[i]) { n = rep[i];
                            r = str(n, _);
                            if (r) a.push(quote(n) + (gap ? ": " : ":") + r) } } else
                    for (n in _)
                        if (Object.prototype.hasOwnProperty.call(_, n)) { r = str(n, _);
                            if (r) a.push(quote(n) + (gap ? ": " : ":") + r) }
                r = 0 === a.length ? "{}" : gap ? "{\n" + gap + a.join(",\n" + gap) + "\n" + o + "}" : "{" + a.join(",") + "}";
                gap = o;
                return r } }
    if ("function" != typeof Date.prototype.toJSON) { Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf() } }
    var cx, escapable, gap, indent, meta, rep;
    if ("function" != typeof JSON.stringify) { escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" };
        JSON.stringify = function(t, e, i) {
            var n;
            gap = "";
            indent = "";
            if ("number" == typeof i)
                for (n = 0; n < i; n += 1) indent += " ";
            else if ("string" == typeof i) indent = i;
            rep = e;
            if (e && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify");
            return str("", { "": t }) } }
    if ("function" != typeof JSON.parse) { cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        JSON.parse = function(text, reviver) {
            function walk(t, e) {
                var i, n, r = t[e];
                if (r && "object" == typeof r)
                    for (i in r)
                        if (Object.prototype.hasOwnProperty.call(r, i)) { n = walk(r, i);
                            if (void 0 !== n) r[i] = n;
                            else delete r[i] }
                return reviver.call(t, e, r) }
            var j;
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) text = text.replace(cx, function(t) {
                return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) });
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) { j = eval("(" + text + ")");
                return "function" == typeof reviver ? walk({ "": j }, "") : j }
            throw new SyntaxError("JSON.parse") } } }();
var RSAPublicKey = function(t, e) { this.modulus = new BigInteger(Hex.encode(t), 16);
    this.encryptionExponent = new BigInteger(Hex.encode(e), 16) };
var UTF8 = { encode: function(t) { t = t.replace(/\r\n/g, "\n");
        var e = "";
        for (var i = 0; i < t.length; i++) {
            var n = t.charCodeAt(i);
            if (n < 128) e += String.fromCharCode(n);
            else if (n > 127 && n < 2048) { e += String.fromCharCode(n >> 6 | 192);
                e += String.fromCharCode(63 & n | 128) } else { e += String.fromCharCode(n >> 12 | 224);
                e += String.fromCharCode(n >> 6 & 63 | 128);
                e += String.fromCharCode(63 & n | 128) } }
        return e }, decode: function(t) {
        var e = "";
        var i = 0;
        var n = $c1 = $c2 = 0;
        for (; i < t.length;) { n = t.charCodeAt(i);
            if (n < 128) { e += String.fromCharCode(n);
                i++ } else if (n > 191 && n < 224) { $c2 = t.charCodeAt(i + 1);
                e += String.fromCharCode((31 & n) << 6 | 63 & $c2);
                i += 2 } else { $c2 = t.charCodeAt(i + 1);
                $c3 = t.charCodeAt(i + 2);
                e += String.fromCharCode((15 & n) << 12 | (63 & $c2) << 6 | 63 & $c3);
                i += 3 } }
        return e } };
var Base64 = { base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function(t) {
        if (!t) return !1;
        var e = "";
        var i, n, r;
        var s, o, a, _;
        var c = 0;
        do { i = t.charCodeAt(c++);
            n = t.charCodeAt(c++);
            r = t.charCodeAt(c++);
            s = i >> 2;
            o = (3 & i) << 4 | n >> 4;
            a = (15 & n) << 2 | r >> 6;
            _ = 63 & r;
            if (isNaN(n)) a = _ = 64;
            else if (isNaN(r)) _ = 64;
            e += this.base64.charAt(s) + this.base64.charAt(o) + this.base64.charAt(a) + this.base64.charAt(_) } while (c < t.length);
        return e }, decode: function(t) {
        if (!t) return !1;
        t = t.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        var e = "";
        var i, n, r, s;
        var o = 0;
        do { i = this.base64.indexOf(t.charAt(o++));
            n = this.base64.indexOf(t.charAt(o++));
            r = this.base64.indexOf(t.charAt(o++));
            s = this.base64.indexOf(t.charAt(o++));
            e += String.fromCharCode(i << 2 | n >> 4);
            if (64 != r) e += String.fromCharCode((15 & n) << 4 | r >> 2);
            if (64 != s) e += String.fromCharCode((3 & r) << 6 | s) } while (o < t.length);
        return e } };
var Hex = { hex: "0123456789abcdef", encode: function(t) {
        if (!t) return !1;
        var e = "";
        var i;
        var n = 0;
        do { i = t.charCodeAt(n++);
            e += this.hex.charAt(i >> 4 & 15) + this.hex.charAt(15 & i) } while (n < t.length);
        return e }, decode: function(t) {
        if (!t) return !1;
        t = t.replace(/[^0-9abcdef]/g, "");
        var e = "";
        var i = 0;
        do e += String.fromCharCode(this.hex.indexOf(t.charAt(i++)) << 4 & 240 | 15 & this.hex.indexOf(t.charAt(i++))); while (i < t.length);
        return e } };
var ASN1Data = function(t) { this.error = !1;
    this.parse = function(t) {
        if (!t) { this.error = !0;
            return null }
        var e = [];
        for (; t.length > 0;) {
            var i = t.charCodeAt(0);
            t = t.substr(1);
            var n = 0;
            if (5 == (31 & i)) t = t.substr(1);
            else if (128 & t.charCodeAt(0)) {
                var r = 127 & t.charCodeAt(0);
                t = t.substr(1);
                if (r > 0) n = t.charCodeAt(0);
                if (r > 1) n = n << 8 | t.charCodeAt(1);
                if (r > 2) { this.error = !0;
                    return null }
                t = t.substr(r) } else { n = t.charCodeAt(0);
                t = t.substr(1) }
            var s = "";
            if (n) {
                if (n > t.length) { this.error = !0;
                    return null }
                s = t.substr(0, n);
                t = t.substr(n) }
            if (32 & i) e.push(this.parse(s));
            else e.push(this.value(128 & i ? 4 : 31 & i, s)) }
        return e };
    this.value = function(t, e) {
        if (1 == t) return e ? !0 : !1;
        else if (2 == t) return e;
        else if (3 == t) return this.parse(e.substr(1));
        else if (5 == t) return null;
        else if (6 == t) {
            var i = [];
            var n = e.charCodeAt(0);
            i.push(Math.floor(n / 40));
            i.push(n - 40 * i[0]);
            var r = [];
            var s = 0;
            var o;
            for (o = 1; o < e.length; o++) {
                var a = e.charCodeAt(o);
                r.push(127 & a);
                if (128 & a) s++;
                else {
                    var _;
                    var c = 0;
                    for (_ = 0; _ < r.length; _++) c += r[_] * Math.pow(128, s--);
                    i.push(c);
                    s = 0;
                    r = [] } }
            return i.join(".") }
        return null };
    this.data = this.parse(t) };
var RSA = { getPublicKey: function(t) {
        if (t.length < 50) return !1;
        if ("-----BEGIN PUBLIC KEY-----" != t.substr(0, 26)) return !1;
        t = t.substr(26);
        if ("-----END PUBLIC KEY-----" != t.substr(t.length - 24)) return !1;
        t = t.substr(0, t.length - 24);
        t = new ASN1Data(Base64.decode(t));
        if (t.error) return !1;
        t = t.data;
        if ("1.2.840.113549.1.1.1" == t[0][0][0]) return new RSAPublicKey(t[0][1][0][0], t[0][1][0][1]);
        else return !1 }, encrypt: function(t, e) {
        if (!e) return !1;
        var i = e.modulus.bitLength() + 7 >> 3;
        t = this.pkcs1pad2(t, i);
        if (!t) return !1;
        t = t.modPowInt(e.encryptionExponent, e.modulus);
        if (!t) return !1;
        t = t.toString(16);
        for (; t.length < 2 * i;) t = "0" + t;
        return Base64.encode(Hex.decode(t)) }, decrypt: function(t) {
        var e = new BigInteger(t, 16) }, pkcs1pad2: function(t, e) {
        if (e < t.length + 11) return null;
        var i = [];
        var n = t.length - 1;
        for (; n >= 0 && e > 0;) i[--e] = t.charCodeAt(n--);
        i[--e] = 0;
        for (; e > 2;) i[--e] = Math.floor(254 * Math.random()) + 1;
        i[--e] = 2;
        i[--e] = 0;
        return new BigInteger(i) } };
var MpUtil = function() {
    var t = function(t, e, i) { t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent("on" + e, i) };
    var e = function(t, e, i) { t.removeEventListener ? t.removeEventListener(e, i, !1) : t.detachEvent("on" + e, i) };
    var i = function() {
        var t = +new Date;
        return function() {
            return "" + t++ } }();
    var n = function(t, e) {
        try { e = e.toLowerCase();
            if (null === t) return "null" == e;
            if (void 0 === t) return "undefined" == e;
            else return Object.prototype.toString.call(t).toLowerCase() == "[object " + e + "]" } catch (i) {
            return !1 } };
    return { addEvent: t, clearEvent: e, uniqueId: i, isTypeOf: n } }();
var MpRequest = function() {
    var t;
    var e = "zc.reg.163.com/resources/mp-agent-finger.html?WEBZJVersion=1488532676052";
    var i = "MP-DATA:";
    var n = "MP-COOKIE:";
    var r = "MP_AGENT_READY";
    var s = !1;
    var o = !1;
    var a = [];
    var _;
    var c = {};
    var h = {};
    var u = function(e) {
        e = e || {};
        var u = e.timeout || 1e4;
        s = !0;
        var l = setTimeout(function() {
            for (var t in c) { c[t].error({ ret: "-2" });
                delete c[t] } }, u);
        var d = function(e) {
            var s = e.data;
            if (s !== r) {
                if ("object" == typeof s) s = JSON.stringify(s);
                var u;
                if (0 !== s.indexOf(n)) {
                    if (0 === s.indexOf(i)) {
                        s = JSON.parse(s.replace(i, ""));
                        u = c[s.key];
                        delete c[s.key];
                        if (0 !== ("" + s.status).indexOf("2")) {
                            var d = { ret: "" + s.status };
                            u && u.error(d) } else {
                            s.result = JSON.parse(decodeURIComponent(s.result || ""));
                            u && u.success(s.result)
                        }
                    }
                } else {
                    try { s = JSON.parse(s.replace(n, "")) } catch (f) {}
                    u = h[s.key];
                    delete h[s.key];
                    u(s.cookieValue) }
            } else { o = !0;
                for (var m = 0, p = a.length; m < p; m++) _(t.contentWindow, { data: a[m] });
                clearTimeout(l) }
        };
        if (!window.postMessage) {
            var f = "MSGREGISTER|",
                m = [];
            var p = function() {
                var t = function(t) {
                    var e = {},
                        i = t.split("|");
                    for (var n = 0, r = i.length, s; n < r; n++) { s = i[n].split("=");
                        e[decodeURIComponent(s.shift())] = decodeURIComponent(s.join("=")) }
                    return e };
                return function() {
                    var e = unescape(window.name || "");
                    if (e && 0 == e.indexOf(f)) { window.name = "";
                        e = e.replace(f, "");
                        var i = t(e),
                            n = (i.origin || "").toLowerCase();
                        if (!n || "*" == n || 0 == location.href.toLowerCase().indexOf(n)) d({ data: JSON.parse(i.data || "null"), origin: document.referrer }) } } }();
            var g = function() {
                var t;
                var e = function(t, e) {
                    for (var i = 0, n = t.length; i < n; i++)
                        if (t[i] == e) return !0;
                    return !1 };
                return function() {
                    if (m.length) { t = [];
                        for (var i = m.length - 1, n; i >= 0; i--) { n = m[i];
                            if (!e(t, n.w)) { t.push(n.w);
                                m.splice(i, 1);
                                n.w.name = n.d } }
                        t = null } } }();
            _ = function() {
                var t = function(t) {
                    var e = [];
                    for (var i in t) e.push(encodeURIComponent(i) + "=" + encodeURIComponent(t[i]));
                    return e.join("|") };
                var e = function(e) {
                    var i = {};
                    e = e || {};
                    i.origin = e.origin || "*";
                    i.ref = location.href;
                    i.data = JSON.stringify(e.data);
                    return f + t(i) };
                return function(t, i) { m.unshift({ w: t, d: escape(e(i)) }) } }();
            window.setInterval(g, 100);
            window.setInterval(p, 50) } else { _ = function(t, e) { e = e || {};
                t.postMessage(JSON.stringify(e.data), e.origin || "*") };
            MpUtil.addEvent(window, "message", d) }
    };
    var l = function() {
        return function(t) { t = t || {};
            var e;
            e = document.createElement("iframe");
            e.frameBorder = 0;
            e.style.position = "absolute";
            e.style.width = 0;
            e.style.height = 0;
            e.id = "id-" + MpUtil.uniqueId();
            document.body.appendChild(e);
            var i = t.src;
            window.setTimeout(function() { e.src = i }, 0);
            return e } }();
    var d = function() {
        var i = function(t) {
            var e = [];
            for (var i in t) e.push(encodeURIComponent(i) + "=" + encodeURIComponent(t[i]));
            return e.join("&") };
        return function(n) { n = n || {};
            if (!s) u({ timeout: n.timeout });
            var r = MpUtil.uniqueId();
            c[r] = { success: n.success, error: n.error };
            if ("get" === n.type.toLowerCase()) {
                var h = n.url;
                var d = h.indexOf("?") < 0 ? "?" : "&";
                n.data.nocache = r;
                var f = i(n.data);
                if (f) h += d + f;
                n.url = h }
            var m = {};
            m.key = r;
            m.data = "get" === n.type.toLowerCase() ? null : n.data;
            m.headers = {};
            m.headers["Content-Type"] = n.contentType || "application/x-www-form-urlencoded";
            if ("application/x-www-form-urlencoded" == m.headers["Content-Type"]) { n.data = JSON.parse(n.data);
                m.data = i(n.data) }
            m.method = n.type;
            m.timeout = n.timeout || 1e4;
            m.url = n.url;
            if (!t) {
                if (window["$regCookieDomain"])
                    if (window["$regCookieDomain"].indexOf("icourse163.org") >= 0) e = e.replace("zc.reg.163.com", "reg." + window["$regCookieDomain"] + "/zc");
                    else e = e.replace("zc.reg.163.com", "passport." + window["$regCookieDomain"] + "/zc");
                e = e + "&pkid=" + window._$PKID + "&product=" + window._$PRODUCT;
                e = window.REGPROTOCOL + e;
                t = l({ src: e }) }
            if (!o) a.push(m);
            else _(t.contentWindow, { data: m }) } }();
    var f = function() {
        return function(e, i) {
            var n = MpUtil.uniqueId();
            h[n] = i;
            var r = { key: n, cookieKey: e };
            _(t.contentWindow, { data: r }) } }();
    return { request: d, getCookie: f }
}();
var MpRequest2 = function() {
    var t;
    var e = "dl.reg.163.com/src/mp-agent-finger.html?WEBZJVersion=1488532676052";
    var i = "MP2-DATA:";
    var n = "MP2-COOKIE:";
    var r = "MP2_AGENT_READY";
    var s = !1;
    var o = !1;
    var a = [];
    var _;
    var c = {};
    var h = {};
    var u, l, d, f, m, p, g, v, y;
    var b;
    var $ = function() { s = !0;
        p = function(e) {
            var s = e.data,
                u;
            if (s !== r) {
                if ("object" == typeof s) s = JSON.stringify(s);
                if (0 !== s.indexOf(n)) {
                    if (0 === s.indexOf(i)) { s = JSON.parse(s.replace(i, ""));
                        u = c[s.key];
                        delete c[s.key];
                        if (0 !== ("" + s.status).indexOf("2")) {
                            var l = { ret: "" + s.status };
                            u && u.error(l) } else { s.result = JSON.parse(decodeURIComponent(s.result || "{}"));
                            s.result.time = s.time;
                            u && u.success(s.result) } } } else { s = JSON.parse(s.replace(n, ""));
                    u = h[s.key];
                    delete h[s.key];
                    u(s.cookieValue) } } else { o = !0;
                var f = (new Date).getTime() - b;
                var m = window._$needUrsBgp && window._$BGP ? "BGP" : "非BGP";
                if (_gaq) _gaq.push(["_trackEvent", "代理文件" + window._$PKID, "加载成功", "耗时【" + f + "】渠道" + m]);
                for (var p = 0, g = a.length; p < g; p++) _(t.contentWindow, { data: a[p] });
                clearTimeout(d) } };
        if (!window.postMessage) {
            var e = "MSGLOGIN|",
                u = [];
            var l = function() {
                var t = function(t) {
                    var e = {},
                        i = t.split("|");
                    for (var n = 0, r = i.length, s; n < r; n++) { s = i[n].split("=");
                        e[decodeURIComponent(s.shift())] = decodeURIComponent(s.join("=")) }
                    return e };
                return function() {
                    var i = unescape(window.name || "");
                    if (i && 0 == i.indexOf(e)) { window.name = "";
                        i = i.replace(e, "");
                        var n = t(i),
                            r = (n.origin || "").toLowerCase();
                        if (!r || "*" == r || 0 == location.href.toLowerCase().indexOf(r)) p({ data: JSON.parse(n.data || "null"), origin: document.referrer }) } } }();
            var g = function() {
                var t;
                var e = function(t, e) {
                    for (var i = 0, n = t.length; i < n; i++)
                        if (t[i] == e) return !0;
                    return !1 };
                return function() {
                    if (u.length) { t = [];
                        for (var i = u.length - 1, n; i >= 0; i--) { n = u[i];
                            if (!e(t, n.w)) { t.push(n.w);
                                u.splice(i, 1);
                                n.w.name = n.d } }
                        t = null } } }();
            _ = function() {
                var t = function(t) {
                    var e = [];
                    for (var i in t) e.push(encodeURIComponent(i) + "=" + encodeURIComponent(t[i]));
                    return e.join("|") };
                var i = function(i) {
                    var n = {};
                    i = i || {};
                    n.origin = i.origin || "*";
                    n.ref = location.href;
                    n.data = JSON.stringify(i.data);
                    return e + t(n) };
                return function(t, e) { u.unshift({ w: t, d: escape(i(e)) }) } }();
            f = window.setInterval(g, 100);
            m = window.setInterval(l, 20) } else { _ = function(t, e) { e = e || {};
                t.postMessage(JSON.stringify(e.data), e.origin || "*") };
            MpUtil.addEvent(window, "message", p) } };
    var x = function() {
        return function(t) { t = t || {};
            var e;
            e = document.createElement("iframe");
            e.frameBorder = 0;
            e.style.position = "absolute";
            e.style.width = 0;
            e.style.height = 0;
            e.id = "id-" + MpUtil.uniqueId();
            document.body.appendChild(e);
            var i = t.src;
            window.setTimeout(function() { e.src = i }, 0);
            return e } }();
    var C = function(t) { f = window.clearInterval(f);
        m = window.clearInterval(m);
        MpUtil.clearEvent(window, "message", p);
        g = 1;
        $({ timeout: t.timeout }) };
    var M = function() {
        var i = function(t) {
            return t.replace("dl.reg.163.com", "dl2.reg.163.com").replace("passport.", "passport2.").replace("reg.icourse163.org", "reg2.icourse163.org") };
        var n = function(t) {
            var e = [];
            for (var i in t) e.push(encodeURIComponent(i) + "=" + encodeURIComponent(t[i]));
            return e.join("&") };
        return function(r) {
            var h;
            r = r || {};
            var f = MpUtil.uniqueId();
            if (!s) { u = f;
                d = setTimeout(function() { c[u].error({ ret: "-2" });
                    delete c[u] }, window._$bgpTime2);
                $({ timeout: r.timeout }) }
            if (window._$needUrsBgp && window._$BGP && !g) { d = window.clearTimeout(d);
                l = f;
                d = setTimeout(function() { c[l].error({ ret: "-2" });
                    delete c[l] }, window._$bgpTime2);
                C(r) }
            c[f] = { success: r.success, error: r.error };
            if (window._$needUrsBgp && window._$BGP && t && !v) {
                var m = t.contentWindow;
                if (t) { t.src = "about:blank";
                    try { m.document.write("");
                        m.document.clear() } catch (p) {} }
                document.body.removeChild(t);
                window.CollectGarbage && window.CollectGarbage();
                t = null;
                o = !1;
                v = 0;
                y = 1;
                for (var M = 0; M < a.length; M++) {
                    var E = a[M].url;
                    if (a[M].key != u) a[M].url = i(E);
                    else; }
                for (var j = 0; j < a.length; j++)
                    if (a[j].key == u) { a.shift();
                        break } } else if (r.url.indexOf("/ini") >= 0) a = [];
            if ("get" === r.type.toLowerCase()) {
                var w = r.url;
                var Z = w.indexOf("?") < 0 ? "?" : "&";
                r.data.nocache = f;
                var T = n(r.data);
                if (T) w += Z + T;
                r.url = w }
            var S = {};
            S.key = f;
            S.data = "get" === r.type.toLowerCase() ? null : r.data;
            S.headers = {};
            S.headers["Content-Type"] = r.contentType || "application/x-www-form-urlencoded";
            if ("application/x-www-form-urlencoded" == S.headers["Content-Type"]) { r.data = JSON.parse(r.data);
                S.data = n(r.data) }
            S.method = r.type;
            S.timeout = r.timeout || 1e4;
            S.url = r.url;
            if (!t) {
                if (window["$cookieDomain"])
                    if (window["$cookieDomain"].indexOf("icourse163.org") >= 0) e = e.replace("dl.reg.163.com", "reg." + window["$cookieDomain"] + "/dl");
                    else e = e.replace("dl.reg.163.com", "passport." + window["$cookieDomain"] + "/dl");
                e = e + "&pkid=" + window._$PKID + "&product=" + window._$PRODUCT;
                h = window.PROTOCOL + e;
                if (window._$needUrsBgp && window._$BGP) { v = 1;
                    h = i(h) }
                if (window._$pathB) h = h.replace(/:\/\/(?:[^\/]+)/, function(t) {
                    return t + "/b" });
                b = (new Date).getTime();
                t = x({ src: h }) }
            if (!o)
                if (y && a.length > 0) y = 0;
                else a.push(S);
            else _(t.contentWindow, { data: S }) } }();
    var E = function() {
        return function(e, i) {
            var n = MpUtil.uniqueId();
            h[n] = i;
            var r = { key: n, cookieKey: e };
            _(t.contentWindow, { data: r }) } }();
    return { request: M, getCookie: E, reset: C } }();
var MP = function() {
    var t = "zc.reg.163.com",
        e = "ntes_zc_",
        i = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5gsH+AA4XWONB5TDcUd+xCz7ejOFHZKlcZDx+pF1i7Gsvi1vjyJoQhRtRSn950x498VUkx7rUxg1/ScBVfrRxQOZ8xFBye3pjAzfb22+RCuYApSVpJ3OO3KsEuKExftz9oFBv3ejxPlYc5yq7YiBO8XlTnQN0Sa4R4qhPO3I2MQIDAQAB-----END PUBLIC KEY-----",
        n = "dl.reg.163.com";
    if (window._$needUrsBgp && window._$BGP) n = "dl2.reg.163.com";
    var r = function(t) {
        return t.replace("dl.reg.163.com", "dl2.reg.163.com").replace("passport.", "passport2.").replace("reg.icourse163.org", "reg2.icourse163.org") };
    var s = function(t) {
            if (window._$pathB) t = t.replace(/:\/\/(?:[^\/]+)/, function(t) {
                return t + "/b" });
            return t },
        o = function(e) {
            var i = e.data,
                n = (e.host ? e.host : t) + e.path;
            var o;
            if (window._$needUrsBgp && window._$BGP) n = r(n);
            if ("string" == typeof i) i = JSON.parse(i);
            o = i;
            delete i.isleak;
            delete o.isleak;
            a(i);
            if ("POST" == e.type) i = JSON.stringify(i);
            var _ = n.indexOf("zc.reg.163.com") == -1;
            if (_) _ = n.indexOf("/zc/") == -1;
            if (!_) n = window.REGPROTOCOL + n;
            else n = window.PROTOCOL + n;
            var c = 1e4;
            if (_) n = s(n);
            var h = _ ? { url: n, type: e.type, data: i, contentType: e.contentType || "application/json", dataType: e.dataType || "json", timeout: c, success: function(t) {
                    var i = t && t.ret;
                    if (201 != i) e.error(e.path, t);
                    else e.success(e.path, t) }, error: function() {
                    var t = Array.prototype.slice.call(arguments);
                    t.unshift(e.path);
                    e.error.apply(null, t) } } : { url: n, type: e.type, data: i, contentType: e.contentType || "application/json", dataType: e.dataType || "json", timeout: c, success: function(t) {
                    if (t && t.ret && ("102" === t.ret || "104" === t.ret || "200" === t.ret || "201" === t.ret || "202" === t.ret)) e.success(e.path, t);
                    else e.error(e.path, t) }, error: function() {
                    var t = Array.prototype.slice.call(arguments);
                    t.unshift(e.path);
                    e.error.apply(null, t) } };
            if (_) MpRequest2.request(h);
            else MpRequest.request(h) };
    var a = function(t) {
        try { t.topURL = window.top.location.href.split("?")[0] } catch (e) {
            return } };
    return {
        promarkIdData: {},
        TICKET: "",
        encrypt: function(t, e) {
            var n = RSA.getPublicKey(i);
            return RSA.encrypt(t + "`" + e, n) },
        encrypt2: function(t) {
            var e = RSA.getPublicKey(i);
            return RSA.encrypt(t, e) },
        getId: function(t, i) { MpRequest.getCookie(e + t, i) },
        regvftcp: function(t, e, i, n) {
            o({
                path: "/vftcp",
                type: "GET",
                data: t,
                success: e,
                error: i,
                host: n
            })
        },
        regvfccp: function(t, e, i, n) { o({ path: "/vfccp", type: "GET", data: t, success: e, error: i, host: n }) },
        init: function(t, e, i, n) { o({ path: "/ini", type: "GET", data: t, success: e, error: i, host: n }) },
        getCaptcha: function(e) {
            if (!e) return "";
            var i = t,
                n = window["$regCookieDomain"];
            if (n)
                if (n.indexOf("icourse163.org") >= 0) i = "reg." + n + "/zc";
                else i = "passport." + n + "/zc";
            var r = window.REGPROTOCOL + i + "/cp?channel=2&id=" + e + "&nocache=" + window.MpUtil.uniqueId();
            return r },
        checkCaptcha: function(t, e, i, n) { o({ path: "/vfcp", type: "POST", contentType: "application/x-www-form-urlencoded", data: t, success: e, error: i, host: n }) },
        initQrcode: function(t, e, i) { o({ host: "reg.163.com", path: "/services/getqrcodeid", type: "GET", data: t, success: e, error: i }) },
        checkName: function(t, e, i, n) { o({ path: "/chn", type: "GET", data: t, success: e, error: i, host: n }) },
        getMobileSms: function(t, e, i, n) { o({ path: "/sm", type: "GET", data: t, success: e, error: i, host: n }) },
        getMailSms: function(t, e, i, n) { o({ path: "/mlrgsm", type: "GET", data: t, success: e, error: i, host: n }) },
        getTicket: function(t, e, i, n) { o({ path: "/gt", type: "POST", contentType: "application/json", data: JSON.stringify(t), success: e, error: i, host: n }) },
        setTicket: function(t) { MP.TICKET = t || "" },
        regMob: function(t, e, i, n) { o({ path: "/mrg", type: "POST", contentType: "application/json", data: JSON.stringify(t), success: e, error: i, host: n }) },
        fastReg: function(t, e, i, n) { o({ path: "/frg", type: "POST", contentType: "application/json", data: JSON.stringify(t), success: e, error: i, host: n }) },
        sendActMail: function(t, e, i, n) { o({ path: "/sendActMail", type: "GET", data: t, success: e, error: i, host: n }) },
        qrlogin: function(t, e, i, n) { o({ path: "/qrcodel", type: "GET", data: t, success: e, error: i, host: n }) },
        getCaptchaLogin: function(t, e, i) {
            var o = n;
            if (i)
                if (i.indexOf("icourse163.org") >= 0) o = "reg." + i + "/dl";
                else o = "passport." + i + "/dl";
            if (window._$needUrsBgp && window._$BGP) o = r(o);
            var a = window.PROTOCOL + o + "/cp?pd=" + t + "&pkid=" + e + "&random=" + window.MpUtil.uniqueId();
            a = s(a);
            return a },
        safelogin: function(t, e, i, n) { o({ path: "/l", type: "POST", data: t, success: e, error: i, host: n }) },
        llp: function(t, e, i, n) { o({ path: "/llp", type: "POST", contentType: "application/x-www-form-urlencoded", data: t, success: e, error: i, host: n }) },
        sendSmsLogin: function(t, e, i, n) { o({ path: "/sm", type: "GET", data: t, success: e, error: i, host: n }) },
        initComponentLogin: function(t, e, i, n) { o({ path: "/ini", type: "GET", data: t, success: e, error: i, host: n }) },
        checkSmsCode: function(t, e, i, n) { o({ path: "/vfcp", type: "POST", contentType: "application/x-www-form-urlencoded", data: t, success: e, error: i, host: n }) },
        vfsms: function(t, e, i, n) { o({ path: "/vfsms", type: "POST", contentType: "application/x-www-form-urlencoded", data: t, success: e, error: i, host: n }) },
        getLoginTicket: function(t, e, i, n) { o({ path: "/gt", type: "GET", data: t, success: e, error: i, host: n }) },
        vftcp: function(t, e, i, n) { o({ path: "/vftcp", type: "GET", data: t, success: e, error: i, host: n }) },
        vfccp: function(t, e, i, n) { o({ path: "/vfccp", type: "GET", data: t, success: e, error: i, host: n }) },
        goonlog: function(t, e, i, n) { o({ path: "/go", type: "GET", data: t, success: e, error: i, host: n }) },
        "mb-login": function(t, e, i, n) { o({ path: "/lpwd", type: "POST", data: t, success: e, error: i, host: n }) },
        "mb-gt": function(t, e, i, n) { o({ path: "/gt", type: "GET", data: t, success: e, error: i, host: n }) },
        "mb-ini": function(t, e, i, n) { o({ path: "/ini", type: "GET", data: t, success: e, error: i, host: n }) },
        "mb-vfcp": function(t, e, i, n) { o({ path: "/vfcp", type: "POST", contentType: "application/x-www-form-urlencoded", data: t, success: e, error: i, host: n }) },
        "mb-cp": function(t, e, i) {
            var o = n;
            if (i)
                if (i.indexOf("icourse163.org") >= 0) o = "reg." + i + "/dl";
                else o = "passport." + i + "/dl";
            if (window._$needUrsBgp && window._$BGP) o = r(o);
            var a = window.PROTOCOL + o + "/yd/cp?pd=" + t + "&pkid=" + e + "&random=" + window.MpUtil.uniqueId();
            a = s(a);
            return a },
        "mb-lvfsms": function(t, e, i, n) { o({ path: "/lvfsms", type: "POST", data: t, success: e, error: i, host: n }) },
        "mb-vftcp": function(t, e, i, n) { o({ path: "/vftcp", type: "GET", data: t, success: e, error: i, host: n }) },
        "mb-vfccp": function(t, e, i, n) { o({ path: "/vfccp", type: "GET", data: t, success: e, error: i, host: n }) },
        "mb-sms-lsm": function(t, e, i, n) { o({ path: "/lsm", type: "GET", data: t, success: e, error: i, host: n }) },
        "mb-reg-ini": function(t, e, i, n) { o({ path: "/ini", type: "GET", data: t, success: e, error: i, host: n }) },
        "mb-reg-chn": function(t, e, i, n) { o({ path: "/chn", type: "GET", data: t, success: e, error: i, host: n }) },
        "mb-reg-cp": function(e) {
            var i = window["$regCookieDomain"];
            var n = t;
            if (i)
                if (i.indexOf("icourse163.org") >= 0) n = "reg." + i + "/zc";
                else n = "passport." + i + "/zc";
            var r = window.REGPROTOCOL + n + "/yd/cp?channel=2&id=" + e + "&nocache=" + window.MpUtil.uniqueId();
            return r },
        "mb-reg-sm": function(t, e, i, n) { o({ path: "/sm", type: "GET", data: t, success: e, error: i, host: n }) },
        "mb-reg-vfsms": function(t, e, i, n) { o({ path: "/vfsms", type: "POST", data: t, success: e, error: i, host: n }) }
    }
}();
"object" != typeof JSON && (JSON = {}),
    function() { "use strict";

        function f(t) {
            return 10 > t ? "0" + t : t }

        function this_value() {
            return this.valueOf() }

        function quote(t) {
            return rx_escapable.lastIndex = 0, rx_escapable.test(t) ? '"' + t.replace(rx_escapable, function(t) {
                var e = meta[t];
                return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + t + '"' }

        function str(t, e) {
            var i, n, r, s, o, a = gap,
                _ = e[t];
            switch (_ && "object" == typeof _ && "function" == typeof _.toJSON && (_ = _.toJSON(t)), "function" == typeof rep && (_ = rep.call(e, t, _)), typeof _) {
                case "string":
                    return quote(_);
                case "number":
                    return isFinite(_) ? String(_) : "null";
                case "boolean":
                case "null":
                    return String(_);
                case "object":
                    if (!_) return "null";
                    if (gap += indent, o = [], "[object Array]" === Object.prototype.toString.apply(_)) {
                        for (s = _.length, i = 0; s > i; i += 1) o[i] = str(i, _) || "null";
                        return r = 0 === o.length ? "[]" : gap ? "[\n" + gap + o.join(",\n" + gap) + "\n" + a + "]" : "[" + o.join(",") + "]", gap = a, r }
                    if (rep && "object" == typeof rep)
                        for (s = rep.length, i = 0; s > i; i += 1) "string" == typeof rep[i] && (n = rep[i], r = str(n, _), r && o.push(quote(n) + (gap ? ": " : ":") + r));
                    else
                        for (n in _) Object.prototype.hasOwnProperty.call(_, n) && (r = str(n, _), r && o.push(quote(n) + (gap ? ": " : ":") + r));
                    return r = 0 === o.length ? "{}" : gap ? "{\n" + gap + o.join(",\n" + gap) + "\n" + a + "}" : "{" + o.join(",") + "}", gap = a, r } }
        var rx_one = /^[\],:{}\s]*$/,
            rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            rx_four = /(?:^|:|,)(?:\s*\[)+/g,
            rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value);
        var gap, indent, meta, rep; "function" != typeof JSON.stringify && (meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, JSON.stringify = function(t, e, i) {
            var n;
            if (gap = "", indent = "", "number" == typeof i)
                for (n = 0; i > n; n += 1) indent += " ";
            else "string" == typeof i && (indent = i);
            if (rep = e, e && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify");
            return str("", { "": t }) }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
            function walk(t, e) {
                var i, n, r = t[e];
                if (r && "object" == typeof r)
                    for (i in r) Object.prototype.hasOwnProperty.call(r, i) && (n = walk(r, i), void 0 !== n ? r[i] = n : delete r[i]);
                return reviver.call(t, e, r) }
            var j;
            if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function(t) {
                    return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({ "": j }, "") : j;
            throw new SyntaxError("JSON.parse") }) }();
! function() {
    function t() {
        var t = "Mb5yjx1Z46gQo3Pd".split("");
        this.d = function(e) {
            if (null == e || void 0 == e) return e;
            if (0 != e.length % 2) throw Error("1100");
            for (var i = [], n = 0; n < e.length; n++) { 0 == n % 2 && i.push("%");
                for (var r = t, s = 0; s < r.length; s++)
                    if (e.charAt(n) == r[s]) { i.push(s.toString(16));
                        break } }
            return decodeURIComponent(i.join("")) } }
    var e = (new t).d,
        i = (new t).d,
        n = (new t).d,
        r = (new t).d,
        s = (new t).d;
    ! function() {
        function t(t, e) {
            if (null == t) return null;
            for (var i = v(e), n = [], r = t.length, s = 0; s < r; s++) n.push(g(t[s], i++));
            return n }

        function o(t) {
            if (null == t) return null;
            for (var e = [], i = 0, n = t.length; i < n; i++) {
                var r = t[i];
                e[i] = Y[16 * (r >>> 4 & 15) + (15 & r)] }
            return e }

        function a(t) {
            var i = [];
            if (null == t || void 0 == t || 0 == t.length) return h();
            if (64 <= t.length) { i = [];
                if (null != t && 0 != t.length) {
                    if (64 > t.length) throw Error(e("ybyMyMyy"));
                    for (var n = 0; 64 > n; n++) i[n] = t[0 + n] }
                return i }
            for (n = 0; 64 > n; n++) i[n] = t[n % t.length];
            return i }

        function _(t) {
            var e = 4294967295;
            if (null != t)
                for (var i = 0; i < t.length; i++) e = e >>> 8 ^ W[255 & (e ^ t[i])];
            t = l(4294967295 ^ e);
            e = t.length;
            if (null == t || 0 > e) t = new String(n(""));
            else {
                for (var i = [], s = 0; s < e; s++) i.push(m(t[s]));
                t = i.join(r("")) }
            return t }

        function c(t, o, a) {
            var _, c = [n("Zx"), n("xj"), e("Z1"), i("y4"), n("1j"), i("1d"), s("x6"), r("j6"), r("jb"), e("xx"), n("ZZ"), n("13"), e("jd"), s("j3"), r("Zj"), r("yy"), i("Z6"), e("11"), i("Zb"), r("y1"), r("jo"), r("14"), e("5d"), i("yM"), i("Z4"), i("Zg"), i("1b"), e("y5"), n("15"), r("jg"), s("x5"), r("16"), e("xg"), n("jP"), i("jj"), s("1y"), e("ZM"), s("xo"), s("xZ"), n("1x"), i("1g"), s("xb"), r("j1"), i("yZ"), s("1o"), s("xM"), e("jZ"), i("yb"), n("jy"), s("1Z"), r("j5"), s("xy"), e("j4"), r("jQ"), s("5Q"), s("y6"), r("yj"), i("yx"), s("x1"), s("1P"), e("Z5"), i("x4"), r("jx"), n("1Q")],
                h = i("Zy"),
                u = [];
            if (1 == a) a = t[o], _ = 0, u.push(c[a >>> 2 & 63]), u.push(c[(a << 4 & 48) + (_ >>> 4 & 15)]), u.push(h), u.push(h);
            else if (2 == a) a = t[o], _ = t[o + 1], t = 0, u.push(c[a >>> 2 & 63]), u.push(c[(a << 4 & 48) + (_ >>> 4 & 15)]), u.push(c[(_ << 2 & 60) + (t >>> 6 & 3)]), u.push(h);
            else if (3 == a) a = t[o], _ = t[o + 1], t = t[o + 2], u.push(c[a >>> 2 & 63]), u.push(c[(a << 4 & 48) + (_ >>> 4 & 15)]), u.push(c[(_ << 2 & 60) + (t >>> 6 & 3)]), u.push(c[63 & t]);
            else throw Error(n("ybyMybyM"));
            return u.join(e("")) }

        function h() {
            for (var t = [], e = 0; 64 > e; e++) t[e] = 0;
            return t }

        function u(t, e, i, s) {
            if (null != t && 0 != t.length) {
                if (null == e) throw Error(n("ybyMyMyj"));
                if (t.length < s) throw Error(r("ybyMyMyy"));
                for (var o = 0; o < s; o++) e[i + o] = t[0 + o] } }

        function l(t) {
            var e = [];
            e[0] = t >>> 24 & 255;
            e[1] = t >>> 16 & 255;
            e[2] = t >>> 8 & 255;
            e[3] = 255 & t;
            return e
        }

        function d(t) {
            if (null == t || void 0 == t) return t;
            t = encodeURIComponent(t);
            for (var e = [], n = t.length, r = 0; r < n; r++)
                if (t.charAt(r) == s("5x"))
                    if (r + 2 < n) e.push(f(t.charAt(++r) + i("") + t.charAt(++r))[0]);
                    else throw Error(i("ybyMyMy6"));
            else e.push(t.charCodeAt(r));
            return e }

        function f(t) {
            if (null == t || 0 == t.length) return [];
            t = new String(t);
            for (var e = [], i = t.length / 2, n = 0, r = 0; r < i; r++) {
                var s = parseInt(t.charAt(n++), 16) << 4,
                    o = parseInt(t.charAt(n++), 16);
                e[r] = v(s + o) }
            return e }

        function m(t) {
            var e = [];
            e.push(X[t >>> 4 & 15]);
            e.push(X[15 & t]);
            return e.join(s("")) }

        function p(t, e) {
            if (null == t || null == e || t.length != e.length) return t;
            for (var i = [], n = 0, r = t.length; n < r; n++) {
                var s = n,
                    o;
                o = t[n];
                var a = e[n];
                o = v(o);
                a = v(a);
                o = v(o ^ a);
                i[s] = o }
            return i }

        function g(t, e) {
            return v(t + e) }

        function v(t) {
            if (-128 > t) return v(128 - (-128 - t));
            if (-128 <= t && 127 >= t) return t;
            if (127 < t) return v(-129 + t - 127);
            throw Error(n("ybyMyMyb")) }

        function y(t) {
            function o() {
                for (var t = [i("jb151b1j165Mj3xj5Mjy1d1P1j1x1PZy1x1j5Mjo161Z14Zj"), s("jb1j1d151x5Mj11b1P1ZZy1d1P1Z5MxyZj1j"), r("jb1j1d151x5Mj41x15Z51xZZ"), s("jb1j1d151x5Mj3161P1Z5MxyZj1j"), n("jb1Z1x1P1yZ65Mj1j5"), e("jbZ51b15"), s("jbZ51b15161y5MxjZ6ZM1xZy1xZjZj161P1Z"), n("jbZ5161b1o5Mj51o1b1y1Q"), n("j51bZj1b1P1Z"), r("j51bZx141bZxZy5My6yy"), e("j51x1o1o5Mj3xj"), r("j516ZjZyZjZ51x1b135Mx11xZ51b5Mxy1xZ51611"), r("j51d1j1d1P165Mj3xj"), n("j51d1d1Q131b1P5Mjd1o1j5MxyZjZ61o1x"), r("j5Z51b1Z1Z1b1j1d1y161d"), i("j5Z51d1b1jZZ1bZ6"), n("jy1b1o1615Z516"), e("jy1b1o16111dZ51P161b1P5Mj1j5"), s("jy1bZyZj1x1o1o1bZ5"), r("jy1bZyZx1b1o"), e("jy1x1PZj1bZxZ5"), s("jy1x1PZjZxZ5Z65MjZ1dZj14161y"), s("jy141b1o1Q1jZxZyZj1xZ5"), i("jy1d1o1d1P1P1b5Mj3xj"), e("jy1dZMZM1xZ5ZM1o1bZj1x5MjZ1dZj14161y5Mjo161Z14Zj"), e("jj1x1g1bx1Zx5MjojZjy5Mxy1b1PZy5Mj31d1P1d"), s("jj1xZy1j1x131d1P1b"), e("jjj1jQ1b1653xyj5"), i("jj1dZjZx13"), n("jx1P1ZZ51bZ11xZ5Zy5Mj3xj"), r("jxZ51bZy5Mj51d1o1j5Mj6xjjy"), i("jxZxZ51dZyZj161o1x"), e("j11b1P1Zxy1d1P1Z"), s("j11dZ5Zj1x"), s("j1Z51b1P1Q1o161P5MjZ1dZj14161y5Mj41x1bZ1Z6"), e("j1Z51x1P1y145Mxy1yZ516ZMZj5Mj3xj"), e("jZ1b15Z5161d1o1b"), n("jZ161Z16"), s("jZ16Zy141b"), e("jZ1dZx1jZ65Mjd1o1j5MxyZjZ61o1x"), s("jZZx1o1613"), i("jZZx1P1Zxy1x1d"), i("j41b1xZjZj1x1PZy1y14ZZ1x161o1xZ5"), s("j41bZ5Z5161P1ZZj1d1P"), e("j416Z51b1Z161P1d5Mxy1b1PZy5MjZj5"), r("j613ZM1b1yZj"), e("j61P111dZ5131b1o5Mx51d131b1P"), i("jQ1b1yZyZjjd1P1x"), i("jQ161P1d5Mj3xj"), r("jQ1dZgZx1Q1b5MjZ1dZj14161y5MxMZ5y1jP"), e("jo1d1416Zj5MjZZx1g1bZ51bZj16"), i("jo1d131b"), n("joZx1y161j1b5Mj5Z5161Z14Zj"), e("joZx1y161j1b5Mj11bZ4"), i("j31b1Z1P1xZj1d"), r("j31b1o1ZZx1P5MjZ1dZj14161y"), r("j31bZjZxZ51b5Mj3xj5Mxy1yZ516ZMZj5Mjy1bZM16Zj1b1oZy"), s("j31x1P1o1d"), s("j3161P1Zjo16xx53jxZ4Zjj5"), e("j31d1d1oj51dZ51b1P"), i("j3xy5MxMj3161P1y141d"), i("j3xy5Mx51x111xZ51x1P1y1x5Mxy1b1PZy5Mxy1xZ51611"), r("jP1xZZZy5MjZ1dZj14161y5Mj3xj"), r("jP161b1Z1bZ51b5Mxy1d1o161j"), n("jPZ61b1o1b"), n("xM1b1o1b1y1x5Mxy1yZ516ZMZj5Mj3xj"), r("xM1bZMZ6Z5ZxZy"), s("xM1xZ5ZM1xZjZx1b"), n("xM1o1bZ615161o1o"), s("xMj3161P1Zjo16xx"), n("x51b1y141b1P1b"), i("x51d1y1QZZ1x1o1o"), r("xy1bZZ1bZy1j1x1x"), i("xy1yZ516ZMZj5Mj3xj5Mj51d1o1j"), e("xy1x1Z1d1x5MxMZ5161PZj"), n("xy141dZZ1y1bZ51j5MjZ1dZj14161y"), e("xy1613j41x16"), i("xy1P1bZM5Mj6xjjy"), e("xj1oZZ1Zj31d1P1d"), i("xjZZ5Mjy1x1P5Mj3xj5Mjy1d1P1j1x1PZy1x1j5MjxZ4ZjZ51b5Mj51d1o1j"), i("xx15Zx1PZjZx"), s("xx13ZMZxZy14"), i("xx1P16Z11xZ5Zy"), n("xxZj1dZM161b"), n("x11o1b1j161316Z55Mxy1yZ516ZMZj"), n("xZ161j1x5Mjo1bZj161P"), e("PjQQQdPxgP4Q"), n("Px434PP1614ZPjQ4g3PxgP4Q"), e("Px434PP1614ZPjQQQdPxgP4Q"), i("Px434PP1614ZPxgP4QPjQ36y"), s("Px434PP1614ZPxQ3g6PjQg6b"), s("Px434PP1614ZP161QMP6g34d"), r("Px434PP1614ZP1gxQZPjQ36y"), s("Px434PP1614ZPZ6MgxPZ4d4M"), i("Px434PP1614ZPZQQ41P6QQ6b"), e("Px434PP1614ZP4gb4oP1gxQZ"), i("Px434PP1614ZP66gQ1PjQ6g1"), e("PxgP4QPjQ36y"), s("PxQ6QoPx6o41"), n("PxQPgPP4Q3gdP66Q4xP6QQ6b"), r("P161QMPxgP4QPjQ36y"), n("P161Q6P1g3gyPxgZ6gPjQ36y"), r("P161Q6P1g3gyP44465PjQ36y"), r("P1gxQZPjQ36y"), s("P66gQ1PjQ6g1"), s("P6QQ6bPjQ36y"), s("P161QMPZQQ41P1644PPjQ36y"), e("PZQQ41P1644PPjQ36y"), e("P1gM4ZP1gxQZPjQ36y"), i("PjQQQdPxgP4QxdjZj5y5yyyby5"), e("P1gxQZPjQ36yxdjZj5y5yyyby5"), r("PxQPgPP4Q3gdP1g3gyP6QQ6bPjQ36y"), s("Px434PP1614ZP6QQ6bPjQ36y"), r("PjQ4Q3P6QQ6b5MxMZ51d"), i("PjQ4Q3PxgP4Q5MxMZ51d"), s("P44QQ6P16P6oPjQ4Q3PjQ4g3P6QQ6b"), s("P44QQ6P16P6oPjQ4Q3PZQQ41PxgP4Q")], o = [], _ = 0; _ < t.length; _++) try {
                    var c = t[_];
                    a()(c) && o.push(c) } catch (h) { n("111d1PZj5M1j1xZj1x1yZj5M1xZ5Z51dZ5") }
                return o.join(r("yQ")) }

            function a() {
                function t(t) {
                    var e = {};
                    return h.style.fontFamily = t, c.appendChild(h), e.height = h.offsetHeight, e.width = h.offsetWidth, c.removeChild(h), e }
                var n = [r("131d1P1dZyZM1b1y1x"), r("Zy1b1PZy53Zy1xZ51611"), s("Zy1xZ51611")],
                    o = [],
                    a = e("ZZZZZZ131313131313131313131o1o16"),
                    _ = i("yZy5ZMZ4"),
                    c = J.body,
                    h = J.createElement(r("ZyZM1b1P"));
                h.style.fontSize = _;
                h.style.visibility = s("14161j1j1x1P");
                h.innerHTML = a;
                for (a = 0; a < n.length; a++) o[a] = t(n[a]);
                return function(i) {
                    for (var r = 0; r < o.length; r++) {
                        var s = t(i + e("5o") + n[r]),
                            a = o[r];
                        if (s.height !== a.height || s.width !== a.width) return !0 }
                    return !1 } }

            function _() {
                var t = null,
                    r = null,
                    o = [];
                try { r = J.createElement(e("1y1b1PZ11bZy")), t = r[s("1Z1xZjjy1d1PZj1xZ4Zj")](i("ZZ1x151Z1o")) || r[i("1Z1xZjjy1d1PZj1xZ4Zj")](n("1xZ4ZM1xZ516131x1PZj1b1o53ZZ1x151Z1o")) } catch (a) {}
                if (!t) return o;
                try { o.push(t.getSupportedExtensions()) } catch (_) {}
                try { o.push(c(t, r)) } catch (h) {}
                return o.join(e("yQ")) }

            function c(t, e) {
                try {
                    var n = r("1bZjZjZ51615ZxZj1x5MZ11x1yy55M1bZjZjZ5x11xZ5Zj1xZ4yQ5MZ11bZ5Z6161P1Z5MZ11x1yy55MZ11bZ5Z6161Pxj1xZ4jy1d1dZ51j161P1bZj1xyQ5MZx1P16111dZ5135MZ11x1yy55MZx1P16111dZ513jd1111Zy1xZjyQ5MZ11d161j5M131b161P54565MZQ5M5M5MZ11bZ5Z6161Pxj1xZ4jy1d1dZ51j161P1bZj1x5My35M1bZjZjZ5x11xZ5Zj1xZ45M5Q5MZx1P16111dZ513jd1111Zy1xZjyQ5M5M5M1Z1oxdxM1dZy16Zj161d1P5My35MZ11x1yyj541bZjZjZ5x11xZ5Zj1xZ45o5MyM5o5Myb56yQ5MZ3"),
                        o = i("ZMZ51x1y16Zy161d1P5M131x1j16Zx13ZM5M111o1d1bZjyQ5MZ11bZ5Z6161P1Z5MZ11x1yy55MZ11bZ5Z6161Pxj1xZ4jy1d1dZ51j161P1bZj1xyQ5MZ11d161j5M131b161P54565MZQ5M5M5M1Z1oxdj1Z51b1Zjy1d1o1dZ55My35MZ11x1yyj54Z11bZ5Z6161Pxj1xZ4jy1d1dZ51j161P1bZj1x5o5MyM5o5Myb56yQ5MZ3"),
                        a = t.createBuffer();
                    t.bindBuffer(t.ARRAY_BUFFER, a);
                    var _ = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
                    t.bufferData(t.ARRAY_BUFFER, _, t.STATIC_DRAW);
                    a.k = 3;
                    a.l = 3;
                    var c = t.createProgram(),
                        h = t.createShader(t.VERTEX_SHADER);
                    t.shaderSource(h, n);
                    t.compileShader(h);
                    var u = t.createShader(t.FRAGMENT_SHADER);
                    return t.shaderSource(u, o), t.compileShader(u), t.attachShader(c, h), t.attachShader(c, u), t.linkProgram(c), t.useProgram(c), c.n = t.getAttribLocation(c, s("1bZjZjZ5x11xZ5Zj1xZ4")), c.m = t.getUniformLocation(c, r("Zx1P16111dZ513jd1111Zy1xZj")), t.enableVertexAttribArray(c.o), t.vertexAttribPointer(c.n, a.k, t.FLOAT, !1, 0, 0), t.uniform2f(c.m, 1, 1), t.drawArrays(t.TRIANGLE_STRIP, 0, a.l), b(e[i("Zj1djj1bZj1bxxx5jo")]()) } catch (l) {
                    return r("ZZ1x151Z1o5M1xZ41y1xZMZj161d1P") } }

            function h() {
                var t = J.createElement(n("1j16Z1")),
                    o = [],
                    a = [n("jb1yZj16Z11xj51dZ51j1xZ5"), r("jb1yZj16Z11xjy1bZMZj161d1P"), n("jbZMZMxZ1dZ51QZyZM1b1y1x"), e("j51b1y1Q1ZZ51dZx1P1j"), e("j5ZxZjZj1d1Pj11b1y1x"), e("j5ZxZjZj1d1Pj4161Z141o161Z14Zj"), e("j5ZxZjZj1d1Pxy141b1j1dZZ"), s("j5ZxZjZj1d1Pxj1xZ4Zj"), n("jy1bZMZj161d1Pxj1xZ4Zj"), r("jZZ51bZ6xj1xZ4Zj"), s("j4161Z141o161Z14Zj"), i("j4161Z141o161Z14Zjxj1xZ4Zj"), r("j61P1b1yZj16Z11xj51dZ51j1xZ5"), e("j61P1b1yZj16Z11xjy1bZMZj161d1P"), s("j61P1b1yZj16Z11xjy1bZMZj161d1Pxj1xZ4Zj"), i("j61P111dj51b1y1Q1ZZ51dZx1P1j"), e("j61P111dxj1xZ4Zj"), n("j31x1PZx"), e("j31x1PZxxj1xZ4Zj"), s("xy1yZ51d1o1o151bZ5"), i("xj14Z51x1xjjjj1bZ51Qxy141b1j1dZZ"), e("xj14Z51x1xjjj11b1y1x"), e("xj14Z51x1xjjj4161Z141o161Z14Zj"), e("xj14Z51x1xjjjo161Z14Zjxy141b1j1dZZ"), s("xj14Z51x1xjjxy141b1j1dZZ"), s("xZ161P1j1dZZ"), e("xZ161P1j1dZZj1Z51b131x"), i("xZ161P1j1dZZxj1xZ4Zj")];
                if (!window[r("1Z1xZjjy1d13ZMZxZj1x1jxyZjZ61o1x")]) return o.join(n(""));
                for (var _ = 0; _ < a.length; _++) try { J.body.appendChild(t), t.style.color = a[_], o.push(a[_]), o.push(window[i("1Z1xZjjy1d13ZMZxZj1x1jxyZjZ61o1x")](t).getPropertyValue(r("1y1d1o1dZ5"))), J.body.removeChild(t) } catch (c) { o.push(i("1Z1xZj5MZyZ6ZyZj1x135M1y1d1o1dZ5Zy5M1xZ41y1xZMZj161d1P")) }
                return o.join(s("yg")) }

            function u() {
                try {
                    var t = J.createElement(s("1y1b1PZ11bZy")),
                        e = t[n("1Z1xZjjy1d1PZj1xZ4Zj")](n("y51j")),
                        i = s("13ZZjy5M1P1Q151b111g1dZ51j5MZM14Zy1Z1oZ65M1xZ4Z1Zj5MZgZb16Zx5o5MPbQ3gM5MZjZM14ZyZj5dyg5dZx14151ZZj161y5P131d5d1o1xZ1Z11b");
                    e.textBaseline = s("Zj1dZM");
                    e.font = r("yZyMZMZ45M5ZjbZ5161b1o5Z");
                    e.textBaseline = r("1b1oZM141b151xZj161y");
                    e.fillStyle = r("5y11y1yM");
                    e.fillRect(125, 1, 62, 20);
                    e.fillStyle = s("5yyMy1y6");
                    e.fillText(i, 2, 15);
                    e.fillStyle = r("Z51Z151b54ybyMy55o5My5yMyj5o5MyM5o5MyM5PyZ56");
                    e.fillText(i, 4, 17);
                    return t[s("Zj1djj1bZj1bxxx5jo")]() } catch (o) {
                    return s("1y1b1PZ11bZy5M1bZM165M1xZ41y1xZMZj161d1P") } }

            function l() {
                try {
                    return window[n("jb1yZj16Z11xx4jd151g1x1yZj")] && x.h ? f() : d() } catch (t) {
                    return s("1Z1xZj5MZM1oZx1Z161P5MZyZjZ5161P1Z5M1xZ41y1xZMZj161d1P") } }

            function d() {
                if (!V[r("ZM1oZx1Z161PZy")]) return r("");
                var t = [e("yj1Z1b131x"), n("jb1j151o1d1y1QxM1oZx1Z161P"), e("jb1j1d151xjxZ4j31b1Pjyjyjj1xZj1x1yZj"), r("jb1j1d151xjxZ4j31b1Pjj1xZj1x1yZj"), i("jb1o1bZZ1bZ55MjPxMjbxMj65MZxZj161oZy"), n("jb1o161x1j16Zj5MxM1oZx1Z53j61P"), s("jb1o16ZM1bZ65Mxy1x1yZxZ516ZjZ65Mjy1d1PZjZ51d1o5Myy"), s("jb1o16xyxyjdjo1d1Z161P5MZM1oZx1Z161P"), i("jb131bZg1d1Pj3xMyyjj1dZZ1P1o1d1b1j1xZ5xM1oZx1Z161P"), e("jbjdjo5Mj31x1j161b5MxM1o1bZ6151b1y1Q5MxM1oZx1Z161P"), r("jbZMZMxxZM"), i("jbZ51y1416jyjbjj"), s("jbx1jZ5Mxy16Zj1xxy1b111xZjZ65MZM1oZx1Z161P"), r("j51b15Z61o1d1P5Mxj1d1d1oj51bZ5"), n("j51bZjZj1o1x1o1d1Z5MjZ1b131x5Mjo1bZx1P1y141xZ5"), e("j516Zjjy1d131xZjjb1Z1x1PZj"), e("j516Zj1j1x111x1P1j1xZ55MxbZx161y1Qxy1y1b1P"), i("j51oZx1xxyZj1b1y1QZy5Mj61PZyZj1b1o1o5Mjj1xZj1x1yZj1dZ5"), s("jy1bZj1b1o161P1bjZZ51dZxZM5MxxZM1j1bZj1x"), i("jy16ZjZ516Z45Mj6jyjb5Mjy1o161x1PZj"), r("jy16ZjZ516Z45M1d1P1o161P1x5MZM1oZx1Z53161P"), e("jy16ZjZ516Z45Mx51x1y1x16Z11xZ55MxM1oZx1Z53161P"), s("jy1d1dZZ1d1P5MxxZM1j1bZj1x"), i("jj1x1b1oxM1oZ6jo16Z11x5MxxZM1j1bZj1x"), e("jj1x111bZx1oZj5Mj5Z51dZZZy1xZ55Mj41x1oZM1xZ5"), e("jj16Z1x45Mj5Z51dZZZy1xZ55MxM1oZx1Z53j61P"), n("jj16Z1x45MxM1oZxZy5MxZ1x155MxM1o1bZ61xZ5"), r("jj16Z1x45Mx1jdjj5Mj41x1oZM1xZ55MxM1oZx1Z53161P"), n("1j1dZx151o1xxjZZ16ZyZj5MxZ1x155MxM1oZx1Z161P"), i("jj1dZZ1P1o1d1b1j1xZ5Zy5MZM1oZx1Z161P"), r("1j1dZZ1P1o1d1b1jxxZM1j1bZj1xZ5"), e("1xj3ZxZy161yxM1oZx1Z161P5Mjjjoj3y1"), s("jxxyjP5Mjo1bZx1P1y145Mj31dZg161o1o1b5MxM1oZx1Z161P"), i("jxxyjP5Mxy1d1P1bZ55MjbxMj6"), e("jxZ416115MjxZ11xZ5Z6ZZ141xZ51x"), n("j11b1y1x151d1d1Q5MxM1oZx1Z161P"), e("j1161o1x5Mjj1dZZ1P1o1d1b1j1xZ55MxM1oZx1Z53161P"), s("j1161o1xjo1b155MZM1oZx1Z161P"), n("j11oZ6jdZ5jj161x5MjZ1b131xZy5MxM1oZx1Z161P"), e("j11d1oZ45Myy5Mj5Z51dZZZy1xZ55MxM1oZx1Z161P"), r("j1xxxgjxxy141bZ51x"), s("jZjjjo5Mjd151g1x1yZj5MxZ1x155MxM1oZx1Z53161P5Myby15PyMyM"), s("jZj1jbjyjx5MxM1oZx1Z161P"), r("jZ161P1Z1xZ5"), e("jZ1P1d131x5Mxy141x1o1o5Mj61PZj1x1ZZ51bZj161d1P"), s("jZ1d1d1Z1o1x5Mjx1bZ5Zj145MxM1oZx1Z161P"), e("jZ1d1d1Z1o1x5Mjx1bZ5Zj145MxM1oZx1Z53161P"), n("jZ1d1d1Z1o1x5MjZ1x1bZ5Zy5MyM5Pyx5Pyyyy5PyM"), r("jZ1d1d1Z1o1x5Mxj1b1o1Q5Mjx11111x1yZjZy5MxM1oZx1Z161P"), s("jZ1d1d1Z1o1x5MxxZM1j1bZj1x"), n("j41bZ5131d1PZ65Mj116Z51x111dZ45MxM1oZx1Z161P"), n("j41bZ5131d1PZ65MxM1oZx1Z53j61P"), e("j41xZ51d1xZy5M515MjZ1x1P1xZ51b1oZy5M1o16Z11x"), i("j4xMjj1xZj1x1yZj"), n("j4Zj131oyx5M1o1d1y1bZj161d1P5MZMZ51dZ1161j1xZ5"), s("j6jx5Mxj1b155MZM1oZx1Z161P"), s("16jZ1xZjZj1xZ5xy1yZ516ZMZj1b151o1xxM1oZx1Z161P"), e("16j31xZy145MZM1oZx1Z161P"), s("jQ1bZyZM1xZ5Zy1QZ65MxM1bZyZyZZ1dZ51j5Mj31b1P1b1Z1xZ5"), s("jo1bZyZjxM1bZyZy"), n("jo1d1Zj31xj61P5MxM1oZx1Z161P5Myb5PyM5PyM5Py6yyyx"), e("jo1d1Zj31xj61P5MxM1oZx1Z161P5Myb5PyM5PyM5Py6y1yb"), r("j31b53jy1d1P11161Z5P1y1d135MZM1oZx1Z161P"), s("j3161yZ51dZy1d11Zj5Mjd1111161y1x5My5yMybyy"), r("j3161P16151bZ5xM1oZx1Z161P"), e("jP1bZj16Z11x5Mjy1o161x1PZj"), e("jP16ZjZ51d5MxMjjj15MxM1oZx1Z53j61P"), r("jP1d1Q161b5MxyZx16Zj1x5Mjx1P1b151o1xZ55MxM1oZx1Z161P"), n("jP1dZ5Zj1d1P5Mj61j1x1PZj16ZjZ65Mxy1b111x"), n("1PZMjbxMj65MxM1oZx1Z161P"), e("jPxMjo1bZyZjxM1bZyZy"), r("jPxMxM1o1bZ61xZ5xy141x1o1o"), e("1PZMxj1d1P1Z15Zxjb1j1j161P"), e("jPZ6Z4jo1bZx1P1y141xZ5"), e("jd1yZj1dZy141bZM1x5MxyZjZ51x1b13161P1Z5Mxy1xZ5Z1161y1xZy"), n("jd1P1o161P1x5MxyZj1dZ51b1Z1x5MZM1oZx1Z53161P"), e("jdZ51516Zj5Mjj1dZZ1P1o1d1b1j1xZ5"), i("xM1b1P1j1d5MxZ1x155MxM1oZx1Z161P"), e("xM1bZ51d135Pxjx15MZM1o1bZ61xZ55MZM1oZx1Z161P"), n("xMjjj15M161PZj1x1ZZ51b1j1d5M1j1d5MxZ1x15jQ16Zj"), r("xMjjj153x4jy141b1P1Z1x5Mx1161xZZ1xZ5"), e("xM141dZj1djy1x1PZj1xZ5xM1oZx1Z161Pyb5Pyb5Py55Py5"), r("xM161y1bZy1b"), e("xM1o1bZ6jd1P5MxM1oZx1Z53161P"), n("xbxby5yMybyy5Mj116Z51x111dZ45MxM1oZx1Z161P"), n("xbxbjj1dZZ1P1o1d1b1j5MxM1oZx1Z161P"), e("xbxbj3161P16jjjo5MxM1oZx1Z161P"), s("xbxbj3ZxZy161y"), s("x51x1b1ojj1dZZ1P1o1d1b1j1xZ55MxM1oZx1Z161P"), e("x51d151o1dZ45Mjo1bZx1P1y141xZ55MxM1oZx1Z161P"), i("x51d1y1Qj31x1oZj5MxxZM1j1bZj1x"), e("xy1b111xZ55MxxZM1j1bZj1x"), s("xy1b111xxy1x1bZ51y14"), i("xy1yZ516ZMZj161P1Z5Pjj161yZj161d1P1bZ5Z6"), s("xy1x11jy1o161x1PZj5MxM1oZx1Z161P"), s("xy141x1o1o5Pxxj6j41x1oZM1xZ5"), r("xy161oZ11xZ51o161Z14Zj5MxM1oZx1Z53j61P"), n("xy1613ZM1o1x5MxM1bZyZy"), i("xy1QZ6ZM1x5MxZ1x155MxM1oZx1Z161P"), r("xyZx131bZjZ51bxMjjj15Mj5Z51dZZZy1xZ55MxM1oZx1Z161P"), i("xyZ6131b1PZj1x1y5MxMjQj65Mjy1o161x1PZj"), s("xj1x1P1y1x1PZj5Mj1xjjP5MZM1oZx1Z53161P"), s("xj14Zx1P1j1xZ55Mjj1bZMjyZjZ51o5MjPxMjbxMj65MxM1oZx1Z161P"), n("xj1dZ51y14j41x1oZM1xZ5"), r("xx1P16ZjZ65MxM1o1bZ61xZ5"), e("xxZM1o1bZ65MxMjy"), i("x1jj1dZZ1P1o1d1b1j1xZ5"), r("x11x1xZj1o1x5Mxjx15Mjy1dZ51x"), s("x1jojy5Mj3Zx1oZj16131x1j161b5MxM1oZx1Z161P"), s("xZ1x155Mjy1d13ZM1d1P1x1PZjZy"), r("xZ1x15jQ16Zj53161PZj1x1ZZ5161xZ5Zj1x5MxMjjj1"), i("xZjxj5xgjxjP5Mj5Z51dZZZy1xZ55MjxZ4Zj1x1PZy161d1P"), n("xZ1d1o11Z51b135Mj31bZj141x131bZj161y1b"), n("xZ1dZ51jjy1bZMZjZxZ51xx4"), s("xZxMj65Mjj1xZj1x1yZj1dZ55Myb5Pyj"), i("x61b1P1j1xZ45Mj31x1j161b5MxM1oZx1Z161P"), s("x61b1P1j1xZ45MxMjjj15Mx1161xZZ1xZ5"), e("x61dZxxjZx151x5MxM1oZx1Z53161P"), n("Zg1b1Q1d")],
                    o = [],
                    a = {};
                o.push(g(V[i("ZM1oZx1Z161PZy")], function(t) { a[t.name] = 1;
                    var e = g(t, function(t) {
                        return [t.type, t.suffixes].join(r("ZP")) }).join(n("5o"));
                    return [t.name, t.description, e].join(n("ygyg")) }, this).join(r("5j")));
                o.push(g(t, function(t) {
                    if (a[t]) return r("");
                    t = V[n("ZM1oZx1Z161PZy")][t];
                    if (!t) return r("");
                    var e = g(t, function(t) {
                        return [t.type, t.suffixes].join(r("ZP")) }).join(i("5o"));
                    return [t.name, t.description, e].join(r("ygyg")) }, this).join(i("yQ")));
                return o.join(n("yQ"))
            }

            function f() {
                if (window[r("jb1yZj16Z11xx4jd151g1x1yZj")]) {
                    var t = [s("jb1yZ51dxMjjj15PxMjjj1"), i("jb1j1d1j155PxyZjZ51x1b13"), r("jb1Zjy1d1PZjZ51d1o5Pjb1Zjy1d1PZjZ51d1o"), n("jj1xZ11b1ox1x5x4jyZjZ51o5Pjj1xZ11b1ox1x5x4jyZjZ51o5Pyb"), i("j31b1yZ51d131x1j161bj11o1bZy14xM1bZM1xZ55Pj31b1yZ51d131x1j161bj11o1bZy14xM1bZM1xZ5"), e("j3ZyZ4131oy55Pjjjdj3jj1d1yZx131x1PZj"), e("j3ZyZ4131oy55Px4j3joj4xjxjxM"), e("xMjjj15PxM1j11jyZjZ51o"), i("xbZx161y1Qxj16131x5PxbZx161y1Qxj16131x"), s("xbZx161y1Qxj16131xjy141x1y1Qjd151g1x1yZj5PxbZx161y1Qxj16131xjy141x1y1Q5Pyb"), s("Z5131d1yZ45Px51x1b1oxM1o1bZ61xZ55MjZy55Mjy1d1PZjZ51d1o"), n("Z5131d1yZ45Px51x1b1oxM1o1bZ61xZ55MjZy55Mjy1d1PZjZ51d1o5Pyb"), i("x51x1b1oxM1o1bZ61xZ5"), r("x51x1b1oxM1o1bZ61xZ55Px51x1b1oxM1o1bZ61xZ554Zj13565Mjb1yZj16Z11xx45Mjy1d1PZjZ51d1o5M54yyy5531516Zj56"), n("x51x1b1ox1161j1x1d5Px51x1b1ox1161j1x1d54Zj13565Mjb1yZj16Z11xx45Mjy1d1PZjZ51d1o5M54yyy5531516Zj56"), i("Z5131d1yZ45Px51x1b1oxM1o1bZ61xZ55MjZy55Mjy1d1PZjZ51d1o"), e("xy1yZ516ZMZj161P1Z5Pjj161yZj161d1P1bZ5Z6"), n("xy141x1o1o5Pxxj6j41x1oZM1xZ5"), s("xy141d1y1QZZ1bZ11xj11o1bZy145Pxy141d1y1QZZ1bZ11xj11o1bZy14"), i("xyxZjyZj1o5PxyxZjyZj1o"), r("xy1QZ6ZM1x5Pjj1xZj1x1yZj161d1P"), r("xjjjjyjyZj1o5PxjjjjyjyZj1o"), i("xZj3xM1o1bZ61xZ55Pjdjyx4")];
                    return g(t, function(t) {
                        try {
                            return new(window[i("jb1yZj16Z11xx4jd151g1x1yZj")])(t), t } catch (e) {
                            return null } }).join(e("yQ")) }
                return i("") }

            function m() {
                try {
                    return !!window[n("Zy1xZyZy161d1PxyZj1dZ51b1Z1x")] } catch (t) {
                    return !0 } }

            function p() {
                try {
                    return !!window[r("1o1d1y1b1oxyZj1dZ51b1Z1x")] } catch (t) {
                    return !0 } }

            function g(t, e, i) {
                var n = [];
                if (null == t) return n;
                if ($ && t.map === $) return t.map(e, i);
                v(t, function(t, r, s) { n[n.length] = e.call(i, t, r, s) });
                return n }

            function v(t, e) {
                if (null !== t)
                    if (y && t.forEach === y) t.forEach(e, void 0);
                    else if (t.length === +t.length)
                    for (var i = 0, n = t.length; i < n && e.call(void 0, t[i], i, t) !== {}; i++);
                else
                    for (i in t)
                        if (t.hasOwnProperty(i) && e.call(void 0, t[i], i, t) === {}) break }
            var y = Array.prototype.forEach,
                $ = Array.prototype.map,
                x = { e: b, j: !0, i: !0, h: !0, b: !0, a: !0 };
            typeof t == i("11Zx1P1yZj161d1P") ? x.e = t : (null != t.b && void 0 != t.b && (x.b = t.b), null != t.a && void 0 != t.a && (x.a = t.a));
            this.get = function() {
                var t = [],
                    a = [];
                if (U) { t.push(m());
                    t.push(p());
                    t.push(!!window[r("161P1j1xZ41x1jjjj5")]);
                    J.body ? t.push(typeof J.body[i("1b1j1jj51x141bZ1161dZ5")]) : t.push("undefined");
                    t.push(typeof window[n("1dZM1x1Pjj1bZj1b151bZy1x")]);
                    t.push(V[s("1yZMZxjy1o1bZyZy")]);
                    t.push(V[i("ZM1o1bZj111dZ513")]);
                    var c;
                    if (c = x.i) try {
                        var d = J.createElement(i("1y1b1PZ11bZy"));
                        c = !(!d[r("1Z1xZjjy1d1PZj1xZ4Zj")] || !d[s("1Z1xZjjy1d1PZj1xZ4Zj")](r("y51j"))) } catch (f) { c = !1 }
                    if (c) try { t.push(u()), x.b && t.push(_()) } catch (g) { t.push(r("1y1b1PZ11bZy5M1xZ41y1xZMZj161d1P")) }
                    t.push(h());
                    x.a && a.push(o());
                    a.push(V[n("ZxZy1xZ5jb1Z1x1PZj")]);
                    a.push(V[n("1o1b1P1ZZx1b1Z1x")]);
                    a.push(window[e("Zy1yZ51x1x1P")][n("1y1d1o1dZ5jj1xZMZj14")]);
                    x.j && (c = window[r("Zy1yZ51x1x1P")] ? [window[i("Zy1yZ51x1x1P")].height, window[i("Zy1yZ51x1x1P")].width] : [0, 0], typeof c !== s("Zx1P1j1x11161P1x1j") && a.push(c.join(e("Z4"))));
                    a.push((new Date)[r("1Z1xZjxj16131xZg1d1P1xjd1111Zy1xZj")]());
                    a.push(V[r("1j1djP1dZjxjZ51b1y1Q")]);
                    a.push(l()) }
                c = [];
                x.e ? (c.push(x.e(t.join(r("5y5y5y")))), c.push(x.e(a.join(n("5y5y5y"))))) : (c.push(b(t.join(s("5y5y5y")))), c.push(b(a.join(r("5y5y5y")))));
                return c }
        }

        function b(t) {
            var o, a, _, c, h;
            o = 3 & t.length;
            a = t.length - o;
            _ = 31;
            for (h = 0; h < a;) c = 255 & t.charCodeAt(h) | (255 & t.charCodeAt(++h)) << 8 | (255 & t.charCodeAt(++h)) << 16 | (255 & t.charCodeAt(++h)) << 24, ++h, c = 3432918353 * (65535 & c) + ((3432918353 * (c >>> 16) & 65535) << 16) & 4294967295, c = c << 15 | c >>> 17, c = 461845907 * (65535 & c) + ((461845907 * (c >>> 16) & 65535) << 16) & 4294967295, _ ^= c, _ = _ << 13 | _ >>> 19, _ = 5 * (65535 & _) + ((5 * (_ >>> 16) & 65535) << 16) & 4294967295, _ = (65535 & _) + 27492 + (((_ >>> 16) + 58964 & 65535) << 16);
            c = 0;
            switch (o) {
                case 3:
                    c ^= (255 & t.charCodeAt(h + 2)) << 16;
                case 2:
                    c ^= (255 & t.charCodeAt(h + 1)) << 8;
                case 1:
                    c ^= 255 & t.charCodeAt(h), c = 3432918353 * (65535 & c) + ((3432918353 * (c >>> 16) & 65535) << 16) & 4294967295, c = c << 15 | c >>> 17, _ ^= 461845907 * (65535 & c) + ((461845907 * (c >>> 16) & 65535) << 16) & 4294967295 }
            _ ^= t.length;
            _ ^= _ >>> 16;
            _ = 2246822507 * (65535 & _) + ((2246822507 * (_ >>> 16) & 65535) << 16) & 4294967295;
            _ ^= _ >>> 13;
            _ = 3266489909 * (65535 & _) + ((3266489909 * (_ >>> 16) & 65535) << 16) & 4294967295;
            t = (_ ^ _ >>> 16) >>> 0;
            o = [];
            o.push(t);
            try {
                var u, l = t + s("");
                for (_ = h = a = 0; _ < l.length; _++) try {
                    var d = parseInt(l.charAt(_) + e(""));
                    a = d || 0 === d ? a + d : a + 1;
                    h++ } catch (f) { a += 1, h++ }
                u = $(1 * a / (0 == h ? 1 : h));
                var m, p = Math.floor(u / Math.pow(10, 1)),
                    g = t + n("");
                for (_ = h = a = d = l = 0; _ < g.length; _++) try {
                    var v = parseInt(g.charAt(_) + r(""));
                    v || 0 === v ? v < p ? (d++, l += v) : (h++, a += v) : (h++, a += p) } catch (y) { h++, a += p }
                h = 0 == h ? 1 : h;
                m = $(1 * a / h - 1 * l / (0 == d ? 1 : d));
                o.push(x(u, r("yM")));
                o.push(x(m, e("yM"))) } catch (b) { o = [], o.push(t), o.push(C(n("53")).join(s(""))), o.push(C(e("53")).join(e(""))) }
            return o.join(i("")) }

        function $(t) {
            if (0 > t || 10 <= t) throw Error(e("ybybybyM"));
            var i = C(n("yM"));
            t = e("") + t;
            for (var r = 0, s = 0; r < i.length && s < t.length; s++) t.charAt(s) != n("5P") && (i[r++] = t.charAt(s));
            return parseInt(i.join(e(""))) }

        function x(t, e) {
            var i = s("") + t;
            if (2 < i.length) throw Error(n("ybybybyb"));
            if (2 == i.length) return i;
            for (var r = [], o = i.length; 2 > o; o++) r.push(e);
            r.push(i);
            return r.join(n("")) }

        function C(t) {
            for (var e = [], i = 0; 2 > i; i++) e.push(t);
            return e }

        function M(t) {
            return null == t || void 0 == t }

        function E(t, e, i) { this.f = t;
            this.c = e;
            this.g = M(i) ? !0 : i }

        function j(t) {
            if (M(t) || M(t.f) || M(t.c)) return !1;
            try {
                if (M(window[t.f])) return !1 } catch (e) {
                return !1 }
            return !0 }

        function w(t, e) {
            if (M(t)) return r("");
            for (var i = 0; i < t.length; i++) {
                var n = t[i];
                if (!M(n) && n.f == e) return n } }

        function Z() {
            var t;
            t: {
                if (!M(H))
                    for (t = 0; t < H.length; t++) {
                        var o = H[t];
                        if (o.g && !j(o)) { t = o;
                            break t } }
                t = null }
            var a;
            if (M(t)) {
                try { a = 1.01 === window.parseFloat(n("yb5PyMyb")) && window.isNaN(window.parseFloat(s("j4jxjojojd"))) } catch (_) { a = !1 }
                if (a) {
                    var c;
                    try { c = 123 === window.parseInt(e("yby5yy")) && window.isNaN(window.parseInt(n("j4jxjojojd"))) } catch (h) { c = !1 }
                    if (c) {
                        var u;
                        try { u = window.decodeURI(s("5xy5y5")) === n("55") } catch (l) { u = !1 }
                        if (u) {
                            var d;
                            try { d = window.decodeURIComponent(i("5xy5y1")) === n("51") } catch (f) { d = !1 }
                            if (d) {
                                var m;
                                try { m = window.encodeURI(r("55")) === n("5xy5y5") } catch (p) { m = !1 }
                                if (m) {
                                    var g;
                                    try { g = window.encodeURIComponent(n("51")) === s("5xy5y1") } catch (v) { g = !1 }
                                    if (g) {
                                        var y;
                                        try { y = window.escape(r("51")) === e("5xy5y1") } catch (b) { y = !1 }
                                        if (y) {
                                            var $;
                                            try { $ = window.unescape(r("5xy5y1")) === r("51") } catch (x) { $ = !1 }
                                            if ($) {
                                                var C;
                                                try { C = 123 === window.eval(e("5411Zx1P1yZj161d1P5456ZQZ51xZjZxZ51P5Myby5yyyQZ3565456yQ")) } catch (E) { C = !1 }
                                                a = C ? null : w(H, r("1xZ11b1o")) } else a = w(H, r("Zx1P1xZy1y1bZM1x")) } else a = w(H, e("1xZy1y1bZM1x")) } else a = w(H, n("1x1P1y1d1j1xxxx5j6jy1d13ZM1d1P1x1PZj")) } else a = w(H, n("1x1P1y1d1j1xxxx5j6")) } else a = w(H, n("1j1x1y1d1j1xxxx5j6jy1d13ZM1d1P1x1PZj")) } else a = w(H, e("1j1x1y1d1j1xxxx5j6")) } else a = w(H, i("ZM1bZ5Zy1xj61PZj")) } else a = w(H, e("ZM1bZ5Zy1xj11o1d1bZj")) } else a = t;
            return a }

        function T() {
            var t = Z();
            if (!M(t)) return t.c;
            try { t = M(window[n("ZM141b1PZj1d13")]) || M(window[r("ZM141b1PZj1d13")][n("161P1g1x1yZjjgZy")]) ? null : w(H, e("ZM141b1PZj1d135P161P1g1x1yZjjgZy")) } catch (s) { t = null }
            if (!M(t)) return t.c;
            try { t = M(context) || M(context[e("141bZy14jy1d1j1x")]) ? null : w(H, i("1y1d1PZj1xZ4Zj5P141bZy14jy1d1j1x")) } catch (o) { t = null }
            return M(t) ? null : t.c }

        function S() {
            for (var t = [], i = 0; 3 > i; i++) {
                var n = Math.random() * st,
                    n = Math.floor(n);
                t.push(rt.charAt(n)) }
            return t.join(e("")) }

        function B(t) {
            for (var i = (J[n("1y1d1d1Q161x")] || s("")).split(s("yQ5M")), r = 0; r < i.length; r++) {
                var o = i[r].indexOf(e("y3"));
                if (0 <= o) {
                    var a = i[r].substring(o + 1, i[r].length);
                    if (i[r].substring(0, o) == t) return window.decodeURIComponent(a) } }
            return null }

        function P(t) {
            var o = [r("Z1"), e("11ZM"), e("Zx"), i("14"), r("1x1y"), r("1x13"), e("161yZM")],
                a = r("");
            if (null == t || void 0 == t) return t;
            if (typeof t == [n("1d15"), s("1g1x"), e("1yZj")].join(i(""))) {
                for (var a = a + e("ZQ"), _ = 0; _ < o.length; _++)
                    if (t.hasOwnProperty(o[_])) {
                        var c = r("5Z") + o[_] + i("5Zyg5Z"),
                            h;
                        h = e("") + t[o[_]];
                        h = null == h || void 0 == h ? h : h.replace(/'/g, r("xo5Z")).replace(/"/g, e("55"));
                        a += c + h + i("5Z5o") }
                a.charAt(a.length - 1) == e("5o") && (a = a.substring(0, a.length - 1));
                return a += i("Z3") }
            return null }

        function k(t, o, a, _) {
            var c = [];
            c.push(t + e("y3") + encodeURIComponent(o));
            a && (t = new Date, t = new Date(_), _ = t[r("Zj1djZj3xjxyZjZ5161P1Z")](), c.push(r("yQ5M")), c.push(i("1xZ4")), c.push(i("ZM16")), c.push(n("Z51x")), c.push(i("Zyy3")), c.push(_));
            c.push(i("yQ5M"));
            c.push(n("ZM1b"));
            c.push(s("Zj14y35d"));
            null != ht && void 0 != ht && ht != s("") && (c.push(r("yQ5M")), c.push(i("1j1d")), c.push(r("131b16")), c.push(e("1Py3")), c.push(ht));
            J[n("1y1d1d1Q161x")] = c.join(r("")) }

        function N(t) { window[ut] = t }

        function I(t) { window[lt] = t }

        function L(t) {
            for (var e = [], n = 0; 10 > n; n++) e.push(t);
            return e.join(i("")) }

        function O(t, e) {
            var i = B(t);
            null !== i && void 0 !== i && i !== r("") || k(t, e, !1) }

        function A() {
            var t = B(it);
            if (null == t || void 0 == t || t == r("")) t = window[lt];
            return t }

        function R() {
            var t = A();
            if (null == t || void 0 == t || t == i("")) return !1;
            try {
                return (t = parseInt(t)) && t >= nt ? !0 : !1 } catch (e) {
                return !1 } }

        function Q(t) {
            if (null == t || void 0 == t || t == r("")) return null;
            t = t.split(i("yg"));
            return 2 > t.length || !/[0-9]+/gi.test(t[1]) ? null : parseInt(t[1]) }

        function D() {
            var t = B(et);
            if (null == t || void 0 == t || t == i("")) t = window[ut];
            return t }

        function z() {
            var t = D();
            if (null == t || void 0 == t || t == s("")) return 0;
            t = Q(t);
            return null == t ? 0 : t - (ot - at) - (new(window[e("jj1bZj1x")]))[e("1Z1xZjxj16131x")]() }

        function F(t, o) {
            var a = new(window[i("jj1bZj1x")]);
            a[e("Zy1xZjxj16131x")](a[n("1Z1xZjxj16131x")]() - 1e4);
            null == o || void 0 == o || o == n("") ? window[e("1j1d1yZx131x1PZj")][s("1y1d1d1Q161x")] = t + s("y31PZx1o1oyQ5MZM1bZj14y35dyQ5M1xZ4ZM16Z51xZyy3") + a[n("Zj1djZj3xjxyZjZ5161P1Z")]() : window[r("1j1d1yZx131x1PZj")][n("1y1d1d1Q161x")] = t + s("y31PZx1o1oyQ5MZM1bZj14y35dyQ5M1j1d131b161Py3") + o + e("yQ5M1xZ4ZM16Z51xZyy3") + a[e("Zj1djZj3xjxyZjZ5161P1Z")]() }

        function q() {
            if (!(null == ft || void 0 == ft || 0 >= ft.length))
                for (var t = 0; t < ft.length; t++) {
                    var e = ft[t];
                    (null != ht && void 0 != ht && ht != i("") || null != e && void 0 != e && e != i("")) && ht != e && (F(et, e), F(it, e))
                }
        }

        function K() { q();
            window[lt] = null;
            window[ut] = null;
            var f = !0,
                m = { v: r("Z1yb5Pyb") },
                b = T();
            b && (m[r("161yZM")] = b);
            b = null;
            m[s("14")] = G;
            var $ = (new(window[i("jj1bZj1x")]))[n("1Z1xZjxj16131x")]() + ot,
                x = $ + 15768e7;
            m[i("Zx")] = S() + $ + S();
            try {
                var C = new y({ b: ct, a: _t }).get();
                null != C && void 0 != C && 0 < C.length ? m[i("11ZM")] = C.join(s("5o")) : (m[e("11ZM")] = L(n("yM")), m[s("1x1y")] = n("yb"), f = !1) } catch (M) { m[s("11ZM")] = L(r("yM")), m[r("1x1y")] = r("yb"), f = !1 }
            try {
                var E = b = P(m),
                    m = tt;
                if (null == m || void 0 == m) throw Error(r("ybyMyMy4"));
                if (null == E || void 0 == E) E = r("");
                var C = E,
                    j;
                j = null == E ? _([]) : _(d(E));
                var w = d(C + j),
                    Z = d(m);
                null == w && (w = []);
                j = [];
                for (m = 0; 4 > m; m++) {
                    var B = 256 * Math.random(),
                        B = Math.floor(B);
                    j[m] = v(B) }
                var Z = a(Z),
                    Z = p(Z, a(j)),
                    B = Z = a(Z),
                    A;
                if (null == w || void 0 == w || 0 == w.length) A = h();
                else {
                    var R = w.length,
                        m = 0,
                        m = 60 >= R % 64 ? 64 - R % 64 - 4 : 128 - R % 64 - 4,
                        C = [];
                    u(w, C, 0, R);
                    for (w = 0; w < m; w++) C[R + w] = 0;
                    u(l(R), C, R + m, 4);
                    A = C }
                R = A;
                if (null == R || 0 != R.length % 64) throw Error(i("ybyMyMyx"));
                A = [];
                for (var w = 0, Q = R.length / 64, m = 0; m < Q; m++)
                    for (A[m] = [], C = 0; 64 > C; C++) A[m][C] = R[w++];
                Q = [];
                u(j, Q, 0, 4);
                for (var D = A.length, R = 0; R < D; R++) {
                    var z, F;
                    var H = t(A[R], 8);
                    if (null == H) F = null;
                    else {
                        var U = v(44);
                        j = [];
                        for (var J = H.length, w = 0; w < J; w++) j.push(g(H[w], U--));
                        F = j }
                    z = t(F, -4);
                    var V = p(z, Z),
                        X;
                    j = V;
                    w = B;
                    if (null == j) X = null;
                    else if (null == w) X = j;
                    else {
                        for (var m = [], W = w.length, C = 0, Y = j.length; C < Y; C++) m[C] = v(j[C] + w[C % W]);
                        X = m }
                    var V = p(X, B),
                        rt = o(V),
                        rt = o(rt);
                    u(rt, Q, 64 * R + 4, 64);
                    B = rt }
                var st;
                if (null == Q || void 0 == Q) st = null;
                else if (0 == Q.length) st = s("");
                else try { D = [];
                    for (z = 0; z < Q.length;)
                        if (z + 3 <= Q.length) D.push(c(Q, z, 3)), z += 3;
                        else { D.push(c(Q, z, Q.length - z));
                            break }
                    st = D.join(n("")) } catch (ht) {
                    throw Error(s("ybyMybyM")) }
                b = st } catch (dt) { b = P({ ec: n("y5"), em: dt.message }), f = !1 }
            b = b + e("yg") + $;
            k(et, b, f, x);
            O(et, b);
            N(b);
            k(it, nt, f, x);
            O(it, nt);
            I(nt);
            window[r("Zy1xZjxj16131x1dZxZj")] && window[i("Zy1xZjxj16131x1dZxZj")](K, at) }
        E.prototype = { toString: function() {
                return s("ZQ5Z1P1b131x5Zyg") + this.f + n("5o5M5Z1y1d1j1x5Zyg") + this.c + r("5o5M5Z15Z51dZZZy1xZ5xMZ51dZM5Zyg") + this.g + s("Z3") } };
        var H = [new E(r("ZZ161P1j1dZZ"), n("yMyMyMyM")), new E(n("1j1d1yZx131x1PZj"), i("yMyMyMyb")), new E(e("1P1bZ1161Z1bZj1dZ5"), r("yMyMyMy5")), new E(r("1o1d1y1bZj161d1P"), n("yMyMyMyy")), new E(r("1416ZyZj1dZ5Z6"), s("yMyMyMyj")), new E(e("Zy1yZ51x1x1P"), r("yMyMyMyZ")), new E(i("ZM1bZ51x1PZj"), i("yMyMyMy4")), new E(i("Zj1dZM"), r("yMyMyMy6")), new E(i("Zy1x1o11"), e("yMyMybyM")), new E(i("ZM1bZ5Zy1xj11o1d1bZj"), i("yMybyMyM")), new E(e("ZM1bZ5Zy1xj61PZj"), i("yMybyMyb")), new E(i("1j1x1y1d1j1xxxx5j6"), r("yMybyMy5")), new E(s("1j1x1y1d1j1xxxx5j6jy1d13ZM1d1P1x1PZj"), s("yMybyMyy")), new E(r("1x1P1y1d1j1xxxx5j6"), e("yMybyMyj")), new E(s("1x1P1y1d1j1xxxx5j6jy1d13ZM1d1P1x1PZj"), e("yMybyMyx")), new E(s("1xZy1y1bZM1x"), s("yMybyMy1")), new E(i("Zx1P1xZy1y1bZM1x"), n("yMybyMyZ")), new E(i("1xZ11b1o"), n("yMybyMy4")), new E(i("xdZM141b1PZj1d13"), e("yMy5yMyM"), (!1)), new E(s("1y1b1o1oxM141b1PZj1d13"), r("yMy5yMyb"), (!1)), new E(e("ZM141b1PZj1d13"), s("yMy5yMy5"), (!1)), new E(e("ZM141b1PZj1d135P161P1g1x1yZjjgZy"), r("yMy5yMyy"), (!1)), new E(i("1y1d1PZj1xZ4Zj5P141bZy14jy1d1j1x"), n("yMy5ybyb"), (!1))],
            U = Z() ? !1 : !0,
            G = window && window[s("1o1d1y1bZj161d1P")] && window[n("1o1d1y1bZj161d1P")].host || r("1P1dZjxd1xZ416ZyZjxd141dZyZj"),
            J = window[e("1j1d1yZx131x1PZj")],
            V = window[n("1P1bZ1161Z1bZj1dZ5")],
            X = [i("yM"), s("yb"), e("y5"), n("yy"), s("yj"), r("yx"), s("y1"), i("yZ"), i("y4"), n("y6"), n("1b"), s("15"), e("1y"), e("1j"), i("1x"), n("11")],
            W = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
            Y = [-90, -78, -117, 119, -123, -13, -28, -77, 33, -99, 46, -106, -80, -118, -44, 30, 124, -16, -26, 91, -58, -109, 78, -49, 81, 110, 83, 13, -69, 97, -34, -70, -85, -19, 126, -20, 51, 49, 86, 95, 5, -121, -102, -74, -5, 29, -100, -108, 121, -119, -101, 101, -63, 40, 107, -112, 93, -48, -115, 17, -62, 103, 21, 53, 6, 61, -56, -22, -92, 63, -31, 47, -84, 9, -104, 39, -39, -52, 113, 122, 15, 64, -2, 102, -105, 104, 55, -53, 10, 38, -64, 11, 76, -55, -96, 42, -79, 3, 44, -8, -120, -66, -51, 14, -23, 106, -9, 109, -11, -47, 88, 32, 19, -35, -68, -12, 41, -24, 77, -128, 0, -88, 20, 66, -72, 23, -42, 52, 12, -71, 94, 90, 56, 1, 59, -32, -97, -127, -59, -126, -95, 108, -4, -50, 35, 73, 89, 67, 28, -94, 120, 105, 22, 18, -124, 98, -45, 74, 112, 79, -116, 116, 114, 4, -21, -14, 16, 125, -113, 123, -93, -37, 36, -89, 80, 118, 25, -40, 58, 99, 100, 54, -36, -125, -1, -60, 57, 60, -43, -7, 127, -17, -110, 85, 111, 68, 96, -65, -98, 50, 48, -18, -76, -67, -83, -54, -73, 7, 87, 34, 43, 45, 26, -33, -25, -38, 62, 71, 70, -6, -82, 117, -86, -122, -3, 24, -57, 69, -29, 82, -87, -81, -30, 115, 31, 65, -114, -15, 75, 27, -107, 37, -10, 2, 84, 92, -27, 72, 8, -75, -61, -91, -103, -111, -46, -41],
            t = function(t, e) {
                if (null == t) return null;
                for (var i = v(e), n = [], r = t.length, s = 0; s < r; s++) n.push(g(t[s], i++));
                return n },
            tt = i("ybyjyZyyyjyMy4y1y51yyj111yybyjyxj51jjx151yyZy5yj15yjy4y6jyyMjb15y61xjy1x11jjjjjbyMy6yM1byxyy"),
            et = s("1gZy1xZyZy161d1P161j531yZMZj1b"),
            it = i("1yy6y4Z4ZMZjxd"),
            nt = 30,
            rt = i("1bxg15x6yM1yx41jxZyb1xx111y5xx1Zyyxj14yjxy16x5yx1gxb1Qy1xM1ojdyZ13jP1Py4j31djoy6ZMjQZbjgZ5j6Zyj4ZjjZZxj1Z1jxZZjjZ4jyZ6j5Zgjb"),
            st = rt.length,
            ot = 9e5,
            at = 84e4,
            _t = !1,
            ct = !0,
            ht = n(""),
            ut = et.replace(/[^a-zA-Z0-9$]/g, r("")).toLowerCase(),
            lt = it.replace(/[^a-zA-Z0-9$]/g, e("")).toLowerCase(),
            dt = window && window[r("1o1d1y1bZj161d1P")] && window[r("1o1d1y1bZj161d1P")][r("141dZyZj1P1b131x")] || r("1P1dZjxd1xZ416ZyZjxd141dZyZj1P1b131x"),
            ft = function(t) {
                var e = [];
                if (!t) return e;
                t = t.split(r("5P"));
                for (var s = i(""), o = 0; o < t.length; o++) o < t.length - 1 && (s = n("5P") + t[t.length - 1 - o] + s, e.push(s));
                return e }(dt);
        ft.push(null);
        ft.push(r("5P") + dt);
        1 < function(t) {
            for (var r = 0, o = (J[n("1y1d1d1Q161x")] || e("")).split(i("yQ5M")), a = 0; a < o.length; a++) {
                var _ = o[a].indexOf(s("y3"));
                0 <= _ && o[a].substring(0, _) == t && (r += 1) }
            return r }(et) && q();
        ! function() {
            var t = D();
            if (null == t || void 0 == t || t == e("")) t = !1;
            else {
                var i;
                if (i = R()) t = Q(t), i = !(null == t || t - (new(window[r("jj1bZj1x")]))[r("1Z1xZjxj16131x")]() <= ot - at);
                t = i }
            return t }() ? K(): (N(D()), I(A()), dt = z(), window[r("Zy1xZjxj16131x1dZxZj")] && window[e("Zy1xZjxj16131x1dZxZj")](K, dt))
    }()
}();
! function() {
    function t() {
        var t = "3SoMBCmgzaKFw6Qn".split("");
        this.P = function(e) {
            if (null == e || void 0 == e) return e;
            if (0 != e.length % 2) throw Error("1100");
            for (var i = [], n = 0; n < e.length; n++) { 0 == n % 2 && i.push("%");
                for (var r = t, s = 0; s < r.length; s++)
                    if (e.charAt(n) == r[s]) { i.push(s.toString(16));
                        break } }
            return decodeURIComponent(i.join("")) } }
    var e = (new t).P,
        n = (new t).P,
        r = (new t).P,
        s = (new t).P,
        o = (new t).P,
        a;
    a = { $: function(t, e) {
            var i = t.length;
            if (i <= e) return t;
            for (var n = [], r = 0, s = 0; s < i; s++) s >= r * (i - 1) / (e - 1) && (n.push(t[s]), r += 1);
            return n }, wb: function(t) {
            var e = o("mSgKmCgogBgagCg3gSgMmBmmmgmzmKmFm6gggzmMgmmomQMoMMMBMCMmMgMzMaBSCKBCCoCBCaCCC3CSCMBBBmBgBzBKBFB6CgCzBMCmBoBQCno6oMB3"),
                n = o("");
            for (i = 0; i < t; i++) var r = Math.round(Math.random() * e.length),
                n = n + e.substring(r, r + 1);
            return n }, U: {}, wa: function() {
            return (new Date)[r("mgmCgBCBmam6mC")]() } };
    n("mBmagm");
    s("CQCQCQQzKnFgQBFQa6QmKwKSQgzoFaQCzgFFCQCQCQ");
    r("mQmMg3gBCngMmwmamBmCgoo3mQmMg3gBCngMmwmamBmCgoCngmmSmwmamB");
    n("QaKKzwQzKnzSQmzza3QCzKan");
    o("mQmMg3gBCngMmwmamBmCgoo3mQmMg3gBCngMmwmamBmCgoCnmamQgmmSmwmamB");
    n("QaKKzwQzKnzSQaaBaaQzKnKn");
    e("mQmMg3gBCngMmwmamBmCgoo3mQmMg3gBCngMmwmamBmCgoCnmamQgmmSmwmamB");
    n("QzKnFgQCKQzwQmzza3QmFFaSQCzKKzQaKKzwQzKnzS");
    window[s("BQBCBMmSg3gBmMmzmS")] = function(t) {
        this.e = this.nb = document.createElement(s("mBmagm"));
        this.e.className = o("mQmMg3gBCnggmamBmgmCgB");
        this.e.position = r("gomCmwmSgBmagmmC");
        this.e.id = e("BQBCBMmSg3gBmMmzmS");
        this.Ja = document[r("mBmnmMgCm6mCmQgBBCmwmCm6mCmQgB")];
        this.e.className = o("mQmMg3gBCnggmamBmgmCgB");
        this.b = t;
        this.J = r("");
        e("");
        this.r = document.createElement(s("mBmagm"));
        this.l = document.createElement(r("mBmagm"));
        this.H = document.createElement(r("mam6mg"));
        this.j = document.createElement(e("mBmagm"));
        this.C = document.createElement(n("mBmagm"));
        this.aa = document.createElement(n("mam6mg"));
        this.L = document.createElement(s("mam6mg"));
        this.ga = document.createElement(e("mam6mg"));
        this.B = document.createElement(e("mBmagm"));
        this.o = document.createElement(e("mBmagm"));
        this.ia = document.createElement(o("mammgomSm6mC"));
        this.N = document.createElement(n("mBmagm"));
        this.S = document.createElement(e("mammgomSm6mC"));
        this.n = document.createElement(e("mBmagm"));
        this.back = document.createElement(s("mBmagm"));
        this.form = document.createElement(s("mBmagm"));
        this.R = document.createElement(o("mBmagm"));
        this.ja = document.createElement(n("mam6mg"));
        this.I = this.xa = !1;
        this.la = this.ka = -100;
        this.Sa = this.Wa = this.na = this.Aa = this.za = 0;
        this.Ta = (new Date)[o("mgmCgBCBmam6mC")]();
        this.Ua = 0;
        this.D = [];
        this.Ba = 0;
        this.A = o("");
        this.K = o("");
        this.T = this.u = this.ba = 0;
        this.ha = e("");
        this.ca = e("");
        this.Ma = !1;
        this.q = document.createElement(o("mBmagm"));
        this.F = document.createElement(n("mBmagm"));
        this.M = document.createElement(r("mBmagm"));
        this.f = document.createElement(s("mBmagm"));
        this.s = document.createElement(n("mBmagm"));
        this.Fa = document.createElement(e("mBmagm"));
        this.G = [];
        this.ua = this.va = !1;
        this.ea = [];
        this.Ea = 0;
        this.W = {};
        this.qa = {};
        this.oa;
        this.version = e("MooQMooQMo");
        this.mb = [o("mmmngomMmCBzgBgBg3gM"), s("mMmSg3gBmMmzmSCBgag3mC"), r("gmmCgomammgaBMmSmwmwmomSmMmF"), n("mzmamQgBCBgzgB"), s("gBgzgBBomCmmmngomC"), e("gBgzgBBSmmgBmCgo")];
        this.Z = function() {};
        this.Ca;
        this.Da;
        this.X;
        this.V = !1;
        this.Q;
        this.rb = function(t) { this.B.style.display = r("momwmnmMmF");
            this.B.innerHTML = t.Pa;
            this.B.insertAdjacentHTML(r("mSmmgBmCgomomCmgmamQ"), o("Mwmam6mgo3gMgBgamwmCM6ogg3mSmBmBmamQmgo6gomamgmzgBMKo3MSM3g3gzMF") + t.style + n("ogo3gMgomMM6og") + this.A + t.Ka) };
        var i = this;
        _setValues = function(t) { i.ma(t) };
        _updateStatus = function(t) { i.pa(t) };
        this.gb = function() {};
        this.ab = function() {};
        this.Ga = { verifyCallback: this.rb, initCallback: this.gb, initErrorHandler: this.ab, width: 320, staticServer: e(""), apiServer: s(""), captchaId: s(""), security: n("CoBCBgBaCMCBBCCo"), hintTxt: o("MQMQMQQzKnFgQmzFamQCzKKzQmFFaSQCa6agQCKQzwQmzza3QmzFFwQCaFFQMQMQMQ"), captchaType: 2, txtBefore: r("MQMQMQQzKnFgQBFQa6QmKwKSQgzoFaQCzgFF"), txtAfter: n("QCKQzwQmzza3QaKKzwQzKnzSMQMQMQ"), alignToSpace: !1, forceHttps: !1, mode: e("mmmwmnmSgB") };
        this.cb();
        this.ra(this.W, this.ma, n("CngMmCgBCmmSmwgCmCgM"), this.ha);
        t[e("mamQmagBBMmSmwmwmomSmMmF")]()
    };
    NECaptcha.prototype.cb = function() { this.qb();
        this.b[s("m6mnmBmC")] == r("g3mng3gCg3") && this.Ya();
        this.bb();
        this.fb();
        this.$a() };
    NECaptcha.prototype.fb = function() { this.eb();
        this.ib();
        this.hb() };
    NECaptcha.prototype.eb = function() { this.F.className = o("mQmMg3gBCnmMmnmQgBmCmQgBgM");
        this.r.className = r("mQmMg3gBCngMmwmamBmCCnmomg");
        this.l.className = s("mQmMg3gBCngMmwmamBmCCnmmmg");
        this.j.className = r("mQmMg3gBCng3gCgKgKmwmCCnmomg");
        this.C.className = s("mQmMg3gBCng3gCgKgKmwmCCnmmmg");
        this.ia.className = e("mQmMg3gBCnggmamQCnmammgomSm6mC");
        this.o.className = n("mQmMg3gBCnmzmamQgBCngBgzgB");
        this.N.className = r("mQmMg3gBCng3gCgKgKmwmCCnmomg");
        this.q.className = o("mQmMg3gBCnmMmnmQgBmCmQgBgM");
        this.f.className = s("mQmMg3gBCng3mSmB");
        this.M.className = s("mQmMg3gBCng3mSmQmCmw");
        this.s.className = s("mQmMg3gBCnmzmamQgBCngBgzgB");
        this.Fa.className = r("mQmMg3gBCnmMmwgo");
        this.n.className = r("mQmMg3gBCng3gKgKBMmwmamMmF");
        this.S.className = r("mQmMg3gBCnggmamQCnmammgomSm6mC");
        this.B.className = s("mQmMg3gBCngBgzgBCngMgBmSgBgCgM") };
    NECaptcha.prototype.ib = function() {
        var t = parseFloat(this.b[s("ggmamBgBmz")]) / 320,
            i = 32 * t;
        this.r.style.width = this.b[e("ggmamBgBmz")] + r("g3gz");
        this.r.style.height = i + n("g3gz");
        this.r.style.borderRadius = i / 2 + s("g3gz");
        this.H.src = this.A + o("onmam6mSmgmCgMongMmwmamBmCgooQg3mQmg");
        this.H.style.height = r("mSgCgBmn");
        this.H.style.width = 72 * t + r("g3gz");
        this.l.style.left = s("MSg3gz");
        this.j.style.bottom = 44 * t + e("g3gz");
        this.j.style.height = 100 * t + s("g3gz");
        this.ga.style.width = 60 * t + r("g3gz");
        this.ga.style.height = r("mSgCgBmn");
        this.aa.style.width = this.b[o("ggmamBgBmz")] + r("g3gz");
        this.aa.style.borderRadius = s("Mzg3gz");
        this.e.style.width = 320 * t + n("g3gz");
        this.e.style.height = 34 * t + r("g3gz");
        this.ia.style.width = this.b[n("ggmamBgBmz")] + e("g3gz");
        this.ia.style.height = 100 * t + o("g3gz");
        this.N.style.left = r("M3g3gz");
        this.N.style.display = o("momwmnmMmF");
        this.N.style.top = n("M3g3gz");
        this.o.style.lineHeight = 34 * t + o("g3gz");
        this.b[s("mSmwmamgmQCBmnCMg3mSmMmC")] && (this.o.style.left = 36 * t + e("g3gz"), this.o.style.position = r("gomCmwmSgBmagmmC"));
        this.na = 6 * t;
        this.C.style.left = this.na + 1 + n("g3gz");
        this.Wa = 44 * t;
        this.Sa = 200 * t;
        this.o.style.opacity = 1;
        this.b[s("m6mnmBmC")] != e("mmmwmnmSgB") && (this.j.style.display = e("momwmnmMmF"));
        this.b[o("m6mnmBmC")] != r("mmmwmnmSgB") && (this.f.style.display = e("momwmnmMmF"));
        if (navigator.appName != o("B6mamMgomngMmnmmgBo3BamQgBmCgomQmCgBo3BCgzg3mwmngomCgo") || navigator.appVersion.match(/8./i) != o("MzoQ") && navigator.appVersion.match(/7./i) != e("MgoQ")) this.L.style = o("o6ggmCmomFmagBo6momngomBmCgoo6gomSmBmagCgMMKo3Mzg3gzMFo3o6m6mngKo6momngomBmCgoo6gomSmBmagCgMMKo3Mzg3gzMFo3momngomBmCgoo6gomSmBmagCgMMKo3Mzg3gzMF");
        this.s.style.left = 0 + e("g3gz");
        this.s.style.width = 320 * t + r("g3gz");
        this.s.style.height = 34 * t + o("g3gz");
        this.s.style.lineHeight = 34 * t + r("g3gz");
        this.S.style.width = this.b[e("ggmamBgBmz")] + n("g3gz");
        this.S.style.height = 100 * t + o("g3gz");
        this.M.style.width = 320 * t + s("g3gz");
        this.M.style.height = 34 * t + e("g3gz");
        this.f.style.width = 320 * t + o("g3gz");
        this.f.style.height = 100 * t + e("g3gz");
        this.f.style.bottom = 44 * t + e("g3gz");
        this.f.style.position = e("mSmogMmnmwgCgBmC");
        this.L.style.width = 320 * t + e("g3gz");
        this.L.style.height = n("mSgCgBmn");
        this.n.style.left = r("M3g3gz");
        this.B.style.height = 34 * this.b[e("ggmamBgBmz")] / 320 + r("g3gz");
        this.B.style.marginLeft = parseFloat(this.b[e("ggmamBgBmz")]) + 12 + n("g3gz");
        this.B.style.lineHeight = 34 * this.b[s("ggmamBgBmz")] / 320 + e("g3gz");
        this.B.style.display = s("mQmnmQmC") };
    NECaptcha.prototype.hb = function() { this.j.innerHTML = s("");
        this.C.innerHTML = o("");
        this.r.innerHTML = s("");
        this.e.innerHTML = e("");
        this.j.appendChild(this.C);
        this.j.appendChild(this.ia);
        this.N.appendChild(this.aa);
        this.j.appendChild(this.N);
        this.C.appendChild(this.ga);
        this.l.appendChild(this.H);
        this.r.appendChild(this.l);
        this.r.appendChild(this.o);
        this.F.appendChild(this.j);
        this.F.appendChild(this.r);
        this.q.innerHTML = e("");
        this.f.innerHTML = s("");
        this.M.innerHTML = r("");
        this.q.appendChild(this.f);
        this.f.appendChild(this.S);
        this.n.appendChild(this.L);
        this.f.appendChild(this.n);
        this.M.appendChild(this.s);
        this.q.appendChild(this.M);
        this.q.appendChild(this.Fa);
        this.e.appendChild(this.F);
        this.F.style.display = r("mQmnmQmC");
        this.e.appendChild(this.q);
        this.q.style.display = r("mQmnmQmC");
        this.e.appendChild(this.B) };
    NECaptcha.prototype.qb = function() {
        for (var t in this.Ga) typeof this.b[t] == r("gCmQmBmCmmmamQmCmB") && (this.b[t] = this.Ga[t]);
        this.W = this.Ia(this.b);
        t = this.b[e("mmmngomMmCBzgBgBg3gM")] ? e("mzgBgBg3gMMK") : window[o("mwmnmMmSgBmamnmQ")].protocol;
        Object.prototype.toString.call(this.b[n("mCmwmCm6mCmQgB")]) == r("CFmnmomKmCmMgBo3CMgBgomamQmgC6") ? document.getElementById(this.b[s("mCmwmCm6mCmQgB")]).appendChild(this.e) : this.b[r("mCmwmCm6mCmQgB")].appendChild(this.e);
        this.A = t + o("onon") + this.b[r("gMgBmSgBmamMCMmCgogmmCgo")];
        this.K = t + s("onon") + this.b[o("mSg3maCMmCgogmmCgo")];
        this.ha = this.K + r("onmMmSg3gBmMmzmSonmgmCgBoQmKgMmnmQ");
        this.ca = this.K + e("onmMmSg3gBmMmzmSonmMmzmCmMmFoQmKgMmnmQ") };
    NECaptcha.prototype.$a = function() {
        var t = this;
        this.Z = this.g(this.l, o("m6mngCgMmCmBmnggmQo3gBmngCmMmzgMgBmSgogB"), this.Oa, t);
        this.g(this.r, r("m6mngCgMmCmngmmCgo"), function() { t.I || (t.Y(), t.j.style.display = n("momwmnmMmF")) }, t);
        this.g(this.r, n("m6mngCgMmCmngCgB"), function() { t.b[o("m6mnmBmC")] != r("mmmwmnmSgB") || t.xa || (t.j.style.display = n("mQmnmQmC")) }, t);
        this.g(document, r("gBmngCmMmzgMgBmSgogB"), function() { t.b[r("m6mnmBmC")] == o("mmmwmnmSgB") && (t.j.style.display = o("mQmnmQmC")) });
        this.g(this.q, e("m6mngCgMmCm6mngmmC"), function(e) { t.lb(e);
            t.ua || (t.ua = !0) }, t);
        this.g(this.f, r("m6mngCgMmCmngmmCgo"), function() { t.I || (t.u = t.e.offsetLeft, t.ya = t.e.offsetTop) }, t);
        this.g(this.q, n("g3mnmamQgBmCgomBmnggmQ"), function() { t.b[o("m6mnmBmC")] != e("g3mng3gCg3") && (t.Ma = !0, t.La = !0, t.I || (t.Y(), t.f.style.display = n("momwmnmMmF"), t.u = t.e.offsetLeft, t.ya = t.e.offsetTop)) });
        this.g(document, o("g3mnmamQgBmCgomBmnggmQ"), function() { t.La || t.b[o("m6mnmBmC")] != n("mmmwmnmSgB") || (t.f.style.display = s("mQmnmQmC"));
            t.La = !1 }, t);
        var i;
        this.g(this.q, n("m6mngCgMmCmngCgB"), function() { t.b[n("m6mnmBmC")] == s("mmmwmnmSgB") && (t.Ma || (i = setTimeout(function() { t.f.style.display = r("mQmnmQmC") }, 100))) }, t);
        this.g(this.q, e("m6mngCgMmCmngmmCgoo3gBmngCmMmzgMgBmSgogB"), function() { t.I || (clearTimeout(i), t.Y(), t.f.style.display = o("momwmnmMmF"), t.u = t.e.offsetLeft, t.ya = t.e.offsetTop) }, t);
        this.X = t.g(t.n, o("m6mngCgMmCmBmnggmQo3gBmngCmMmzgMgBmSgogB"), t.Na, t) };
    NECaptcha.prototype.Oa = function(t, i) { i.j.style.display = r("momwmnmMmF");
        i.Y();
        t.touches ? (i.I || (i.j.style.display = s("momwmnmMmF")), i.u = t.changedTouches[0].pageX, i.T = t.changedTouches[0].pageY) : t.pageX ? (i.u = t.pageX, i.T = t.pageY) : (i.u = t.clientX + document.body.scrollLeft + document[o("mBmnmMgCm6mCmQgBBCmwmCm6mCmQgB")].scrollLeft, i.T = t.clientY + document.body.scrollTop + document[e("mBmnmMgCm6mCmQgBBCmwmCm6mCmQgB")].scrollTop);
        i.Ua = (new Date)[e("mgmCgBCBmam6mC")]();
        i.D = [];
        i.H.src = i.A + e("onmam6mSmgmCgMongMmwmamBmCgooQg3mQmg");
        i.l.className = s("mQmMg3gBCngMmwmamBmCCnmmmg");
        i.Ja.className = (i.Ja.className + e("o3mQmno6gMmCmwmCmMgB")).replace(/^ +/, s(""));
        i.za = i.r[o("mnmmmmgMmCgBCgmamBgBmz")];
        i.Aa = i.l[e("mnmmmmgMmCgBCgmamBgBmz")];
        i.xa = !0;
        i.C.style.opacity = .7;
        i.Va(t, i);
        i.Ha(i.o, 0);
        i.Ca = i.g(document, r("m6mngCgMmCm6mngmmCo3gBmngCmMmzm6mngmmC"), i.Va, i);
        i.Da = i.g(document, r("m6mngCgMmCgCg3o3gBmngCmMmzmCmQmB"), i.Xa, i);
        return !1 };
    NECaptcha.prototype.Va = function(t, e) {
        t.preventDefault ? (t.preventDefault(), t.stopPropagation()) : t.returnValue = !1;
        t = t || window.event;
        if (t.touches) var i = t.changedTouches[0].pageX,
            n = t.changedTouches[0].pageY;
        else t.pageX ? (i = t.pageX, n = t.pageY) : (i = t.clientX + document.body.scrollLeft + document[o("mBmnmMgCm6mCmQgBBCmwmCm6mCmQgB")].scrollLeft,
            n = t.clientY + document.body.scrollTop + document[o("mBmnmMgCm6mCmQgBBCmwmCm6mCmQgB")].scrollTop);
        e.D.push(a.U.fa([Math.round(i - e.u), Math.round(n - e.T), a.wa() - e.Ua].toString()));
        i -= e.u;
        i > e.za - e.Aa - 1 ? i = e.za - e.Aa - 1 : 1 > i && (i = 1);
        e.l.style.left = i + s("g3gz");
        e.C.style.left = i + e.na + s("g3gz")
    };
    NECaptcha.prototype.Xa = function(t, i) {
        var _ = new XMLHttpRequest;
        s("ggmagBmzBMgomCmBmCmQgBmamSmwgM") in _ ? i.D = a.$(i.D, 50) : i.D = a.$(i.D, 30);
        i.jb = a.U.fa((100 * (parseFloat(i.l.style.left) - 1 - i.Wa) / i.Sa).toString());
        _ = { d: i.D.join(o("MK")), m: r(""), p: i.jb };
        i.oa = JSON.stringify(_);
        i.qa = { k: i.b[e("mMmSg3gBmMmzmSBamB")], i: i.Ba, da: i.oa, a: 1, w: i.b[n("ggmamBgBmz")], t: i.ba, v: i.version };
        i.C.style.opacity = 1;
        i.O(document, e("m6mngCgMmCm6mngmmCo3gBmngCmMmzm6mngmmC"), i.Ca);
        i.O(document, r("m6mngCgMmCgCg3o3gBmngCmMmzmCmQmB"), i.Da);
        i.ra(i.qa, i.pa, n("CngCg3mBmSgBmCCMgBmSgBgCgM"), i.ca) };
    NECaptcha.prototype.Ia = function(t) {
        return { k: t[o("mMmSg3gBmMmzmSBamB")], c: window[s("mKgMmCgMgMmamnmQmamBmMg3gBmS")], t: t[o("mMmSg3gBmMmzmSCBgag3mC")], a: 1, h: t[r("mmmngomMmCBzgBgBg3gM")] || window[o("mwmnmMmSgBmamnmQ")].protocol == s("mzgBgBg3gMMK"), v: this.version } };
    NECaptcha.prototype.Ha = function(t, e) {
        function i() { t.style.opacity = +t.style.opacity + n * (new Date - r) / 400;
            r = +new Date;
            0 > (+t.style.opacity - e) * n && (window.requestAnimationFrame && requestAnimationFrame(i) || setTimeout(i, 16)) }
        var n = e - t.style.opacity,
            r = +new Date;
        i() };
    NECaptcha.prototype.Za = function(t) { void 0 != t.style.animationName ? (t.className = r("mQmMg3gBCngMmwmamBmCCnmmmg"), t.className += s("o3mQmMg3gBCnmSmQmam6CnmwmCmmgB")) : t.style.left = r("MSg3gz") };
    NECaptcha.prototype.lb = function(t) { this.u = this.e.offsetLeft;
        this.ya = this.e.offsetTop;
        var e, i;
        t.pageX ? (e = t.pageX, i = t.pageY) : t.clientX && (i = e = 0, document[n("mBmnmMgCm6mCmQgBBCmwmCm6mCmQgB")].scrollLeft ? (e = document[s("mBmnmMgCm6mCmQgBBCmwmCm6mCmQgB")].scrollLeft, i = document[o("mBmnmMgCm6mCmQgBBCmwmCm6mCmQgB")].scrollTop) : document.body && (e = document.body.scrollLeft, i = document.body.scrollTop), e = t.clientX + e, i = t.clientY + i);
        this.G.push(a.U.fa([Math.round(e - this.u), Math.round(i - this.T), a.wa() - this.Ta].toString())) };
    NECaptcha.prototype.kb = function(t, e) { this.ea.push(a.U.fa([t, e, a.wa() - this.Ta].toString())) };
    NECaptcha.prototype.Na = function(t, i) {
        if (!i.va) { t.preventDefault ? (t.preventDefault(), t.stopPropagation()) : t.returnValue = !1;
            var _ = document.createElement(n("mam6mg"));
            _.src = i.A + s("onmam6mSmgmCgMonmMmwmamMmFoQg3mQmg");
            _.style.position = r("mSmogMmnmwgCgBmC");
            var c, h;
            t.touches ? (c = t.changedTouches[0].pageX, h = t.changedTouches[0].pageY) : t.pageX ? (c = t.pageX, h = t.pageY) : (c = t.clientX + document.body.scrollLeft + document[s("mBmnmMgCm6mCmQgBBCmwmCm6mCmQgB")].scrollLeft, h = t.clientY + document.body.scrollTop + document[n("mBmnmMgCm6mCmQgBBCmwmCm6mCmQgB")].scrollTop);
            for (var u = i.e.offsetLeft, l = i.e.offsetTop, d = i.e; null != d.offsetParent;) d = d.offsetParent, u += d.offsetLeft, l += d.offsetTop;
            i.b[r("m6mnmBmC")] == r("g3mng3gCg3") && (t.touches ? (c = t.changedTouches[0].clientX, h = t.changedTouches[0].clientY) : (c = t.clientX, h = t.clientY));
            var f = i.b[e("ggmamBgBmz")] / 320,
                d = 12 * f;
            c = Math.round(c - u);
            h = Math.round(h - (l - i.S.offsetHeight) + 10 * f);
            l = c - d;
            u = h - d;
            25 >= (l - i.ka) * (l - i.ka) + (u - i.la) * (u - i.la) || (i.ka = l, i.la = u, 0 > l ? l = 0 : l + 2 * d > i.n.offsetWidth && (l = i.n.offsetWidth - 2 * d), 0 > u ? u = 0 : u + 2 * d > i.n.offsetHeight && (u = i.n.offsetHeight - 2 * d), _.style.left = l + r("g3gz"), _.style.top = u + s("g3gz"), _.style.width = 2 * d + o("g3gz"), _.style.height = 2 * d + s("g3gz"), i.n.appendChild(_), i.kb(c, h), i.ea.length == i.Ea && (i.ka = -100, i.la = -100, i.va = !0, _ = new XMLHttpRequest, s("ggmagBmzBMgomCmBmCmQgBmamSmwgM") in _ ? i.G = a.$(i.G, 50) : i.G = a.$(i.G, 30), _ = { d: e(""), m: i.G.join(e("MK")), p: i.ea.join(r("MK")) }, i.oa = JSON.stringify(_), i.qa = { a: 1, k: i.b[s("mMmSg3gBmMmzmSBamB")], i: i.Ba, da: i.oa, w: i.b[s("ggmamBgBmz")], t: i.ba, v: i.version }, i.ra(i.qa, i.pa, s("CngCg3mBmSgBmCCMgBmSgBgCgM"), i.ca))) } };
    NECaptcha.prototype.g = function(t, i, s, o) {
        function a(t) { s(t, o) }
        i = i.split(r("o3"));
        if (t.addEventListener)
            for (var _ = 0, c = i.length; _ < c; _++) t.addEventListener(i[_], a, !1);
        else t.attachEvent ? t.attachEvent(e("mnmQ") + i[0], a) : t[n("mnmQ") + i[0]] = a;
        return a };
    NECaptcha.prototype.O = function(t, e, i) { e = e.split(s("o3"));
        if (t.removeEventListener)
            for (var n = 0, r = e.length; n < r; n++) t.removeEventListener(e[n], i);
        else t.detachEvent ? t.detachEvent(s("mnmQ") + e[0], i) : delete t[o("mnmQ") + e[0]] };
    NECaptcha.prototype.Y = function() {
        for (var t = document.getElementsByTagName(r("mamQg3gCgB")), e = 0; e < t.length; e++) t[e].blur() };
    NECaptcha.prototype.ra = function(t, i, a, _) { t = this.pb(t);
        var c = new XMLHttpRequest,
            h = this;
        if (o("ggmagBmzBMgomCmBmCmQgBmamSmwgM") in c) c.open(n("C3BnCMCB"), _, !0), c.setRequestHeader(e("BMmnmQgBmCmQgBo6CBgag3mC"), n("mSg3g3mwmamMmSgBmamnmQongzo6ggggggo6mmmngom6o6gCgomwmCmQmMmnmBmCmBMFmMmzmSgogMmCgBM6CCCBBmo6Mz")), c.send(t), c.onload = function() { i.call(h, JSON.parse(c.responseText)) }, a == r("CngCg3mBmSgBmCCMgBmSgBgCgM") && (h.Q = setTimeout(function() { h.V = !0;
            h.s.innerHTML = o("MwmmmnmQgBo3gMgBgamwmCM6ogmMmnmwmngoMKoMBCBCMoBMMoBMMFogMQQaKKzwQzKnzSQzFmzCQmagFmQnFwzwQzKnFgQCzzFgQmamF3QaKSFCQaa6KoMwonmmmnmQgBMQ");
            h.l.style.display = r("mQmnmQmC");
            h.o.style.opacity = 1;
            h.o.innerHTML = s("MwmmmnmQgBo3gMgBgamwmCM6ogmMmnmwmngoMKoMBCBCMoBMMoBMMFogMQQaKKzwQzKnzSQzFmzCQmagFmowQzKnFgQCzzFgQmamF3QaKSFCQaa6KoMwonmmmnmQgBMQ");
            h.b[r("gmmCgomammgaBMmSmwmwmomSmMmF")](h.ta(!1));
            clearTimeout(h.Q) }, 5e3));
        else {
            var u = document.createElement(n("gMmMgomag3gB"));
            void 0 != this.b[o("mamQgMgBmSmQmMmC")] && (a == o("CngMmCgBCmmSmwgCmCgM") && (a = this.b[n("mamQgMgBmSmQmMmC")] + n("oQmgmoCMmCgB")), a == r("CngCg3mBmSgBmCCMgBmSgBgCgM") && (a = this.b[r("mamQgMgBmSmQmMmC")] + r("oQmgmoCCg3mBmSgBmC")));
            u.src = _ + r("MnmQmnmMmSmMmzmCM6") + (new Date)[n("mgmCgBCBmam6mC")]() + n("ommMmSmwmwmomSmMmFM6") + a + r("om") + t;
            document.getElementsByTagName(e("mzmCmSmB"))[0].appendChild(u);
            a == o("CngCg3mBmSgBmCCMgBmSgBgCgM") && (h.Q = setTimeout(function() { h.V = !0;
                h.s.innerHTML = s("MwmmmnmQgBo3gMgBgamwmCM6ogmMmnmwmngoMKoMBCBCMoBMMoBMMFogMQQaKKzwQzKnzSQzFmzCQmagFmQnFwzwQzKnFgQCzzFgQmamF3QaKSFCQaa6KoMwonmmmnmQgBMQ");
                h.l.style.display = s("mQmnmQmC");
                h.o.style.opacity = 1;
                h.o.innerHTML = s("MwmmmnmQgBo3gMgBgamwmCM6ogmMmnmwmngoMKoMBCBCMoBMMoBMMFogMQQaKKzwQzKnzSQzFmzCQmagFmowQzKnFgQCzzFgQmamF3QaKSFCQaa6KoMwonmmmnmQgBMQ");
                h.b[s("gmmCgomammgaBMmSmwmwmomSmMmF")](h.ta(!1));
                clearTimeout(h.Q) }, 5e3)) } };
    NECaptcha.prototype.pb = function(t) {
        var i = [],
            r;
        for (r in t) i.push(encodeURIComponent(r) + e("M6") + encodeURIComponent(t[r]));
        return i.join(n("om")) };
    NECaptcha.prototype.ma = function(t) {
        if (typeof t[o("mm")] != r("gCmQmBmCmmmamQmCmB"))
            if (this.Ba = t[n("g3")], this.ba = t[o("mMgB")], document.getElementById(s("mMmSg3CngB")) ? document.getElementById(r("mMmSg3CngB")).value = t[o("mMgB")] : this.e.setAttribute(s("mMmSg3CngB"), t[o("mMgB")]), 2 == t[s("mMgB")]) this.l.style.display = e("momwmnmMmF"), this.o.style.opacity = 1, this.q.style.display = n("mQmnmQmC"), this.F.style.display = o("momwmnmMmF"), this.ga.src = t[o("mm")], this.aa.src = t[s("mo")], this.o.innerHTML = this.b[s("mzmamQgBCBgzgB")], this.H.src = this.A + n("onmam6mSmgmCgMongMmwmamBmCgooQg3mQmg");
            else { this.q.style.display = e("momwmnmMmF");
                this.F.style.display = n("mQmnmQmC");
                this.L.src = r("") + t[r("mo")];
                r("mm");
                this.Ea = t[s("mm")].length;
                for (var i = this.b[n("gBgzgBBomCmmmngomC")], a = 0; a < t[s("mm")].length; a++) i = i + r("o3oo") + t[e("mm")].charAt(a) + o("o3oo");
                i += this.b[o("gBgzgBBSmmgBmCgo")];
                this.s.innerHTML = i }
        else this.b[r("mamQmagBBCgogomngoBzmSmQmBmwmCgo")](t) };
    NECaptcha.prototype[n("mgmoCMmCgB")] = function(t) { this.ma(t) };
    NECaptcha.prototype.pa = function(t) { clearTimeout(this.Q);
        if (this.V) this.V = !1;
        else {
            var i = this;
            this.J = t[r("gM")] ? t[s("gB")] : e("BwBgMBMoBBm6MCMMgmgMgoCKm6goCzmBCKMmmogCBzCCCmBQmmCSmMgMBwgKgSmwMSmgCmMgBzBmmzmwMCgaCKgKmwBaBwBnBKm6C3BCCaoFgooFgmBKBMmnm6mmmagoBmBgMomBmCmoMgM3MaBgCaCSCSBamnmoMmmFmCMmmMMMMSmKMmCgoFBmBFgoBCMmCSBCmgmzBMgMmzgmMCBFmMM6");
            document.getElementById(r("mMmSg3Cng3ggmB")) ? document.getElementById(r("mMmSg3Cng3ggmB")).value = this.J : this.e.setAttribute(n("mMmSg3Cng3ggmB"), this.J);
            var a = this.ta(t[s("gM")]);
            t[o("gM")] ? (this.O(this.n, s("m6mngCgMmCmBmnggmQo3gBmngCmMmzgMgBmSgogB"), this.X), this.O(this.l, n("m6mngCgMmCmBmnggmQo3gBmngCmMmzgMgBmSgogB"), this.Z), this.s.innerHTML = n("MwmmmnmQgBo3gMgBgamwmCM6ogmMmnmwmngoMKoMMMMoBMBBMMMoMFogMQQaKKzwQzKnzSQmzza3QCzKanMwonmmmnmQgBMQ"), this.I = !0, this.b[e("m6mnmBmC")] == r("mmmwmnmSgB") && (this.f.style.display = s("mQmnmQmC"), this.j.style.display = o("mQmnmQmC")), i = this, this.b[r("m6mnmBmC")] == o("g3mng3gCg3") && setTimeout(function() { i.sa(0, i) }, 600)) : (this.s.innerHTML = e("MwmmmnmQgBo3gMgBgamwmCM6ogmMmnmwmngoMKoMBCBCMoBMMoBMMFogMQQaKKzwQzKnzSQCKBFSQzFBKCMwonmmmnmQgBMQ"), i = this, setTimeout(function() { i.Qa() }, 600));
            this.H.src = this.A + n("onmam6mSmgmCgMon") + a.Ra + n("oQg3mQmg");
            this.b[n("gmmCgomammgaBMmSmwmwmomSmMmF")].call(this, a) } };
    NECaptcha.prototype[n("mgmoCCg3mBmSgBmC")] = function(t) { this.pa(t) };
    NECaptcha.prototype.ta = function(t) {
        var i = { Ra: s("gMmwmamBmCgoCngmmSmwmamB"), Pa: e("QaKKzwQzKnzSQmzza3QCzKan"), style: n("g3mngMmagBmamnmQMKo3mSmogMmnmwgCgBmCMFgBmng3MKo3MCM3oCMFm6mSgomgmamQo6gBmng3MKo3o6Mgg3gzMFgmmCgogBmamMmSmwo6mSmwmamgmQMKo3m6mamBmBmwmCMFmwmCmmgBMKo3M3"), value: !0, Ka: s("onmam6mSmgmCgMonmamMmnmQoQg3mQmgogonMQ") },
            a = { Ra: r("gMmwmamBmCgoCnmamQgmmSmwmamB"), Pa: r("QaKKzwQzKnzSQCKBFSQzFBKC"), style: s("g3mngMmagBmamnmQMKo3mSmogMmnmwgCgBmCMFgBmng3MKo3MCM3oCMFm6mSgomgmamQo6gBmng3MKo3o6Mgg3gzMFgmmCgogBmamMmSmwo6mSmwmamgmQMKo3m6mamBmBmwmCMFmwmCmmgBMKo3M3"), value: !1, Ka: o("onmam6mSmgmCgMonmamMmnmQCnmQmnoQg3mQmgogonMQ") };
        return t ? i : a };
    NECaptcha.prototype.Qa = function() { this.B.style.display = o("mQmnmQmC");
        this.b[s("m6mnmBmC")] != s("g3mng3gCg3") && (this.f.style.display = e("mQmnmQmC"));
        this.b[e("m6mnmBmC")] != e("mmmwmnmSgB") && (this.f.style.display = e("momwmnmMmF"));
        this.O(this.n, r("m6mngCgMmCmBmnggmQ"), this.X);
        this.O(this.l, s("m6mngCgMmCmBmnggmQo3gBmngCmMmzgMgBmSgogB"), this.Z);
        this.Z = this.g(this.l, s("m6mngCgMmCmBmnggmQo3gBmngCmMmzgMgBmSgogB"), this.Oa, this);
        this.X = this.g(this.n, n("m6mngCgMmCmBmnggmQ"), this.Na, this);
        this.Ha(this.o, 1);
        this.Za(this.l);
        this.D = [];
        this.G = [];
        this.ea = [];
        this.ua = this.va = this.xa = this.I = !1;
        this.C.style.left = this.na + 1 + n("g3gz");
        this.n.innerHTML = n("");
        this.n.appendChild(this.L);
        this.V = !1;
        this.ra(this.W, this.ma, r("CngMmCgBCmmSmwgCmCgM"), this.ha) };
    NECaptcha.prototype[s("gomCmmgomCgMmz")] = function(t) {
        this.J = n("");
        document.getElementById(s("mMmSg3Cng3ggmB")) ? document.getElementById(n("mMmSg3Cng3ggmB")).value = this.J : this.e.setAttribute(o("mMmSg3Cng3ggmB"), this.J);
        for (var i in t) - 1 < this.mb.toString().indexOf(i) && (this.b[i] = t[i]);
        this.W = this.Ia(this.b);
        t = this.b[s("mmmngomMmCBzgBgBg3gM")] ? e("mzgBgBg3gMMK") : window[s("mwmnmMmSgBmamnmQ")].protocol;
        this.A = t + o("onon") + this.b[n("gMgBmSgBmamMCMmCgogmmCgo")];
        this.K = t + o("onon") + this.b[n("mSg3maCMmCgogmmCgo")];
        this.ha = this.K + r("onmMmSg3gBmMmzmSonmgmCgBoQmKgMmnmQ");
        this.ca = this.K + o("onmMmSg3gBmMmzmSonmMmzmCmMmFoQmKgMmnmQ");
        this.Qa()
    };
    NECaptcha.prototype.Ya = function() { this.back.className = e("mQmMg3gBCnmomSmMmFmggomngCmQmB");
        this.back.id = r("momSmMmF");
        document.body.appendChild(this.back);
        this.form.style.position = e("mmmagzmCmB");
        this.form.style.backgroundColor = r("ggmzmagBmC");
        this.form.style.zIndex = o("MSM3MC");
        this.form.style.display = n("momwmnmMmF");
        this.form.style.opacity = o("MS");
        this.form.style.width = 1.1 * this.b[n("ggmamBgBmz")] + r("g3gz");
        this.form.style.height = .5 * this.b[s("ggmamBgBmz")] + o("g3gz");
        this.form.style.top = o("MCM3oC");
        this.form.style.left = o("MCM3oC");
        this.form.style.marginTop = .5 * -this.b[n("ggmamBgBmz")] / 2 + n("g3gz");
        this.form.style.marginLeft = 1.1 * -this.b[s("ggmamBgBmz")] / 2 + r("g3gz");
        this.form.style.borderRadius = 5 + n("g3gz");
        this.e.style.marginTop = .32 * this.b[n("ggmamBgBmz")] + r("g3gz");
        this.e.style.marginLeft = .05 * this.b[n("ggmamBgBmz")] + r("g3gz");
        this.back.appendChild(this.form);
        this.g(this.form, s("m6mngCgMmCmBmnggmQ"), function(t) { t = t || window.event;
            t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0 }, this);
        this.ja.style.width = this.b[s("ggmamBgBmz")] / 20 + e("g3gz");
        this.ja.style.height = this.b[r("ggmamBgBmz")] / 20 + s("g3gz");
        this.g(this.back, s("m6mngCgMmCmBmnggmQ"), this.sa, this);
        this.ja.src = this.A + e("onmam6mSmgmCgMonmamMmnmQCnmQmnoQg3mQmg");
        this.R.className = r("mQmMg3gBCnmMmwmngMmCC3mn");
        this.R.appendChild(this.ja);
        this.R.style.marginLeft = 1.05 * this.b[e("ggmamBgBmz")] + o("g3gz");
        this.form.appendChild(this.R);
        this.g(this.R, s("m6mngCgMmCmBmnggmQ"), this.sa, this);
        this.f.style.display = e("momwmnmMmF");
        this.j.style.display = e("momwmnmMmF");
        this.form.appendChild(this.e);
        this.back.style.display = s("mQmnmQmC") };
    NECaptcha.prototype.sa = function(t, e) { e.back.style.display = r("mQmnmQmC") };
    NECaptcha.prototype[s("mnmQCmmSmwmamBmSgBmC")] = function(t) { this.back.style.display = s("momwmnmMmF");
        this.b[o("gmmCgomammgaBMmSmwmwmomSmMmF")] = t };
    NECaptcha.prototype.bb = function() {
        var t = o("BCmMmSg3gBmMmzmSCnMooQM3");
        if (!document.getElementById(t)) {
            var i = document.getElementsByTagName(r("mzmCmSmB"))[0],
                s = document.createElement(n("mwmamQmF"));
            s.id = t;
            s.rel = o("gMgBgamwmCgMmzmCmCgB");
            s.type = e("gBmCgzgBonmMgMgM");
            s.href = this.A + n("onmMgMgMonBCmMmSg3gBmMmzmSCnMooQM3oQmMgMgMMngmM6") + Math.random().toString(36).substring(7);
            s.media = o("mSmwmw");
            i.appendChild(s) } };
    NECaptcha.prototype[e("mgmCgBC3ggmB")] = function() {
        return this.J };
    NECaptcha.prototype[s("mgmCgBBMgB")] = function() {
        return this.ba };
    ! function(t) {
        function i(t, e) {
            if (null == t) return null;
            for (var i = x(e), n = [], r = t.length, s = 0; s < r; s++) n.push($(t[s], i));
            return n }

        function a(t) {
            if (null == t) return null;
            for (var e = [], i = 0, n = t.length; i < n; i++) {
                var r = t[i];
                e[i] = E[16 * (r >>> 4 & 15) + (15 & r)] }
            return e }

        function _(t) {
            var e = [];
            if (null == t || void 0 == t || 0 == t.length) return d(4);
            if (4 <= t.length) return m(t, 0, 4);
            for (var i = 0; 4 > i; i++) e[i] = t[i % t.length];
            return e }

        function c(t) {
            return null == t ? h([]) : h(g(t)) }

        function h(t) {
            var e = 4294967295;
            if (null != t)
                for (var i = 0; i < t.length; i++) e = e >>> 8 ^ M[255 & (e ^ t[i])];
            t = p(4294967295 ^ e);
            e = t.length;
            if (null == t || 0 > e) t = new String(s(""));
            else {
                for (var i = [], n = 0; n < e; n++) i.push(y(t[n]));
                t = i.join(r("")) }
            return t }

        function u(t) {
            if (null == t || void 0 == t) return null;
            if (0 == t.length) return r("");
            try {
                for (var i = [], n = 0; n < t.length;)
                    if (n + 3 <= t.length) i.push(l(t, n, 3)), n += 3;
                    else { i.push(l(t, n, t.length - n));
                        break }
                return i.join(e("")) } catch (s) {
                throw Error(e("MSM3MSM3")) } }

        function l(t, i, a) {
            var _, c = [n("ma"), o("on"), r("gz"), o("MS"), n("Cz"), e("mg"), o("CC"), e("M3"), e("gK"), e("Mg"), o("mF"), r("Mz"), s("BQ"), n("oF"), n("mw"), o("BM"), o("g3"), e("Bn"), s("mQ"), s("C3"), s("go"), n("gm"), r("Mm"), r("Cw"), s("gS"), r("gC"), r("Mo"), e("Bg"), e("mK"), e("Ma"), e("Bz"), o("Co"), r("mM"), r("gg"), n("CB"), s("Ca"), n("CK"), e("MB"), s("mo"), o("mm"), s("CM"), n("BK"), n("Bo"), s("mz"), r("mS"), e("Cg"), e("gM"), r("gB"), o("BS"), r("mC"), n("mn"), r("B6"), n("Ba"), o("BC"), s("CS"), o("MC"), e("m6"), o("BB"), r("mB"), r("Cm"), s("Bm"), r("Bw"), n("BF"), e("ga")],
                h = o("MM"),
                u = [];
            if (1 == a) a = t[i], _ = 0, u.push(c[a >>> 2 & 63]), u.push(c[(a << 4 & 48) + (_ >>> 4 & 15)]), u.push(h), u.push(h);
            else if (2 == a) a = t[i], _ = t[i + 1], t = 0, u.push(c[a >>> 2 & 63]), u.push(c[(a << 4 & 48) + (_ >>> 4 & 15)]), u.push(c[(_ << 2 & 60) + (t >>> 6 & 3)]), u.push(h);
            else if (3 == a) a = t[i], _ = t[i + 1], t = t[i + 2], u.push(c[a >>> 2 & 63]), u.push(c[(a << 4 & 48) + (_ >>> 4 & 15)]), u.push(c[(_ << 2 & 60) + (t >>> 6 & 3)]), u.push(c[63 & t]);
            else throw Error(e("MSM3MSM3"));
            return u.join(r("")) }

        function d(t) {
            for (var e = [], i = 0; i < t; i++) e[i] = 0;
            return e }

        function f(t, e, i, s, o) {
            if (null == t || 0 == t.length) return i;
            if (null == i) throw Error(n("MSM3M3MB"));
            if (t.length < o) throw Error(r("MSM3M3MM"));
            for (var a = 0; a < o; a++) i[s + a] = t[e + a];
            return i }

        function m(t, e, i) {
            var n = [];
            if (null == t || 0 == t.length) return n;
            if (t.length < i) throw Error(s("MSM3M3MM"));
            for (var r = 0; r < i; r++) n[r] = t[e + r];
            return n }

        function p(t) {
            var e = [];
            e[0] = t >>> 24 & 255;
            e[1] = t >>> 16 & 255;
            e[2] = t >>> 8 & 255;
            e[3] = 255 & t;
            return e }

        function g(t) {
            if (null == t || void 0 == t) return t;
            t = encodeURIComponent(t);
            for (var e = [], i = t.length, s = 0; s < i; s++)
                if (t.charAt(s) == n("oC"))
                    if (s + 2 < i) e.push(v(t.charAt(++s) + r("") + t.charAt(++s))[0]);
                    else throw Error(n("MSM3M3Ma"));
            else e.push(t.charCodeAt(s));
            return e }

        function v(t) {
            if (null == t || 0 == t.length) return [];
            t = new String(t);
            for (var e = [], i = t.length / 2, n = 0, r = 0; r < i; r++) {
                var s = parseInt(t.charAt(n++), 16) << 4,
                    o = parseInt(t.charAt(n++), 16);
                e[r] = x(s + o) }
            return e }

        function y(t) {
            var e = [];
            e.push(C[t >>> 4 & 15]);
            e.push(C[15 & t]);
            return e.join(r("")) }

        function b(t, e) {
            if (null == t || null == e || t.length != e.length) return t;
            for (var i = [], n = 0, r = t.length; n < r; n++) i[n] = $(t[n], e[n]);
            return i }

        function $(t, e) { t = x(t);
            e = x(e);
            return x(t ^ e) }

        function x(t) {
            if (-128 > t) return x(128 - (-128 - t));
            if (-128 <= t && 127 >= t) return t;
            if (127 < t) return x(-129 + t - 127);
            throw Error(e("MSM3M3MS")) }
        var C = [n("M3"), s("MS"), n("Mo"), o("MM"), s("MB"), r("MC"), o("Mm"), s("Mg"), s("Mz"), e("Ma"), n("mS"), e("mo"), o("mM"), r("mB"), r("mC"), o("mm")],
            M = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117],
            E = [120, 85, -95, -84, 122, 38, -16, -53, -11, 16, 55, 3, 125, -29, 32, -128, -94, 77, 15, 106, -88, -100, -34, 88, 78, 105, -104, -90, -70, 90, -119, -28, -19, -47, -111, 117, -105, -62, -35, 2, -14, -32, 114, 23, -21, 25, -7, -92, 96, -103, 126, 112, -113, -65, -109, -44, 47, 48, 86, 75, 62, -26, 72, -56, -27, 66, -42, 63, 14, 92, 59, -101, 19, -33, 12, -18, -126, -50, -67, 42, 7, -60, -81, -93, -86, 40, -69, -37, 98, -63, -59, 108, 46, -45, 93, 102, 65, -79, 73, -23, -46, 37, -114, -15, 44, -54, 99, -10, 60, -96, 76, 26, 61, -107, 18, -116, -55, -40, 57, -76, -82, 45, 0, -112, -77, 29, 43, -30, 109, -91, -83, 107, 101, 81, -52, -71, 84, 36, -41, 68, 39, -75, -122, -6, 11, -80, -17, -74, -73, 35, 49, -49, -127, 80, 103, 79, -25, 52, -43, 56, 41, -61, -24, 17, -118, 115, -38, 8, -78, 33, -85, -106, 58, -98, -108, 94, 116, -125, -51, -9, 71, 82, 87, -115, 9, 69, -123, 123, -117, 113, -22, -124, -87, 64, 13, 21, -89, -2, -99, -97, 1, -4, 34, 20, 83, 119, 30, -12, -110, -66, 118, -48, 6, -36, 104, -58, -102, 97, 5, -20, 31, -72, 70, -39, 67, -68, -57, 110, 89, 51, 10, -120, 28, 111, 127, 22, -3, 54, 53, -1, 100, 74, 50, 91, 27, -31, -5, -64, 124, -121, 24, -13, 95, 121, -8, 4],
            i = function(t, e) {
                if (null == t) return null;
                for (var i = x(e), n = [], r = t.length, s = 0; s < r; s++) n.push($(t[s], i));
                return n
            };
        t.fa = function(t) {
            var e = r("MSMBMgMMMSMMMzMomBMzMSMmMgMSMBmmBMMCMaBCMBMgBBmCMCmBBSM3BMMzMgMSBBMMBm");
            if (null == e || void 0 == e) throw Error(s("MSM3M3Mz"));
            if (null == t || void 0 == t) t = o("");
            t += c(t);
            t = g(t);
            var e = g(e),
                n = t;
            null == n && (n = []);
            var h = [];
            for (t = 0; 4 > t; t++) {
                var l = 256 * Math.random(),
                    l = Math.floor(l);
                h[t] = x(l) }
            e = _(e);
            e = b(e, _(h));
            t = e = _(e);
            if (null == n || void 0 == n || 0 == n.length) n = d(4);
            else {
                var l = n.length,
                    m = 0,
                    m = 0 >= l % 4 ? 4 - l % 4 - 4 : 8 - l % 4 - 4,
                    v = [];
                f(n, 0, v, 0, l);
                for (n = 0; n < m; n++) v[l + n] = 0;
                f(p(l), 0, v, l + m, 4);
                n = v }
            l = n;
            if (null == l || 0 != l.length % 4) throw Error(r("MSM3M3MC"));
            for (var n = [], m = 0, v = l.length / 4, y = 0; y < v; y++) { n[y] = [];
                for (var $ = 0; 4 > $; $++) n[y][$] = l[m++] }
            l = [];
            f(h, 0, l, 0, 4);
            h = n.length;
            for (m = 0; m < h; m++) { v = i(n[m], 56);
                if (null == v) v = null;
                else {
                    for (var y = x(-40), $ = [], C = v.length, M = 0; M < C; M++) $.push(x(v[M] + y));
                    v = $ }
                v = i(v, 103);
                v = b(v, e);
                y = t;
                if (null == v) v = null;
                else if (null != y) {
                    for (var $ = [], C = y.length, M = 0, E = v.length; M < E; M++) $[M] = x(v[M] + y[M % C]);
                    v = $ }
                v = b(v, t);
                t = a(v);
                t = a(t);
                f(t, 0, l, 4 * m + 4, 4) }
            return u(l) };
        t.ob = x;
        t.zb = g;
        t.sb = m;
        t.tb = f;
        t.vb = d;
        t.yb = function(t) {
            return null == t || void 0 == t || t == n("") };
        t.ub = function(t) {
            return u(g(t)) };
        t.xb = c;
        t.ob = x;
        return t
    }(a.U)
}();
if ("undefined" == typeof I$) I$ = function() {
    var t = {},
        e = function() {
            return !1 },
        i = {};
    var n = function(e, i) {
        return t.toString.call(e) === "[object " + i + "]" };
    return function(t, r) {
        var s = i[t],
            o = n(r, "Function");
        if (null != r && !o) s = r;
        if (o) {
            var a = [];
            for (var _ = 2, c = arguments.length; _ < c; _++) a.push(arguments.callee(arguments[_]));
            var h = {};
            a.push.call(a, h, {}, e, []);
            var u = r.apply(null, a) || h;
            if (!s || !n(u, "Object")) s = u;
            else if (Object.keys)
                for (var l = Object.keys(u), _ = 0, c = l.length, d; _ < c; _++) { d = l[_];
                    s[d] = u[d] } else
                    for (var d in u) s[d] = u[d] }
        if (null == s) s = {};
        i[t] = s;
        return s } }();
I$(15, function(t, e, i, n) {
    var r = Function.prototype;
    r._$aop = function(t, e) {
        var e = e || i,
            t = t || i,
            r = this;
        return function() {
            var i = { args: n.slice.call(arguments, 0) };
            t(i);
            if (!i.stopped) { i.value = r.apply(this, i.args);
                e(i) }
            return i.value } };
    r._$bind = function() {
        var t = arguments,
            e = arguments[0],
            i = this;
        return function() {
            var r = n.slice.call(t, 1);
            n.push.apply(r, arguments);
            return i.apply(e || null, r) } };
    r._$bind2 = function() {
        var t = arguments,
            e = n.shift.call(t),
            i = this;
        return function() { n.push.apply(arguments, t);
            return i.apply(e || null, arguments) } };
    var r = String.prototype;
    if (!r.trim) r.trim = function() {
        var t = /(?:^\s+)|(?:\s+$)/g;
        return function() {
            return this.replace(t, "") } }();
    if (!this.console) this.console = { log: i, error: i };
    if (!0) { NEJ = this.NEJ || {};
        NEJ.copy = function(t, i) { t = t || {};
            i = i || e;
            for (var n in i)
                if (i.hasOwnProperty(n)) t[n] = i[n];
            return t };
        NEJ = NEJ.copy(NEJ, { O: e, R: n, F: i, P: function(t) {
                if (!t || !t.length) return null;
                var e = window;
                for (var i = t.split("."), n = i.length, r = "window" == i[0] ? 1 : 0; r < n; e = e[i[r]] = e[i[r]] || {}, r++);
                return e } });
        return NEJ }
    return t });
I$(50, function(t, e, i, n) { t.__forIn = function(t, e, i) {
        if (!t || !e) return null;
        var n = Object.keys(t);
        for (var r = 0, s = n.length, o, a; r < s; r++) { o = n[r];
            a = e.call(i || null, t[o], o, t);
            if (a) return o }
        return null };
    t.__forEach = function(t, e, i) { t.forEach(e, i) };
    t.__col2array = function(t) {
        return n.slice.call(t, 0) };
    t.__str2time = function(t) {
        return Date.parse(t) };
    return t });
I$(18, function(t, e, i, n, r) {
    var s = this.navigator.platform,
        o = this.navigator.userAgent;
    var a = { mac: s, win: s, linux: s, ipad: o, ipod: o, iphone: s, android: o };
    e._$IS = a;
    for (var _ in a) a[_] = new RegExp(_, "i").test(a[_]);
    a.ios = a.ipad || a.iphone || a.ipod;
    a.tablet = a.ipad;
    a.desktop = a.mac || a.win || a.linux && !a.android;
    e._$is = function(t) {
        return !!a[t] };
    var c = { engine: "unknow", release: "unknow", browser: "unknow", version: "unknow", prefix: { css: "", pro: "", clz: "" } };
    e._$KERNEL = c;
    if (/msie\s+(.*?);/i.test(o) || /trident\/.+rv:([\d\.]+)/i.test(o)) { c.engine = "trident";
        c.browser = "ie";
        c.version = RegExp.$1;
        c.prefix = { css: "ms", pro: "ms", clz: "MS", evt: "MS" };
        var h = { 6: "2.0", 7: "3.0", 8: "4.0", 9: "5.0", 10: "6.0", 11: "7.0" };
        c.release = h[document.documentMode] || h[parseInt(c.version)] } else if (/webkit\/?([\d.]+?)(?=\s|$)/i.test(o)) { c.engine = "webkit";
        c.release = RegExp.$1 || "";
        c.prefix = { css: "webkit", pro: "webkit", clz: "WebKit" } } else if (/rv\:(.*?)\)\s+gecko\//i.test(o)) { c.engine = "gecko";
        c.release = RegExp.$1 || "";
        c.browser = "firefox";
        c.prefix = { css: "Moz", pro: "moz", clz: "Moz" };
        if (/firefox\/(.*?)(?=\s|$)/i.test(o)) c.version = RegExp.$1 || "" } else if (/presto\/(.*?)\s/i.test(o)) { c.engine = "presto";
        c.release = RegExp.$1 || "";
        c.browser = "opera";
        c.prefix = { css: "O", pro: "o", clz: "O" };
        if (/version\/(.*?)(?=\s|$)/i.test(o)) c.version = RegExp.$1 || "" }
    if ("unknow" == c.browser) {
        var h = ["chrome", "maxthon", "safari"];
        for (var u = 0, l = h.length, d; u < l; u++) { d = "safari" == h[u] ? "version" : h[u];
            if (new RegExp(d + "/(.*?)(?=\\s|$)", "i").test(o)) { c.browser = h[u];
                c.version = RegExp.$1.trim();
                break } } }
    e._$SUPPORT = {};
    e._$support = function(t) {
        return !!e._$SUPPORT[t] };
    if (!0) t.copy(t.P("nej.p"), e);
    return e }, 15);
I$(23, function(t, e, i, n, r, s) {
    if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "4.0") I$(54, function() { t.__forIn = function(t, e, i) {
            if (t && e) {
                var n;
                for (var r in t)
                    if (t.hasOwnProperty(r)) { n = e.call(i, t[r], r, t);
                        if (n) return r } else; } };
        t.__forEach = function(t, e, i) {
            for (var n = 0, r = t.length; n < r; n++) e.call(i, t[n], n, t) };
        t.__col2array = function(t) {
            var e = [];
            if (t && t.length)
                for (var i = 0, n = t.length; i < n; i++) e.push(t[i]);
            return e };
        t.__str2time = function() {
            var t = /-/g;
            return function(e) {
                return Date.parse(e.replace(t, "/").split(".")[0]) } }() });
    return t }, 50, 18);
I$(1, function(t, e, i, n, r, s) { i._$klass = function() {
        var t = function() {
            return "[object Function]" !== n.toString.call(arguments[0]) };
        var i = function(t, i) {
            for (; i;) {
                var n = i.prototype,
                    r = e.__forIn(n, function(e) {
                        return t === e });
                if (null != r) return { name: r, klass: i };
                i = i._$super } };
        return function() {
            var n = function() {
                return this.__init.apply(this, arguments) };
            n.prototype.__init = r;
            n._$extend = function(n, r) {
                if (!t(n)) {
                    var s = this;
                    if (r !== !1) e.__forIn(n, function(e, i) {
                        if (!t(e)) s[i] = e });
                    this._$super = n;
                    var o = function() {};
                    o.prototype = n.prototype;
                    this.prototype = new o;
                    this.prototype.constructor = this;
                    var a = [],
                        _ = {};
                    var c = function(t, e) {
                        var n = i(t, e);
                        if (n) {
                            if (a[a.length - 1] != n.name) a.push(n.name);
                            _[n.name] = n.klass._$super;
                            return n.name } };
                    this.prototype.__super = function() {
                        var t = a[a.length - 1],
                            e = arguments.callee.caller;
                        if (!t) t = c(e, this.constructor);
                        else {
                            var i = _[t].prototype;
                            if (!i.hasOwnProperty(e) || e != i[t]) t = c(e, this.constructor);
                            else _[t] = _[t]._$super }
                        var n = _[t].prototype[t].apply(this, arguments);
                        if (t == a[a.length - 1]) { a.pop();
                            delete _[t] }
                        return n };
                    if (!0) {
                        var h = this.prototype;
                        h.__supInit = h.__super;
                        h.__supReset = h.__super;
                        h.__supDestroy = h.__super;
                        h.__supInitNode = h.__super;
                        h.__supDoBuild = h.__super;
                        h.__supOnShow = h.__super;
                        h.__supOnHide = h.__super;
                        h.__supOnRefresh = h.__super;
                        this._$supro = n.prototype }
                    return this.prototype } };
            return n } }();
    if (!0) { t.C = i._$klass;
        t.copy(this.NEJ, t) }
    return i }, 15, 23);
I$(4, function(t, e, i, n, r, s) {
    var o = function(t, e) {
        try { e = e.toLowerCase();
            if (null === t) return "null" == e;
            if (void 0 === t) return "undefined" == e;
            else return n.toString.call(t).toLowerCase() == "[object " + e + "]" } catch (i) {
            return !1 } };
    i._$isFunction = function(t) {
        return o(t, "function") };
    i._$isString = function(t) {
        return o(t, "string") };
    i._$isNumber = function(t) {
        return o(t, "number") };
    i._$isBoolean = function(t) {
        return o(t, "boolean") };
    i._$isDate = function(t) {
        return o(t, "date") };
    i._$isArray = function(t) {
        return o(t, "array") };
    i._$isObject = function(t) {
        return o(t, "object") };
    i._$length = function() {
        var t = /[^\x00-\xff]/g;
        return function(e) {
            return ("" + (e || "")).replace(t, "**").length } }();
    i._$loop = function(t, n, r) {
        if (i._$isObject(t) && i._$isFunction(n)) return e.__forIn.apply(e, arguments);
        else return null };
    i._$indexOf = function(t, e) {
        var n = i._$isFunction(e) ? e : function(t) {
                return t === e },
            r = i._$forIn(t, n);
        return null != r ? r : -1 };
    i._$binSearch = function() {
        var t;
        var e = function(i, n, r) {
            if (n > r) return -1;
            var s = Math.ceil((n + r) / 2),
                o = t(i[s], s, i);
            if (0 == o) return s;
            if (o < 0) return e(i, n, s - 1);
            else return e(i, s + 1, r) };
        return function(i, n) { t = n || r;
            return e(i, 0, i.length - 1) } }();
    i._$reverseEach = function(t, e, n) {
        if (t && t.length && i._$isFunction(e))
            for (var r = t.length - 1; r >= 0; r--)
                if (e.call(n, t[r], r, t)) return r;
        return null };
    i._$forEach = function(t, n, r) {
        if (t && t.length && i._$isFunction(n))
            if (!t.forEach) i._$forIn.apply(i, arguments);
            else e.__forEach(t, n, r) };
    i._$forIn = function(t, e, n) {
        if (!t || !i._$isFunction(e)) return null;
        if (i._$isNumber(t.length)) {
            for (var r = 0, s = t.length; r < s; r++)
                if (e.call(n, t[r], r, t)) return r } else if (i._$isObject(t)) return i._$loop(t, e, n);
        return null };
    i._$encode = function(t, e) { e = "" + e;
        if (!t || !e) return e || "";
        else return e.replace(t.r, function(e) {
            var i = t[!t.i ? e.toLowerCase() : e];
            return null != i ? i : e }) };
    i._$escape = function() {
        var t = /<br\/?>$/,
            e = { r: /\<|\>|\&|\r|\n|\s|\'|\"/g, "<": "&lt;", ">": "&gt;", "&": "&amp;", " ": "&nbsp;", '"': "&quot;", "'": "&#39;", "\n": "<br/>", "\r": "" };
        return function(n) { n = i._$encode(e, n);
            return n.replace(t, "<br/><br/>") } }();
    i._$unescape = function() {
        var t = { r: /\&(?:lt|gt|amp|nbsp|#39|quot)\;|\<br\/\>/gi, "&lt;": "<", "&gt;": ">", "&amp;": "&", "&nbsp;": " ", "&#39;": "'", "&quot;": '"', "<br/>": "\n" };
        return function(e) {
            return i._$encode(t, e) } }();
    i._$format = function() {
        var t = { i: !0, r: /\byyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w|ct|et\b/g },
            e = ["上午", "下午"],
            n = ["A.M.", "P.M."],
            r = ["日", "一", "二", "三", "四", "五", "六"],
            s = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
            o = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        var a = function(t) { t = parseInt(t) || 0;
            return (t < 10 ? "0" : "") + t };
        var _ = function(t) {
            return t < 12 ? 0 : 1 };
        return function(c, h, u) {
            if (!c || !h) return "";
            c = i._$var2date(c);
            t.yyyy = c.getFullYear();
            t.yy = ("" + t.yyyy).substr(2);
            t.M = c.getMonth() + 1;
            t.MM = a(t.M);
            t.eM = o[t.M - 1];
            t.cM = s[t.M - 1];
            t.d = c.getDate();
            t.dd = a(t.d);
            t.H = c.getHours();
            t.HH = a(t.H);
            t.m = c.getMinutes();
            t.mm = a(t.m);
            t.s = c.getSeconds();
            t.ss = a(t.s);
            t.ms = c.getMilliseconds();
            t.w = r[c.getDay()];
            var l = _(t.H);
            t.ct = e[l];
            t.et = n[l];
            if (u) t.H = t.H % 12;
            return i._$encode(t, h) } }();
    i._$var2date = function(t) {
        var n = t;
        if (i._$isString(t)) n = new Date(e.__str2time(t));
        if (!i._$isDate(n)) n = new Date(t);
        return n };
    i._$fixed = function(t, e) {
        return parseFloat(new Number(t).toFixed(e)) };
    i._$absolute = function() {
        var t = /([^\/:])\/.*$/,
            e = /\/[^\/]+$/,
            i = /[#\?]/,
            n = location.href.split(/[?#]/)[0],
            r = document.createElement("a");
        var s = function(t) {
            return (t || "").indexOf("://") > 0 };
        var o = function(t) {
            return (t || "").split(i)[0].replace(e, "/") };
        var a = function(e, i) {
            if (0 == e.indexOf("/")) return i.replace(t, "$1") + e;
            else return o(i) + e;
        };
        n = o(n);
        return function(t, e) { t = (t || "").trim();
            if (!s(e)) e = n;
            if (!t) return e;
            if (s(t)) return t;
            t = a(t, e);
            r.href = t;
            t = r.href;
            return s(t) ? t : r.getAttribute("href", 4) }
    }();
    i._$url2origin = function() {
        var t = /^([\w]+?:\/\/.*?(?=\/|$))/i;
        return function(e) {
            if (t.test(e || "")) return RegExp.$1.toLowerCase();
            else return "" } }();
    i._$string2object = function(t, e) {
        var n = {};
        i._$forEach((t || "").split(e), function(t) {
            var e = t.split("=");
            if (e && e.length) {
                var i = e.shift();
                if (i) n[decodeURIComponent(i)] = decodeURIComponent(e.join("=")) } });
        return n };
    i._$object2string = function(t, e, n) {
        if (!t) return "";
        var r = [];
        i._$loop(t, function(t, e) {
            if (!i._$isFunction(t)) {
                if (i._$isDate(t)) t = t.getTime();
                else if (i._$isArray(t)) t = t.join(",");
                else if (i._$isObject(t)) t = JSON.stringify(t);
                if (n) t = encodeURIComponent(t);
                r.push(encodeURIComponent(e) + "=" + t) } });
        return r.join(e || ",") };
    i._$query2object = function(t) {
        return i._$string2object(t, "&") };
    i._$object2query = function(t) {
        return i._$object2string(t, "&", !0) };
    i._$object2array = function(t) {
        return e.__col2array(t) };
    i._$array2object = function(t, e) {
        var n = {};
        i._$forEach(t, function(t) {
            var i = t;
            if (e) i = e(t);
            if (null != i) n[i] = t });
        return n };
    i._$number2string = function(t, e) {
        var i = ("" + t).length,
            n = Math.max(1, parseInt(e) || 0),
            r = n - i;
        if (r > 0) t = new Array(r + 1).join("0") + t;
        return "" + t };
    i._$safeDelete = function(t, e) {
        if (!i._$isArray(e)) try { delete t[e] } catch (n) { t[e] = void 0 } else i._$forEach(e, function(e) { i._$safeDelete(t, e) }) };
    i._$randString = function() {
        var t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        return function(e) { e = e || 10;
            var i = [];
            for (var n = 0, r; n < e; ++n) { r = Math.floor(Math.random() * t.length);
                i.push(t.charAt(r)) }
            return i.join("") } }();
    i._$randNumber = function(t, e) {
        return Math.floor(Math.random() * (e - t) + t) };
    i._$randNumberString = function(t) { t = Math.max(0, Math.min(t || 8, 30));
        var e = Math.pow(10, t - 1),
            n = 10 * e;
        return i._$randNumber(e, n).toString() };
    i._$uniqueID = function() {
        var t = +new Date;
        return function() {
            return "" + t++ } }();
    i._$query = function(t, e) { t = t || n;
        var i = (e || "").split(".");
        for (var r = 0, s = i.length; r < s; r++) { t = t[i[r]];
            if (!t) break }
        return t };
    i._$merge = function() {
        var t = arguments.length - 1,
            e = arguments[t];
        if (i._$isFunction(e)) t -= 1;
        else e = r;
        var n = arguments[0] || {};
        for (var s = 1; s <= t; s++) i._$loop(arguments[s], function(t, i) {
            if (!e(t, i)) n[i] = t });
        return n };
    i._$fetch = function(t, e) {
        if (e) i._$loop(t, function(t, i, n) {
            var r = e[i];
            if (null != r) n[i] = r });
        return t };
    i._$hasProperty = function(t) {
        if (!t) return !1;
        if (null != t.length) return t.length > 0;
        var e = 0;
        i._$loop(t, function() { e++;
            return e > 0 });
        return e > 0 };
    if (!0) { t.Q = i._$query;
        t.X = i._$merge;
        t.EX = i._$fetch;
        t.copy(this.NEJ, t);
        t.copy(t.P("nej.u"), i) }
    return i
}, 15, 23);
I$(112, function(t, e, i, n, r, s) {
    var o = {};
    i.__url2host = function() {
        var t = /^([\w]+?:\/\/.*?(?=\/|$))/i;
        return function(e) { e = e || "";
            if (t.test(e)) return RegExp.$1;
            else return location.protocol + "//" + location.host } }();
    i.__set = function(t, e) { o[t] = e };
    i.__get = function(t) {
        return o[t] };
    var a = function() {
        var t = { portrait: { name: "portrait", dft: "portrait/" }, "ajax.swf": { name: "ajax", dft: "nej_proxy_flash.swf" }, "chart.swf": { name: "chart", dft: "nej_flex_chart.swf" }, "audio.swf": { name: "audio", dft: "nej_player_audio.swf" }, "video.swf": { name: "video", dft: "nej_player_video.swf" }, "clipboard.swf": { name: "clipboard", dft: "nej_clipboard.swf" }, "upload.image.swf": { name: "uploadimage", dft: "nej_upload_image.swf" } };
        var r = function(t) {
            var e = {};
            if (!t || !t.length) return e;
            for (var n = 0, r = t.length, s; n < r; n++) { s = t[n];
                if (s.indexOf("://") > 0) e[i.__url2host(s)] = s }
            return e };
        return function(s) { i.__set("root", s.root || "/res/");
            var o = i.__get("root");
            e._$loop(t, function(t, e, n) { i.__set(e, s[t.name] || o + t.dft) });
            var a = s.p_csrf;
            if (a === !0) a = { cookie: "AntiCSRF", param: "AntiCSRF" };
            a = a || n;
            i.__set("csrf", { param: a.param || "", cookie: a.cookie || "" });
            i.__set("frames", r(s.p_frame));
            i.__set("flashs", r(s.p_flash)) } }();
    a(this.NEJ_CONF || n);
    return i }, 15, 4);
I$(90, function(t, e, i, n, r, s) {
    if ("trident" === e._$KERNEL.engine) I$(114, function() { t.__set("storage.swf", (this.NEJ_CONF || n).storage || t.__get("root") + "nej_storage.swf") });
    if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "3.0") I$(115, function() { t.__set("blank.png", (this.NEJ_CONF || n).blank || t.__get("root") + "nej_blank.gif") });
    return t }, 112, 18);
I$(55, function(t, e, i, n, r, s) { i._$getFrameProxy = function(t) {
        var n = e.__url2host(t);
        return i._$get("frames")[n] || n + "/res/nej_proxy_frame.html" };
    i._$getFlashProxy = function(t) {
        return i._$get("flashs")[e.__url2host(t)] };
    i._$get = function(t) {
        return e.__get(t) };
    if (!0) t.copy(t.P("nej.c"), i);
    return i }, 15, 90);
I$(24, function(t, e, i, n, r, s) {
    var o = +new Date;
    i._$CODE_NOTFUND = 1e4 - o;
    i._$CODE_NOTASGN = 10001 - o;
    i._$CODE_NOTSPOT = 10002 - o;
    i._$CODE_TIMEOUT = 10003 - o;
    i._$CODE_ERREVAL = 10004 - o;
    i._$CODE_ERRCABK = 10005 - o;
    i._$CODE_ERRSERV = 10006 - o;
    i._$CODE_ERRABRT = 10007 - o;
    i._$HEAD_CT = "Content-Type";
    i._$HEAD_CT_PLAN = "text/plain";
    i._$HEAD_CT_FILE = "multipart/form-data";
    i._$HEAD_CT_FORM = "application/x-www-form-urlencoded";
    i._$BLANK_IMAGE = e._$get("blank.png") || "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
    if (!0) t.copy(t.P("nej.g"), i);
    return i }, 15, 55);
I$(16, function(t, e) {
    var i = {};
    e._$merge = function(e) { t._$merge(i, e) };
    e._$dump = function() {
        return i };
    e._$clear = function() { i = {} };
    return e }, 4);
I$(46, function(t, e, i, n, r, s) { i.__checkEvent = function() {
        var t = { touchstart: "mousedown", touchmove: "mousemove", touchend: "mouseup" },
            i = e._$KERNEL.prefix,
            n = { transitionend: "TransitionEnd", animationend: "AnimationEnd", animationstart: "AnimationStart", animationiteration: "AnimationIteration", visibilitychange: "visibilitychange" };
        var r = { enter: function(t, e, i) {
                var n = { type: "keypress" };
                if (i) n.handler = function(e) {
                    if (13 === e.keyCode) i.call(t, e) };
                return n } };
        var s = function(t) {
            return (i.evt || i.pro) + t };
        return function(e, i, o) {
            var a = { type: i, handler: o };
            if (!("on" + i in e)) {
                var _ = t[i];
                if (_) { a.type = _;
                    return a }
                var _ = n[i];
                if (_) { a.type = s(_);
                    return a }
                var c = r[i];
                if (c) return c.apply(null, arguments) }
            return a } }();
    i.__addEvent = function() {
        var t = arguments;
        if (!1)
            if (!("on" + t[1] in t[0])) console.log("not support event[" + t[1] + "] for " + t[0]);
        t[0].addEventListener(t[1], t[2], t[3]) };
    i.__delEvent = function() {
        var t = arguments;
        t[0].removeEventListener(t[1], t[2], t[3]) };
    i.__dispatchEvent = function(e, i, n) {
        var r = document.createEvent("Event");
        r.initEvent(i, !0, !0);
        t._$merge(r, n);
        e.dispatchEvent(r) };
    return i }, 4, 18);
I$(17, function(t, e, i, n, r, s, o) {
    if ("trident" === t._$KERNEL.engine && t._$KERNEL.release >= "6.0") I$(41, function() { e.__checkEvent = function() {
            var t = { touchcancel: "MSPointerCancel", touchstart: "MSPointerDown", touchmove: "MSPointerMove", touchend: "MSPointerUp" };
            return e.__checkEvent._$aop(function(e) {
                var i = e.args;
                var n = t[i[1]];
                if (n) { e.stopped = !0;
                    e.value = { type: n, handler: i[2] } } }) }() });
    if ("trident" === t._$KERNEL.engine && "5.0" == t._$KERNEL.release) I$(42, function() { e.__checkEvent = function() {
            var t = {};
            var i = { input: function(e, i, n) {
                    if (!n) return { type: i };
                    else return { type: i, handler: function(i) {
                            var r = e.id;
                            t[r] = e.value;
                            n.call(e, i) }, link: [
                            [document, "selectionchange", function(i) {
                                var r = e.id;
                                if (e == document.activeElement) {
                                    if (t[r] !== e.value) { t[r] = e.value;
                                        n.call(e, i) } } else delete t[r] }]
                        ] } } };
            return e.__checkEvent._$aop(function(t) {
                var e = t.args;
                var n = i[e[1]];
                if (n) { t.stopped = !0;
                    t.value = n.apply(null, e) } }) }() });
    if ("trident" === t._$KERNEL.engine && t._$KERNEL.release >= "5.0") I$(43, function() {
        var t = { propertychange: 1 };
        e.__addEvent = e.__addEvent._$aop(function(e) {
            var i = e.args;
            if (null != t[i[1]] && i[0].attachEvent) { e.stopped = !0;
                i[0].attachEvent("on" + i[1], i[2]) } });
        e.__delEvent = e.__delEvent._$aop(function(e) {
            var i = e.args,
                n = t[i[1]];
            if (null != t[i[1]] && i[0].detachEvent) { e.stopped = !0;
                i[0].detachEvent("on" + i[1], i[2]) } }) });
    if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "4.0") I$(44, function() { e.__checkEvent = function() {
            var t = {};
            var i = { input: function(e, i, n) {
                    var r = { type: "propertychange" };
                    if (n) {
                        var s = e.id;
                        var o = function(i) {
                            if (e.value && !t["x-" + s]) { t["x-" + s] = !0;
                                n.call(e, i) } };
                        r.handler = function(i) {
                            if ("value" in e && "value" == i.propertyName) {
                                if (t[s]) return;
                                t[s] = !0;
                                n.call(e, i);
                                delete t[s] } };
                        r.link = [
                            [e, "keyup", o],
                            [e, "mouseup", o],
                            [e, "mousemove", o]
                        ];
                        r.destroy = function() { delete t[s];
                            delete t["x-" + s] } }
                    return r }, load: function(t, e, i) {
                    var n = { type: "readystatechange" };
                    if (i) n.handler = function(e) {
                        if ("loaded" == t.readyState || "complete" == t.readyState) i.call(t, e) };
                    return n } };
            return e.__checkEvent._$aop(function(t) {
                var e = t.args;
                var n = i[e[1]];
                if (n) { t.stopped = !0;
                    t.value = n.apply(null, e) }
                if (e[2]) e[2] = e[2]._$bind(e[0]) }) }();
        e.__addEvent = function() {
            var t = arguments;
            if (!1)
                if (!("on" + t[1] in t[0])) console.log("not support event[" + t[1] + "] for " + t[0]);
            t[0].attachEvent("on" + t[1], t[2]) };
        e.__delEvent = function() {
            var t = arguments;
            t[0].detachEvent("on" + t[1], t[2]) };
        e.__dispatchEvent = function() {
            var t = { propertychange: { propertyName: "value" } };
            return function(e, n, r) {
                var s = document.createEventObject();
                try { i._$merge(s, t[n], r);
                    e.fireEvent("on" + n, s) } catch (o) { console.error(o.message);
                    console.error(o.stack) } } }() });
    if ("gecko" === t._$KERNEL.engine) I$(45, function() { e.__checkEvent = function() {
            var t = /^(?:transitionend|animationend|animationstart|animationiteration)$/i;
            var i = { mousewheel: function(t, e, i) {
                    var n = { type: "MozMousePixelScroll" };
                    if (i) n.handler = function(e) {
                        var n = e.detail;
                        e.wheelDelta = -n;
                        e.wheelDeltaY = -n;
                        e.wheelDeltaX = 0;
                        i.call(t, e) };
                    return n } };
            return e.__checkEvent._$aop(function(e) {
                var n = e.args;
                if (t.test(n[1])) { e.stopped = !0;
                    e.value = { type: n[1], handler: n[2] } }
                var r = i[n[1]];
                if (r) { e.stopped = !0;
                    e.value = r.apply(null, n) } }) }() });
    return e }, 18, 46, 4);
I$(3, function(t, e, i, n, r, s, o, a, _) {
    var c = {},
        h = {};
    var u = function() {
        var t = /[\s,;]+/;
        return function(e) {
            var e = (e || "").trim().toLowerCase();
            return !e ? null : e.split(t) } }();
    var l = function(t, i, n) {
        var r = "page" + i;
        return null != t[r] ? t[r] : t["client" + i] + e._$getPageBox()["scroll" + n] };
    var d = function(t, e, i) {
        var n = "scroll" + i;
        _node = s._$getElement(t), _xret = l(t, e, i);
        for (; _node && _node != document.body && _node != document.documentElement;) { _xret += _node[n] || 0;
            _node = _node.parentNode }
        return _xret };
    var f = function(t, n, r, s) {
        var o = {};
        t = e._$get(t);
        if (!t) return null;
        e._$id(t);
        o.element = t;
        if (!i._$isFunction(r)) return null;
        o.handler = r;
        var n = u(n);
        if (!n) return null;
        o.type = n;
        o.capture = !!s;
        return o };
    s._$addEvent = h._$addEvent = function() {
        var t = function(t, i, n) {
            var r = e._$id(i.element),
                s = c[r] || {},
                o = s[t] || [];
            o.push({ type: n.type || t, func: n.handler || i.handler, sfun: i.handler, capt: i.capture, link: n.link, destroy: n.destroy });
            s[t] = o;
            c[r] = s
        };
        return function() {
            var n = f.apply(null, arguments);
            if (n) i._$forEach(n.type, function(s) {
                var o = r.__checkEvent(n.element, s, n.handler);
                r.__addEvent(n.element, o.type, o.handler, n.capture);
                i._$forIn(o.link, function(t) { t[3] = !!t[3];
                    r.__addEvent.apply(r, t);
                    t[0] = e._$id(t[0]) });
                t(s, n, o) }) }
    }();
    s._$delEvent = h._$delEvent = function() {
        var t = function(t, n) {
            var r = e._$id(n.element),
                s = c[r] || o,
                a = s[t],
                _ = i._$indexOf(a, function(t) {
                    return t.sfun === n.handler && t.capt === n.capture });
            var h = null;
            if (_ >= 0) {
                var u = a.splice(_, 1)[0];
                h = [
                    [n.element, u.type, u.func, n.capture]
                ];
                if (u.link) { i._$forEach(u.link, function(t) { t[0] = e._$get(t[0]) });
                    h.push.apply(h, u.link) }
                if (u.destroy) u.destroy();
                if (!a.length) delete s[t];
                if (!i._$hasProperty(s)) delete c[r] }
            return h };
        return function() {
            var e = f.apply(null, arguments);
            if (e) i._$forEach(e.type, function(n) { i._$forEach(t(n, e), function(t) { r.__delEvent.apply(r, t) }) }) } }();
    s._$clearEvent = h._$clearEvent = function() {
        var t = function(t, e, n) { i._$reverseEach(n, function(i) { s._$delEvent(t, e, i.sfun, i.capt) }) };
        return function(n, r) {
            var o = e._$id(n);
            if (o) {
                var a = c[o];
                if (a) { r = u(r);
                    if (r) i._$forEach(r, function(e) { t(o, e, a[e]) });
                    else i._$loop(a, function(t, e) { s._$clearEvent(n, e) }) } } } }();
    s._$dispatchEvent = h._$dispatchEvent = function(t, n, s) {
        var t = e._$get(t);
        if (t) i._$forEach(u(n), function(e) {
            var i = r.__checkEvent(t, e);
            r.__dispatchEvent(t, i.type, s) }) };
    s._$getElement = function() {
        var t;
        var n = function(i, n) {
            var r = i.split(":");
            if (r.length > 1) {
                if (!t) t = { a: e._$attr, d: e._$dataset, c: e._$hasClassName, t: function(t, e) {
                        return (t.tagName || "").toLowerCase() === e } };
                var s = t[r[0]];
                if (s) return !!s(n, r[1]);
                i = r[1] }
            return !!e._$attr(n, i) || !!e._$dataset(n, i) || e._$hasClassName(n, i) };
        return function(t) {
            if (!t) return null;
            var e = t.target || t.srcElement,
                r = arguments[1];
            if (!r) return e;
            if (i._$isString(r)) r = n._$bind(null, r);
            if (i._$isFunction(r)) {
                for (; e;) {
                    if (r(e)) return e;
                    e = e.parentNode }
                return null }
            return e } }();
    s._$stop = function(t) { s._$stopBubble(t);
        s._$stopDefault(t) };
    s._$stopBubble = function(t) {
        if (t) t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0 };
    s._$stopDefault = function(t) {
        if (t) t.preventDefault ? t.preventDefault() : t.returnValue = !1 };
    s._$page = function(t) {
        return { x: s._$pageX(t), y: s._$pageY(t) } };
    s._$pageX = function(t) {
        return d(t, "X", "Left") };
    s._$pageY = function(t) {
        return d(t, "Y", "Top") };
    s._$clientX = function(t) {
        return l(t, "X", "Left") };
    s._$clientY = function(t) {
        return l(t, "Y", "Top") };
    n._$merge(h);
    if (!0) t.copy(t.P("nej.v"), s);
    return s
}, 15, 2, 4, 16, 17);
I$(56, function(t, e, i, n, r, s) { i.__getElementById = function(t, e) {
        if (t.getElementById) return t.getElementById("" + e);
        try {
            return t.querySelector("#" + e) } catch (i) {
            return null } };
    i.__getChildren = function(e) {
        return t._$object2array(e.children) };
    i.__getElementsByClassName = function(e, i) {
        return t._$object2array(e.getElementsByClassName(i)) };
    i.__nextSibling = function(t) {
        return t.nextElementSibling };
    i.__previousSibling = function(t) {
        return t.previousElementSibling };
    i.__dataset = function(t, e, i) { t.dataset = t.dataset || {};
        if (void 0 !== i) t.dataset[e] = i;
        return t.dataset[e] };
    i.__getAttribute = function(t, e) {
        return t.getAttribute(e) };
    i.__serializeDOM2XML = function(t) {
        return (new XMLSerializer).serializeToString(t) || "" };
    i.__parseDOMFromXML = function(t) {
        var e = (new DOMParser).parseFromString(t, "text/xml").documentElement;
        return "parsererror" == e.nodeName ? null : e };
    i.__fullScreen = function() {};
    i.__mask = function() {};
    i.__unmask = function() {};
    var o = e._$SUPPORT,
        a = e._$KERNEL.prefix;
    i.__isMatchedName = function() {
        var t = /^([a-z]+?)[A-Z]/;
        return function(e, i) {
            return !!(i[e] || t.test(e) && i[RegExp.$1]) } }();
    i.__isNeedPrefixed = function() {
        var e = t._$array2object(["animation", "transform", "transition", "appearance", "userSelect", "box", "flex", "column"]);
        return function(t) {
            return i.__isMatchedName(t, e) } }();
    i.__fmtStyleName = function() {
        var t = /-([a-z])/g;
        return function(e) { e = e || "";
            return e.replace(t, function(t, e) {
                return e.toUpperCase() }) } }();
    i.__getStyleName = function() {
        var t = /^[a-z]/,
            e = a.css || "";
        return function(n) { n = i.__fmtStyleName(n);
            if (!i.__isNeedPrefixed(n)) return n;
            else return e + n.replace(t, function(t) {
                return t.toUpperCase() }) } }();
    i.__getStyleValue = function(t, e) {
        var n = window.getComputedStyle(t, null);
        return n[i.__getStyleName(e)] || "" };
    i.__setStyleValue = function(t, e, n) { t.style[i.__getStyleName(e)] = n };
    i.__getCSSMatrix = function() {
        var e = /\((.*?)\)/,
            i = /\s*,\s*/,
            n = ["CSSMatrix", a.clz + "CSSMatrix"],
            r = ["m11", "m12", "m21", "m22", "m41", "m42"];
        var s = function(n) {
            var s = {};
            if (e.test(n || "")) t._$forEach(RegExp.$1.split(i), function(t, e) { s[r[e]] = t });
            return s };
        return function(e) {
            var i;
            t._$forIn(n, function(t) {
                if (this[t]) { i = new this[t](e || "");
                    return !0 } });
            return !i ? s(e) : i } }();
    i.__injectCSSText = function(t, e) { t.textContent = e };
    i.__processCSSText = function() {
        var e = /\$<(.*?)>/gi,
            r = /\{(.*?)\}/g,
            s = "-" + a.css.toLowerCase() + "-",
            _ = { scale: "scale({x|1},{y|1})", rotate: "rotate({a})", translate: "translate({x},{y})", matrix: "matrix({m11},{m12},{m21},{m22},{m41},{m42})" },
            c = { scale: "scale3d({x|1},{y|1},{z|1})", rotate: "rotate3d({x},{y},{z},{a})", translate: "translate3d({x},{y},{z})", matrix: "matrix3d({m11},{m12},{m13},{m14},{m21},{m22},{m23},{m24},{m31},{m32},{m33|1},{m34},{m41},{m42},{m43},{m44|1})" };
        var h = function(t, e) { e = e || n;
            return t.replace(r, function(t, i) {
                var n = i.split("|");
                return e[n[0]] || n[1] || "0" }) };
        i.__processTransformValue = function(t, e) {
            var i = (!o.css3d ? _ : c)[t.trim()];
            if (i) return h(i, e);
            else return "" };
        return function(n) {
            if (!n.replace) return n;
            else return n.replace(e, function(e, n) {
                if ("vendor" === n) return s;
                var r = (n || "").split("|");
                return i.__processTransformValue(r[0], t._$query2object(r[1])) || e }) } }();
    i.__appendCSSText = function(t, e) {
        var i = t.sheet,
            n = i.cssRules.length;
        i.insertRule(e, n);
        return i.cssRules[n] };
    i.__getClassList = function() {
        var t = /\s+/;
        return function(e) { e = (e || "").trim();
            return e ? e.split(t) : null } }();
    i.__processClassName = function(e, n, r) {
        if ("replace" != n) t._$forEach(i.__getClassList(r), function(t) { e.classList[n](t) });
        else { i.__processClassName(e, "remove", r);
            i.__processClassName(e, "add", arguments[3]) } };
    i.__hasClassName = function(e, n) {
        var r = e.classList;
        if (!r || !r.length) return !1;
        else return t._$indexOf(i.__getClassList(n), function(t) {
            return r.contains(t) }) >= 0 };! function() {
        if (!o.css3d) {
            var t = i.__getCSSMatrix();
            o.css3d = !!t && null != t.m41 } }();
    return i }, 4, 18);
I$(25, function(t, e, i, n, r, s, o) {
    if ("trident" === e._$KERNEL.engine) I$(57, function() { t.__getChildren = t.__getChildren._$aop(function(t) {
            var e = t.args[0];
            if (!e.children) { t.stopped = !0;
                var n = [];
                i._$forEach(e.childNodes, function(t) {
                    if (1 == t.nodeType) n.push(t) });
                t.value = n } }) });
    if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "6.0") I$(58, function() { t.__dataset = function() {
            var t = {},
                e = "data-",
                n = /\-(.{1})/gi;
            var r = function(r) {
                var s = r.id;
                if (!t[s]) {
                    var o = {};
                    i._$forEach(r.attributes, function(t) {
                        var i = t.nodeName;
                        if (0 == i.indexOf(e)) { i = i.replace(e, "").replace(n, function(t, e) {
                                return e.toUpperCase() });
                            o[i] = t.nodeValue || "" } });
                    t[s] = o } };
            return function(e, i, n) { r(e);
                var s = t[e.id];
                if (void 0 !== n) s[i] = n;
                return s[i] } }() });
    if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "5.0") I$(59, function() {
        try { document.execCommand("BackgroundImageCache", !1, !0) } catch (e) {}
        t.__injectCSSText = function() {
            var e = 30;
            return t.__injectCSSText._$aop(function(t) {
                var i = t.args[0];
                if (i.styleSheet) { t.stopped = !0;
                    var n = t.args[1];
                    var r = document.styleSheets;
                    if (r.length > e) { i = r[e];
                        n = i.cssText + n } else i = i.styleSheet;
                    i.cssText = n } }) }();
        t.__getClassRegExp = function() {
            var t = /\s+/g;
            return function(e) { e = (e || "").trim().replace(t, "|");
                return !e ? null : new RegExp("(\\s|^)(?:" + e + ")(?=\\s|$)", "g") } }();
        t.__processClassName = function(e, i, n) { n = n || "";
            var r = e.className || "",
                s = t.__getClassRegExp(n + " " + (arguments[3] || ""));
            var o = r;
            if (s) o = o.replace(s, "");
            switch (i) {
                case "remove":
                    n = "";
                    break;
                case "replace":
                    n = arguments[3] || "" }
            o = (o + " " + n).trim();
            if (r != o) e.className = o };
        t.__hasClassName = function(e, i) {
            var n = t.__getClassRegExp(i);
            if (n) return n.test(e.className || "");
            else return !1 } });
    if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "4.0") I$(60, function() { t.__getElementsByClassName = function(t, e) {
            var n = [],
                r = new RegExp("(\\s|^)(?:" + e.replace(/\s+/g, "|") + ")(?=\\s|$)");
            i._$forEach(t.getElementsByTagName("*"), function(t) {
                if (r.test(t.className)) n.push(t) });
            return n };
        t.__nextSibling = function(t) {
            for (; t = t.nextSibling;)
                if (1 == t.nodeType) return t };
        t.__previousSibling = function(t) {
            for (; t = t.previousSibling;)
                if (1 == t.nodeType) return t };
        t.__serializeDOM2XML = function(t) {
            return "xml" in t ? t.xml : t.outerHTML };
        t.__parseDOMFromXML = function() {
            var t = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.3.0"];
            var e = function() {
                try {
                    for (var e = 0, i = t.length; e < i; e++) return new ActiveXObject(t[e]) } catch (n) {
                    return null } };
            return function(t) {
                var i = e();
                if (i && i.loadXML(t) && !i.parseError.errorCode) return i.documentElement;
                else return null } }();
        t.__getStyleValue = function() {
            var e = /opacity\s*=\s*([\d]+)/i;
            var i = { opacity: function(t) {
                    var i = 0;
                    if (e.test(t.filter || "")) i = parseFloat(RegExp.$1) / 100;
                    return i } };
            return function(e, n) {
                var r = e.currentStyle,
                    s = i[n];
                if (s) return s(r);
                else return r[t.__getStyleName(n)] || "" } }();
        t.__setStyleValue = function() {
            var e = { opacity: function(t, e) { t.style.filter = "alpha(opacity=" + 100 * e + ")" } };
            return function(i, n, r) {
                var s = e[n];
                if (s) s(i, r);
                else i.style[t.__getStyleName(n)] = r } }();
        t.__appendCSSText = function(t, e) {
            var i = t.styleSheet,
                n = i.rules.length,
                r = e.split(/[\{\}]/);
            i.addRule(r[0], r[1], n);
            return i.rules[n] } });
    if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "3.0") I$(61, function() { t.__getAttribute = t.__getAttribute._$aop(null, function(t) {
            var e = t.args;
            if ("maxlength" == e[1] && 2147483647 == t.value) t.value = null }) });
    if ("trident" === e._$KERNEL.engine && e._$KERNEL.release <= "2.0") I$(62, function() {
        t.__fullScreen = function(t, e) {
            var i = t.style;
            i.width = e.scrollWidth + "px";
            i.height = e.scrollHeight + "px" };
        t.__mask = function() {
            var e = {};
            t.__unmask = function(t) {
                var i = t.id,
                    n = e[i];
                if (n) { delete e[i];
                    n.parentNode.removeChild(n) } };
            return function(t) {
                var i = t.id,
                    n = e[i];
                if (!n) { n = document.createElement("iframe");
                    n.style.position = "absolute";
                    e[i] = n }
                var r = n.style,
                    s = t.style;
                r.top = (parseInt(s.top) || 0) + "px";
                r.left = (parseInt(s.left) || 0) + "px";
                r.width = t.offsetWidth + "px";
                r.height = t.offsetHeight + "px";
                t.insertAdjacentElement("beforeBegin", n);
                return n
            }
        }()
    });
    if ("gecko" === e._$KERNEL.engine) I$(63, function() {
        if (!e._$SUPPORT.css3d) e._$SUPPORT.css3d = "MozPerspective" in document.body.style;
        if (!("insertAdjacentElement" in document.body)) HTMLElement.prototype.insertAdjacentElement = function(t, e) {
            if (t && e) switch (t) {
                case "beforeEnd":
                    this.appendChild(e);
                    return;
                case "beforeBegin":
                    this.parentNode.insertBefore(e, this);
                    return;
                case "afterBegin":
                    !this.firstChild ? this.appendChild(e) : this.insertBefore(e, this.firstChild);
                    return;
                case "afterEnd":
                    !this.nextSibling ? this.parentNode.appendChild(e) : this.parentNode.insertBefore(e, this.nextSibling);
                    return } };
        if (!("innerText" in document.body)) { HTMLElement.prototype["__defineGetter__"]("innerText", function() {
                return this.textContent });
            HTMLElement.prototype["__defineSetter__"]("innerText", function(t) { this.textContent = t }) } });
    return t
}, 56, 18, 4);
I$(2, function(t, e, i, n, r, s, o, a, _, c) {
    var h = {},
        u, l = {},
        d = {},
        f = document.createDocumentFragment();
    if (!document.head) document.head = document.getElementsByTagName("head")[0] || document.body;
    o.dump = function() {
        return { pool: l, dirty: d, fragment: f } };
    o._$id = h._$id = function(t) { t = o._$get(t);
        if (t) {
            var e = t.id ? t.id : "auto-id-" + i._$uniqueID();
            if (!("id" in t)) l[e] = t;
            t.id = e;
            if (!o._$get(e)) d[e] = t;
            return e } };
    o._$get = function(t) {
        var e = l["" + t];
        if (e) return e;
        if (!i._$isString(t) && !i._$isNumber(t)) return t;
        var e = document.getElementById(t);
        if (!e) e = s.__getElementById(f, t);
        if (e) delete d[t];
        return e || d[t] };
    o._$getChildren = h._$getChildren = function(t, e) { t = o._$get(t);
        if (!t) return null;
        var n = s.__getChildren(t);
        if (e) i._$reverseEach(n, function(t, i, n) {
            if (!o._$hasClassName(t, e)) n.splice(i, 1) });
        return n };
    o._$getByClassName = h._$getByClassName = function(t, e) { t = o._$get(t);
        return !t ? null : s.__getElementsByClassName(t, e.trim()) };
    o._$getSibling = h._$getSibling = function() {
        var t = function() {
            return !0 };
        return function(e, n) { e = o._$get(e);
            if (!e) return null;
            var r = { backward: !1, filter: t };
            if (i._$isFunction(n)) r.filter = n;
            else r = i._$fetch(r, n);
            var a = r.backward ? s.__previousSibling : s.__nextSibling;
            for (;
                (e = a(e)) && !r.filter(e););
            return e } }();
    o._$getScrollViewPort = function(t) { t = o._$get(t);
        if (t) { t = t.parentNode;
            for (; t && !(t.scrollHeight > t.clientHeight);) t = t.parentNode;
            if (t) return t }
        var e = document.body.scrollHeight,
            i = document.documentElement.scrollHeight;
        return i >= e ? document.documentElement : document.body };
    o._$getPageBox = function() {
        var t = function(t) {
            var e = 0;
            i._$forEach(t, function(t) {
                if (t)
                    if (!e) e = t;
                    else e = Math.min(e, t) });
            return e };
        var e = [{ main: "scroll", sub: ["Top", "Left"], func: function(t, e, i) {
                return Math.max(e["scroll" + t], i["scroll" + t]) } }, { main: "client", sub: ["Width", "Height"], func: function(e, i, n) {
                return t([i["client" + e], i["offset" + e], n["client" + e], n["offset" + e]]) } }, { main: "scroll", sub: ["Width", "Height"], func: function(t, e, i, n) {
                return Math.max(n["client" + t], e["scroll" + t], i["scroll" + t]) } }];
        return function(t) {
            var n = {},
                r = t || document,
                s = r.body,
                o = r.documentElement;
            i._$forEach(e, function(t) {
                var e = t.main;
                i._$forEach(t.sub, function(i) { n[e + i] = t.func(i, s, o, n) }) });
            return n } }();
    o._$getMaxBox = function(t, e) {
        var n = i._$merge({}, t),
            r = e.width / e.height,
            s = t.width / t.height;
        if (r > s && t.height > e.height) { n.height = e.height;
            n.width = n.height * s }
        if (r < s && t.width > e.width) { n.width = e.width;
            n.height = n.width / s }
        return n };
    o._$scrollTo = h._$scrollTo = function(t) {
        var e = o._$offset(t);
        window.scrollTo(e.x, e.y) };
    o._$align = function() {
        var t = /\s+/;
        var e = { left: function() {
                return 0 }, center: function(t, e) {
                return (t.width - e.width) / 2 }, right: function(t, e) {
                return t.width - e.width }, top: function() {
                return 0 }, middle: function(t, e) {
                return (t.height - e.height) / 2 }, bottom: function(t, e) {
                return t.height - e.height } };
        return function(i, n, r) {
            var s = {},
                o = (r || "").split(t),
                a = e[o[1]] || e.middle,
                _ = e[o[0]] || e.center;
            s.top = a(i, n);
            s.left = _(i, n);
            return s } }();
    o._$offset = h._$offset = function() {
        var t = function(t) {
            return t == document.body || t == document.documentElement };
        return function(e, i) { e = o._$get(e);
            if (!e) return null;
            i = o._$get(i) || null;
            var n = e,
                r = { x: 0, y: 0 },
                s, a, _;
            for (; n && n != i;) { s = t(n) || n == e;
                a = s ? 0 : n.scrollLeft;
                _ = parseInt(o._$getStyle(n, "borderLeftWidth")) || 0;
                r.x += n.offsetLeft + _ - a;
                a = s ? 0 : n.scrollTop;
                _ = parseInt(o._$getStyle(n, "borderTopWidth")) || 0;
                r.y += n.offsetTop + _ - a;
                n = n.offsetParent }
            return r } }();
    o._$fullScreen = h._$fullScreen = function(t) { t = o._$get(t);
        if (t) s.__fullScreen(t, o._$getPageBox()) };
    o._$mask = h._$mask = function(t) { t = o._$get(t);
        if (t) { o._$id(t);
            return s.__mask(t) }
        return null };
    o._$unmask = h._$unmask = function(t) { t = o._$get(t);
        if (t) { o._$id(t);
            return s.__unmask(t) }
        return null };
    o._$create = function() {
        var t = { a: { href: "#", hideFocus: !0 }, style: { type: "text/css" }, link: { type: "text/css", rel: "stylesheet" }, iframe: { frameBorder: 0 }, script: { defer: !0, type: "text/javascript" } };
        return function(e, n, r) {
            var s = document.createElement(e),
                a = t[e.toLowerCase()];
            i._$merge(s, a);
            if (n) s.className = n;
            r = o._$get(r);
            if (r) r.appendChild(s);
            else if (!a) f.appendChild(s);
            return s } }();
    o._$createXFrame = function() {
        var t = function() {
            if (location.hostname == document.domain) return "about:blank";
            else return 'javascript:(function(){document.open();document.domain="' + document.domain + '";document.close();})();' };
        var e = function(t) { t = t.trim();
            if (!t) return o._$create("iframe");
            var e;
            try { e = document.createElement('<iframe name="' + t + '"></iframe>');
                e.frameBorder = 0 } catch (i) { e = o._$create("iframe");
                e.name = t }
            return e };
        return function(r) { r = r || a;
            var s = e(r.name || "");
            if (!r.visible) s.style.display = "none";
            if (i._$isFunction(r.onload)) n._$addEvent(s, "load", function(t) {
                if (s.src) { n._$clearEvent(s, "load");
                    r.onload(t) } });
            var _ = r.parent;
            if (i._$isFunction(_)) try { _(s) } catch (c) {} else(o._$get(_) || document.body).appendChild(s);
            var h = r.src || t();
            window.setTimeout(function() { s.src = h }, 0);
            return s } }();
    o._$remove = h._$remove = function() {
        var t = { img: function(t) { t.src = e._$BLANK_IMAGE }, iframe: function(t) { t.src = "about:blank" } };
        var r = function(e, n) {
            if (n) {
                if (e.getElementsByTagName) i._$forEach(e.getElementsByTagName(n), r) } else {
                var s = (e.tagName || "").toLowerCase(),
                    o = t[s];
                if (o) o(e) } };
        return function(t) { t = o._$get(t);
            if (t) {
                if (!arguments[1]) n._$clearEvent(t);
                r(t);
                r(t, "img");
                r(t, "iframe");
                if (t.parentNode) t.parentNode.removeChild(t) } } }();
    o._$removeByEC = h._$removeByEC = function(t) { t = o._$get(t);
        if (t) try { f.appendChild(t) } catch (e) { console.error(e) } };
    o._$clearChildren = h._$clearChildren = function(t) { t = o._$get(t);
        if (t) i._$reverseEach(t.childNodes, function(t) { o._$remove(t) }) };
    o._$wrapInline = h._$wrapInline = function() {
        var t, e = /\s+/;
        var i = function() {
            if (!t) { t = o._$pushCSSText(".#<uispace>{position:relative;zoom:1;}.#<uispace>-show{position:absolute;top:0;left:100%;cursor:text;white-space:nowrap;overflow:hidden;}");
                o._$dumpCSSText() } };
        return function(n, r) { n = o._$get(n);
            if (!n) return null;
            i();
            r = r || a;
            var s = n.parentNode;
            if (!o._$hasClassName(s, t)) { s = o._$create("span", t);
                n.insertAdjacentElement("beforeBegin", s);
                s.appendChild(n) }
            var _ = r.nid || "",
                c = o._$getByClassName(s, _ || t + "-show")[0];
            if (!c) {
                var h = ((r.clazz || "") + " " + _).trim();
                h = t + "-show" + (!h ? "" : " ") + h;
                c = o._$create(r.tag || "span", h);
                s.appendChild(c) }
            var h = r.clazz;
            if (h) { h = (h || "").trim().split(e)[0] + "-parent";
                o._$addClassName(s, h) }
            return c } }();
    o._$dataset = h._$dataset = function(t, e, n) {
        var r = o._$id(t);
        if (!r) return null;
        if (i._$isString(e)) return s.__dataset(o._$get(t), e, n);
        if (i._$isObject(e)) {
            var a = {};
            i._$forIn(e, function(t, e) { a[e] = o._$dataset(r, e, t) });
            return a }
        if (i._$isArray(e)) {
            var a = {};
            i._$forEach(e, function(t) { a[t] = o._$dataset(r, t) });
            return a }
        return null };
    o._$attr = h._$attr = function(t, e, i) { t = o._$get(t);
        if (!t) return "";
        if (void 0 !== i && t.setAttribute) t.setAttribute(e, i);
        return s.__getAttribute(t, e) };
    o._$html2node = function() {
        var t = /<(.*?)(?=\s|>)/i,
            e = { li: "ul", tr: "tbody", td: "tr", th: "tr", option: "select" };
        return function(i) {
            var n;
            if (t.test(i)) n = e[(RegExp.$1 || "").toLowerCase()] || "";
            var r = o._$create(n || "div");
            r.innerHTML = i;
            var s = o._$getChildren(r);
            return s.length > 1 ? r : s[0] } }();
    o._$dom2xml = h._$dom2xml = function(t) { t = o._$get(t);
        return !t ? "" : s.__serializeDOM2XML(t) };
    o._$xml2dom = function(t) { t = (t || "").trim();
        return !t ? null : s.__parseDOMFromXML(t) };
    o._$dom2object = h._$dom2object = function(t, e) { e = e || {};
        t = o._$get(t);
        if (!t) return e;
        var n = t.tagName.toLowerCase(),
            r = o._$getChildren(t);
        if (!r || !r.length) { e[n] = t.textContent || t.text || "";
            return e }
        var s = {};
        e[n] = s;
        i._$forEach(r, function(t) { o._$dom2object(t, s) });
        return e };
    o._$xml2object = function(t) {
        try {
            return o._$dom2object(o._$xml2dom(t)) } catch (e) {
            return null } };
    o._$text2type = function() {
        var t = { xml: function(t) {
                return o._$xml2dom(t) }, json: function(t) {
                try {
                    return JSON.parse(t) } catch (e) {
                    return null } }, dft: function(t) {
                return t } };
        return function(e, i) { i = (i || "").toLowerCase();
            return (t[i] || t.dft)(e || "") } }();
    o._$style = h._$style = function(t, e) { t = o._$get(t);
        if (t) i._$loop(e, function(e, i) { o._$setStyle(t, i, e) }) };
    o._$setStyle = h._$setStyle = function(t, e, i) { t = o._$get(t);
        if (t) s.__setStyleValue(t, e, s.__processCSSText(i)) };
    o._$getStyle = h._$getStyle = function(t, e) { t = o._$get(t);
        return !t ? "" : s.__getStyleValue(t, e) };
    o._$addScript = function(t) {
        try { t = t.trim();
            if (t) return new Function(t)() } catch (e) { console.error(e.message);
            console.error(e.stack) } };
    o._$addStyle = function() {
        var t = /[\s\r\n]+/gi;
        return function(e) { e = (e || "").replace(t, " ").trim();
            var i = null;
            if (e) { i = o._$create("style");
                document.head.appendChild(i);
                s.__injectCSSText(i, s.__processCSSText(e)) }
            return i } }();
    o._$pushCSSText = function() {
        var t = /#<(.*?)>/g,
            e = +new Date;
        return function(e, n) {
            if (!u) u = [];
            var r = "auto-" + i._$uniqueID(),
                s = i._$merge({ uispace: r }, n);
            u.push(e.replace(t, function(t, e) {
                return s[e] || t }));
            return r } }();
    o._$dumpCSSText = function() {
        if (u) { o._$addStyle(u.join(" "));
            u = null } };
    o._$appendCSSText = h._$appendCSSText = function(t, e) { t = o._$get(t);
        return !t ? null : s.__appendCSSText(t, s.__processCSSText(e)) };
    o._$addClassName = h._$addClassName = function(t, e) { t = o._$get(t);
        if (t) s.__processClassName(t, "add", e) };
    o._$delClassName = h._$delClassName = function(t, e) { t = o._$get(t);
        if (t) s.__processClassName(t, "remove", e) };
    o._$replaceClassName = h._$replaceClassName = function(t, e, i) { t = o._$get(t);
        if (t) s.__processClassName(t, "replace", e, i) };
    o._$hasClassName = h._$hasClassName = function(t, e) { t = o._$get(t);
        if (t) return s.__hasClassName(t, e);
        else return !1 };
    o._$matrix = function(t) { t = (t || "").trim();
        return s.__getCSSMatrix(t) };
    o._$css3d = h._$css3d = function(t, e, i) {
        t = o._$get(t);
        if (t) {
            var n = s.__processTransformValue(e, i);
            if (n) o._$setStyle(t, "transform", n) }
    };
    r._$merge(h);
    if (!0) t.copy(t.P("nej.e"), o);
    return o
}, 15, 24, 4, 3, 16, 25);
I$(5, function(t, e, i, n, r, s, o, a) {
    var _;
    r._$$EventTarget = e._$klass();
    _ = r._$$EventTarget.prototype;
    r._$$EventTarget._$allocate = function(t) { t = t || {};
        var e = !!this.__pool && this.__pool.shift();
        if (!e) { e = new this(t);
            this.__inst__ = (this.__inst__ || 0) + 1 }
        e.__reset(t);
        return e };
    r._$$EventTarget._$recycle = function() {
        var t = function(t, e, i) { t._$recycle();
            i.splice(e, 1) };
        return function(e) {
            if (!e) return null;
            if (!n._$isArray(e)) {
                if (!(e instanceof this)) {
                    var i = e.constructor;
                    if (i._$recycle) i._$recycle(e);
                    return null }
                if (e == this.__instance) delete this.__instance;
                if (e == this.__inctanse) delete this.__inctanse;
                e.__destroy();
                if (!this.__pool) this.__pool = [];
                if (n._$indexOf(this.__pool, e) < 0) this.__pool.push(e);
                return null }
            n._$reverseEach(e, t, this) } }();
    r._$$EventTarget._$getInstance = function(t) {
        if (!this.__instance) this.__instance = this._$allocate(t);
        return this.__instance };
    r._$$EventTarget._$getInstanceWithReset = function(t, e) {
        if (e && this.__inctanse) { this.__inctanse._$recycle();
            delete this.__inctanse }
        if (!this.__inctanse) this.__inctanse = this._$allocate(t);
        else this.__inctanse.__reset(t);
        return this.__inctanse };
    _.__init = function() { this.__events = {};
        this.__events_dom = {};
        this.id = n._$uniqueID() };
    _.__reset = function(t) { this._$batEvent(t) };
    _.__destroy = function() { this._$clearEvent();
        this.__doClearDomEvent() };
    _.__doInitDomEvent = function() {
        var t = function(t) {
            if (t && !(t.length < 3)) { this.__events_dom["de-" + n._$uniqueID()] = t;
                i._$addEvent.apply(i, t) } };
        return function(e) { n._$forEach(e, t, this) } }();
    _.__doClearDomEvent = function() {
        var t = function(t, e, n) { delete n[e];
            i._$delEvent.apply(i, t) };
        return function() { n._$loop(this.__events_dom, t) } }();
    _.__doClearComponent = function(t) { t = t || o;
        n._$loop(this, function(e, i, n) {
            if (e && e._$recycle && !t(e)) { delete n[i];
                e._$recycle() } }) };
    _._$recycle = function() { this.constructor._$recycle(this) };
    _._$hasEvent = function(t) {
        var t = (t || "").toLowerCase(),
            e = this.__events[t];
        return !!e && e !== o };
    _._$delEvent = function(t, e) {
        var t = (t || "").toLowerCase(),
            i = this.__events[t];
        if (n._$isArray(i)) { n._$reverseEach(i, function(t, i, n) {
                if (t == e) n.splice(i, 1) });
            if (!i.length) delete this.__events[t] } else if (i == e) delete this.__events[t] };
    _._$setEvent = function(t, e) {
        if (t && n._$isFunction(e)) this.__events[t.toLowerCase()] = e };
    _._$batEvent = function() {
        var t = function(t, e) { this._$setEvent(e, t) };
        return function(e) { n._$loop(e, t, this) } }();
    _._$clearEvent = function() {
        var t = function(t, e) { this._$clearEvent(e) };
        return function(e) {
            var e = (e || "").toLowerCase();
            if (e) delete this.__events[e];
            else n._$loop(this.__events, t, this) } }();
    _._$addEvent = function(t, e) {
        if (t && n._$isFunction(e)) { t = t.toLowerCase();
            var i = this.__events[t];
            if (i) {
                if (!n._$isArray(i)) this.__events[t] = [i];
                this.__events[t].push(e) } else this.__events[t] = e } };
    _._$dispatchEvent = function(t) {
        var t = (t || "").toLowerCase(),
            e = this.__events[t];
        if (e) {
            var i = a.slice.call(arguments, 1);
            if (n._$isArray(e)) n._$forEach(e, function(t) {
                if (!1) t.apply(this, i);
                else try { t.apply(this, i) } catch (e) { console.error(e.message);
                    console.error(e.stack) } }, this);
            else e.apply(this, i) } };
    if (!0) { r._$$Event = r._$$EventTarget;
        t.copy(t.P("nej.ut"), r) }
    return r }, 15, 1, 3, 4);
! function() {
    if ("undefined" == typeof TrimPath) { TrimPath = {};
        if ("undefined" != typeof exports) TrimPath = exports }
    var t = {},
        e = [],
        i = /\s+/g,
        n = +new Date,
        r, s, o;
    var a = function() {
        var t = /^\s*[\[\{'"].*?[\]\}'"]\s*$/,
            e = /[\&\|\<\>\+\-\*\/\%\,\(\)\[\]\?\:\!\=\;]/,
            i = /^(?:defined|null|undefined|true|false|instanceof|new|this|typeof|\$v|[\d]+)$/i,
            n = /^new\s+/,
            r = /['"]/;
        var s = function(e) {
            if (!t.test(e)) { e = e.split(".")[0].trim();
                if (e && !r.test(e)) { e = e.replace(n, "");
                    try {
                        if (i.test(e)) return;
                        o[e] = 1 } catch (s) {} } } };
        return function(i) { i = i || "";
            if (i && !t.test(i)) {
                var n = i.split(e);
                for (var r = 0, o = n.length; r < o; r++) s(n[r]) } } }();
    var _ = function(t) {
        if ("in" != t[2]) throw "bad for loop statement: " + t.join(" ");
        e.push(t[1]);
        a(t[3]);
        return "var __HASH__" + t[1] + " = " + t[3] + "," + t[1] + "," + t[1] + "_count=0;if (!!__HASH__" + t[1] + ")for(var " + t[1] + "_key in __HASH__" + t[1] + "){" + t[1] + " = __HASH__" + t[1] + "[" + t[1] + "_key];if (typeof(" + t[1] + ')=="function") continue;' + t[1] + "_count++;" };
    var c = function() {
        var t = e[e.length - 1];
        return "}; if(!__HASH__" + t + "||!" + t + "_count){" };
    var h = function() { e.pop();
        return "};" };
    var u = function(t) {
        if ("as" != t[2]) throw "bad for list loop statement: " + t.join(" ");
        var e = t[1].split("..");
        if (e.length > 1) { a(e[0]);
            a(e[1]);
            return "for(var " + t[3] + "," + t[3] + "_index=0," + t[3] + "_beg=" + e[0] + "," + t[3] + "_end=" + e[1] + "," + t[3] + "_length=parseInt(" + t[3] + "_end-" + t[3] + "_beg+1);" + t[3] + "_index<" + t[3] + "_length;" + t[3] + "_index++){" + t[3] + " = " + t[3] + "_beg+" + t[3] + "_index;" } else { a(t[1]);
            return "for(var __LIST__" + t[3] + " = " + t[1] + "," + t[3] + "," + t[3] + "_index=0," + t[3] + "_length=__LIST__" + t[3] + ".length;" + t[3] + "_index<" + t[3] + "_length;" + t[3] + "_index++){" + t[3] + " = __LIST__" + t[3] + "[" + t[3] + "_index];" } };
    var l = function(t) {
        if (t && t.length) { t.shift();
            var e = t[0].split("(")[0];
            return "var " + e + " = function" + t.join("").replace(e, "") + "{var __OUT=[];" } };
    var d = function(t) {
        if (!t[1]) throw "bad include statement: " + t.join(" ");
        return 'if (typeof inline == "function"){__OUT.push(inline(' };
    var f = function(t, e) { a(e.slice(1).join(" "));
        return t };
    var m = function(t) {
        return f("if(", t) };
    var p = function(t) {
        return f("}else if(", t) };
    var g = function(t) {
        return f("var ", t) };
    s = { blk: /^\{(cdata|minify|eval)/i, tag: "forelse|for|list|if|elseif|else|var|macro|break|notrim|trim|include", def: { "if": { pfix: m, sfix: "){", pmin: 1 }, "else": { pfix: "}else{" }, elseif: { pfix: p, sfix: "){", pdft: "true" }, "/if": { pfix: "}" }, "for": { pfix: _, pmin: 3 }, forelse: { pfix: c }, "/for": { pfix: h }, list: { pfix: u, pmin: 3 }, "/list": { pfix: "};" }, "break": { pfix: "break;" }, "var": { pfix: g, sfix: ";" }, macro: { pfix: l }, "/macro": { pfix: 'return __OUT.join("");};' }, trim: { pfix: function() { r = !0 } }, "/trim": { pfix: function() { r = null } }, inline: { pfix: d, pmin: 1, sfix: "));}" } }, ext: { seed: function(t) {
                return (t || "") + "" + n }, "default": function(t, e) {
                return t || e } } };
    var v = function() {
        var t = /\\([\{\}])/g;
        return function(e, n) { e = e.replace(t, "$1");
            var r = e.slice(1, -1).split(i),
                o = s.def[r[0]];
            if (o) {
                if (o.pmin && o.pmin >= r.length) throw "Statement needs more parameters:" + e;
                n.push(o.pfix && "string" != typeof o.pfix ? o.pfix(r) : o.pfix || "");
                if (o.sfix) {
                    if (r.length <= 1) {
                        if (o.pdft) n.push(o.pdft) } else
                        for (var a = 1, _ = r.length; a < _; a++) {
                            if (a > 1) n.push(" ");
                            n.push(r[a]) }
                    n.push(o.sfix) } } else b(e, n) } }();
    var y = function(t, e) {
        if (t && t.length)
            if (1 != t.length) {
                var i = t.pop().split(":");
                e.push("__MDF['" + i.shift() + "'](");
                y(t, e);
                if (i.length > 0) {
                    var n = i.join(":");
                    a(n);
                    e.push("," + n) }
                e.push(")") } else {
                var r = t.pop();
                a(r);
                e.push("" == r ? '""' : r) } };
    var b = function(t, e) {
        if (t) {
            var i = t.split("\n");
            if (i && i.length)
                for (var n = 0, s = i.length, o; n < s; n++) { o = i[n];
                    if (r) { o = o.trim();
                        if (!o) continue }
                    $(o, e);
                    if (r && n < s - 1) e.push("__OUT.push('\\n');") } } };
    var $ = function() {
        var t = /\|\|/g,
            e = /#@@#/g;
        return function(i, n) {
            var r = "}",
                s = -1,
                o = i.length,
                a, _, c, h, u;
            for (; s + r.length < o;) { a = "${";
                _ = "}";
                c = i.indexOf(a, s + r.length);
                if (c < 0) break;
                if ("%" == i.charAt(c + 2)) { a = "${%";
                    _ = "%}" }
                h = i.indexOf(_, c + a.length);
                if (h < 0) break;
                x(i.substring(s + r.length, c), n);
                u = i.substring(c + a.length, h).replace(t, "#@@#").split("|");
                for (var l = 0, d = u.length; l < d; u[l] = u[l].replace(e, "||"), l++);
                n.push("__OUT.push(");
                y(u, n);
                n.push(");");
                r = _;
                s = h }
            x(i.substring(s + r.length), n) } }();
    var x = function() {
        var t = { r: /\n|\\|\'/g, "\n": "\\n", "\\": "\\\\", "'": "\\'" };
        var e = function(e) {
            return (e || "").replace(t.r, function(e) {
                return t[e] || e }) };
        return function(t, i) {
            if (t) i.push("__OUT.push('" + e(t) + "');") } }();
    var C = function() {
        var t = /\t/g,
            e = /\n/g,
            n = /\r\n?/g;
        var r = function(t, e) {
            var i = t.indexOf("}", e + 1);
            for (;
                "\\" == t.charAt(i - 1);) i = t.indexOf("}", i + 1);
            return i };
        var a = function() {
            var t = [],
                e = arguments[0];
            for (var i in e) { i = (i || "").trim();
                if (i) t.push(i + "=$v('" + i + "')");
                else; }
            return t.length > 0 ? "var " + t.join(",") + ";" : "" };
        return function(_) { o = {};
            _ = _.replace(n, "\n").replace(t, "    ");
            var c = ["if(!__CTX) return '';", ""];
            c.push("function $v(__NAME){var v = __CTX[__NAME];return v==null?window[__NAME]:v;};");
            c.push("var defined=function(__NAME){return __CTX[__NAME]!=null;},");
            c.push("__OUT=[];");
            var h = -1,
                u = _.length;
            var l, d, f, m, p, g, y, $;
            for (; h + 1 < u;) { l = h;
                l = _.indexOf("{", l + 1);
                for (; l >= 0;) { d = r(_, l);
                    f = _.substring(l, d);
                    m = f.match(s.blk);
                    if (m) { p = m[1].length + 1;
                        g = _.indexOf("}", l + p);
                        if (g >= 0) { y = g - l - p <= 0 ? "{/" + m[1] + "}" : f.substr(p + 1);
                            p = _.indexOf(y, g + 1);
                            if (p >= 0) { b(_.substring(h + 1, l), c);
                                $ = _.substring(g + 1, p);
                                switch (m[1]) {
                                    case "cdata":
                                        x($, c);
                                        break;
                                    case "minify":
                                        x($.replace(e, " ").replace(i, " "), c);
                                        break;
                                    case "eval":
                                        if ($) c.push("__OUT.push((function(){" + $ + "})());") }
                                l = h = p + y.length - 1 } } } else if ("$" != _.charAt(l - 1) && "\\" != _.charAt(l - 1) && 0 == f.substr("/" == f.charAt(1) ? 2 : 1).search(s.tag)) break;
                    l = _.indexOf("{", l + 1) }
                if (l < 0) break;
                d = r(_, l);
                if (d < 0) break;
                b(_.substring(h + 1, l), c);
                v(_.substring(l, d + 1), c);
                h = d }
            b(_.substring(h + 1), c);
            c.push(';return __OUT.join("");');
            c[1] = a(o);
            o = null;
            return new Function("__CTX", "__MDF", c.join("")) } }();
    TrimPath.seed = function() {
        return n };
    TrimPath.merge = function() {
        var e = {};
        TrimPath.dump = function() {
            return { func: e, text: t } };
        return function(i, n, r) {
            try { n = n || {};
                if (!e[i] && !t[i]) return "";
                if (!e[i]) { e[i] = C(t[i]);
                    delete t[i] }
                if (r)
                    for (var o in s.ext)
                        if (!r[o]) r[o] = s.ext[o];
                return e[i](n, r || s.ext) } catch (a) {
                return a.message || "" } } }();
    TrimPath.parse = function() {
        var e = +new Date;
        return function(i, n) {
            if (!i) return "";
            n = n || "ck-" + e++;
            if (null != t[n]) { console.warn("jst template overwrited with key " + n);
                console.debug("old template content: " + t[n].replace(/\n/g, " "));
                console.debug("new template content: " + i.replace(/\n/g, " ")) }
            t[n] = i;
            return n } }() }();
I$(19, function(t, e, i, n, r, s, o, a, _) {
    var c = {};
    s._$seed = TrimPath.seed;
    s._$get = function() {
        var t = function(t) {
            return !s._$getTextTemplate ? "" : s._$getTextTemplate(t) };
        return function(i, n, r) { n = n || {};
            n.inline = t;
            r = e._$merge({}, c, r);
            r.rand = e._$uniqueID;
            r.format = e._$format;
            r.escape = e._$escape;
            r.inline = t;
            return TrimPath.merge(i, n, r) } }();
    s._$add = function(t, e) {
        if (!t) return "";
        var n, r = i._$get(t);
        if (r) { n = r.id;
            t = r.value || r.innerText;
            if (!e) i._$remove(r) }
        return TrimPath.parse(t, n) };
    s._$addTemplate = function(t, e) {
        return TrimPath.parse(t, e) };
    s._$render = function(t, e, n, r) { t = i._$get(t);
        if (t) t.innerHTML = s._$get(e, n, r) };
    s._$extend = function(t) {
        e._$merge(c, t)
    };
    n._$merge({ _$render: s._$render });
    if (!0) {
        var h = t.P("nej.e");
        h._$addHtmlTemplate = s._$add;
        h._$getHtmlTemplate = s._$get;
        h._$getHtmlTemplateSeed = s._$seed;
        h._$renderHtmlTemplate = s._$render;
        h._$registJSTExt = s._$extend }
    return s
}, 15, 4, 2, 16, 47);
I$(20, function(t, e, i, n, r, s, o, a, _, c) {
    var h;
    o._$$CustomEvent = e._$klass();
    h = o._$$CustomEvent._$extend(s._$$EventTarget);
    h.__init = function() { this.__cache = {};
        this.__super() };
    h.__reset = function(t) { this.__super(t);
        this.__element = i._$get(t.element) || window;
        this.__doEventInit(t.event);
        this.__doEventAPIEnhance();
        this._$dispatchEvent("oninit") };
    h.__destroy = function() {
        var t = function(t, e, i) {
            if (!r._$isArray(t)) r._$safeDelete(this.__element, e);
            delete i[e] };
        return function() { this.__super();
            r._$loop(this.__cache, t, this);
            delete this.__element } }();
    h.__isDelegate = function(t, e) { t = i._$get(t);
        return !(t !== this.__element || e && !this.__cache["on" + e]) };
    h.__doEventInit = function(t) {
        if (!r._$isString(t)) {
            if (r._$isArray(t)) r._$forEach(t, this.__doEventInit, this) } else {
            var e = "on" + t;
            if (!this.__cache[e]) this.__cache[e] = this.__doEventDispatch._$bind(this, t);
            this.__doEventBind(t) } };
    h.__doEventBind = function(t) {
        var e = "on" + t,
            i = this.__element[e],
            n = this.__cache[e];
        if (i != n) { this.__doEventDelete(t);
            if (i && i != _) this.__doEventAdd(t, i);
            this.__element[e] = n } };
    h.__doEventAdd = function(t, e, i) {
        var n = this.__cache[t];
        if (!n) { n = [];
            this.__cache[t] = n }
        if (r._$isFunction(e)) !i ? n.push(e) : n.unshift(e) };
    h.__doEventDelete = function(t, e) {
        var i = this.__cache[t];
        if (i && i.length)
            if (e) r._$reverseEach(i, function(t, i, n) {
                if (e === t) { n.splice(i, 1);
                    return !0 } });
            else delete this.__cache[t] };
    h.__doEventDispatch = function(t, e) { e = e || { noargs: !0 };
        if (e == a) e = {};
        e.type = t;
        this._$dispatchEvent("ondispatch", e);
        if (!e.stopped) r._$forEach(this.__cache[t], function(t) {
            if (!1) t(e);
            else try { t(e) } catch (i) { console.error(i.message);
                console.error(i.stack) } }) };
    h.__doEventAPIEnhance = function() {
        var e = function(t) {
            var e = t.args,
                i = e[1].toLowerCase();
            if (this.__isDelegate(e[0], i)) { t.stopped = !0;
                this.__doEventBind(i);
                this.__doEventAdd(i, e[2], e[3]);
                this._$dispatchEvent("oneventadd", { type: i, listener: e[2] }) } };
        var i = function(t) {
            var e = t.args,
                i = e[1].toLowerCase();
            if (this.__isDelegate(e[0], i)) { t.stopped = !0;
                this.__doEventDelete(i, e[2]) } };
        var s = function(t) {
            var e = t.args,
                i = (e[1] || "").toLowerCase();
            if (this.__isDelegate(e[0])) {
                if (i) { this.__doEventDelete(i);
                    return }
                r._$loop(this.__cache, function(t, e) {
                    if (r._$isArray(t)) this.__doEventDelete(e) }, this) } };
        var o = function(t) {
            var e = t.args,
                i = e[1].toLowerCase();
            if (this.__isDelegate(e[0], i)) { t.stopped = !0;
                e[0]["on" + i].apply(e[0], e.slice(2)) } };
        return function() {
            if (!this.__enhanced) { this.__enhanced = !0;
                n._$addEvent = n._$addEvent._$aop(e._$bind(this));
                n._$delEvent = n._$delEvent._$aop(i._$bind(this));
                n._$clearEvent = n._$clearEvent._$aop(s._$bind(this));
                n._$dispatchEvent = n._$dispatchEvent._$aop(o._$bind(this));
                if (!0) t.copy(t.P("nej.v"), n) } } }();
    if (!0) t.copy(t.P("nej.ut"), o);
    return o }, 15, 1, 2, 3, 4, 5);
I$(26, function(t, e, i, n, r, s, o, a, _, c) {
    var h, u = 6e4;
    o._$$LoaderAbstract = e._$klass();
    h = o._$$LoaderAbstract._$extend(s._$$EventTarget);
    h.__init = function() { this.__super();
        this.__qopt = { onerror: this.__onQueueError._$bind(this), onload: this.__onQueueLoaded._$bind(this) };
        if (!this.constructor.__cache) this.constructor.__cache = { loaded: {} } };
    h.__reset = function(t) { this.__super(t);
        this.__version = t.version;
        this.__timeout = t.timeout;
        this.__qopt.version = this.__version;
        this.__qopt.timeout = this.__timeout };
    h.__delLoadData = function(t) { delete this.constructor.__cache[t] };
    h.__getLoadData = function(t) {
        return this.constructor.__cache[t] };
    h.__setLoadData = function(t, e) { this.constructor.__cache[t] = e };
    h.__getRequest = _;
    h.__doClearRequest = function(t) { n._$clearEvent(t) };
    h.__doRequest = function(t) { t.src = this.__url;
        document.head.appendChild(t) };
    h.__doClear = function() {
        var t = this.__getLoadData(this.__url);
        if (t) { window.clearTimeout(t.timer);
            this.__doClearRequest(t.request);
            delete t.bind;
            delete t.timer;
            delete t.request;
            this.__delLoadData(this.__url);
            this.__getLoadData("loaded")[this.__url] = !0 } };
    h.__doCallback = function(t) {
        var e = this.__getLoadData(this.__url);
        if (e) {
            var i = e.bind;
            this.__doClear();
            if (i && i.length > 0) {
                var n;
                for (; i.length;) { n = i.shift();
                    try { n._$dispatchEvent(t, arguments[1]) } catch (r) {
                        if (!1) throw r;
                        console.error(r.message);
                        console.error(r.stack) }
                    n._$recycle() } } } };
    h.__onError = function(t) { this.__doCallback("onerror", t) };
    h.__onLoaded = function() { this.__doCallback("onload") };
    h.__doLoadQueue = function(t) { this.constructor._$allocate(this.__qopt)._$load(t) };
    h.__onQueueCheck = function(t) {
        var e = this.__getLoadData(this.__key);
        if (e) {
            if (t) e.error++;
            e.loaded++;
            if (!(e.loaded < e.total)) { this.__delLoadData(this.__key);
                this._$dispatchEvent(e.error > 0 ? "onerror" : "onload") } } };
    h.__onQueueError = function(t) { this.__onQueueCheck(!0) };
    h.__onQueueLoaded = function() { this.__onQueueCheck() };
    h._$load = function(t) { t = r._$absolute(t);
        if (t) { this.__url = t;
            if (this.__version) this.__url += (this.__url.indexOf("?") < 0 ? "?" : "&") + this.__version;
            if (!this.__getLoadData("loaded")[this.__url]) {
                var e = this.__getLoadData(this.__url),
                    s;
                if (e) { e.bind.unshift(this);
                    e.timer = window.clearTimeout(e.timer) } else { s = this.__getRequest();
                    e = { request: s, bind: [this] };
                    this.__setLoadData(this.__url, e);
                    n._$addEvent(s, "load", this.__onLoaded._$bind(this));
                    n._$addEvent(s, "error", this.__onError._$bind(this, { code: i._$CODE_ERRSERV, message: "无法加载指定资源文件[" + this.__url + "]！" })) }
                if (0 != this.__timeout) e.timer = window.setTimeout(this.__onError._$bind(this, { code: i._$CODE_TIMEOUT, message: "指定资源文件[" + this.__url + "]载入超时！" }), this.__timeout || u);
                if (s) this.__doRequest(s);
                this._$dispatchEvent("onloading") } else {
                try { this._$dispatchEvent("onload") } catch (o) {
                    if (!1) throw o;
                    console.error(o.message);
                    console.error(o.stack) }
                this._$recycle() } } else this._$dispatchEvent("onerror", { code: i._$CODE_NOTASGN, message: "请指定要载入的资源地址！" }) };
    h._$queue = function(t) {
        if (t && t.length) { this.__key = r._$uniqueID();
            var e = { error: 0, loaded: 0, total: t.length };
            this.__setLoadData(this.__key, e);
            r._$forEach(t, function(t, i) {
                if (t) this.__doLoadQueue(t);
                else e.total-- }, this);
            this._$dispatchEvent("onloading") } else this._$dispatchEvent("onerror", { code: i._$CODE_NOTASGN, message: "请指定要载入的资源队列！" }) };
    return o }, 15, 1, 24, 3, 4, 5);
I$(29, function(t, e, i, n, r, s) { i._$cookie = function() {
        var t = new Date,
            i = +t,
            r = 864e5;
        var s = function(t) {
            var e = document.cookie,
                i = "\\b" + t + "=",
                n = e.search(i);
            if (n < 0) return "";
            n += i.length - 2;
            var r = e.indexOf(";", n);
            if (r < 0) r = e.length;
            return e.substring(n, r) || "" };
        return function(o, a) {
            if (void 0 === a) return s(o);
            if (e._$isString(a)) {
                if (a) { document.cookie = o + "=" + a + ";";
                    return a }
                a = { expires: -100 } }
            a = a || n;
            var _ = o + "=" + (a.value || "") + ";";
            delete a.value;
            if (void 0 !== a.expires) { t.setTime(i + a.expires * r);
                a.expires = t.toGMTString() }
            _ += e._$object2string(a, ";");
            document.cookie = _ } }();
    if (!0) t.copy(t.P("nej.j"), i);
    return i }, 15, 4);
! function() {
    var t = !0,
        e = null;
    ! function(i) {
        function n(i) {
            if ("bug-string-char-index" == i) return "a" != "a" [0];
            var n, s = "json" == i;
            if (s || "json-stringify" == i || "json-parse" == i) {
                if ("json-stringify" == i || s) {
                    var o = c.stringify,
                        _ = "function" == typeof o && h;
                    if (_) {
                        (n = function() {
                            return 1 }).toJSON = n;
                        try { _ = "0" === o(0) && "0" === o(new Number) && '""' == o(new String) && o(r) === a && o(a) === a && o() === a && "1" === o(n) && "[1]" == o([n]) && "[null]" == o([a]) && "null" == o(e) && "[null,null,null]" == o([a, r, e]) && '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}' == o({ a: [n, t, !1, e, "\0\b\n\f\r\t"] }) && "1" === o(e, n) && "[\n 1,\n 2\n]" == o([1, 2], e, 1) && '"-271821-04-20T00:00:00.000Z"' == o(new Date((-864e13))) && '"+275760-09-13T00:00:00.000Z"' == o(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == o(new Date((-621987552e5))) && '"1969-12-31T23:59:59.999Z"' == o(new Date((-1))) } catch (u) { _ = !1 } }
                    if (!s) return _ }
                if ("json-parse" == i || s) { i = c.parse;
                    if ("function" == typeof i) try {
                        if (0 === i("0") && !i(!1)) { n = i('{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');
                            var l = 5 == n.a.length && 1 === n.a[0];
                            if (l) {
                                try { l = !i('"\t"') } catch (d) {}
                                if (l) try { l = 1 !== i("01") } catch (f) {} } } } catch (m) { l = !1 }
                    if (!s) return l }
                return _ && l } }
        var r = {}.toString,
            s, o, a, _ = "function" == typeof define && define.amd,
            c = "object" == typeof exports && exports;
        c || _ ? "object" == typeof JSON && JSON ? c ? (c.stringify = JSON.stringify, c.parse = JSON.parse) : c = JSON : _ && (c = i.JSON = {}) : c = i.JSON || (i.JSON = {});
        var h = new Date((-0xc782b5b800cec));
        try { h = -109252 == h.getUTCFullYear() && 0 === h.getUTCMonth() && 1 === h.getUTCDate() && 10 == h.getUTCHours() && 37 == h.getUTCMinutes() && 6 == h.getUTCSeconds() && 708 == h.getUTCMilliseconds() } catch (u) {}
        if (!n("json")) {
            var l = n("bug-string-char-index");
            if (!h) var d = Math.floor,
                f = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                m = function(t, e) {
                    return f[e] + 365 * (t - 1970) + d((t - 1969 + (e = +(e > 1))) / 4) - d((t - 1901 + e) / 100) + d((t - 1601 + e) / 400) };
            if (!(s = {}.hasOwnProperty)) s = function(t) {
                var i = {},
                    n;
                if ((i.__proto__ = e, i.__proto__ = { toString: 1 }, i).toString != r) s = function(t) {
                    var i = this.__proto__,
                        t = t in (this.__proto__ = e, this);
                    this.__proto__ = i;
                    return t };
                else { n = i.constructor;
                    s = function(t) {
                        var e = (this.constructor || n).prototype;
                        return t in this && !(t in e && this[t] === e[t]) } }
                i = e;
                return s.call(this, t) };
            var p = { "boolean": 1, number: 1, string: 1, undefined: 1 };
            o = function(t, i) {
                var n = 0,
                    o, a, _;
                (o = function() { this.valueOf = 0 }).prototype.valueOf = 0;
                a = new o;
                for (_ in a) s.call(a, _) && n++;
                o = a = e;
                if (n) n = 2 == n ? function(t, e) {
                    var i = {},
                        n = "[object Function]" == r.call(t),
                        o;
                    for (o in t) !(n && "prototype" == o) && !s.call(i, o) && (i[o] = 1) && s.call(t, o) && e(o) } : function(t, e) {
                    var i = "[object Function]" == r.call(t),
                        n, o;
                    for (n in t) !(i && "prototype" == n) && s.call(t, n) && !(o = "constructor" === n) && e(n);
                    (o || s.call(t, n = "constructor")) && e(n) };
                else { a = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
                    n = function(t, e) {
                        var i = "[object Function]" == r.call(t),
                            n, o;
                        if (o = !i)
                            if (o = "function" != typeof t.constructor) { o = typeof t.hasOwnProperty;
                                o = "object" == o ? !!t.hasOwnProperty : !p[o] }
                        o = o ? t.hasOwnProperty : s;
                        for (n in t) !(i && "prototype" == n) && o.call(t, n) && e(n);
                        for (i = a.length; n = a[--i]; o.call(t, n) && e(n)); } }
                n(t, i) };
            if (!n("json-stringify")) {
                var g = { 92: "\\\\", 34: '\\"', 8: "\\b", 12: "\\f", 10: "\\n", 13: "\\r", 9: "\\t" },
                    v = function(t, e) {
                        return ("000000" + (e || 0)).slice(-t) },
                    y = function(t) {
                        var e = '"',
                            i = 0,
                            n = t.length,
                            r = n > 10 && l,
                            s;
                        for (r && (s = t.split("")); i < n; i++) {
                            var o = t.charCodeAt(i);
                            switch (o) {
                                case 8:
                                case 9:
                                case 10:
                                case 12:
                                case 13:
                                case 34:
                                case 92:
                                    e += g[o];
                                    break;
                                default:
                                    if (o < 32) { e += "\\u00" + v(2, o.toString(16));
                                        break }
                                    e += r ? s[i] : l ? t.charAt(i) : t[i]
                            }
                        }
                        return e + '"'
                    },
                    b = function(i, n, _, c, h, u, l) {
                        var f = n[i],
                            p, g, $, x, C, M, E, j, w;
                        try { f = n[i] } catch (Z) {}
                        if ("object" == typeof f && f) { p = r.call(f);
                            if ("[object Date]" == p && !s.call(f, "toJSON"))
                                if (f > -1 / 0 && f < 1 / 0) {
                                    if (m) { $ = d(f / 864e5);
                                        for (p = d($ / 365.2425) + 1970 - 1; m(p + 1, 0) <= $; p++);
                                        for (g = d(($ - m(p, 0)) / 30.42); m(p, g + 1) <= $; g++);
                                        $ = 1 + $ - m(p, g);
                                        x = (f % 864e5 + 864e5) % 864e5;
                                        C = d(x / 36e5) % 24;
                                        M = d(x / 6e4) % 60;
                                        E = d(x / 1e3) % 60;
                                        x %= 1e3 } else { p = f.getUTCFullYear();
                                        g = f.getUTCMonth();
                                        $ = f.getUTCDate();
                                        C = f.getUTCHours();
                                        M = f.getUTCMinutes();
                                        E = f.getUTCSeconds();
                                        x = f.getUTCMilliseconds() }
                                    f = (p <= 0 || p >= 1e4 ? (p < 0 ? "-" : "+") + v(6, p < 0 ? -p : p) : v(4, p)) + "-" + v(2, g + 1) + "-" + v(2, $) + "T" + v(2, C) + ":" + v(2, M) + ":" + v(2, E) + "." + v(3, x) + "Z" } else f = e;
                            else if ("function" == typeof f.toJSON && ("[object Number]" != p && "[object String]" != p && "[object Array]" != p || s.call(f, "toJSON"))) f = f.toJSON(i) }
                        _ && (f = _.call(n, i, f));
                        if (f === e) return "null";
                        p = r.call(f);
                        if ("[object Boolean]" == p) return "" + f;
                        if ("[object Number]" == p) return f > -1 / 0 && f < 1 / 0 ? "" + f : "null";
                        if ("[object String]" == p) return y("" + f);
                        if ("object" == typeof f) {
                            for (i = l.length; i--;)
                                if (l[i] === f) throw TypeError();
                            l.push(f);
                            j = [];
                            n = u;
                            u += h;
                            if ("[object Array]" == p) { g = 0;
                                for (i = f.length; g < i; w || (w = t), g++) { p = b(g, f, _, c, h, u, l);
                                    j.push(p === a ? "null" : p) }
                                i = w ? h ? "[\n" + u + j.join(",\n" + u) + "\n" + n + "]" : "[" + j.join(",") + "]" : "[]" } else { o(c || f, function(e) {
                                    var i = b(e, f, _, c, h, u, l);
                                    i !== a && j.push(y(e) + ":" + (h ? " " : "") + i);
                                    w || (w = t) });
                                i = w ? h ? "{\n" + u + j.join(",\n" + u) + "\n" + n + "}" : "{" + j.join(",") + "}" : "{}" }
                            l.pop();
                            return i } };
                c.stringify = function(t, e, i) {
                    var n, s, o;
                    if ("function" == typeof e || "object" == typeof e && e)
                        if ("[object Function]" == r.call(e)) s = e;
                        else if ("[object Array]" == r.call(e)) { o = {};
                        for (var a = 0, _ = e.length, c; a < _; c = e[a++], ("[object String]" == r.call(c) || "[object Number]" == r.call(c)) && (o[c] = 1)); }
                    if (i)
                        if ("[object Number]" == r.call(i)) {
                            if ((i -= i % 1) > 0) { n = "";
                                for (i > 10 && (i = 10); n.length < i; n += " "); } } else "[object String]" == r.call(i) && (n = i.length <= 10 ? i : i.slice(0, 10));
                    return b("", (c = {}, c[""] = t, c), s, o, n, "", []) }
            }
            if (!n("json-parse")) {
                var $ = String.fromCharCode,
                    x = { 92: "\\", 34: '"', 47: "/", 98: "\b", 116: "\t", 110: "\n", 102: "\f", 114: "\r" },
                    C, M, E = function() { C = M = e;
                        throw SyntaxError() },
                    j = function() {
                        for (var i = M, n = i.length, r, s, o, a, _; C < n;) { _ = i.charCodeAt(C);
                            switch (_) {
                                case 9:
                                case 10:
                                case 13:
                                case 32:
                                    C++;
                                    break;
                                case 123:
                                case 125:
                                case 91:
                                case 93:
                                case 58:
                                case 44:
                                    r = l ? i.charAt(C) : i[C];
                                    C++;
                                    return r;
                                case 34:
                                    r = "@";
                                    for (C++; C < n;) { _ = i.charCodeAt(C);
                                        if (_ < 32) E();
                                        else if (92 == _) { _ = i.charCodeAt(++C);
                                            switch (_) {
                                                case 92:
                                                case 34:
                                                case 47:
                                                case 98:
                                                case 116:
                                                case 110:
                                                case 102:
                                                case 114:
                                                    r += x[_];
                                                    C++;
                                                    break;
                                                case 117:
                                                    s = ++C;
                                                    for (o = C + 4; C < o; C++) { _ = i.charCodeAt(C);
                                                        _ >= 48 && _ <= 57 || _ >= 97 && _ <= 102 || _ >= 65 && _ <= 70 || E() }
                                                    r += $("0x" + i.slice(s, C));
                                                    break;
                                                default:
                                                    E() } } else {
                                            if (34 == _) break;
                                            _ = i.charCodeAt(C);
                                            for (s = C; _ >= 32 && 92 != _ && 34 != _;) _ = i.charCodeAt(++C);
                                            r += i.slice(s, C) } }
                                    if (34 == i.charCodeAt(C)) { C++;
                                        return r }
                                    E();
                                default:
                                    s = C;
                                    if (45 == _) { a = t;
                                        _ = i.charCodeAt(++C) }
                                    if (_ >= 48 && _ <= 57) {
                                        for (48 == _ && (_ = i.charCodeAt(C + 1), _ >= 48 && _ <= 57) && E(); C < n && (_ = i.charCodeAt(C), _ >= 48 && _ <= 57); C++);
                                        if (46 == i.charCodeAt(C)) {
                                            for (o = ++C; o < n && (_ = i.charCodeAt(o), _ >= 48 && _ <= 57); o++);
                                            o == C && E();
                                            C = o }
                                        _ = i.charCodeAt(C);
                                        if (101 == _ || 69 == _) { _ = i.charCodeAt(++C);
                                            (43 == _ || 45 == _) && C++;
                                            for (o = C; o < n && (_ = i.charCodeAt(o), _ >= 48 && _ <= 57); o++);
                                            o == C && E();
                                            C = o }
                                        return +i.slice(s, C) }
                                    a && E();
                                    if ("true" == i.slice(C, C + 4)) { C += 4;
                                        return t }
                                    if ("false" == i.slice(C, C + 5)) { C += 5;
                                        return !1 }
                                    if ("null" == i.slice(C, C + 4)) { C += 4;
                                        return e }
                                    E() } }
                        return "$" },
                    w = function(e) {
                        var i, n; "$" == e && E();
                        if ("string" == typeof e) {
                            if ("@" == (l ? e.charAt(0) : e[0])) return e.slice(1);
                            if ("[" == e) {
                                for (i = [];; n || (n = t)) { e = j();
                                    if ("]" == e) break;
                                    if (n)
                                        if ("," == e) { e = j(); "]" == e && E() } else E();
                                        "," == e && E();
                                    i.push(w(e)) }
                                return i }
                            if ("{" == e) {
                                for (i = {};; n || (n = t)) { e = j();
                                    if ("}" == e) break;
                                    if (n)
                                        if ("," == e) { e = j(); "}" == e && E() } else E();
                                        ("," == e || "string" != typeof e || "@" != (l ? e.charAt(0) : e[0]) || ":" != j()) && E();
                                    i[e.slice(1)] = w(j()) }
                                return i }
                            E() }
                        return e },
                    Z = function(t, e, i) { i = T(t, e, i);
                        i === a ? delete t[e] : t[e] = i },
                    T = function(t, e, i) {
                        var n = t[e],
                            s;
                        if ("object" == typeof n && n)
                            if ("[object Array]" == r.call(n))
                                for (s = n.length; s--;) Z(n, s, i);
                            else o(n, function(t) { Z(n, t, i) });
                        return i.call(t, e, n) };
                c.parse = function(t, i) {
                    var n, s;
                    C = 0;
                    M = "" + t;
                    n = w(j()); "$" != j() && E();
                    C = M = e;
                    return i && "[object Function]" == r.call(i) ? T((s = {}, s[""] = n, s), "", i) : n } }
        }
        _ && define(function() {
            return c })
    }(this);
    return JSON
}();
I$(91, function(_m, _p, _o, _f, _r) {
    if ("trident" === _m._$KERNEL.engine && "2.0" == _m._$KERNEL.release) I$(116, function() { JSON.parse = function() {
            var _isSafeJSON = function(t) {
                return !/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(t.replace(/"(\\.|[^"\\])*"/g, "")) };
            return JSON.parse._$aop(function(_event) {
                var _str = _event.args[0] || "";
                if (_str.length >= 5e5) { _event.stopped = !0;
                    _event.value = eval("(" + _str + ")") } }) }() });
    return JSON }, 18);
I$(66, function() {
    return JSON }, 91);
I$(82, function(t, e, i, n, r, s, o, a, _, c, h, u) {
    var l;
    _._$$ProxyAbstract = t._$klass();
    l = _._$$ProxyAbstract._$extend(s._$$EventTarget);
    l.__reset = function(t) { this.__super(t);
        this.__request = e._$fetch({ url: "", sync: !1, cookie: !1, type: "text", method: "GET", timeout: 6e4 }, t);
        var i = n._$get("csrf");
        if (i.cookie && i.param) {
            var s = encodeURIComponent(i.param) + "=" + encodeURIComponent(o._$cookie(i.cookie) || ""),
                a = this.__request.url.indexOf("?") < 0 ? "?" : "&";
            this.__request.url += a + s }
        this.__headers = t.headers || {};
        var _ = this.__headers[r._$HEAD_CT];
        if (null == _) this.__headers[r._$HEAD_CT] = r._$HEAD_CT_FORM };
    l.__destroy = function() { this.__super();
        delete this.__rkey;
        delete this.__request;
        delete this.__headers };
    l.__onLoadRequest = function(t) {
        var e = t.status;
        if (e != -1)
            if (0 == ("" + e).indexOf("2")) this._$dispatchEvent("onload", i._$text2type(t.result, this.__request.type));
            else this._$dispatchEvent("onerror", { data: e, result: t.result, code: r._$CODE_ERRSERV, message: "服务器返回异常状态[" + e + "]!" });
        else this._$dispatchEvent("onerror", { code: r._$CODE_TIMEOUT, message: "请求[" + this.__request.url + "]超时！" }) };
    l.__doSendRequest = h;
    l.__getResponseHeader = h;
    l._$send = function(t) {
        var e = this.__request.url;
        if (e) try { this.__request.data = null == t ? null : t;
            var i = { request: this.__request, headers: this.__headers };
            try { this._$dispatchEvent("onbeforerequest", i) } catch (n) { console.error(n.message);
                console.error(n.stack) }
            this.__doSendRequest(i) } catch (s) { this._$dispatchEvent("onerror", { code: r._$CODE_ERRSERV, message: "请求[" + e + "]失败:" + s.message + "！" }) } else this._$dispatchEvent("onerror", { code: r._$CODE_NOTASGN, message: "没有输入请求地址！" }) };
    l._$abort = h;
    l._$header = function(t) {
        if (!e._$isArray(t)) return this.__getResponseHeader(t) || "";
        var i = {};
        e._$forEach(t, function(t) { i[t] = this._$header(t) }, this);
        return i };
    return _ }, 1, 4, 2, 55, 24, 5, 29, 66);
I$(109, function(t, e, i, n) { t.__getXMLHttpRequest = function() {
        return new XMLHttpRequest };
    return t });
I$(83, function(t, e, i, n, r, s, o) {
    if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "2.0") I$(108, function() { e.__getXMLHttpRequest = function() {
            var t = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.5.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
            return function() {
                var e = null;
                i._$forIn(t, function(t) {
                    try { e = new ActiveXObject(t);
                        return !0 } catch (i) {} });
                return e } }() });
    return e }, 18, 109, 4);
I$(48, function(t, e, i, n, r, s, o, a, _) {
    var c;
    s._$$ProxyXHR = i._$klass();
    c = s._$$ProxyXHR._$extend(t._$$ProxyAbstract);
    c.__destroy = function() { this.__super();
        window.clearTimeout(this.__timer);
        delete this.__timer;
        try { this.__xhr.onreadystatechange = a;
            this.__xhr.abort() } catch (t) {}
        delete this.__xhr };
    c.__doSendRequest = function() {
        var t = function(t, e) { this.__xhr.setRequestHeader(e, t) };
        var i = function(t) {
            var i = [];
            e._$reverseEach(t.getElementsByTagName("input"), function(t) {
                if ("file" == t.type)
                    if (t.name) {
                        if (t.files.length > 1) { e._$forEach(t.files, function(e) { i.push({ name: t.name, file: e }) });
                            t.parentNode.removeChild(t) } } else t.parentNode.removeChild(t) });
            return i.length > 0 ? i : null };
        return function(s) {
            var o = s.request,
                a = s.headers;
            this.__xhr = r.__getXMLHttpRequest();
            if (a[n._$HEAD_CT] === n._$HEAD_CT_FILE) { delete a[n._$HEAD_CT];
                this.__xhr.upload.onprogress = this.__onStateChange._$bind(this, 1);
                if ("FORM" === o.data.tagName) {
                    var _ = i(o.data);
                    o.data = new FormData(o.data);
                    e._$forEach(_, function(t) {
                        var i = t.file;
                        o.data.append(t.name || i.name || "file-" + e._$uniqueID(), i) }) } }
            this.__xhr.onreadystatechange = this.__onStateChange._$bind(this, 2);
            if (0 !== o.timeout) this.__timer = window.setTimeout(this.__onStateChange._$bind(this, 3), o.timeout);
            this.__xhr.open(o.method, o.url, !o.sync);
            e._$loop(a, t, this);
            if (this.__request.cookie && "withCredentials" in this.__xhr) this.__xhr.withCredentials = !0;
            this.__xhr.send(o.data) } }();
    c.__onStateChange = function(t) {
        switch (t) {
            case 1:
                this._$dispatchEvent("onuploading", arguments[1]);
                break;
            case 2:
                if (4 == this.__xhr.readyState) this.__onLoadRequest({ status: this.__xhr.status, result: this.__xhr.responseText || "" });
                break;
            case 3:
                this.__onLoadRequest({ status: -1 }) } };
    c.__getResponseHeader = function(t) {
        return !this.__xhr ? "" : this.__xhr.getResponseHeader(t) };
    c._$abort = function() { this.__onLoadRequest({ status: 0 }) };
    return s }, 82, 4, 1, 24, 83);
I$(143, function(t, e, i, n, r) {
    var s = this,
        o = t._$KERNEL.prefix.pro,
        a = t._$is("desktop") ? 80 : t._$is("ios") ? 50 : 30;
    e.__requestAnimationFrame = function() {
        var e = t._$is("android") ? null : s.requestAnimationFrame || s[o + "RequestAnimationFrame"];
        return function() {
            if (!e) e = function(t) {
                return window.setTimeout(function() {
                    try { t(+new Date) } catch (e) {} }, 1e3 / a) };
            return e.apply(this, arguments) } }();
    e.__cancelAnimationFrame = function() {
        var e = t._$is("android") ? null : s.cancelAnimationFrame || s[o + "CancelAnimationFrame"];
        return function() {
            if (!e) e = function(t) { window.clearTimeout(t) };
            return e.apply(this, arguments) } }();
    return e }, 18);
I$(133, function(t, e) {
    return t }, 143, 18);
I$(127, function(t, e, i, n, r, s) { i.requestAnimationFrame = function() { e.__requestAnimationFrame.apply(null, arguments) };
    i.cancelAnimationFrame = function() { e.__cancelAnimationFrame.apply(null, arguments) };
    if (!0) {
        if (!this.requestAnimationFrame) this.requestAnimationFrame = i.requestAnimationFrame;
        if (!this.cancelAnimationFrame) this.cancelAnimationFrame = i.cancelAnimationFrame }
    return i }, 18, 133);
I$(134, function(t, e, i, n, r) { e.__canFlashEventBubble = function(t) {
        return "transparent" != (t || "").toLowerCase() };
    return e }, 18);
I$(128, function(t, e, i, n, r, s) {
    if ("trident" === e._$KERNEL.engine) I$(135, function() {
        t.__canFlashEventBubble = function(t) {
            return !0
        }
    });
    if ("webkit" === e._$KERNEL.engine) I$(136, function() { t.__canFlashEventBubble = function(t) {
            return !0 } });
    return t
}, 134, 18);
I$(129, '{var hide  = defined("hidden")&&!!hidden}\n{var param = defined("params")&&params||NEJ.O}\n{var width = !hide?width:"1px",height = !hide?height:"1px"}\n{if hide}<div style="position:absolute;top:0;left:0;width:1px;height:1px;z-index:10000;overflow:hidden;">{/if}\n<object classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"\n        codebase = "http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab"\n        width = "${width|default:"100px"}"\n        height = "${height|default:"100px"}" id="${id}">\n    <param value="${src}" name="movie">\n    {for x in param}\n    <param value="${x}" name="${x_key}"/>\n    {/for}\n    <embed src="${src}" name="${id}"\n           width="${width|default:"100px"}"\n           height="${height|default:"100px"}"\n           pluginspage="http://www.adobe.com/go/getflashplayer"\n           type="application/x-shockwave-flash"\n           {for x in param}${x_key}="${x}" {/for}></embed>\n</object>\n{if hide}</div>{/if}');
I$(110, function(t, e, i, n, r, s, o, a, _, c, h, u) {
    var l = r._$add(a);
    _._$flash = function() {
        var a = {},
            _, c = /^(?:mouse.*|(?:dbl)?click)$/i;
        window.onflashevent = function(t) {
            var e = decodeURIComponent(t.target),
                i = t.type.toLowerCase();
            var n = a[e + "-tgt"];
            if (n && c.test(i)) u(n, t);
            var r = a[e + "-on" + i];
            if (r) {
                var s = "";
                try { s = r(t) } catch (o) {}
                return s } };
        var h = function(t) { _ = document.title;
            var i = e._$get(t.parent) || document.body,
                n = r._$get(l, t);
            i.insertAdjacentHTML(!t.hidden ? "beforeEnd" : "afterBegin", n) };
        var u = function(t, e) {
            var n = e.type.toLowerCase();
            s.requestAnimationFrame(function() { i._$dispatchEvent(t, n) }) };
        var d = function(t) {
            return !!t && !!t.inited && !!t.inited() };
        var f = function(t) {
            var i = [document.embeds[t], e._$get(t), document[t], window[t]],
                r = n._$forIn(i, d),
                s = i[r],
                o = t + "-count";
            a[o]++;
            if (!(s || a[o] > 100)) window.setTimeout(f._$bind(null, t), 300);
            else {
                if (_) { document.title = _;
                    _ = null }
                a[t](s);
                delete a[t];
                delete a[o] } };
        var m = function(t) {
            var i = t.id,
                r = t.params;
            if (!r) { r = {};
                t.params = r }
            var s = r.flashvars || "";
            s += (!s ? "" : "&") + ("id=" + i);
            if (!t.hidden && (t.target || o.__canFlashEventBubble(r.wmode))) {
                var _ = e._$id(t.target) || e._$id(t.parent);
                a[i + "-tgt"] = _ }
            r.flashvars = s;
            n._$loop(t, function(t, e) {
                if (n._$isFunction(t) && "onready" != e) a[i + "-" + e] = t }) };
        return function(e) { e = t.X({}, e);
            if (e.src) {
                var i = "_" + n._$uniqueID();
                e.id = i;
                m(e);
                h(e);
                if (e.onready) { a[i] = e.onready;
                    a[i + "-count"] = 0;
                    f(i) } } } }();
    if (!0) t.copy(t.P("nej.e"), _);
    return _ }, 15, 2, 3, 4, 19, 127, 128, 129);
I$(84, function(t, e, i, n, r, s, o, a, _) {
    var c, h = {},
        u = n._$uniqueID();
    this["ld" + u] = function(t, e) {
        var i = h[t];
        if (i) { delete h[t];
            i.__onLoadRequest({ status: 200, result: e }) } };
    this["er" + u] = function(t, e) {
        var i = h[t];
        if (i) { delete h[t];
            i.__onLoadRequest({ status: e || 0 }) } };
    s._$$ProxyFlash = e._$klass();
    c = s._$$ProxyFlash._$extend(t._$$ProxyAbstract);
    c.__doSendRequest = function(t) {
        var e = h.flash;
        if (!n._$isArray(e))
            if (e) { this.__rkey = n._$uniqueID();
                h[this.__rkey] = this;
                var s = n._$fetch({ url: "", data: null, method: "GET" }, t.request);
                s.key = this.__rkey;
                s.headers = t.headers;
                s.onerror = "cb.er" + u;
                s.onloaded = "cb.ld" + u;
                var o = i._$getFlashProxy(s.url);
                if (o) s.policyURL = o;
                e.request(s) } else { h.flash = [this.__doSendRequest._$bind(this, t)];
                r._$flash({ hidden: !0, src: i._$get("ajax.swf"), onready: function(t) {
                        if (t) {
                            var e = h.flash;
                            h.flash = t;
                            n._$reverseEach(e, function(t, e, i) {
                                try { t() } catch (n) {} }) } } }) }
        else e.push(this.__doSendRequest._$bind(this, t)) };
    c._$abort = function() { delete h[this.__rkey];
        this.__onLoadRequest({ status: 0 }) };
    return s }, 82, 1, 55, 4, 110);
I$(64, function(t, e, i, n) { t.__formatOrigin = function() {
        var t = /^([\w]+?:\/\/.*?(?=\/|$))/i;
        return function(e) { e = e || "";
            if (t.test(e)) return RegExp.$1;
            else return "*" } }();
    t.__formatPassData = function(t) {
        return t };
    t.__postMessage = function(i, n) {
        if (i.postMessage) { n = n || e;
            i.postMessage(t.__formatPassData(n.data), t.__formatOrigin(n.origin)) } };
    return t });
I$(27, function(t, e, i, n, r, s, o, a) {
    if ("trident" === t._$KERNEL.engine && t._$KERNEL.release >= "4.0" && t._$KERNEL.release <= "5.0") I$(65, function() { e.__formatPassData = function(t) {
            return JSON.stringify(t) } });
    if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "3.0") I$(67, function(t) {
        var r = "MSG|",
            o = [];
        var a = function() {
            var t = unescape(window.name || "").trim();
            if (t && 0 == t.indexOf(r)) { window.name = "";
                var s = i._$string2object(t.replace(r, ""), "|"),
                    o = (s.origin || "").toLowerCase();
                if (!o || "*" == o || 0 == location.href.toLowerCase().indexOf(o)) n._$dispatchEvent(window, "message", { data: JSON.parse(s.data || "null"), source: window.frames[s.self] || s.self, origin: e.__formatOrigin(s.ref || document.referrer) }) } };
        var _ = function() {
            var t;
            var e = function(e, n, r) {
                if (i._$indexOf(t, e.w) < 0) { t.push(e.w);
                    r.splice(n, 1);
                    e.w.name = e.d } };
            return function() { t = [];
                i._$reverseEach(o, e);
                t = null } }();
        e.__postMessage = function() {
            var t = function(t) {
                var e = {};
                t = t || s;
                e.origin = t.origin || "";
                e.ref = location.href;
                e.self = t.source;
                e.data = JSON.stringify(t.data);
                return r + i._$object2string(e, "|", !0) };
            return function(e, i) { o.unshift({ w: e, d: escape(t(i)) }) } }();
        t._$$CustomEvent._$allocate({ element: window, event: "message" });
        setInterval(_, 100);
        setInterval(a, 20) }, 20, 66);
    return e }, 18, 64, 4, 3);
I$(10, function(t, e, i, n, r, s, o, a) { r._$postMessage = function() {
        var t = window.name || "_parent",
            r = [];
        r["_top"] = window.top;
        r["_self"] = window;
        r["_parent"] = window.parent;
        return function(o, a) {
            if (e._$isString(o)) { o = r[o] || window.frames[o] || (i._$get(o) || s).contentWindow;
                if (!o) return }
            var _ = e._$fetch({ data: null, origin: "*", source: t }, a);
            n.__postMessage(o, _) } }();
    if (!0) t.copy(t.P("nej.j"), r);
    return r }, 15, 4, 2, 27);
I$(85, function(t, e, i, n, r, s, o, a, _, c, h) {
    var u, l = {};
    a._$$ProxyFrame = i._$klass();
    u = a._$$ProxyFrame._$extend(t._$$ProxyAbstract);
    u.__init = function() {
        var t = "NEJ-AJAX-DATA:",
            e = !1;
        var i = function(e) {
            var i = e.data;
            if (0 == i.indexOf(t)) { i = JSON.parse(i.replace(t, ""));
                var n = l[i.key];
                if (n) { delete l[i.key];
                    i.result = decodeURIComponent(i.result || "");
                    n.__onLoadRequest(i) } } };
        var r = function() {
            if (!e) { e = !0;
                n._$addEvent(window, "message", i) } };
        return function() { this.__super();
            r() } }();
    u.__doSendRequest = function(t) {
        var i = t.request,
            a = r._$getFrameProxy(i.url),
            _ = l[a];
        if (!e._$isArray(_))
            if (_) { this.__rkey = e._$uniqueID();
                l[this.__rkey] = this;
                var c = e._$fetch({ url: "", data: null, timeout: 0, method: "GET" }, i);
                c.key = this.__rkey;
                c.headers = t.headers;
                o._$postMessage(l[a], { data: c }) } else { l[a] = [this.__doSendRequest._$bind(this, t)];
                s._$createXFrame({ src: a, visible: !1, onload: function(t) {
                        var i = l[a];
                        l[a] = n._$getElement(t).contentWindow;
                        e._$reverseEach(i, function(t) {
                            try { t() } catch (e) {} }) } }) }
        else _.push(this.__doSendRequest._$bind(this, t)) };
    u._$abort = function() { delete l[this.__rkey];
        this.__onLoadRequest({ status: 0 }) };
    return a }, 82, 4, 1, 3, 55, 2, 10);
I$(86, function(t, e, i, n, r, s, o, a, _, c, h, u) {
    var l, d = {},
        f = "NEJ-UPLOAD-RESULT:";
    _._$$ProxyUpload = e._$klass();
    l = _._$$ProxyUpload._$extend(t._$$ProxyAbstract);
    l.__init = function() {
        var t = !1;
        var e = function(t) {
            var e = t.data;
            if (0 == e.indexOf(f)) { e = JSON.parse(e.replace(f, ""));
                var i = d[e.key];
                if (i) { delete d[e.key];
                    i.__onLoadRequest(decodeURIComponent(e.result)) } } };
        var i = function() {
            if (!t) { t = !0;
                n._$addEvent(window, "message", e) } };
        return function() { this.__super();
            i() } }();
    l.__destroy = function() { this.__super();
        r._$remove(this.__frame);
        delete this.__frame;
        window.clearTimeout(this.__timer);
        delete this.__timer };
    l.__onLoadRequest = function(t) {
        try {
            var e = r._$text2type(t, this.__request.type);
            this._$dispatchEvent("onload", e) } catch (i) { this._$dispatchEvent("onerror", { code: s._$CODE_ERREVAL, message: t }) } };
    l.__doSendRequest = function() {
        var t = function() {
            var t, e;
            try {
                var t = this.__frame.contentWindow.document.body,
                    e = (t.innerText || t.textContent || "").trim();
                if (e.indexOf(f) >= 0 || t.innerHTML.indexOf(f) >= 0) return } catch (i) {
                return }
            this.__onLoadRequest(e) };
        var e = function(t, i, n) { o._$request(t, { type: "json", method: "POST", cookie: n, mode: parseInt(i) || 0, onload: function(r) {
                    if (this.__timer) { this._$dispatchEvent("onuploading", r);
                        this.__timer = window.setTimeout(e._$bind(this, t, i, n), 1e3) } }._$bind(this), onerror: function(r) {
                    if (this.__timer) this.__timer = window.setTimeout(e._$bind(this, t, i, n), 1e3) }._$bind(this) }) };
        return function(o) {
            var a = o.request,
                _ = o.headers,
                h = a.data,
                u = i._$uniqueID();
            d[u] = this;
            h.target = u;
            h.method = "POST";
            h.enctype = s._$HEAD_CT_FILE;
            h.encoding = s._$HEAD_CT_FILE;
            var l = h.action || "",
                f = l.indexOf("?") <= 0 ? "?" : "&";
            h.action = l + f + "_proxy_=form";
            this.__frame = r._$createXFrame({ name: u, onload: function(i) {
                    var r = n._$getElement(i);
                    n._$addEvent(r, "load", t._$bind(this));
                    h.submit();
                    var s = (h.nej_query || c).value;
                    if (s) {
                        var o = (h.nej_mode || c).value,
                            a = "true" === (h.nej_cookie || c).value;
                        this.__timer = window.setTimeout(e._$bind(this, s, o, a), 100) } }._$bind(this) }) } }();
    l._$abort = function() { this._$dispatchEvent("onerror", { code: s._$CODE_ERRABRT, message: "客户端终止文件上传" }) };
    return _ }, 82, 1, 4, 3, 2, 24, 22, 10);
I$(87, function(t, e, i, n, r, s, o, a) { r.__getProxyByMode = function(r, s, o) {
        var a = s ? { 2: n._$$ProxyUpload } : { 2: i._$$ProxyFrame, 3: e._$$ProxyFlash };
        return (a[r] || t._$$ProxyXHR)._$allocate(o) };
    return r }, 48, 84, 85, 86);
I$(49, function(t, e, i, n, r, s) {
    if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "5.0") I$(88, function() { e.__getProxyByMode = function() {
            var t = { 0: 2, 1: 3 };
            return e.__getProxyByMode._$aop(function(e) {
                var i = e.args,
                    n = i[0] || 0;
                i[0] = i[1] ? 2 : t[n] || n }) }() });
    return e }, 18, 87);
I$(22, function(t, e, i, n, r, s, o, a, _, c) {
    var h = {},
        u = _;
    o._$abort = function(t) {
        var e = h[t];
        if (e) e.req._$abort() };
    o._$filter = function(t) { u = t || _ };
    o._$request = function() {
        var t = (location.protocol + "//" + location.host).toLowerCase();
        var n = function(e) {
            var n = i._$url2origin(e);
            return !!n && n != t };
        var o = function(t) {
            return (t || a)[e._$HEAD_CT] == e._$HEAD_CT_FILE };
        var c = function(t) {
            var e = o(t.headers);
            if (!n(t.url) && !e) return r._$$ProxyXHR._$allocate(t);
            else return s.__getProxyByMode(t.mode, e, t) };
        var l = function(t, e) {
            var i = { data: e };
            var n = t.result.headers;
            if (n) i.headers = t.req._$header(n);
            return i };
        var d = function(t) {
            var e = h[t];
            if (e) {
                if (e.req) e.req._$recycle();
                delete h[t] } };
        var f = function(t, e) {
            var i = h[t];
            if (i) {
                var n = arguments[2];
                if ("onload" == e && i.result) n = l(i, n);
                d(t);
                var r = { type: e, result: n };
                u(r);
                if (!r.stopped)(i[e] || _)(r.result) } };
        var m = function(t, e) { f(t, "onload", e) };
        var p = function(t, e) { f(t, "onerror", e) };
        var g = function(t, e) {
            var n = t.indexOf("?") < 0 ? "?" : "&",
                e = e || "";
            if (i._$isObject(e)) e = i._$object2query(e);
            if (e) t += n + e;
            return t
        };
        return function(t, e) { e = e || {};
            var n = i._$uniqueID(),
                r = { result: e.result, onload: e.onload || _, onerror: e.onerror || _ };
            h[n] = r;
            e.onload = m._$bind(null, n);
            e.onerror = p._$bind(null, n);
            if (e.query) t = g(t, e.query);
            var s = e.method || "";
            if ((!s || /get/i.test(s)) && e.data) { t = g(t, e.data);
                e.data = null }
            e.url = t;
            r.req = c(e);
            r.req._$send(e.data);
            return n }
    }();
    o._$upload = function(t, r) { t = n._$get(t);
        if (!t) return "";
        var s = i._$fetch({ mode: 0, type: "json", query: null, cookie: !1, headers: {}, onload: null, onerror: null, onuploading: null, onbeforerequest: null }, r);
        s.data = t;
        s.method = "POST";
        s.timeout = 0;
        s.headers[e._$HEAD_CT] = e._$HEAD_CT_FILE;
        return o._$request(t.action, s) };
    if (!0) t.copy(t.P("nej.j"), o);
    return o
}, 15, 24, 4, 2, 48, 49);
I$(51, function(t, e, i, n, r, s, o, a) {
    var _;
    r._$$LoaderText = e._$klass();
    _ = r._$$LoaderText._$extend(t._$$LoaderAbstract);
    _.__getRequest = function() {
        return null };
    _.__doRequest = function() { n._$request(this.__url, { method: "GET", type: "text", onload: this.__onLoaded._$bind(this), onerror: this.__onError._$bind(this) }) };
    _.__onLoaded = function(t) { this.__doCallback("onload", { url: this.__url, content: t }) };
    return r }, 26, 1, 2, 22);
I$(111, function(t, e, i, n, r) { e.__removeIFrameKeepHistory = function(e) { t._$remove(e) };
    return e }, 2);
I$(89, function(t, e, i, n, r, s, o) {
    if ("trident" === i._$KERNEL.engine && i._$KERNEL.release <= "2.0") I$(113, function() { t.__removeIFrameKeepHistory = function(t) { e._$setStyle(t, "display", "none");
            try { t.contentWindow.document.body.innerHTML = "&nbsp;" } catch (i) {} } });
    return t }, 111, 2, 18);
I$(52, function(t, e, i, n, r, s, o, a) {
    var _;
    r._$$LoaderHtml = e._$klass();
    _ = r._$$LoaderHtml._$extend(t._$$LoaderAbstract);
    _.__getRequest = function() {
        var t = i._$create("iframe");
        t.width = 0;
        t.height = 0;
        t.style.display = "none";
        return t };
    _.__doRequest = function(t) {
        try { document.body.appendChild(t);
            t.src = this.__url } catch (e) { console.log(t);
            console.error(e) } };
    _.__onError = function(t) {
        var e = (this.__getLoadData(this.__url) || s).request;
        this.__doCallback("onerror", t);
        n.__removeIFrameKeepHistory(e) };
    _.__onLoaded = function() {
        var t = null,
            e = (this.__getLoadData(this.__url) || s).request;
        try {
            if (e.src != this.__url) return;
            t = e.contentWindow.document.body } catch (i) {}
        this.__doCallback("onload", t);
        n.__removeIFrameKeepHistory(e) };
    return r }, 26, 1, 2, 89);
I$(53, function(t, e, i, n, r, s, o) {
    var a;
    n._$$LoaderStyle = e._$klass();
    a = n._$$LoaderStyle._$extend(t._$$LoaderAbstract);
    a.__getRequest = function() {
        return i._$create("link") };
    a.__doRequest = function(t) { t.href = this.__url;
        document.head.appendChild(t) };
    return n }, 26, 1, 2);
I$(9, function(t, e, i, n, r, s, o) {
    var a;
    n._$$LoaderScript = e._$klass();
    a = n._$$LoaderScript._$extend(t._$$LoaderAbstract);
    a.__reset = function(t) { this.__super(t);
        this.__async = t.async;
        this.__charset = t.charset;
        this.__qopt.async = !1;
        this.__qopt.charset = this.__charset };
    a.__getRequest = function() {
        var t = i._$create("script");
        if (null != this.__async) t.async = !!this.__async;
        if (null != this.__charset) t.charset = this.__charset;
        return t };
    a.__doClearRequest = function(t) { i._$remove(t) };
    return n }, 26, 1, 2);
I$(21, function(t, e, i, n, r, s, o, a, _) { s._$loadScript = function(t, e) { r._$$LoaderScript._$allocate(e)._$load(t) };
    s._$queueScript = function(t, e) { r._$$LoaderScript._$allocate(e)._$queue(t) };
    s._$loadStyle = function(t, e) { n._$$LoaderStyle._$allocate(e)._$load(t) };
    s._$queueStyle = function(t, e) { n._$$LoaderStyle._$allocate(e)._$queue(t) };
    s._$loadHtml = function(t, e) { i._$$LoaderHtml._$allocate(e)._$load(t) };
    s._$loadText = function(t, i) { e._$$LoaderText._$allocate(i)._$load(t) };
    if (!0) t.copy(t.P("nej.j"), s);
    return s }, 15, 51, 52, 53, 9);
I$(6, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d) {
    var f = {},
        m = "ntp-" + +new Date + "-";
    h.tpl = function() {
        return f };
    h._$parseTemplate = function() {
        var t = 0;
        var c = function() {
            if (!(t > 0)) { t = 0;
                i._$dispatchEvent(document, "templateready");
                i._$clearEvent(document, "templateready") } };
        var l = function(t, i) {
            var r = n._$dataset(t, "src");
            if (r) { i = i || u;
                var s = i.root;
                if (!s) s = t.ownerDocument.location.href;
                else s = e._$absolute(s);
                r = r.split(",");
                e._$forEach(r, function(t, i, n) { n[i] = e._$absolute(t, s) });
                return r } };
        var d = function(t) {
            if (r._$is("mac") && "safari" === r._$KERNEL.browser) return e._$unescape(t.innerHTML);
            else return t.value || t.innerText || "" };
        var f = function(t, e) {
            if (t) {
                var i = l(t, e);
                if (i) a._$queueStyle(i, { version: n._$dataset(t, "version") });
                n._$addStyle(t.value) } };
        var m = function(e) { t--;
            n._$addScript(e);
            c() };
        var p = function(e, i) {
            if (e) {
                var r = l(e, i),
                    s = e.value;
                if (!r) n._$addScript(s);
                else { t++;
                    var i = { version: n._$dataset(e, "version"), onload: m._$bind(null, s) };
                    window.setTimeout(a._$queueScript._$bind(a, r, i), 0) } } };
        var g = function(e) { t--;
            h._$parseTemplate(e);
            c() };
        var v = function(e, i) {
            if (e) {
                var r = l(e, i)[0];
                if (r) { t++;
                    var i = { version: n._$dataset(e, "version"), onload: g };
                    window.setTimeout(a._$loadHtml._$bind(a, r, i), 0) } } };
        var y = function(e, i) { t--;
            h._$addTextTemplate(e, i || "");
            c() };
        var b = function(e, i) {
            if (e && e.id) {
                var r = e.id,
                    s = l(e, i)[0];
                if (s) { t++;
                    var o = s + (s.indexOf("?") < 0 ? "?" : "&") + (n._$dataset(e, "version") || ""),
                        i = { type: "text", method: "GET", onload: y._$bind(null, r) };
                    window.setTimeout(_._$request._$bind(_, o, i), 0) } } };
        var $ = function(t, e) {
            var i = t.name.toLowerCase();
            switch (i) {
                case "jst":
                    s._$addTemplate(d(t), t.id);
                    return;
                case "txt":
                    h._$addTextTemplate(t.id, d(t));
                    return;
                case "ntp":
                    h._$addNodeTemplate(d(t), t.id);
                    return;
                case "js":
                    p(t, e);
                    return;
                case "css":
                    f(t, e);
                    return;
                case "html":
                    v(t, e);
                    return;
                case "res":
                    b(t, e);
                    return } };
        o._$$CustomEvent._$allocate({ element: document, event: "templateready", oneventadd: c });
        return function(t, i) { t = n._$get(t);
            if (t) {
                var r = "TEXTAREA" == t.tagName ? [t] : e._$object2array(t.getElementsByTagName("textarea"));
                e._$forEach(r, function(t) { $(t, i) });
                n._$remove(t, !0) }
            c() } }();
    h._$addTextTemplate = function(t, e) {
        if (null != f[t] && typeof f[t] == typeof e) { console.warn("text template overwrited with key " + t);
            console.debug("old template content: " + f[t].replace(/\n/g, " "));
            console.debug("new template content: " + e.replace(/\n/g, " ")) }
        f[t] = e || "" };
    h._$getTextTemplate = function(t) {
        return f[t] || "" };
    h._$addNodeTemplate = function(t, i) { i = i || e._$uniqueID();
        t = n._$get(t) || t;
        h._$addTextTemplate(m + i, t);
        if (!e._$isString(t)) n._$removeByEC(t);
        return i };
    h._$getNodeTemplate = function(t) {
        if (!t) return null;
        t = m + t;
        var i = h._$getTextTemplate(t);
        if (!i) return null;
        var r;
        if (e._$isString(i)) { i = n._$html2node(i);
            var s = i.getElementsByTagName("textarea");
            if (!("TEXTAREA" == i.tagName || s && s.length)) h._$addTextTemplate(t, i);
            else r = i }
        if (!r) r = i.cloneNode(!0);
        n._$removeByEC(r);
        return r };
    h._$getItemTemplate = function() {
        var t = function(t, e) {
            return "offset" == e || "limit" == e };
        return function(i, n, r) {
            var s = [];
            if (!i || !i.length || !n) return s;
            r = r || u;
            var o = i.length,
                a = parseInt(r.offset) || 0,
                _ = Math.min(o, a + (parseInt(r.limit) || o)),
                c = { total: i.length, range: [a, _] };
            e._$merge(c, r, t);
            for (var h = a, l; h < _; h++) { c.index = h;
                c.data = i[h];
                l = n._$allocate(c);
                var d = l._$getId();
                f[d] = l;
                l._$recycle = l._$recycle._$aop(function(t, e) { delete f[t];
                    delete e._$recycle }._$bind(null, d, l));
                s.push(l) }
            return s } }();
    h._$getItemById = function(t) {
        return f[t] };
    h._$parseUITemplate = function() {
        var t = /#<(.+?)>/g;
        return function(i, r) { r = r || {};
            i = (i || "").replace(t, function(t, i) {
                var n = r[i];
                if (!n) { n = "tpl-" + e._$uniqueID();
                    r[i] = n }
                return n });
            h._$parseTemplate(n._$html2node(i));
            return r } }();
    c._$merge({ _$parseTemplate: h._$parseTemplate, _$addNodeTemplate: h._$addNodeTemplate });
    if (!0) t.copy(t.P("nej.e"), h);
    return h }, 15, 4, 3, 2, 18, 19, 20, 21, 22, 16);
I$(35, function(t, e, i, n) {
    var r = {
        404: "网络异常，请刷新页面重试",
        "-1": "网络不好，请刷新页面重试",
        "-2": "网络不好，请刷新页面重试",
        0: "网络不好，请刷新页面重试",
        401: "操作超时，请刷新页面重试",
        407: "该帐号已注册",
        410: "超过IP限制，请稍候再试",
        433: "系统繁忙，请刷新页面重试",
        108: "请输入正确的验证码",
        109: "请滑动验证码",
        110: "请点击验证码",
        409: "注册尝试次数太频繁",
        500: "系统繁忙，请您稍后再试",
        503: "服务器繁忙，请稍候再试",
        504: "次数超限，请稍候再试",
        505: "次数超限，请稍候再试",
        434: "您验证错误次数过多，请稍后再试",
        435: "您验证错误次数过多，请改天再试",
        436: "您验证错误次数过多，请稍后再试",
        437: "您验证错误次数过多，请改天再试",
        CHECK_USER_EMPTY: "请输入帐号",
        CHECK_USER_BAD: "请输入正确的邮箱或手机号码",
        CHECK_USER_TOO_LONG: "您输入的帐号太长了",
        CHECK_URS_EMPTY: "请输入帐号",
        CHECK_URS_BAD_BEGIN: "帐号须由字母开头",
        CHECK_URS_BAD_MB: "帐号须由字母开头",
        CHECK_URS_BAD_END: "帐号请以字母或数字结尾",
        CHECK_URS_BAD_LENGTH: "帐号须由6-18个字符组成",
        CHECK_URS_BAD_ILLEGAL: "请用字母、数字或下划线命名",
        CHECK_PASSWORD_EMPTY: "请设置您的登录密码",
        CHECK_PASSWORD_LENGTH: "密码须由6-16个字符组成，区分大小写",
        CHECK_PASSWORD_SIMPLE: "密码过于简单，请重新设置",
        CHECK_PASSWORD_EQUAL: "密码与注册帐号不能相同",
        CHECK_PASSWORD_CHARCODE255: "密码不符合规范",
        CHECK_PASSWORD_HASEMPTY: "密码中不允许出现空格",
        CHECK_PASSWORD2_EMPTY: "请重复输入密码",
        CHECK_PASSWORD2_DIFF: "密码不一致",
        CHECK_SMS_EMPTY: "请输入正确的验证码",
        CHECK_SMS_BAD: "请输入正确的验证码",
        CHECK_CAPTCHA_EMPTY: "请输入正确的验证码",
        CHECK_CAPTCHA_BAD: "请输入正确的验证码",
        CHECK_PERSON_ID_EMPTY: "请输入您的身份证号码",
        CHECK_PERSON_NAME_EMPTY: "请输入您的姓名",
        CHECK_MOBILE_EMPTY: "请输入正确的手机号",
        CHECK_MOBILE_BAD: "请输入正确的手机号",
        EXCEPTION_INIT_COMPONENT_401: "初始化失败，参数不齐全",
        EXCEPTION_INIT_COMPONENT_433: "初始化失败，参数不匹配",
        EXCEPTION_INIT_COMPONENT_500: "系统繁忙，请您稍后再试",
        EXCEPTION_CHECK_NAME_106: "该帐号不可注册",
        EXCEPTION_CHECK_NAME_401: "操作超时，请刷新页面重试",
        EXCEPTION_CHECK_NAME_433: "系统繁忙，请刷新页面重试",
        EXCEPTION_CHECK_NAME_407: "该帐号已注册",
        EXCEPTION_CHECK_NAME_409: "注册尝试次数太频繁",
        EXCEPTION_CHECK_NAME_410: "超过IP限制，请稍候再试",
        EXCEPTION_CHECK_NAME_422: "该帐号已被冻结",
        EXCEPTION_CHECK_NAME_500: "系统繁忙，请您稍后再试",
        EXCEPTION_CHECK_NAME_504: "次数超限，请稍候再试",
        EXCEPTION_CHECK_NAME_505: "次数超限，请稍候再试",
        EXCEPTION_GET_TICKET_106: "该帐号不可注册",
        EXCEPTION_GET_TICKET_108: "请输入正确的验证码",
        EXCEPTION_GET_TICKET_109: "请滑动验证码",
        EXCEPTION_GET_TICKET_110: "请点击验证码",
        EXCEPTION_GET_TICKET_401: "操作超时，请刷新页面重试",
        EXCEPTION_GET_TICKET_433: "系统繁忙，请刷新页面重试",
        EXCEPTION_GET_TICKET_424: "请求错误，请您稍后再试",
        EXCEPTION_GET_TICKET_407: "该帐号已注册",
        EXCEPTION_GET_TICKET_409: "注册尝试次数太频繁",
        EXCEPTION_GET_TICKET_410: "超过IP限制，请稍候再试",
        EXCEPTION_GET_TICKET_422: "该帐号已被冻结",
        EXCEPTION_GET_TICKET_500: "系统繁忙，请您稍后再试",
        EXCEPTION_GET_TICKET_503: "服务器繁忙，请稍候再试",
        EXCEPTION_GET_TICKET_504: "次数超限，请稍候再试",
        EXCEPTION_FAST_REG_107: "请输入正确的验证码",
        EXCEPTION_FAST_REG_106: "该帐号不可注册",
        EXCEPTION_FAST_REG_401: "操作超时，请刷新页面重试",
        EXCEPTION_FAST_REG_433: "系统繁忙，请刷新页面重试",
        EXCEPTION_FAST_REG_402: "当前网络异常，请检查您的网络环境",
        EXCEPTION_FAST_REG_407: "该帐号已注册",
        EXCEPTION_FAST_REG_409: "注册尝试次数太频繁",
        EXCEPTION_FAST_REG_410: "超过IP限制，请稍候再试",
        EXCEPTION_FAST_REG_422: "该帐号已被冻结",
        EXCEPTION_FAST_REG_412: "验证码错误次数过多，请改天再试",
        EXCEPTION_FAST_REG_413: "请输入正确的验证码",
        EXCEPTION_FAST_REG_500: "系统繁忙，请您稍后再试",
        EXCEPTION_FAST_REG_503: "服务器繁忙，请稍候再试",
        EXCEPTION_FAST_REG_504: "次数超限，请稍候再试",
        EXCEPTION_REG_MOB_401: "操作超时，请刷新页面重试",
        EXCEPTION_REG_MOB_433: "系统繁忙，请刷新页面重试",
        EXCEPTION_REG_MOB_402: "当前网络异常，请检查您的网络环境",
        EXCEPTION_REG_MOB_407: "该帐号已注册",
        EXCEPTION_REG_MOB_409: "注册尝试次数太频繁",
        EXCEPTION_REG_MOB_410: "超过IP限制，请稍候再试",
        EXCEPTION_REG_MOB_422: "该帐号已被冻结",
        EXCEPTION_REG_MOB_412: "验证码发送超过限制，请改天再试",
        EXCEPTION_REG_MOB_413: "请输入正确的验证码",
        EXCEPTION_REG_MOB_421: "该手机号已被注册",
        EXCEPTION_REG_MOB_423: "该手机号是保留帐号",
        EXCEPTION_REG_MOB_500: "系统繁忙，请您稍后再试",
        EXCEPTION_REG_MOB_108: "请输入正确的验证码",
        EXCEPTION_REG_MOB_109: "请滑动滑块验证码",
        EXCEPTION_GET_SMS_107: "请输入正确的验证码",
        EXCEPTION_GET_SMS_108: "请输入正确的验证码",
        EXCEPTION_GET_SMS_109: "请滑动验证码",
        EXCEPTION_GET_SMS_110: "请点击验证码",
        EXCEPTION_GET_SMS_401: "操作超时，请刷新页面重试",
        EXCEPTION_GET_SMS_433: "系统繁忙，请刷新页面重试",
        EXCEPTION_GET_SMS_410: "超过IP限制，请稍候再试",
        EXCEPTION_GET_SMS_411: "请您编辑短信”0000000000”发送到”000000”，完成注册",
        EXCEPTION_GET_SMS_412: "下发验证码超过了次数限制，请改天再试",
        EXCEPTION_GET_SMS_413: "请输入正确的验证码",
        EXCEPTION_GET_SMS_421: "该手机号已被注册",
        EXCEPTION_GET_SMS_423: "该手机号是保留帐号",
        EXCEPTION_GET_SMS_500: "系统繁忙，请您稍后再试",
        EXCEPTION_SEND_MAIL_104: "帐号不存在。",
        EXCEPTION_SEND_MAIL_106: "用户不是外部邮箱。",
        EXCEPTION_SEND_MAIL_401: "操作超时，请刷新页面重试。",
        EXCEPTION_SEND_MAIL_410: "超过IP限制，请稍候再试。",
        EXCEPTION_SEND_MAIL_421: "帐号已被注册。",
        EXCEPTION_SEND_MAIL_500: "系统繁忙，请您稍后再试。",
        EXCEPTION_SEND_MAIL_503: "服务器维护中，请稍后再试。",
        EXCEPTION_SEND_MAIL_504: "重发邮件次数超过限制。",
        MODAL_MAIL_SUCCESS_TITLE: "激活邮件已再次发送！",
        MODAL_MAIL_SUCCESS_TEXT: "请查看您的邮箱。",
        MODAL_MAIL_SUCCESS_BUTTON: "立即查看邮件",
        MODAL_MAIL_ERROR_TITLE: "出错了"
    };
    return r
});
I$(36, function() {
    var t = { 500: "系统繁忙，请您稍后再试。", "-1": "网络不好，请刷新页面重试", "-2": "网络不好，请刷新页面重试", 404: "网络异常，请刷新页面重试", 401: "操作超时，请刷新页面重试", 433: "系统繁忙，请刷新页面重试", "-101": "已重新发送激活邮件", "-102": "发送邮件失败，请稍后再试。", "-103": "正在加载AA资源，请稍后重试" };
    return t });
I$(11, function(t, e, i, n, r, s, o, a, _, c, h, u, l) {
    var d = { mobile: /^(13|14|15|17|18)\d{9}$/, netease: /^[a-zA-Z]([a-zA-Z]|\d|_){4,16}([a-zA-Z]|\d)$/ };
    var f, m = { "qq.com": "1", "sina.com": "1", "foxmail.com": "1", "sohu.com": "1", "vip.qq.com": "1", "live.com": "1", "139.com": "1", "tom.com": "1", "icloud.com": "1", "aliyun.com": "1", "edu.tw": "1" },
        p = { qq: "1", renren: "2", weibo: "3", weixin: "13", yixin: "8" };
    var g = function() {
        var t = document.body.scrollWidth,
            e = document.body.clientHeight,
            i = { width: t, height: e, type: "resize" };
        if (t * e > 0) { i["URS-CM"] = 1;
            o._$postMessage("_parent", { data: i }) } };
    c._$resize = g;
    var v = function(t, n, s, o) { s = e._$get(s);
        if (1 != window._$needCookieSet || n.indexOf("开启浏览器cookies") != -1) { o = o || "";
            var a = e._$get("cnt-box-parent");
            var _ = t && c._$getParent(t, "inputbox");
            if (_) e._$addClassName(_, "error-color");
            var h = r._$get("error-tmp", { str: n || "", type: o });
            if (3 == o) h = h.replace("ferrorhead3", "ferrorhead2").replace("ferrortail3", "ferrortail2 ferrortail3");
            s.innerHTML = h;
            s.className = "m-nerror";
            if (t) { e._$dataset(s, "from", t.name);
                e._$addClassName(s, "err_" + t.name) } else if (0 === t) e._$dataset(s, "from", "0");
            else e._$dataset(s, "from", "null");
            if (window._$errClickHide) { i._$clearEvent(s);
                var u = "touchend";
                if (nej.p._$IS.desktop) u = "mouseup";
                i._$addEvent(s, u, function() { e._$addClassName(s, "f-dn");
                    e._$delClassName(a, "haserr");
                    g() }) }
            e._$addClassName(a, "haserr");
            g() } };
    c._$isBadNetease = function(t) {
        return !d.netease.test(t) };
    c._$isNeteaseEmail = function(t) {
        return "163.com" === t || "126.com" === t || "yeah.net" === t || "vip.163.com" == t || "vip.126.com" == t || "188.com" == t };
    c._$checkMobile = function(t) {
        return d.mobile.test(t) };
    c._$getParent = function(t, i) { t = e._$get(t);
        t = t.parentElement || t.parentNode;
        for (; t != document.body;) {
            if (!t) return null;
            if (e._$hasClassName(t, i)) break;
            else t = t.parentElement || t.parentNode }
        return t };
    c._$showError = function(t, e, i, n) { v(t, e, i, n) };
    c._$showError2 = function(t, n, s, o) {
        var a = e._$get("cnt-box-parent");
        var _ = t && c._$getParent(t, "inputbox");
        if (_) e._$addClassName(_, "error-color");
        if (0 === o) { s = e._$get(s);
            s.innerHTML = r._$get("error-tmp", { str: n || "" });
            s.className = "m-nerror";
            if (t) { e._$dataset(s, "from", t.name);
                e._$addClassName(s, "err_" + t.name) } else e._$dataset(s, "from", "null") }
        i._$addEvent(s, "click", function() {
            if (t) t.focus();
            else { e._$addClassName(s, "f-dn");
                g() } });
        e._$addClassName(a, "haserr");
        g() };
    c._$removeError = function(t, i) {
        var n = e._$get("cnt-box-parent");
        var r = e._$dataset(i, "from");
        var s = t.name;
        var o = t && c._$getParent(t, "inputbox");
        if (o) e._$delClassName(o, "error-color");
        if (r == s || "null" == r) { i = e._$get(i);
            e._$addClassName(i, "f-dn");
            if ("email" == s) e._$delClassName(i, "err_email");
            else if ("password" == s) e._$delClassName(i, "err_password");
            else if ("checkcode" == s) e._$delClassName(i, "err_checkcode");
            else if ("phone" == s) e._$delClassName(i, "err_phone");
            else if ("phonecode" == s) e._$delClassName(i, "err_phonecode") }
        if (0 != r) e._$delClassName(n, "haserr");
        g() };
    c._$removeError2 = function() {
        var t = e._$get("nerror"),
            i = e._$dataset(t, "from");
        if (0 != i) e._$addClassName(t, "f-dn");
        g() };
    c._$removeError3 = function() {
        var t = e._$get("nerror");
        e._$addClassName(t, "f-dn") };
    c._$showFail = function(t, i) {
        if ("601" != t) { f = clearTimeout(f);
            e._$remove("failbox", !0);
            var n = parseInt(s._$KERNEL.version, 10);
            var r = "trident" == s._$KERNEL.engine && n < 10 ? "boxtop" : "";
            var o, a = 500 == t ? "fail0 " : "fail1 ",
                h = e._$create("div", a + r, e._$getByClassName(document, "g-bd")[0]);
            o = _[t] || c._$getErrorTxt(t);
            if ("-103" == t) o = o.replace("AA", i);
            h.id = "failbox";
            h.innerHTML = '<div class="box">' + o + "</div>";
            f = setTimeout(function() { e._$remove("failbox", !0) }, 5e3) } };
    c._$showFail2 = function(t) { f = clearTimeout(f);
        e._$remove("failbox", !0);
        var i = parseInt(s._$KERNEL.version, 10);
        var n = "trident" == s._$KERNEL.engine && i < 10 ? "boxtop" : "";
        var r = "fail1 ",
            o = e._$create("div", r + n, e._$getByClassName(document, "g-bd")[0]);
        o.id = "failbox";
        o.innerHTML = '<div class="box">' + t + "</div>";
        f = setTimeout(function() { e._$remove("failbox", !0) }, 5e3) };
    c._$hideFail = function() { e._$remove("failbox", !0) };
    c._$supportCss3 = function(t) {
        var e = ["webkit", "Moz", "ms", "o"],
            i, n = [],
            r = document.documentElement.style,
            s = function(t) {
                return t.replace(/-(\w)/g, function(t, e) {
                    return e.toUpperCase() }) };
        for (i in e) n.push(s(e[i] + "-" + t));
        n.push(s(t));
        for (i in n)
            if (n[i] in r) return !0;
        return !1 };
    c._$getCommonEmail = function(t) {
        var e = t.split("@")[1];
        return m[e] ? "//mail." + t.substr(t.indexOf("@") + 1) : "" };
    c.__hackPush = function() {
        return 0 };
    c._$loadGaq = function() { _gaq = window["_gaq"] || [];
        if (!window.wdaId) _gaq.push = c.__hackPush };
    c._$timeCount = function(t) {
        if (!window.timecount) window.timecount = [];
        window.timecount[t] = (new Date).getTime() };
    c._$timeCountEnd = function(t) {
        if (!window.timecount) return 0;
        if (!window.timecount[t]) return 0;
        var e = (new Date).getTime() - window.timecount[t];
        window.timecount[t] = 0;
        return e };
    c._$requestJsonp = function(t, e, i, n) {
        var r = (new Date).getTime();
        var s = "jsonp" + r;
        window["qrcb"] = [];
        window["qrcb"][s] = i;
        var o = "";
        for (var a in e) o += "&" + a + "=" + e[a];
        o = o.slice(1);
        var _ = t + "?" + o + "&callback=qrcb." + s;
        var c = document.getElementById("mp-script-" + s);
        if (!c) { c = document.createElement("script");
            c.type = "text/javascript";
            c.id = "mp-script-" + s;
            c.src = _;
            document.getElementsByTagName("head")[0].appendChild(c) }
        if (!n) document.getElementsByTagName("head")[0].appendChild(c) };
    c._$postMessage = function(t, e) { o._$postMessage(t, e) };
    c._$showSuccLoading = function() {
        var t = e._$get("loading");
        if (t) e._$delClassName(t, "f-dn") };
    c._$parseOauth = function() {
        var t = window.URSCONFIG.oauthLoginConfig || !1;
        if (!t) return t;
        var e = location.protocol + "//reg.163.com/outerLogin/oauth2/connect.do?product=" + window.URSCONFIG.product;
        n._$forEach(t, function(t) {
            if (!t.url)
                if ("alipay" == t.name) { e = e.replace("/outerLogin/oauth2/connect.do", "/outerLogin/oauth2/aliPayFastLogin.do");
                    t.url = e } else t.url = e + "&target=" + p[t.name];
            var i = { url: location.protocol + "//webzj.reg.163.com/webapp/res/statichtml/third.html", url2: location.protocol + "//webzj.reg.163.com/webapp/res/statichtml/third.html" };
            if (t.backurl) { i = { url: location.protocol + "//webzj.reg.163.com/webapp/res/statichtml/third.html?backurl=" + t.backurl, url2: location.protocol + "//webzj.reg.163.com/webapp/res/statichtml/third.html?backurl=" + t.backurl };
                if ("alipay" == t.name) i = { redirect_error: location.protocol + "//webzj.reg.163.com/webapp/res/statichtml/third.html?backurl=" + t.backurl, redirect_url: location.protocol + "//webzj.reg.163.com/webapp/res/statichtml/third.html?backurl=" + t.backurl } } else if ("alipay" == t.name) i = { redirect_error: location.protocol + "//webzj.reg.163.com/webapp/res/statichtml/third.html", redirect_url: location.protocol + "//webzj.reg.163.com/webapp/res/statichtml/third.html" };
            t.url += "&" + n._$object2query(i) });
        return t };
    c._$doThirdLogin = function(t) {
        var n = i._$getElement(t),
            r = e._$dataset(n, "link"),
            s = e._$dataset(n, "width"),
            o = e._$dataset(n, "height");
        if (r) {
            var a = s || 514;
            var _ = o || 764;
            var c = (window.screen.availHeight - 30 - a) / 2;
            var h = (window.screen.availWidth - 10 - _) / 2;
            window.open(r, "thirdLogin", "height=" + a + ",width=" + _ + ",top=" + c + ",left=" + h + ",toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no") } };
    c._$checkPwd = function() {
        var t = function(t) {
            var e = t.charAt(0),
                i = !0;
            for (var n = 1, r = t.length; n < r; n++)
                if (e !== t.charAt(n)) { i = !1;
                    break }
            return i };
        var e = function(t) {
            var e = ["123456", "123456789", "12345678", "123123", "5201314", "1234567", "7758521", "654321", "1314520", "123321", "1234567890", "147258369", "123654", "5211314", "woaini", "1230123", "987654321", "147258", "123123123", "7758258", "520520", "789456", "456789", "159357", "112233", "1314521", "456123", "110110", "521521", "zxcvbnm", "789456123", "0123456789", "0123456", "123465", "159753", "qwertyuiop", "987654", "115415", "1234560", "123000", "123789", "100200", "963852741", "121212", "111222", "123654789", "12301230", "456456", "741852963", "asdasd", "asdfghjkl", "369258", "863786", "258369", "8718693", "666888", "5845201314", "741852", "168168", "iloveyou", "852963", "4655321", "102030", "147852369", "321321"];
            var i = !1;
            for (var n = 0, r = e.length; n < r; n++)
                if (e[n] === t) { i = !0;
                    break }
            return i };
        var i = function(t, e) {
            var i = e.substr(0, e.indexOf("@")) || e;
            return t === i || t === e };
        var n = function(t) {
            return /[^\x21-\x7E]/g.test(t) };
        return function(r, s) {
            var o = r.length,
                _;
            if (o < 6 || o > 16) _ = a.CHECK_PASSWORD_LENGTH;
            else if (t(r) || e(r) || /^\d{1,9}$/.test(r)) _ = a.CHECK_PASSWORD_SIMPLE;
            else if (i(r, s)) _ = a.CHECK_PASSWORD_EQUAL;
            else if (n(r)) _ = a.CHECK_PASSWORD_CHARCODE255;
            return _ } }();
    c.__sendClose = function() {
        var t = { type: "close" };
        t["URS-CM"] = 1;
        c._$postMessage("_parent", { data: t }) };
    c._$regSuccess = function(t, i, n) {
        var s = e._$get("cnt-box"),
            o = e._$get("cnt-box2");
        r._$render(o, "register-success", { username: i, mobile: n });
        e._$setStyle(s, "display", "none");
        e._$setStyle(o, "display", "block");
        var a = t || 3;
        e._$get("countdown").innerHTML = a + "秒后自动登录";
        var _ = setInterval(function() {
            a -= 1;
            if (0 !== a) e._$get("countdown").innerHTML = a + "秒后自动登录";
            else { _ = clearInterval(_);
                var t = { type: "register-success", username: i, "URS-CM": 1 };
                c._$postMessage("_parent", { data: t });
                c.__sendClose() }
        }._$bind(this), 1e3);
        c._$resize()
    };
    c._$getErrorTxt = function(t) {
        if (!t) return "检测出非法请求，为了您的帐号安全，请您稍后再试。";
        t = t.toString();
        if ("433" == t) return "系统繁忙，请刷新页面重试";
        if (0 === t.indexOf("5")) return "服务器内部错误，请您稍后再试";
        else if (0 === t.indexOf("4")) return "请求错误，请您稍后再试";
        else return "请求错误，请您稍后再试" };
    c._$setOutLogin = function() {
        var t = window.$loginOpts.promark + +new Date;
        var e = window.$loginOpts.domains || "";
        var i = window.$loginOpts.cookieDomain || "";
        var n = window.$loginOpts.prdomain || "";
        var r = window.$loginOpts.needMobileLogin || "";
        var s = window.$loginOpts.mobileFirst || "";
        var o = window.$loginOpts.noqr || "";
        var a = window.$loginOpts.smsLoginFirst || "";
        var _ = window.$loginOpts.toolName || "";
        var c = window.$loginOpts.toolUrl || "";
        var h = window.$loginOpts.needQrLogin || "";
        var u = location.protocol;
        var l = u + "//webzj.reg.163.com/safelogin.html?loginKey=" + t + "&domains=" + e + "&prdomain=" + n + "&cookieDomain=" + i + "&needMobileLogin=" + r + "&mobileFirst=" + s + "&noqr=" + o + "&smsLoginFirst=" + a + "&toolName=" + _ + "&toolUrl=" + c + "&needQrLogin=" + h;
        var d = '<strong class="msg"><span style="color:#000;">您的帐号存在风险，</span><a style="color:red;font-size:14px;text-decoration:underline;font-weight:bolder;" target="_blank" href=' + l + ">点此进行安全登录</a></strong>";
        v(0, d, "nerror") };
    c._$addPathB = function(t) {
        if (window._$pathB) t = t.replace(/:\/\/(?:[^\/]+)/, function(t) {
            return t + "/b" });
        return t };
    c._$3pSuccess = function(t) { t["URS-CM"] = 1;
        t["type"] = "otherRegSuccess";
        c._$postMessage("_parent", { data: t }) };
    return c
}, 1, 2, 3, 4, 19, 18, 10, 35, 36);
I$(28, function(t, e, i, n, r, s, o, a, _, c) {
    var h = "dl.reg.163.com",
        u = "zc.reg.163.com";
    var l = { "/l": { name: "/l", 201: { ret: "201", message: "登录成功" }, 401: { ret: "401", message: "参数错误" }, 402: { ret: "402", message: "指纹错误" }, 423: { ret: "423", message: "风控帐号" } }, "/lpwd": { name: "/lpwd", 201: { ret: "201", message: "登录成功" } }, "/lvfsms": { name: "/lvfsms", 201: { ret: "201", message: "登录成功" } } };
    o._$request = function() {
        var t = function(t, e) {
            if (l[t]) {
                var i = { data: {} };
                var n = e.ret || -1;
                i.data["URS-CM"] = 1;
                i.data["URS-CM-STATE"] = l[t][n] || { ret: -1 };
                if (e.unprotectedGuide) l[t][n].unprotectedGuide = 1;
                i.data["URS-CM-STATENAME"] = l[t].name;
                s._$postMessage("_parent", i) } };
        return function(e, i, n, r, o) {
            var a = h;
            var _ = u;
            var c;
            if (window["$cookieDomain"])
                if (window["$cookieDomain"].indexOf("icourse163.org") >= 0) a = "reg." + window["$cookieDomain"] + "/dl";
                else a = "passport." + window["$cookieDomain"] + "/dl";
            if (window["$regCookieDomain"])
                if (window["$regCookieDomain"].indexOf("icourse163.org") >= 0) _ = "reg." + window["$regCookieDomain"] + "/zc";
                else _ = "passport." + window["$regCookieDomain"] + "/zc";
            if (e.indexOf("mb-") > -1) { a += "/yd";
                _ += "/yd" }
            if (o) c = a;
            else c = _;
            MP[e](i, function(e, i) { t(e, i);
                n(i) }, function(e, i) { t(e, i);
                if ("601" != i.ret) r(i);
                else s._$setOutLogin() }, c) } }();
    return o }, 1, 2, 4, 22, 10, 11);
I$(68, function(t, e, i, n, r, s, o, a, _, c) {
    var h;
    o._$$Abstract = e._$klass();
    h = o._$$Abstract._$extend(r._$$EventTarget);
    h.__init = function() { this.__super();
        i._$dumpCSSText();
        this.__initXGui();
        this.__initNode() };
    h.__reset = function(t) { this.__super(t);
        this.__doInitClass(t.clazz);
        this._$appendTo(t.parent) };
    h.__destroy = function() { this.__super();
        this.__doDelParentClass();
        delete this.__parent;
        i._$removeByEC(this.__body);
        i._$delClassName(this.__body, this.__class);
        delete this.__class };
    h.__initXGui = _;
    h.__initNode = function() {
        if (!this.__seed_html) this.__initNodeTemplate();
        this.__body = s._$getNodeTemplate(this.__seed_html);
        if (!this.__body) this.__body = i._$create("div", this.__seed_css);
        i._$addClassName(this.__body, this.__seed_css) };
    h.__initNodeTemplate = _;
    h.__doInitClass = function(t) { this.__class = t || "";
        i._$addClassName(this.__body, this.__class) };
    h.__doAddParentClass = function() {
        if (this.__seed_css) {
            var t = this.__seed_css.split(/\s+/);
            i._$addClassName(this.__parent, t.pop() + "-parent") } };
    h.__doDelParentClass = function() {
        if (this.__seed_css) {
            var t = this.__seed_css.split(/\s+/);
            i._$delClassName(this.__parent, t.pop() + "-parent") } };
    h._$getBody = function() {
        return this.__body };
    h._$appendTo = function(t) {
        if (this.__body) { this.__doDelParentClass();
            if (n._$isFunction(t)) this.__parent = t(this.__body);
            else { this.__parent = i._$get(t);
                if (this.__parent) this.__parent.appendChild(this.__body) }
            this.__doAddParentClass() } };
    h._$show = function() {
        if (this.__parent && this.__body && this.__body.parentNode != this.__parent) this.__parent.appendChild(this.__body) };
    h._$hide = function() { i._$removeByEC(this.__body) };
    if (!0) t.copy(t.P("nej.ui"), o);
    return o }, 15, 1, 2, 4, 5, 6);
I$(33, function(t, e, i, n) {
    var r = { 404: "网络异常，请刷新页面重试", "-1": "网络不好，请刷新页面重试", "-2": "网络不好，请刷新页面重试", 0: "网络不好，请刷新页面重试", 401: "操作超时，请刷新页面重试", 402: "当前网络异常，请检查您的网络环境", 403: "当前网络环境不安全，请稍后再试!", 410: "超过IP限制，请稍候再试", 433: "系统繁忙，请刷新页面重试", 441: "请输入图片验证码", 444: "请滑动验证码", 411: "IP一分钟内登录不存在的用户达到限制，5分钟后再试", 413: "帐号或密码错误", "412-01": "您登录错误次数过多，请稍后再试", "412-02": "您登录错误次数过多，请明天再试", "413-01": "您登录错误密码次数过多，请稍后再试", "413-02": "您登录错误密码次数过多，请明天再试", "413-03": "您的IP登录错误密码次数过多，请稍后再试", "414-01": "您的IP登录错误次数过多，请稍后再试", "414-02": "您的IP登录错误次数过多，请明天再试", 416: "您的IP登录过于频繁,请稍后再试", "417-01": "您的IP登录成功次数过多，请稍后再试", "417-02": "您的IP登录成功次数过多，请明天再试", "418-01": "您登录成功次数过多,请稍后再试", "418-02": "您登录成功次数过多,请明天再试", "419-01": "您登录过于频繁,请稍后再试", "419-02": "您的IP登录过于频繁,请稍后再试", 422: '该帐号已被锁定，请使用<a target="_blank" href="https://id.163.com/gj/" style="color:#4aafe9;text-decoration:underline;">网易帐号管家</a>解锁，或24小时后再试。如为被盗，申请<a target="_blank" href="https://mima.163.com/nie/" style="color:#4aafe9;text-decoration:underline;">帐号申诉</a>。', 420: "帐号不存在", 424: '该靓号服务已到期，<a target="_blank" href="//haoma.163.com/pay/pay.do?ayRenew=1">点击续费</a>，更多精彩', 425: '该帐号尚未激活，请到已注册的邮箱<a target="_blank" href="#">激活帐号</a>', 426: "该帐号未及时激活，请重新注册", 442: "请输入正确的验证码", 443: "请输入正确的短信验证码", 409: "您登录过于频繁,请稍后再试", 500: "系统繁忙，请您稍后再试", 503: "服务器繁忙，请稍候再试", 505: "次数超限，请稍候再试", 602: '邮箱服务已到期，<a target="_blank" href="//vpay.vip.163.com/vippayunion/index.html" style="color:#4aafe9;text-decoration:underline;">点击续费</a>，更多精彩', 431: "请求错误，请您稍后再试", 434: "您验证错误次数过多，请稍后再试", 435: "您验证错误次数过多，请改天再试", 436: "您验证错误次数过多，请稍后再试", 437: "您验证错误次数过多，请改天再试", 430: "此次登录不需要进行密保验证", 453: "帐号未关联手机号", 454: "帐号关联手机未验证" };
    return r });
I$(70, function(t, e, i, n, r, s, o, a, _, c, h) {
    var u;
    a._$$Module = t._$klass();
    u = a._$$Module._$extend(r._$$Abstract);
    u.__init = function(t) { this.__super(t) };
    u.__reset = function(t) { this.__super(t);
        this.__initForm();
        this.__initEvent();
        this.__states = {};
        if (!t.errMsg) this._$clearState() };
    u.__destroy = function() { this.__super();
        n._$forEach(this.__ipts, function(t) { t = t._$recycle() }) };
    u.__initNode = function() { this.__super() };
    u.__initCallback = function() {};
    u.__initErrorHandler = function() {};
    u.__setPlaceHolder = function() {
        if (this.__placeholder && !this.__placeholder2) {
            if (this.__placeholder.account) {
                var t = e._$getByClassName(this.__body, "u-input")[0];
                e._$getByClassName(t, "u-label")[0].innerHTML = this.__placeholder.account;
                var i = e._$getByClassName(t, "j-inputtext")[0];
                e._$dataset(i, "placeholder", this.__placeholder.account) }
            if (this.__placeholder.pwd) {
                var n = e._$getByClassName(this.__body, "u-input")[1];
                e._$getByClassName(n, "u-label")[0].innerHTML = this.__placeholder.pwd;
                var r = e._$getByClassName(n, "j-inputtext")[0];
                e._$dataset(r, "placeholder", this.__placeholder.pwd) }
            this.__placeholder2 = 1 } };
    u._$stateOK = function(t) { this.__form._$checkValidity(null, 1);
        setTimeout(function() {
            var e = 1,
                i = "";
            if (void 0 != typeof this.__states["checkcode"]) this.__states["tcheckcode"] = this.__states["checkcode"];
            n._$forIn(this.__states, function(t, n) {
                if ("checkcode" != n)
                    if (t && !i) { e = 0;
                        i = n } });
            t(e, i) }._$bind(this), 350) };
    u._$getValues = function() {
        var t = [];
        n._$forEach(this.__inputs, function(e) {
            var i = e.value;
            t.push(i) });
        return t };
    u._$showTip = function() {};
    u._$clearState = function() {
        if (this._$hideCheckCode);
        n._$reverseEach(this.__ipts, function(t, e) {
            var i = e ? 0 : 1;
            t._$onClear(i) }._$bind(this));
        this.__initError() };
    u.__initError = function() {
        var t = e._$get("nerror");
        t.innerHTML = "";
        var i = e._$getByClassName(document, "error-color");
        for (var n = 0; n < i.length; n++) e._$delClassName(i[n], "error-color") };
    u.__setSlideSuc = function() {
        var t = e._$getByClassName(document, "ncpt_txt_status")[0];
        if (t) { t.style.display = "block";
            t.innerHTML = '<div class="u-success u-suc"></div>' }
        t.className = "ncpt_txt_status TxtStatus statusTxt";
        this.__states["slidecap"] = 0 };
    u.__cbVftcp = function(t) { this.__clearSlideErr();
        this.__slideCapLock = 0;
        this.__setSlideSuc();
        this.__checkNextBtn();
        if (t) this._$dispatchEvent("onSlideOk") };
    u.__unLockLogin = function() { this._$dispatchEvent("onUnLockLogin") };
    u.__cbVftcpEx = function(t) {
        var e, i;
        this.__slideCapLock = 0;
        this.__unLockLogin();
        if (t) { e = t.ret;
            if ("441" == e) { this.__needSlideCap = 0;
                this.__needCheckCode = 1;
                this._$refreshCheckCode(e);
                i = o[e];
                s._$showError({ name: "slide" }, i, "nerror") } else if ("444" == e || "445" == e) { this.__needSlideCap = 1;
                this.__needCheckCode = 0;
                this._$refreshCheckCode(e);
                s._$showError({ name: "slide" }, this.__slideTxt, "nerror") } else { i = o[e];
                s._$showError({ name: "slide" }, i, "nerror");
                this._$getSlideCap() } } else s._$showError({ name: "slide" }, this.__slideTxt, "nerror") };
    u.__slidebarover = function() {
        if (this.__sdot) this.__sdot = clearTimeout(this.__sdot);
        this.__sdov = setTimeout(function() { this.__slideCapBox.style.zIndex = "501" }._$bind(this), 100) };
    u.__slidebarout = function() {
        if (this.__sdov) this.__sdov = clearTimeout(this.__sdov);
        this.__sdot = setTimeout(function() { this.__slideCapBox.style.zIndex = "19" }._$bind(this), 100) };
    u.__clearSlideErr = function() { s._$removeError({ name: "slide" }, "nerror") };
    u.__vSlide = function() {
        if (!this.__myCaptcha) return 1;
        var t = this.__myCaptcha.getPwd() || "";
        if ("" == t || "LG42Dm53vsrZmrXdZ6buHUVNfQcsLzql1gV7HFhl5yZzlILOJmPEY+r+vJComfirFG2deb709GYQQIob6ke6c31j6W+FKrE6QEghCshv5Kc=" == t) return 1;
        else return 0 };
    u._$getSlideCap = function() { this.__slideOpt.captchaType = this.__slideTarget;
        if (window._$needUrsBgp && window._$BGP) { this.__slideOpt.apiServer = "captcha2.reg.163.com/v2";
            this.__slideOpt.staticServer = "captcha2.reg.163.com/v2" }
        if (this.__myCaptcha) this.__myCaptcha.refresh(this.__slideOpt);
        else this.__myCaptcha = new window.NECaptcha(this.__slideOpt);
        setTimeout(function() { i._$addEvent(this.__slideCapBox, "mouseout", this.__slidebarout._$bind(this));
            i._$addEvent(this.__slideCapBox, "mouseover", this.__slidebarover._$bind(this)) }._$bind(this), 300) };
    u._$refreshCheckCode = function(t) {
        if (this.__needSlideCap) this._$showSlideCode(t);
        else if (this.__needCheckCode) this._$showCheckCode();
    };
    u._$hasCheckCode = function() {
        return this.__needCheckCode || this.__needSlideCap };
    u._$showSlideCode = function(t) {
        if ("444" == t || "109" == t) { this.__slideTarget = 2;
            this.__slideTxt = "请滑动验证码" } else { this.__slideTarget = 3;
            this.__slideTxt = "请点击验证码" }
        this._$hideCheckCode();
        this.__needSlideCap = 1;
        this.__states["slidecap"] = 1;
        e._$delClassName(this.__slideCapBox, "f-dn");
        this.__slideLock = 0;
        this._$getSlideCap();
        this._$dispatchEvent("ondisabled", 1);
        this.__checkNextBtn();
        setTimeout(function() { s._$resize() }, 200) };
    u._$hideCheckCode = function() {
        var t = e._$get("cnt-box-parent");
        e._$delClassName(t, "hascheckcode");
        this.__states["checkcode"] = 0;
        this.__states["slidecap"] = 0;
        this.__needSlideCap = 0;
        this.__needCheckCode = 0;
        e._$addClassName(this.__checkCode, "f-dn");
        e._$addClassName(this.__slideCapBox, "f-dn");
        s._$resize() };
    return a
}, 1, 2, 3, 4, 68, 11, 33);
I$(140, function(t, e, i, n, r, s) { i.__focusElement = function() {
        var i = function(i, n) {
            var r = t._$getElement(n);
            if (!r.value) e._$delClassName(r, i) };
        var n = function(i, n) { e._$addClassName(t._$getElement(n), i) };
        return function(e, r, s) {
            if (1 == r) t._$addEvent(e, "blur", i._$bind(null, s));
            if (1 == r || r == -1) t._$addEvent(e, "focus", n._$bind(null, s)) } }();
    return i }, 3, 2);
I$(131, function(t, e, i, n, r, s, o, a) {
    if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "3.0") I$(139, function() { e.__focusElement = function() {
            var t = function(t, e) { n._$delClassName(i._$getElement(e), t) };
            return e.__focusElement._$aop(function(e) {
                var n = e.args;
                if (1 != n[1]) { i._$addEvent(n[0], "blur", t._$bind(null, n[2]));
                    n[1] = -1 } }) }() });
    return e }, 18, 140, 3, 2);
I$(117, function(t, e, i, n, r, s, o, a, _) { s._$focus = function(t, r) { t = i._$get(t);
        if (t) {
            var s = 0,
                o = "js-focus";
            if (e._$isNumber(r)) s = r;
            else if (e._$isString(r)) o = r;
            else if (e._$isObject(r)) { s = r.mode || s;
                o = r.clazz || o }
            var a = parseInt(i._$dataset(t, "mode"));
            if (!isNaN(a)) s = a;
            a = i._$dataset(t, "focus");
            if (a) o = a;
            n.__focusElement(t, s, o) } };
    r._$merge(s);
    if (!0) t.copy(t.P("nej.e"), s);
    return s }, 15, 4, 2, 131, 16);
I$(138, function(t) { t.__length = function() {
        var t = /(\r\n|\r|\n)/g;
        return function(e) {
            return (e || "").replace(t, "**").length } }();
    return t }, 18);
I$(130, function(t, e) {
    if ("trident" === t._$KERNEL.engine) I$(137, function() { e.__length = function() {
            return (_event.args[0] || "").length } });
    return e }, 18, 138);
I$(118, function(t, e, i, n, r, s, o, a, _, c) { o._$counter = function() {
        var t = /[\r\n]/gi,
            r = {};
        var o = function(t) {
            return s.__length(t) };
        var a = function(t) {
            var i = r[t],
                n = e._$get(t),
                s = e._$get(i.xid);
            if (n && i) {
                var o = { input: n.value };
                o.length = i.onlength(o.input);
                o.delta = i.max - o.length;
                i.onchange(o);
                s.innerHTML = o.value || "剩余" + Math.max(0, o.delta) + "个字" } };
        return function(t, s) {
            var c = e._$id(t);
            if (c && !r[c]) {
                var h = n._$merge({}, s);
                h.onchange = h.onchange || _;
                h.onlength = o;
                if (!h.max) {
                    var u = parseInt(e._$attr(c, "maxlength")),
                        l = parseInt(e._$dataset(c, "maxLength"));
                    h.max = u || l || 100;
                    if (!u && l) h.onlength = n._$length }
                r[c] = h;
                i._$addEvent(c, "input", a._$bind(null, c));
                var d = e._$wrapInline(c, { nid: h.nid || "js-counter", clazz: h.clazz });
                h.xid = e._$id(d);
                a(c) } } }();
    r._$merge(o);
    if (!0) t.copy(t.P("nej.e"), o);
    return o }, 15, 2, 3, 4, 16, 130);
I$(142, function(t, e, i, n) { t.__setPlaceholder = function(t, e) {};
    return t });
I$(132, function(t, e, i, n, r, s, o, a, _) {
    if ("trident" === t._$KERNEL.engine && t._$KERNEL.release <= "5.0") I$(141, function() { r.__setPlaceholder = function() {
            var t = {},
                r = { nid: "j-holder-" + n._$uniqueID() };
            var s = function(i) {
                var n = e._$get(i);
                t[i] = 2;
                if (!n.value) e._$setStyle(e._$wrapInline(n, r), "display", "none") };
            var o = function(i) {
                var n = e._$get(i);
                t[i] = 1;
                if (!n.value) e._$setStyle(e._$wrapInline(n, r), "display", "") };
            var a = function(i) {
                var n = e._$get(i);
                if (2 != t[i]) e._$setStyle(e._$wrapInline(n, r), "display", !n.value ? "" : "none") };
            var _ = function(t, i) {
                var n = e._$id(t),
                    s = e._$wrapInline(t, { tag: "label", clazz: i, nid: r.nid });
                s.htmlFor = n;
                var o = e._$attr(t, "placeholder") || "";
                s.innerText = "null" == o ? "" : o;
                var a = t.offsetHeight + "px";
                e._$style(s, { left: 0, display: !t.value ? "" : "none" }) };
            return function(e, n) {
                if (null == t[e.id]) { _(e, n);
                    var r = e.id;
                    t[r] = 1;
                    i._$addEvent(e, "blur", o._$bind(null, r));
                    i._$addEvent(e, "focus", s._$bind(null, r));
                    i._$addEvent(e, "input", a._$bind(null, r)) } } }() });
    return r }, 18, 2, 3, 4, 142);
I$(119, function(t, e, i, n, r, s, o, a) { r._$placeholder = function(t, i) { t = e._$get(t);
        n.__setPlaceholder(t, e._$dataset(t, "holder") || i || "js-placeholder") };
    i._$merge(r);
    if (!0) t.copy(t.P("nej.e"), r);
    return r }, 15, 2, 16, 132);
I$(92, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d) {
    c._$$WebForm = e._$klass();
    d = c._$$WebForm._$extend(s._$$EventTarget);
    d.__init = function() { this.__super();
        this.__wopt = { tp: { nid: "js-nej-tp" }, ok: { nid: "js-nej-ok" }, er: { nid: "js-nej-er" } } };
    d.__reset = function(t) { this.__super(t);
        this.__form = document.forms[t.form] || i._$get(t.form);
        this.__doInitDomEvent([
            [this.__form, "enter", this._$dispatchEvent._$bind(this, "onenter")]
        ]);
        this.__message = t.message || {};
        this.__message.pass = this.__message.pass || "&nbsp;";
        var e = this.__dataset(this.__form, "focusMode", 1);
        if (!isNaN(e)) this.__fopt = { mode: e, clazz: t.focus };
        this.__holder = t.holder;
        this.__wopt.tp.clazz = "js-mhd " + (t.tip || "js-tip");
        this.__wopt.ok.clazz = "js-mhd " + (t.pass || "js-pass");
        this.__wopt.er.clazz = "js-mhd " + (t.error || "js-error");
        this.__invalid = t.invalid || "js-invalid";
        this.__doInitValidRule(t);
        this._$refresh();
        if (this.__fnode) this.__fnode.focus() };
    d.__destroy = function() { this.__super();
        this._$reset();
        delete this.__message;
        delete this.__fnode;
        delete this.__vinfo;
        delete this.__xattr;
        delete this.__form;
        delete this.__treg;
        delete this.__vfun };
    d.__dataset = function(t, e, n) {
        var r = i._$dataset(t, e);
        switch (n) {
            case 1:
                return parseInt(r, 10);
            case 2:
                return "true" == (r || "").toLowerCase();
            case 3:
                return this.__doParseDate(r) }
        return r };
    d.__number = function(t, e, i) {
        if ("date" == e) return this.__doParseDate(t, i);
        else return parseInt(t, 10) };
    d.__isValidElement = function() {
        var t = /^button|submit|reset|image|hidden|file$/i;
        return function(e) { e = this._$get(e) || e;
            var i = e.type;
            return !!e.name && !t.test(e.type || "") } }();
    d.__isValueElement = function() {
        var t = /^hidden$/i;
        return function(e) {
            if (this.__isValidElement(e)) return !0;
            e = this._$get(e) || e;
            var i = e.type || "";
            return t.test(i) } }();
    d.__doParseDate = function() {
        var t = /[:\.]/;
        return function(e, i) {
            if ("now" == (e || "").toLowerCase()) return +new Date;
            var n = r._$var2date(e);
            if (n && !t.test(e)) {
                var s = (i || "").split(t);
                n.setHours(parseInt(s[0], 10) || 0, parseInt(s[1], 10) || 0, parseInt(s[2], 10) || 0, parseInt(s[3], 10) || 0) }
            return +n } }();
    d.__doCheckString = function(t, e) {
        var i = this.__vfun[e],
            n = this.__dataset(t, e);
        if (n && i) { this.__doPushValidRule(t, i);
            this.__doSaveValidInfo(t, e, n) } };
    d.__doCheckPattern = function(t, e) {
        try {
            var i = this.__dataset(t, e);
            if (!i) return;
            var n = new RegExp(i);
            this.__doSaveValidInfo(t, e, n);
            this.__doPushValidRule(t, this.__vfun[e]) } catch (r) {} };
    d.__doCheckBoolean = function(t, e) {
        var i = this.__vfun[e];
        if (i && this.__dataset(t, e, 2)) this.__doPushValidRule(t, i) };
    d.__doCheckNumber = function(t, e, i) { i = parseInt(i, 10);
        if (!isNaN(i)) { this.__doSaveValidInfo(t, e, i);
            this.__doPushValidRule(t, this.__vfun[e]) } };
    d.__doCheckDSNumber = function(t, e) { this.__doCheckNumber(t, e, this.__dataset(t, e)) };
    d.__doCheckATNumber = function(t, e) { this.__doCheckNumber(t, e, i._$attr(t, e)) };
    d.__doCheckTPNumber = function(t, e, i) {
        var n = this.__number(this.__dataset(t, e), this.__dataset(t, "type"));
        this.__doCheckNumber(t, e, n) };
    d.__doCheckCustomAttr = function(t) { r._$loop(this.__xattr, function(e, n) {
            var r = i._$dataset(t, n);
            if (null != r) { this.__doSaveValidInfo(t, n, r);
                this.__doPushValidRule(t, this.__vfun[n]) } }, this) };
    d.__doPrepareElement = function() {
        var t = /^input|textarea$/i,
            e = /[:\.]/;
        var r = function(t) { this._$showTip(n._$getElement(t)) };
        var s = function(t) {
            var e = n._$getElement(t);
            if (!this.__dataset(e, "ignore", 2)) this.__doCheckValidity(e) };
        return function(e) {
            if (this.__dataset(e, "autoFocus", 2)) this.__fnode = e;
            var n = i._$attr(e, "placeholder");
            if (n && "null" != n) _._$placeholder(e, this.__holder);
            if (this.__fopt && t.test(e.tagName)) o._$focus(e, this.__fopt);
            var c = i._$id(e);
            this.__doCheckBoolean(c, "required");
            this.__doCheckString(c, "type");
            this.__doCheckPattern(c, "pattern");
            this.__doCheckATNumber(c, "maxlength");
            this.__doCheckATNumber(c, "minlength");
            this.__doCheckDSNumber(c, "maxLength");
            this.__doCheckDSNumber(c, "minLength");
            this.__doCheckTPNumber(c, "min");
            this.__doCheckTPNumber(c, "max");
            this.__doCheckCustomAttr(c);
            var u = i._$dataset(c, "time");
            if (u) this.__doSaveValidInfo(c, "time", u);
            var l = e.name;
            this.__message[l + "-tip"] = this.__dataset(e, "tip");
            this.__message[l + "-error"] = this.__dataset(e, "message");
            this._$showTip(e);
            var d = this.__vinfo[c],
                f = (d || h).data || h,
                m = this.__dataset(e, "counter", 2);
            if (m && (f.maxlength || f.maxLength)) a._$counter(c, { nid: this.__wopt.tp.nid, clazz: "js-counter" });
            if (d && t.test(e.tagName)) this.__doInitDomEvent([
                [e, "focus", r._$bind(this)],
                [e, "blur", s._$bind(this)]
            ]);
            else if (this.__dataset(e, "focus", 2)) this.__doInitDomEvent([
                [e, "focus", r._$bind(this)]
            ]) } }();
    d.__doInitValidRule = function() {
        var e = { number: /^[\d]+$/i, url: /^[a-z]+:\/\/(?:[\w-]+\.)+[a-z]{2,6}.*$/i, email: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i, email1: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i, email2: /^[\w-\.]+$/i, date: function(t, e) {
                var i = this.__dataset(e, "format") || "yyyy-MM-dd";
                return !t || !isNaN(this.__doParseDate(t)) && r._$format(this.__doParseDate(t), i) == t } };
        var i = { required: function(t) {
                var e = t.type,
                    i = !t.value,
                    n = ("checkbox" == e || "radio" == e) && !t.checked;
                if (n || i) return -1 }, type: function(t, e) {
                var i = this.__treg[e.type],
                    n = t.value.trim(),
                    s = !!i.test && !i.test(n),
                    o = r._$isFunction(i) && !i.call(this, n, t);
                if (s || o) return -2 }, pattern: function(t, e) {
                if (!e.pattern.test(t.value)) return -3 }, maxlength: function(t, e) {
                if (t.value.length > e.maxlength) return -4 }, minlength: function(t, e) {
                if (t.value.length < e.minlength) return -5 }, maxLength: function(t, e) {
                if (r._$length(t.value) > e.maxLength) return -4 }, minLength: function(t, e) {
                if (r._$length(t.value) < e.minLength) return -5 }, min: function(t, e) {
                var i = this.__number(t.value, e.type, e.time);
                if (isNaN(i) || i < e.min) return -6 }, max: function(t, e) {
                var i = this.__number(t.value, e.type, e.time);
                if (isNaN(i) || i > e.max) return -7 } };
        var n = function(t, e, i, n) {
            var s = t[i];
            if (!r._$isFunction(e) || !r._$isFunction(s)) t[i] = e;
            else t[i] = s._$aop(e) };
        return function(s) {
            if (s.domain) e.email = e.email2;
            else e.email = e.email1;
            this.__treg = t.X({}, e);
            r._$loop(s.type, n._$bind(null, this.__treg));
            this.__vfun = t.X({}, i);
            this.__xattr = s.attr;
            r._$loop(this.__xattr, n._$bind(null, this.__vfun));
        }
    }();
    d.__doPushValidRule = function(t, e) {
        if (r._$isFunction(e)) {
            var i = this.__vinfo[t];
            if (!i || !i.func) { i = i || {};
                i.func = [];
                this.__vinfo[t] = i }
            i.func.push(e) } };
    d.__doSaveValidInfo = function(t, e, i) {
        if (e) {
            var n = this.__vinfo[t];
            if (!n || !n.data) { n = n || {};
                n.data = {};
                this.__vinfo[t] = n }
            n.data[e] = i } };
    d.__doCheckValidity = function(t) { t = this._$get(t) || t;
        if (!t) return !0;
        var e = this.__vinfo[i._$id(t)];
        if (!e && this.__isValidElement(t)) { this.__doPrepareElement(t);
            e = this.__vinfo[i._$id(t)] }
        if (!e) return !0;
        var n;
        r._$forIn(e.func, function(i) { n = i.call(this, t, e.data);
            return null != n }, this);
        if (null == n) {
            var s = { target: t, form: this.__form };
            this._$dispatchEvent("oncheck", s);
            n = s.value }
        var s = { target: t, form: this.__form };
        if (null != n) {
            if (r._$isObject(n)) r._$merge(s, n);
            else s.code = n;
            this._$dispatchEvent("oninvalid", s);
            if (!s.stopped) this._$showMsgError(t, s.value || this.__message[t.name + n]) } else { this._$dispatchEvent("onvalid", s);
            if (!s.stopped) this._$showMsgPass(t, s.value) }
        return null == n };
    d.__doShowMessage = function() {
        var t = { tp: "tip", ok: "pass", er: "error" };
        var e = function(t, e) {
            return t == e ? "block" : "none" };
        var n = function(t, e, n) {
            var r = s.call(this, t, e);
            if (!r && n) r = i._$wrapInline(t, this.__wopt[e]);
            return r };
        var s = function(e, n) {
            var r = i._$get(e.name + "-" + t[n]);
            if (!r) r = i._$getByClassName(e.parentNode, this.__wopt[n].nid)[0];
            return r };
        return function(t, o, a) { t = this._$get(t) || t;
            if (t) { "er" == a ? i._$addClassName(t, this.__invalid) : i._$delClassName(t, this.__invalid);
                var _ = n.call(this, t, a, o);
                if (_ && o) _.innerHTML = o;
                r._$loop(this.__wopt, function(n, r) { i._$setStyle(s.call(this, t, r), "display", e(a, r)) }, this) } } }();
    d._$showTip = function(t, e) { this.__doShowMessage(t, e || this.__message[t.name + "-tip"], "tp") };
    d._$showMsgPass = function(t, e) { this.__doShowMessage(t, e || this.__message[t.name + "-pass"] || this.__message.pass, "ok") };
    d._$showMsgError = function(t, e) { this.__doShowMessage(t, e || this.__message[t.name + "-error"], "er") };
    d._$setValue = function() {
        var t = /^(?:radio|checkbox)$/i;
        var e = function(t) {
            return null == t ? "" : t };
        var i = function(t, i) {
            if (i.multiple) {
                var n;
                if (!r._$isArray(t)) n[t] = t;
                else n = r._$array2object(t);
                r._$forEach(i.options, function(t) { t.selected = null != n[t.value] }) } else i.value = e(t) };
        var n = function(n, r) {
            if (t.test(r.type || "")) r.checked = n == r.value;
            else if ("SELECT" == r.tagName) i(n, r);
            else r.value = e(n) };
        return function(t, e) {
            var i = this._$get(t);
            if (i)
                if ("SELECT" == i.tagName || !i.length) n(e, i);
                else r._$forEach(i, n._$bind(null, e)) } }();
    d._$get = function(t) {
        return this.__form.elements[t] };
    d._$form = function() {
        return this.__form };
    d._$data = function() {
        var t = /^radio|checkbox$/i,
            e = /^number|date$/;
        var n = function(t) {
            if ("SELECT" == t.tagName && t.multiple) {
                var e = [];
                r._$forEach(t.options, function(t) {
                    if (t.selected) e.push(t.value) });
                return e.length > 0 ? e : "" }
            return t.value };
        var s = function(s, o) {
            var a = o.name,
                _ = n(o),
                c = s[a],
                h = this.__dataset(o, "type"),
                u = i._$dataset(o, "time");
            if (e.test(h))
                if (r._$isArray(_)) r._$forEach(_, function(t, e, i) { i[e] = this.__number(t, h, u) }, this);
                else _ = this.__number(_, h, u);
            if (t.test(o.type) && !o.checked) { _ = this.__dataset(o, "value");
                if (!_) return }
            if (c) {
                if (!r._$isArray(c)) { c = [c];
                    s[a] = c }
                c.push(_) } else s[a] = _ };
        return function() {
            var t = {};
            r._$forEach(this.__form.elements, function(e) {
                if (this.__isValueElement(e)) s.call(this, t, e) }, this);
            return t } }();
    d._$reset = function() {
        var t = function(t) {
            if (this.__isValidElement(t)) this._$showTip(t) };
        return function() { this.__form.reset();
            r._$forEach(this.__form.elements, t, this) } }();
    d._$submit = function() { this.__form.submit() };
    d._$refresh = function() {
        var t = function(t) {
            if (this.__isValidElement(t)) this.__doPrepareElement(t) };
        return function() { this.__vinfo = {};
            r._$forEach(this.__form.elements, t, this) } }();
    d._$checkValidity = function(t, e) { t = this._$get(t) || t;
        if (t) return this.__doCheckValidity(t);
        var i = !0;
        r._$forEach(this.__form.elements, function(t) {
            var n = this._$checkValidity(t);
            i = i && n;
            if (!i && e) return !0 }, this);
        return i };
    if (!0) t.copy(t.P("nej.ut"), c);
    return c
}, 15, 1, 2, 3, 4, 5, 117, 118, 119);
I$(71, function(t, e, i, n, r) {
    var s;
    r._$$WebForm = t._$klass();
    s = r._$$WebForm._$extend(n._$$WebForm);
    s.__doCheckValidity = function(t) {
        var n;
        t = this._$get(t) || t;
        if (!t) return !0;
        var r = this.__vinfo[i._$id(t)];
        if (!r && this.__isValidElement(t)) { this.__doPrepareElement(t);
            r = this.__vinfo[i._$id(t)] }
        if (!r) return !0;
        var s;
        e._$forIn(r.func, function(e) { s = e.call(this, t, r.data);
            return null != s }, this);
        if (null == s) { n = { target: t, form: this.__form };
            this._$dispatchEvent("oncheck", n);
            s = n.value }
        n = { target: t, form: this.__form };
        if (null != s) {
            if (e._$isObject(s)) e._$merge(n, s);
            else n.code = s;
            this._$dispatchEvent("oninvalid", n);
            if (!n.stopped) this._$showMsgError(t, n.value || this.__message[t.name + s]) } else { this._$dispatchEvent("onvalid", n);
            if (!n.stopped) this._$showMsgPass(t, n.value) }
        if (n.ignore) return !0;
        else return null == s };
    return r }, 1, 4, 2, 92);
I$(126, function(t, e, i, n, r, s, o, a, _, c) { s._$$SelectHelper = e._$klass();
    c = s._$$SelectHelper._$extend(r._$$EventTarget);
    c.__reset = function(t) { this.__super(t);
        this.__loop = !!t.loopable;
        this.__parent = i._$get(t.parent);
        this.__selected = t.selected || "js-selected";
        this.__hovered = t.hover || this.__selected;
        this.__nopt = {};
        if (t.clazz) { this.__nopt.filter = i._$hasClassName._$bind2(i, t.clazz);
            this.__clazz = t.clazz }
        this.__kbody = this.__getKeyBoardParent(this.__parent);
        this.__doInitDomEvent([
            [this.__kbody, "keydown", this.__doCheckKBAction._$bind(this), !0],
            [this.__kbody, "enter", this.__doCheckKBEnter._$bind(this)],
            [this.__parent, "click", this.__onCheckClick._$bind(this)],
            [this.__parent, "mouseover", this.__onCheckHover._$bind(this)],
            [this.__parent, "mouseleave", this.__onCheckLeave._$bind(this)]
        ]) };
    c.__destroy = function() { this.__super();
        delete this.__selected;
        delete this.__hovered;
        delete this.__parent;
        delete this.__kbody;
        delete this.__clazz;
        delete this.__nopt;
        delete this.__loop };
    c.__isItemElement = function(t) {
        if (this.__clazz) return i._$hasClassName(t, this.__clazz);
        else return t.parentNode == this.__parent };
    c.__getKeyBoardParent = function() {
        var t = 1e3;
        return function(e) {
            for (; e && (parseInt(e.tabIndex) || 0) <= t;) e = e.parentNode;
            return e || document } }();
    c.__getItemElement = function(t) {
        var e = i._$getByClassName(this.__parent, t);
        return !e ? null : e[0] };
    c.__doSyncSelection = function(t, e) { i._$delClassName(t.last, e);
        i._$addClassName(t.target, e);
        if (e == this.__selected && t.last != t.target) { this.__doScrollToView(t.target);
            this._$dispatchEvent("onchange", t) } };
    c.__doScrollToView = function(t) {
        var e = i._$getScrollViewPort(t),
            n = i._$offset(t, e);
        if (!(n.y - e.scrollTop < 0)) {
            var r = n.y + t.offsetHeight - e.clientHeight;
            if (r > e.scrollTop) e.scrollTop = r } else e.scrollTop = n.y };
    c.__doParseSelection = function(t, e) {
        var i = n._$getElement(t, this.__isItemElement._$bind(this));
        return !i ? null : { last: this.__getItemElement(e), target: i } };
    c.__doCheckKBAction = function(t) {
        var e = t.keyCode;
        if (38 == e || 40 == e) { n._$stop(t);
            var r = { last: this._$getSelectedNode() };
            this.__nopt.backward = 38 == e;
            var s = !this.__clazz ? i._$getChildren(this.__parent) : i._$getByClassName(this.__parent, this.__clazz),
                o = this.__nopt.backward ? s[s.length - 1] : s[0];
            if (!r.last) r.target = this.__getItemElement(this.__hovered) || o;
            else r.target = i._$getSibling(r.last, this.__nopt);
            if (!r.target) {
                if (!this.__loop || s.length <= 1) return;
                r.target = o }
            this.__doSyncSelection(r, this.__selected) } };
    c.__doCheckKBEnter = function(t) { n._$stop(t);
        this._$dispatchEvent("onselect", { enter: !0, target: this._$getSelectedNode() }) };
    c.__onCheckClick = function(t) { n._$stop(t);
        var e = this.__doParseSelection(t, this.__selected);
        if (e) { this.__doSyncSelection(e, this.__selected);
            this._$dispatchEvent("onselect", { target: e.target }) } };
    c.__onCheckHover = function(t) {
        var e = this.__doParseSelection(t, this.__hovered);
        if (e) { this.__doSyncSelection(e, this.__hovered);
            if (this.__kbody.focus) this.__kbody.focus() } };
    c.__onCheckLeave = function(t) {
        if (this.__hovered != this.__selected) i._$delClassName(this.__getItemElement(this.__hovered), this.__hovered) };
    c._$getSelectedNode = function() {
        return this.__getItemElement(this.__selected) };
    if (!0) t.copy(t.P("nej.ut"), s);
    return s }, 15, 1, 2, 3, 5);
I$(103, function(t, e, i, n, r, s, o, a, _) {
    var c;
    s._$$Suggest = e._$klass();
    c = s._$$Suggest._$extend(n._$$EventTarget);
    c.__init = function() { this.__sopt = { loopable: !0, onselect: this.__onSelect._$bind(this), onchange: this.__onSelectionChange._$bind(this) };
        this.__super() };
    c.__reset = function(t) { this.__super(t);
        this.__auto = !!t.autofill;
        this.__input = i._$get(t.input);
        this.__sopt.clazz = t.clazz;
        this.__sopt.parent = i._$get(t.body);
        this.__sopt.selected = t.selected || "js-selected";
        this.__doInitDomEvent([
            [this.__input, "input", this.__onInput._$bind(this)],
            [this.__input, "focus", this.__onInput._$bind(this)]
        ]);
        if (!t.noblur) this.__doInitDomEvent([
            [this.__input, "blur", this.__onBlur._$bind(this)]
        ]);
        this._$visibile(!1);
        this.__helper = r._$$SelectHelper._$allocate(this.__sopt) };
    c.__destroy = function() { this.__super();
        if (this.__helper) { this.__helper._$recycle();
            delete this.__helper }
        delete this.__xxx;
        delete this.__input;
        delete this.__sopt.parent };
    c.__onBlur = function() { this.__onSelect({ target: this.__helper._$getSelectedNode() }) };
    c.__onInput = function() {
        var t = this.__input.value.trim();
        if (!t) this._$visibile(!1);
        else if (!this.__xxx) this._$dispatchEvent("onchange", t) };
    c.__doUpdateValue = function(t) {
        if (!this.__xxx) { this.__xxx = !0;
            if (t && t != this.__input.value) this.__input.value = t;
            this.__xxx = !1 } };
    c.__onSelect = function(t) {
        if ("hidden" != i._$getStyle(this.__sopt.parent, "visibility")) {
            var e = i._$dataset(t.target, "value") || "";
            this.__doUpdateValue(e);
            e = e || this.__input.value;
            this._$update("");
            this._$dispatchEvent("onselect", e, { target: t.target, enter: t.enter, value: e }) } };
    c.__onSelectionChange = function(t) {
        if (this.__auto) this.__doUpdateValue(i._$dataset(t.target, "value") || "") };
    c._$setList = function(t) { this._$visibile(!!t && t.length > 0) };
    c._$visibile = function(t) {
        var t = !t ? "hidden" : "visible";
        this.__sopt.parent.style.visibility = t;
        if ("hidden" === t) this.__sopt.parent.innerHTML = "" };
    c._$update = function(t) { this.__sopt.parent.innerHTML = t || "&nbsp;";
        this._$visibile(!!t) };
    if (!0) t.copy(t.P("nej.ut"), s);
    return s }, 15, 1, 2, 5, 126);
I$(104, ".#<uispace>-parent{position:relative;}\n.#<uispace>{position:absolute;border:1px solid #aaa;background:#fff;text-align:left;visibility:hidden;}\n.#<uispace> .zitm{height:20px;line-height:20px;cursor:default;}\n.#<uispace> .js-selected{background:#1257F9;}");
I$(105, '{if defined("xlist")&&!!xlist.length}\n  {list xlist as x}<div class="zitm" data-value="${x}">${x}</div>{/list}\n{/if}');
I$(77, function(t, e, i, n, r, s, o, a, _, c, h, u, l) {
    var d = i._$pushCSSText(a),
        f = o._$add(_),
        m;
    c._$$Suggest = e._$klass();
    m = c._$$Suggest._$extend(r._$$Abstract);
    m.__init = function() { this.__sopt = { onchange: this.__onChange._$bind(this), onselect: this.__onSelect._$bind(this) };
        this.__super() };
    m.__reset = function(t) { this.__super(t);
        this.__sopt.autofill = 0 != t.autofill;
        this.__sopt.input = i._$get(t.input);
        this.__sopt.input.insertAdjacentElement("afterEnd", this.__body);
        this.__suggest = s._$$Suggest._$allocate(this.__sopt) };
    m.__destroy = function() {
        if (this.__suggest) { this.__suggest._$recycle();
            delete this.__suggest }
        this.__super();
        delete this.__sopt.input };
    m.__initXGui = function() { this.__seed_css = d };
    m.__initNode = function() { this.__super();
        this.__sopt.body = this.__body };
    m.__onChange = function(t) { this._$dispatchEvent("onchange", t) };
    m.__onSelect = function(t, e) { this._$dispatchEvent("onselect", t, e) };
    m._$setList = function(t, e) {
        if (n._$isArray(t)) t = o._$get(f, { xlist: t });
        this.__body.innerHTML = t || "";
        this.__suggest._$setList(!e ? i._$getChildren(this.__body) : i._$getByClassName(this.__body, e)) };
    if (!0) t.copy(t.P("nej.ui"), c);
    return c }, 15, 1, 2, 4, 68, 103, 19, 104, 105);
I$(72, function(t, e, i, n, r, s, o, a, _, c, h, u, l) {
    var d, f = /^[\w-\.@]*$/i;
    c._$$Input = t._$klass();
    d = c._$$Input._$extend(s._$$EventTarget);
    d.__init = function(t) { this.__super(t) };
    d.__destroy = function() { this.__saveInputValue = null;
        this.__focusTimeout = clearTimeout(this.__focusTimeout);
        this.__blurTimeout = clearTimeout(this.__blurTimeout);
        n._$clearEvent(this.__input);
        n._$clearEvent(this.__label);
        this.__super() };
    d.__reset = function(t) { this.__super(t);
        this.__opts = t.opts || {};
        this.__input = t.node;
        this.__form = t.form;
        this.__isLogin = t.isLogin || 0;
        this.__inputBox = o._$getParent(this.__input, "inputbox");
        this.__clearBtn = i._$getByClassName(this.__inputBox, "u-tip")[0];
        this.__pwdtext = i._$get("pwdtext");
        this.__needClose = t.needClose;
        this.__isUsername = t.isUsername;
        this.__domain = t.domain;
        this.__needEye = this.__opts.needEye;
        if (this.__needEye) this.__hasEye = t.isPwd;
        else this.__hasEye = 0;
        if (this.__isLogin && this.__hasEye && !this.__clearBtn2) { i._$addClassName(this.__clearBtn, "m-eye-close");
            var e = i._$create("div", "u-tip-eye m-eye u-pwdshow");
            e.innerHTML = _._$get("eye-tmp", {});
            this.__clearBtn2 = e;
            this.__clearBtn.insertAdjacentElement("beforeBegin", this.__clearBtn2) }
        this.__enterNode = t.enterNode;
        this.__label = i._$getByClassName(this.__inputBox, "u-label")[0];
        var n = this.__supportPH();
        var r = i._$dataset(this.__input, "placeholder");
        if (this.__label)
            if (!n) i._$delClassName(this.__label, "f-dn");
            else { i._$addClassName(this.__label, "f-dn");
                i._$attr(this.__input, "placeholder", r) }
        this.__initEvent();
        if (this.__isUsername) this.__initSuggest() };
    d.__initEvent = function() {
        var t = [
            [this.__label, "click", this.__doFocus._$bind(this)],
            [this.__input, "focus", this.__onFocus._$bind(this)],
            [this.__input, "blur", this.__onBlur._$bind(this)],
            [this.__input, "input", this.__onInput._$bind(this, 0)],
            [this.__input, "keyup", this.__doEnter._$bind(this)]
        ];
        if (this.__hasEye) { t.push([this.__pwdtext, "blur", this.__onBlur._$bind(this)]);
            t.push([this.__pwdtext, "focus", this.__onFocus._$bind(this)]);
            t.push([this.__pwdtext, "input", this.__onInput._$bind(this, 1)]);
            t.push([this.__pwdtext, "keyup", this.__doEnter._$bind(this)]);
            t.push([this.__clearBtn2, "click", this.__onEye._$bind(this)]);
            t.push([this.__clearBtn, "click", this._$onClear._$bind(this, 2)]) } else if (this.__needClose) t.push([this.__clearBtn, "click", this._$onClear._$bind(this, 2)]);
        this.__doInitDomEvent(t) };
    d.__supportPH = function() {
        var t = e._$KERNEL;
        if ("trident" == t.engine && parseInt(t.release, 10) <= 5) return 0;
        else return 1 };
    d.__doEnter = function(t) {
        var e = n._$getElement(t),
            i = e.name;
        if ("password" == i && 13 != t.keyCode) this._$dispatchEvent("onPwdKeyUp");
        if (13 == t.keyCode) n._$dispatchEvent(this.__enterNode, "click") };
    d.__onEye = function() {
        var t;
        if (!this.__pwdtext.disabled)
            if (i._$hasClassName(this.__clearBtn2, "eyeactive")) { t = this.__pwdtext.value;
                i._$delClassName(this.__clearBtn2, "eyeactive");
                i._$setStyle(this.__pwdtext, "zIndex", -1);
                this.__input.value = t;
                this.__input.focus();
                this.__moveToEnd(this.__input) } else { t = this.__input.value;
                this.__setPwdText(t);
                i._$addClassName(this.__clearBtn2, "eyeactive");
                i._$setStyle(this.__pwdtext, "zIndex", 1);
                this.__pwdtext.focus();
                this.__moveToEnd(this.__pwdtext) } };
    d.__moveToEnd = function(t) {
        var e;
        var i = t.value.length;
        if (t.createTextRange) { e = t.createTextRange();
            e.moveStart("character", i);
            e.collapse(!0);
            e.select() } };
    d.__setPwdText = function(t) { this.__pwdtext.value = t };
    d.__doFocus = function() {
        if (i._$hasClassName(this.__clearBtn2, "eyeactive")) this.__pwdtext.focus();
        else this.__input.focus() };
    d.__onFocus = function() {
        if (this.__blurTimeout) this.__blurTimeout = clearTimeout(this.__blurTimeout);
        this._$dispatchEvent("onClearInptTimeout", this.__input);
        var t;
        if (this.__pwdtext && i._$hasClassName(this.__input, "dlpwd")) { t = i._$getStyle(this.__pwdtext, "zIndex");
            if ("1" === t) this.__pwdtext.focus() }
        i._$replaceClassName(this.__inputBox, "error-color", "active");
        if ("password" == this.__input.id && !this.__firstFocus) { this.__input.value = "";
            this.__firstFocus = 1 }
        if (this.__clearBtn && this.__needEye && "" != this.__input.value) i._$setStyle(this.__clearBtn, "display", "block");
        this.__focusTimeout = setTimeout(function() { this._$dispatchEvent("onfocus", this.__input) }._$bind(this), 300) };
    d.__onBlur = function() {
        if (this.__focusTimeout) this.__focusTimeout = clearTimeout(this.__focusTimeout);
        this._$dispatchEvent("onClearInptTimeout", this.__input);
        this.__blurTimeout = setTimeout(function() {
            var t = this.__form._$checkValidity(this.__input);
            i._$delClassName(this.__inputBox, "active");
            if (this.__clearBtn && this.__needEye) i._$setStyle(this.__clearBtn, "display", "none");
            this._$dispatchEvent("onstate", t, this.__input) }._$bind(this), 300) };
    d.__onInput = function(t) {
        var e = this.__input;
        if (t) this.__input.value = this.__pwdtext.value;
        var n = (e.value || "").length;
        if (this.__needClose) i._$setStyle(this.__clearBtn, "display", n > 0 ? "block" : "none");
        if (n > 0) this.__label.style.display = "none";
        else if (0 == n) this.__label.style.display = "block";
        this._$dispatchEvent("onInput", e, 1) };
    d.__initSuggest = function() {
        var t = function(t, e, i) { i = i ? " " + i : "";
            return '<div class="itm' + i + '" data-value=' + t + e + ">" + t + e + "</div>" };
        var e = function(e) {
            var n = [];
            if (f.test(e)) {
                if (e.indexOf("@") == -1) r._$forEach(this.__suffix, function(i) {
                    var r = t(e, i);
                    n.push(r) });
                else {
                    var s = e.split("@"),
                        o = s[0],
                        a = s[1];
                    if (e.match(/@/g).length > 1) n = [];
                    else if (!a) r._$forEach(this.__suffix, function(i) { i = i.split("@")[1];
                        var r = t(e, i);
                        n.push(r) });
                    else if (a.indexOf(".com") > -1) n = [];
                    else r._$forEach(this.__suffix, function(e) {
                        if (1 == e.indexOf(a)) {
                            var i = t(o, e);
                            n.push(i) } }) }
                if (n[0]) n[0] = n[0].replace('class="itm"', 'class="itm js-selected"');
                this.__suggest._$setList(n.join(""));
                i._$get("account-box").style.zIndex = "500" } else this.__suggest._$setList(n.join("")) };
        var s = function(t) {
            if (!window.outlinkflag) { i._$get("account-box").style.zIndex = "0";
                this.__suggest._$setList([]);
                this._$dispatchEvent("onClearEmailTimeout");
                if (!this.__checkIpt(t, "email")) o._$showError(this.__input, "帐号格式错误", "nerror");
                else o._$removeError(this.__input, "nerror");
                if (window.$autoFocus) this._$dispatchEvent("onFocusNext") } };
        var _ = function() { i._$get("account-box").style.zIndex = "1" };
        return function() { this.__suffix = this.__suffix || ["@163.com", "@126.com", "@yeah.net", "@188.com", "@vip.163.com", "@vip.126.com"];
            if (this.__suggest) this.__suggest = a._$$Suggest._$recycle(this.__suggest);
            var t = o._$getParent(this.__input, "u-input");
            if (!this.__suggest) { n._$delEvent(this.__input, "blur", _);
                n._$addEvent(this.__input, "blur", _);
                this.__suggest = a._$$Suggest._$allocate({ parent: t, clazz: "m-sug", input: this.__input, autofill: !1, onchange: e._$bind(this), onselect: s._$bind(this) }) } } }();
    d.__checkIpt = function() {
        var t = { email: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i };
        return function(e, i) { e = e.trim();
            return t[i].test(e) } }();
    d._$showCloseBtn = function() {
        if (!this.__needEye) i._$setStyle(this.__clearBtn, "display", "block") };
    d._$hideCloseBtn = function() { i._$setStyle(this.__clearBtn, "display", "none") };
    d._$setSuggest = function(t) { this.__suffix = t;
        this.__initSuggest() };
    d._$hideLabel = function() { this.__label.style.display = "none" };
    d._$onClear = function(t) {
        var e;
        if (!this.__input.disabled) { this.__input.value = "";
            this.__clearBtn.style.display = "none";
            if (this.__clearBtn2 && this.__hasEye)
                if (this.__pwdtext) this.__pwdtext.value = "";
            this.__label.style.display = "block";
            if ("2" == t) try { this.__input.focus();
                if (this.__pwdtext) { e = i._$getStyle(this.__pwdtext, "zIndex");
                    if ("1" === e) this.__pwdtext.focus() } } catch (r) {}
            n._$stop(t);
            this._$dispatchEvent("onInput", this.__input) } } }, 1, 18, 2, 3, 4, 5, 11, 77, 19);
I$(30, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d, f, m) {
    var p, g, v = { email: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i, sms: /^[0-9a-zA-Z]{4}$/, pwd: /^[0-9a-zA-Z]{6,16}$/ };
    l._$$Login = t._$klass();
    p = l._$$Login._$extend(o._$$Module);
    p.__init = function(t) { this.__setTimeoutList = {};
        this.__opts = t.opts || {};
        this.__needEye = this.__opts.needEye || 0;
        this.__domainSuffixs = this.__opts.domainSuffixs || "";
        this.__lazyCheck = this.__opts.lazyCheck || 0;
        this.__domainSuffixs = this.__domainSuffixs ? this.__domainSuffixs.split(",") : [];
        this.__placeholder = this.__opts.placeholder || {};
        this.__domain = this.__opts.prdomain || "";
        this.__swidth = this.__opts.swidth || 320;
        this.__forgetpwdlink = this.__opts.forgetpwdlink || "//reg.163.com/resetpwd/index.do";
        this.__unLoginText = this.__opts.unLoginText || "十天内免登录";
        this.__server = "captcha.reg.163.com/v2";
        if (this.__opts.productKey) this.__opts.productkey = this.__opts.productKey;
        this.__productkey = this.__opts.productkey;
        this.__hintTxt = this.__opts.hintTxt || "按住滑块，拖动完成上方拼图";
        this.__errMsg = this.__opts.errMsg || "";
        this.__gotoRegText = this.__opts.gotoRegText || "去注册";
        this.__super() };
    p.__slideVerify = function(t) {
        if (this.__lazyCheck)
            if (t && t.value) this.__cbVftcp();
            else this.__cbVftcpEx();
        else if (t && t.value) this._$verifyCap();
        else this.__cbVftcpEx() };
    p.__reset = function(t) {
        this.__slideOpt = {
            element: "ScapTcha",
            staticServer: this.__server,
            apiServer: this.__server,
            captchaId: this.__productkey,
            width: this.__swidth,
            forceHttps: !0,
            alignToSpace: !0,
            hintTxt: this.__hintTxt,
            verifyCallback: this.__slideVerify._$bind(this),
            initCallback: this.__initCallback._$bind(this),
            initErrorHandler: this.__initErrorHandler._$bind(this)
        };
        this.__ipts = [];
        this.__product = this.__opts.product || "";
        this.__pkid = this.__opts.promark || "";
        this.__super(t);
        this.__resetInput();
        this.__imgLock = 0;
        this.__states["email"] = 1;
        this.__states["password"] = 1;
        this._$hideCheckCode();
        this.codeTryTime = 0
    };
    p.__resetInput = function() {
        if (this.__nameinput) { this.__nameinput.disabled = !1;
            this.__nameinput.value = "" }
        if (this.__passwordinput) { this.__passwordinput.disabled = !1;
            this.__passwordinput.value = "" }
        if (this.__smscode) { this.__smscode.disabled = !1;
            this.__smscode.value = "" }
        if (this.__pwdtext) { this.__pwdtext.disabled = !1;
            this.__pwdtext.value = "" } };
    p.__destroy = function() { _._$removeError3();
        this.__super() };
    p.__initNode = function() { this.__super();
        this.__checkCode = e._$getByClassName(this.__body, "ckbox")[0];
        this.__slideCapBox = e._$getByClassName(this.__body, "slidebox")[0];
        this.__cdImg = e._$getByClassName(this.__body, "ckimg")[0];
        this.__olist = e._$getByClassName(this.__body, "olist")[0];
        this.__loginBtn = e._$getByClassName(this.__body, "u-loginbtn")[0] };
    p.__initXGui = function() {
        var t = this.__parseOauth();
        g = r._$addNodeTemplate(s._$get("login-tmp", { config: t || [], gotoRegText: this.__gotoRegText, unLoginText: this.__unLoginText, forgetpwdlink: this.__forgetpwdlink }));
        this.__seed_html = g };
    p.__parseOauth = function() {
        return _._$parseOauth() };
    p.__initEvent = function() { this.__inputs = e._$getByClassName(this.__body, "j-inputtext");
        if (this.__needEye) this.__pwdtext = e._$get("pwdtext");
        this.__nameinput = this.__inputs[0];
        this.__passwordinput = this.__inputs[1];
        this.__smscode = this.__inputs[2];
        var t;
        if (0 === this.__ipts.length) { this.__setPlaceHolder();
            n._$forEach(this.__inputs, function(e, i) {
                var n = { opts: this.__opts, node: e, isLogin: 1, form: this.__form, needClose: 1, onfocus: this.__onFocus._$bind(this), onInput: this.__onInput._$bind(this), onPwdKeyUp: this.__onPwdKeyUp._$bind(this), onFocusNext: this.__onFocusNext._$bind(this), onClearInptTimeout: this.__onClearInptTimeout._$bind(this) };
                if (!i) { n.isUsername = this.__domain ? 0 : 1;
                    n.domain = this.__domain }
                if (1 == i) n.isPwd = 1;
                t = c._$$Input._$allocate(n);
                if (!i && this.__domainSuffixs && this.__domainSuffixs.length > 0) t._$setSuggest(this.__domainSuffixs);
                this.__ipts.push(t) }._$bind(this)) }
        this.__doInitDomEvent([
            [this.__cdImg, "click", this._$getCheckCode._$bind(this)],
            [this.__olist, "click", this._$doThirdLogin._$bind(this)]
        ]) };
    p._$doThirdLogin = function(t) { _._$doThirdLogin(t) };
    p.__onPwdKeyUp = function() { this._$dispatchEvent("onPwdKeyUp") };
    p.__onFocusNext = function() { this._stopEnter = 1;
        this.__inputs[1].focus() };
    p.__onFocus = function(t) { _._$removeError(t, "nerror") };
    p.__onClearInptTimeout = function(t) {
        var e = t.name;
        if (this.__setTimeoutList["invalid" + e]) this.__setTimeoutList["invalid" + e] = clearTimeout(this.__setTimeoutList["invalid" + e]);
        if (this.__setTimeoutList["valid" + e]) this.__setTimeoutList["valid" + e] = clearTimeout(this.__setTimeoutList["valid" + e]) };
    p.__initForm = function() {
        if (!this.__form) this.__form = a._$$WebForm._$allocate({ form: "login-form", domain: this.__domain || null, oninvalid: function(t) {
                var n = "请输入",
                    r = t.code,
                    s = i._$getElement(t),
                    o = s.name;
                if (!window.outlinkflag) { this.__clearTimeout(o);
                    if ("checkcode" == o && e._$hasClassName(this.__checkCode, "f-dn") && this.__needSlideCap) t.ignore = 1;
                    this.__setTimeoutList["invalid" + o] = setTimeout(function(i) {
                        var o = i;
                        if ("checkcode" != o || !e._$hasClassName(this.__checkCode, "f-dn"))
                            if ("slidecap" != o || e._$hasClassName(this.__slideCapBox, "f-dn")) {
                                if (r == -1) {
                                    if ("email" == o) n += "帐号";
                                    else if ("password" == o) n += "密码";
                                    else if ("checkcode" == o) n = "请输入图片验证码" } else if (r == -4 || r == -2 || r == -3) { n = "格式错误";
                                    if ("email" == o) n = "帐号" + n;
                                    else if ("password" == o) n = "密码" + n;
                                    else if ("checkcode" == o) n = "请输入图片验证码" }
                                if ("slidecap" == o && e._$hasClassName(this.__slideCapBox, "f-dn")) this.__states[o] = 0;
                                else this.__states[o] = 1;
                                if (r != -1) this.__checkList(s, n) } else if (!this.__vSlide()) this.__states["slidecap"] = 0;
                        else this.__states["slidecap"] = 1;
                        else {
                            if (this.__needSlideCap) t.ignore = 1;
                            this.__states[o] = 0 } }._$bind(this, o), 100);
                    t.stopped = !0 } else if (!this.__refocus && 1 == window.outlinkflag) this.__refocus = setTimeout(function() { this.__refocus = clearTimeout(this.__refocus);
                    s.focus() }._$bind(this), 200) }._$bind(this), onvalid: function(t) {
                var e = i._$getElement(t),
                    n = e.name;
                this.__clearTimeout(n);
                this.__setTimeoutList["valid" + n] = setTimeout(function(t) {
                    var i = t;
                    this.__states[i] = 0;
                    this.__hideErrorList(e) }._$bind(this, n), 100);
                t.stopped = !0 }._$bind(this) }) };
    p.__clearTimeout = function(t) {
        if (this.__setTimeoutList["invalid" + t]) this.__setTimeoutList["invalid" + t] = clearTimeout(this.__setTimeoutList["invalid" + t]);
        if (this.__setTimeoutList["valid" + t]) this.__setTimeoutList["valid" + t] = clearTimeout(this.__setTimeoutList["valid" + t]) };
    p.__hideErrorList = function(t) {
        if (this.__checkStatus(t)); };
    p.__checkStatus = function(t, i) {
        var n = t.name;
        if ("email" == n) {
            if (!i) {
                var r = t.value.indexOf("@") != -1 ? t.value.substring(t.value.indexOf("@")).toLocaleLowerCase() : this.__domain;
                if (!r) r = t.value;
                _gaq.push(["_trackEvent", "登录步骤", "【1】帐号输入", "输入成功：" + r]) } } else if ("password" == n) {
            if (!i) _gaq.push(["_trackEvent", "登录步骤", "【2】密码输入", "输入" + (t.value || "").length + "位密码"]);
            if (this.__states["email"]) return } else if ("checkcode" == n && !e._$hasClassName(this.__checkCode, "f-dn")) {
            if (!i) { this.codeTryTime = this.codeTryTime ? this.codeTryTime + 1 : 1;
                _gaq.push(["_trackEvent", "登录步骤", "【3】验证码输入", "图片验证码校验成功,尝试次数：" + this.codeTryTime]) }
            if (this.__states["password"] || this.__states["email"]) return }
        return 1 };
    p.__checkList = function(t, e) {
        if (this.__checkStatus(t, 1)) _._$showError(t, e, "nerror");
        else _._$showError2(t, e, "nerror", 1) };
    p.__onInput = function(t) { setTimeout(this.__checkNextBtn._$bind(this, t), 50) };
    p.__checkNextBtn = function(t) {
        var e = this.__vName();
        var i = this.__vPwd();
        var n = this.__vSms();
        var r = this.__vSlide();
        if (t && "checkcode" == t.name) {
            var s = this.__smscode.value.trim();
            this.__smscodeValue = s;
            if (v["sms"].test(s) && !this.__lazyCheck) this.__doCheckSmsCode(s) }
        if (!this.__needSlideCap && !this.__needCheckCode)
            if (!e && !i) this._$dispatchEvent("ondisabled", 0);
            else this._$dispatchEvent("ondisabled", 1);
        else if (this.__needSlideCap)
            if (!e && !i && !r) this._$dispatchEvent("ondisabled", 0);
            else this._$dispatchEvent("ondisabled", 1);
        else if (this.__needCheckCode)
            if (!e && !i && !n) this._$dispatchEvent("ondisabled", 0);
            else this._$dispatchEvent("ondisabled", 1) };
    p.__vSms = function() {
        var t = this.__smscode.value.trim();
        if (v["sms"].test(t)) return 0;
        else return 1 };
    p.__doCheckSmsCode = function(t) {
        if (!this.__checkSmsCodeLock) { this.__checkSmsCodeLock = 1;
            var e = this.__nameinput.value.trim();
            e = this.__domain ? e + this.__domain : e;
            var i = { cap: t, pd: this.__product, pkid: this.__pkid };
            i.un = e;
            h._$request("checkSmsCode", i, this.__cbSmsCode._$bind(this), this.__ckSmsCodeEx._$bind(this, "验证码输入错误"), 1, this.__product) } };
    p.__cbSmsCode = function() { this.__checkSmsCodeLock = 0;
        this.__imgLock = 1;
        this.__smscode.disabled = !0;
        this.__ipts[2]._$hideCloseBtn();
        e._$getByClassName(document, "u-tip")[3].style.display = "block";
        _._$removeError(this.__smscode, "nerror") };
    p.__ckSmsCodeEx = function(t, e) {
        var i = e.ret;
        this.codeTryTime = this.codeTryTime ? this.codeTryTime + 1 : 1;
        if ("441" == i) { this.__needSlideCap = 0;
            this.__needCheckCode = 1;
            this._$refreshCheckCode(i);
            if (1 != t) _._$showError(this.__smscode, t, "nerror") } else if ("444" == i || "445" == i) { this.__needSlideCap = 1;
            this.__needCheckCode = 0;
            this._$refreshCheckCode(i);
            if (1 != t) _._$showError(null, t, "nerror") } else { this.__checkSmsCodeLock = 0;
            this._$getCheckCode();
            this.__ipts[2]._$onClear();
            this._$dispatchEvent("ondisabled", 1);
            t = u[i] || "验证码输入错误";
            _._$showError(this.__smscode, t, "nerror") } };
    p.__vName = function() {
        var t = this.__nameinput.value.trim();
        if ("" !== t) return 0;
        else return 1 };
    p.__vPwd = function() {
        var t = this.__passwordinput.value.trim();
        if ("" !== t) return 0;
        else return 1 };
    p._$setUsername = function(t) {
        try {
            if (t) this._$hideLabel();
            this.__inputs[0].value = t;
            this.__ipts[0]._$showCloseBtn() } catch (e) {} };
    p._$setPwd = function(t) {
        try {
            if (t) this._$hideLabel(1);
            this.__inputs[1].value = t;
            this.__ipts[1]._$showCloseBtn();
            if (this.__pwdtext) this.__pwdtext.value = t } catch (e) {} };
    p._$showCheckCode = function() {
        var t = e._$get("cnt-box-parent");
        this.__checkSmsCodeLock = 0;
        this._$hideCheckCode();
        this.__states["checkcode"] = 1;
        this.__needCheckCode = 1;
        e._$delClassName(this.__checkCode, "f-dn");
        this.__imgLock = 0;
        this.__smscode.disabled = !1;
        this._$getCheckCode();
        this.__ipts[2]._$onClear();
        this._$dispatchEvent("ondisabled", 1);
        this.__checkNextBtn();
        e._$addClassName(t, "hascheckcode");
        setTimeout(function() { _._$resize() }, 200) };
    p._$doFocus = function(t) {
        if ("pwd" == t) this.__passwordinput.focus();
        if ("username" == t) this.__nameinput.focus() };
    p._$getCheckCode = function() {
        if (!this.__imgLock) { this.__cdImg.src = MP.getCaptchaLogin(this.__product, this.__pkid, window["$cookieDomain"]);
            e._$getByClassName(document, "u-tip")[3].style.display = "none" } };
    p._$hideLabel = function(t) {
        if (1 === t) this.__ipts[1]._$hideLabel();
        else this.__ipts[0]._$hideLabel() };
    p.$clearText = function(t) { t.value = "" };
    p._$verifyCap = function() {
        if (!this.__slideCapLock) { this.__slideCapLock = 1;
            var t = this.__myCaptcha.getPwd();
            var e = this.__myCaptcha.getCt();
            var i = this.__nameinput.value.trim();
            i = this.__domain ? i + this.__domain : i;
            var n = { cap: t, pd: this.__product, pkid: this.__pkid, capkey: this.__productkey };
            n.un = i;
            var r = 2 == this.__slideTarget ? "vftcp" : "vfccp";
            n.ct = e;
            h._$request(r, n, this.__cbVftcp._$bind(this), this.__cbVftcpEx._$bind(this), 1) } };
    p._$getSmsValue = function() {
        return this.__smscodeValue };
    p._$clearPwd = function(t) { this.__ipts[1]._$onClear(t) };
    p._$focusHelper = function() { this.__nameinput.focus() }
}, 1, 2, 3, 4, 6, 19, 70, 71, 11, 72, 28, 33);
I$(32, function(t, e, i, n, r, s, o, a, _, c, h, u, l) {
    var d;
    c._$$Manager = t._$klass();
    d = c._$$Manager._$extend(r._$$EventTarget);
    d.__init = function(t) { this.__setMap = {};
        this.__product = t.product;
        this.__promark = t.promark;
        window._$errClickHide = t.errClickHide || 0;
        if (this.__options) { this.__options.goEmailLoginTxt = this.__options.goEmailLoginTxt || "网易邮箱帐号登录";
            this.__options.goMbLoginTxt = this.__options.goMbLoginTxt || "网易手机帐号登录";
            this.__options.goEmailRegTxt = this.__options.goEmailRegTxt || "网易邮箱帐号注册";
            this.__options.goMbRegTxt = this.__options.goMbRegTxt || "网易手机帐号注册" }
        this.__super(t) };
    d.__reset = function(t) {
        this.__super(t);
        window.$outLoginKey = this.__options.outLoginKey || "";
        window.$autoFocus = "0" == this.__options.autoFocus ? 0 : 1;
        this.__box = e._$get("cnt-box");
        this.__box2 = e._$get("cnt-box2");
        s._$render(this.__box, "h-tmp");
        this.__initEvent()
    };
    d.__destroy = function() { this.__super() };
    d.__initEvent = function() {
        var t = "click";
        var i = e._$get("confirm");
        var n = e._$get("cnt-box-parent");
        this.__doInitDomEvent([
            [i, t, this.__doAction._$bind(this)],
            [n, t, this.__doAction._$bind(this)],
            [document, "mouseover", this.__onMouseover._$bind(this)]
        ]) };
    d.__checkCookie = function(t, e, i) {};
    d.__onMouseover = function(t) {
        var n = i._$getElement(t),
            r = e._$dataset(n, "outlink") || 0;
        window.outlinkflag = r };
    d.__changePage = function(t) { e._$setStyle(this.__box, "display", t ? "none" : "block");
        e._$setStyle(this.__box2, "display", t ? "block" : "none") };
    d.__showFail = function(t) { a._$showFail(t) };
    d.__showFail2 = function(t) { a._$showFail(t) };
    d.__showLeak = function(t, e) { this.__isLeak = !0;
        if (1 == t) { this.__isLeak1 = !0;
            s._$render(this.__box2, "exception1-tmp", { product: this.__product, promark: this.__promark }) } else if (2 == t) { this.__isLeak2 = !0;
            s._$render(this.__box2, "exception2-tmp", { product: this.__product, promark: this.__promark }) } else if (3 == t) { this.__isLeak3 = !0;
            s._$render(this.__box2, "exception3-tmp", { product: this.__product, promark: this.__promark }) } else if (4 == t) {
            var i = e.mode || {};
            this.__showMode(i) }
        this.__changePage(1) };
    d.__showMode = function(t) { this.__isMode = 1;
        var e = { product: this.__product, promark: this.__promark };
        var i = t;
        i.srclist = i.srcList ? i.srcList.join(",") : "";
        n._$merge(e, i);
        var r = "exception-tmp-" + (t.mode || 0);
        s._$render(this.__box2, r, e);
        this.__changePage(1) };
    d.__sendSize = function(t) {
        var e = document.body.scrollWidth,
            i = document.body.clientHeight,
            n = { width: e, height: i, type: t || "resize" };
        if (e * i > 0) { n["URS-CM"] = 1;
            o._$postMessage("_parent", { data: n }) } };
    d.__sendClose = function(t) {
        var i = e._$getByClassName(document, "j-inputtext");
        var r = !0;
        n._$forEach(i, function(t) {
            if (t.value) r = !1 });
        if (t || this.__islogin || r) {
            var s = { type: "close" };
            s["URS-CM"] = 1;
            o._$postMessage("_parent", { data: s }) } else this.__showConfirm() };
    d.__doAction = function(t) {
        var n = i._$getElement(t),
            r = e._$dataset(n, "action");
        if ("confirmgoon" == r) { e._$addClassName(e._$get("confirm"), "f-dn");
            e._$delClassName(e._$get("cnt-box-parent"), "f-dn");
            this.__sendSize("init") }
        if ("confirmclose" == r) { _gaq.push(["_trackEvent", "注册步骤", "【-】放弃注册", "放弃注册"]);
            var s = { type: "close" };
            s["URS-CM"] = 1;
            o._$postMessage("_parent", { data: s });
            this.__closeFlag = !1 } };
    d.__showConfirm = function() { e._$addClassName(e._$get("cnt-box-parent"), "f-dn");
        e._$delClassName(e._$get("confirm"), "f-dn");
        this.__sendSize("init") };
    d.__sendMsgDomain = function(t, e) { this.__sendMsg(t);
        if (e && this.__setDomainsOk) this.__setDomainsOk(e) };
    d.__addIframe = function(t, i, n, r) {
        if ("https:" == location.protocol) r = r.replace("http:", "https:");
        var s = r.indexOf("zc.reg.163.com") == -1;
        if (s) s = r.indexOf("/zc/") == -1;
        if (s) r = a._$addPathB(r);
        e._$createXFrame({ src: r, parent: document.body, visible: !1, onload: function() { this.__setMap[n].iframeIndex++;
                if (this.__setMap[n].ifarmeSize == this.__setMap[n].iframeIndex) { this.__setMap[n].iframeCt = clearTimeout(this.__setMap[n].iframeCt);
                    this.__sendMsgDomain(t, i) } }._$bind(this) }) };
    d.__setDomains = function(t, e) {
        var i = t || {};
        e = e || "";
        i["URS-CM"] = 1;
        var r = (new Date).getTime();
        this.__setMap[r] = {};
        this.__setMap[r].iframeIndex = 0;
        var s = i.nextUrls || [];
        this.__setMap[r].ifarmeSize = s.length || 0;
        if (this.__setMap[r].ifarmeSize > 0) this.__setMap[r].iframeCt = setTimeout(function(t, e) { this.__sendMsgDomain(t, e) }._$bind(this, i, e), 5e3);
        else this.__sendMsgDomain(i, e);
        n._$forEach(s, this.__addIframe._$bind(this, i, e, r)) };
    d.__sendMsg = function(t) {
        var e = t || {};
        e["URS-CM"] = 1;
        if (window.$outLoginKey && "success" == e.type) e.fromOutLogin = 1;
        o._$postMessage("_parent", { data: e }) };
    window.thirdHandler = function(t) {
        var e = { type: "success", isOther: !0, username: t };
        e["URS-CM"] = 1;
        if (window.$outLoginKey) e.fromOutLogin = 1;
        o._$postMessage("_parent", { data: e }) };
    window.$outLogin = function(t) {
        var e;
        if (t.isOther) window.thirdHandler(t.username);
        else {
            var i = JSON.stringify(t);
            e = JSON.parse(i);
            e.toOpener = 1;
            o._$postMessage("_parent", { data: e }) } };
    return c
}, 1, 2, 3, 4, 5, 19, 10, 11, 29);
I$(69, function(t, e, i, n, r, s, o, a, _, c, h) {
    var u = "https://reg.163.com/services/getqrcodeid";
    var l = "https://reg.163.com/services/getUrlQrcode";
    var d = "https://reg.163.com/services/qrcodeauth";
    var f = "https://reg.163.com/services/ticketloginForZJ";
    a._$initQr = function(t) {
        if (!t) t = [];
        this.__totalState = 0;
        this.__ticket = "";
        this.__domain = "";
        this.__domains = t.domains || "";
        this.__prdomain = t.prdomain || "";
        this.__product = t.product || "urs";
        this.__promark = t.promark;
        this.__usage = t.usage || 0;
        this.__size = t.size || "200";
        this.__format = t.format || "png";
        this.__qrcodeDom = t.qrcodeDom || null;
        this.__imgDom = t.imgDom || null;
        this.__oWarmDom = t.oWarmDom || null;
        this.__qrSuccDom = t.qrSuccDom || null;
        this.__qrBackBrn = t.qrBackDom || null;
        this.__pollingSec = t.pollingSec || 2e3;
        this.__maxPollingTimes = t.maxPollingTimes || 150;
        this.__completePollingTimes = t.completePollingTimes || 60;
        this.__qrLoginSucc = t.qrLoginSucc || this.__qrLoginSucc;
        this.__qrLoginErr = t.qrLoginErr || this.__qrLoginErr;
        this.__confirmLogin = t.confirmLogin || this.__confirmLogin;
        this.__scanIsComplete = t.scanIsComplete || this.__scanIsComplete;
        this.__codeLose = t.codeLose || this.__codeLose;
        this.__oWarmDom.onclick = function() { a.__changeState(1) };
        this.__qrBackBrn.onclick = function() { a.__changeState(1) };
        this.__changeState(1) };
    a.__changeState = function(t) {
        switch (t) {
            case 0:
                this._$clearAllStatus();
                this.__hideScanSucc();
                this.__showQrcodeM();
                this.__showOWarm();
                this.__totalState = 0;
                break;
            case 1:
                this.__hideScanSucc();
                this.__showQrcodeM();
                this.__getQrcode();
                this.__hideOWarm();
                this.__totalState = 1;
                break;
            case 2:
                this.__hideQrcodeM();
                this.__showScanSucc();
                this.__totalState = 2 } };
    a.__getQrcode = function() {
        var t = this;
        if (1 !== this.__totalState) {
            var e = function(e) { e = JSON.parse(e["content"]);
                t.__qrId = e["l"]["i"];
                if (t.__qrId) t.__showQrcode(t.__imgDom) };
            var i = { product: this.__product, usage: this.__usage };
            o._$requestJsonp(u, i, e) } };
    a.__showQrcode = function(t) { t.src = l + "?uuid=" + this.__qrId + "&size=" + this.__size + "&format=" + this.__format + "&" + (new Date).getTime();
        this.__restartTiming(0) };
    a.__restartTiming = function(t) {
        var e = this;
        this.__qrTiming = 0;
        var i = this.__pollingSec;
        var n = 0 == t ? this.__maxPollingTimes : this.__completePollingTimes;
        if (this.__checkQrStIntv) clearInterval(e.__checkQrStIntv);
        this.__checkQrStIntv = setInterval(function() { e.__qrTiming++;
            e.__checkQrStatus();
            if (e.__qrTiming >= n) { clearInterval(e.__checkQrStIntv);
                e.__changeState(0);
                e.__codeLose() } }, i) };
    a.__checkQrStatus = function() {
        var t = this;
        var e = function(e) {
            var i = e.retCode;
            switch (i) {
                case "200":
                    if (0 == t.__totalState) break;
                    t.__changeState(2);
                    t.__ticket = e.ticket;
                    t.__domain = e.domain;
                    t.__confirmLogin(e);
                    t._$clearAllStatus();
                    t.__doQrLogin();
                    break;
                case "401":
                    if (1 != t.__totalState) break;
                    t.__changeState(0);
                    t.__codeLose(e);
                    break;
                case "404":
                    if (1 != t.__totalState) break;
                    t.__changeState(0);
                    t.__codeLose(e);
                    break;
                case "408":
                    break;
                case "409":
                    if (1 != t.__totalState) break;
                    t.__scanIsComplete(e);
                    t.__changeState(2);
                    t.__restartTiming(1);
                    break;
                case "500":
                    if (1 != t.__totalState) break;
                    t.__codeLose(e);
                    t.__changeState(0) } };
        var i = { uuid: this.__qrId, product: this.__product };
        o._$requestJsonp(d, i, e) };
    a.__doQrLogin = function() {
        var t = this;
        var e = function(e) {
            var i = e.ret;
            if ("201" == i) {
                var n = e.username;
                n.indexOf("@") === -1 ? n += "@163.com" : null;
                if (!t.__prdomain || n.substring(n.indexOf("@")) == t.__prdomain) t.__qrLoginSucc(n, e);
                else { t.__changeState(1);
                    var r = t.__prdomain ? "扫码失败，请使用" + t.__prdomain + "帐号扫码登录" : "请使用指定域名帐号扫码登录";
                    t.__qrLoginErr(e, r) } } else { t.__changeState(0);
                t.__qrLoginErr(e) } };
        var i = { tk: this.__ticket, pd: this.__product, domains: this.__domains, pkid: this.__promark };
        r._$request("qrlogin", i, e._$bind(this), e._$bind(this), 1) };
    a.__qrLoginSucc = function() {};
    a.__qrLoginErr = function() {};
    a.__confirmLogin = function() {};
    a.__scanIsComplete = function() {};
    a.__codeLose = function() {};
    a._$clearAllStatus = function() { clearInterval(this.__checkQrStIntv);
        this.__qrTiming = 0 };
    a.__showQrcodeM = function() {
        if (this.__qrcodeDom) e._$delClassName(this.__qrcodeDom, "f-dn") };
    a.__hideQrcodeM = function() {
        if (this.__qrcodeDom) e._$addClassName(this.__qrcodeDom, "f-dn") };
    a.__showOWarm = function() {
        if (this.__oWarmDom) e._$delClassName(this.__oWarmDom, "f-dn") };
    a.__hideOWarm = function() {
        if (this.__oWarmDom) e._$addClassName(this.__oWarmDom, "f-dn") };
    a.__showScanSucc = function() {
        if (this.__qrSuccDom) e._$delClassName(this.__qrSuccDom, "f-dn") };
    a.__hideScanSucc = function() {
        if (this.__qrSuccDom) e._$addClassName(this.__qrSuccDom, "f-dn") };
    return a }, 1, 2, 3, 4, 28, 22, 11);
I$(31, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d, f) {
    var m, p;
    u._$$QrcodeManager = t._$klass();
    m = u._$$QrcodeManager._$extend(o._$$Abstract);
    m.__init = function(t) { this.__product = t.product || "urs";
        this.__prdomain = t.prdomain || "";
        this.__toolName = t.toolName || "邮箱大师App";
        this.__toolUrl = t.toolUrl || "//mail.163.com/dashi/?from=urs";
        this.__opts = t.opts;
        this.__super() };
    m.__reset = function(t) { this.__super(t);
        this.__qrBox = e._$getByClassName(document, "m-qrcode")[0];
        this.__tooApp.href = this.__toolUrl;
        this.__tooApp.innerHTML = this.__toolName;
        this.__qrcodeDom = e._$getByClassName(this.__qrBox, "j-qrblock")[0];
        this.__qrImgDom = e._$getByClassName(this.__qrBox, "j-qrcode")[0];
        this.__qrOWarmDom = e._$getByClassName(this.__qrBox, "j-owarm")[0];
        this.__qrSuccDom = e._$getByClassName(this.__qrBox, "j-qrsucc")[0];
        this.__qrBackDom = e._$getByClassName(this.__qrBox, "j-qrback")[0];
        var i = { promark: this.__opts.promark, domains: this.__opts.domains, product: this.__product, prdomain: this.__prdomain, qrcodeDom: this.__qrcodeDom, imgDom: this.__qrImgDom, oWarmDom: this.__qrOWarmDom, qrSuccDom: this.__qrSuccDom, qrBackDom: this.__qrBackDom, qrLoginSucc: this.__qrLoginSucc._$bind(this), qrLoginErr: this.__qrLoginErr._$bind(this), confirmLogin: this.__confirmLogin._$bind(this), scanIsComplete: this.__scanIsComplete._$bind(this), codeLose: this.__codeLose._$bind(this) };
        c._$initQr(i);
        a._$resize() };
    m.__destroy = function() { this.__super();
        c._$clearAllStatus() };
    m.__initNode = function() { this.__super();
        this.__tooApp = e._$getByClassName(this.__body, "j-toolapp")[0] };
    m.__initXGui = function() { p = r._$addNodeTemplate(s._$get("qrcode-tmp"));
        this.__seed_html = p };
    m.__qrLoginSucc = function(t, e) { this.__username = t;
        this.__doQrLoginSucc(e) };
    m.__doQrLoginSucc = function(t) {
        h._$cookie("THE_LAST_LOGIN", { value: this.__username, expires: 30 });
        var e = t.nextUrls;
        var i = { type: "success", username: this.__username, isqr: 1, nextUrls: e };
        this._$dispatchEvent("sendmsg", i);
        _gaq.push(["_trackEvent", "二维码登录", "【3】二维码登录结果", "扫码登录成功"])
    };
    m.__qrLoginErr = function(t, e) {
        if (!t) t = [];
        var i = e || "扫码登录失败，请重试";
        a._$showFail2(i);
        e = e || t.ret;
        _gaq.push(["_trackEvent", "二维码登录", "【3】二维码登录结果", e ? e : "扫码登录失败"]) };
    m.__confirmLogin = function() { _gaq.push(["_trackEvent", "二维码登录", "【2】二维码确认", "用户确认登录"]) };
    m.__scanIsComplete = function() { _gaq.push(["_trackEvent", "二维码登录", "【1】扫码", "扫码成功"]) };
    m.__codeLose = function() { _gaq.push(["_trackEvent", "二维码登录", "【-】二维码异常", "二维码失效"]) }
}, 1, 2, 3, 4, 6, 19, 68, 11, 32, 69, 29);
! function(t, e) { "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : "object" == typeof exports ? exports.Regular = e() : t.Regular = e() }(this, function() {
    return function(t) {
        function e(n) {
            if (i[n]) return i[n].exports;
            var r = i[n] = { exports: {}, id: n, loaded: !1 };
            return t[n].call(r.exports, r, r.exports, e), r.loaded = !0, r.exports }
        var i = {};
        return e.m = t, e.c = i, e.p = "", e(0) }([function(t, e, i) {
        var n = i(1),
            r = i(2),
            s = t.exports = i(3),
            o = s.Parser,
            a = s.Lexer;
        n.browser && (i(6), i(7), i(8), s.dom = i(4)), s.env = n, s.util = i(5), s.parse = function(t, e) { e = e || {}, (e.BEGIN || e.END) && (e.BEGIN && (r.BEGIN = e.BEGIN), e.END && (r.END = e.END), a.setup());
            var i = new o(t).parse();
            return e.stringify ? JSON.stringify(i) : i } }, function(t, e, i) {
        var n = i(5);
        e.svg = function() {
            return "undefined" != typeof document && document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") }(), e.browser = "undefined" != typeof document && document.nodeType, e.exprCache = n.cache(1e3), e.isRunning = !1 }, function(t) { t.exports = { BEGIN: "{", END: "}" } }, function(t, e, i) {
        var n = i(1),
            r = i(11),
            s = i(12),
            o = i(2),
            a = i(5),
            _ = i(13),
            c = {};
        if (n.browser) {
            var h = i(4),
                u = i(9),
                l = i(10),
                d = h.doc;
            c = i(14) }
        var f = i(15),
            m = i(16),
            p = i(17),
            g = i(18),
            v = function(t, e) {
                var i = n.isRunning;
                n.isRunning = !0;
                var r, o;
                t = t || {}, e = e || {}, t.data = t.data || {}, t.computed = t.computed || {}, t.events = t.events || {}, this.data && a.extend(t.data, this.data), this.computed && a.extend(t.computed, this.computed), this.events && a.extend(t.events, this.events), a.extend(this, t, !0), this.$parent && this.$parent._append(this), this._children = [], this.$refs = {}, o = this.template, "string" == typeof o && o.length < 16 && (r = h.find(o)) && (o = r.innerHTML), o && o.nodeType && (o = o.innerHTML), "string" == typeof o && (this.template = new s(o).parse()), this.computed = y(this.computed), this.$root = this.$root || this, this.events && this.$on(this.events), this.$emit("$config"), this.config && this.config(this.data);
                var _ = this._body;
                this._body = null, _ && _.ast && _.ast.length && (this.$body = a.getCompileFn(_.ast, _.ctx, { outer: this, namespace: e.namespace, extra: e.extra, record: !0 })), o && (this.group = this.$compile(this.template, { namespace: e.namespace }), c.node(this)), this.$parent || this.$update(), this.$ready = !0, this.$emit("$init"), this.init && this.init(this.data), n.isRunning = i };
        u && (u.Regular = v), a.extend(v, { _directives: { __regexp__: [] }, _plugins: {}, _protoInheritCache: ["directive", "use"], __after__: function(t, e) {
                var i;
                if (this.__after__ = t.__after__, e.name && v.component(e.name, this), i = e.template) {
                    var n, r; "string" == typeof i && i.length < 16 && (n = h.find(i)) && (i = n.innerHTML, (r = h.attr(n, "name")) && v.component(r, this)), i.nodeType && (i = i.innerHTML), "string" == typeof i && (this.prototype.template = new s(i).parse()) }
                e.computed && (this.prototype.computed = y(e.computed)), v._inheritConfig(this, t) }, directive: function(t, e) {
                if ("object" === a.typeOf(t)) {
                    for (var i in t) t.hasOwnProperty(i) && this.directive(i, t[i]);
                    return this }
                var n, r = a.typeOf(t),
                    s = this._directives;
                if (null != e) return "function" == typeof e && (e = { link: e }), "string" === r ? s[t] = e : "regexp" === r && (e.regexp = t, s.__regexp__.push(e)), this;
                else {
                    if ("string" === r && (n = s[t])) return n;
                    for (var o = s.__regexp__, _ = 0, c = o.length; c > _; _++) { n = o[_];
                        var h = n.regexp.test(t);
                        if (h) return n } } }, plugin: function(t, e) {
                var i = this._plugins;
                return null == e ? i[t] : (i[t] = e, this) }, use: function(t) {
                return "string" == typeof t && (t = v.plugin(t)), "function" != typeof t ? this : (t(this, v), this) }, config: function(t) {
                var e = !1;
                if ("object" == typeof t)
                    for (var i in t)("END" === i || "BEGIN" === i) && (e = !0), o[i] = t[i];
                e && r.setup() }, expression: p.expression, Parser: s, Lexer: r, _addProtoInheritCache: function(t, e) {
                if (Array.isArray(t)) return t.forEach(v._addProtoInheritCache);
                var i = "_" + t + "s";
                v._protoInheritCache.push(t), v[i] = {}, v[t] || (v[t] = function(n, r) {
                    var s = this[i];
                    if ("object" == typeof n) {
                        for (var o in n) n.hasOwnProperty(o) && this[t](o, n[o]);
                        return this }
                    return null == r ? s[n] : (s[n] = e ? e(r) : r, this) }) }, _inheritConfig: function(t, e) {
                var i = v._protoInheritCache,
                    n = a.slice(i);
                return n.forEach(function(i) { t[i] = e[i];
                    var n = "_" + i + "s";
                    e[n] && (t[n] = a.createObject(e[n])) }), t } }), _(v), v._addProtoInheritCache("component"), v._addProtoInheritCache("filter", function(t) {
            return "function" == typeof t ? { get: t } : t }), f.mixTo(v), m.mixTo(v), v.implement({ init: function() {}, config: function() {}, destroy: function() { this.$emit("$destroy"), this.group && this.group.destroy(!0), this.group = null, this.parentNode = null, this._watchers = null, this._children = [];
                var t = this.$parent;
                if (t) {
                    var e = t._children.indexOf(this);
                    t._children.splice(e, 1) }
                this.$parent = null, this.$root = null, this._handles = null, this.$refs = null }, $compile: function(t, e) { e = e || {}, "string" == typeof t && (t = new s(t).parse());
                var i, n = this.__ext__,
                    r = e.record;
                e.extra && (this.__ext__ = e.extra), r && this._record();
                var o = this._walk(t, e);
                if (r) { i = this._release();
                    var a = this;
                    i.length && (o.ondestroy = function() { a.$unwatch(i) }) }
                return e.extra && (this.__ext__ = n), o }, $bind: function(t, e, i) {
                var n = a.typeOf(e);
                if ("expression" === e.type || "string" === n) this._bind(t, e, i);
                else if ("array" === n)
                    for (var r = 0, s = e.length; s > r; r++) this._bind(t, e[r]);
                else if ("object" === n)
                    for (var r in e) e.hasOwnProperty(r) && this._bind(t, r, e[r]);
                return t.$update(), this }, $unbind: function() {}, $inject: c.inject, $mute: function(t) { t = !!t;
                var e = t === !1 && this._mute;
                return this._mute = !!t, e && this.$update(), this }, _bind: function(t, e, i) {
                var n = this;
                if (!(t && t instanceof v)) throw "$bind() should pass Regular component as first argument";
                if (!e) throw "$bind() should  pass as least one expression to bind";
                if (i || (i = e), e = p.expression(e), i = p.expression(i), i.set) {
                    var r = this.$watch(e, function(e) { t.$update(i, e) });
                    t.$on("$destroy", function() { n.$unwatch(r) }) }
                if (e.set) {
                    var s = t.$watch(i, function(t) { n.$update(e, t) });
                    this.$on("$destroy", t.$unwatch.bind(t, s)) }
                i.set(t, e.get(this)) }, _walk: function(t, e) {
                if ("array" === a.typeOf(t)) {
                    for (var i = [], n = 0, r = t.length; r > n; n++) i.push(this._walk(t[n], e));
                    return new l(i) }
                return "string" == typeof t ? d.createTextNode(t) : u[t.type || "default"].call(this, t, e) }, _append: function(t) { this._children.push(t), t.$parent = this }, _handleEvent: function(t, e, i, n) {
                var r, s = this.constructor,
                    o = "function" != typeof i ? a.handleEvent.call(this, i, e) : i,
                    _ = s.event(e);
                return _ ? r = _.call(this, t, o, n) : h.on(t, e, o), _ ? r : function() { h.off(t, e, o) } }, _touchExpr: function(t) {
                var e, i = this.__ext__,
                    n = {};
                if ("expression" !== t.type || t.touched) return t;
                if (e = t.get || (t.get = new Function(a.ctxName, a.extName, a.prefix + "return (" + t.body + ")")), n.get = i ? function(t) {
                        return e(t, i) } : e, t.setbody && !t.set) {
                    var r = t.setbody;
                    t.set = function(e, i, n) {
                        return t.set = new Function(a.ctxName, a.setName, a.extName, a.prefix + r), t.set(e, i, n) }, t.setbody = null }
                return t.set && (n.set = i ? function(e, n) {
                    return t.set(e, n, i) } : t.set), a.extend(n, { type: "expression", touched: !0, once: t.once || t.constant }), n }, _f_: function(t) {
                var e = this.constructor,
                    i = e.filter(t);
                if (!i) throw Error("filter " + t + " is undefined");
                return i }, _sg_: function(t, e, i) {
                if ("undefined" != typeof i) {
                    var n = this.computed,
                        r = n[t];
                    if (r) {
                        if ("expression" !== r.type || r.get || this._touchExpr(r), r.get) return r.get(this);
                        a.log("the computed '" + t + "' don't define the get function,  get data." + t + " altnately", "warn") } }
                return "undefined" == typeof e || "undefined" == typeof t ? void 0 : i && "undefined" != typeof i[t] ? i[t] : e[t] }, _ss_: function(t, e, i, n, r) {
                var s, r = this.computed,
                    n = n || "=",
                    o = r ? r[t] : null;
                if ("=" !== n) switch (s = o ? o.get(this) : i[t], n) {
                    case "+=":
                        e = s + e;
                        break;
                    case "-=":
                        e = s - e;
                        break;
                    case "*=":
                        e = s * e;
                        break;
                    case "/=":
                        e = s / e;
                        break;
                    case "%=":
                        e = s % e }
                if (o) {
                    if (o.set) return o.set(this, e);
                    a.log("the computed '" + t + "' don't define the set function,  assign data." + t + " altnately", "warn") }
                return i[t] = e, e } }), v.prototype.inject = function() {
            return a.log("use $inject instead of inject", "error"), this.$inject.apply(this, arguments) }, v.filter(g), t.exports = v;
        var y = function() {
            function t(t) {
                return function(e) {
                    return t.call(e, e.data) } }

            function e(t) {
                return function(e, i) {
                    return t.call(e, i, e.data), i } }
            return function(i) {
                if (i) {
                    var n, r, s, o = {};
                    for (var a in i) n = i[a], s = typeof n, "expression" !== n.type ? "string" === s ? o[a] = p.expression(n) : (r = o[a] = { type: "expression" }, "function" === s ? r.get = t(n) : (n.get && (r.get = t(n.get)), n.set && (r.set = e(n.set)))) : o[a] = n;
                    return o } } }() }, function(t, e, i) {
        function n(t) {
            return ("" + t).replace(/-\D/g, function(t) {
                return t.charAt(1).toUpperCase() }) }

        function r(t, e) {
            return "change" === e && _.msie < 9 && t && t.tagName && "input" === t.tagName.toLowerCase() && ("checkbox" === t.type || "radio" === t.type) ? "click" : e }

        function s(t) {
            if (t = t || window.event, t._fixed) return t;
            this.event = t, this.target = t.target || t.srcElement;
            var e = this.type = t.type,
                i = this.button = t.button;
            if (m.test(e) && (this.pageX = null != t.pageX ? t.pageX : t.clientX + p.scrollLeft, this.pageY = null != t.pageX ? t.pageY : t.clientY + p.scrollTop, "mouseover" === e || "mouseout" === e)) {
                for (var n = t.relatedTarget || t[("mouseover" === e ? "from" : "to") + "Element"]; n && 3 === n.nodeType;) n = n.parentNode;
                this.relatedTarget = n }("DOMMouseScroll" === e || "mousewheel" === e) && (this.wheelDelta = t.wheelDelta ? t.wheelDelta / 120 : -(t.detail || 0) / 3), this.which = t.which || t.keyCode, this.which || void 0 === i || (this.which = 1 & i ? 1 : 2 & i ? 3 : 4 & i ? 2 : 0), this._fixed = !0 }
        var o, a, _ = t.exports,
            c = i(1),
            h = i(5),
            u = document.createElement("div"),
            l = function() {},
            d = { html: "http://www.w3.org/1999/xhtml", svg: "http://www.w3.org/2000/svg" };
        _.body = document.body, _.doc = document, _.tNode = u, u.addEventListener ? (o = function(t, e, i) { t.addEventListener(e, i, !1) }, a = function(t, e, i) { t.removeEventListener(e, i, !1) }) : (o = function(t, e, i) { t.attachEvent("on" + e, i) }, a = function(t, e, i) { t.detachEvent("on" + e, i) }), _.msie = parseInt((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]), isNaN(_.msie) && (_.msie = parseInt((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1])),
            _.find = function(t) {
                if (document.querySelector) try {
                    return document.querySelector(t) } catch (e) {}
                return -1 !== t.indexOf("#") ? document.getElementById(t.slice(1)) : void 0 }, _.inject = function(t, e, i) {
                if (i = i || "bottom", t) {
                    if (Array.isArray(t)) {
                        var n = t;
                        t = _.fragment();
                        for (var r = 0, s = n.length; s > r; r++) t.appendChild(n[r]) }
                    var o, a;
                    switch (i) {
                        case "bottom":
                            e.appendChild(t);
                            break;
                        case "top":
                            (o = e.firstChild) ? e.insertBefore(t, e.firstChild): e.appendChild(t);
                            break;
                        case "after":
                            (a = e.nextSibling) ? a.parentNode.insertBefore(t, a): e.parentNode.appendChild(t);
                            break;
                        case "before":
                            e.parentNode.insertBefore(t, e) } } }, _.id = function(t) {
                return document.getElementById(t) }, _.create = function(t, e) {
                if ("svg" === e) {
                    if (!c.svg) throw Error("the env need svg support");
                    e = d.svg }
                return e ? document.createElementNS(e, t) : document.createElement(t) }, _.fragment = function() {
                return document.createDocumentFragment() };
        var f = { "class": function(t, e) { "className" in t && (t.namespaceURI === d.html || !t.namespaceURI) ? t.className = e || "" : t.setAttribute("class", e) }, "for": function(t, e) { "htmlFor" in t ? t.htmlFor = e : t.setAttribute("for", e) }, style: function(t, e) { t.style ? t.style.cssText = e : t.setAttribute("style", e) }, value: function(t, e) { t.value = null != e ? e : "" } };
        _.attr = function(t, e, i) {
            if (h.isBooleanAttr(e)) {
                if ("undefined" == typeof i) return t[e] || (t.attributes.getNamedItem(e) || l).specified ? e : void 0;
                i ? (t[e] = !0, t.setAttribute(e, e), _.msie && _.msie <= 7 && (t.defaultChecked = !0)) : (t[e] = !1, t.removeAttribute(e)) } else if ("undefined" != typeof i) f[e] ? f[e](t, i) : null === i ? t.removeAttribute(e) : t.setAttribute(e, i);
            else if (t.getAttribute) {
                var n = t.getAttribute(e, 2);
                return null === n ? void 0 : n } }, _.on = function(t, e, i) {
            var n = e.split(" ");
            i.real = function(e) {
                var n = new s(e);
                n.origin = t, i.call(t, n) }, n.forEach(function(e) { e = r(t, e), o(t, e, i.real) }) }, _.off = function(t, e, i) {
            var n = e.split(" ");
            i = i.real || i, n.forEach(function(e) { e = r(t, e), a(t, e, i) }) }, _.text = function() {
            var t = {};
            return _.msie && _.msie < 9 ? (t[1] = "innerText", t[3] = "nodeValue") : t[1] = t[3] = "textContent",
                function(e, i) {
                    var n = t[e.nodeType];
                    return null == i ? n ? e[n] : "" : void(e[n] = i) } }(), _.html = function(t, e) {
            return "undefined" == typeof e ? t.innerHTML : void(t.innerHTML = e) }, _.replace = function(t, e) { e.parentNode && e.parentNode.replaceChild(t, e) }, _.remove = function(t) { t.parentNode && t.parentNode.removeChild(t) }, _.css = function(t, e, i) {
            if ("object" !== h.typeOf(e)) {
                if ("undefined" == typeof i) {
                    var r;
                    return _.msie <= 8 && (r = t.currentStyle && t.currentStyle[e], "" === r && (r = "auto")), r = r || t.style[e], _.msie <= 8 && (r = "" === r ? void 0 : r), r }
                e = n(e), e && (t.style[e] = i) } else
                for (var s in e) e.hasOwnProperty(s) && _.css(t, s, e[s]) }, _.addClass = function(t, e) {
            var i = t.className || ""; - 1 === (" " + i + " ").indexOf(" " + e + " ") && (t.className = i ? i + " " + e : e) }, _.delClass = function(t, e) {
            var i = t.className || "";
            t.className = (" " + i + " ").replace(" " + e + " ", " ").trim() }, _.hasClass = function(t, e) {
            var i = t.className || "";
            return -1 !== (" " + i + " ").indexOf(" " + e + " ") };
        var m = /^(?:click|dblclick|contextmenu|DOMMouseScroll|mouse(?:\w+))$/,
            p = document;
        p = p.compatMode && "CSS1Compat" !== p.compatMode ? p.body : p.documentElement, h.extend(s.prototype, { immediateStop: h.isFalse, stop: function() { this.preventDefault().stopPropagation() }, preventDefault: function() {
                return this.event.preventDefault ? this.event.preventDefault() : this.event.returnValue = !1, this }, stopPropagation: function() {
                return this.event.stopPropagation ? this.event.stopPropagation() : this.event.cancelBubble = !0, this }, stopImmediatePropagation: function() { this.event.stopImmediatePropagation && this.event.stopImmediatePropagation() } }), _.nextFrame = function() {
            var t = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(t) { setTimeout(t, 16) },
                e = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || function(t) { clearTimeout(t) };
            return function(i) {
                var n = t(i);
                return function() { e(n) } } }();
        var g;
        _.nextReflow = _.msie ? function(t) {
            return _.nextFrame(function() { g = document.body.offsetWidth, t() }) } : _.nextFrame
    }, function(t, e, i) {
        (function(e) {
            function n(t, e) { "undefined" != typeof console && console[e || "log"](t) }
            i(19)();
            var r = t.exports,
                s = i(20),
                o = [].slice,
                a = {}.toString,
                _ = "undefined" != typeof window ? window : e;
            r.noop = function() {}, r.uid = function() {
                var t = 0;
                return function() {
                    return t++ } }(), r.extend = function(t, e, i) {
                for (var n in e)("undefined" == typeof t[n] || i === !0) && (t[n] = e[n]);
                return t }, r.keys = function(t) {
                if (Object.keys) return Object.keys(t);
                var e = [];
                for (var i in t) t.hasOwnProperty(i) && e.push(i);
                return e }, r.varName = "d", r.setName = "p_", r.ctxName = "c", r.extName = "e", r.rWord = /^[\$\w]+$/, r.rSimpleAccessor = /^[\$\w]+(\.[\$\w]+)*$/, r.nextTick = "function" == typeof setImmediate ? setImmediate.bind(_) : function(t) { setTimeout(t, 0) }, r.prefix = "var " + r.varName + "=" + r.ctxName + ".data;" + r.extName + "=" + r.extName + "||'';", r.slice = function(t, e, i) {
                for (var n = [], r = e || 0, s = i || t.length; s > r; r++) {
                    var o = t[r];
                    n.push(o) }
                return n }, r.typeOf = function(t) {
                return null == t ? String(t) : a.call(t).slice(8, -1).toLowerCase() }, r.makePredicate = function(t) {
                function e(t) {
                    if (1 === t.length) return i += "return str === '" + t[0] + "';";
                    i += "switch(str){";
                    for (var e = 0; e < t.length; ++e) i += "case '" + t[e] + "':";
                    i += "return true}return false;" } "string" == typeof t && (t = t.split(" "));
                var i = "",
                    n = [];
                t: for (var r = 0; r < t.length; ++r) {
                    for (var s = 0; s < n.length; ++s)
                        if (n[s][0].length === t[r].length) { n[s].push(t[r]);
                            continue t }
                    n.push([t[r]]) }
                if (n.length > 3) { n.sort(function(t, e) {
                        return e.length - t.length }), i += "switch(str.length){";
                    for (var r = 0; r < n.length; ++r) {
                        var o = n[r];
                        i += "case " + o[0].length + ":", e(o) }
                    i += "}" } else e(t);
                return new Function("str", i) }, r.trackErrorPos = function() {
                function t(t, e) {
                    for (var i = 0, n = 0, r = t.length; r > n; n++) {
                        var s = (t[n] || "").length;
                        if (i + s > e) return { num: n, line: t[n], start: e - n - i, prev: t[n - 1], next: t[n + 1] };
                        i += s } }

                function e(t, e, i, s) {
                    var o = t.length,
                        a = e - n;
                    0 > a && (a = 0);
                    var _ = e + r;
                    _ > o && (_ = o);
                    var c = t.slice(a, _),
                        h = "[" + (i + 1) + "] " + (a > 0 ? ".." : ""),
                        u = o > _ ? ".." : "",
                        l = h + c + u;
                    return s && (l += "\n" + new Array(e - a + h.length + 1).join(" ") + "^^^"), l }
                var i = /\r\n|[\n\r\u2028\u2029]/g,
                    n = 20,
                    r = 20;
                return function(n, r) { r > n.length - 1 && (r = n.length - 1), i.lastIndex = 0;
                    var s = n.split(i),
                        o = t(s, r),
                        a = o.start,
                        _ = o.num;
                    return (o.prev ? e(o.prev, a, _ - 1) + "\n" : "") + e(o.line, a, _, !0) + "\n" + (o.next ? e(o.next, a, _ + 1) + "\n" : "") } }();
            var c = /\((\?\!|\?\:|\?\=)/g;
            r.findSubCapture = function(t) {
                var e = 0,
                    i = 0,
                    n = t.length,
                    r = t.match(c);
                for (r = r ? r.length : 0; n--;) {
                    var s = t.charAt(n);
                    (0 === n || "\\" !== t.charAt(n - 1)) && ("(" === s && e++, ")" === s && i++) }
                if (e !== i) throw "RegExp: " + t + "'s bracket is not marched";
                return e - r }, r.escapeRegExp = function(t) {
                return t.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, function(t) {
                    return "\\" + t }) };
            var h = new RegExp("&(?:(#x[0-9a-fA-F]+)|(#[0-9]+)|(" + r.keys(s).join("|") + "));", "gi");
            r.convertEntity = function(t) {
                return ("" + t).replace(h, function(t, e, i, n) {
                    var r;
                    return r = i ? parseInt(i.slice(1), 10) : e ? parseInt(e.slice(2), 16) : s[n], String.fromCharCode(r) }) }, r.createObject = function(t, e) {
                function i() {}
                i.prototype = t;
                var n = new i;
                return e && r.extend(n, e), n }, r.createProto = function(t, e) {
                function i() { this.constructor = t }
                return i.prototype = e, t.prototype = new i }, r.clone = function(t) {
                var e = r.typeOf(t);
                if ("array" === e) {
                    for (var i = [], n = 0, s = t.length; s > n; n++) i[n] = t[n];
                    return i }
                if ("object" === e) {
                    var i = {};
                    for (var n in t) t.hasOwnProperty(n) && (i[n] = t[n]);
                    return i }
                return t }, r.equals = function(t, e) {
                var i = typeof t;
                return "number" === i && "number" == typeof e && isNaN(t) && isNaN(e) ? !0 : t === e };
            var u = /-([a-z])/g;
            r.camelCase = function(t) {
                return t.replace(u, function(t, e) {
                    return e.toUpperCase() }) }, r.throttle = function(t, e) {
                var i, n, r, e = e || 100,
                    s = null,
                    o = 0,
                    a = function() { o = +new Date, s = null, r = t.apply(i, n), i = n = null };
                return function() {
                    var _ = +new Date,
                        c = e - (_ - o);
                    return i = this, n = arguments, 0 >= c || c > e ? (clearTimeout(s), s = null, o = _, r = t.apply(i, n), i = n = null) : s || (s = setTimeout(a, c)), r } }, r.escape = function() {
                var t = /&/g,
                    e = /</g,
                    i = />/g,
                    n = /\'/g,
                    r = /\"/g,
                    s = /[&<>\"\']/;
                return function(o) {
                    return s.test(o) ? o.replace(t, "&amp;").replace(e, "&lt;").replace(i, "&gt;").replace(n, "&#39;").replace(r, "&quot;") : o } }(), r.cache = function(t) { t = t || 1e3;
                var e = [],
                    i = {};
                return { set: function(t, n) {
                        return e.length > this.max && (i[e.shift()] = void 0), void 0 === i[t] && e.push(t), i[t] = n, n }, get: function(t) {
                        return void 0 === t ? i : i[t] }, max: t, len: function() {
                        return e.length } } }, r.handleEvent = function(t) {
                var e, i = this;
                return "expression" === t.type && (e = t.get), e ? function(t) { i.$update(function() {
                        var n = this.data;
                        n.$event = t;
                        var r = e(i);
                        r === !1 && t && t.preventDefault && t.preventDefault(), n.$event = void 0 }) } : function() {
                    var e = o.call(arguments);
                    e.unshift(t), i.$update(function() { i.$emit.apply(i, e) }) } }, r.once = function(t) {
                var e = 0;
                return function() { 0 === e++ && t.apply(this, arguments) } }, r.fixObjStr = function(t) {
                return 0 !== t.trim().indexOf("{") ? "{" + t + "}" : t }, r.map = function(t, e) {
                for (var i = [], n = 0, r = t.length; r > n; n++) i.push(e(t[n], n));
                return i }, r.log = n, r.isVoidTag = r.makePredicate("area base br col embed hr img input keygen link menuitem meta param source track wbr r-content"), r.isBooleanAttr = r.makePredicate("selected checked disabled readonly required open autofocus controls autoplay compact loop defer multiple"), r.isFalse - function() {
                return !1 }, r.isTrue - function() {
                return !0 }, r.isExpr = function(t) {
                return t && "expression" === t.type }, r.isGroup = function(t) {
                return t.inject || t.$inject }, r.getCompileFn = function(t, e, i) {
                return e.$compile.bind(e, t, i) } }).call(e, function() {
            return this }()) }, function(t, e, i) {
        var n = i(5),
            r = i(4),
            s = (i(21), i(3)),
            o = i(22);
        i(23), i(24), t.exports = {
            "r-class": function(t, e) { "string" == typeof e && (e = n.fixObjStr(e)), this.$watch(e, function(e) {
                    var i = " " + t.className.replace(/\s+/g, " ") + " ";
                    for (var n in e) e.hasOwnProperty(n) && (i = i.replace(" " + n + " ", " "), e[n] === !0 && (i += n + " "));
                    t.className = i.trim() }, !0) },
            "r-style": function(t, e) { "string" == typeof e && (e = n.fixObjStr(e)), this.$watch(e, function(e) {
                    for (var i in e) e.hasOwnProperty(i) && r.css(t, i, e[i]) }, !0) },
            "r-hide": function(t, e) {
                var i, r = null;
                n.isExpr(e) || "string" == typeof e ? this.$watch(e, function(e) {
                    var n = !!e;
                    n !== r && (r = n, n ? t.onleave ? i = t.onleave(function() { t.style.display = "none", i = null }) : t.style.display = "none" : (i && i(), t.style.display = "", t.onenter && t.onenter())) }) : e && (t.style.display = "none") },
            "r-html": function(t, e) { this.$watch(e, function(e) { e = e || "", r.html(t, e) }, { force: !0 }) },
            ref: {
                accept: o.COMPONENT_TYPE + o.ELEMENT_TYPE,
                link: function(t, e) {
                    var i, r = this.$refs || (this.$refs = {});
                    return n.isExpr(e) ? this.$watch(e, function(e, n) { i = e, r[n] === t && (r[n] = null), i && (r[i] = t) }) : r[i = e] = t,
                        function() { r[i] = null } }
            }
        }, s.directive(t.exports)
    }, function(t, e, i) {
        function n(t) {
            var e, i = [],
                n = 0,
                r = s.noop,
                o = { type: t, start: function(t) {
                        return e = s.uid(), "function" == typeof t && (r = t), n > 0 ? n = 0 : o.step(), o.compelete }, compelete: function() { e = null, r && r(), r = s.noop, n = 0 }, step: function() { i[n] && i[n](o.done.bind(o, e)) }, done: function(t) { t === e && (n < i.length - 1 ? (n++, o.step()) : o.compelete()) }, push: function(t) { i.push(t) } };
            return o }

        function r(t, e) {
            function i(t) { u && g.push(u), u = n(t) }

            function r(t, e) { e && t() }

            function o(t) {
                return function() { t.onenter = null, t.onleave = null } }
            var a = this.constructor;
            s.isExpr(e) && (e = e.get(this)), e = e.trim();
            for (var _, u, l, d, f, m, p = e.split(";"), g = [], v = [], y = 0, b = p.length; b > y; y++)
                if (_ = p[y], f = _.split(":"), l = f[0] && f[0].trim(), d = f[1] && f[1].trim(), l)
                    if (l !== c)
                        if (l !== h) {
                            var m = a.animation(l);
                            if (!m || !u) throw Error(m ? "you should start with `on` or `event` in animation" : "undefined animator 【" + l + "】");
                            u.push(m.call(this, { element: t, done: u.done, param: d })) } else i(d), "leave" === d ? (t.onleave = u.start, v.push(o(t))) : "enter" === d ? (t.onenter = u.start, v.push(o(t))) : "on" + d in t ? v.push(this._handleEvent(t, d, u.start)) : (this.$on(d, u.start), v.push(this.$off.bind(this, d, u.start)));
            else i("when"), this.$watch(d, r.bind(this, u.start));
            return v.length ? function() { v.forEach(function(t) { t() }) } : void 0 }
        var s = i(5),
            o = i(21),
            a = (i(4), i(3)),
            _ = /\s+/,
            c = "when",
            h = "on";
        a._addProtoInheritCache("animation"), a.animation({ wait: function(t) {
                var e = parseInt(t.param) || 0;
                return function(t) { setTimeout(t, e) } }, "class": function(t) {
                var e = t.param.split(","),
                    i = e[0] || "",
                    n = parseInt(e[1]) || 1;
                return function(e) { o.startClassAnimate(t.element, i, e, n) } }, call: function(t) {
                var e = this.$expression(t.param).get,
                    i = this;
                return function(t) { e(i), i.$update(), t() } }, emit: function(t) {
                var e = t.param,
                    i = e.split(","),
                    n = i[0] || "",
                    r = i[1] ? this.$expression(i[1]).get : null;
                if (!n) throw Error("you shoud specified a eventname in emit command");
                var s = this;
                return function(t) { s.$emit(n, r ? r(s) : void 0), t() } }, style: function(t) {
                var e, i = {},
                    n = t.param,
                    r = n.split(",");
                return r.forEach(function(t) {
                        if (t = t.trim()) {
                            var n = t.split(_),
                                r = n.shift(),
                                s = n.join(" ");
                            if (!r || !s) throw Error("invalid style in command: style");
                            i[r] = s, e = !0 } }),
                    function(n) { e ? o.startStyleAnimate(t.element, i, n) : n() } } }), a.directive("r-animation", r), a.directive("r-anim", r) }, function(t, e, i) {
        function n(t) { t.implement({ $timeout: function(t, e) {
                    return e = e || 0, setTimeout(function() { t.call(this), this.$update() }.bind(this), e) }, $interval: function(t, e) {
                    return e = e || 1e3 / 60, setInterval(function() { t.call(this), this.$update() }.bind(this), e) } }) }
        var r = i(3);
        r.plugin("timeout", n), r.plugin("$timeout", n) }, function(t, e, i) {
        function n(t, e) {
            return "object" === e ? h.keys(t) : "array" === e ? t : [] }

        function r(t, e, i) {
            for (var n = [], r = 0, s = t.length; s > r; r++) {
                var o = this._walk(t[r], { element: e, fromElement: !0, attrs: t, extra: i });
                o && n.push(o) }
            return n }
        var s = i(25).diffArray,
            o = i(14),
            a = i(21),
            _ = (i(26), i(10)),
            c = i(4),
            h = i(5),
            u = t.exports = {};
        u.list = function(t, e) {
            function i(t, e) {
                for (var i = 0; e > i; i++) {
                    var n = x.children.splice(t + 1, 1)[0];
                    n && n.destroy(!0) } }

            function r(i, n, r, s) {
                for (var _ = i; n > _; _++) {
                    var u = r[_],
                        l = {};
                    c(l, _, u, s), l = h.createObject(b, l);
                    var d = $.$compile(t.body, { extra: l, namespace: y, record: !0, outer: e.outer });
                    d.data = l;
                    var f = o.last(x.get(_));
                    f.parentNode && a.inject(o.node(d), f, "after"), x.children.splice(_ + 1, 0, d) } }

            function c(t, e, i, n) { t[C] = e, n ? (t[M] = i, t[E] = n[i]) : (t[E] = i, t[M] = null) }

            function l(t, e, i, n) {
                for (var r = t; e > r; r++) {
                    var s = x.get(r + 1),
                        o = i[r];
                    c(s.data, r, o, n) } }

            function d(t, e, n, o) {
                var a = 0,
                    _ = t.length;
                if (n || 0 === _ && 0 === e.length || (n = s(t, e, !0)), n && n.length) {
                    for (var c = 0; c < n.length; c++) {
                        var h = n[c],
                            u = h.index,
                            d = h.removed,
                            f = h.add,
                            m = d.length;
                        if (w && m && f) {
                            for (var g = Math.min(m, f), v = 0; g > v;) p(t[u], u) !== p(d[0], u) && (i(u, 1), r(u, u + 1, t, o)), d.shift(), f--, u++, v++;
                            m = d.length }
                        l(a, u, t, o), i(u, m), r(u, u + f, t, o), a = u + f - m, a = 0 > a ? 0 : a }
                    if (_ > a)
                        for (var c = a; _ > c; c++) {
                            var y = x.get(c + 1);
                            y.data[C] = c } } }

            function f(t, e, n) {
                var s = t.length,
                    o = e.length,
                    a = Math.min(s, o);
                l(0, a, t, n), o > s ? i(s, o - s) : s > o && r(o, s, t, n) }

            function m(t, i, r) {
                var s, _ = h.typeOf(t),
                    c = h.typeOf(i),
                    u = n(t, _),
                    l = n(i, c),
                    m = u && u.length,
                    p = l && l.length;
                if (!p && m && x.get(1)) {
                    var g = x.children.pop();
                    g.destroy && g.destroy(!0) }
                if ("object" === _ && (s = t), w === !0 ? f(u, l, s) : d(u, l, r, s), !m && j && j.length) {
                    var C = $.$compile(j, { extra: b, record: !0, outer: e.outer, namespace: y });
                    x.children.push(C), v.parentNode && a.inject(o.node(C), v, "after") } }
            var p, g, v = (u.Regular, document.createComment("Regular list")),
                y = e.namespace,
                b = e.extra,
                $ = this,
                x = new _([v]),
                C = t.variable + "_index",
                M = t.variable + "_key",
                E = t.variable,
                j = t.alternate,
                w = t.track;
            return w && w !== !0 && (w = this._touchExpr(w), g = h.createObject(b), p = function(t, e) {
                return g[E] = t, g[C] = e, w.get($, g) }), this.$watch(t.sequence, m, { init: !0, diff: w !== !0, deep: !0 }), x }, u.template = function(t, e) {
            var i, i, n = t.content,
                r = document.createComment("inlcude"),
                s = e.namespace,
                o = e.extra,
                a = new _([r]);
            if (n) {
                var c = this;
                this.$watch(n, function(t) {
                    var n = a.get(1),
                        _ = typeof t;
                    n && (n.destroy(!0), a.children.pop()), t && (a.push(i = "function" === _ ? t() : c.$compile("object" !== _ ? String(t) : t, { record: !0, outer: e.outer, namespace: s, extra: o })), r.parentNode && i.$inject(r, "before")) }, { init: !0 }) }
            return a };
        var l = 0;
        u["if"] = function(t, e) {
            var i, n, r = this,
                s = e.extra;
            if (e && e.element) {
                var c = function(a) { a ? (n && o.destroy(n), t.consequent && (i = r.$compile(t.consequent, { record: !0, element: e.element, extra: s }))) : (i && o.destroy(i), t.alternate && (n = r.$compile(t.alternate, { record: !0, element: e.element, extra: s }))) };
                return this.$watch(t.test, c, { force: !0 }), { destroy: function() { i ? o.destroy(i) : n && o.destroy(n) } } }
            var i, n, h = document.createComment("Regular if" + l++),
                u = new _;
            u.push(h);
            var d = null,
                f = e.namespace,
                c = function(_) {
                    var c = !!_;
                    c !== d && (d = c, u.children[1] && (u.children[1].destroy(!0), u.children.pop()), c ? t.consequent && t.consequent.length && (i = r.$compile(t.consequent, { record: !0, outer: e.outer, namespace: f, extra: s }), u.push(i), h.parentNode && a.inject(o.node(i), h, "before")) : t.alternate && t.alternate.length && (n = r.$compile(t.alternate, { record: !0, outer: e.outer, namespace: f, extra: s }), u.push(n), h.parentNode && a.inject(o.node(n), h, "before"))) };
            return this.$watch(t.test, c, { force: !0, init: !0 }), u }, u.expression = function(t) {
            var e = document.createTextNode("");
            return this.$watch(t, function(t) { c.text(e, "" + (null == t ? "" : "" + t)) }, { init: !0 }), e }, u.text = function(t) {
            var e = document.createTextNode(h.convertEntity(t.text));
            return e };
        var d = /^on-(.+)$/;
        u.element = function(t, e) {
            var i, n, s = t.attrs,
                _ = this.constructor,
                l = t.children,
                d = e.namespace,
                f = e.extra,
                m = t.tag,
                p = _.component(m);
            if ("r-content" === m) return h.log("r-content is deprecated, use {#inc this.$body} instead (`{#include}` as same)", "warn"), this.$body && this.$body();
            if (p || "r-component" === m) return e.Component = p, u.component.call(this, t, e); "svg" === m && (d = "svg"), l && l.length && (i = this.$compile(l, { outer: e.outer, namespace: d, extra: f })), n = c.create(m, d, s), i && !h.isVoidTag(m) && c.inject(o.node(i), n), t.touched || (s.sort(function(t, e) {
                var i = _.directive(t.name),
                    n = _.directive(e.name);
                return i && n ? (n.priority || 1) - (i.priority || 1) : i ? 1 : n ? -1 : "type" === e.name ? 1 : -1 }), t.touched = !0);
            var g = r.call(this, s, n, f);
            return { type: "element", group: i, node: function() {
                    return n }, last: function() {
                    return n }, destroy: function(t) { t ? a.remove(n, i ? i.destroy.bind(i) : h.noop) : i && i.destroy(), g.length && g.forEach(function(t) { t && ("function" == typeof t.destroy ? t.destroy() : t()) }) } } }, u.component = function(t, e) {
            for (var i, n, r, s, a = t.attrs, c = e.Component, u = this.constructor, l = e.extra, f = e.namespace, m = this, p = {}, g = 0, v = a.length; v > g; g++) {
                var y = a[g],
                    b = this._touchExpr(void 0 === y.value ? !0 : y.value);
                b.constant && (b = y.value = b.get(this)), y.value && y.value.constant === !0 && (b = b.get(this));
                var $ = y.name;
                if (!y.event) {
                    var x = $.match(d);
                    x && (y.event = x[1]) }
                if ("cmpl" === y.mdf && (b = h.getCompileFn(b, this, { record: !0, namespace: f, extra: l, outer: e.outer })), "is" === $ && !c) { r = b;
                    var C = this.$get(b, !0);
                    if (c = u.component(C), "function" != typeof c) throw new Error("component " + C + " has not registed!") }
                var M;
                (M = y.event) ? (s = s || {}, s[M] = h.handleEvent.call(this, b, M)) : ($ = y.name = h.camelCase($), p[$] = "expression" !== b.type ? b : b.get(m), "ref" === $ && null != b && (n = b), "isolate" === $ && (i = "expression" === b.type ? b.get(m) : parseInt(b === !0 ? 3 : b, 10), p.isolate = i)) }
            var E, j = { data: p, events: s, $parent: 2 & i ? null : this, $root: this.$root, $outer: e.outer, _body: { ctx: this, ast: t.children } },
                e = { namespace: f, extra: e.extra },
                w = new c(j, e);
            n && this.$refs && (E = c.directive("ref").link, this.$on("$destroy", E.call(this, w, n))), n && m.$refs && (m.$refs[n] = w);
            for (var g = 0, v = a.length; v > g; g++) {
                var y = a[g],
                    b = y.value || !0,
                    $ = y.name; "expression" !== b.type || y.event || (b = m._touchExpr(b), 2 & i || this.$watch(b, function(t, e) { this.data[t] = e }.bind(w, $)), !b.set || 1 & i || w.$watch($, m.$update.bind(m, b), { sync: !0 })) }
            if (r && "expression" === r.type) {
                var Z = new _;
                return Z.push(w), this.$watch(r, function(t) {
                    var e = u.component(t);
                    if (!e) throw new Error("component " + t + " has not registed!");
                    var i = new e(j),
                        r = Z.children.pop();
                    Z.push(i), i.$inject(o.last(r), "after"), r.destroy(), n && (m.$refs[n] = i) }, { sync: !0 }), Z }
            return w }, u.attribute = function(t, e) {
            var i = t,
                n = i.name,
                r = i.value || "",
                s = r.constant,
                o = this.constructor,
                a = o.directive(n),
                _ = e.element,
                u = this;
            if (r = this._touchExpr(r), s && (r = r.get(this)), a && a.link) {
                var l = a.link.call(u, _, r, n, e.attrs);
                return "function" == typeof l && (l = { destroy: l }), l }
            return "expression" === r.type ? this.$watch(r, function(t) { c.attr(_, n, t) }, { init: !0 }) : h.isBooleanAttr(n) ? c.attr(_, n, !0) : c.attr(_, n, r), e.fromElement ? void 0 : { destroy: function() { c.attr(_, n, null) } } } }, function(t, e, i) {
        function n(t) { this.children = t || [] }
        var r = i(5),
            s = i(14),
            o = r.extend(n.prototype, { destroy: function(t) { s.destroy(this.children, t), this.ondestroy && this.ondestroy(), this.children = null }, get: function(t) {
                    return this.children[t] }, push: function(t) { this.children.push(t) } });
        o.inject = o.$inject = s.inject, t.exports = n }, function(t, e, i) {
        function n(t) {
            return function(e) {
                return { type: t, value: e } } }

        function r(t, e) { u[h.END] && (this.markStart = u[h.END], this.markEnd = h.END), this.input = (t || "").trim(), this.opts = e || {}, this.map = 2 !== this.opts.mode ? a : _, this.states = ["INIT"], e && e.expression && (this.states.push("JST"), this.expression = !0) }

        function s(t) {
            for (var e, i, n = {}, r = 0, s = t.length; s > r; r++) e = t[r],
                i = e[2] || "INIT", (n[i] || (n[i] = { rules: [], links: [] })).rules.push(e);
            return o(n)
        }

        function o(t) {
            function e(t, e) {
                return "string" == typeof l[e] ? c.escapeRegExp(l[e]) : String(l[e]).slice(1, -1) }
            var i, r, s, o, a, _, h;
            for (var u in t) { i = t[u], i.curIndex = 1, r = i.rules, s = [];
                for (var d = 0, f = r.length; f > d; d++) h = r[d], a = h[0], o = h[1], "string" == typeof o && (o = n(o)), "regexp" === c.typeOf(a) && (a = a.toString().slice(1, -1)), a = a.replace(/\{(\w+)\}/g, e), _ = c.findSubCapture(a) + 1, i.links.push([i.curIndex, _, o]), i.curIndex += _, s.push(a);
                i.TRUNK = new RegExp("^(?:(" + s.join(")|(") + "))") }
            return t }
        var a, _, c = i(5),
            h = i(2),
            u = { "}": "{", "]": "[" },
            l = { NAME: /(?:[:_A-Za-z][-\.:_0-9A-Za-z]*)/, IDENT: /[\$_A-Za-z][_0-9A-Za-z\$]*/, SPACE: /[\r\n\t\f ]/ },
            d = /a|(b)/.exec("a"),
            f = d && void 0 === d[1] ? function(t) {
                return void 0 !== t } : function(t) {
                return !!t },
            m = r.prototype;
        m.lex = function(t) { t = (t || this.input).trim();
            var e, i, n, r, s, o = [];
            this.input = t, this.marks = 0, this.index = 0;
            for (var a = 0; t;) a++, s = this.state(), e = this.map[s], i = e.TRUNK.exec(t), i || this.error("Unrecoginized Token"), n = i[0].length, t = t.slice(n), r = this._process.call(this, i, e, t), r && o.push(r), this.index += n;
            return o.push({ type: "EOF" }), o }, m.error = function(t) {
            throw Error("Parse Error: " + t + ":\n" + c.trackErrorPos(this.input, this.index)) }, m._process = function(t, e, i) {
            for (var n, r = e.links, s = !1, o = r.length, a = 0; o > a; a++) {
                var _ = r[a],
                    c = _[2],
                    h = _[0];
                if (f(t[h])) { s = !0, c && (n = c.apply(this, t.slice(h, h + _[1])), n && (n.pos = this.index));
                    break } }
            if (!s) switch (i.charAt(0)) {
                case "<":
                    this.enter("TAG");
                    break;
                default:
                    this.enter("JST") }
            return n }, m.enter = function(t) {
            return this.states.push(t), this }, m.state = function() {
            var t = this.states;
            return t[t.length - 1] }, m.leave = function(t) {
            var e = this.states;
            t && e[e.length - 1] !== t || e.pop() }, r.setup = function() { l.END = h.END, l.BEGIN = h.BEGIN, a = s([p.ENTER_JST, p.ENTER_TAG, p.TEXT, p.TAG_NAME, p.TAG_OPEN, p.TAG_CLOSE, p.TAG_PUNCHOR, p.TAG_ENTER_JST, p.TAG_UNQ_VALUE, p.TAG_STRING, p.TAG_SPACE, p.TAG_COMMENT, p.JST_OPEN, p.JST_CLOSE, p.JST_COMMENT, p.JST_EXPR_OPEN, p.JST_IDENT, p.JST_SPACE, p.JST_LEAVE, p.JST_NUMBER, p.JST_PUNCHOR, p.JST_STRING, p.JST_COMMENT]), _ = s([p.ENTER_JST2, p.TEXT, p.JST_COMMENT, p.JST_OPEN, p.JST_CLOSE, p.JST_EXPR_OPEN, p.JST_IDENT, p.JST_SPACE, p.JST_LEAVE, p.JST_NUMBER, p.JST_PUNCHOR, p.JST_STRING, p.JST_COMMENT]) };
        var p = { ENTER_JST: [/[^\x00<]*?(?={BEGIN})/, function(t) {
                return this.enter("JST"), t ? { type: "TEXT", value: t } : void 0 }], ENTER_JST2: [/[^\x00]*?(?={BEGIN})/, function(t) {
                return this.enter("JST"), t ? { type: "TEXT", value: t } : void 0 }], ENTER_TAG: [/[^\x00]*?(?=<[\w\/\!])/, function(t) {
                return this.enter("TAG"), t ? { type: "TEXT", value: t } : void 0 }], TEXT: [/[^\x00]+/, "TEXT"], TAG_NAME: [/{NAME}/, "NAME", "TAG"], TAG_UNQ_VALUE: [/[^\{}&"'=><`\r\n\f\t ]+/, "UNQ", "TAG"], TAG_OPEN: [/<({NAME})\s*/, function(t, e) {
                return { type: "TAG_OPEN", value: e } }, "TAG"], TAG_CLOSE: [/<\/({NAME})[\r\n\f\t ]*>/, function(t, e) {
                return this.leave(), { type: "TAG_CLOSE", value: e } }, "TAG"], TAG_ENTER_JST: [/(?={BEGIN})/, function() { this.enter("JST") }, "TAG"], TAG_PUNCHOR: [/[\>\/=&]/, function(t) {
                return ">" === t && this.leave(), { type: t, value: t } }, "TAG"], TAG_STRING: [/'([^']*)'|"([^"]*)\"/, function(t, e, i) {
                var n = e || i || "";
                return { type: "STRING", value: n } }, "TAG"], TAG_SPACE: [/{SPACE}+/, null, "TAG"], TAG_COMMENT: [/<\!--([^\x00]*?)--\>/, function() { this.leave() }, "TAG"], JST_OPEN: ["{BEGIN}#{SPACE}*({IDENT})", function(t, e) {
                return { type: "OPEN", value: e } }, "JST"], JST_LEAVE: [/{END}/, function(t) {
                return this.markEnd === t && this.expression ? { type: this.markEnd, value: this.markEnd } : this.markEnd && this.marks ? (this.marks--, { type: this.markEnd, value: this.markEnd }) : (this.firstEnterStart = !1, this.leave("JST"), { type: "END" }) }, "JST"], JST_CLOSE: [/{BEGIN}\s*\/({IDENT})\s*{END}/, function(t, e) {
                return this.leave("JST"), { type: "CLOSE", value: e } }, "JST"], JST_COMMENT: [/{BEGIN}\!([^\x00]*?)\!{END}/, function() { this.leave() }, "JST"], JST_EXPR_OPEN: ["{BEGIN}", function(t) {
                if (t === this.markStart) {
                    if (this.expression) return { type: this.markStart, value: this.markStart };
                    if (this.firstEnterStart || this.marks) return this.marks++, this.firstEnterStart = !1, { type: this.markStart, value: this.markStart };
                    this.firstEnterStart = !0 }
                return { type: "EXPR_OPEN", escape: !1 } }, "JST"], JST_IDENT: ["{IDENT}", "IDENT", "JST"], JST_SPACE: [/[ \r\n\f]+/, null, "JST"], JST_PUNCHOR: [/[=!]?==|[-=><+*\/%\!]?\=|\|\||&&|\@\(|\.\.|[<\>\[\]\(\)\-\|\{}\+\*\/%?:\.!,]/, function(t) {
                return { type: t, value: t } }, "JST"], JST_STRING: [/'([^']*)'|"([^"]*)"/, function(t, e, i) {
                return { type: "STRING", value: e || i || "" } }, "JST"], JST_NUMBER: [/(?:[0-9]*\.[0-9]+|[0-9]+)(e\d+)?/, function(t) {
                return { type: "NUMBER", value: parseFloat(t, 10) } }, "JST"] };
        r.setup(), t.exports = r
    }, function(t, e, i) {
        function n(t, e) { e = e || {}, this.input = t, this.tokens = new a(t, e).lex(), this.pos = 0, this.length = this.tokens.length }
        var r = i(5),
            s = i(2),
            o = i(26),
            a = i(11),
            _ = r.varName,
            c = r.ctxName,
            h = r.extName,
            u = r.makePredicate("STRING IDENT NUMBER"),
            l = r.makePredicate("true false undefined null this Array Date JSON Math NaN RegExp decodeURI decodeURIComponent encodeURI encodeURIComponent parseFloat parseInt Object"),
            d = n.prototype;
        d.parse = function() { this.pos = 0;
            var t = this.program();
            return "TAG_CLOSE" === this.ll().type && this.error("You may got a unclosed Tag"), t }, d.ll = function(t) { t = t || 1, 0 > t && (t += 1);
            var e = this.pos + t - 1;
            return e > this.length - 1 ? this.tokens[this.length - 1] : this.tokens[e] }, d.la = function(t) {
            return (this.ll(t) || "").type }, d.match = function(t, e) {
            var i;
            return (i = this.eat(t, e)) ? i : (i = this.ll(), void this.error("expect [" + t + (null == e ? "" : ":" + e) + ']" -> got "[' + i.type + (null == e ? "" : ":" + i.value) + "]", i.pos)) }, d.error = function(t, e) {
            throw t = "\n【 parse failed 】 " + t + ":\n\n" + r.trackErrorPos(this.input, "number" == typeof e ? e : this.ll().pos || 0), new Error(t) }, d.next = function(t) { t = t || 1, this.pos += t }, d.eat = function(t, e) {
            var i = this.ll();
            if ("string" != typeof t) {
                for (var n = t.length; n--;)
                    if (i.type === t[n]) return this.next(), i } else if (i.type === t && ("undefined" == typeof e || i.value === e)) return this.next(), i;
            return !1 }, d.program = function() {
            for (var t = [], e = this.ll();
                "EOF" !== e.type && "TAG_CLOSE" !== e.type;) t.push(this.statement()), e = this.ll();
            return t }, d.statement = function() {
            var t = this.ll();
            switch (t.type) {
                case "NAME":
                case "TEXT":
                    var e = t.value;
                    for (this.next(); t = this.eat(["NAME", "TEXT"]);) e += t.value;
                    return o.text(e);
                case "TAG_OPEN":
                    return this.xml();
                case "OPEN":
                    return this.directive();
                case "EXPR_OPEN":
                    return this.interplation();
                default:
                    this.error("Unexpected token: " + this.la()) } }, d.xml = function() {
            var t, e, i, n;
            return t = this.match("TAG_OPEN").value, e = this.attrs(), n = this.eat("/"), this.match(">"), n || r.isVoidTag(t) || (i = this.program(), this.eat("TAG_CLOSE", t) || this.error("expect </" + t + "> gotno matched closeTag")), o.element(t, e, i) }, d.xentity = function(t) {
            var e, i, n = t.value;
            if ("NAME" === t.type) {
                if (~n.indexOf(".")) {
                    var r = n.split(".");
                    n = r[0], i = r[1] }
                return this.eat("=") && (e = this.attvalue(i)), o.attribute(n, e, i) }
            return "if" !== n && this.error("current version. ONLY RULE #if #else #elseif is valid in tag, the rule #" + n + " is invalid"), this["if"](!0) }, d.attrs = function(t) {
            var e;
            e = t ? ["NAME"] : ["NAME", "OPEN"];
            for (var i, n = []; i = this.eat(e);) n.push(this.xentity(i));
            return n }, d.attvalue = function(t) {
            var e = this.ll();
            switch (e.type) {
                case "NAME":
                case "UNQ":
                case "STRING":
                    this.next();
                    var i = e.value;
                    if (~i.indexOf(s.BEGIN) && ~i.indexOf(s.END) && "cmpl" !== t) {
                        var r = !0,
                            a = new n(i, { mode: 2 }).parse();
                        if (1 === a.length && "expression" === a[0].type) return a[0];
                        var _ = [];
                        a.forEach(function(t) { t.constant || (r = !1), _.push(t.body || "'" + t.text.replace(/'/g, "\\'") + "'") }), _ = "[" + _.join(",") + "].join('')", i = o.expression(_, null, r) }
                    return i;
                case "EXPR_OPEN":
                    return this.interplation();
                default:
                    this.error("Unexpected token: " + this.la()) } }, d.directive = function() {
            var t = this.ll().value;
            return this.next(), "function" == typeof this[t] ? this[t]() : void this.error("Undefined directive[" + t + "]") }, d.interplation = function() { this.match("EXPR_OPEN");
            var t = this.expression(!0);
            return this.match("END"), t }, d.inc = d.include = function() {
            var t = this.expression();
            return this.match("END"), o.template(t) }, d["if"] = function(t) {
            var e = this.expression(),
                i = [],
                n = [],
                r = i,
                s = t ? "attrs" : "statement";
            this.match("END");
            for (var a, _; !(_ = this.eat("CLOSE"));)
                if (a = this.ll(), "OPEN" === a.type) switch (a.value) {
                    case "else":
                        r = n, this.next(), this.match("END");
                        break;
                    case "elseif":
                        return this.next(), n.push(this["if"](t)), o["if"](e, i, n);
                    default:
                        r.push(this[s](!0)) } else r.push(this[s](!0));
            return "if" !== _.value && this.error("Unmatched if directive"), o["if"](e, i, n) }, d.list = function() {
            var t, e, i, n = this.expression(),
                r = [],
                s = [],
                a = r;
            for (this.match("IDENT", "as"), t = this.match("IDENT").value, this.eat("IDENT", "by") && (this.eat("IDENT", t + "_index") ? i = !0 : (i = this.expression(), i.constant && (i = !0))), this.match("END"); !(e = this.eat("CLOSE"));) this.eat("OPEN", "else") ? (a = s, this.match("END")) : a.push(this.statement());
            return "list" !== e.value && this.error("expect list got /" + e.value + " ", e.pos), o.list(n, t, r, s, i) }, d.expression = function() {
            var t;
            return this.eat("@(") ? (t = this.expr(), t.once = !0, this.match(")")) : t = this.expr(), t }, d.expr = function() { this.depend = [];
            var t = this.filter(),
                e = t.get || t,
                i = t.set;
            return o.expression(e, i, !this.depend.length) }, d.filter = function() {
            var t, e, i, n = this.assign(),
                s = this.eat("|"),
                o = [],
                a = "t",
                _ = n.set,
                h = "";
            if (s) { _ && (t = []), e = "(function(" + a + "){";
                do h = a + " = " + c + "._f_('" + this.match("IDENT").value + "' ).get.call( " + r.ctxName + "," + a, h += this.eat(":") ? ", " + this.arguments("|").join(",") + ");" : ");", o.push(h), t && t.unshift(h.replace(" ).get.call", " ).set.call")); while (s = this.eat("|"));
                return o.push("return " + a), t && t.push("return " + a), i = e + o.join("") + "})(" + n.get + ")", t && (_ = _.replace(r.setName, e + t.join("") + "})(" + r.setName + ")")), this.getset(i, _) }
            return n }, d.assign = function() {
            var t, e = this.condition();
            return (t = this.eat(["=", "+=", "-=", "*=", "/=", "%="])) ? (e.set || this.error("invalid lefthand expression in assignment expression"), this.getset(e.set.replace("," + r.setName, "," + this.condition().get).replace("'='", "'" + t.type + "'"), e.set)) : e }, d.condition = function() {
            var t = this.or();
            return this.eat("?") ? this.getset([t.get + "?", this.assign().get, this.match(":").type, this.assign().get].join("")) : t }, d.or = function() {
            var t = this.and();
            return this.eat("||") ? this.getset(t.get + "||" + this.or().get) : t }, d.and = function() {
            var t = this.equal();
            return this.eat("&&") ? this.getset(t.get + "&&" + this.and().get) : t }, d.equal = function() {
            var t, e = this.relation();
            return (t = this.eat(["==", "!=", "===", "!=="])) ? this.getset(e.get + t.type + this.equal().get) : e
        }, d.relation = function() {
            var t, e = this.additive();
            return (t = this.eat(["<", ">", ">=", "<="]) || this.eat("IDENT", "in")) ? this.getset(e.get + t.value + this.relation().get) : e }, d.additive = function() {
            var t, e = this.multive();
            return (t = this.eat(["+", "-"])) ? this.getset(e.get + t.value + this.additive().get) : e }, d.multive = function() {
            var t, e = this.range();
            return (t = this.eat(["*", "/", "%"])) ? this.getset(e.get + t.type + this.multive().get) : e }, d.range = function() {
            var t, e, i = this.unary();
            if (t = this.eat("..")) { e = this.unary();
                var n = "(function(start,end){var res = [],step=end>start?1:-1; for(var i = start; end>start?i <= end: i>=end; i=i+step){res.push(i); } return res })(" + i.get + "," + e.get + ")";
                return this.getset(n) }
            return i }, d.unary = function() {
            var t;
            return (t = this.eat(["+", "-", "~", "!"])) ? this.getset("(" + t.type + this.unary().get + ")") : this.member() }, d.member = function(t, e, i, n) {
            var s, o, a, l = !1;
            if (t) "string" == typeof e && u(e) ? i.push(e) : (i && i.length && this.depend.push(i), i = null);
            else { o = this.primary();
                var d = typeof o; "string" === d ? (i = [], i.push(o), e = o, a = h + "." + o, t = c + "._sg_('" + o + "', " + _ + ", " + h + ")", l = !0) : "this" === o.get ? (t = c, i = ["this"]) : (i = null, t = o.get) }
            if (s = this.eat(["[", ".", "("])) switch (s.type) {
                case ".":
                    var f = this.match("IDENT").value;
                    return n = t, "(" !== this.la() ? t = c + "._sg_('" + f + "', " + t + ")" : t += "['" + f + "']", this.member(t, f, i, n);
                case "[":
                    return o = this.assign(), n = t, "(" !== this.la() ? t = c + "._sg_(" + o.get + ", " + t + ")" : t += "[" + o.get + "]", this.match("]"), this.member(t, o, i, n);
                case "(":
                    var m = this.arguments().join(",");
                    return t = t + "(" + m + ")", this.match(")"), this.member(t, null, i) }
            i && i.length && this.depend.push(i);
            var p = { get: t };
            return e && (p.set = c + "._ss_(" + (e.get ? e.get : "'" + e + "'") + "," + r.setName + "," + (n ? n : r.varName) + ", '=', " + (l ? 1 : 0) + ")"), p }, d.arguments = function(t) { t = t || ")";
            var e = [];
            do this.la() !== t && e.push(this.assign().get); while (this.eat(","));
            return e }, d.primary = function() {
            var t = this.ll();
            switch (t.type) {
                case "{":
                    return this.object();
                case "[":
                    return this.array();
                case "(":
                    return this.paren();
                case "STRING":
                    return this.next(), this.getset("'" + t.value + "'");
                case "NUMBER":
                    return this.next(), this.getset("" + t.value);
                case "IDENT":
                    return this.next(), l(t.value) ? this.getset(t.value) : t.value;
                default:
                    this.error("Unexpected Token: " + t.type) } }, d.object = function() {
            for (var t = [this.match("{").type], e = this.eat(["STRING", "IDENT", "NUMBER"]); e;) { t.push("'" + e.value + "'" + this.match(":").type);
                var i = this.assign().get;
                t.push(i), e = null, this.eat(",") && (e = this.eat(["STRING", "IDENT", "NUMBER"])) && t.push(",") }
            return t.push(this.match("}").type), { get: t.join("") } }, d.array = function() {
            var t, e = [this.match("[").type];
            if (this.eat("]")) e.push("]");
            else {
                for (;
                    (t = this.assign()) && (e.push(t.get), this.eat(","));) e.push(",");
                e.push(this.match("]").type) }
            return { get: e.join("") } }, d.paren = function() { this.match("(");
            var t = this.filter();
            return t.get = "(" + t.get + ")", this.match(")"), t }, d.getset = function(t, e) {
            return { get: t, set: e } }, t.exports = n
    }, function(t, e, i) {
        function n(t, e, i) {
            return function() {
                var n = this.supr;
                this.supr = i[t];
                var r = e.apply(this, arguments);
                return this.supr = n, r } }

        function r(t, e, i) {
            for (var r in e) e.hasOwnProperty(r) && (t[r] = a(e[r]) && a(i[r]) && o.test(e[r]) ? n(r, e[r], i) : e[r]) }
        var s = i(5),
            o = /xy/.test(function() {; "xy" }) ? /\bsupr\b/ : /.*/,
            a = function(t) {
                return "function" == typeof t },
            _ = ["events", "data", "computed"],
            c = _.length;
        t.exports = function h(t) {
            function e() { o.apply(this, arguments) }

            function i(t) {
                for (var e = c; e--;) {
                    var i = _[e];
                    t.hasOwnProperty(i) && n.hasOwnProperty(i) && (s.extend(n[i], t[i], !0), delete t[i]) }
                return r(n, t, a), this }
            t = t || {};
            var n, o = this,
                a = o && o.prototype || {};
            return "function" == typeof t ? (n = t.prototype, t.implement = i, t.extend = h, t) : (n = s.createProto(e, a), e.implement = i, e.implement(t), o.__after__ && o.__after__.call(e, o, t), e.extend = h, e) } }, function(t, e, i) {
        var n = i(4),
            r = i(21),
            s = t.exports = { node: function(t) {
                    var e, i, n;
                    if (t) {
                        if (t.element) return t.element;
                        if ("function" == typeof t.node) return t.node();
                        if ("number" == typeof t.nodeType) return t;
                        if (t.group) return s.node(t.group);
                        if (e = t.children) {
                            if (1 === e.length) return s.node(e[0]);
                            n = [];
                            for (var r = 0, o = e.length; o > r; r++) i = s.node(e[r]), Array.isArray(i) ? n.push.apply(n, i) : i && n.push(i);
                            return n } } }, inject: function(t, e) {
                    var i = this,
                        o = s.node(i.group || i);
                    if (t === !1) return r.remove(o), i;
                    if (!o) return i;
                    if ("string" == typeof t && (t = n.find(t)), !t) throw Error("injected node is not found");
                    if (r.inject(o, t, e), i.$emit) {
                        var a = i.parentNode,
                            _ = "after" === e || "before" === e ? t.parentNode : t;
                        i.parentNode = _, i.$emit("$inject", t, e, a) }
                    return i }, last: function(t) {
                    var e = t.children;
                    return "function" == typeof t.last ? t.last() : "number" == typeof t.nodeType ? t : e && e.length ? s.last(e[e.length - 1]) : t.group ? s.last(t.group) : void 0 }, destroy: function(t, e) {
                    if (t) {
                        if (Array.isArray(t))
                            for (var i = 0, r = t.length; r > i; i++) s.destroy(t[i], e);
                        var o = t.children;
                        if ("function" == typeof t.destroy) return t.destroy(e); "number" == typeof t.nodeType && e && n.remove(t), o && o.length && (s.destroy(o, !0), t.children = null) } } };
        n.element = function(t, e) {
            if (!t) return e ? [] : null;
            var i = s.node(t);
            if (1 === i.nodeType) return e ? [i] : i;
            for (var n = [], r = 0; r < i.length; r++) {
                var o = i[r];
                if (o && 1 === o.nodeType) {
                    if (!e) return o;
                    n.push(o) } }
            return e ? n : n[0] } }, function(t, e, i) {
        function n() {}
        var r = [].slice,
            s = i(5),
            o = { $on: function(t, e) {
                    if ("object" == typeof t)
                        for (var i in t) this.$on(i, t[i]);
                    else {
                        var n = this,
                            r = n._handles || (n._handles = {}),
                            s = r[t] || (r[t] = []);
                        s.push(e) }
                    return this }, $off: function(t, e) {
                    var i = this;
                    if (i._handles) { t || (this._handles = {});
                        var n, r = i._handles;
                        if (n = r[t]) {
                            if (!e) return r[t] = [], i;
                            for (var s = 0, o = n.length; o > s; s++)
                                if (e === n[s]) return n.splice(s, 1), i }
                        return i } }, $emit: function(t) {
                    var e, i, n, s = this,
                        o = s._handles;
                    if (t) {
                        var i = r.call(arguments, 1),
                            n = t;
                        if (!o) return s;
                        if (e = o[n.slice(1)])
                            for (var a = 0, _ = e.length; _ > a; a++) e[a].apply(s, i);
                        if (!(e = o[n])) return s;
                        for (var c = 0, _ = e.length; _ > c; c++) e[c].apply(s, i);
                        return s } }, $one: function() {} };
        s.extend(n.prototype, o), n.mixTo = function(t) { t = "function" == typeof t ? t.prototype : t, s.extend(t, o) }, t.exports = n }, function(t, e, i) {
        function n() {}
        var r = i(5),
            s = i(17).expression,
            o = i(25),
            a = o.diffArray,
            _ = o.diffObject,
            c = { $watch: function(t, e, i) {
                    var n, o, a, _, c = this.__ext__;
                    this._watchers || (this._watchers = []), i = i || {}, i === !0 && (i = { deep: !0 });
                    var h = r.uid("w_");
                    if (Array.isArray(t)) {
                        for (var u = [], l = 0, d = t.length; d > l; l++) u.push(this.$expression(t[l]).get);
                        var f = [];
                        a = function(t) {
                            for (var e = !0, i = 0, n = u.length; n > i; i++) {
                                var s = u[i](t, c);
                                r.equals(s, f[i]) || (e = !1, f[i] = r.clone(s)) }
                            return e ? !1 : f } } else "function" == typeof t ? n = t.bind(this) : (t = this._touchExpr(s(t)), n = t.get, o = t.once);
                    var m = { id: h, get: n, fn: e, once: o, force: i.force, diff: i.diff, test: a, deep: i.deep, last: i.sync ? n(this) : i.last };
                    if (this._watchers.push(m), _ = this._records && this._records.length, _ && this._records[_ - 1].push(h), i.init === !0) {
                        var p = this.$phase;
                        this.$phase = "digest", this._checkSingleWatch(m, this._watchers.length - 1), this.$phase = p }
                    return m }, $unwatch: function(t) {
                    if (t = t.uid || t, this._watchers || (this._watchers = []), Array.isArray(t))
                        for (var e = 0, i = t.length; i > e; e++) this.$unwatch(t[e]);
                    else {
                        var n, r, s = this._watchers;
                        if (!t || !s || !(r = s.length)) return;
                        for (; r--;) n = s[r], n && n.id === t && s.splice(r, 1) } }, $expression: function(t) {
                    return this._touchExpr(s(t)) }, $digest: function() {
                    if ("digest" !== this.$phase && !this._mute) { this.$phase = "digest";
                        for (var t = !1, e = 0; t = this._digest();)
                            if (++e > 20) throw Error("there may a circular dependencies reaches");
                        e > 0 && this.$emit && this.$emit("$update"), this.$phase = null } }, _digest: function() {
                    var t, e, i, n = this._watchers,
                        r = !1;
                    if (n && n.length)
                        for (var s = 0, o = n.length; o > s; s++) e = n[s], i = this._checkSingleWatch(e, s), i && (r = !0);
                    if (t = this._children, t && t.length)
                        for (var a = 0, _ = t.length; _ > a; a++) {
                            var c = t[a];
                            c && c._digest() && (r = !0) }
                    return r }, _checkSingleWatch: function(t, e) {
                    var i = !1;
                    if (t) {
                        var n, s, o, c, h, u;
                        if (t.test) {
                            var l = t.test(this);
                            l && (i = !0, t.fn.apply(this, l)) } else n = t.get(this), s = t.last, o = r.typeOf(s), c = r.typeOf(n), h = !0, u, "object" === c && "object" === o && t.deep ? (u = _(n, s, t.diff), (u === !0 || u.length) && (i = !0)) : "array" !== c || "undefined" != o && "array" !== o ? (h = r.equals(n, s), (!h || t.force) && (t.force = null, i = !0)) : (u = a(n, t.last || [], t.diff), ("array" !== o || u === !0 || u.length) && (i = !0));
                        return i && !t.test && (t.last = "object" === c && t.deep || "array" === c ? r.clone(n) : n, t.fn.call(this, n, s, u), t.once && this._watchers.splice(e, 1)), i } }, $set: function(t, e) {
                    if (null != t) {
                        var i = r.typeOf(t);
                        if ("string" === i || "expression" === t.type) t = this.$expression(t), t.set(this, e);
                        else if ("function" === i) t.call(this, this.data);
                        else
                            for (var n in t) this.$set(n, t[n]) } }, $get: function(t, e) {
                    return e && "string" == typeof t ? t : this.$expression(t).get(this) }, $update: function() {
                    var t = this;
                    do {
                        if (t.data.isolate || !t.$parent) break;
                        t = t.$parent } while (t);
                    var e = t.$phase;
                    return t.$phase = "digest", this.$set.apply(this, arguments), t.$phase = e, t.$digest(), this }, _record: function() { this._records || (this._records = []), this._records.push([]) }, _release: function() {
                    return this._records.pop() } };
        r.extend(n.prototype, c), n.mixTo = function(t) {
            return t = "function" == typeof t ? t.prototype : t, r.extend(t, c) }, t.exports = n }, function(t, e, i) {
        var n = i(1).exprCache,
            r = (i(5), i(12));
        t.exports = { expression: function(t) {
                return "string" == typeof t && (t = t.trim()) && (t = n.get(t) || n.set(t, new r(t, { mode: 2, expression: !0 }).expression())), t ? t : void 0 }, parse: function(t) {
                return new r(t).parse() } } }, function(t) {
        var e = t.exports = {};
        e.json = { get: function(t) {
                return "undefined" != typeof JSON ? JSON.stringify(t) : t }, set: function(t) {
                return "undefined" != typeof JSON ? JSON.parse(t) : t } }, e.last = function(t) {
            return t && t[t.length - 1] }, e.average = function(t, i) {
            return t = t || [], t.length ? e.total(t, i) / t.length : 0 }, e.total = function(t, e) {
            var i = 0;
            if (t) return t.forEach(function(t) { i += e ? t[e] : t }), i } }, function(t) {
        function e(t, e) {
            for (var i in e) void 0 === t[i] && (t[i] = e[i]);
            return e }
        var i = [].slice,
            n = {}.toString;
        t.exports = function() {
            e(String.prototype, { trim: function() {
                    return this.replace(/^\s+|\s+$/g, "") } }), e(Array.prototype, {
                indexOf: function(t, e) { e = e || 0;
                    for (var i = e, n = this.length; n > i; i++)
                        if (this[i] === t) return i;
                    return -1 },
                forEach: function(t, e) {
                    var i = 0,
                        n = Object(this),
                        r = n.length >>> 0;
                    if ("function" != typeof t) throw new TypeError(t + " is not a function");
                    for (; r > i;) {
                        var s;
                        i in n && (s = n[i], t.call(e, s, i, n)), i++ } },
                filter: function(t, e) {
                    var i = Object(this),
                        n = i.length >>> 0;
                    if ("function" != typeof t) throw new TypeError;
                    for (var r = [], s = 0; n > s; s++)
                        if (s in i) {
                            var o = i[s];
                            t.call(e, o, s, i) && r.push(o) }
                    return r
                }
            }), e(Function.prototype, { bind: function(t) {
                    var e = this,
                        n = i.call(arguments, 1);
                    return function() {
                        var r = n.concat(i.call(arguments));
                        return e.apply(t, r) } } }), e(Array, { isArray: function(t) {
                    return "[object Array]" === n.call(t) } })
        }
    }, function(t) {
        var e = { quot: 34, amp: 38, apos: 39, lt: 60, gt: 62, nbsp: 160, iexcl: 161, cent: 162, pound: 163, curren: 164, yen: 165, brvbar: 166, sect: 167, uml: 168, copy: 169, ordf: 170, laquo: 171, not: 172, shy: 173, reg: 174, macr: 175, deg: 176, plusmn: 177, sup2: 178, sup3: 179, acute: 180, micro: 181, para: 182, middot: 183, cedil: 184, sup1: 185, ordm: 186, raquo: 187, frac14: 188, frac12: 189, frac34: 190, iquest: 191, Agrave: 192, Aacute: 193, Acirc: 194, Atilde: 195, Auml: 196, Aring: 197, AElig: 198, Ccedil: 199, Egrave: 200, Eacute: 201, Ecirc: 202, Euml: 203, Igrave: 204, Iacute: 205, Icirc: 206, Iuml: 207, ETH: 208, Ntilde: 209, Ograve: 210, Oacute: 211, Ocirc: 212, Otilde: 213, Ouml: 214, times: 215, Oslash: 216, Ugrave: 217, Uacute: 218, Ucirc: 219, Uuml: 220, Yacute: 221, THORN: 222, szlig: 223, agrave: 224, aacute: 225, acirc: 226, atilde: 227, auml: 228, aring: 229, aelig: 230, ccedil: 231, egrave: 232, eacute: 233, ecirc: 234, euml: 235, igrave: 236, iacute: 237, icirc: 238, iuml: 239, eth: 240, ntilde: 241, ograve: 242, oacute: 243, ocirc: 244, otilde: 245, ouml: 246, divide: 247, oslash: 248, ugrave: 249, uacute: 250, ucirc: 251, uuml: 252, yacute: 253, thorn: 254, yuml: 255, fnof: 402, Alpha: 913, Beta: 914, Gamma: 915, Delta: 916, Epsilon: 917, Zeta: 918, Eta: 919, Theta: 920, Iota: 921, Kappa: 922, Lambda: 923, Mu: 924, Nu: 925, Xi: 926, Omicron: 927, Pi: 928, Rho: 929, Sigma: 931, Tau: 932, Upsilon: 933, Phi: 934, Chi: 935, Psi: 936, Omega: 937, alpha: 945, beta: 946, gamma: 947, delta: 948, epsilon: 949, zeta: 950, eta: 951, theta: 952, iota: 953, kappa: 954, lambda: 955, mu: 956, nu: 957, xi: 958, omicron: 959, pi: 960, rho: 961, sigmaf: 962, sigma: 963, tau: 964, upsilon: 965, phi: 966, chi: 967, psi: 968, omega: 969, thetasym: 977, upsih: 978, piv: 982, bull: 8226, hellip: 8230, prime: 8242, Prime: 8243, oline: 8254, frasl: 8260, weierp: 8472, image: 8465, real: 8476, trade: 8482, alefsym: 8501, larr: 8592, uarr: 8593, rarr: 8594, darr: 8595, harr: 8596, crarr: 8629, lArr: 8656, uArr: 8657, rArr: 8658, dArr: 8659, hArr: 8660, forall: 8704, part: 8706, exist: 8707, empty: 8709, nabla: 8711, isin: 8712, notin: 8713, ni: 8715, prod: 8719, sum: 8721, minus: 8722, lowast: 8727, radic: 8730, prop: 8733, infin: 8734, ang: 8736, and: 8743, or: 8744, cap: 8745, cup: 8746, "int": 8747, there4: 8756, sim: 8764, cong: 8773, asymp: 8776, ne: 8800, equiv: 8801, le: 8804, ge: 8805, sub: 8834, sup: 8835, nsub: 8836, sube: 8838, supe: 8839, oplus: 8853, otimes: 8855, perp: 8869, sdot: 8901, lceil: 8968, rceil: 8969, lfloor: 8970, rfloor: 8971, lang: 9001, rang: 9002, loz: 9674, spades: 9824, clubs: 9827, hearts: 9829, diams: 9830, OElig: 338, oelig: 339, Scaron: 352, scaron: 353, Yuml: 376, circ: 710, tilde: 732, ensp: 8194, emsp: 8195, thinsp: 8201, zwnj: 8204, zwj: 8205, lrm: 8206, rlm: 8207, ndash: 8211, mdash: 8212, lsquo: 8216, rsquo: 8217, sbquo: 8218, ldquo: 8220, rdquo: 8221, bdquo: 8222, dagger: 8224, Dagger: 8225, permil: 8240, lsaquo: 8249, rsaquo: 8250, euro: 8364 };
        t.exports = e }, function(t, e, i) {
        function n(t) {
            var e, i = 0,
                n = 0,
                s = 0,
                o = 0,
                a = 0,
                _ = 5 / 3;
            return window.getComputedStyle && (e = window.getComputedStyle(t), n = r(e[u + "Duration"]) || n, s = r(e[u + "Delay"]) || s, o = r(e[l + "Duration"]) || o, a = r(e[l + "Delay"]) || a, i = Math.max(n + s, o + a)), 1e3 * i * _ }

        function r(t) {
            var e, i = 0;
            return t ? (t.split(",").forEach(function(t) { e = parseFloat(t), e > i && (i = e) }), i) : 0 }
        var s = i(5),
            o = i(4),
            a = {},
            _ = i(1),
            c = "transitionend",
            h = "animationend",
            u = "transition",
            l = "animation"; "ontransitionend" in window || ("onwebkittransitionend" in window ? (c += " webkitTransitionEnd", u = "webkitTransition") : ("onotransitionend" in o.tNode || "Opera" === navigator.appName) && (c += " oTransitionEnd", u = "oTransition")), "onanimationend" in window || ("onwebkitanimationend" in window ? (h += " webkitAnimationEnd", l = "webkitAnimation") : "onoanimationend" in o.tNode && (h += " oAnimationEnd", l = "oAnimation")), a.inject = function(t, e, i, n) {
            if (n = n || s.noop, Array.isArray(t)) {
                for (var r = o.fragment(), a = 0, _ = 0, c = t.length; c > _; _++) r.appendChild(t[_]);
                o.inject(r, e, i);
                var h = function() { a++, a === c && n() };
                for (c === a && n(), _ = 0; c > _; _++) t[_].onenter ? t[_].onenter(h) : h() } else o.inject(t, e, i), t.onenter ? t.onenter(n) : n() }, a.remove = function(t, e) {
            function i() { n++, n === s && e && e() }
            if (t) {
                var n = 0;
                if (Array.isArray(t)) {
                    for (var r = 0, s = t.length; s > r; r++) a.remove(t[r], i);
                    return t }
                t.onleave ? t.onleave(function() { d(t, e) }) : d(t, e) } };
        var d = function(t, e) { o.remove(t), e && e() };
        a.startClassAnimate = function(t, e, i, r) {
            var a, u, l, d;
            return !h && !c || _.isRunning ? i() : (d = s.once(4 !== r ? function() { l && clearTimeout(l), 2 === r && o.delClass(t, a), 3 !== r && o.delClass(t, e), o.off(t, h, d), o.off(t, c, d), i() } : function() { l && clearTimeout(l), i() }), 2 === r ? (o.addClass(t, e), a = s.map(e.split(/\s+/), function(t) {
                return t + "-active" }).join(" "), o.nextReflow(function() { o.addClass(t, a), u = n(t), l = setTimeout(d, u) })) : o.nextReflow(4 === r ? function() { o.delClass(t, e), u = n(t), l = setTimeout(d, u) } : function() { o.addClass(t, e), u = n(t), l = setTimeout(d, u) }), o.on(t, h, d), o.on(t, c, d), d) }, a.startStyleAnimate = function(t, e, i) {
            var r, a, _;
            return o.nextReflow(function() { o.css(t, e), r = n(t), _ = setTimeout(a, r) }), a = s.once(function() { _ && clearTimeout(_), o.off(t, h, a), o.off(t, c, a), i() }), o.on(t, h, a), o.on(t, c, a), a }, t.exports = a }, function(t) { t.exports = { COMPONENT_TYPE: 1, ELEMENT_TYPE: 2 } }, function(t, e, i) {
        function n(t, e, i) {
            if (i)
                for (var n, r = t.target; r && r !== i;) {
                    for (var s = 0, o = e.length; o > s; s++) n = e[s], n && n.element === r && n.fire(t);
                    r = r.parentNode } }
        var r = i(5),
            s = i(4),
            o = i(3);
        o._addProtoInheritCache("event"), o.directive(/^on-\w+$/, function(t, e, i, n) {
            if (i && e) {
                var r = i.split("-")[1];
                return this._handleEvent(t, r, e, n) } }), o.directive(/^(delegate|de)-\w+$/, function(t, e, i) {
            function o(t) { n(t, _[c], a.parentNode) }
            var a = this.$root,
                _ = a._delegates || (a._delegates = {});
            if (i && e) {
                var c = i.split("-")[1],
                    h = r.handleEvent.call(this, e, c);
                _[c] || (_[c] = [], a.parentNode ? s.on(a.parentNode, c, o) : a.$on("$inject", function(t, e, i) {
                    var n = this.parentNode;
                    i && s.off(i, c, o), n && s.on(this.parentNode, c, o) }), a.$on("$destroy", function() { a.parentNode && s.off(a.parentNode, c, o), _[c] = null }));
                var u = { element: t, fire: h };
                return _[c].push(u),
                    function() {
                        var t = _[c];
                        if (t && t.length)
                            for (var e = 0, i = t.length; i > e; e++) t[e] === u && t.splice(e, 1) } } }) }, function(t, e, i) {
        function n(t, e) {
            function i() { e.set(n, this.value), r.last = this.value, n.$update() }
            var n = this,
                r = this.$watch(e, function(e) {
                    var i = a.slice(t.getElementsByTagName("option"));
                    i.forEach(function(i, n) { i.value == e && (t.selectedIndex = n) }) });
            return _.on(t, "change", i), void 0 === e.get(n) && t.value && e.set(n, t.value),
                function() { _.off(t, "change", i) } }

        function r(t, e) {
            var i = this,
                n = this.$watch(e, function(e) { t.value !== e && (t.value = null == e ? "" : "" + e) }),
                r = function(t) {
                    var r = this;
                    if ("cut" === t.type || "paste" === t.type) a.nextTick(function() {
                        var t = r.value;
                        e.set(i, t), n.last = t, i.$update() });
                    else {
                        var s = r.value;
                        e.set(i, s), n.last = s, i.$update() } };
            return 9 !== _.msie && "oninput" in _.tNode ? t.addEventListener("input", r) : (_.on(t, "paste", r), _.on(t, "keyup", r), _.on(t, "cut", r), _.on(t, "change", r)), void 0 === e.get(i) && t.value && e.set(i, t.value),
                function() { 9 !== _.msie && "oninput" in _.tNode ? t.removeEventListener("input", r) : (_.off(t, "paste", r), _.off(t, "keyup", r), _.off(t, "cut", r), _.off(t, "change", r)) } }

        function s(t, e) {
            var i = this,
                n = this.$watch(e, function(e) { _.attr(t, "checked", !!e) }),
                r = function() {
                    var t = this.checked;
                    e.set(i, t), n.last = t, i.$update() };
            return e.set && _.on(t, "change", r), void 0 === e.get(i) && e.set(i, !!t.checked),
                function() { e.set && _.off(t, "change", r) } }

        function o(t, e) {
            var i = this,
                n = (this.$watch(e, function(e) { t.checked = e == t.value ? !0 : !1 }), function() {
                    var t = this.value;
                    e.set(i, t), i.$update() });
            return e.set && _.on(t, "change", n), void 0 === e.get(i) && t.checked && e.set(i, t.value),
                function() { e.set && _.off(t, "change", n) } }
        var a = i(5),
            _ = i(4),
            c = i(3),
            h = { text: r, select: n, checkbox: s, radio: o };
        c.directive("r-model", function(t, e) {
            var i = t.tagName.toLowerCase(),
                n = i;
            return "input" === n ? n = t.type || "text" : "textarea" === n && (n = "text"), "string" == typeof e && (e = this.$expression(e)), h[n] ? h[n].call(this, t, e) : "input" === i ? h.text.call(this, t, e) : void 0 }) }, function(t, e, i) {
        function n(t, e) {
            var i = t.length,
                n = e.length;
            if (i !== n) return !0;
            for (var r = 0; i > r; r++)
                if (t[r] !== e[r]) return !0;
            return !1 }

        function r(t, e) {
            return t === e }

        function s(t, e, i) {
            for (var n = t.length, s = e.length, i = i || r, o = [], a = 0; n >= a; a++) o.push([a]);
            for (var _ = 1; s >= _; _++) o[0][_] = _;
            for (var a = 1; n >= a; a++)
                for (var _ = 1; s >= _; _++) o[a][_] = i(t[a - 1], e[_ - 1]) ? o[a - 1][_ - 1] : Math.min(o[a - 1][_] + 1, o[a][_ - 1] + 1);
            return o }

        function o(t, e, i, r) {
            if (!i) return n(t, e);
            for (var o = s(e, t, r), a = e.length, _ = a, c = t.length, h = c, u = [], l = o[_][h]; _ > 0 || h > 0;)
                if (0 !== _)
                    if (0 !== h) {
                        var d = o[_ - 1][h - 1],
                            f = o[_ - 1][h],
                            m = o[_][h - 1],
                            p = Math.min(m, f, d);
                        p === f ? (u.unshift(2), _--, l = f) : p === d ? (d === l ? u.unshift(0) : (u.unshift(1), l = d), _--, h--) : (u.unshift(3), h--, l = m) } else u.unshift(2), _--;
            else u.unshift(3), h--;
            var g = 0,
                v = 3,
                y = 2,
                b = 1,
                a = 0;
            c = 0;
            for (var $ = [], x = { index: null, add: 0, removed: [] }, _ = 0; _ < u.length; _++) switch (u[_] > 0 ? null === x.index && (x.index = c) : null != x.index && ($.push(x), x = { index: null, add: 0, removed: [] }), u[_]) {
                case g:
                    a++, c++;
                    break;
                case v:
                    x.add++, c++;
                    break;
                case y:
                    x.removed.push(e[a]), a++;
                    break;
                case b:
                    x.add++, x.removed.push(e[a]), a++, c++ }
            return null != x.index && $.push(x), $ }

        function a(t, e, i) {
            if (i) {
                var n = _.keys(t),
                    r = _.keys(e);
                return o(n, r, i, function(i, n) {
                    return t[n] === e[i] }) }
            for (var s in t)
                if (e[s] !== t[s]) return !0;
            for (var a in e)
                if (e[a] !== t[a]) return !0;
            return !1 }
        var _ = i(5);
        t.exports = { diffArray: o, diffObject: a } }, function(t) { t.exports = { element: function(t, e, i) {
                return { type: "element", tag: t, attrs: e, children: i } }, attribute: function(t, e, i) {
                return { type: "attribute", name: t, value: e, mdf: i } }, "if": function(t, e, i) {
                return { type: "if", test: t, consequent: e, alternate: i } }, list: function(t, e, i, n, r) {
                return { type: "list", sequence: t, alternate: n, variable: e, body: i, track: r } }, expression: function(t, e, i) {
                return { type: "expression", body: t, constant: i || !1, setbody: e || !1 } }, text: function(t) {
                return { type: "text", text: t } }, template: function(t) {
                return { type: "template", content: t } } } }])
});
I$(94, function(t, e, i, n, r, s, o, a, _, c, h) {
    var u = function(t, e) { e.data["MGID"] = window.mgid;
        o._$postMessage(t, e) };
    var l = function() {
        var t = document.body.scrollWidth,
            e = document.body.clientHeight,
            i = { width: t, height: e, type: "resize" };
        if (t * e > 0) { i["URS-CM"] = 1;
            u("_parent", { data: i }) } };
    var d = Regular.extend({
        data: {},
        config: function(t) {
            e._$merge(this.data, t || {});
            this.supr(t);
            if (this.data.productKey) this.data.productkey = this.data.productKey;
        },
        init: function(t) { this.supr(t) },
        _findErrorIndex: function() {
            var t = 100;
            e._$forIn(this.errorIndexMap, function(e, i) {
                if (e <= t && e >= 0) t = e }._$bind(this));
            this.errorIndex = t },
        _addIframe: function(t, e) {
            if ("https:" == location.protocol) e = e.replace("http:", "https:");
            var n = e.indexOf("zc.reg.163.com") == -1;
            if (n) n = e.indexOf("/zc/") == -1;
            if (n) e = s._$addPathB(e);
            var r = i._$createXFrame({ src: e, parent: document.body, visible: !1, onload: function() { this.__iframeIndex++;
                    if (this.__ifarmeSize == this.__iframeIndex) { this.__iframeCt = clearTimeout(this.__iframeCt);
                        u("_parent", { data: t }) } }._$bind(this) }) },
        _$setDomains: function(t) {
            var i = t || {};
            i["URS-CM"] = 1;
            this.__iframeIndex = 0;
            var n = i.nextUrls || [];
            this.__ifarmeSize = n.length || 0;
            if (this.__ifarmeSize > 0) this.__iframeCt = setTimeout(function() { u("_parent", { data: i }) }._$bind(this), 5e3);
            else u("_parent", { data: i });
            e._$forEach(n, this._addIframe._$bind(this, i)) },
        _$doShowError: function(t) {
            var e = t.type || "",
                n = t.target,
                o = i._$get(t.node),
                a = t.str || "请求错误",
                _ = i._$get("cnt-box-parent"),
                c = t.tabIndex;
            if (1 != window._$needCookieSet || a.indexOf("开启浏览器cookies") != -1)
                if (!(a.indexOf("网络不好") >= 0)) setTimeout(function() {
                    var t = n && s._$getParent(n, "inputbox");
                    if (t) i._$addClassName(t, "error-color");
                    this.errorIndexMap[c] = c;
                    if (o && (this.errorIndex == -1 || c <= this.errorIndex)) { this.errorIndex = c;
                        o.innerHTML = r._$get("error-tmp", { str: a || "", type: e });
                        o.className = "m-nerror" }
                    i._$addClassName(_, "haserr");
                    l() }._$bind(this), 100);
                else { s._$showFail(-1);
                    l() } },
        _$removeError: function(t) {
            var e = i._$get("cnt-box-parent"),
                n = t.target,
                r = n && s._$getParent(n, "inputbox"),
                o = i._$get(t.node),
                a = t.tabIndex;
            if (!window._$needCookieSet) setTimeout(function() {
                if (r) i._$delClassName(r, "error-color");
                if (this.errorIndex == a || this.errorIndex == -1) i._$addClassName(o, "f-dn");
                delete this.errorIndexMap[a];
                this._findErrorIndex();
                i._$delClassName(e, "haserr");
                l() }._$bind(this), 100) },
        _$resize: function() { l() }
    });
    return d
}, 3, 4, 2, 93, 19, 11, 10);
    return r });
I$(95, function(t, e, i, n) {
    var r = { "mb-ini-433": "系统繁忙，请刷新页面重试", "mb-ini-401": "操作超时，请刷新页面重试", "mb-ini--1": "网络不好，请刷新页面重试", "mb-ini--2": "网络不好，请刷新页面重试", "mb-ini-404": "网络不好，请刷新页面重试", "mb-ini-500": "系统繁忙，请您稍后再试", "mb-ini-0": "网络不好，请刷新页面重试", "mb-gt-401": "操作超时，请刷新页面重试", "mb-gt--1": "网络不好，请刷新页面重试", "mb-gt--2": "网络不好，请刷新页面重试", "mb-gt-404": "网络不好，请刷新页面重试", "mb-gt-500": "系统繁忙，请您稍后再试", "mb-gt-0": "网络不好，请刷新页面重试", "mb-vfcp-442": "请输入正确的验证码", "mb-vfcp-401": "操作超时，请刷新页面重试", "mb-vfcp-441": "请输入图片验证码", "mb-vfcp-444": "请滑动验证码", "mb-vfcp-445": "请点击验证码", "mb-vfcp--1": "网络不好，请刷新页面重试", "mb-vfcp--2": "网络不好，请刷新页面重试", "mb-vfcp-404": "网络不好，请刷新页面重试", "mb-vfcp-500": "系统繁忙，请您稍后再试", "mb-vfcp-0": "网络不好，请刷新页面重试", "mb-vfcp-505": "次数超限，请稍候再试", "mb-vftcp-442": "请输入正确的验证码", "mb-vftcp-401": "操作超时，请刷新页面重试", "mb-vftcp-441": "请输入图片验证码", "mb-vftcp-444": "请滑动验证码", "mb-vftcp-445": "请点击验证码", "mb-vftcp--1": "网络不好，请刷新页面重试", "mb-vftcp--2": "网络不好，请刷新页面重试", "mb-vftcp-404": "网络不好，请刷新页面重试", "mb-vftcp-500": "系统繁忙，请您稍后再试", "mb-vftcp-0": "网络不好，请刷新页面重试", "mb-vftcp-505": "次数超限，请稍候再试", "mb-vfccp-442": "请输入正确的验证码", "mb-vfccp-401": "操作超时，请刷新页面重试", "mb-vfccp-441": "请输入图片验证码", "mb-vfccp-444": "请滑动验证码", "mb-vfccp-445": "请点击验证码", "mb-vfccp--1": "网络不好，请刷新页面重试", "mb-vfccp--2": "网络不好，请刷新页面重试", "mb-vfccp-404": "网络不好，请刷新页面重试", "mb-vfccp-500": "系统繁忙，请您稍后再试", "mb-vfccp-0": "网络不好，请刷新页面重试", "mb-vfccp-505": "次数超限，请稍候再试", "mb-login-401": "操作超时，请刷新页面重试", "mb-login-409": "您的操作太频繁，请稍后再试", "mb-login-413": "帐号或密码错误", "mb-login-402": "当前网络异常，请检查您的网络环境", "mb-login-433": "系统繁忙，请刷新页面重试", "mb-login-410": "超过IP限制，请稍候再试", "mb-login-420": "帐号不存在", "mb-login-422": '该帐号已被锁定，请使用<a target="_blank" href="https://id.163.com/gj/" style="color:#4aafe9;text-decoration:underline;">网易帐号管家</a>尝试解锁。', "mb-login-602": "该帐号已被冻结", "mb-login-609": "请通过手机短信登录", "mb-login-635": "该帐号在考察期内，请24小时以后再尝试", "mb-login-41201": "您登录错误次数过多，请稍后再试", "mb-login-41202": "您登录错误次数过多，请明天再试", "mb-login-41301": "您登录错误密码次数过多，请稍后再试", "mb-login-41302": "您登录错误密码次数过多，请明天再试", "mb-login-41303": "您的IP登录错误密码次数过多，请稍后再试", "mb-login-41401": "您的IP登录错误次数过多，请稍后再试", "mb-login-41402": "您的IP登录错误次数过多，请明天再试", "mb-login-41701": "您的IP登录成功次数过多，请稍后后再试", "mb-login-41702": "您的IP登录成功次数过多，请明天再试", "mb-login-41801": "您登录成功次数过多，请稍后再试", "mb-login-41802": "您登录成功次数过多，请明天再试", "mb-login-416": "您的IP登录过于频繁，请稍后再试", "mb-login-41901": "您登录过于频繁，请稍后再试", "mb-login-41902": "您的IP登录过于频繁，请稍后再试", "mb-login-441": "请输入图片验证码", "mb-login-444": "请滑动验证码", "mb-login-445": "请点击验证码", "mb-login-40107": '请设置<a target="_blank" href="https://www.baidu.com/s?wd=safari%E5%BC%80%E5%90%AFcookie">浏览器接受第三方cookie</a>，或者更换浏览器尝试', "mb-login--1": "网络不好，请刷新页面重试", "mb-login--2": "网络不好，请刷新页面重试", "mb-login-404": "网络不好，请刷新页面重试", "mb-login-500": "系统繁忙，请您稍后再试", "mb-login-503": "服务器繁忙，请稍候再试", "mb-login-0": "网络不好，请刷新页面重试", "mb-lvfsms-635": "该帐号在考察期内，请24小时以后再尝试", "mb-lvfsms-443": "请输入正确的短信验证码", "mb-lvfsms-409": "您的操作太频繁，请稍后再试", "mb-lvfsms-410": "超过IP限制，请稍候再试", "mb-lvfsms-441": "请输入图片验证码", "mb-lvfsms-444": "请滑动验证码", "mb-lvfsms-445": "请点击验证码", "mb-lvfsms-412": "验证码发送超过限制，请改天再试", "mb-lvfsms-41201": "您登录错误次数过多，请稍后再试", "mb-lvfsms-41202": "您登录错误次数过多，请明天再试", "mb-lvfsms-41301": "您登录错误验证码次数过多，请稍后再试", "mb-lvfsms-41302": "您登录错误验证码次数过多，请明天再试", "mb-lvfsms-41303": "您的IP登录错误验证码次数过多，请稍后再试", "mb-lvfsms-41401": "您的IP登录错误次数过多，请稍后再试", "mb-lvfsms-41402": "您的IP登录错误次数过多，请明天再试", "mb-lvfsms-41701": "您的IP登录成功次数过多，请稍后后再试", "mb-lvfsms-41702": "您的IP登录成功次数过多，请明天再试", "mb-lvfsms-41801": "您登录成功次数过多，请稍后再试", "mb-lvfsms-41802": "您登录成功次数过多，请明天再试", "mb-lvfsms-416": "您的IP登录过于频繁,请稍后再试", "mb-lvfsms-41901": "您登录过于频繁，请稍后再试", "mb-lvfsms-41902": "您的IP登录过于频繁，请稍后再试", "mb-lvfsms-420": "帐号不存在", "mb-lvfsms-422": '该帐号已被锁定，请使用<a target="_blank" href="https://id.163.com/gj/" style="color:#4aafe9;text-decoration:underline;">网易帐号管家</a>尝试解锁。', "mb-lvfsms-602": "该帐号已被冻结", "mb-lvfsms-402": "当前网络异常，请检查您的网络环境", "mb-lvfsms-401": "操作超时，请刷新页面重试", "mb-lvfsms--1": "网络不好，请刷新页面重试", "mb-lvfsms--2": "网络不好，请刷新页面重试", "mb-lvfsms-404": "网络不好，请刷新页面重试", "mb-lvfsms-500": "系统繁忙，请您稍后再试", "mb-lvfsms-0": "网络不好，请刷新页面重试", "mb-sms-lsm-10710": "请输入图片验证码", "mb-sms-lsm-635": "该帐号在考察期内，请24小时以后再尝试", "mb-sms-lsm-407": "该帐号已注册", "mb-sms-lsm-410": "超过IP限制，请稍候再试", "mb-sms-lsm-412": "验证码错误超过限制，请稍后再试", "mb-sms-lsm-413": "验证码发送超过限制，请改天再试", "mb-sms-lsm-441": "请输入图片验证码", "mb-sms-lsm-444": "请滑动验证码", "mb-sms-lsm-445": "请点击验证码", "mb-sms-lsm-420": "帐号不存在", "mb-sms-lsm-442": "请输入正确的验证码", "mb-sms-lsm-422": '该帐号已被锁定，请使用<a target="_blank" href="https://id.163.com/gj/" style="color:#4aafe9;text-decoration:underline;">网易帐号管家</a>尝试解锁。', "mb-sms-lsm-602": "该帐号已被冻结", "mb-sms-lsm-401": "操作超时，请刷新页面重试", "mb-sms-lsm--1": "网络不好，请刷新页面重试", "mb-sms-lsm--2": "网络不好，请刷新页面重试", "mb-sms-lsm-404": "网络不好，请刷新页面重试", "mb-sms-lsm-500": "系统繁忙，请您稍后再试", "mb-sms-lsm-0": "网络不好，请刷新页面重试", "mb-sms-lsm-505": "次数超限，请稍候再试", "mb-reg-sm-10700": "请输入图片验证码", "mb-reg-sm-10704": "请滑动验证码", "mb-reg-sm-10705": "请点击验证码", "mb-reg-sm-407": "该帐号已注册", "mb-reg-sm-410": "超过IP限制，请稍候再试", "mb-reg-sm-108": "请输入正确的验证码", "mb-reg-sm-109": "请滑动验证码", "mb-reg-sm-110": "请点击验证码", "mb-reg-sm-441": "请输入图片验证码", "mb-reg-sm-444": "请滑动验证码", "mb-reg-sm-445": "请点击验证码", "mb-reg-sm-41201": "验证码发送超过限制，请改天再试", "mb-reg-sm-41202": "验证码错误超过限制，请稍后再试", "mb-reg-sm-401": "操作超时，请刷新页面重试", "mb-reg-sm--1": "网络不好，请刷新页面重试", "mb-reg-sm--2": "网络不好，请刷新页面重试", "mb-reg-sm-404": "网络不好，请刷新页面重试", "mb-reg-sm-500": "系统繁忙，请您稍后再试", "mb-reg-sm-0": "网络不好，请刷新页面重试", "mb-reg-sm-433": "系统繁忙，请刷新页面重试", "mb-reg-sm-635": "该帐号在考察期内，请24小时以后再尝试", "mb-reg-vfsms-402": "当前网络异常，请检查您的网络环境", "mb-reg-vfsms-409": "您的操作太频繁，请稍后再试", "mb-reg-vfsms-410": "超过IP限制，请稍候再试", "mb-reg-vfsms-407": "该帐号已注册", "mb-reg-vfsms-412": "验证码发送超过限制，请改天再试", "mb-reg-vfsms-413": "请输入正确的验证码", "mb-reg-vfsms-401": "操作超时，请刷新页面重试", "mb-reg-vfsms--1": "网络不好，请刷新页面重试", "mb-reg-vfsms--2": "网络不好，请刷新页面重试", "mb-reg-vfsms-404": "网络不好，请刷新页面重试", "mb-reg-vfsms-500": "系统繁忙，请您稍后再试", "mb-reg-vfsms-635": "该帐号在考察期内，请24小时以后再尝试", "mb-reg-vfsms-0": "网络不好，请刷新页面重试", "mb-reg-vfsms-433": "系统繁忙，请刷新页面重试", "mb-reg-ini-433": "系统繁忙，请刷新页面重试", "mb-reg-ini-401": "操作超时，请刷新页面重试", "mb-reg-ini--1": "网络不好，请刷新页面重试", "mb-reg-ini--2": "网络不好，请刷新页面重试", "mb-reg-ini-404": "网络不好，请刷新页面重试", "mb-reg-ini-500": "系统繁忙，请您稍后再试", "mb-reg-ini-0": "网络不好，请刷新页面重试", "mb-reg-chn-407": "该帐号已注册", "mb-reg-chn-409": "您的操作太频繁，请稍后再试", "mb-reg-chn-410": "超过IP限制，请稍候再试", "mb-reg-chn-401": "操作超时，请刷新页面重试", "mb-reg-chn-422": "该帐号已被冻结", "mb-reg-chn--1": "网络不好，请刷新页面重试", "mb-reg-chn--2": "网络不好，请刷新页面重试", "mb-reg-chn-404": "网络不好，请刷新页面重试", "mb-reg-chn-500": "系统繁忙，请您稍后再试", "mb-reg-chn-0": "网络不好，请刷新页面重试", "mb-reg-chn-504": "次数超限，请稍候再试", "mb-reg-chn-505": "次数超限，请稍候再试" };
I$(73, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d) {
    var f = o.extend({
        data: {},
        config: function(t) { e._$merge(this.data, t || {});
            this.supr(t) },
        init: function(t) { this.errorIndex = -1;
            this.errorIndexMap = {};
            if (this.data.noqr) {
                var e = i._$getByClassName(document, "j-btnqrcode")[0];
                i._$addClassName(e, "f-dn") }
            this.supr(t) },
        doEnter: function(t) {
            var e = t.keyCode;
            if (13 == e) i._$get("submitBtn").click() },
        getSlideTarget: function() {
            return this.data.slideTarget },
        getUn: function() {
            return this.$refs.mninput._$getValue().trim() },
        iniSuccess: function(t) {
            if (this.$refs) { this.data.initSuccess = 1;
                if (!this.__errMsg && t.dlapp) {
                    var e = { tabIndex: -1, str: '<a target="_blank" href="https://id.163.com/gj">网易帐号管家</a>，<span style="color:#000;">有效防止被盗<span>', node: "nerror", type: 3 };
                    this._$doShowError(e) }
                var i = t.capFlag || t.cf;
                if (1 == i) { this.data.hasImgCap = 1;
                    this.data.hasSlide = 0 }
                if (4 == i || 5 == i) { this.data.hasSlide = 1;
                    this.data.hasImgCap = 0;
                    this.data.slideTarget = 4 == i ? 2 : 3 }
                var n = c._$cookie("regmbcookiename");
                var r = c._$cookie("THE_LAST_LOGIN_MOBILE");
                if (n && "login" == this.data.module) { this.$refs.mninput._$setValue(n);
                    c._$cookie("regmbcookiename", "") } else if (r && "login" == this.data.module) this.$refs.mninput._$setValue(r);
                this.$update();
                setTimeout(function() {
                    if (this.data.focusHelper) this.$refs.mninput._$focusHelper();
                    this._$resize() }._$bind(this), 200) } },
        iniError: function(t, e) {
            var i = e.ret,
                n;
            if (window._$needUrsBgp)
                if (!this.tmpChannel && ("-2" == i || "-1" == i || "0" == i)) { this.tmpChannel = 1;
                    window._$BGP = 1;
                    setTimeout(this.doInit._$bind(this), 200);
                    return }
            if ("-401" != i) {
                if ("401" == i) i = t + e.ret;
                else i = t + e.ret + (e.dt || "");
                var r = { tabIndex: -1, str: _[i] || s._$getErrorTxt(e.ret), node: "nerror" };
                this._$doShowError(r) } else { n = 1 == this.data.channel ? "登录" : "注册";
                this._$doShowError({ tabIndex: -1, str: "无法" + n + '，请<a style="color:#4aafe9;" target="_blank" href="https://www.baidu.com/s?wd=%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%80%E5%90%AFcookies">开启浏览器cookies</a>或更换浏览器后刷新重试', node: "nerror" });
                window._$needCookieSet = 1 } },
        doClick: function(e) {
            var n = t._$getElement(e),
                r = i._$dataset(n, "link");
            if (r) s._$doThirdLogin(e)
        },
        doInit: function() {
            var t = {};
            t.pd = this.data.product;
            t.pkid = this.data.promark;
            t.pkht = this.data.host;
            t.channel = this.data.channel;
            this.data.initSuccess = 0;
            a._$request("mb-ini", t, this.iniSuccess._$bind(this), this.iniError._$bind(this, "mb-ini-"), 1) },
        __getUserName: function() {
            return { username: this.__username } },
        loginSuccess: function(t, e) {
            var i = this.__getUserName();
            var n = t ? "密码方式" : "验证码方式";
            this.__getTicketLock = 0;
            _gaq.push(["_trackEvent", "手机帐号登录", "登录成功", n + "###" + JSON.stringify(i)]);
            c._$cookie("THE_LAST_LOGIN_MOBILE", { value: this.__username, expires: 30 });
            this._$setDomains({ type: "success", username: this.__username || "", nextUrls: e.nextUrls }) },
        onShowErr: function(t, e, i) {
            var n = t.ret;
            var r = { tabIndex: e || -1, str: _[n] || s._$getErrorTxt(t.ret), node: "nerror", type: i || "" };
            this._$doShowError(r) },
        doRefreshCap: function(t) { t = t || {};
            this.refreshCaps(null, t.code) },
        doRefreshCaps: function(t, e) {
            if ("mb-lvfsms-" != t) {
                if (this.data.hasImgCap && "411" != e) this.$refs.captcha._$refreshImg();
                if (this.data.hasSlide) this.$refs.slidecap._$refreshSlide(e) }
            this.$update() },
        refreshCaps: function(t, e) {
            if ("441" != e)
                if ("444" != e && "445" != e) this.doRefreshCaps(t, e);
                else {
                    if (this.$refs.captcha) this.$refs.captcha.destroy();
                    this.$refs.captcha = null;
                    delete this.$refs.captcha;
                    if (this.data.hasSlide) { this.doRefreshCaps(t, e);
                        return }
                    if ("444" == e) this.data.slideTarget = 2;
                    if ("445" == e) this.data.slideTarget = 3;
                    this.data.hasSlide = 1;
                    this.data.hasImgCap = 0;
                    this.$update() }
            else {
                if (this.$refs.slidecap) this.$refs.slidecap.destroy();
                this.$refs.slidecap = null;
                delete this.$refs.slidecap;
                if (this.data.hasImgCap) { this.doRefreshCaps(t, e);
                    return }
                this.data.hasImgCap = 1;
                this.data.hasSlide = 0;
                this.$update() } },
        loginError: function(t, e) {
            var i = -1,
                n, r;
            var s = e.ret;
            var o = this.__getUserName();
            this.__getTicketLock = 0;
            if ("mb-login-" === t) _gaq.push(["_trackEvent", "手机帐号登录", "密码登录失败", s + "###" + JSON.stringify(o)]);
            else _gaq.push(["_trackEvent", "手机帐号登录", "短信登录失败", s + "###" + JSON.stringify(o)]);
            if ("1" == e.capFlag || "4" == e.capFlag || "5" == e.capFlag) { r = "44" + e.capFlag;
                this.refreshCaps(t, r) } else this.refreshCaps(t, s);
            if ("07" == e.dt) n = 2;
            if ("401" == s) e.ret = t + e.ret;
            else e.ret = t + e.ret + (e.dt || "");
            this.$update();
            this.onShowErr(e, i, n) },
        getGtError: function(t) { this.__getTicketLock = 0;
            var e = t.ret,
                i = "mb-gt-";
            if ("401" == e) t.ret = i + t.ret;
            else t.ret = i + t.ret + (t.dt || "");
            this.onShowErr(t);
            this.refreshCaps(e) },
        getTicket: function() {
            if (!this.__getTicketLock) { this.__getTicketLock = 1;
                var t = {};
                t.un = this.$refs.mninput._$getValue().trim();
                this.__username = t.un;
                t.channel = this.data.channel;
                t.pd = this.data.product;
                t.pkid = this.data.promark;
                a._$request("mb-gt", t, this.getGtSuccess._$bind(this), this.getGtError._$bind(this), 1) } },
        checkForm: function() {
            var t = 0;
            e._$forIn(this.$refs, function(e) {
                if (!e.ignore) { e.onCheckRegexp && e.onCheckRegexp();
                    if (e.data) {
                        if (e.data.hasError) { t = 1;
                            return t }
                        if (e.data.emptyTxt) { t = e._$emptyCheck();
                            if (t) return t }
                        if (e.otherCheck && e.otherCheck())
                            if (e.data.hasError) { t = 1;
                                return t } } } }._$bind(this));
            return t },
        doShowInitFail: function(t) {
            var e = "-103";
            s._$showFail(e, t) },
        doLogin: function() {
            if (this.data.initSuccess) {
                if (!this.checkForm()) this.getTicket() } else this.doShowInitFail("登录") },
        doShowError: function(t) {
            if (!t.node) t.node = "nerror";
            this._$doShowError(t) },
        rmError: function(t) {
            if (!t.node) t.node = "nerror";
            this._$removeError(t) },
        checkCookie: function(t, e, i) {}
    });
    return f
}, 3, 4, 2, 93, 19, 11, 94, 28, 95, 29);
I$(120, function(t, e, i, n, r, s, o, a, _, c) {
    var h = Regular.extend({ data: {}, config: function(t) { i._$merge(this.data, t || {});
            if (this.data.needEye) this.data.showBtn = 0;
            else this.data.showBtn = 1;
            this.supr(t) }, init: function(t) {
            if (!this.supporPlaceHolder()) this.data.labelHidden = 0;
            else this.data.labelHidden = 1;
            this.supr(t) }, onLabelFocus: function() { this.$refs.input.focus() }, onPropertychange: function() { this.onInput() }, onInput: function() {
            var t = this.$refs.input.value;
            this.data.hasError = 0;
            this.data.active = 1;
            if (t) { this.data.hasValue = 1;
                this.data.showBtn = 1 } else this.data.hasValue = 0;
            this.$update() }, onFocus: function() { this.data.active = 1;
            this.data.hasError = 0;
            this.data.showBtn = 1;
            this.$emit("rmError", { tabIndex: this.data.tabIndex, target: this.$refs.input });
            this.$update() }, onCheckRegexp: function() {
            var t = this.$refs.input.value.trim();
            if (t)
                if (this.data.regexp)
                    if (this.data.regexp.test(t)) { this.data.hasError = 0;
                        this.data.active = 0;
                        this.$emit("rmError", { tabIndex: this.data.tabIndex, target: this.$refs.input }) } else { this.data.hasError = 1;
                        this.$emit("showError", { tabIndex: this.data.tabIndex, str: this.data.errTxt, target: this.$refs.input }) }
            else { this.data.hasError = 0;
                this.data.active = 0 } else this.data.active = 0;
            this.$update() }, onBlur: function() { setTimeout(function() {
                if (this.data.needEye) this.data.showBtn = 0;
                this.$update() }._$bind(this), 200);
            this.onCheckRegexp();
            if (!this.data.hasError && this.chn) this.doChn();
            this.otherCheck && this.otherCheck() }, onClearInput: function() { this.onClearInputPuer();
            this.$refs.input.focus() }, onClearInputPuer: function() { this.$refs.input.value = "";
            this.data.hasValue = 0;
            this.data.active = 0;
            this.data.hasError = 0;
            this.$update() }, supporPlaceHolder: function() {
            var e = t._$KERNEL;
            if ("trident" == e.engine && parseInt(e.release, 10) <= 5) return 0;
            else return 1 }, _$getValue: function() {
            return this.$refs.input.value }, _$setValue: function(t) { this.$refs.input.value = t;
            if (t) this.data.hasValue = 1 }, _$emptyCheck: function() {
            if (!this.$refs.input.value) { this.data.hasError = 1;
                this.$emit("showError", { tabIndex: this.data.tabIndex, str: this.data.emptyTxt, target: this.$refs.input });
                return 1 }
            return 0 }, _$focusHelper: function() { this.$refs.input.focus() } });
    return h }, 18, 3, 4, 11, 2, 93);
I$(121, '<div {#if active && !hasError}class="inputbox active"{#elseif hasError}class="inputbox error-color"{#else}class="inputbox"{/if}>\n    <div class="u-logo"><div class="u-logo-img3"></div></div>\n    <div class="u-input box">\n        <label on-click={this.onLabelFocus($event)} {#if !labelHidden && !hasValue}class="u-label"{#else}class="u-label f-dn"{/if}>{placeholder}</label>\n        <input on-propertychange={this.onPropertychange()} ref="input" on-focus={this.onFocus($event)} on-input={this.onInput($event)} on-blur={this.onBlur($event)} placeholder="{placeholder}" name="email" class="dlemail" type="text" autocomplete="off" tabindex="1" spellcheck="false"></div>\n    <div on-click={this.onClearInput($event)} class="u-tip" {#if hasValue && showBtn}style="display:block;"{/if}><div class="u-success u-clear"></div></div>\n</div>');
I$(96, function(t, e, i, n, r, s, o, a, _, c, h, u) {
    var l = n.extend({ template: r, data: { needCheck: 1, tabIndex: 1, placeholder: "请输入手机号", regexp: /^(13|14|15|17|18)\d{9}$/, errTxt: "手机号格式错误", emptyTxt: "请输入手机号" }, config: function(t) { e._$merge(this.data, t || {});
            this.supr(t) }, init: function(t) { this.supr(t) }, chnSuccess: function() {}, chnError: function(t) {
            var e = t.ret,
                i = "mb-reg-chn-",
                n = -1;
            if (407 == e) n = 1;
            if ("401" == e) e = i + t.ret;
            else e = i + t.ret + (t.dt || "");
            var r = s[e] || a._$getErrorTxt(t.ret);
            this.$emit("showError", { tabIndex: n, str: r, target: this.$refs.input }) }, doChn: function() {
            var t = {};
            t.id = this.data.chnId || "";
            t.mb = this.$refs.input.value.trim();
            if (t.mb) o._$request("mb-reg-chn", t, this.chnSuccess._$bind(this), this.chnError._$bind(this)) } });
    return l }, 3, 4, 2, 120, 121, 95, 28, 11);
I$(122, '<div {#if active && !hasError}class="inputbox active"{#elseif hasError}class="inputbox error-color"{#else}class="inputbox"{/if}>\n    <div class="u-logo"><div class="u-logo-img2"></div></div>\n    <div class="u-input box">\n        <label on-click={this.onLabelFocus($event)} {#if !labelHidden && !hasValue}class="u-label"{#else}class="u-label f-dn"{/if}>{placeholder}</label>\n        <input type="password" style="display:none;width:0;height:0;">\n        <input on-propertychange={this.onPropertychange()} ref="input" on-focus={this.onFocus($event)} on-input={this.onInput($event)} on-blur={this.onBlur($event)} placeholder="{placeholder}"  name="email" class="j-inputtext dlemail" type="password" autocomplete="new-password" tabindex="{tabindex}" spellcheck="false"></div>\n    <div on-click={this.onClearInput($event)} class="u-tip" {#if hasValue && showBtn}style="display:block;"{/if}><div class="u-success u-clear"></div></div>\n</div>');
I$(97, function(t, e, i, n, r, s, o, a, _) {
    var c = n.extend({ template: r, data: { tabindex: 2, tabIndex: 2, placeholder: "请输入密码", errTxt: "密码须由6-16个字符组成，区分大小写", emptyTxt: "请输入密码" }, config: function(t) { e._$merge(this.data, t || {});
            if (this.data.needCheck) this.otherCheck = this.__doOtherCheck._$bind(this);
            this.supr(t) }, init: function(t) { this.supr(t) }, __doOtherCheck: function() {
            var t = this.$refs.input.value;
            if (t) { this.$emit("pwdOtherCheck", t);
                return 1 } } });
    return c }, 3, 4, 2, 120, 122);
I$(123, '<div class="ckbox m-ckcnt f-cb">\n    <div {#if active && !hasError}class="inputbox ckin active"{#elseif hasError}class="inputbox ckin error-color"{#else}class="inputbox ckin"{/if}>\n        <div class="u-input">\n            <label on-click={this.onLabelFocus($event)} {#if !labelHidden && !hasValue}class="u-label"{#else}class="u-label f-dn"{/if}>{placeholder}</label>\n            <input on-propertychange={this.onPropertychange()} ref="input" placeholder="{placeholder}" on-focus={this.onFocus($event)} on-input={this.onInput($event)} on-blur={this.onBlur($event)} name="checkcode" class="cktext" type="text" maxlength="4" tabindex="2" spellcheck="false" {#if disabled}disabled="disabled"{/if}></div>\n        <div on-click={this.onClearInput($event)} class="u-tip" {#if showBtn && hasValue && !vfsuc}style="display:block;"{/if}><div class="u-success u-clear"></div></div>\n        <div class="u-tip" {#if vfsuc}style="display:block;"{/if}><div class="u-success u-suc"></div></div>\n    </div>\n    <div class="inputbox ckimgbox f-fr">\n        <img on-click={this.refreshImg()} ref="captcha" class="ckimg" title="点击刷新验证码" alt="点击获取验证码" /></div>\n</div>');
I$(98, function(t, e, i, n, r, s, o, a, _, c, h, u) {
    var l = n.extend({
        template: o,
        data: { needCheck: 1, tabIndex: 3, placeholder: "请输入图片验证码", regexp: /^[0-9a-zA-Z]{4}$/, errTxt: "图片验证码格式错误", emptyTxt: "请输入图片验证码" },
        config: function(t) { e._$merge(this.data, t || {});
            this.__product = t.product;
            this.__pkid = t.promark;
            this.supr(t) },
        init: function(t) { this.supr(t);
            this.refreshImg() },
        vfCapSuccess: function() {
            this.__vfcapLock = 0;
            this.data.vfsuc = 1;
            this.data.disabled = 1;
            this.data.hasValue = 1;
            this.getImglock = 1;
            this.data.active = 0;
            this.$update()
        },
        vfCapError: function(t) {
            var e = "",
                i = "mb-vfcp-";
            this.__vfcapLock = 0;
            this.data.active = 1;
            var n = t.ret;
            if ("441" != n && "444" != n && "445" != n) { this._$refreshImg();
                if ("401" == n) n = i + t.ret;
                else n = i + t.ret + (t.dt || "");
                e = s[n] || a._$getErrorTxt(t.ret);
                this.$emit("showError", { tabIndex: this.data.tabIndex, str: e, target: this.$refs.input });
                this.$update() } else this.$emit("refreshCap", { code: n }) },
        _vfcaptcha: function(t) {
            if (!this.__vfcapLock) { this.__vfcapLock = 1;
                var e = {};
                e.pd = this.data.product;
                e.pkid = this.data.promark;
                e.cap = t;
                e.channel = this.data.channel;
                e.un = this.$parent.getUn();
                r._$request("mb-vfcp", e, this.vfCapSuccess._$bind(this), this.vfCapError._$bind(this), 1) } },
        onInput: function(t) { this.supr(t);
            var e = this.$refs.input.value.trim();
            if (this.data.needVf && this.data.regexp.test(e)) this._vfcaptcha(e) },
        refreshImg: function() {
            if (!this.getImglock)
                if (this.data.isReg) MP.getId("yd_" + this.data.promark, function(t) { this.$refs.captcha.src = MP["mb-reg-cp"](t) }._$bind(this));
                else this.$refs.captcha.src = MP["mb-cp"](this.__product, this.__pkid, window["$cookieDomain"]) },
        _$refreshImg: function() { this.onClearInputPuer();
            this.__vfcapLock = 0;
            this.getImglock = 0;
            this.data.disabled = 0;
            this.data.vfsuc = 0;
            this.data.hasValue = 0;
            this.$update();
            this.refreshImg() }
    });
    return l
}, 3, 4, 2, 120, 28, 95, 123, 11);
I$(124, '<div ref=slidebox class="ckbox m-ckcnt slidebox f-cb" style="position: relative;">\n    <div ref=ScapTcha class="ScapTcha" id="ScapTcha"></div>\n    <input ref=slidecap name="slidecap" style="height:0;width:0;display:none;" type="text" value="" />\n</div>');
I$(99, function(t, e, i, n, r, s, o, a, _, c, h) {
    var u = n.extend({ template: s, data: { needCheck: 1, tabIndex: 3, errTxt: "请滑动验证码", hasError: 1 }, config: function(t) { e._$merge(this.data, t || {});
            this.__product = t.product;
            this.__pkid = t.promark;
            this.__server = "captcha.reg.163.com/v2";
            this.__productkey = this.data.productkey;
            this.__swidth = this.data.swidth || 320;
            this.__hintTxt = this.data.hintTxt || "按住滑块，拖动完成上方拼图";
            this.__slideOpt = { staticServer: this.__server, apiServer: this.__server, captchaId: this.__productkey, width: this.__swidth, forceHttps: !0, alignToSpace: !0, hintTxt: this.__hintTxt, verifyCallback: this.__slideVerify._$bind(this), initCallback: this.__initCallback._$bind(this), initErrorHandler: this.__initErrorHandler._$bind(this) };
            this.supr(t) }, __initCallback: function() {}, __initErrorHandler: function() {}, init: function(t) { this.supr(t);
            this.data.slideTarget = this.$parent.getSlideTarget();
            this.refreshSlide() }, __verifyOk: function() { this.__clearSlideErr();
            this.__setSlideSuc() }, __verifyFail: function(t) {
            var e = t.ret;
            this.__showSlideErr(1, e) }, __doVerify: function() {
            var t = { pd: this.__product, pkid: this.__pkid, capkey: this.__productkey, channel: this.data.channel };
            var e;
            t.un = this.$parent.getUn();
            t.cap = this.__myCaptcha.getPwd();
            t.ct = this.__myCaptcha.getCt();
            e = 2 == this.data.slideTarget ? "mb-vftcp" : "mb-vfccp";
            this.prefix = e + "-";
            r._$request(e, t, this.__verifyOk._$bind(this), this.__verifyFail._$bind(this), 1) }, __setSlideSuc: function() {
            var t = i._$getByClassName(document, "ncpt_txt_status")[0];
            if (t) { t.style.display = "block";
                t.innerHTML = '<div class="u-success u-suc"></div>' }
            t.className = "ncpt_txt_status TxtStatus statusTxt" }, __slideVerify: function(t) {
            if (t.value) { this.data.hasError = 0;
                this.__clearSlideErr();
                if (this.data.isLogin) this.__doVerify();
                else this.__setSlideSuc() } else this.__showSlideErr() }, __showSlideErr: function(t, e) {
            if (t) { this.data.hasError = 1;
                this.prefix += e;
                var i = o[this.prefix];
                this.$emit("showError", { tabIndex: this.data.tabIndex, str: i, target: this.$refs && this.$refs.input });
                if ("441" == e || "444" == e || "445" == e) this.$emit("refreshCap", { code: e });
                else this.refreshSlide() } else { this.data.hasError = 1;
                this.data.errTxt = 2 == this.data.slideTarget ? "请滑动验证码" : "请点击验证码";
                this.$emit("showError", { tabIndex: this.data.tabIndex, str: this.data.errTxt, target: this.$refs.input }) } }, __clearSlideErr: function() { this.$emit("rmError", { tabIndex: this.data.tabIndex }) }, __slidebarout: function() {
            if (this.__sdov) this.__sdov = clearTimeout(this.__sdov);
            this.__sdot = setTimeout(function() { this.__slideCapBox.style.zIndex = "19" }._$bind(this), 100) }, __slidebarover: function() {
            if (this.__sdot) this.__sdot = clearTimeout(this.__sdot);
            this.__sdov = setTimeout(function() { this.__slideCapBox.style.zIndex = "501" }._$bind(this), 100) }, refreshSlide: function() { this.__slideOpt.captchaType = this.data.slideTarget;
            this.__slideOpt.element = this.$refs.ScapTcha;
            if (window._$needUrsBgp && window._$BGP) { this.__slideOpt.apiServer = "captcha2.reg.163.com/v2";
                this.__slideOpt.staticServer = "captcha2.reg.163.com/v2" }
            if (this.__myCaptcha) this.__myCaptcha.refresh(this.__slideOpt);
            else this.__myCaptcha = new window.NECaptcha(this.__slideOpt);
            setTimeout(function() { t._$addEvent(this.__slideCapBox, "mouseout", this.__slidebarout._$bind(this));
                t._$addEvent(this.__slideCapBox, "mouseover", this.__slidebarover._$bind(this)) }._$bind(this), 300) }, onCheckRegexp: function() {
            if (this.data.hasError) this.__showSlideErr();
            return this.data.hasError }, _$getPwdValue: function() {
            return this.__myCaptcha.getPwd() }, _$getCapKey: function() {
            return this.__productkey }, _$getCt: function() {
            return this.__myCaptcha.getCt() }, _$refreshSlide: function(t) { this.data.hasError = 1;
            if ("444" == t) this.data.slideTarget = 2;
            if ("445" == t) this.data.slideTarget = 3;
            this.refreshSlide() } });
    return u }, 3, 4, 2, 73, 28, 124, 95);
I$(100, '<div class="m-container">\n    <div class="u-tab f-cb">\n        <a class="tab1" on-click={this.goSmsLogin()}>{mbSmsLoginTxt}</a>\n    </div>\n    <!--帐号-->\n    <mninput needEye="{needEye}" ref=mninput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} placeholder="{mobilePlaceholder.mobile}" />\n    <div class="fur-change-email"></div>\n    <!--密码needEye="{needEye}"-->\n    <mpinput needEye="{needEye}" ref=mpinput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} placeholder="{mobilePlaceholder.pwd1}" />\n    <!-- 验证码 -->\n    {#if hasImgCap}\n    <captcha needEye="{needEye}" ref=captcha on-refreshCap={this.doRefreshCap($event)} on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} product="{product}" promark="{promark}" needVf="1" channel="{channel}" placeholder="{mobilePlaceholder.cap1}" />\n    {/if}\n    <!-- 滑块验证码 -->\n    {#if hasSlide}\n    <slidecap ref=slidecap on-refreshCap={this.doRefreshCap($event)} isLogin=1 on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} server="{server}" productkey="{productkey}" swidth="{swidth}" product="{product}" promark="{promark}" hintTxt="{hintTxt}" channel="{channel}" isLoginModule=1 />\n    {/if}\n    <!-- 错误提示 -->\n    <div class="m-nerror f-dn" id="nerror"></div>\n    <!-- 登录按钮 -->\n    <div class="f-cb loginbox">\n        <a id="submitBtn" on-click={this.doLogin()} class="u-loginbtn btncolor tabfocus" tabindex="8">{mbBtnTxt}</a>\n    </div>\n    <!-- 免登复选框 -->\n    <div class="m-unlogin">\n        {#if !single}\n        <a class="u-regbtn bgcolor tabfocus j-redirect" href="javascript:void(0);" data-outlink="2" target="_self" tabindex="11" data-action="changepage" data-mdtype="1">{gotoRegTextMb}</a>\n        {/if}\n    </div>\n    <!-- 第三方登录 -->\n    {#if config && config.length}\n    <div ref=thirdLogin class="m-ologin">\n        <div class="otip f-fl">其他方式登录</div>\n        <div class="olist">\n            {#list config as o}\n                <a data-width="{o.width}" data-height="{o.height}" data-outlink="1" data-link="{o.url}" class="f-cb f-fl third {o.name} j-redirect" href="javascript:void(0);"></a>\n            {/list}\n        </div>\n    </div>\n    {/if}\n    {#if !!otherThirdLink}<div class="otherThirdLink" ref=otherLink></div>{/if}\n</div>\n');
I$(74, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d, f) {
    var m = r.extend({ template: h, data: { module: "login", warn: "", btnTxt: "登  录", unLoginText: "几天免登录", gotoRegText: "注册手机帐号", channel: 1, mbSmsLoginTxt: "使用短信验证登录" }, config: function(t) { e._$merge(this.data, t || {});
            this.supr(t) }, init: function(e) { this.supr(e);
            this.doInit(e);
            if (this.$refs.otherLink) this.$refs.otherLink.innerHTML = this.data.otherThirdLink;
            if (this.$refs.thirdLogin) { t._$clearEvent(this.$refs.thirdLogin);
                t._$addEvent(this.$refs.thirdLogin, "click", this.doClick._$bind(this)) }
            _gaq.push(["_trackEvent", "手机帐号密码登录模块", "初始化", ""]) }, destroy: function() {
            if (this.$refs && this.$refs.captcha) this.$refs.captcha._$setValue("");
            this.supr() }, goSmsLogin: function() {
            var t = this.$refs.mninput._$getValue().trim();
            var e = { username: t };
            _gaq.push(["_trackEvent", "手机帐号登录页面", "点击切换登录方式", "切换到用验证码登录###" + JSON.stringify(e)]);
            this.$emit("changeModule", 2) }, getGtSuccess: function(t) { this.ticket = t.tk;
            var e = {};
            e.un = this.$refs.mninput._$getValue().trim();
            e.pw = MP.encrypt2(this.$refs.mpinput._$getValue() || "0");
            e.pd = this.data.product;
            e.pkid = this.data.promark;
            e.tk = this.ticket;
            e.domains = this.data.domains || "";
            c._$request("mb-login", e, this.loginSuccess._$bind(this, 1), this.loginError._$bind(this, "mb-login-"), 1) } });
    m.component("mninput", s);
    m.component("mpinput", o);
    m.component("captcha", a);
    m.component("slidecap", _);
    return m }, 3, 4, 11, 2, 73, 96, 97, 98, 99, 28, 100);
I$(80, function(t, e, i, n, r, s, o, a, _, c, h) {
    var u;
    a._$$CountDown = t._$klass();
    u = a._$$CountDown._$extend(r._$$EventTarget);
    u.__init = function(t) { this.__super(t);
        this.__btn = t.btn };
    u.__reset = function(t) { this.__super(t);
        this.__lock = 0;
        this.__initEvent() };
    u.__initEvent = function() { this.__doInitDomEvent([
            [this.__btn, "click", this.__onClick._$bind(this)]
        ]) };
    u.__setTimeout = function() {
        var t, i;
        var n = function() {
            if (0 != t) { t--;
                this.__btn.innerHTML = t + "秒后重发" } else { this.__btn.innerHTML = "获取验证码";
                e._$delClassName(this.__btn, "disable");
                this.__btn.disabled = !1;
                this.__lock = 0;
                i = clearInterval(i) } };
        return function() { e._$addClassName(this.__btn, "disable");
            this.__btn.disabled = !0;
            t = 30;
            this.__btn.innerHTML = t + "秒后重发";
            i = setInterval(n._$bind(this), 1e3) } }();
    u.__onClick = function() { this.__btn.focus();
        if (!this.__lock) this._$dispatchEvent("onclick") };
    u._$getSms = function() { this.__lock = 1;
        this.__setTimeout() } }, 1, 2, 3, 4, 5, 11, 77);
I$(125, '<div class="m-pccnt f-cb">\n    <div class="m-pcbox">\n        <div {#if active && !hasError}class="inputbox m-mb m-pc f-fl active"{#elseif hasError}class="inputbox m-mb m-pc f-fl error-color"{#else}class="inputbox m-mb m-pc f-fl"{/if}>\n            <div class="u-input">\n                <label on-click={this.onLabelFocus($event)} {#if !labelHidden && !hasValue}class="u-label"{#else}class="u-label f-dn"{/if}>{placeholder}</label>\n                <input on-propertychange={this.onPropertychange()} ref="input" on-focus={this.onFocus($event)} on-input={this.onInput($event)} on-blur={this.onBlur($event)} placeholder="{placeholder}" name="phonecode" class="j-inputtext pcin" type="text" data-max-length="6" maxlength="6" tabindex="5" spellcheck="false"></div>\n            <div on-click={this.onClearInput($event)} class="u-tip" {#if hasValue && showBtn}style="display:block;"{/if}><div class="u-success u-clear"></div></div>\n        </div>\n\n        <div class="pcbtn f-fl">\n            <a ref=smsBtn href="javascript:void(0);" class="tabfocus getsmscode">获取验证码</a>\n        </div>\n    </div>\n</div>');
I$(101, function(t, e, i, n, r, s, o, a, _, c) {
    var h = n.extend({ template: s, data: { needCheck: 1, tabIndex: 4, placeholder: "请输入短信验证码", regexp: /^\d{6}$/, errTxt: "短信验证码格式错误", emptyTxt: "请输入短信验证码", slideKey: "123" }, config: function(t) { e._$merge(this.data, t || {});
            this.supr(t) }, init: function(t) { this.supr(t);
            if (!this.__countDownBtn) this.__countDownBtn = r._$$CountDown._$allocate({ btn: this.$refs.smsBtn, onclick: this.onSendSms._$bind(this) }) }, onSendSms: function() { this.$emit("sendSms") }, getSms: function() { this.__countDownBtn._$getSms() } });
    return h }, 3, 4, 2, 120, 80, 125);
I$(102, '<div class="m-container">\n    <div class="u-tab f-cb">\n        <a class="tab0" on-click={this.goPwdLogin()}>{mbPwdLoginTxt}</a>\n    </div>\n    <!--帐号-->\n    <mninput needEye="{needEye}" ref=mninput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} placeholder="{mobilePlaceholder.mobile2}" />\n    <!-- 验证码 -->\n    {#if hasImgCap}\n    <captcha needEye="{needEye}" ref=captcha on-refreshCap={this.doRefreshCap($event)} on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} product="{product}" pkid="{pkid}" promark="{promark}" placeholder="{mobilePlaceholder.cap2}" />\n    {/if}\n    <!-- 滑块验证码 -->\n    {#if hasSlide}\n    <slidecap ref=slidecap on-refreshCap={this.doRefreshCap($event)} on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} server="{server}" productkey="{productkey}" swidth="{swidth}" product="{product}" promark="{promark}" hintTxt="{hintTxt}" channel="{channel}" isLoginModule=1 />\n    {/if}\n    <!-- 短信 -->\n    <smsinput needEye="{needEye}" ref=smsinput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} on-sendSms={this.sendSms($event)} product="{product}" pkid="{pkid}" promark="{promark}" placeholder="{mobilePlaceholder.sms2}" />\n    <!-- 错误提示 -->\n    <div class="m-nerror f-dn" id="nerror"></div>\n    <!-- 登录按钮 -->\n    <div class="f-cb loginbox">\n        <a id="submitBtn" on-click={this.doLogin()} class="u-loginbtn btncolor tabfocus" tabindex="8">{smsBtnTxt}</a>\n    </div>\n    <!-- 免登复选框 -->\n    <div class="m-unlogin">\n        <div class="b-unlogn j-unlogn f-dn">\n            <span class="u-checkbox tabfocus">\n                <input type="checkbox" name="un-login" class="un-login">\n            </span>\n            <label for="un-login">{unLoginText}</label>\n        </div>\n        {#if !single}\n        <a class="u-regbtn bgcolor tabfocus" href="javascript:void(0);" data-outlink="2" target="_self" tabindex="11" data-action="changepage" data-mdtype="1">{gotoRegTextMb}</a>\n        {/if}\n    </div>\n    <!-- 第三方登录 -->\n    {#if config && config.length}\n    <div ref=thirdLogin class="m-ologin">\n        <div class="otip f-fl">其他方式登录</div>\n        <div class="olist">\n            {#list config as o}\n                <a data-width="{o.width}" data-height="{o.height}" data-outlink="1" data-link="{o.url}" class="f-cb f-fl third {o.name} j-redirect" href="javascript:void(0);"></a>\n            {/list}\n        </div>\n    </div>\n    {/if}\n    {#if !!otherThirdLink}<div class="otherThirdLink" ref=otherLink></div>{/if}\n</div>\n');
I$(75, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d, f, m) {
    var p = n.extend({ template: c, data: { module: "login", warn: "", btnTxt: "登  录", unLoginText: "几天免登录", gotoRegText: "注册手机帐号", channel: 2, mbPwdLoginTxt: "使用密码验证登录" }, config: function(t) { e._$merge(this.data, t || {});
            this.supr(t) }, init: function(e) { this.supr(e);
            this.doInit();
            if (this.$refs.otherLink) this.$refs.otherLink.innerHTML = this.data.otherThirdLink;
            if (this.$refs.thirdLogin) { t._$clearEvent(this.$refs.thirdLogin);
                t._$addEvent(this.$refs.thirdLogin, "click", this.doClick._$bind(this)) }
            _gaq.push(["_trackEvent", "手机帐号验证码登录模块", "初始化", ""]) }, iniSuccess: function(t) {
            if (this.$refs) { this.supr(t);
                if (this.$refs.slidecap) this.$refs.slidecap.ignore = 1;
                if (this.$refs.captcha) this.$refs.captcha.ignore = 1 } }, goPwdLogin: function() {
            var t = this.$refs.mninput._$getValue().trim();
            var e = { username: t };
            _gaq.push(["_trackEvent", "手机帐号登录页面", "点击切换登录方式", "切换到用密码登录###" + JSON.stringify(e)]);
            this.$emit("changeModule", 1) }, getGtSuccess: function(t) { this.ticket = t.tk;
            var e = {};
            e.un = this.$refs.mninput._$getValue().trim();
            e.pw = this.$refs.smsinput._$getValue().trim();
            e.pd = this.data.product;
            e.pkid = this.data.promark;
            e.tk = this.ticket;
            e.domains = this.data.domains || "";
            _._$request("mb-lvfsms", e, this.loginSuccess._$bind(this, 0), this.loginError._$bind(this, "mb-lvfsms-"), 1) }, getSmsSuccess: function(t) { this.__sendSmsLock = 0;
            this.$refs.smsinput.getSms(t) }, getSmsFail: function(t) {
            var e = t.ret,
                i = -1,
                n, r = "mb-sms-lsm-";
            this.__sendSmsLock = 0;
            this.refreshCaps(r, e);
            if (411 == e) {
                var s = t.receiveCode.split(",");
                n = 2;
                h["mb-sms-lsm-411"] = "请您编辑短信<a>" + s[0] + "</a>发送到<a>" + s[1] + "</a>短信费用由运营商收取（0.1元/条）";
                this.$refs.smsinput.onClearInputPuer() }
            if (420 == e || 422 == e || 602 == e) {
                if (422 == e || 602 == e) n = 2;
                i = 1 }
            if ("401" == e) t.ret = r + e;
            else t.ret = r + e + (t.dt || "");
            this.onShowErr(t, i, n) }, sendSms: function() {
            if (this.data.initSuccess) {
                var t = this.$refs.mninput._$emptyCheck(),
                    e = this.$refs.mninput.data.hasError,
                    i, n;
                this.$refs.smsinput.onClearInputPuer();
                if (!t && !e) {
                    if (this.data.hasImgCap) { i = this.$refs.captcha._$emptyCheck();
                        n = this.$refs.captcha.data.hasError }
                    if (this.data.hasSlide) i = this.$refs.slidecap.onCheckRegexp();
                    if (!i && !n) {
                        var r = {};
                        r.mb = this.$refs.mninput._$getValue().trim();
                        r.pd = this.data.product;
                        r.pkid = this.data.promark;
                        if (this.data.hasImgCap) r.cap = this.$refs.captcha._$getValue().trim();
                        if (this.data.hasSlide) { r.cap = this.$refs.slidecap._$getPwdValue();
                            r.capkey = this.$refs.slidecap._$getCapKey();
                            r.ct = this.$refs.slidecap._$getCt() }
                        if (!this.__sendSmsLock) { this.__sendSmsLock = 1;
                            _._$request("mb-sms-lsm", r, this.getSmsSuccess._$bind(this), this.getSmsFail._$bind(this), 1) } } } } else this.doShowInitFail("登录") } });
    p.component("mninput", r);
    p.component("captcha", o);
    p.component("smsinput", s);
    p.component("slidecap", a);
    return p }, 3, 4, 2, 73, 96, 101, 98, 99, 28, 102, 95, 29);
I$(76, '<form id="login-form"></form>');
I$(34, function(t, e, i, n, r, s, o, a, _, c, h, u, l) {
    var d = r.extend({ template: _, data: {}, config: function(t) { e._$merge(this.data, t || {});
            this.supr(t) }, init: function(i) { this.supr(i);
            this.__config = {};
            e._$merge(this.__config, i);
            this.__config.config = n._$parseOauth();
            t._$addEvent(document, "keyup", this.doEnter._$bind(this)) }, destroy: function() { t._$clearEvent(document, "keyup");
            this.supr() }, _$changeModule: function(t) {
            if (this.__ml) this.__ml.destroy();
            if (this.__msl) this.__msl.destroy();
            this.__config.hasImgCap = 0;
            this.__config.hasSlide = 0;
            if (1 == t) { this.__config.channel = 1;
                this.__ml = new o({ data: this.__config }).$inject("#login-form");
                this.__ml.$on("changeModule", this._$changeModule._$bind(this)) } else { this.__config.channel = 2;
                this.__msl = new a({ data: this.__config }).$inject("#login-form");
                this.__msl.$on("changeModule", this._$changeModule._$bind(this)) } } });
    return d }, 3, 4, 2, 11, 73, 28, 74, 75, 76);
I$(7, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d, f, m, p, g) {
    var v, y = 2e3,
        b = 1e3;
    f._$$LoginManager = t._$klass();
    v = f._$$LoginManager._$extend(u._$$Manager);
    v.__init = function(t) {
        var e;
        r._$loadGaq();
        this.__options = t || {};
        window.$loginOpts = this.__options;
        this.__domains = t.domains || "";
        this.__product = t.product || "";
        this.__promark = t.promark || "";
        this.__host = t.host || "";
        this.__focusHelper = t.focusHelper || 0;
        this.__lazyCheck = t.lazyCheck || 0;
        this.__autoSuffix = t.autoSuffix || 0;
        this.__needUnLogin = t.needUnLogin || 0;
        this.__defaultUnLogin = t.defaultUnLogin || 0;
        this.__needQrLogin = t.needQrLogin || 0;
        this.__toolName = t.toolName || 0;
        this.__toolUrl = t.toolUrl || 0;
        this.__unLoginChecked = this.__defaultUnLogin || 0;
        this.__unLoginTime = t.unLoginTime || 10;
        if (t.loadTime) { e = window._$BGP ? "BGP" : "非BGP";
            _gaq.push(["_trackEvent", "外层用时" + window._$PKID, "加载成功", e + "-【" + t.loadTime + "】ms"]) }
        this.__gaqo = { pid: this.__promark, pdt: this.__product };
        this.__domain = t.prdomain;
        window["$cookieDomain"] = t.cookieDomain;
        this.__errMsg = t.errMsg;
        this.__errMode = t.errMode || 1;
        this.__super(t);
        if (this.__errMsg) setTimeout(function() { r._$showError(null, this.__errMsg, "nerror");
            this.__errMsg = "" }._$bind(this), 20);
        r._$resize() };
    v.__reset = function(t) { this.__super(t);
        this.__islogin = 1;
        this.__disabled = 1;
        this.__onpage = "login";
        this.__single = parseInt(t.single);
        this.__includeBox = !!t.includeBox;
        this.__mobileFirst = t.mobileFirst || 0;
        this.__regUrl = t.regUrl;
        this.__renderBox();
        r._$resize() };
    v.__renderLogin = function() {
        if (this.__needQrLogin) this.__showQrcodeBtn();
        this.__module = "goEmailLogin";
        this.__initLogin();
        this.__initUnLogin();
        this.__setUsername();
        this.__sendSize("init");
        this.__checkDisable();
        this.__inputs = e._$getByClassName(this.__box, "j-inputtext");
        this.__pwdtext = e._$get("pwdtext");
        this.__nameinput = this.__inputs[0];
        this.__passwordinput = this.__inputs[1];
        this.__checkcodeinput = this.__inputs[2];
        if (this.__domain && !this.__domain2) { this.__initUserNameDomain(this.__domain);
            this.__domain2 = 1 }
        if (this.__placeholder && !this.__placeholder2) {
            if (this.__placeholder.account) {
                var t = e._$getByClassName(this.__box, "u-input")[0];
                e._$getByClassName(t, "u-label")[0].innerHTML = this.__placeholder.account;
                var i = e._$getByClassName(t, "j-inputtext")[0];
                e._$dataset(i, "placeholder", this.__placeholder.account) }
            if (this.__placeholder.pwd) {
                var n = e._$getByClassName(this.__box, "u-input")[1];
                e._$getByClassName(n, "u-label")[0].innerHTML = this.__placeholder.pwd;
                var r = e._$getByClassName(n, "j-inputtext")[0];
                e._$dataset(r, "placeholder", this.__placeholder.pwd) }
            this.__placeholder2 = 1 } };
    v.__renderBox = function() { a._$render(this.__box, "index-tmp", { needMobileLogin: this.__options.needMobileLogin, goEmailLoginTxt: this.__options.goEmailLoginTxt, goMbLoginTxt: this.__options.goMbLoginTxt, goEmailRegTxt: this.__options.goEmailRegTxt, goMbRegTxt: this.__options.goMbRegTxt });
        this.__cnt = e._$getByClassName(this.__box, "m-cnt")[0];
        this.__footer = e._$getByClassName(this.__box, "m-footer")[0];
        if (this.__includeBox) {
            var t = e._$get("cnt-box-parent");
            if (!e._$hasClassName(t, "cnt-box-include")) e._$addClassName(t, "cnt-box-include") }
        var i = e._$get("mobileModule");
        if (this.__mobileFirst && i) this.__doAction(i);
        else this.__renderLogin() };
    v.__initUserNameDomain = function(t) {
        try {
            var i = e._$getByClassName(this.__box, "j-prdomain")[0];
            var n = e._$getByClassName(this.__box, "j-inputtext")[0];
            var r = e._$getByClassName(this.__box, "inputbox")[0];
            var s = e._$getByClassName(this.__box, "u-logo")[0];
            i.innerHTML = t;
            e._$delClassName(i, "f-dn");
            n.style.width = r.clientWidth - s.clientWidth - i.clientWidth - 22 + "px";
            i.style.right = -5 - i.clientWidth + "px"
        } catch (o) {}
    };
    v.__showQrcodeBtn = function() { this.__qrm = e._$getByClassName(this.__box, "j-btnqrcode")[0];
        if (this.__qrm) { e._$delClassName(this.__qrm, "f-dn");
            i._$clearEvent(this.__qrm);
            i._$addEvent(this.__qrm, "click", this.__showQrcodeModule._$bind(this)) } };
    v.__hideQrcodeBtn = function() {
        if (this.__qrm) e._$addClassName(this.__qrm, "f-dn") };
    v.__doEnter = function(t) {
        if (this.__loginModule && "login" == this.__onpage && !this.__isAppSafe)
            if (13 == t.keyCode && !this.__loginModule._stopEnter) this.__doAction(null, "dologin");
            else if (this.__loginModule) this.__loginModule._stopEnter = 0 };
    v.__checkDisable = function() {
        var t = e._$get("dologin");
        if (this.__disabled) e._$addClassName(t, "btndisabled");
        else e._$delClassName(t, "btndisabled") };
    v.__destroy = function() { this.__clearModule();
        this.__super();
        this.__hideQrcodeBtn();
        delete this.__module };
    v.__initComp = function(t) {
        var e = r._$timeCountEnd("initLogin");
        if (e > 0) {
            var i = window._$BGP ? "BGP" : "非BGP";
            _gaq.push(["_trackEvent", "登录初始化" + window._$PKID, "初始化成功", "详细耗时【" + t.time + "ms】渠道" + i]);
            e = -1 }
        if (this.__loginModule) {
            if (this.__focusHelper) this.__loginModule._$focusHelper();
            if (!this.__errMsg && t.dlapp) r._$showError(0, '<a target="_blank" href="https://id.163.com/gj">网易帐号管家</a>，<span style="color:#000;">有效防止被盗<span>', "nerror", 3);
            this.__hasInit = 1;
            this.__capFlag = t ? t.capFlag : this.__capFlag;
            if (this.__capFlag) this.__showCheckCode(t) } };
    v.__onPwdKeyUp = function() { this.__pwdKeyUp = 1 };
    v.__initLogin = function() {
        if (!this.__loginModule) this.__createLoginModule(1);
        if (this.__single) {
            var t = e._$get("changepage");
            if (this.__single) { e._$dataset(t, "action", "none");
                t.href = this.__regUrl ? this.__regUrl : "//zc.reg.163.com/regInitialized";
                t.target = "_blank" } } };
    v.__onDisabled = function(t) { this.__disabled = t;
        this.__checkDisable() };
    v.__onUnLockLogin = function() { this.__doLoginLock = 0 };
    v.__createLoginModule = function(t) {
        var e = { pd: this.__product, pkid: this.__promark, pkht: this.__host };
        this.__iniData = e;
        if (t) { r._$timeCount("initLogin");
            s._$request("initComponentLogin", e, this.__initComp._$bind(this), this.__showFail3._$bind(this, 0), 1, this.__product) }
        this.__loginModule = c._$$Login._$allocate({ parent: this.__cnt, opts: this.__options, onSlideOk: this.__onSlideOk._$bind(this), onPwdKeyUp: this.__onPwdKeyUp._$bind(this), ondisabled: this.__onDisabled._$bind(this), onUnLockLogin: this.__onUnLockLogin._$bind(this) });
        if (this.__password) this.__loginModule._$setPwd(this.__password);
        this.__onpage = "login";
        i._$delEvent(document, "keyup", this.__doEnter._$bind(this));
        i._$addEvent(document, "keyup", this.__doEnter._$bind(this)) };
    v._$doRefresh = function() { r._$timeCount("initLogin");
        s._$request("initComponentLogin", this.__iniData, this.__initComp._$bind(this), this.__showFail3._$bind(this, 1), 1, this.__product) };
    v.__createMbLoginModule = function() {
        var t = this.__options.smsLoginFirst ? 0 : 1;
        if (this.__needQrLogin) this.__showQrcodeBtn();
        this.__mbLoginModule = new d({ data: this.__options });
        this.__mbLoginModule.$inject(this.__cnt);
        this.__mbLoginModule._$changeModule(t, this.__cnt) };
    v.__goModule = function() { this.__clearModule();
        if ("goEmailLogin" == this.__module) this.__renderLogin();
        else this.__createMbLoginModule() };
    v.__doAction = function(t, s, o) {
        var a = i._$getElement(t) || t,
            c = s || e._$dataset(a, "action"),
            h = e._$dataset(a, "srclist") || "";
        if ("dounlocklogin" != c) {
            if ("myphonegoon" == c) {
                var u = {};
                var l = this.__loginModule._$getValues();
                l[0] = l[0].trim();
                u.un = this.__domain ? l[0] + this.__domain : l[0];
                var d = e._$get("ismyphonebox");
                u.ck = "0";
                if (d) u.ck = d.checked ? "1" : "0";
                h = h ? h.split(",") : [];
                if (h.length > 0)
                    for (var f = 0, m; f < h.length; f++) { m = h[f];
                        h[f] = m + "&ck=" + u.ck }
                this.__setDomains({ type: "success", username: this.__username || "", nextUrls: h });
                _._$cookie("THE_LAST_LOGIN", { value: this.__username || "", expires: 30 }) } else if ("goEmailLogin" == c || "goMbLogin" == c) {
                if (c == this.__module) return;
                this.__heads = e._$getByClassName(this.__box, "j-head");
                n._$forEach(this.__heads, function(t) { e._$delClassName(t, "active") });
                e._$addClassName(a, "active");
                this.__module = c;
                this.__goModule() } else if ("dologin" == c)
                if (this.__isLeak) {
                    if (this.__isLeak1) this.__doGoon(1);
                    else if (this.__isLeak2) { this.__isLeak = !1;
                        this.__doBack(1) } else if (this.__isLeak3) this.__doGoon() } else this.__doLogin();
            else if ("doback" == c) { this.__isLeak = !1;
                o = !o;
                this.__doBack(o) } else if ("doclose" == c)
                if (!this.__closeFlag) { this.__closeFlag = !0;
                    this.__sendClose() }
            this.__super(t) } else { this.__unLockLoginState(1);
            setTimeout(function() { r._$showError(null, "已取消登录，请重新登录", "nerror", 2) }, 200) } };
    v.__goonLog = function() {};
    v.__doGoon = function(t) {
        var e = { pd: this.__product, pkid: this.__promark, type: 0 };
        if (1 == t) {
            var i = this.__loginModule._$getValues();
            i[0] = i[0].trim();
            e.un = this.__domain ? i[0] + this.__domain : i[0];
            s._$request("goonlog", e, this.__goonLog._$bind(this), this.__goonLog._$bind(this), 1, this.__product) }
        _._$cookie("THE_LAST_LOGIN", { value: this.__username || "", expires: 30 });
        setTimeout(function() { this.__sendMsg({ type: "success", username: this.__username || "" }) }._$bind(this), 100) };
    v.__clearModule = function() { this.__isDoBack = 0;
        if (this.__isAppSafe) this.__unLockLoginState();
        if (this.__mbLoginModule) this.__mbLoginModule.destroy();
        if (this.__loginModule) this.__loginModule = this.__loginModule._$recycle();
        if (this.__qrcodeModule) this.__qrcodeModule = this.__qrcodeModule._$recycle() };
    v.__doBack = function(t) { this.__clearModule();
        this.__isDoBack = 1;
        if (this.__module && "goMbLogin" == this.__module) { this.__module = null;
            this.__doAction(e._$get("mobileModule")) } else { this.__createLoginModule(t);
            this.__setUsername();
            this.__changePage() }
        r._$resize() };
    v.__initUnLogin = function() {
        var t = function() {
            var t = e._$getByClassName(this.__box, "u-checkbox")[0];
            if (!e._$hasClassName(t, "u-checkbox-select")) { this.__unLoginChecked = 1;
                e._$addClassName(t, "u-checkbox-select") } else { this.__unLoginChecked = 0;
                e._$delClassName(t, "u-checkbox-select") } };
        return function() {
            var i = e._$getByClassName(this.__box, "j-unlogn")[0];
            if (this.__needUnLogin && i) { e._$delClassName(i, "f-dn");
                var n = e._$getByClassName(i, "un-login")[0];
                if (this.__unLoginChecked) e._$addClassName(e._$getByClassName(this.__box, "u-checkbox")[0], "u-checkbox-select");
                this.__doInitDomEvent([
                    [n, "click", t._$bind(this)]
                ]) } else e._$addClassName(i, "f-dn") } }();
    v.__setUsername = function() {
        var t = this.__username || _._$cookie("THE_LAST_LOGIN");
        if (t) {
            var e;
            if (this.__domain)
                if (t.substring(t.indexOf("@")) === this.__domain) e = t.substring(0, t.indexOf("@"));
                else e = "";
            else e = t;
            this.__loginModule._$setUsername(e) } };
    v.__doLogin = function() {
        if (!this.__doLoginLock) { this.__doLoginLock = 1;
            this.__loginModule._$stateOK(this.__doLoginCb._$bind(this)) } };
    v.__doLoginCb = function(t, e) {
        var i, n = "-103";
        this.__pass = t;
        this.__errKey = e;
        if (this.__hasInit) {
            if (t && this.__hasInit) this.__doLoginReal.call(this);
            else if (1 === this.__errMode) { this.__doLoginLock = 0;
                if ("email" === e && !this.__nameinput.value) r._$showError(this.__nameinput, "请输入帐号", "nerror");
                else if ("password" === e && !this.__passwordinput.value) r._$showError(this.__passwordinput, "请输入密码", "nerror");
                else if ("tcheckcode" === e && !this.__checkcodeinput.value) r._$showError(this.__checkcodeinput, "请输入验证码", "nerror");
                else if ("slidecap" === e) {
                    if (this.__loginModule) i = 2 == this.__loginModule.__slideTarget ? "请滑动验证码" : "请点击验证码";
                    r._$showError(this.__checkcodeinput, i, "nerror") } } } else r._$showFail(n, "登录") };
    v.__doLoginReal = function() {
        return function() {
            if (this.__pass && this.__hasInit) { r._$timeCount("LOGIN_TIME");
                var t = this.__loginModule._$getValues(),
                    e = {};
                t[0] = t[0].trim();
                e.un = this.__domain ? t[0] + this.__domain : t[0];
                e.pw = MP.encrypt2(t[1]);
                e.pd = this.__product;
                e.l = this.__unLoginChecked ? 1 : 0;
                e.d = this.__unLoginTime;
                e.t = (new Date).getTime();
                e.pkid = this.__promark;
                this.__username = e.un;
                this.__password = t[1];
                this.__safeLogin(e) } } }();
    v.__safeLogin = function() {
        var t = function(t) {
            var e = [],
                i = {};
            n._$forEach(t, function(t) {
                if (!i[t]) { i[t] = 1;
                    e.push(t) } });
            return e };
        var e = function(e, i, n) {
            if (n) {
                var r = e.split("@")[1];
                i = i + (i ? "," : "") + r }
            i = i.replace("vip.188.com", "188.com");
            var s = i.split(",");
            s = t(s);
            return s.join(",") };
        return function(t) { t.domains = this.__domains || "";
            t.domains = e(t.un, t.domains, this.__autoSuffix);
            if (this.__loginModule && this.__password) this.__loginModule._$setPwd(this.__password);
            if (this.__lazyCheck && this.__capFlag) { this.__dataTemp = t;
                if (1 == this.__capFlag) this.__doLazyCheck();
                else this.__doLazyCheckSlide() } else this.__getLoginTicket(t) } }();
    v.__doLazyCheckSlide = function() { this.__loginModule._$verifyCap() };
    v.__onSlideOk = function() {
        if (this.__dataTemp) this.__getLoginTicket(this.__dataTemp) };
    v.__doLazyCheck = function() {
        var t = this.__loginModule._$getSmsValue();
        if (!this.__checkSmsCodeLock) { this.__checkSmsCodeLock = 1;
            var e = this.__nameinput.value.trim();
            e = this.__domain ? e + this.__domain : e;
            var i = { cap: t, pd: this.__product, pkid: this.__promark };
            i.un = e;
            s._$request("checkSmsCode", i, this.__cbSmsCode._$bind(this), this.__ckSmsCodeEx._$bind(this, "验证码输入错误"), 1, this.__product) } };
    v.__cbSmsCode = function() { this.__checkSmsCodeLock = 0;
        if (this.__dataTemp) this.__getLoginTicket(this.__dataTemp) };
    v.__ckSmsCodeEx = function(t, e) { this.__checkSmsCodeLock = 0;
        this.__doLoginLock = 0;
        this.__loginModule.__ckSmsCodeEx(t, e) };
    v.__getLoginTicket = function(t) {
        if (!this.__getTkLock) {
            var e = {};
            e.un = t.un;
            e.pkid = this.__promark;
            e.pd = this.__product;
            this.__getTkLock = 1;
            s._$request("getLoginTicket", e, this.__gltSuccess._$bind(this, t), this.__gltWarn._$bind(this), 1, this.__product) } };
    v.__gltSuccess = function(t, e) { this.__getTkLock = 0;
        var i = e.ret;
        this.__tk = e.tk;
        if (201 == i) { t.tk = this.__tk;
            t.pwdKeyUp = this.__pwdKeyUp || 0;
            s._$request("safelogin", t, this.__loginSuccess._$bind(this), this.__cbWarn._$bind(this), 1, this.__product) } else {
            var n = l[i] || r._$getErrorTxt(e.ret);
            _gaq.push(["_trackEvent", "登录结果", "登录失败", "【" + i + "-gt】" + n]);
            r._$showError(null, n, "nerror") } };
    v.__gltWarn = function(t) { this.__doLoginLock = 0;
        this.__getTkLock = 0;
        var e = t.ret || 0;
        this.__showCheckCode(t);
        var i = l[e] || r._$getErrorTxt(t.ret);
        var n = t.dt || "gt";
        _gaq.push(["_trackEvent", "登录结果", "登录失败", "【" + e + "-" + n + "】" + i]);
        if ("441" != e && "444" != e && "445" != e) r._$showError(null, i, "nerror") };
    v.__setLlpTime = function() {
        r._$showError(0, '已开启登录保护，请打开<a class="u-llp-color1" style="color:#2c85ff;" href="https://id.163.com/gj" target="_blank">网易帐号管家</a>完成验证   <span class="u-llp-color2" style="color:#2c85ff;">' + this.__llpNumber + '</span>秒后超时。<a class="u-llp-color3" style="color:#2c85ff;" href="https://id.163.com/gj/faq/s/p_o.html?ct=1" target="_blank">无法收到验证消息?</a>', "nerror", 3);
    };
    v.__lockLoginState = function() {
        if (!this.__isAppSafe) { this.__isAppSafe = 1;
            this.__loginBtn = e._$getByClassName(document, "u-loginbtn")[0];
            this.__nameinput.disabled = !0;
            this.__passwordinput.disabled = !0;
            if (this.__checkcodeinput) this.__checkcodeinput.disabled = !0;
            if (this.__pwdtext) this.__pwdtext.disabled = !0;
            this.__loginBtnTxt = this.__loginBtn.innerHTML;
            this.__loginBtn.innerHTML = "取消登录";
            setTimeout(function() { this.__llpNumber = 120;
                this.__setLlpTime();
                this.__safeItl2 = clearInterval(this.__safeItl2);
                this.__safeItl = clearInterval(this.__safeItl);
                this.__safeItl2 = setInterval(this.__setSafeItl._$bind(this), b);
                this.__startllp = 0;
                this.__safeItl = setInterval(this.__doCheckLlp._$bind(this), y);
                e._$dataset(this.__loginBtn, "action", "dounlocklogin") }._$bind(this), 200) } };
    v.__setSafeItl = function() { this.__llpNumber--;
        if (this.__llpNumber < 0) this.__safeItl2 = clearInterval(this.__safeItl2);
        else this.__setLlpTime() };
    v.__doCheckLlp = function() { this.__startllp++;
        var t = this.__checkLlpTimeout();
        if (!t) {
            var e = { uuid: this.__uuid, pd: this.__product, pkid: this.__promark };
            s._$request("llp", e, this.__llpOK._$bind(this), this.__llpFail._$bind(this), 1, this.__product) } };
    v.__checkLlpTimeout = function() {
        if (this.__startllp > 59) { this.__unLockLoginState(1);
            setTimeout(function() { r._$showError(null, "登录验证超时，请重新登录", "nerror", 2) }, 200);
            return 1 }
        return 0 };
    v.__llpFail = function(t) {
        var e = t.ret;
        if ("401" == e) { this.__unLockLoginState(1);
            setTimeout(function() { r._$showError(null, "登录验证超时，请重新登录", "nerror", 2) }, 200) }
        if ("446" == e) { this.__unLockLoginState(1);
            setTimeout(function() { r._$showError(null, "网易帐号管家已拒绝本次登录", "nerror", 2) }, 200) } };
    v.__llpOK = function(t) {
        var e = t.ret;
        if ("201" == e) { this.__safeItl2 = clearInterval(this.__safeItl2);
            this.__safeItl = clearInterval(this.__safeItl);
            this.__loginSuccess(t) } };
    v.__unLockLoginState = function(t) { this.__safeItl2 = clearInterval(this.__safeItl2);
        this.__safeItl = clearInterval(this.__safeItl);
        this.__isAppSafe = 0;
        t = t || 0;
        this.__doBack(t);
        this.__loginBtn.innerHTML = this.__loginBtnTxt;
        e._$dataset(this.__loginBtn, "action", "dologin") };
    v.__loginSuccess = function(t) { this.__doLoginLock = 0;
        this.__pwdKeyUp = 0;
        _gaq.push(["_trackEvent", "登录结果", "登录成功", "【登录成功】from:" + this.__product + ",domain:" + this.__username.substring(this.__username.indexOf("@"))]);
        var e = r._$timeCountEnd("LOGIN_TIME");
        if (e > 0) { _gaq.push(["_trackEvent", "登录效率", "耗时【" + 50 * Math.ceil(e / 50) + "ms】", "详细耗时【" + e + "ms】"]);
            e = -1 }
        _._$cookie("THE_LAST_LOGIN", { value: this.__username, expires: 30 });
        if (t.unprotectedGuide) {
            if (t.nextUrls) this.__setDomains({ type: "fksuccess", username: this.__username || "", nextUrls: t.nextUrls });
            this.__showLeak(3) } else if (t.safeMobileGuide) {
            if (t.nextUrls) this.__setDomains({ type: "fksuccess", username: this.__username || "", nextUrls: t.nextUrls });
            this.__showLeak(4, t) } else this.__setDomains({ type: "success", username: this.__username || "", nextUrls: t.nextUrls }) };
    v.__cbWarn = function(t) { this.__pwdKeyUp = 0;
        this.__doLoginLock = 0;
        var e = t.ret,
            i;
        if ("438" != e) {
            if ("408" == e) r._$showError(0, '已开启登录保护，请打开<a class="u-app-color" style="color:#2c85ff;" href="https://id.163.com/gj" target="_blank">网易帐号管家</a>绑定帐号并重新登录验证', "nerror", 3);
            else if (t) {
                if ("423" == e) { _gaq.push(["_trackEvent", "登录结果", "登录异常", "【423】风控帐号"]);
                    this.__setDomains({ type: "fksuccess", username: this.__username || "", nextUrls: t.nextUrls });
                    this.__showLeak(1) } else if ("428" == e) { _gaq.push(["_trackEvent", "登录结果", "登录异常", "【428】标记帐号"]);
                    this.__showLeak(2) } else if ("401" == e) { i = l[e] || r._$getErrorTxt(t.ret);
                    _gaq.push(["_trackEvent", "登录结果", "登录失败", "【401-" + (t.dt || "00") + "】参数错误"]);
                    r._$showError(null, i, "nerror") } else if ("501" == e) { _gaq.push(["_trackEvent", "登录结果", "登录异常", "【501】"]);
                    this.__showFail(e) } else if ("500" == e) { _gaq.push(["_trackEvent", "登录结果", "登录异常", "【500】"]);
                    this.__showFail(e) } else {
                    if (t.dt) e = e + "-" + t.dt;
                    if (e) { i = l[e] || r._$getErrorTxt(t.ret);
                        var n = 424 == e || 425 == e || 426 == e || 422 == e || 602 == e ? 2 : 0;
                        if (425 == e) i = i.replace("#", function() {
                            return r._$getCommonEmail(this.__username) }._$bind(this));
                        _gaq.push(["_trackEvent", "登录结果", "登录失败", "【" + e + "】" + i]);
                        if (this.__capFlag) r._$showError(null, i, "nerror", n);
                        else if ("441" != e && "444" != e && "445" != e) r._$showError(null, i, "nerror", n) } }
                var s = r._$timeCountEnd("LOGIN_TIME");
                if (s > 0) { _gaq.push(["_trackEvent", "登录效率", "耗时【" + 50 * Math.ceil(s / 50) + "ms】", "详细耗时【" + s + "ms】"]);
                    s = -1 } }
            this.__showCheckCode(t) } else { this.__uuid = t.uuid || 0;
            this.__lockLoginState() } };
    v.__showCheckCode = function(t) {
        var e;
        if (this.__loginModule)
            if (t) {
                if (t.capFlag) { t.ret = "44" + t.capFlag;
                    e = 1 }
                if ("441" == t.ret) { _gaq.push(["_trackEvent", "登录结果", "登录异常", "【411】需要图片验证码"]);
                    this.__capFlag = 1;
                    e = e || "请输入图片验证码";
                    this.__loginModule.__ckSmsCodeEx(e, t) } else if ("444" == t.ret) { _gaq.push(["_trackEvent", "登录结果", "登录异常", "【444】需要滑块验证码"]);
                    this.__capFlag = 4;
                    e = e || "请滑动验证码";
                    this.__loginModule.__ckSmsCodeEx(e, t) } else if ("445" == t.ret) { _gaq.push(["_trackEvent", "登录结果", "登录异常", "【445】需要点击验证码"]);
                    this.__capFlag = 5;
                    e = e || "请点击验证码";
                    this.__loginModule.__ckSmsCodeEx(e, t) } else if (this.__loginModule.__needSlideCap || this.__loginModule.__needCheckCode) {
                    var i = "44" + (this.__loginModule.__needSlideCap ? 2 == this.__loginModule.__slideTarget ? "4" : "5" : "1");
                    e = 1;
                    t = { ret: i };
                    this.__loginModule.__ckSmsCodeEx(e, t) } } };
    v.__hideCheckCode = function() { this.__loginModule._$hideCheckCode() };
    v.__getCheckCode = function() { this.__loginModule._$getCheckCode() };
    v.__showQrcodeModule = function() { this.__clearModule();
        var t = e._$getByClassName(this.__box, "j-headimg")[0];
        if (!this.__qrcodeModule && "qrcode" != this.__onpage) { t.style.display = "none";
            var i = h._$$QrcodeManager._$allocate({ parent: this.__cnt, opts: this.__options, product: this.__product, prdomain: this.__domain, toolName: this.__toolName, toolUrl: this.__toolUrl, sendmsg: this.__setDomains._$bind(this) });
            this.__qrcodeModule = i;
            this.__onpage = "qrcode";
            e._$addClassName(this.__qrm, "pc") } else { t.style.display = "block";
            this.__doBack(1);
            this.__onpage = "login";
            e._$delClassName(this.__qrm, "pc") } };
    v.__showFail = function(t) { _gaq.push(["_trackEvent", "异常", "登录异常", "异常【" + (l[t] || "未知异常" + t) + "】"]);
        this.__super(t) };
    v.__showFail3 = function(t, e) {
        var i = e && e.ret || "0";
        var n = this.__host || "未知产品";
        var s = window._$BGP ? "dl2失败" : "dl失败";
        _gaq.push(["_trackEvent", "初始化失败" + window._$PKID, s + "code:" + i, "e1ee1"]);
        this.__hasInit = 0;
        _gaq.push(["_trackEvent", "登录步骤", "【" + i + "】初始化", "初始化失败,from:" + n]);
        if (window._$needUrsBgp)
            if (!window._$BGP && ("0" == i || "-1" == i || "-2" == i)) { window._$BGP = 1;
                setTimeout(this._$doRefresh._$bind(this), 200);
                return }
        if ("-401" != i) this.__showFail(i);
        else { r._$showError(0, '无法登录，请<a style="color:#4aafe9;" target="_blank" href="https://www.baidu.com/s?wd=%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%80%E5%90%AFcookies">开启浏览器cookies</a>或更换浏览器后刷新重试', "nerror");
            window._$needCookieSet = 1 } };
    v.__showLeak = function(t, e) { _gaq.push(["_trackEvent", "异常", "登录异常", "异常"]);
        this.__super(t, e);
        r._$resize() }
}, 1, 2, 3, 4, 11, 28, 6, 19, 29, 30, 31, 32, 33, 34);
I$(37, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d, f, m, p) {
    var g, v, y = { email: /^[\w-\.]+@(?:[\w-]+\.)+[a-z]{2,6}$/i, sms: /^[0-9a-zA-Z]{4,6}$/, pwd: /^[0-9a-zA-Z]{6,16}$/, vip: /@vip\.163\.com|@vip\.126\.com|@188\.com/ },
        b = [
            ["@qq.com", "@sina.com", "@sina.cn", "@sohu.com", "@vip.qq.com", "@hotmail.com", "@gmail.com"],
            ["@163.com", "@126.com", "@yeah.net", "@188.com", "@vip.163.com", "@vip.126.com"]
        ],
        $ = { email: 0, pwd: 0, sms: 0 };
    d._$$Register = t._$klass();
    g = d._$$Register._$extend(l._$$Module);
    g.__checkSuffixs = function() {
        var t = b[1].join(","),
            e = this.__regDomainSuffixs.split(","),
            i = [];
        if (t == this.__regDomainSuffixs) return e;
        n._$forEach(e, function(e) {
            if (t.indexOf(e) >= 0) i.push(e) }._$bind(this));
        return i };
    g.__init = function(t) { this.__setTimeoutList = {};
        this.__opts = t.opts || {};
        this.__regDomainSuffixs = this.__opts.regDomainSuffixs || b[1].join(",");
        this.__regDomainSuffixs = this.__checkSuffixs();
        this.__regCapLazyload = this.__opts.regCapLazyload || 0;
        this.__getInitState = t.getInitState;
        this.__placeholder = this.__opts.regPlaceholder || {};
        this.__noMobileReg = this.__opts.noMobileReg || 0;
        this.__gotoLoginText = this.__opts.gotoLoginText || "去登录>>";
        this.__swidth = this.__opts.swidth || 320;
        this.__server = "captcha.reg.163.com/v2";
        if (this.__opts.productKey) this.__opts.productkey = this.__opts.productKey;
        this.__productkey = this.__opts.productkey;
        this.__hintTxt = this.__opts.hintTxt || "按住滑块，拖动完成上方拼图";
        this.__super(t) };
    g.__slideVerify = function(t) {
        if (t && t.value) this._$verifyCap();
        else this.__cbVftcpEx() };
    g.__reset = function(t) { this.__slideOpt = { element: "ScapTcha", staticServer: this.__server, apiServer: this.__server, captchaId: this.__productkey, width: this.__swidth, forceHttps: !0, alignToSpace: !0, hintTxt: this.__hintTxt, verifyCallback: this.__slideVerify._$bind(this), initCallback: this.__initCallback._$bind(this), initErrorHandler: this.__initErrorHandler._$bind(this) };
        this.__promark = this.__opts.promark;
        this.__collect = this.__opts.collect;
        this.__single = this.__opts.single;
        this.__ipts = [];
        this.codeTryTime = 0;
        this.__super(t);
        this._$hideCheckCode() };
    g.__destroy = function() { this.__initSlideCap = null;
        this.__super() };
    g.__initNode = function() { this.__super();
        this.__checkCode = e._$getByClassName(this.__body, "ckbox")[0];
        this.__slideCapBox = e._$getByClassName(this.__body, "slidebox")[0];
        this.__errorTip = e._$getByClassName(this.__body, "m-etbox")[0];
        this.__errorTipText = e._$getByClassName(this.__body, "ettext")[0];
        this.__getSmsCode = e._$getByClassName(this.__body, "getsmscode")[0];
        this.__lable = e._$getByClassName(this.__body, "u-label")[0];
        this.__cdImg = e._$getByClassName(this.__body, "ckimg")[0] };
    g.__initXGui = function() { v = r._$addNodeTemplate(s._$get("register-tmp", { gotoLoginText: this.__gotoLoginText }));
        this.__seed_html = v };
    g.__initEvent = function() {
        this.__inputs = e._$getByClassName(this.__body, "j-inputtext");
        this.__nameinput = this.__inputs[0];
        this.__passwordinput = this.__inputs[1];
        this.__smscode = this.__inputs[2];
        if (0 === this.__ipts.length) { this.__setPlaceHolder();
            n._$forEach(this.__inputs, function(t, e) {
                var i = { opts: this.__opts, node: t, form: this.__form, needClose: 1, onInput: this.__onInput._$bind(this), onfocus: this.__onFocus._$bind(this), onFocusNext: this.__onFocusNext._$bind(this), onClearInptTimeout: this.__onClearInptTimeout._$bind(this) };
                if (!e) { i.isUsername = 1;
                    i.onstate = this.__onState._$bind(this) }
                if (1 == e) i.isPwd = 1;
                var n = _._$$Input._$allocate(i);
                this.__ipts.push(n);
                if (!e && this.__regDomainSuffixs && this.__regDomainSuffixs.length > 0) n._$setSuggest(this.__regDomainSuffixs) }._$bind(this)) }
        this.__doInitDomEvent([
            [this.__cdImg, "click", this.__getImg._$bind(this)]
        ]);
        this.__emailFlag = 1
    };
    g.__onFocusNext = function() { this._stopEnter = 1;
        this.__inputs[1].focus() };
    g.__onClearInptTimeout = function(t) {
        var e = t.name;
        if (this.__setTimeoutList["invalid" + e]) this.__setTimeoutList["invalid" + e] = clearTimeout(this.__setTimeoutList["invalid" + e]);
        if (this.__setTimeoutList["valid" + e]) this.__setTimeoutList["valid" + e] = clearTimeout(this.__setTimeoutList["valid" + e]) };
    g.__onInput = function(t, e) {
        var n = i._$getElement(t) || t;
        if (this.__regCapLazyload)
            if ("" != n.value) this._$dispatchEvent("onRegCapLazyload");
        if (1 == e) this.__checkSmsCode();
        setTimeout(this.__checkNextBtn._$bind(this, t), 50) };
    g.__checkNextBtn = function() {
        var t = this.__vName();
        if (t) {
            var e = this.__nameinput.value.trim();
            if (e) a._$showError(this.__nameinput, "帐号格式错误", "nerror") }
        var i = this.__vPwd();
        var n = this.__vSms();
        var r = this.__vSlide();
        if (!this.__needSlideCap && !this.__needCheckCode)
            if (!t && !i) this._$dispatchEvent("ondisabled", 0);
            else this._$dispatchEvent("ondisabled", 1);
        else if (this.__needSlideCap)
            if (!t && !i && !r) this._$dispatchEvent("ondisabled", 0);
            else this._$dispatchEvent("ondisabled", 1);
        else if (this.__needCheckCode)
            if (!t && !i && !n) this._$dispatchEvent("ondisabled", 0);
            else this._$dispatchEvent("ondisabled", 1) };
    g.__vName = function() {
        var t = this.__nameinput.value.trim();
        if (t) return 0;
        else return 1 };
    g.__vPwd = function() {
        var t = this.__passwordinput.value.trim();
        if (t) return 0;
        else return 1 };
    g.__vSms = function() {
        if (0 == this.__cf || 1 == this.__needSlideCap) return 0;
        var t = this.__smscode.value.trim();
        if (t) return 0;
        else return 1 };
    g.__checkSmsCode = function() {
        if (0 == this.__cf || 1 == this.__needSlideCap) return 0;
        var t = this.__smscode.value.trim();
        if (y["sms"].test(t) && "-1" != $["sms"]) {
            if (this.__checkCapLock) return;
            this.__checkCapLock = 1;
            var e = { id: MP.promarkIdData[this.__promark], cap: t, channel: 2 };
            c._$request("checkCaptcha", e, function() { this.__checkCapLock = 0 }._$bind(this), this._$checkCaptchaException._$bind(this, "请输入正确的验证码")) } };
    g._$checkCaptchaException = function(t, i) { this.__checkCapLock = 0;
        if ("107" == i.ret && "02" == i.dt) { a._$removeError(this.__ipts[2].__input, "nerror");
            this.__ipts[2].__input.disabled = !0;
            e._$getByClassName(document, "u-tip")[2].style.display = "none";
            e._$getByClassName(document, "u-tip")[3].style.display = "block";
            e._$delClassName(e._$getByClassName(this.__body, "ckin")[0], "error-color");
            $["sms"] = -1;
            this.codeTryTime = this.codeTryTime ? this.codeTryTime + 1 : 1;
            _gaq.push(["_trackEvent", "注册步骤", "【3】图片验证码校验", "图片验证码校验成功,尝试次数：" + this.codeTryTime]) } else {
            if ("108" == i.ret) { this.__needSlideCap = 0;
                this.__needCheckCode = 1;
                this._$refreshCheckCode(i.ret);
                if (t) a._$showError(this.__ipts[2].__input, t, "nerror") } else if ("109" == i.ret || "110" == i.ret) { this.__needSlideCap = 1;
                this.__needCheckCode = 0;
                this._$refreshCheckCode(i.ret);
                if (t) { t = "109" == i.ret ? "请滑动验证码" : "请点击验证码";
                    a._$showError(null, t, "nerror") } } else { this._$showCheckCode();
                if (1 == $["email"] || 1 == $["pwd"]) a._$showError2(this.__ipts[2].__input, "", "nerror", 1);
                else { t = h[i.ret] || "验证码输入错误";
                    a._$showError(this.__ipts[2].__input, t, "nerror") } }
            _gaq.push(["_trackEvent", "注册步骤", "【3】图片验证码校验", "图片验证码校验失败"]) } };
    g.__onFocus = function(t) {
        if ("email" == t.name) e._$get("VIP").style.display = "none";
        a._$removeError(t, "nerror") };
    g.__initForm = function() {
        if (!this.__form) this.__form = o._$$WebForm._$allocate({ form: "register-form", oninvalid: function(t) {
                var n = "请输入",
                    r = t.code,
                    s = i._$getElement(t),
                    o = s.name;
                if (!window.outlinkflag) {
                    if ("checkcode" == o && e._$hasClassName(this.__checkCode, "f-dn") && this.__needSlideCap) t.ignore = 1;
                    if (this.__setTimeoutList["valid" + o]) this.__setTimeoutList["valid" + o] = clearTimeout(this.__setTimeoutList["valid" + o]);
                    this.__setTimeoutList["invalid" + o] = setTimeout(function(i) {
                        var o = i;
                        if ("checkcode" != o || !e._$hasClassName(this.__checkCode, "f-dn"))
                            if ("slidecap" != o || e._$hasClassName(this.__slideCapBox, "f-dn")) {
                                if (r == -1) {
                                    if ("email" == o) n += this.__emailFlag ? "手机号或帐号" : "帐号";
                                    if ("password" == o) n += "密码";
                                    if ("checkcode" == o) n = "请输入图片验证码" } else if (r == -4 || r == -2 || r == -3) { n = "格式错误";
                                    if ("email" == o) n = "帐号" + n;
                                    if ("password" == o) n = "密码" + n;
                                    if ("checkcode" == o) n = "请输入图片验证码" }
                                if ("slidecap" == o && e._$hasClassName(this.__slideCapBox, "f-dn")) this.__states[o] = 0;
                                else this.__states[o] = 1;
                                if (r != -1) {
                                    if ("email" == o) $["email"] = 1;
                                    else if ("password" == o) {
                                        if (1 == $["email"]) { a._$showError2(s, n, "nerror", 1);
                                            return }
                                        $["pwd"] = 1 } else if ("checkcode" == o) {
                                        if (1 == $["email"] || 1 == $["pwd"]) { a._$showError2(s, n, "nerror", 1);
                                            return }
                                        $["sms"] = 1 }
                                    a._$showError(s, n, "nerror") } else if ("email" == o) $["email"] = 0;
                                else if ("password" == o) $["pwd"] = 0;
                                else if ("checkcode" == o) $["sms"] = 0 } else if (!this.__vSlide()) this.__states["slidecap"] = 0;
                        else this.__states["slidecap"] = 1;
                        else {
                            if (this.__needSlideCap) t.ignore = 1;
                            this.__states[o] = 0 } }._$bind(this, o), 100);
                    t.stopped = !0 } else if (!this.__refocus && 1 == window.outlinkflag) this.__refocus = setTimeout(function() { this.__refocus = clearTimeout(this.__refocus);
                    s.focus() }._$bind(this), 200) }._$bind(this), onvalid: function(t) {
                var e = i._$getElement(t),
                    n = e.name;
                var r;
                if (this.__setTimeoutList["invalid" + n]) this.__setTimeoutList["invalid" + n] = clearTimeout(this.__setTimeoutList["invalid" + n]);
                this.__setTimeoutList["valid" + n] = setTimeout(function(t) {
                    var i = t;
                    this.__states[i] = 0;
                    if ("email" == i);
                    else if ("password" == i) { r = this.__checkPwd(e.value);
                        if (r) { this.__states[i] = 1;
                            if (1 == $["email"]) a._$showError2(e, r, "nerror", 1);
                            else { $["pwd"] = 1;
                                a._$showError(e, r, "nerror") }
                            _gaq.push(["_trackEvent", "注册步骤", "【2】密码输入", "密码输入失败，err：" + r]);
                            return } else if (1 == $["pwd"]) { a._$removeError(e, "nerror");
                            $["pwd"] = 0;
                            _gaq.push(["_trackEvent", "注册步骤", "【2】密码输入", "密码输入成功，长度：" + (e.value || "").length]) } } else if ("checkcode" == i) {
                        var n = this.__checkSms(e.value);
                        if (n && 1 == $["sms"]) a._$removeError(e, "nerror") }
                    var s = e.value.trim(),
                        o = s.split("@"),
                        _ = o[0],
                        c = o[1];
                    if ("email" == i) { r = this.__doCheckSuffix(c);
                        if (r) { $["email"] = 1;
                            this.__states[i] = 1;
                            a._$showError(e, r, "nerror");
                            return } }
                    var h = "email" == i && a._$isNeteaseEmail(c);
                    var u = !(a._$checkMobile(_) && "163.com" == c);
                    if (h && this.__noMobileReg || !this.__noMobileReg && h && u) { r = this.__checkEmail(s);
                        if (r) { $["email"] = 1;
                            this.__states[i] = 1;
                            a._$showError(e, r, "nerror");
                            return } } }._$bind(this, n), 100);
                t.stopped = !0 }._$bind(this) }) };
    g.__checkPwd = function(t) {
        var e = this.__nameinput.value.trim() || "";
        return a._$checkPwd(t, e) };
    g.__checkSms = function() {
        return 1 };
    g.__doCheckSuffix = function() {};
    g.__checkEmail = function(t, e) {
        var i, n, r;
        if (t.indexOf("@") >= 0) { r = t.split("@");
            t = r[0];
            i = r[1] }
        if (a._$isBadNetease(t)) {
            if (!/^[a-zA-Z]/.test(t))
                if ("163.com" == i) n = h.CHECK_URS_BAD_MB;
                else n = h.CHECK_URS_BAD_BEGIN;
            else if (!/([a-zA-Z]|\d)$/.test(t)) n = h.CHECK_URS_BAD_END;
            else if (t.length < 6 || t.length > 18) n = h.CHECK_URS_BAD_LENGTH;
            else n = h.CHECK_URS_BAD_ILLEGAL;
            if (n && !e) { this.__states["email"] = 1;
                a._$showError(this.__nameinput, n, "nerror");
                return n } } else return !1 };
    g.__onState = function(t, e) {
        if (!window.outlinkflag) {
            if (t) {
                var i = this.__nameinput.value.trim(),
                    n = i.split("@"),
                    r = n[0],
                    s = n[1];
                var o = this.__doCheckSuffix(s);
                if (!o) {
                    if (a._$checkMobile(r) && "163.com" == s) { this.__isMobile = 1;
                        if (this.__noMobileReg && this.__checkEmail(r)) return } else { this.__isMobile = 0;
                        if (a._$isNeteaseEmail(s)) {
                            if (this.__checkEmail(r)) return } else; }
                    this.__username = this.__isMobile ? r : i;
                    if (t) { a._$removeError(this.__nameinput, "nerror");
                        this._$doCheckName() } } } } else if (!this.__refocus && 1 == window.outlinkflag) this.__refocus = setTimeout(function() { this.__refocus = clearTimeout(this.__refocus);
            e.focus() }._$bind(this), 200) };
    g._$doCheckName = function() {
        if (this.__getInitState()) {
            var t = { id: MP.promarkIdData[this.__promark], un: this.__username, channel: 2 };
            if (!y.vip.test(this.__username)) { this.__collect._$check();
                c._$request("checkName", t, function() { $["email"] = 0;
                    this._$dispatchEvent("canpass", 1);
                    var t = this.__username.substring(this.__username.indexOf("@")).toLocaleLowerCase();
                    _gaq.push(["_trackEvent", "注册步骤", "【1】帐号输入", "帐号可注册：" + t]) }._$bind(this), this._$checkNameException._$bind(this)) } else {
                var i = this.__username.substring(this.__username.indexOf("@"));
                var n = "//vpay.vip.163.com/vippayunion/index.html";
                if ("@188.com" === i.toLocaleLowerCase()) n = "//reg.188.com/register.m?from=ursreg";
                else if ("@vip.126.com" === i.toLocaleLowerCase()) n = "//reg.vip.126.com/register.m?from=ursreg";
                e._$get("a-vip").setAttribute("href", n);
                var r = e._$get("VIP");
                if (!e._$hasClassName(r, "fur-vip")) e._$addClassName(r, "fur-vip");
                r.style.display = "block" } } };
    g._$setCFModule = function(t) { this.__cf = t };
    g._$checkNameException = function(t) {
        var e, i, n = t.ret;
        if ("500" == n) this._$dispatchEvent("onfail", 1);
        else if ("106" == n && !MP.TICKET) { i = "EXCEPTION_CHECK_NAME_" + n;
            e = h[i] || h[n] || a._$getErrorTxt(t.ret) } else if ("407" == n && this.__isMobile) { e = "该帐号已注册，你可以直接登录。若继续注册，原帐号资料会被清空，你将获得一个全新帐号";
            if (!this.__single) e = '该帐号已注册，你可以<a data-action="changepage" class="" href="javascript:void(0);" >直接登录</a>。若继续注册，原帐号资料会被清空，你将获得一个全新帐号';
            this._$dispatchEvent("setmbreged", 1);
            this._$dispatchEvent("canpass", 1);
            a._$showError(this.__nameinput, e, "nerror", 2);
            _gaq.push(["_trackEvent", "注册步骤", "【1】帐号输入", "手机邮已注册提示"]);
            return } else { i = "EXCEPTION_CHECK_NAME_" + n;
            e = h[i] || h[n] || a._$getErrorTxt(t.ret) }
        if (e) { a._$showError(this.__nameinput, e, "nerror");
            _gaq.push(["_trackEvent", "注册步骤", "【1】帐号输入", "帐号输入报错[" + e + "]"]) }
        $["email"] = 1;
        this._$dispatchEvent("canpass", 0);
        this._$dispatchEvent("setmbreged", 0) };
    g._$checkEndException = function(t) {
        var e, i, n = t.ret;
        if ("500" == n) this._$dispatchEvent("onfail", 1);
        else if ("106" == n && !MP.TICKET) { i = "EXCEPTION_CHECK_NAME_" + n;
            e = h[i] || h[n] || a._$getErrorTxt(t.ret);
            return } else { i = "EXCEPTION_GET_TICKET_" + n;
            e = h[i] || h[n] || a._$getErrorTxt(t.ret) }
        if (e) a._$showError(null, e, "nerror") };
    g._$isMobile = function() {
        return this.__isMobile };
    g._$fastRegException = function(t, e) {
        var i, n, r;
        if (e) r = t;
        else { i = t.ret;
            n = "EXCEPTION_FAST_REG_" + i;
            r = h[n] || h[i] || a._$getErrorTxt(t.ret) }
        a._$showError(null, r, "nerror") };
    g._$showCheckCode = function() { this._$hideCheckCode();
        this.__states["checkcode"] = 1;
        this.__needCheckCode = 1;
        e._$delClassName(this.__checkCode, "f-dn");
        this.__getImg();
        this._$dispatchEvent("ondisabled", 1);
        this.__checkNextBtn();
        setTimeout(function() { a._$resize() }, 200) };
    g.__getImg = function() { this.__ipts[2].__input.disabled = !1;
        this.__ipts[2]._$onClear();
        $["sms"] = 0;
        e._$getByClassName(document, "u-tip")[3].style.display = "none";
        this.__cdImg.src = MP.getCaptcha(MP.promarkIdData[this.__promark]) };
    g._$verifyCap = function() {
        var t = this.__myCaptcha.getPwd();
        var e = this.__myCaptcha.getCt();
        var i = { id: MP.promarkIdData[this.__promark], cap: t, capkey: this.__productkey };
        i.ct = e;
        var n = 2 == this.__slideTarget ? "regvftcp" : "regvfccp";
        c._$request(n, i, this.__cbVftcp._$bind(this), this.__cbVftcpEx._$bind(this))
    };
    g.__cbVftcpEx = function(t, e) {
        var i, n;
        if (t && "107" == t.ret && "02" == t.dt) this.__cbVftcp();
        else if (t) { i = t.ret;
            if ("108" == i) { this.__needSlideCap = 0;
                this.__needCheckCode = 1;
                this._$refreshCheckCode(i);
                n = h[i];
                if (!e) a._$showError(null, n, "nerror") } else if ("109" == i || "110" == i) { this.__needSlideCap = 1;
                this.__needCheckCode = 0;
                this._$refreshCheckCode(i);
                if (!e) a._$showError(null, this.__slideTxt, "nerror") } else { n = h[i];
                a._$showError(null, n, "nerror");
                this._$getSlideCap() } } else a._$showError(null, this.__slideTxt, "nerror") };
    g._$getErrorFlag = function() {
        return $ };
    g._$focusHelper = function() { this.__nameinput.focus() }
}, 1, 2, 3, 4, 6, 19, 71, 11, 72, 28, 35, 80, 70);
I$(39, function(t, e, i, n, r, s, o, a, _, c, h) {
    var u;
    a._$$Collect = t._$klass();
    u = a._$$Collect._$extend(r._$$EventTarget);
    u.__init = function(t) { this.__super(t) };
    u.__reset = function(t) { this.__super(t);
        this.__el = t.holder;
        this.__threMouse = t.threMouse || 32;
        this.__threKey = t.threKey || 32;
        this.__initEvent();
        this.__timeBase = new Date;
        this._events = { scrSx: 0, scrSy: 0, winLF: 0, winSx: 0, winSy: 0, winPx: 0, winPy: 0, ursSx: 0, ursSy: 0, ursPx: 0, ursPy: 0, pw1Sx: 0, pw1Sy: 0, pw1Px: 0, pw1Py: 0, check: 0, mouseN: 0, mouseL: [], mouseT: 0, keyN: 0, keyL: [], keyT: 0 } };
    u.__initEvent = function() {
        var t = [
            [this.__el, "mousedown", this.__onMouseDown._$bind(this)],
            [this.__el, "keydown", this.__onKeyDown._$bind(this)]
        ];
        this.__doInitDomEvent(t) };
    u.__onMouseDown = function(t) {
        var e = new Date;
        if (this._events.mouseL.length > this.__threMouse) { this._events.mouseL = [];
            this._events.mouseT++ }
        this._events.mouseL.push([t.which, e - this.__timeBase]);
        this._events.mouseN++ };
    u.__onKeyDown = function(t) {
        var e = new Date;
        var i = "T";
        if (this._events.keyL.length > this.__threKey) { this._events.keyL = [];
            this._events.keyT++ }
        var n = t.keyCode;
        if (n >= 48 && n <= 57 || n >= 96 && n <= 105) i = "D";
        else if (n >= 65 && n <= 90) i = "S";
        this._events.keyL.push([i, e - this.__timeBase]);
        this._events.keyN++ };
    u._$check = function() { this._events.check++ };
    u._$getEvents = function() {
        return this._events } }, 1, 2, 3, 4, 5, 11, 77);
I$(107, '<div {#if hidden}class="j-country u-country f-dn"{#else}class="j-country u-country"{/if} on-click="{this.onClick($event)}">\n<a href="javascript:void(0);" class="flag-AL" data-code="+355-"><em>&nbsp;</em>阿尔巴尼亚(Shqipëria) +355</a><a href="javascript:void(0);" class="flag-DZ" data-code="+213-"><em>&nbsp;</em>阿尔及利亚(‫الجزائر‬‎) +213</a><a href="javascript:void(0);" class="flag-AF" data-code="+93-"><em>&nbsp;</em>阿富汗(‫افغانستان‬‎) +93</a><a href="javascript:void(0);" class="flag-AR" data-code="+54-"><em>&nbsp;</em>阿根廷(Argentina) +54</a><a href="javascript:void(0);" class="flag-AE" data-code="+971-"><em>&nbsp;</em>阿拉伯联合大公国(‫الإمارات العربيّة المتّحدة‬‎) +971</a><a href="javascript:void(0);" class="flag-AW" data-code="+297-"><em>&nbsp;</em>阿鲁巴(Aruba) +297</a><a href="javascript:void(0);" class="flag-OM" data-code="+968-"><em>&nbsp;</em>阿曼(‫عمان‬‎) +968</a><a href="javascript:void(0);" class="flag-AZ" data-code="+994-"><em>&nbsp;</em>阿塞拜疆(Azərbaycan) +994</a><a href="javascript:void(0);" class="flag-EG" data-code="+20-"><em>&nbsp;</em>埃及(‫مصر‬‎) +20</a><a href="javascript:void(0);" class="flag-ET" data-code="+251-"><em>&nbsp;</em>埃塞俄比亚(Ityop\'iya) +251</a><a href="javascript:void(0);" class="flag-IE" data-code="+353-"><em>&nbsp;</em>爱尔兰(Ireland) +353</a><a href="javascript:void(0);" class="flag-EE" data-code="+372-"><em>&nbsp;</em>爱沙尼亚(Eesti) +372</a><a href="javascript:void(0);" class="flag-AD" data-code="+376-"><em>&nbsp;</em>安道尔(Andorra) +376</a><a href="javascript:void(0);" class="flag-AO" data-code="+244-"><em>&nbsp;</em>安哥拉(Angola) +244</a><a href="javascript:void(0);" class="flag-AI" data-code="+1264-"><em>&nbsp;</em>安圭拉(Anguilla) +1264</a><a href="javascript:void(0);" class="flag-AG" data-code="+1268-"><em>&nbsp;</em>安提瓜和巴布达(Antigua and Barbuda) +1268</a><a href="javascript:void(0);" class="flag-AT" data-code="+43-"><em>&nbsp;</em>奥地利(Österreich) +43</a><a href="javascript:void(0);" class="flag-AU" data-code="+61-"><em>&nbsp;</em>澳大利亚(Australia) +61</a><a href="javascript:void(0);" class="flag-MO" data-code="+853-"><em>&nbsp;</em>澳门地区(Macau) +853</a><a href="javascript:void(0);" class="flag-BB" data-code="+1246-"><em>&nbsp;</em>巴巴多斯(Barbados) +1246</a><a href="javascript:void(0);" class="flag-PG" data-code="+675-"><em>&nbsp;</em>巴布亚新几内亚 +675</a><a href="javascript:void(0);" class="flag-BS" data-code="+1242-"><em>&nbsp;</em>巴哈马(Bahamas) +1242</a><a href="javascript:void(0);" class="flag-PK" data-code="+92-"><em>&nbsp;</em>巴基斯坦(‫پاکستان‬‎) +92</a><a href="javascript:void(0);" class="flag-PY" data-code="+595-"><em>&nbsp;</em>巴拉圭(Paraguay) +595</a><a href="javascript:void(0);" class="flag-PS" data-code="+970-"><em>&nbsp;</em>巴勒斯坦领土(Palestinian Territories) +970</a><a href="javascript:void(0);" class="flag-BH" data-code="+973-"><em>&nbsp;</em>巴林(‫البحرين‬‎) +973</a><a href="javascript:void(0);" class="flag-PA" data-code="+507-"><em>&nbsp;</em>巴拿马(Panamá) +507</a><a href="javascript:void(0);" class="flag-BR" data-code="+55-"><em>&nbsp;</em>巴西(Brasil) +55</a><a href="javascript:void(0);" class="flag-BY" data-code="+375-"><em>&nbsp;</em>白俄罗斯(Белару́сь) +375</a><a href="javascript:void(0);" class="flag-BM" data-code="+1441-"><em>&nbsp;</em>百慕大(Bermuda) +1441</a><a href="javascript:void(0);" class="flag-BG" data-code="+359-"><em>&nbsp;</em>保加利亚(България) +359</a><a href="javascript:void(0);" class="flag-BJ" data-code="+229-"><em>&nbsp;</em>贝宁(Bénin) +229</a><a href="javascript:void(0);" class="flag-BE" data-code="+32-"><em>&nbsp;</em>比利时(België) +32</a><a href="javascript:void(0);" class="flag-IS" data-code="+354-"><em>&nbsp;</em>冰岛(Ísland) +354</a><a href="javascript:void(0);" class="flag-PR" data-code="+1787-"><em>&nbsp;</em>波多黎各(Puerto Rico) +1787</a><a href="javascript:void(0);" class="flag-PL" data-code="+48-"><em>&nbsp;</em>波兰 +48</a><a href="javascript:void(0);" class="flag-BA" data-code="+387-"><em>&nbsp;</em>波斯尼亚和黑塞哥维那(Bosna i Hercegovina) +387</a><a href="javascript:void(0);" class="flag-BO" data-code="+591-"><em>&nbsp;</em>玻利维亚(Bolivia) +591</a><a href="javascript:void(0);" class="flag-BZ" data-code="+501-"><em>&nbsp;</em>伯利兹(Belize) +501</a><a href="javascript:void(0);" class="flag-BW" data-code="+267-"><em>&nbsp;</em>博茨瓦纳(Botswana) +267</a><a href="javascript:void(0);" class="flag-BT" data-code="+975-"><em>&nbsp;</em>不丹(འབྲུག་ཡུལ་) +975</a><a href="javascript:void(0);" class="flag-BF" data-code="+226-"><em>&nbsp;</em>布基纳法索(Burkina Faso) +226</a><a href="javascript:void(0);" class="flag-BI" data-code="+257-"><em>&nbsp;</em>布隆迪(Uburundi) +257</a><a href="javascript:void(0);" class="flag-KP" data-code="+850-"><em>&nbsp;</em>朝鲜 +850</a><a href="javascript:void(0);" class="flag-GQ" data-code="+240-"><em>&nbsp;</em>赤道几内亚(Guinea Ecuatorial) +240</a><a href="javascript:void(0);" class="flag-DK" data-code="+45-"><em>&nbsp;</em>丹麦(Danmark) +45</a><a href="javascript:void(0);" class="flag-DE" data-code="+49-"><em>&nbsp;</em>德国(Deutschland) +49</a><a href="javascript:void(0);" class="flag-TL" data-code="+670-"><em>&nbsp;</em>东帝汶 +670</a><a href="javascript:void(0);" class="flag-TG" data-code="+228-"><em>&nbsp;</em>多哥(Togo) +228</a><a href="javascript:void(0);" class="flag-DM" data-code="+1767-"><em>&nbsp;</em>多米尼加(Dominica) +1767</a><a href="javascript:void(0);" class="flag-DO" data-code="+1809-"><em>&nbsp;</em>多明尼加共和国(Dominican Republic) +1809</a><a href="javascript:void(0);" class="flag-RU" data-code="+7-"><em>&nbsp;</em>俄罗斯(Россия) +7</a><a href="javascript:void(0);" class="flag-EC" data-code="+593-"><em>&nbsp;</em>厄瓜多尔(Ecuador) +593</a><a href="javascript:void(0);" class="flag-ER" data-code="+291-"><em>&nbsp;</em>厄立特里亚(Ertra) +291</a><a href="javascript:void(0);" class="flag-FR" data-code="+33-"><em>&nbsp;</em>法国(France) +33</a><a href="javascript:void(0);" class="flag-FO" data-code="+298-"><em>&nbsp;</em>法罗群岛(Faroe Islands) +298</a><a href="javascript:void(0);" class="flag-PF" data-code="+689-"><em>&nbsp;</em>法属波利尼西亚(French Polynesia) +689</a><a href="javascript:void(0);" class="flag-GF" data-code="+594-"><em>&nbsp;</em>法属圭亚那(French Guiana) +594</a><a href="javascript:void(0);" class="flag-PH" data-code="+63-"><em>&nbsp;</em>菲律宾 +63</a><a href="javascript:void(0);" class="flag-FJ" data-code="+679-"><em>&nbsp;</em>斐济(Fiji) +679</a><a href="javascript:void(0);" class="flag-FI" data-code="+358-"><em>&nbsp;</em>芬兰(Suomi) +358</a><a href="javascript:void(0);" class="flag-CV" data-code="+238-"><em>&nbsp;</em>佛得角(Cabo Verde) +238</a><a href="javascript:void(0);" class="flag-GM" data-code="+220-"><em>&nbsp;</em>冈比亚(Gambia) +220</a><a href="javascript:void(0);" class="flag-CG" data-code="+242-"><em>&nbsp;</em>刚果共和国(Congo [Republic]) +242</a><a href="javascript:void(0);" class="flag-CD" data-code="+243-"><em>&nbsp;</em>刚果民主共和国(Congo [DRC]) +243</a><a href="javascript:void(0);" class="flag-CO" data-code="+57-"><em>&nbsp;</em>哥伦比亚(Colombia) +57</a><a href="javascript:void(0);" class="flag-CR" data-code="+506-"><em>&nbsp;</em>哥斯达黎加(Costa Rica) +506</a><a href="javascript:void(0);" class="flag-GD" data-code="+1473-"><em>&nbsp;</em>格林纳达(Grenada) +1473</a><a href="javascript:void(0);" class="flag-GL" data-code="+299-"><em>&nbsp;</em>格陵兰(Greenland) +299</a><a href="javascript:void(0);" class="flag-GE" data-code="+995-"><em>&nbsp;</em>格鲁吉亚(საქართველო) +995</a><a href="javascript:void(0);" class="flag-CU" data-code="+53-"><em>&nbsp;</em>古巴(Cuba) +53</a><a href="javascript:void(0);" class="flag-GP" data-code="+590-"><em>&nbsp;</em>瓜德罗普岛(Guadeloupe) +590</a><a href="javascript:void(0);" class="flag-GU" data-code="+1671-"><em>&nbsp;</em>关岛(Guam) +1671</a><a href="javascript:void(0);" class="flag-GY" data-code="+592-"><em>&nbsp;</em>圭亚那(Guyana) +592</a><a href="javascript:void(0);" class="flag-KZ" data-code="+7-"><em>&nbsp;</em>哈萨克斯坦(Россия) +7</a><a href="javascript:void(0);" class="flag-HT" data-code="+509-"><em>&nbsp;</em>海地(Haïti) +509</a><a href="javascript:void(0);" class="flag-KR" data-code="+82-"><em>&nbsp;</em>韩国(한국) +82</a><a href="javascript:void(0);" class="flag-NL" data-code="+31-"><em>&nbsp;</em>荷兰(Nederland) +31</a><a href="javascript:void(0);" class="flag-AN" data-code="+599-"><em>&nbsp;</em>荷属安的列斯群岛(Netherlands Antilles) +599</a><a href="javascript:void(0);" class="flag-ME" data-code="+382-"><em>&nbsp;</em>黑山(Црна Гора) +382</a><a href="javascript:void(0);" class="flag-HN" data-code="+504-"><em>&nbsp;</em>洪都拉斯(Honduras) +504</a><a href="javascript:void(0);" class="flag-DJ" data-code="+253-"><em>&nbsp;</em>吉布提(Djibouti) +253</a><a href="javascript:void(0);" class="flag-KG" data-code="+996-"><em>&nbsp;</em>吉尔吉斯斯坦(Кыргызстан) +996</a><a href="javascript:void(0);" class="flag-GN" data-code="+224-"><em>&nbsp;</em>几内亚(Guinée) +224</a><a href="javascript:void(0);" class="flag-GW" data-code="+245-"><em>&nbsp;</em>几内亚比绍 +245</a><a href="javascript:void(0);" class="flag-CA" data-code="+1-"><em>&nbsp;</em>加拿大(United States) +1</a><a href="javascript:void(0);" class="flag-GH" data-code="+233-"><em>&nbsp;</em>加纳(Ghana) +233</a><a href="javascript:void(0);" class="flag-GA" data-code="+241-"><em>&nbsp;</em>加蓬(Gabon) +241</a><a href="javascript:void(0);" class="flag-KH" data-code="+855-"><em>&nbsp;</em>柬埔寨(Kampuchea) +855</a><a href="javascript:void(0);" class="flag-CZ" data-code="+420-"><em>&nbsp;</em>捷克共和国(Česko) +420</a><a href="javascript:void(0);" class="flag-ZW" data-code="+263-"><em>&nbsp;</em>津巴布韦(Zimbabwe) +263</a><a href="javascript:void(0);" class="flag-CM" data-code="+237-"><em>&nbsp;</em>喀麦隆(Cameroun) +237</a><a href="javascript:void(0);" class="flag-QA" data-code="+974-"><em>&nbsp;</em>卡塔尔(‫قطر‬‎) +974</a><a href="javascript:void(0);" class="flag-KY" data-code="+1345-"><em>&nbsp;</em>开曼群岛(Cayman Islands) +1345</a><a href="javascript:void(0);" class="flag-KM" data-code="+269-"><em>&nbsp;</em>科摩罗(Comoros) +269</a><a href="javascript:void(0);" class="flag-KW" data-code="+965-"><em>&nbsp;</em>科威特(‫الكويت‬‎) +965</a><a href="javascript:void(0);" class="flag-HR" data-code="+385-"><em>&nbsp;</em>克罗地亚(Hrvatska) +385</a><a href="javascript:void(0);" class="flag-KE" data-code="+254-"><em>&nbsp;</em>肯尼亚(Kenya) +254</a><a href="javascript:void(0);" class="flag-CK" data-code="+682-"><em>&nbsp;</em>库克群岛 +682</a><a href="javascript:void(0);" class="flag-LV" data-code="+371-"><em>&nbsp;</em>拉脱维亚(Latvija) +371</a><a href="javascript:void(0);" class="flag-LS" data-code="+266-"><em>&nbsp;</em>莱索托(Lesotho) +266</a><a href="javascript:void(0);" class="flag-LA" data-code="+856-"><em>&nbsp;</em>老挝(ປະຊາຊົນສປປລາວ) +856</a><a href="javascript:void(0);" class="flag-LB" data-code="+961-"><em>&nbsp;</em>黎巴嫩(‫لبنان‬‎) +961</a><a href="javascript:void(0);" class="flag-LT" data-code="+370-"><em>&nbsp;</em>立陶宛(Lietuva) +370</a><a href="javascript:void(0);" class="flag-LR" data-code="+231-"><em>&nbsp;</em>利比里亚(Liberia) +231</a><a href="javascript:void(0);" class="flag-LY" data-code="+218-"><em>&nbsp;</em>利比亚(‫ليبيا‬‎) +218</a><a href="javascript:void(0);" class="flag-LI" data-code="+423-"><em>&nbsp;</em>列支敦士登(Liechtenstein) +423</a><a href="javascript:void(0);" class="flag-RE" data-code="+262-"><em>&nbsp;</em>留尼旺岛(Réunion) +262</a><a href="javascript:void(0);" class="flag-LU" data-code="+352-"><em>&nbsp;</em>卢森堡(Lëtzebuerg) +352</a><a href="javascript:void(0);" class="flag-RW" data-code="+250-"><em>&nbsp;</em>卢旺达(Rwanda) +250</a><a href="javascript:void(0);" class="flag-RO" data-code="+40-"><em>&nbsp;</em>罗马尼亚(România) +40</a><a href="javascript:void(0);" class="flag-MG" data-code="+261-"><em>&nbsp;</em>马达加斯加(Madagasikara) +261</a><a href="javascript:void(0);" class="flag-MV" data-code="+960-"><em>&nbsp;</em>马尔代夫(‫ގުޖޭއްރާ ޔާއްރިހޫމްޖ‬‎) +960</a><a href="javascript:void(0);" class="flag-MT" data-code="+356-"><em>&nbsp;</em>马耳他(Malta) +356</a><a href="javascript:void(0);" class="flag-MW" data-code="+265-"><em>&nbsp;</em>马拉维(Malawi) +265</a><a href="javascript:void(0);" class="flag-MY" data-code="+60-"><em>&nbsp;</em>马来西亚(Malaysia) +60</a><a href="javascript:void(0);" class="flag-ML" data-code="+223-"><em>&nbsp;</em>马里(Mali) +223</a><a href="javascript:void(0);" class="flag-MK" data-code="+389-"><em>&nbsp;</em>马其顿(Македонија) +389</a><a href="javascript:void(0);" class="flag-MQ" data-code="+596-"><em>&nbsp;</em>马提尼克(Martinique) +596</a><a href="javascript:void(0);" class="flag-MU" data-code="+230-"><em>&nbsp;</em>毛里求斯(Mauritius) +230</a><a href="javascript:void(0);" class="flag-MR" data-code="+222-"><em>&nbsp;</em>毛里塔尼亚(‫موريتانيا‬‎) +222</a><a href="javascript:void(0);" class="flag-US" data-code="+1-"><em>&nbsp;</em>美国(United States) +1</a><a href="javascript:void(0);" class="flag-MN" data-code="+976-"><em>&nbsp;</em>蒙古(Монгол Улс) +976</a><a href="javascript:void(0);" class="flag-MS" data-code="+1664-"><em>&nbsp;</em>蒙特塞拉特(Montserrat) +1664</a><a href="javascript:void(0);" class="flag-BD" data-code="+880-"><em>&nbsp;</em>孟加拉国(বাংলাদেশ) +880</a><a href="javascript:void(0);" class="flag-PE" data-code="+51-"><em>&nbsp;</em>秘鲁(Perú) +51</a><a href="javascript:void(0);" class="flag-MD" data-code="+373-"><em>&nbsp;</em>摩尔多瓦(Moldova) +373</a><a href="javascript:void(0);" class="flag-MA" data-code="+212-"><em>&nbsp;</em>摩洛哥(‫المغرب‬‎) +212</a><a href="javascript:void(0);" class="flag-MC" data-code="+377-"><em>&nbsp;</em>摩纳哥(Monaco) +377</a><a href="javascript:void(0);" class="flag-MZ" data-code="+258-"><em>&nbsp;</em>莫桑比克(Moçambique) +258</a><a href="javascript:void(0);" class="flag-MX" data-code="+52-"><em>&nbsp;</em>墨西哥(México) +52</a><a href="javascript:void(0);" class="flag-NA" data-code="+264-"><em>&nbsp;</em>纳米比亚(Namibia) +264</a><a href="javascript:void(0);" class="flag-ZA" data-code="+27-"><em>&nbsp;</em>南非(South Africa) +27</a><a href="javascript:void(0);" class="flag-SS" data-code="+211-"><em>&nbsp;</em>南苏丹 +211</a><a href="javascript:void(0);" class="flag-NP" data-code="+977-"><em>&nbsp;</em>尼泊尔(नेपाल) +977</a><a href="javascript:void(0);" class="flag-NI" data-code="+505-"><em>&nbsp;</em>尼加拉瓜(Nicaragua) +505</a><a href="javascript:void(0);" class="flag-NE" data-code="+227-"><em>&nbsp;</em>尼日尔(Niger) +227</a><a href="javascript:void(0);" class="flag-NG" data-code="+234-"><em>&nbsp;</em>尼日利亚(Nigeria) +234</a><a href="javascript:void(0);" class="flag-NO" data-code="+47-"><em>&nbsp;</em>挪威(Norge) +47</a><a href="javascript:void(0);" class="flag-PT" data-code="+351-"><em>&nbsp;</em>葡萄牙(Portugal) +351</a><a href="javascript:void(0);" class="flag-JP" data-code="+81-"><em>&nbsp;</em>日本(にっぽんこく，にほんこく) +81</a><a href="javascript:void(0);" class="flag-SE" data-code="+46-"><em>&nbsp;</em>瑞典(Sverige) +46</a><a href="javascript:void(0);" class="flag-CH" data-code="+41-"><em>&nbsp;</em>瑞士(Schweiz) +41</a><a href="javascript:void(0);" class="flag-SV" data-code="+503-"><em>&nbsp;</em>萨尔瓦多(El Salvador) +503</a><a href="javascript:void(0);" class="flag-WS" data-code="+685-"><em>&nbsp;</em>萨摩亚(Samoa) +685</a><a href="javascript:void(0);" class="flag-RS" data-code="+381-"><em>&nbsp;</em>塞尔维亚(Србија) +381</a><a href="javascript:void(0);" class="flag-SL" data-code="+232-"><em>&nbsp;</em>塞拉利昂(Sierra Leone) +232</a><a href="javascript:void(0);" class="flag-SN" data-code="+221-"><em>&nbsp;</em>塞内加尔(Sénégal) +221</a><a href="javascript:void(0);" class="flag-CY" data-code="+357-"><em>&nbsp;</em>塞浦路斯(Κυπρος) +357</a><a href="javascript:void(0);" class="flag-SC" data-code="+248-"><em>&nbsp;</em>塞舌尔(Seychelles) +248</a><a href="javascript:void(0);" class="flag-SA" data-code="+966-"><em>&nbsp;</em>沙特阿拉伯(‫المملكة العربية السعودية‬‎) +966</a><a href="javascript:void(0);" class="flag-ST" data-code="+239-"><em>&nbsp;</em>圣多美和普林西比 +239</a><a href="javascript:void(0);" class="flag-KN" data-code="+1869-"><em>&nbsp;</em>圣基茨和尼维斯(Saint Kitts and Nevis) +1869</a><a href="javascript:void(0);" class="flag-LC" data-code="+1758-"><em>&nbsp;</em>圣卢西亚(Saint Lucia) +1758</a><a href="javascript:void(0);" class="flag-SM" data-code="+378-"><em>&nbsp;</em>圣马力诺(San Marino) +378</a><a href="javascript:void(0);" class="flag-PM" data-code="+508-"><em>&nbsp;</em>圣皮埃尔和密克隆群岛(Saint Pierre and Miquelon) +508</a><a href="javascript:void(0);" class="flag-VC" data-code="+1784-"><em>&nbsp;</em>圣文森特和格林纳丁斯(Saint Vincent and the Grenadines) +1784</a><a href="javascript:void(0);" class="flag-LK" data-code="+94-"><em>&nbsp;</em>斯里兰卡(Sri Lanka) +94</a><a href="javascript:void(0);" class="flag-SK" data-code="+421-"><em>&nbsp;</em>斯洛伐克(Slovensko) +421</a><a href="javascript:void(0);" class="flag-SI" data-code="+386-"><em>&nbsp;</em>斯洛文尼亚(Slovenija) +386</a><a href="javascript:void(0);" class="flag-SZ" data-code="+268-"><em>&nbsp;</em>斯威士兰(Swaziland) +268</a><a href="javascript:void(0);" class="flag-SD" data-code="+249-"><em>&nbsp;</em>苏丹(‫السودان‬‎) +249</a><a href="javascript:void(0);" class="flag-SR" data-code="+597-"><em>&nbsp;</em>苏里南(Suriname) +597</a><a href="javascript:void(0);" class="flag-SO" data-code="+252-"><em>&nbsp;</em>索马里(Soomaaliya) +252</a><a href="javascript:void(0);" class="flag-TJ" data-code="+992-"><em>&nbsp;</em>塔吉克斯坦(Тоҷикистон) +992</a><a href="javascript:void(0);" class="flag-TW" data-code="+886-"><em>&nbsp;</em>台湾地区(台灣) +886</a><a href="javascript:void(0);" class="flag-TH" data-code="+66-"><em>&nbsp;</em>泰国(ราชอาณาจักรไทย) +66</a><a href="javascript:void(0);" class="flag-TZ" data-code="+255-"><em>&nbsp;</em>坦桑尼亚(Tanzania) +255</a><a href="javascript:void(0);" class="flag-TO" data-code="+676-"><em>&nbsp;</em>汤加(Tonga) +676</a><a href="javascript:void(0);" class="flag-TC" data-code="+1649-"><em>&nbsp;</em>特克斯和凯科斯群岛(Turks and Caicos Islands) +1649</a><a href="javascript:void(0);" class="flag-TT" data-code="+1868-"><em>&nbsp;</em>特里尼达和多巴哥(Trinidad and Tobago) +1868</a><a href="javascript:void(0);" class="flag-TN" data-code="+216-"><em>&nbsp;</em>突尼斯(‫تونس‬‎) +216</a><a href="javascript:void(0);" class="flag-TR" data-code="+90-"><em>&nbsp;</em>土耳其(Türkiye) +90</a><a href="javascript:void(0);" class="flag-TM" data-code="+993-"><em>&nbsp;</em>土库曼斯坦(Türkmenistan) +993</a><a href="javascript:void(0);" class="flag-VU" data-code="+678-"><em>&nbsp;</em>瓦努阿图(Vanuatu) +678</a><a href="javascript:void(0);" class="flag-GT" data-code="+502-"><em>&nbsp;</em>危地马拉(Guatemala) +502</a><a href="javascript:void(0);" class="flag-VE" data-code="+58-"><em>&nbsp;</em>委内瑞拉(Venezuela) +58</a><a href="javascript:void(0);" class="flag-BN" data-code="+673-"><em>&nbsp;</em>文莱(Brunei Darussalam) +673</a><a href="javascript:void(0);" class="flag-UG" data-code="+256-"><em>&nbsp;</em>乌干达(Uganda) +256</a><a href="javascript:void(0);" class="flag-UA" data-code="+380-"><em>&nbsp;</em>乌克兰(Україна) +380</a><a href="javascript:void(0);" class="flag-UY" data-code="+598-"><em>&nbsp;</em>乌拉圭(Uruguay) +598</a><a href="javascript:void(0);" class="flag-UZ" data-code="+998-"><em>&nbsp;</em>乌兹别克斯坦(O\'zbekiston) +998</a><a href="javascript:void(0);" class="flag-ES" data-code="+34-"><em>&nbsp;</em>西班牙(España) +34</a><a href="javascript:void(0);" class="flag-GR" data-code="+30-"><em>&nbsp;</em>希腊(Ελλάς) +30</a><a href="javascript:void(0);" class="flag-HK" data-code="+852-"><em>&nbsp;</em>香港地区(Hong Kong) +852</a><a href="javascript:void(0);" class="flag-CI" data-code="+225-"><em>&nbsp;</em>象牙海岸(Côte d\'Ivoire) +225</a><a href="javascript:void(0);" class="flag-SG" data-code="+65-"><em>&nbsp;</em>新加坡(Singapura) +65</a><a href="javascript:void(0);" class="flag-NC" data-code="+687-"><em>&nbsp;</em>新喀里多尼亚(New Caledonia) +687</a><a href="javascript:void(0);" class="flag-NZ" data-code="+64-"><em>&nbsp;</em>新西兰(New Zealand) +64</a><a href="javascript:void(0);" class="flag-HU" data-code="+36-"><em>&nbsp;</em>匈牙利(Magyarország) +36</a><a href="javascript:void(0);" class="flag-SY" data-code="+963-"><em>&nbsp;</em>叙利亚(‫سوريا‬‎) +963</a><a href="javascript:void(0);" class="flag-JM" data-code="+1876-"><em>&nbsp;</em>牙买加(Jamaica) +1876</a><a href="javascript:void(0);" class="flag-AM" data-code="+374-"><em>&nbsp;</em>亚美尼亚(Հայաստան) +374</a><a href="javascript:void(0);" class="flag-YE" data-code="+967-"><em>&nbsp;</em>也门(‫اليمن‬‎) +967</a><a href="javascript:void(0);" class="flag-IQ" data-code="+964-"><em>&nbsp;</em>伊拉克(‫العراق‬‎) +964</a><a href="javascript:void(0);" class="flag-IR" data-code="+98-"><em>&nbsp;</em>伊朗(‫ایران‬‎) +98</a><a href="javascript:void(0);" class="flag-IL" data-code="+972-"><em>&nbsp;</em>以色列(‫ישראל‬‎) +972</a><a href="javascript:void(0);" class="flag-IT" data-code="+39-"><em>&nbsp;</em>意大利(Italia) +39</a><a href="javascript:void(0);" class="flag-IN" data-code="+91-"><em>&nbsp;</em>印度(India) +91</a><a href="javascript:void(0);" class="flag-ID" data-code="+62-"><em>&nbsp;</em>印尼(Indonesia) +62</a><a href="javascript:void(0);" class="flag-GB" data-code="+44-"><em>&nbsp;</em>英国(United Kingdom) +44</a><a href="javascript:void(0);" class="flag-VG" data-code="+1340-"><em>&nbsp;</em>英属维尔京群岛(U.S. Virgin Islands) +1340</a><a href="javascript:void(0);" class="flag-JO" data-code="+962-"><em>&nbsp;</em>约旦(‫الاردن‬‎) +962</a><a href="javascript:void(0);" class="flag-VN" data-code="+84-"><em>&nbsp;</em>越南(Việt Nam) +84</a><a href="javascript:void(0);" class="flag-ZM" data-code="+260-"><em>&nbsp;</em>赞比亚(Zambia) +260</a><a href="javascript:void(0);" class="flag-JE" data-code="+44-"><em>&nbsp;</em>泽西岛(United Kingdom) +44</a><a href="javascript:void(0);" class="flag-TD" data-code="+235-"><em>&nbsp;</em>乍得(Tchad) +235</a><a href="javascript:void(0);" class="flag-GI" data-code="+350-"><em>&nbsp;</em>直布罗陀(Gibraltar) +350</a><a href="javascript:void(0);" class="flag-CL" data-code="+56-"><em>&nbsp;</em>智利(Chile) +56</a><a href="javascript:void(0);" class="flag-CF" data-code="+236-"><em>&nbsp;</em>中非共和国(République Centrafricaine) +236</a>\n</div>');
I$(81, function(t, e, i, n, r, s, o, a, _) {
    var c = Regular.extend({ template: r, data: { hidden: 1 }, config: function(t) { e._$merge(this.data, t || {});
            this.supr(t) }, init: function(t) { this.supr(t) }, onClick: function(e) { t._$stop(e);
            var n = t._$getElement(e),
                r = i._$dataset(n, "code");
            if (r) this.$emit("setCode", r, n.className) }, setCountry: function(t) {
            var n = i._$getByClassName(document, "j-country")[0];
            var r = i._$getChildren(n);
            e._$forEach(r, function(e) {
                var n = i._$dataset(e, "code");
                if (n == t) { this.$emit("setCode", t, e.className);
                    this.data.hidden = 1;
                    this.$update() } }._$bind(this)) } });
    return c }, 3, 4, 2, 93, 107);
I$(38, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d, f, m, p, g, v) {
    var y, b, $ = { phone: 0, phonecode: 0 };
    m._$$BindMobile = t._$klass();
    y = m._$$BindMobile._$extend(o._$$Abstract);
    y.__init = function(t) { this.__opts = t.opts || {};
        this.__mobile = t.mobile || 0;
        this.__pbHasReged = t.mbreged || 0;
        this.__ipts = [];
        this.__super();
        this.__disabled = !0;
        this._mob_can_pass = !1;
        this.__cgp = "切换到国际手机";
        if (!this.__mobile) { this.__country = new f({ data: {} });
            this.__country.$on("setCode", this.__toggleC._$bind(this));
            this.__country.$inject(this.__itlCountry) } };
    y.__reset = function(t) { this.__super(t);
        this.__promark = t.promark || "";
        this.__captcha = t.captcha || "";
        this.__pbHasReged = t.mbreged || 0;
        this.__initForm();
        this.__initEvent();
        this.__states = {};
        this.__error.style.display = "none";
        this.__error2.style.display = "none";
        if (!this.__countDownBtn) this.__countDownBtn = l._$$CountDown._$allocate({ btn: this.__getSmsCode, onclick: this.__onSendSms._$bind(this) });
        if (this.__mobile) { this.__getSmsCode.click();
            this.__inputs[1].focus();
            _gaq.push(["_trackEvent", "注册步骤", "【4】手机号输入", "【手机邮】" + this.__mobile.substring(0, 3)]) } else this.__inputs[0].focus();
        this._$clearState();
        this._$dispatchEvent("onhidefooter") };
    y.__toggleC = function(t, n) { i._$stop(t);
        this.__country.data.hidden = this.__country.data.hidden ? 0 : 1;
        if ("string" == typeof t) { this.__itlBtn.className = "country " + n;
            e._$dataset(this.__itlBtn, "code", t);
            this.__itlMobileInput.focus() }
        this.__country.$update() };
    y.__hideC = function() {
        if (this.__country) { this.__country.data.hidden = 1;
            this.__country.$update() } };
    y.__toggleCgp = function() {
        if ("切换到国际手机" == this.__cgp) { this.__cgp = "切换到国内手机";
            this.__isItlPhone = 1;
            e._$addClassName(this.__phoneBox, "f-dn");
            e._$delClassName(this.__itlCountry, "f-dn");
            setTimeout(function() { this.__ipts[0]._$onClear();
                this.__ipts[2]._$onClear();
                _._$removeError(this.__inputs[0], "nerror");
                _._$removeError(this.__inputs[2], "nerror");
                this.__ipts[1]._$onClear(2) }._$bind(this), 150) } else { this.__cgp = "切换到国际手机";
            this.__isItlPhone = 0;
            e._$delClassName(this.__phoneBox, "f-dn");
            e._$addClassName(this.__itlCountry, "f-dn");
            this.__ipts[0]._$onClear(2);
            setTimeout(function() { this.__ipts[1]._$onClear();
                this.__ipts[2]._$onClear();
                _._$removeError(this.__inputs[1], "nerror");
                _._$removeError(this.__inputs[2], "nerror");
                this.__ipts[0]._$onClear(2) }._$bind(this), 150) }
        this.__cgpBtn.innerHTML = this.__cgp;
        e._$addClassName(this.__doreg, "btndisabled") };
    y.__destroy = function() { this.__super() };
    y.__initNode = function() { this.__super();
        this.__inputBoxs = e._$getByClassName(this.__body, "inputbox");
        this.__phoneBox = this.__inputBoxs[0];
        this.__itlCountry = this.__inputBoxs[1];
        this.__getSmsCode = e._$getByClassName(this.__body, "tabfocus")[0];
        this.__error = e._$getByClassName(this.__body, "fur-smserror")[0];
        this.__errorInner = e._$getByClassName(this.__body, "ettext")[0];
        this.__error2 = e._$getByClassName(this.__body, "fur-smserror2")[0];
        this.__error2Inner = e._$getByClassName(this.__body, "smserror2")[0];
        this.__itlMobileInput = e._$getByClassName(this.__body, "j-itlphone")[0];
        this.__itlBtn = e._$getByClassName(this.__body, "j-itlBtn")[0];
        this.__cgpBtn = e._$getByClassName(this.__body, "j-cgp")[0] };
    y.__initXGui = function() {
        var t = this.__mobile;
        if (this.__mobile) t = this.__mobile.substring(0, 3) + "****" + this.__mobile.substring(7);
        b = r._$addNodeTemplate(s._$get("register-phone-tmp", { mobile: t }));
        this.__seed_html = b };
    y.__initEvent = function() { this.__inputs = e._$getByClassName(this.__body, "j-inputtext");
        this.__doreg = e._$getByClassName(this.__body, "u-loginbtn")[0];
        this.__phone = this.__inputs[0];
        this.__itlPhone = this.__inputs[1];
        if (this.__mobile) this.__phonecode = this.__inputs[1];
        else this.__phonecode = this.__inputs[2];
        if (0 === this.__ipts.length) n._$forEach(this.__inputs, function(t) {
            var e = { opts: this.__opts, node: t, form: this.__form, needClose: 1, onfocus: this.__onFocus._$bind(this), onInput: this.__onInput._$bind(this) };
            this.__ipts.push(h._$$Input._$allocate(e)) }._$bind(this));
        this.__doInitDomEvent([
            [this.__doreg, "click", this.__doReg._$bind(this)],
            [this.__itlBtn, "click", this.__toggleC._$bind(this)],
            [this.__cgpBtn, "click", this.__toggleCgp._$bind(this)],
            [this.__body, "click", this.__hideC._$bind(this)]
        ]);
        this.__doInitDomEvent([
            [document, "keyup", this.__doEnter._$bind(this)]
        ]) };
    y.__onFocus = function(t) { _._$removeError(t, "nerror") };
    y.__doEnter = function(t) {
        if (13 == t.keyCode && MP.TICKET) this.__doReg() };
    y.__doReg = function() {
        var t, e, i, n, r;
        if (this.__mobile) { n = this.__form._$checkValidity(this.__phonecode);
            e = this.__phonecode.value.trim();
            if ("" == e) _._$showError(this.__phonecode, "请输入验证码", "nerror");
            if (n) { t = this.__mobile;
                _gaq.push(["_trackEvent", "注册步骤", "【6】短信验证码验证", "短信验证码输入成功"]);
                this._$dispatchEvent("onfastReg", t, e) } } else { e = this.__phonecode.value.trim();
            if (this.__isItlPhone) { t = this.__getItlPhone();
                r = this.__itlPhone.value.trim();
                if (!r) { _._$showError(this.__itlPhone, "请输入手机号", "nerror");
                    return }
                if (!this._mob_can_pass) { _._$showError(null, "请先获取验证码", "nerror");
                    return }
                if ("" == e) _._$showError(this.__phonecode, "请输入验证码", "nerror");
                n = this.__form._$checkValidity(this.__phonecode);
                if (n) this._$dispatchEvent("onfastReg", t, e) } else { i = this.__form._$checkValidity(this.__phone);
                if (!i) {
                    if ("" == this.__phone.value.trim()) _._$showError(this.__phone, "请输入手机号", "nerror");
                    return }
                if (!this._mob_can_pass) { _._$showError(null, "请先获取验证码", "nerror");
                    return }
                if ("" == e) _._$showError(this.__phonecode, "请输入验证码", "nerror");
                n = this.__form._$checkValidity(this.__phonecode);
                if (i && n) { t = this.__phone.value.trim();
                    _gaq.push(["_trackEvent", "注册步骤", "【4】手机号输入", "【绑定手机输入】" + t]);
                    _gaq.push(["_trackEvent", "注册步骤", "【6】短信验证码验证", "短信验证码输入成功"]);
                    this._$dispatchEvent("onfastReg", t, e) } } } };
    y.__initForm = function() {
        if (!this.__form) this.__form = a._$$WebForm._$allocate({ form: "reg-phone-form", oninvalid: function(t) {
                var e = "请输入",
                    n = t.code,
                    r = i._$getElement(t),
                    s = r.name;
                if (n != -1) {
                    if (n == -4 || n == -2 || n == -3) { e = "格式错误";
                        if ("phone" == s) e = "手机号" + e;
                        if ("phonecode" == s) e = "验证码" + e }
                    this.__states[s] = 1;
                    if ("phone" == s) $["phone"] = 1;
                    else if ("phonecode" == s) {
                        if (1 == $["phone"] && !this.__isItlPhone) { _._$showError2(r, e, "nerror", 1);
                            return }
                        $["phonecode"] = 1 }
                    _._$showError(r, e, "nerror");
                    t.stopped = !0 } else { e = "格式错误";
                    if ("phone" == s) $["phone"] = 0;
                    if ("phonecode" == s) $["phonecode"] = 0 } }._$bind(this), onvalid: function(t) {
                var e = i._$getElement(t),
                    n = e.name;
                this.__states[n] = 0;
                if ("phone" == n && 1 == $["phone"]) { _._$removeError(e, "nerror");
                    $["phone"] = 0 } else if ("phonecode" == n && 1 == $["phonecode"]) { _._$removeError(e, "nerror");
                    $["phonecode"] = 0 }
                t.stopped = !0 }._$bind(this) }) };
    y.__onInput = function(t) {
        var e = t.name,
            i;
        if (this.__mobile) {
            if ("phonecode" == e) {
                var n = this.__phonecode.value.trim();
                if (6 == n.length) { i = this.__form._$checkValidity(this.__phonecode);
                    if (i) this.__disabled = !1;
                    else this.__disabled = !0 } else this.__disabled = !0 } } else {
            var r = this.__phone.value.trim();
            var s = this.__phonecode.value.trim();
            var o = this.__itlPhone.value.trim();
            if (6 == s.length && 11 == r.length) {
                var a = this.__form._$checkValidity(this.__phone);
                if (!a) return;
                i = this.__form._$checkValidity(this.__phonecode);
                if (a && i) this.__disabled = !1;
                else this.__disabled = !0 } else if (6 == s.length && o) { i = this.__form._$checkValidity(this.__phonecode);
                if (i) this.__disabled = !1;
                else this.__disabled = !0 } else this.__disabled = !0 }
        this.__checkDisable() };
    y.__checkDisable = function() {
        var t = e._$getByClassName(this.__body, "u-loginbtn")[0];
        if (this.__disabled) e._$addClassName(t, "btndisabled");
        else e._$delClassName(t, "btndisabled") };
    y.__onSendSms = function() {
        return function() {
            var t;
            if (!this.__mobile) {
                if (!this.__isItlPhone) {
                    var e = this.__form._$checkValidity(this.__phone);
                    if (!e) { t = "" == this.__phone.value.trim() ? "请输入手机号" : "手机号格式错误";
                        _._$showError(this.__phone, t, "nerror");
                        return } } else if ("" == this.__itlPhone.value.trim()) { t = "请输入手机号";
                    _._$showError(this.__itlPhone, t, "nerror");
                    return }
                this.__doSendSms() } else this.__doSendSms2() } }();
    y.__getItlPhone = function() {
        var t = e._$dataset(this.__itlBtn, "code");
        var i = this.__inputs[1].value.trim();
        t = t.split("+")[1];
        return t + i };
    y.__doSendSms = function() {
        if (!this.__sendSmsLock) {
            var t = this.__getItlPhone();
            var e = this.__isItlPhone ? t : this.__phone.value.trim();
            var i = { id: MP.promarkIdData[this.__promark], mb: this.__mobile || e, tk: MP.TICKET, channel: 2 };
            this.__sendSmsLock = 1;
            c._$request("getMailSms", i, this.__getSms._$bind(this), this.__getSmsException._$bind(this)) } };
    y.__doSendSms2 = function() {
        if (!this.__sendSms2Lock) {
            var t = { id: MP.promarkIdData[this.__promark], mb: this.__mobile || this.__phone.value.trim(), isreactive: this.__pbHasReged || 0, channel: 2 };
            this.__sendSms2Lock = 1;
            c._$request("getMobileSms", t, this.__getSms._$bind(this), this.__getSmsException._$bind(this)) } };
    y.__getSms = function() { this.__sendSms2Lock = 0;
        this.__sendSmsLock = 0;
        this._mob_can_pass = !0;
        this.__countDownBtn._$getSms();
        _gaq.push(["_trackEvent", "注册步骤", "【5】手机验证码获取", "短信验证码获取成功"]) };
    y.__getSmsException = function(t) { this.__sendSms2Lock = 0;
        this.__sendSmsLock = 0;
        this._mob_can_pass = !0;
        var e, i, n, r = t.ret,
            s = t.dt;
        if ("412" != r && "413" != r)
            if ("107" != r && "108" != r && "109" != r && "110" != r)
                if ("500" != r) { i = "EXCEPTION_GET_SMS_" + r;
                    if ("411" == r) { n = t.receiveCode.split(",");
                        e = '请您编辑短信"<strong class="msg">' + n[0] + '</strong>",发送到<strong class="phone">' + n[1] + "</strong>短信费用由运营商收取（0.1元/条）";
                        _._$showError(null, e, "nerror", 2) } else { e = u[i] || u[r] || _._$getErrorTxt(t.ret);
                        if (s && "13" == s) e = "手机号格式错误";
                        _._$showError(null, e, "nerror") } } else this._$dispatchEvent("onfail", 1);
        else { i = "EXCEPTION_GET_SMS_" + r;
            e = u[i] || u[r] || _._$getErrorTxt(t.ret);
            this._$dispatchEvent("onback");
            setTimeout(function() { _._$showError(null, e, "nerror") }, 200) } else { i = "EXCEPTION_GET_SMS_" + r;
            e = u[i] || u[r] || _._$getErrorTxt(t.ret);
            _._$showError(null, e, "nerror") } };
    y._$clearState = function() {
        this.__ipts[1]._$onClear();
        this.__ipts[0]._$onClear(1);
        if (this.__ipts[2]) this.__ipts[2]._$onClear();
        this.__error.style.display = "none";
        this.__error2.style.display = "none"
    };
    y._$showTip = function(t) { this.__error.style.display = "block";
        this.__errorInner.innerHTML = t };
    y._$fastRegException = function(t) {
        var e = t.ret,
            i, n = "EXCEPTION_REG_MOB_" + e;
        i = u[n] || u[e] || _._$getErrorTxt(t.ret);
        _._$showError(null, i, "nerror") }
}, 1, 2, 3, 4, 6, 19, 68, 71, 11, 28, 72, 35, 80, 39, 81);
I$(106, '<div class="m-container">\n    <!--帐号-->\n    <mninput needEye="{needEye}" ref=mninput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} product="{product}" host="{host}" promark="{promark}" placeholder="{mobilePlaceholder.regmobile}" />\n    <!-- 验证码 -->\n    {#if hasImgCap}\n    <captcha needEye="{needEye}" isReg=1 tabIndex=-1 ref=captcha on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} product="{product}" promark="{promark}" placeholder="{mobilePlaceholder.regcap}" />\n    {/if}\n    <!-- 滑块验证码 -->\n    {#if hasSlide}\n    <slidecap tabIndex=4 ref=slidecap on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} server="{server}" productkey="{productkey}" swidth="{swidth}" product="{product}" promark="{promark}" hintTxt="{hintTxt}" channel="{channel}" />\n    {/if}\n    <!-- 短信 -->\n    <smsinput needEye="{needEye}" tabIndex=2 ref=smsinput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} on-sendSms={this.sendSms($event)} product="{product}" pkid="{pkid}" promark="{promark}" placeholder="{mobilePlaceholder.regsms}" />\n    <div class="fur-change-email"></div>\n    <!--密码-->\n    <mpinput needEye="{needEye}" tabindex=6 tabIndex=3 ref=mpinput on-showError={this.doShowError($event)} on-rmError={this.rmError($event)} on-pwdOtherCheck={this.pwdOtherCheck($event)} placeholder="{mobilePlaceholder.regpwd}" needCheck=1 />\n    <!-- 错误提示 -->\n    <div class="m-nerror f-dn" id="nerror"></div>\n    <!-- 登录按钮 -->\n    <div class="f-cb loginbox">\n        <a id="submitBtn" on-click={this.doReg()} class="u-loginbtn btncolor tabfocus" tabindex="8">{regMbTxt}</a>\n    </div>\n    <!-- 注册协议 -->\n    <div class="fur-item fur-agree">\n        <label>\n            <input type="hidden" checked="checked" disabled="disabled" class="fur-btn-agree" tabindex="-1"> 我同意<a href="{mblink1}" target="_blank" tabindex="-1" data-outlink="1">{mbagree1}</a> 和 <a href="{mblink2}" target="_blank" tabindex="-1" data-outlink="1">{mbagree2}</a>\n        </label>\n    </div>\n    <div class="f-cb unandmailbox">\n        <!-- 免登复选框 -->\n        {#if !single}\n        <div class="m-unlogin m-unlogin2">\n            <a ref=gotoLoginTextMb class="u-regbtn bgcolor tabfocus u-regbtn2" href="javascript:void(0);" data-outlink="2" target="_self" tabindex="11" data-action="changepage" data-mdtype="1">{gotoLoginTextMb}</a>\n        </div>\n        {/if}\n        {#if mailreghook}\n        <div class="u-mailreghook-box">\n            <a target="_blank" href={mailreghooklink} {#if !mailreghooklink}data-action="goEmailReg"{/if} class="mailreghook">{mailreghook}</a>\n        </div>\n        {/if}\n    </div>\n</div>\n');
I$(78, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d, f, m, p, g) {
    var v = r.extend({ template: u, data: { mailreghooklink: "//zc.reg.163.com/regInitialized", module: "reg", warn: "", btnTxt: "登  录", unLoginText: "几天免登录", gotoRegText: "注册手机帐号", channel: 2, placeholder: "6-16位密码，区分大小写", mbagree1: "《服务条款》", mblink1: "//reg.163.com/agreement_mobile.shtml", mbagree2: "《用户隐私保护和个人信息利用政策》", mblink2: "//reg.163.com/agreement_mobile_ysbh.shtml" }, config: function(t) { e._$merge(this.data, t || {});
            this.supr(t) }, init: function(t) { this.supr(t);
            this.doInit() }, iniSuccess: function(t) {
            if (this.$refs) { this.supr(t, 1);
                this.$refs.mninput.chn = 1;
                MP.getId("yd_" + this.data.promark, function(t) {
                    if ("null" != t) { this.data.initId = t;
                        this.$refs.mninput.data.chnId = t } else this.onShowErr({ ret: "mb-reg-vfsms--2" }, -1) }._$bind(this));
                if (this.$refs.slidecap) this.$refs.slidecap.ignore = 1;
                if (this.$refs.captcha) this.$refs.captcha.ignore = 1 } }, doInit: function() {
            var t = {};
            t.pd = this.data.product;
            t.pkid = this.data.promark;
            t.pkht = this.data.host;
            _gaq.push(["_trackEvent", "手机帐号注册模块", "初始化", ""]);
            this.data.initSuccess = 0;
            h._$request("mb-reg-ini", t, this.iniSuccess._$bind(this), this.iniError._$bind(this, "mb-reg-ini-")) }, autoLogin: function(t) { this._$setDomains({ type: "register-success", username: this.rmbMobile || "", nextUrls: t.nextUrls, isReg: 1 }) }, regSuccess: function(t) { this.__doRegLock = 0;
            var e = { username: this.rmbMobile };
            _gaq.push(["_trackEvent", "手机帐号注册模块", "点击注册按钮", "注册成功###" + JSON.stringify(e)]);
            if (this.$refs.gotoLoginTextMb) d._$cookie("regmbcookiename", { value: this.rmbMobile });
            this.autoLogin(t) }, regError: function(t) {
            var e = { username: this.rmbMobile, code: t.ret };
            _gaq.push(["_trackEvent", "手机帐号注册模块", "点击注册按钮", "注册失败###" + JSON.stringify(e)]);
            this.__doRegLock = 0;
            var i = -1,
                n = "mb-reg-vfsms-",
                r = t.ret;
            if ("401" == r) t.ret = n + r;
            else t.ret = n + r + (t.dt || "");
            this.$update();
            this.onShowErr(t, i) }, pwdOtherCheck: function(t) {
            var e = this.$refs.mpinput;
            var i = this.$refs.mninput._$getValue().trim();
            var r = n._$checkPwd(t, i);
            if (r) { e.data.hasError = 1;
                e.$update();
                e.$emit("showError", { tabIndex: e.data.tabIndex, str: r, target: e.$refs.input }) } }, doReg: function() {
            if (this.data.initSuccess) {
                if (!this.checkForm()) {
                    var t = {},
                        e = this.data.regDomains || "",
                        i = this.data.regCookieDomain || "";
                    t.mb = this.$refs.mninput._$getValue().trim();
                    t.sms = this.$refs.smsinput._$getValue().trim();
                    t.pw = MP.encrypt(this.$refs.mpinput._$getValue(), t.mb);
                    t.id = this.data.initId;
                    if (e) e += i ? "," + i : "";
                    else e = i;
                    t.domains = e;
                    if (this.__doRegLock) return;
                    this.__doRegLock = 1;
                    this.rmbMobile = t.mb;
                    var n = { username: this.rmbMobile };
                    _gaq.push(["_trackEvent", "手机帐号注册模块", "点击注册按钮", "开始注册###" + JSON.stringify(n)]);
                    h._$request("mb-reg-vfsms", t, this.regSuccess._$bind(this), this.regError._$bind(this)) } } else this.doShowInitFail("注册") }, getSmsSuccess: function(t) { this.__sendSmsLock = 0;
            this.$refs.smsinput.getSms(t) }, getSmsFail: function(t) {
            var e = t.ret,
                i = -1,
                n, r = "mb-reg-sm-";
            this.__sendSmsLock = 0;
            if ("108" == e) this.refreshCaps(r, "441");
            else if ("109" == e) this.refreshCaps(r, "444");
            else if ("110" == e) this.refreshCaps(r, "445");
            else {
                if (this.$refs.captcha) this.refreshCaps(r, "441");
                if (this.$refs.slidecap) {
                    var s = 2 == this.$refs.slidecap.data.slideTarget ? "444" : "445";
                    this.refreshCaps(r, s) } }
            if (411 == e) {
                var o = t.receiveCode.split(",");
                n = 2;
                l["mb-reg-sm-411"] = "请您编辑短信<a>" + o[0] + "</a>发送到<a>" + o[1] + "</a>短信费用由运营商收取（0.1元/条）";
                this.$refs.smsinput.onClearInputPuer() }
            if (420 == e || 422 == e || 602 == e) {
                if (422 == e || 602 == e) n = 2;
                i = 1 }
            if ("401" == e) t.ret = r + t.ret;
            else {
                if ("107" == e && "00" == t.dt && this.data.hasSlide) t.dt = 2 == this.$refs.captcha._$getCt() ? "04" : "05";
                t.ret = r + t.ret + (t.dt || "") }
            this.onShowErr(t, i, n) }, sendSms: function() {
            if (this.data.initSuccess) {
                var t = this.$refs.mninput._$emptyCheck(),
                    e = this.$refs.mninput.data.hasError,
                    i, n;
                this.$refs.smsinput.onClearInputPuer();
                if (!t && !e) {
                    if (this.data.hasImgCap) { i = this.$refs.captcha._$emptyCheck();
                        n = this.$refs.captcha.data.hasError }
                    if (this.data.hasSlide) i = this.$refs.slidecap.onCheckRegexp();
                    if (!i && !n) {
                        var r = {};
                        r.id = this.data.initId;
                        r.mb = this.$refs.mninput._$getValue().trim();
                        if (this.data.hasImgCap) r.cap = this.$refs.captcha._$getValue().trim();
                        if (this.data.hasSlide) { r.cap = this.$refs.slidecap._$getPwdValue();
                            r.capkey = this.$refs.slidecap._$getCapKey();
                            r.ct = this.$refs.slidecap._$getCt() }
                        if (!this.__sendSmsLock) { this.__sendSmsLock = 1;
                            h._$request("mb-reg-sm", r, this.getSmsSuccess._$bind(this), this.getSmsFail._$bind(this)) } } } } else this.doShowInitFail("注册") } });
    v.component("mninput", s);
    v.component("captcha", a);
    v.component("smsinput", o);
    v.component("slidecap", _);
    v.component("mpinput", c);
    return v }, 3, 4, 2, 11, 73, 96, 101, 98, 99, 97, 28, 106, 95, 29);
I$(79, '<form id="login-form" class="regManager"></form>');
I$(40, function(t, e, i, n, r, s, o, a, _, c, h, u) {
    var l = r.extend({ template: a, data: {}, config: function(t) { e._$merge(this.data, t || {});
            this.supr(t) }, init: function(i) { this.supr(i);
            this.__config = {};
            e._$merge(this.__config, i);
            t._$addEvent(document, "keyup", this.doEnter._$bind(this)) }, destroy: function() { t._$clearEvent(document, "keyup");
            this.supr() }, _$changeModule: function() {
            if (this.__mbreg) this.__mbreg.destroy();
            this.__mbreg = new o({ data: this.__config }).$inject("#login-form") } });
    return l }, 3, 4, 2, 11, 73, 28, 78, 79);
I$(8, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d, f, m, p, g) {
    var v;
    f._$$RegisterManager = t._$klass();
    v = f._$$RegisterManager._$extend(l._$$Manager);
    v.__init = function(t) { a._$loadGaq();
        this.__options = t || {};
        this.__focusHelper = this.__options.focusHelper || 0;
        this.__promark = t.promark || "";
        this.__host = t.host || "";
        this.__cf = 1;
        this.__regCapLazyload = t.regCapLazyload || 0;
        window["$regCookieDomain"] = t.regCookieDomain;
        this.__super(t);
        this.__gaqo = { pid: this.__promark, pdt: this.__product };
        this.__lockReg = 0;
        this.__canPass = 0 };
    v.__reset = function(t) { this.__super(t);
        this.__lockReg = 0;
        this.__disabled = 1;
        this.__single = parseInt(t.single);
        this.__regSucCount = t.regSucCount;
        this.__includeBox = !!t.includeBox;
        this.__mobileFirst = t.mobileFirst || 0;
        if (t.terms) this.__terms = t.terms;
        this.__isGetTicket = !1;
        this.__initHtml();
        a._$resize() };
    v.__renderReg = function() {
        if (!this.__collect) this.__collect = u._$$Collect._$allocate({ holder: document.body });
        this.__options.collect = this.__collect;
        this.__module = "goEmailReg";
        this.__initCompOK();
        this.__initComp();
        this.__checkDisable();
        if (this.__terms) {
            var t = e._$getByClassName(this.__box, "fur-agree")[0];
            var i = '<label><input type="hidden" checked="checked" disabled="disabled" class="fur-btn-agree" tabindex="-1"> 我同意';
            n._$forEach(this.__terms, function(t, e, n) { i += '<a href="' + t.url + '" target="_blank" tabindex="-1" data-outlink="1">' + t.name + "</a>";
                if (e < n.length - 1) i += "和" });
            i += "</label>";
            t.innerHTML = i } };
    v.__initHtml = function() { o._$render(this.__box, "index-tmp", { needMobileReg: this.__options.needMobileReg, goEmailLoginTxt: this.__options.goEmailLoginTxt, goMbLoginTxt: this.__options.goMbLoginTxt, goEmailRegTxt: this.__options.goEmailRegTxt, goMbRegTxt: this.__options.goMbRegTxt });
        this.__cnt = e._$getByClassName(this.__box, "m-cnt")[0];
        if (this.__includeBox) {
            var t = e._$get("cnt-box-parent");
            if (!e._$hasClassName(t, "cnt-box-include")) e._$addClassName(t, "cnt-box-include") }
        var i = e._$get("mobileReg");
        if (this.__mobileFirst && i) this.__doAction(i);
        else this.__renderReg() };
    v.__doEnter = function(t) {
        if (this.__registerModule)
            if (13 == t.keyCode && !this.__ticket && !this.__registerModule._stopEnter) this.__doReg();
            else if (this.__registerModule) this.__registerModule._stopEnter = 0;
    };
    v.__checkDisable = function() {
        var t = e._$get("doregister");
        if (this.__disabled) e._$addClassName(t, "btndisabled");
        else e._$delClassName(t, "btndisabled") };
    v.__destroy = function() { this.__clearModule();
        delete this.__module;
        this.__super() };
    v.__initComp = function() {
        var t = { pkid: this.__promark, pkht: this.__host, pd: this.__product, channel: 2 };
        _gaq.push(["_trackEvent", "网易邮箱注册模块", "初始化", ""]);
        r._$request("init", t, this.__initOk._$bind(this), this.___initComponentException._$bind(this)) };
    v.__initOk = function(t) {
        if (this.__registerModule) { this.__hasInit = 1;
            this.__cf = t.cf;
            MP.getId(this.__promark, function(t) {
                if (this.__registerModule && t) { MP.promarkIdData[this.__promark] = t;
                    if (!this.__regCapLazyload && (1 == this.__cf || 4 == this.__cf || 5 == this.__cf)) this.__showCap();
                    else this.__registerModule._$hideCheckCode();
                    if (this.__focusHelper) this.__registerModule._$focusHelper() } else this.___initComponentException() }._$bind(this));
            try { this.__registerModule._$setCFModule(this.__cf) } catch (e) {} } };
    v.__showCap = function() {
        var t;
        if (1 == this.__cf) t = { ret: "108" };
        if (4 == this.__cf) t = { ret: "109" };
        if (5 == this.__cf) t = { ret: "110" };
        if (1 == this.__cf || 4 == this.__cf || 5 == this.__cf) this.__showCheckCode(t, 1) };
    v.___initComponentException = function(t) { this.__hasInit = 0;
        var e = this.__host || "未知产品";
        var i = t && t.ret || "0";
        _gaq.push(["_trackEvent", "注册步骤", "【0】初始化", "初始化失败,from:" + e]);
        if ("-401" != i) this.__showFail(i);
        else { a._$showError(0, '无法注册，请<a style="color:#4aafe9;" target="_blank" href="https://www.baidu.com/s?wd=%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%80%E5%90%AFcookies">开启浏览器cookies</a>或更换浏览器后刷新重试', "nerror");
            window._$needCookieSet = 1 } };
    v.__initCompOK = function() { this.__initRegister();
        this.__sendSize("init") };
    v.__getInitState = function() {
        return this.__hasInit };
    v.__onRegCapLazyload = function() {
        if (!this.__hasCap) { this.__hasCap = 1;
            this.__showCap() } };
    v.__initRegister = function() {
        if (!this.__registerModule) this.__registerModule = _._$$Register._$allocate({ parent: this.__cnt, opts: this.__options, onRegCapLazyload: this.__onRegCapLazyload._$bind(this), canpass: this.__onCanPass._$bind(this), ondisabled: this.__onDisabled._$bind(this), onfail: this.__showFail._$bind(this), setmbreged: this.__setMbReged._$bind(this), getInitState: this.__getInitState._$bind(this) });
        this.__inputs = e._$getByClassName(this.__box, "j-inputtext");
        this.__nameinput = this.__inputs[0];
        this.__passwordinput = this.__inputs[1];
        this.__checkcodeinput = this.__inputs[2];
        i._$delEvent(document, "keyup", this.__doEnter._$bind(this));
        i._$addEvent(document, "keyup", this.__doEnter._$bind(this));
        if (this.__single) {
            var t = e._$get("changepage");
            if (t) t.style.display = "none" } };
    v.__onCanPass = function(t) { this.__canPass = t };
    v.__setMbReged = function(t) { this.__pbHasReged = t };
    v.__onDisabled = function(t) { this.__disabled = t;
        this.__checkDisable() };
    v.__hideFooter = function() {
        var t = e._$get("footer");
        e._$addClassName(t, "f-dn") };
    v.__showFooter = function() {
        var t = e._$get("footer");
        e._$delClassName(t, "f-dn") };
    v.__showPage = function(t, e) {
        if ("bindmobile" == t) { this.__registerModule._$hide();
            if (!this.__bindMobileModule) this.__bindMobileModule = c._$$BindMobile._$allocate({ opts: this.__options, parent: this.__cnt, promark: this.__promark, captcha: this.__smscode, mobile: e, mbreged: this.__pbHasReged, onhidefooter: this.__hideFooter._$bind(this), onback: this.__backReg._$bind(this), onfastReg: this.__doFastReg._$bind(this), onfail: this.__showFail._$bind(this) });
            else { this.__bindMobileModule._$show();
                this.__bindMobileModule._$clearState() }
            a._$resize() } };
    v.__doFastReg = function(t, e) {
        if (!this.__regmobileLock) { this.__regmobileLock = 1;
            this.__bindmobile = t;
            this.__bindsms = e;
            this._$fastReg() } };
    v.__onReg3P = function(t) { o._$render(this.__box2, "register-3p-success", { username: this.__username, activeurl: this.__saveurl, resend: t });
        var e = { userName: this.__username, otherRegSuccess: 1 };
        a._$3pSuccess(e);
        this.__changePage(1);
        a._$resize() };
    v.__onRegSuccess = function() {
        var t = "2" == this.__captype && "01" == this.__dt ? this.__bindmobile : "";
        o._$render(this.__box2, "register-success", { username: this.__username, mobile: t });
        var i = 0 === this.__regSucCount ? 0 : this.__regSucCount || 3;
        if (0 !== i) { this.__changePage(1);
            e._$get("countdown").innerHTML = i + "秒后自动登录";
            var n = setInterval(function() { i -= 1;
                if (0 !== i) e._$get("countdown").innerHTML = i + "秒后自动登录";
                else { n = clearInterval(n);
                    this.__sendMsg({ type: "register-success", username: this.__username, url: this.__url });
                    this.__sendClose(1) } }._$bind(this), 1e3);
            a._$resize() } else { this.__sendMsg({ type: "register-success", username: this.__username, url: this.__url });
            this.__sendClose(1) } };
    v.__goModule = function() { this.__clearModule();
        if ("goEmailReg" == this.__module) this.__renderReg();
        else this.__createMbRegModule() };
    v.__createMbRegModule = function() { this.__mbRegModule = new d({ data: this.__options });
        this.__mbRegModule.$inject(this.__cnt);
        this.__mbRegModule._$changeModule() };
    v.__doAction = function(t) {
        var r = i._$getElement(t) || t,
            s = e._$dataset(r, "action");
        if ("goMbReg" == s || "goEmailReg" == s) {
            if (s == this.__module) return;
            this.__heads = e._$getByClassName(this.__box, "j-head");
            n._$forEach(this.__heads, function(t) { e._$delClassName(t, "active") });
            e._$addClassName(r, "active");
            this.__module = s;
            this.__goModule() } else if ("doregister" == s) this.__doReg();
        else if ("goback" == s) this.__doBack();
        else if ("backreg" == s) this.__backReg();
        else if ("resend" == s) this.__sendMail(1);
        else if ("doclose" == s) this.__sendClose();
        this.__super(t) };
    v.__sendMail = function(t) {
        var e = { userName: this.__username, proId: this.__product, promarkId: this.__promark, promarkHost: this.__host };
        r._$request("sendActMail", e, this.__onSendActMail._$bind(this, t), this.__onSendActMailFail._$bind(this)) };
    v.__onSendActMailFail = function() { a._$showFail("-102") };
    v.__onSendActMail = function(t) {
        if (t) a._$showFail("-101");
        this.__onReg3P(1) };
    v.__backReg = function() {
        if (this.__registerModule) { this.__registerModule._$clearState();
            this.__registerModule = this.__registerModule._$recycle() }
        if (this.__bindMobileModule) { this.__bindMobileModule._$clearState();
            this.__bindMobileModule = this.__bindMobileModule._$recycle() }
        this.__initHtml();
        this.__changePage() };
    v.__clearModule = function() {
        if (this.__mbRegModule) this.__mbRegModule.destroy();
        if (this.__registerModule) this.__registerModule = this.__registerModule._$recycle();
        if (this.__bindMobileModule) this.__bindMobileModule = this.__bindMobileModule._$recycle();
        if (this.__collect) this.__collect = this.__collect._$recycle() };
    v.__doBack = function() { this.__changePage();
        this.__registerModule._$show();
        if (this.__bindMobileModule) this.__bindMobileModule._$hide() };
    v.__showCheckCode = function(t, e) {
        var i;
        if (this.__registerModule)
            if (t)
                if ("108" == t.ret) { this.__cf = 1;
                    this.__registerModule.__cbVftcpEx(t, e) } else if ("109" == t.ret || "110" == t.ret) { this.__cf = "109" == t.ret ? 4 : 5;
            this.__registerModule.__cbVftcpEx(t, e) } else if (this.__registerModule.__needSlideCap || this.__registerModule.__needCheckCode) {
            if (this.__registerModule.__needSlideCap) i = "1" + ("2" == this.__registerModule.__slideTarget ? "09" : "10");
            else i = "108";
            t = { ret: i };
            this.__registerModule.__cbVftcpEx(t, e) } };
    v.__getCheckCode = function() { this.__registerModule._$getCheckCode() };
    v.__showFail = function(t) {
        if (void 0 === typeof t || 1 == t) t = 500;
        this.__super(t) };
    v.__showFail2 = function() { this.__super(501) };
    v.__getTicket = function(t) { this.__isGetTicket = !0;
        this.__ticket = t.tk;
        MP.setTicket(this.__ticket);
        this.__captype = t.cap;
        this.__dt = t.dt || "01";
        switch (this.__captype) {
            case "0":
                this._$fastReg();
                break;
            case "1":
                this._$fastReg();
                break;
            case "2":
                this.__lockReg = 0;
                this.__showPage("bindmobile") } };
    v.__regMobException = function(t) {
        var e = t.ret;
        var i = { username: this.__bindmobile };
        _gaq.push(["_trackEvent", "注册结果", "手机邮箱注册失败", (e || 0) + "失败###" + JSON.stringify(i)]);
        this.__lockReg = 0;
        this.__regmobileLock = 0;
        if ("500" != e) this.__bindMobileModule._$fastRegException(t);
        else this.__showFail() };
    v.__getTicketException = function(t) {
        var e = { username: this.__username };
        _gaq.push(["_trackEvent", "注册结果", "普通邮注册失败", (t.ret || 0) + "ticket失败###" + JSON.stringify(e)]);
        this.__showCheckCode(t);
        this.__lockReg = 0;
        this.__registerModule._$checkEndException(t) };
    v.__fastException = function(t) {
        var e = { username: this.__username };
        _gaq.push(["_trackEvent", "注册结果", "普通邮注册失败", (t.ret || 0) + "失败###" + JSON.stringify(e)]);
        this.__lockReg = 0;
        this.__regmobileLock = 0;
        var i = t.ret;
        if ("500" != i)
            if ("2" == this.__captype) this.__bindMobileModule._$fastRegException(t);
            else this.__registerModule._$fastRegException(t);
        else this.__showFail() };
    v.__fastRegOk = function(t) {
        var e, i;
        this.__lockReg = 0;
        this.__regmobileLock = 0;
        this.__dt = t.dt || "01";
        if (t.nextUrls) this.__setDomains({ type: "regcksuccess", username: "", nextUrls: t.nextUrls });
        if ("201" === t.ret) { e = this.__username;
            this.__url = t.url || "";
            i = e.substring(e.indexOf("@"));
            if ("2" == this.__captype && "01" == this.__dt) _gaq.push(["_trackEvent", "注册结果", "注册成功", "【普通邮注册成功】" + i + "+" + this.__bindmobile.substring(0, 3)]);
            else _gaq.push(["_trackEvent", "注册结果", "注册成功", "【普通邮注册成功】：" + i]);
            this.__onRegSuccess() } else if ("202" === t.ret) { e = this.__username;
            this.__saveurl = a._$getCommonEmail(e);
            i = e.indexOf("@") != -1 ? e.substring(e.indexOf("@")) : e;
            _gaq.push(["_trackEvent", "注册结果", "注册成功", "【外域帐号注册成功】：" + i]);
            this.__onReg3P() }
        this._$dispatchEvent("oninit", 1) };
    v.__doRegCb = function(t, e) { this.__pass = t;
        if (t) this.__doRegReal();
        else { this.__lockReg = 0;
            if ("email" === e && !this.__nameinput.value) a._$showError(this.__nameinput, "请输入帐号", "nerror");
            else if ("password" === e && !this.__passwordinput.value) a._$showError(this.__passwordinput, "请输入密码", "nerror");
            else if ("checkcode" === e && !this.__checkcodeinput.value) a._$showError(this.__checkcodeinput, "请输入验证码", "nerror");
            else if ("slidecap" === e) a._$showError(this.__checkcodeinput, "请滑动验证码", "nerror") } };
    v.__doRegReal = function() {
        this.__isMobile = this.__registerModule._$isMobile();
        if (this.__collect) this._events = this.__collect._$getEvents();
        var t = this.__registerModule._$getValues();
        this.__username = t[0].trim();
        this.__password = t[1];
        this.__smscode = t[2];
        var e = { username: this.__username };
        _gaq.push(["_trackEvent", "网易邮箱注册模块", "点击注册按钮", "开始注册###" + JSON.stringify(e)]);
        if (this.__isMobile) { this.__bindmobile = this.__username.split("@")[0];
            this.__lockReg = 0;
            this.__showPage("bindmobile", this.__bindmobile) } else if (this.__pass) {
            var i = {
                id: MP.promarkIdData[this.__promark],
                un: this.__username,
                pw: MP.encrypt(this.__password, this.__username),
                events: JSON.stringify(this._events),
                channel: 2
            };
            r._$request("getTicket", i, this.__getTicket._$bind(this), this.__getTicketException._$bind(this))
        }
    };
    v.__doReg = function() {
        var t = "-103";
        if (this.__hasInit) {
            if (!this.__lockReg && this.__hasInit) { this.__lockReg = 1;
                this.__registerModule._$stateOK(this.__doRegCb._$bind(this)) } } else a._$showFail(t, "注册") };
    v.__getDomains = function() {
        var t = this.__options.regDomains || "";
        var e = window["$regCookieDomain"] || "";
        if (t) t += e ? "," + e : "";
        else t = e;
        return t };
    v._$fastReg = function() {
        var t;
        if (this.__isMobile) { t = { id: MP.promarkIdData[this.__promark], mb: this.__bindmobile, pw: MP.encrypt(this.__password, this.__bindmobile), sms: this.__bindsms, isreactive: this.__pbHasReged || 0, channel: 2 };
            t.domains = this.__getDomains();
            _gaq.push(["_trackEvent", "注册提交", "手机邮发送注册申请", "【手机邮注册提交】" + this.__bindmobile.substring(0, 3)]);
            r._$request("regMob", t, function(t) { this.__lockReg = 0;
                this.__regmobileLock = 0;
                if (t.nextUrls) this.__setDomains({ type: "regcksuccess", username: "", nextUrls: t.nextUrls });
                this.__url = t.url || "";
                this.__onRegSuccess();
                _gaq.push(["_trackEvent", "注册结果", "注册成功", "【手机邮注册成功】" + this.__bindmobile.substring(0, 3)]);
                this._$dispatchEvent("oninit", 1) }._$bind(this), this.__regMobException._$bind(this)) } else { t = { id: MP.promarkIdData[this.__promark], tk: this.__ticket, un: this.__username, pw: MP.encrypt(this.__password, this.__username), channel: 2 };
            if ("2" === this.__captype) { t.mb = this.__bindmobile;
                t.sms = this.__bindsms;
                _gaq.push(["_trackEvent", "注册提交", "普通邮+绑定手机发送注册申请", "【普通邮注册提交】" + this.__username.substring(this.__username.indexOf("@")) + "+" + this.__bindmobile.substring(0, 3)]) } else _gaq.push(["_trackEvent", "注册提交", "普通邮+非绑定手机发送注册申请", "【普通邮注册提交】" + this.__username.substring(this.__username.indexOf("@"))]);
            t.domains = this.__getDomains();
            r._$request("fastReg", t, this.__fastRegOk._$bind(this), this.__fastException._$bind(this)) } }
}, 1, 2, 3, 4, 28, 6, 19, 11, 37, 38, 35, 39, 32, 40);
I$(12, function(t, e, i, n, r, s, o, a, _, c, h, u, l, d, f) {
    var m, p, g = { 1: "red", 2: "orange", 3: "green", 4: "blue" };
    s._$parseTemplate("jst-template");
    u._$$Index = t._$klass();
    m = u._$$Index._$extend(r._$$EventTarget);
    m.__init = function(t) { this.__super(t);
        this.__loadConfig(t);
        i._$addEvent(document, "click", this.__changePage._$bind(this)) };
    m.__reset = function(t) { this.__super(t) };
    m.__destroy = function() { this.__super() };
    m.__doClose = function() {
        var t = { type: "close" };
        t["URS-CM"] = 1;
        c._$postMessage("_parent", { data: t }) };
    m.__loadConfig = function(t) {
        if (t) { t.single = t.single || 0;
            this.__page = t.page || "login";
            if (t.notFastReg) { this.__page = "login";
                t.single = 1 }
            p = t.needanimation;
            window._$URSOPT = t || {};
            window._$PRODUCT = t.product || "";
            window._$PKID = t.promark || "";
            window._$pathB = t.pathB || 0;
            window._$needUrsBgp = t.needUrsBgp || 0;
            window._$bgpTime2 = t.bgpTime2 || 1e4;
            var e = t.cookieDomain;
            if (e && e.indexOf("dl.reg.163.com") < 0)
                if (window._$needUrsBgp && t.passportNeedUrsBgp) window._$needUrsBgp = 1;
                else window._$needUrsBgp = 0;
            window.isHttps = t.isHttps || 0;
            window.PROTOCOL = "http" == t.PROTOCOL ? "http://" : "https://";
            window.REGPROTOCOL = "http" == t.REGPROTOCOL ? "http://" : "https://";
            if (window.isHttps) { window.PROTOCOL = "https://";
                window.REGPROTOCOL = "https://" }
            this.__loadStyle(t);
            this.__opt = t;
            this.__showPage() } else this.__doClose() };
    m.__loadStyle = function(t) {
        var i = t.skin || "1";
        var n = t.cssFiles || "";
        var r = t.style || "";
        if (r) e._$addStyle(r);
        else if (!n && 0 != i) { i = g[i] || "red";
            var s = document.createElement("link");
            s.rel = "stylesheet";
            s.type = "text/css";
            s.href = "../../webapp/res/css/" + i + ".css";
            document.getElementsByTagName("head")[0].appendChild(s) } };
    m.__changePage = function(t) {
        var n = i._$getElement(t),
            r = e._$dataset(n, "action"),
            s = e._$dataset(n, "mdtype"),
            o;
        if ("changepage" == r) { this.__mdType = s;
            this.__page = "login" == this.__page ? "register" : "login";
            var a = this.__mdType ? "手机" : "非手机";
            _gaq.push(["_trackEvent", "切换模块", a, this.__page]);
            if ("login" == this.__page && e._$get("VIP")) e._$get("VIP").style.display = "none";
            o = { type: "changepage", page: this.__page, mdtype: this.__mdType || "" };
            o["URS-CM"] = 1;
            c._$postMessage("_parent", { data: o });
            this.__showPage(1) } };
    m._$supportCss3 = function(t) {
        var e = ["webkit", "Moz", "ms", "o"],
            i, n = [],
            r = document.documentElement.style,
            s = function(t) {
                return t.replace(/-(\w)/g, function(t, e) {
                    return e.toUpperCase() }) };
        for (i in e) n.push(s(e[i] + "-" + t));
        n.push(s(t));
        for (i in n)
            if (n[i] in r) return !0;
        return !1 };
    m._$LgRefresh = function() { this.__page = "login";
        this.__showPage(1) };
    m.__showPage = function(t) { h._$hideFail();
        this.__opt.page = this.__page;
        var i = 0 == p ? 0 : this._$supportCss3("animation");
        if (!p);
        i = !this._pageinit ? 0 : i;
        this._pageinit = !0;
        if (t) { this.__opt.mobileFirst = this.__mdType ? 1 : 0;
            var n = e._$get("cnt-box-parent");
            e._$addClassName(n, "switching");
            setTimeout(function() { e._$delClassName(n, "switching") }, i ? 800 : 0) }
        setTimeout(function() {
            if (this.__lg) this.__lg = this.__lg._$recycle();
            if (this.__rg) this.__rg = this.__rg._$recycle();
            if ("login" == this.__page) { this.__opt.onRefresh = this._$LgRefresh._$bind(this);
                this.__lg = o._$$LoginManager._$allocate(this.__opt) } else this.__rg = a._$$RegisterManager._$allocate(this.__opt) }._$bind(this), i ? 400 : 0) };
    i._$addEvent(document, "templateready", function() {
        var t = function(t) {
            var e = t.data;
            if (e) {
                if ("string" == typeof e) try { e = JSON.parse(e) } catch (i) {}
                if ("object" == typeof e && "URS|" == e.from) { window.URSCONFIG = e;
                    u._$$Index._$allocate(e) } } };
        i._$addEvent(window, "message", t);
        c._$postMessage("_parent", { data: { "URS-READY": 1 } }) }) }, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);