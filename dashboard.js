/* Study Assistant home dashboard. Real data only (localStorage):
   sa:quiz, sa:tasks, sa:focus, sa:focusMin, sa:goal, sa:exams, sa:qnote. */
(()=>{
if(!$('#ds'))return;
const num=v=>Number(v)>0?Number(v):0,set=(id,v)=>{$('#'+id).textContent=v};
const dd=(a,b)=>Math.round((new Date(a+'T00:00')-new Date(b+'T00:00'))/864e5);
function render(){
const Q=DB.get('quiz',[]),T=DB.get('tasks',[]),F=DB.get('focus',{}),M=DB.get('focusMin',{}),goal=num(DB.get('goal',0)),td=today();
const fm=num(M[td]),fs=num(F[td]),done=T.filter(x=>x.dn==td).length,sch=T.filter(x=>x.d==td).length,qt=Q.filter(x=>x.d==td).length;
const A=new Set([...Q.map(x=>x.d),...T.map(x=>x.dn).filter(Boolean),...Object.keys(F).filter(k=>num(F[k])),...Object.keys(M).filter(k=>num(M[k]))]);
let s=0,d=new Date();if(!A.has(ymd(d)))d.setDate(d.getDate()-1);while(A.has(ymd(d))){s++;d.setDate(d.getDate()-1)}
set('dq',Q.length);set('dqs',qt+' today · saved attempts');
set('dt',done);set('dts',sch+' scheduled for today');
set('df',fm+' min');set('dfs',fs+(fs==1?' session':' sessions')+' today'+(fs&&!fm?' · minutes are counted only for sessions finished after the update':''));
set('dk',s+(s==1?' day':' days'));
$('#rc').setAttribute('stroke-dashoffset',326.7*(1-(goal?Math.min(1,fm/goal):0)));
set('rg',fm+' min');set('rgs',goal?'of '+goal+' min goal':'no goal set');
set('gt',goal?fm+' of '+goal+' focus minutes today'+(fm>=goal?' · Goal reached!':''):'No daily goal yet. Set one below.');
$('#gi').placeholder=goal?String(goal):'e.g. 60';
const rows=[];for(let i=6;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);const k=ymd(x);
rows.push({k,l:x.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}),f:num(M[k]),t:T.filter(y=>y.dn==k).length,q:Q.filter(y=>y.d==k).length})}
const mx=Math.max(goal,...rows.map(r=>r.f),1);
$('#bars').innerHTML=rows.map(r=>`<div class="col"><span class="v">${r.f}</span><i style="height:${Math.round(r.f/mx*100)}%"></i><small>${r.l.slice(0,3)}</small></div>`).join('');
$('#wk').innerHTML=rows.map(r=>`<tr><th scope="row">${r.l}${r.k==td?' (today)':''}</th><td>${r.f}</td><td>${r.t}</td><td>${r.q}</td></tr>`).join('');
const sm=k=>rows.reduce((a,r)=>a+r[k],0);
set('wt','Last 7 days: '+sm('f')+' focus min · '+sm('t')+' tasks completed · '+sm('q')+' quizzes');
const S={};Q.forEach(x=>{if(x.s&&x.s!='All'){const o=S[x.s]||(S[x.s]={c:0,n:0});o.c+=num(x.c);o.n+=num(x.n)}});
const ks=Object.keys(S);$('#sj').innerHTML=ks.length?ks.map(k=>{const p=S[k].n?Math.round(S[k].c/S[k].n*100):0;return `<div class="sj"><div>${esc(k)}: ${p}% <small>(${S[k].n} questions${S[k].n<10?', small sample':''})</small></div><div class="tr"><i style="width:${p}%"></i></div></div>`}).join(''):'<p>Take a quiz on one subject to see accuracy here.</p>';
const X=DB.get('exams',[]).filter(x=>x&&x.d).sort((a,b)=>a.d.localeCompare(b.d));
$('#xl').innerHTML=X.length?X.map(x=>{const n=dd(x.d,td);return `<div class="ex"><b>${n<0?'Passed':n==0?'Today':n}</b><small>${n>0?(n==1?'day':'days'):''}</small><div>${esc(x.n)}</div><button class="s" data-x="${x.id}" aria-label="Remove ${esc(x.n)}">Remove</button></div>`}).join(''):'<p>No exams added yet.</p>';
$$('[data-x]').forEach(b=>b.onclick=()=>{DB.set('exams',DB.get('exams',[]).filter(x=>x.id!=b.dataset.x));render()});
}
$('#gf').onsubmit=e=>{e.preventDefault();const n=parseInt($('#gi').value);
if(!(n>=5&&n<=720)){set('gm','Enter a goal between 5 and 720 minutes.');return}
DB.set('goal',n);$('#gi').value='';set('gm','Goal saved.');render()};
$('#xf').onsubmit=e=>{e.preventDefault();const n=$('#xn').value.trim(),dt=$('#xd').value,L=DB.get('exams',[]);
if(!n||!dt){set('xm','Enter an exam name and a date.');return}if(L.length>=10){set('xm','You can keep up to 10 exams.');return}
DB.set('exams',[...L,{id:Date.now(),n:n.slice(0,40),d:dt}]);$('#xn').value='';$('#xd').value='';set('xm','Exam added.');render()};
const nt=$('#nt');nt.value=DB.get('qnote','');nt.oninput=()=>{DB.set('qnote',nt.value.slice(0,2000));set('nm','Saved on this device.')};
addEventListener('pageshow',render);render();
})();
