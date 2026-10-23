/* Study Assistant home dashboard. Uses only data saved in this browser:
   sa:quiz, sa:tasks, sa:focus (sessions/day), sa:focusMin (minutes/day, new), sa:goal (new). */
(()=>{
if(!$('#ds'))return;
const num=v=>Number(v)>0?Number(v):0,set=(id,v)=>{$('#'+id).textContent=v};
function render(){
const Q=DB.get('quiz',[]),T=DB.get('tasks',[]),F=DB.get('focus',{}),M=DB.get('focusMin',{}),goal=num(DB.get('goal',0)),td=today();
const fm=num(M[td]),fs=num(F[td]),done=T.filter(x=>x.dn==td).length,sch=T.filter(x=>x.d==td).length,qt=Q.filter(x=>x.d==td).length;
const A=new Set([...Q.map(x=>x.d),...T.map(x=>x.dn).filter(Boolean),...Object.keys(F).filter(k=>num(F[k])),...Object.keys(M).filter(k=>num(M[k]))]);
let s=0,d=new Date();if(!A.has(ymd(d)))d.setDate(d.getDate()-1);while(A.has(ymd(d))){s++;d.setDate(d.getDate()-1)}
set('dq',Q.length);set('dqs',qt+' today · saved attempts');
set('dt',done);set('dts',sch+' scheduled for today');
set('df',fm+' min');set('dfs',fs+(fs==1?' session':' sessions')+' today'+(fs&&!fm?' · minutes are counted only for sessions finished after the update':''));
set('dk',s+(s==1?' day':' days'));
const gp=$('#gp');
if(goal){gp.hidden=false;gp.max=goal;gp.value=Math.min(fm,goal);set('gt',fm+' of '+goal+' focus minutes today'+(fm>=goal?' · Goal reached!':''))}
else{gp.hidden=true;set('gt','No daily goal yet. Set one below.')}
$('#gi').placeholder=goal?String(goal):'e.g. 60';
const rows=[];for(let i=6;i>=0;i--){const x=new Date();x.setDate(x.getDate()-i);const k=ymd(x);
rows.push({k,l:x.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}),f:num(M[k]),t:T.filter(y=>y.dn==k).length,q:Q.filter(y=>y.d==k).length})}
const mx=Math.max(goal,...rows.map(r=>r.f),1);
$('#wk').innerHTML=rows.map(r=>`<tr${r.k==td?' class="now"':''}><th scope="row">${r.l}${r.k==td?' (today)':''}</th><td>${r.f}<span class="wb" aria-hidden="true"><i style="width:${Math.round(r.f/mx*100)}%"></i></span></td><td>${r.t}</td><td>${r.q}</td></tr>`).join('');
const sm=k=>rows.reduce((a,r)=>a+r[k],0);
set('wt','Last 7 days: '+sm('f')+' focus min · '+sm('t')+' tasks completed · '+sm('q')+' quizzes');
}
$('#gf').onsubmit=e=>{e.preventDefault();const n=parseInt($('#gi').value);
if(!(n>=5&&n<=720)){set('gm','Enter a goal between 5 and 720 minutes.');return}
DB.set('goal',n);$('#gi').value='';set('gm','Goal saved.');render()};
addEventListener('pageshow',render);render();
})();
