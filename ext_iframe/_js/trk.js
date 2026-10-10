/**
 *  1: Leggere le performance di rendering
 *  2: Leggere un cookies
 *  3: Generazione pixel
 *  4: Spedizione pixel
 *  5: -- Listener Dom --
 */

/*- utente
 - browser
 - DataManager
 - Utils 
 **/


var TRK_GLOBAL = {
    URI_STATIC_HOME: '/usr/local/apache/htdocs/inc/marketing/httpdbmktg.php',
    URI_DYN_HOME: '/usr/local/apache/htdocs/index.html',
    TRK_HOST: 'http://trk.',
    TRKS_HOST: 'https://trk.',
    MSG_HOST: 'http://trk.',
    MSGS_HOST: 'https://trk.',
    TRK_SRV: '/trk_server.php',
//TRK_MSG:'/inc/marketing/trk_messages.php',
    TRK_MSG: '/messages/trk_messages.php',
    URI_PUBLIC: 'www',
    URI_PUBLIC_ALT: 'web',
    URI_PUBLIC_DEV: 'dev-www',
    CONTINENTAL: 1,
    ETAG_FILE: '/etag.php',
    TRK_LINK: {
        'co.uk': 'names.co.uk',
        'pec.gratis': 'register.it'
    }
};


function dadaTrack() {

    var trk_receive = function (response) {
        console.log('success');
    };

    this.trk_getdom = function () {
        var hostname = location.hostname;
        var hostarray = hostname.split(".");
        hostarray = hostarray.reverse();
        var dom = hostarray[1] + "." + hostarray[0];
        if (typeof TRK_GLOBAL.TRK_LINK[dom] !== 'undefined'){
            return TRK_GLOBAL.TRK_LINK[dom];
        }
        else{
            return dom;
        }
    };

    this.init = function () {
    	this.trk_init();
    }

    this.trk_init = function () {
        this.api = new User(TRK);
        this.api.create_hash();
        this.api.check_prq();
        this.api.set_qs();
        var _old_dadaq = window._dadaq || [];
        window._dadaq = new TrkQueue();
        window._dadaq.push.apply(window.trk_dada, _old_dadaq);
        if (TRK.ready === 1) {
            this.api.getTrack();
        }
    }


    var TrkQueue = function () {
        this.push = function () {
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === "function") trk_dada.api[arguments[i]].call();
                else {
                    trk_dada.api[arguments[i][0]].apply(trk_dada.api, arguments[i].slice(1));
                }
            }
        }
    }


    var User = function (config) {
        var _this = this;
        _this.path = location.pathname;
        _this.pagePerformance = '';
        _this.dataManager = new DataManager();
        _this.browser = new Browser();
        _this.config = config;
        _this.utils = new Utils();
        _this.hutils = new HashUtils();


        _this.getTrack = function () {
            _this.trackData();
        };

        _this.check_prq = function () {
            var prq = 0;
            var isJSON = 1;
            var isJquery = 2;

            prq = (typeof JSON === 'undefined') ? prq | isJSON : prq;
            prq = (typeof jQuery === 'undefined') ? prq | isJquery : prq;
            _this.config.trk_ext.trkC_prq = prq;
        };

        _this.create_hash = function () {
            var hash = _this.hutils.md5(_this.hutils.uniqid(Math.random()));
            _this.config.trk_ext.trkC_hash = hash;
        };

        _this.get_hash = function () {
            if (typeof _this.config.trk_ext.trkC_hash !== 'undefined') {
                return _this.config.trk_ext.trkC_hash;
            }
            return false;
        };

        _this.set_res = function (res) {
            _this.config.trk_ext.trkC_res = res;
        };

        _this.set_mail = function (mail) {
            _this.config.trk_ext.trkC_mail = mail;
        };

        _this.set_mtype = function (mtype) {
            _this.config.trk_ext.trkC_mtype = mtype;
        };

        _this.set_sdom = function (sdom) {
            _this.config.trk_ext.trkC_sdom = sdom;
        };

        _this.set_user = function (user) {
            _this.config.trk_ext.trkC_user = user;
        };

        _this.set_bill = function (bill) {
            _this.config.trk_ext.trkC_bill = bill;
        };

        _this.set_dpdc = function (dpdc) {
            _this.config.trk_ext.trkC_dpdc = dpdc;
        };

        _this.set_geo = function (geo) {
            _this.config.trk_ext.trkC_geo = geo;
        };

        _this.set_pagever = function (page_ver) {
            _this.config.trk_ext.trkC_page_version = page_ver;
        };

        _this.set_oid = function (oid) {
            _this.config.trk_ext.trkC_page_obj = oid;
        };

        _this.set_qs = function () {
            _this.config.trk_ext.trkC_eQS = _this.browser.getQS();
        };

        _this.get_sid = function () {
            var dbmFP = _this.utils.getCookie('dbmFP');
            if (dbmFP) {
                sid = dbmFP.split(".");
                return sid[0];
            }
            return false;
        };

        _this.trackData = function () {
            var domain = _this.config.domain;
            var tkp = _this.config.tkp;
            var trk_ext = _this.config.trk_ext;
            var trk_host = ('https:' == document.location.protocol) ? TRK_GLOBAL.TRKS_HOST : TRK_GLOBAL.TRK_HOST;
            var ajaxConfig = {
                uri: trk_host + domain + TRK_GLOBAL.TRK_SRV,
                data: {},
                callback: function (response) {
                    console.log('success');
                }
            };
            if (tkp === "JS") {
                console.log('static');
                _this.browser.push(trk_ext);
                ajaxConfig.data.tkq = _this.browser.getStr();
            } else {
                console.log('dynamic');
                ajaxConfig.data.tkp = tkp;
                ajaxConfig.data.tkx = _this.utils.encode64(_this.utils.serialize(trk_ext));
                ;
            }
            //this.dataManager.get(ajaxConfig);
            //this.dataManager.post(ajaxConfig);
            this.dataManager.pixel(ajaxConfig);
        };

        _this.redirect = function (url) {
            window.location = url;
        };

        _this.sendMessage = function (mode, field, o) {
            if (o && typeof o === "object" && o !== null && typeof JSON !== 'undefined') {
                var domain = _this.config.domain;
                var hash = trk_dada.api.get_hash();
                if (mode != 'set' && mode != 'push') {
                    mode = 'set';
                }
                var envelope = {
                    hash: hash,
                    domain: domain,
                    field: field,
                    mode: mode,
                    message: o
                };
                var trk_host = ('https:' == document.location.protocol) ? TRK_GLOBAL.MSGS_HOST : TRK_GLOBAL.MSG_HOST;
                var ajaxConfig = {
                    uri: trk_host + domain + TRK_GLOBAL.TRK_MSG,
                    data: {
                        tke: _this.utils.encode64(JSON.stringify(envelope))
                    }
                };
                this.dataManager.pixel(ajaxConfig);
            } else {
                return false
            }
            ;
        };
        _this.trackLI = function (li) {
            _this.utils.setCookie('dbmLI', li);
        };
    };


    var Browser = function () {
        var _this = this;


        _this.getPage = function () {
            var page;
            var dom = _this.getDom();
            if (Boolean(TRK_GLOBAL.CONTINENTAL) && (dom.host === TRK_GLOBAL.URI_PUBLIC || dom.host === TRK_GLOBAL.URI_PUBLIC_DEV || dom.host === TRK_GLOBAL.URI_PUBLIC_ALT)) {
                if (location.pathname === '/') {
                    page = TRK_GLOBAL.URI_STATIC_HOME;
                } else if (location.pathname === '/index.html') {
                    page = TRK_GLOBAL.URI_DYN_HOME;
                } else {

                    page = location.hostname + location.pathname;
                }
            } else {
                page = location.hostname + location.pathname;
            }
            return page;
        };
        _this.getDom = function () {
            var dom = TRK.domain;
            var host = location.hostname.replace('.' + dom, '');
            return {host: host, dom: dom};
        };
        _this.getLang = function () {
            var lang = window.navigator.userLanguage || window.navigator.language;
            return lang.substring(0, 2);
        };
        _this.getRef = function () {
            return document.referrer;
        };
        _this.getUA = function () {
            return navigator.userAgent;
        };
        _this.getQS = function (url) {
            var qs = '';
            if (url && url !== null) {
                if (url.indexOf("?") != -1) {
                    qs = url.substring(url.indexOf('?') + 1);
                }
            } else {
                if (location.href.indexOf('?') != -1) {
                    //qs = location.search.substring(1, location.search.length);
                    qs = location.href.substring(location.href.indexOf('?') + 1);
                }
            }
            return qs;
        };
        _this.getPath = function (url) {
            if (url !== null) {
                url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
                url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
                return url;
            } else {
                return false;
            }
        };
        _this.getStr = function () {
            var utils = new Utils();
            var page = _this.getPage();
            var lang = _this.getLang();
            var d = _this.getDom();
            var ref = _this.getRef();
            var ua = _this.getUA();
            var qs = _this.getQS();
            var eSUB = d.host + d.dom;
            var cDOM = "." + d.dom;
            var extra = utils.encode64(utils.serialize(_this.pull()));
            var str = {
                trkC_eSF: page,
                trkC_eSUB: eSUB,
                cDOM: cDOM,
                trkC_eHR: ref,
                trkC_eUA: ua,
                trkC_lan: lang,
                trkC_eQS: qs,
                ePAGVARS: extra
            };
            return utils.encode64(utils.serialize(str));
        };
        _this.push = function (trk_ext) {
            _this.trk_ext = trk_ext;
        };
        _this.pull = function () {
            var trk_ext = _this.trk_ext || {};
            return trk_ext;
        };

    };


    var DataManager = function () {
        var _this = this;

        _this.pixel = function (config) {
            var img;
            if (!config.uri) {
                throw Error('CLIENT OBJ URI NULL');
            }
            if (!config.data) {
                config.data = {};
            }
            img = document.createElement("img");
            img.height = 0;
            img.width = 0;
            img.style.display = "none";
            var s = document.getElementsByTagName('script')[0];
            if (config.data.tkp) {
                img.src = config.uri + '?tkp=' + config.data.tkp + '&tkx=' + config.data.tkx;
                document.body.appendChild(img);
                //s.parentNode.insertBefore(img, s);
            } else if (config.data.tkj) {
                img.src = config.uri + '?tkj=' + config.data.tkj;
                document.body.appendChild(img);
                //s.parentNode.insertBefore(img, s);
            } else if (config.data.tkq) {
                img.src = config.uri + '?tkq=' + config.data.tkq;
                document.body.appendChild(img);
                //s.parentNode.insertBefore(img, s);
            } else if (config.data.tke) {
                img.src = config.uri + '?tke=' + config.data.tke;
                document.body.appendChild(img);
                //s.parentNode.insertBefore(img, s);
            }
        }
    };

    var Utils = function () {
        var _this = this;
        _this.keyStr = "ABCDEFGHIJKLMNOP" +
            "QRSTUVWXYZabcdef" +
            "ghijklmnopqrstuv" +
            "wxyz0123456789+/" +
            "=";
        _this.encode64 = function (input) {
            input = escape(input);
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64
                } else if (isNaN(chr3)) {
                    enc4 = 64
                }
                output = output + _this.keyStr.charAt(enc1) + _this.keyStr.charAt(enc2) + _this.keyStr.charAt(enc3) + _this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = ""
            } while (i < input.length);
            return output;
        };

        _this.decode64 = function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                console.log("There were invalid base64 characters in the input text.\n" + "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" + "Expect errors in decoding.")
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do {
                enc1 = _this.keyStr.indexOf(input.charAt(i++));
                enc2 = _this.keyStr.indexOf(input.charAt(i++));
                enc3 = _this.keyStr.indexOf(input.charAt(i++));
                enc4 = _this.keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2)
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3)
                }
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = ""
            } while (i < input.length);
            return unescape(output);
        };
        _this.serialize = function (obj) {
            var str = [], item;
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    item = (obj[p] !== null) ? obj[p] : "";
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(item));
                }
            return str.join("&");
        }
        _this.getCookie = function (n) {
            var a, i;
            n += '=';
            for (a = document.cookie.split(/;\s*/), i = a.length - 1; i >= 0; i--) {
                if (!a[i].indexOf(n)) {
                    return a[i].replace(n, '');
                }
            }
            return null;
        }

        _this.setCookie = function (c, v) {
            var dom = TRK.domain;
            document.cookie = c + '=' + v + ';path=/;domain=.' + dom;
        }
    };

    var HashUtils = function () {
        var _this = this;
        md5cycle = function (x, k) {
            var a = x[0], b = x[1], c = x[2], d = x[3];

            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897);
            d = ff(d, a, b, c, k[5], 12, 1200080426);
            c = ff(c, d, a, b, k[6], 17, -1473231341);
            b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416);
            d = ff(d, a, b, c, k[9], 12, -1958414417);
            c = ff(c, d, a, b, k[10], 17, -42063);
            b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682);
            d = ff(d, a, b, c, k[13], 12, -40341101);
            c = ff(c, d, a, b, k[14], 17, -1502002290);
            b = ff(b, c, d, a, k[15], 22, 1236535329);

            a = gg(a, b, c, d, k[1], 5, -165796510);
            d = gg(d, a, b, c, k[6], 9, -1069501632);
            c = gg(c, d, a, b, k[11], 14, 643717713);
            b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691);
            d = gg(d, a, b, c, k[10], 9, 38016083);
            c = gg(c, d, a, b, k[15], 14, -660478335);
            b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438);
            d = gg(d, a, b, c, k[14], 9, -1019803690);
            c = gg(c, d, a, b, k[3], 14, -187363961);
            b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467);
            d = gg(d, a, b, c, k[2], 9, -51403784);
            c = gg(c, d, a, b, k[7], 14, 1735328473);
            b = gg(b, c, d, a, k[12], 20, -1926607734);

            a = hh(a, b, c, d, k[5], 4, -378558);
            d = hh(d, a, b, c, k[8], 11, -2022574463);
            c = hh(c, d, a, b, k[11], 16, 1839030562);
            b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060);
            d = hh(d, a, b, c, k[4], 11, 1272893353);
            c = hh(c, d, a, b, k[7], 16, -155497632);
            b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174);
            d = hh(d, a, b, c, k[0], 11, -358537222);
            c = hh(c, d, a, b, k[3], 16, -722521979);
            b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487);
            d = hh(d, a, b, c, k[12], 11, -421815835);
            c = hh(c, d, a, b, k[15], 16, 530742520);
            b = hh(b, c, d, a, k[2], 23, -995338651);

            a = ii(a, b, c, d, k[0], 6, -198630844);
            d = ii(d, a, b, c, k[7], 10, 1126891415);
            c = ii(c, d, a, b, k[14], 15, -1416354905);
            b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571);
            d = ii(d, a, b, c, k[3], 10, -1894986606);
            c = ii(c, d, a, b, k[10], 15, -1051523);
            b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359);
            d = ii(d, a, b, c, k[15], 10, -30611744);
            c = ii(c, d, a, b, k[6], 15, -1560198380);
            b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070);
            d = ii(d, a, b, c, k[11], 10, -1120210379);
            c = ii(c, d, a, b, k[2], 15, 718787259);
            b = ii(b, c, d, a, k[9], 21, -343485551);

            x[0] = add32(a, x[0]);
            x[1] = add32(b, x[1]);
            x[2] = add32(c, x[2]);
            x[3] = add32(d, x[3]);

        }

        cmn = function (q, a, b, x, s, t) {
            a = add32(add32(a, q), add32(x, t));
            return add32((a << s) | (a >>> (32 - s)), b);
        }

        ff = function (a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        gg = function (a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        hh = function (a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }

        ii = function (a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        md51 = function (s) {
            txt = '';
            var n = s.length,
                state = [1732584193, -271733879, -1732584194, 271733878], i;
            for (i = 64; i <= s.length; i += 64) {
                md5cycle(state, md5blk(s.substring(i - 64, i)));
            }
            s = s.substring(i - 64);
            var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (i = 0; i < s.length; i++)
                tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
            if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i++) tail[i] = 0;
            }
            tail[14] = n * 8;
            md5cycle(state, tail);
            return state;
        }

        md5blk = function (s) {
            var md5blks = [], i;
            for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = s.charCodeAt(i)
                    + (s.charCodeAt(i + 1) << 8)
                    + (s.charCodeAt(i + 2) << 16)
                    + (s.charCodeAt(i + 3) << 24);
            }
            return md5blks;
        }

        var hex_chr = '0123456789abcdef'.split('');

        rhex = function (n) {
            var s = '', j = 0;
            for (; j < 4; j++)
                s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
                    + hex_chr[(n >> (j * 8)) & 0x0F];
            return s;
        }

        hex = function (x) {
            for (var i = 0; i < x.length; i++)
                x[i] = rhex(x[i]);
            return x.join('');
        }

        _this.md5 = function (s) {
            return hex(md51(s));
        }


        add32 = function (a, b) {
            return (a + b) & 0xFFFFFFFF;
        }

        if (_this.md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
            add32 = function (x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            }
        }

        _this.uniqid = function (pr, en) {
            var pr = pr || '', en = en || false, result, us;

            seed = function (s, w) {
                s = parseInt(s, 10).toString(16);
                return w < s.length ? s.slice(s.length - w) : (w > s.length) ? new Array(1 + (w - s.length)).join('0') + s : s;
            };

            result = pr + seed(parseInt(new Date().getTime() / 1000, 10), 8) + seed(Math.floor(Math.random() * 0x75bcd15) + 1, 5);

            if (en) result += (Math.random() * 10).toFixed(8).toString();

            return result;
        }
    };
}
//MAIN CODE
var trk_dada = new dadaTrack();
if (typeof console == "undefined" || typeof console.log == "undefined") var console = {
    log: function () {
    }
};
if (typeof TRK === 'undefined') {
    var TRK = {
        domain: trk_dada.trk_getdom(),
        tkp: "JS",
        initTime: (new Date()).getTime()
    };
}
if (typeof TRK.ready === 'undefined') {
    TRK.ready = 1;
}
if (typeof trk_ext === 'undefined') {
    TRK.trk_ext = {};
} else {
    TRK.trk_ext = trk_ext;
}
if (typeof TRK.async === 'undefined') {
    TRK.async = 0;
}
if(!TRK.async)
	trk_dada.trk_init();
else
	console.log('async');