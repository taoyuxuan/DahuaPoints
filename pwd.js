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
                this.__safeLogin(e) 
            } 
        } 
    }();

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
                t = t.substr(r) 
            } else { 
                n = t.charCodeAt(0);
                t = t.substr(1) 
            }
            var s = "";
            if (n) {
                if (n > t.length) { this.error = !0;
                    return null }
                s = t.substr(0, n);
                t = t.substr(n) 
            }
            if (32 & i) e.push(this.parse(s));
            else e.push(this.value(128 & i ? 4 : 31 & i, s)) 
        }
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
                    r = [] 
                } 
            }
            return i.join(".") 
        }
        return null 
    };
    this.data = this.parse(t) };

var RSA = { 
    getPublicKey: function(t) {
        if (t.length < 50) return !1;
        if ("-----BEGIN PUBLIC KEY-----" != t.substr(0, 26)) return !1;
        t = t.substr(26);
        if ("-----END PUBLIC KEY-----" != t.substr(t.length - 24)) return !1;
        t = t.substr(0, t.length - 24);
        t = new ASN1Data(Base64.decode(t));
        if (t.error) return !1;
        t = t.data;
        if ("1.2.840.113549.1.1.1" == t[0][0][0]) 
            return new RSAPublicKey(t[0][1][0][0], t[0][1][0][1]);
        else return !1 
    }, encrypt: function(t, e) {
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