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