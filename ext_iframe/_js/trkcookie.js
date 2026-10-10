function TrkCookie(){
var _this=this;

var COOKIES={
COOKIE_HIST:'_wicasa',
COOKIE_SESS:'_ashkii'
};

	var cookie_hist={
		cid:null,
		scp:0,
		ckborn:null,
		cktime:null,
		pk:null,
		iscli:false,
		lastref:null,
		lastdomsrc:null
	};

	var cookie_sess={
		sid:null,
		ssp:0,
		pp:null
	};

var  keyStr = "ABCDEFGHIJKLMNOP" +
            "QRSTUVWXYZabcdef" +
            "ghijklmnopqrstuv" +
            "wxyz0123456789+/" +
            "=";


_this.init = function(){
	cookie_hist=getCookie(COOKIES.COOKIE_HIST);
	cookie_sess=getCookie(COOKIES.COOKIE_SESS);
};

var getCookie=function(cookie){
	var cookie64js=decodeURIComponent(readCookie(cookie));
	if (!cookie64js){
		console.log("decodeUri failed");
		return false;
	}
	var cookie64 = cookie64js.replace('JSON_','');
	if (cookie64 === cookie64js){
		console.log("JSON replace failed");
		return false;
	}
	var cookiestr=decode64(cookie64);
	if (!cookiestr){
		console.log("Non a valid base64 string");
		return false;
	}
	var cookieobj=JSON.parse(cookiestr);
	if (!cookieobj || typeof cookieobj !== 'object'){
		console.log("Non a valid JSON object");
		return false;
	}
	return cookieobj;
};


_this.getUserId = function(){
	if(cookie_hist.cid){
		return cookie_hist.cid;
	}else{
		return false;
	}
};

_this.getDayCounter = function(){
	if(cookie_hist.scp){
		return cookie_hist.scp;
	}else{
		return false;
	}
};

_this.getCookieBornDate = function(){
        if(cookie_hist.ckborn){
                return cookie_hist.ckborn;
        }else{
                return false;
        }
};

_this.getLastSeenDate = function(){
	if(cookie_hist.cktime){
		return cookie_hist.cktime;
	}else{
		return false;
	}
};

_this.getFirstOrigin = function(){
	if(cookie_hist.pk){
		return cookie_hist.pk;
	}else{
		return false;
	}
};

_this.isCustomer = function(){
	if(cookie_hist.iscli && cookie_hist.iscli==1){
		return true;
	}else{
		return false;
	}
};

_this.getLastPage = function(){
	if(cookie_hist.lastref){
		return cookie_hist.lastref;
	}else{
		return false;
	}
};

_this.getSessionId = function(){
	if(cookie_sess.sid){
		return cookie_sess.sid;
	}else{
		return false;
	}
};

_this.getSessionCounter = function(){
	if(cookie_sess.ssp){
		return cookie_sess.ssp;
	}else{
		return false;
	}
};

_this.getSessionOrigin = function(){
	if(cookie_sess.pp){
		return cookie_sess.pp;
	}else{
		return false;
	}
};
	_this.getLastDomain = function(){
		if(cookie_hist.lastdomsrc){
			return cookie_hist.lastdomsrc;
		}else{
			return false;
		}
	};

 var readCookie=function(n){
	var a,i;n+='=';
	for(a=document.cookie.split(/;\s*/),i=a.length-1;i>=0;i--){
		if(!a[i].indexOf(n)){
			return a[i].replace(n,'');
		}
	}
	return null;
};

var decode64 = function(input) {
	 var output = "";
	 var chr1, chr2, chr3 = "";
	 var enc1, enc2, enc3, enc4 = "";
	 var i = 0;
	 var base64test = /[^A-Za-z0-9\+\/\=]/g;
	 if (base64test.exec(input)) {
	 console.log("Not a valid base64 string");
	 }
	 input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	 do {
	 enc1 = keyStr.indexOf(input.charAt(i++));
	 enc2 = keyStr.indexOf(input.charAt(i++));
	 enc3 = keyStr.indexOf(input.charAt(i++));
	 enc4 = keyStr.indexOf(input.charAt(i++));
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

}

var trkcookie=new TrkCookie();
trkcookie.init();