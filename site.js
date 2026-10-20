// 時空の駅 特設サイト：ヒントを1段ずつ開く／答え合わせ／ネタばれのページは確かめてから開く
(function(){
  function dec(b64){try{return decodeURIComponent(escape(atob(b64)))}catch(e){return ""}}
  var SALT="jikuu-no-eki-2026";
  function norm(s){
    s=(s||"");if(s.normalize)s=s.normalize("NFKC");
    s=s.trim().toLowerCase().replace(/[ 　]/g,"");
    s=s.replace(/[ァ-ヶ]/g,function(c){return String.fromCharCode(c.charCodeAt(0)-0x60)});
    var rep=[["づ","つ"],["ゃ","や"],["ゅ","ゆ"],["ょ","よ"],["っ","つ"],["ー",""],["~",""],["〜",""]];
    rep.forEach(function(r){s=s.split(r[0]).join(r[1])});
    s=s.replace(/[・「」『』。、,.!?！？…\-‐―（）()\[\]【】"'“”]/g,"");
    return s;
  }
  function utf8(s){return unescape(encodeURIComponent(s))}
  function fnv(s){
    var h=0x811c9dc5>>>0, b=utf8(SALT+s), i, k;
    for(i=0;i<b.length;i++){h^=b.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0}
    for(k=0;k<3;k++){var x=("00000000"+h.toString(16)).slice(-8);for(i=0;i<x.length;i++){h^=x.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0}}
    return ("00000000"+h.toString(16)).slice(-8);
  }
  // ヒント・答え：押したら開く。前のヒントを開いていないと、次は開けない
  // confirm() はアプリ内ブラウザで出ないことがあるので使わない。答えは「はい、見る」の2段で開く
  var opens=[].slice.call(document.querySelectorAll(".step .open"));
  opens.forEach(function(btn){
    btn.setAttribute("aria-expanded","false");
    btn.addEventListener("click",function(){
      var box=document.getElementById(btn.getAttribute("data-target"));
      if(btn.getAttribute("aria-expanded")==="true"){box.hidden=true;btn.setAttribute("aria-expanded","false");return}
      var ask=btn.parentNode.querySelector(".ask");
      if(ask && !btn.dataset.ok){
        // まだ開いていないヒントがあるときだけ、そのことを言う。ヒント3まで見た人には、答えを見るかだけを聞く
        var rest=[];
        opens.forEach(function(o,k){ if(o!==btn && !o.dataset.seen) rest.push("ヒント"+(k+1)) });
        ask.querySelector(".askmsg").textContent = rest.length
          ? "まだ開いていないヒントがあります（"+rest.join("・")+"）。それでも答えと解説を見ますか？"
          : "答えと解説を見ますか？";
        ask.hidden=false;ask.querySelector(".yes").focus();return}
      if(!box.dataset.done){box.innerHTML=dec(box.getAttribute("data-enc"));box.dataset.done="1"}
      box.hidden=false;btn.setAttribute("aria-expanded","true");btn.dataset.seen="1";
    });
  });
  [].slice.call(document.querySelectorAll(".ask")).forEach(function(ask){
    var btn=ask.parentNode.querySelector(".open");
    ask.querySelector(".yes").addEventListener("click",function(){ask.hidden=true;btn.dataset.ok="1";btn.click()});
    ask.querySelector(".no").addEventListener("click",function(){ask.hidden=true;btn.focus()});
  });
  // 答え合わせ
  var f=document.querySelector("form.check");
  if(f){f.addEventListener("submit",function(e){
    e.preventDefault();
    var v=norm(f.querySelector("input").value), r=f.querySelector(".result");
    if(!v){r.textContent="答えを入れてください。";r.className="result";return}
    var ok=f.getAttribute("data-h").split(",").indexOf(fnv(v))>=0;
    r.textContent=ok?"〇 正解です！ ページをめくって、物語の続きへ。":"× ちがうみたいです。ヒントを開いてみましょう。";
    r.className="result "+(ok?"ok":"ng");
  })}
  // 確かめてから開くページ（一度開いたら、このブラウザでは覚えておく）
  var g=document.querySelector(".gate");
  if(g){
    var key="gate-"+g.getAttribute("data-gate"), c=document.querySelector(".content");
    function show(){g.hidden=true;c.classList.remove("locked")}
    try{if(localStorage.getItem(key)==="1")show()}catch(e){}
    g.querySelector(".open-gate").addEventListener("click",function(){try{localStorage.setItem(key,"1")}catch(e){}show()});
  }
  // ほんとうの話：開いたときに中身を戻す
  [].slice.call(document.querySelectorAll("details.grp")).forEach(function(d){
    d.addEventListener("toggle",function(){var x=d.querySelector(".enc");if(d.open&&x&&!x.dataset.done){x.innerHTML=dec(x.getAttribute("data-enc"));x.dataset.done="1"}});
  });
})();
