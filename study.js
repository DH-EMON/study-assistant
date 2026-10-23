/* Study Assistant study features: quiz, planner, notes bookmarks, flashcards, checklist. SAMPLE questions only. */
(()=>{
const Q=[
['Physics','Easy','What is the SI unit of force?',['Joule','Newton','Watt','Pascal'],1,'Force = mass × acceleration, so the unit is kg·m/s², called the newton.'],
['Physics','Medium','A car starts from rest and accelerates at 2 m/s² for 5 s. Its final velocity is:',['5 m/s','10 m/s','7 m/s','25 m/s'],1,'v = u + at = 0 + 2×5 = 10 m/s.'],
['Physics','Easy','Approximate acceleration due to gravity near Earth’s surface:',['1.6 m/s²','9.8 m/s²','98 m/s²','3.7 m/s²'],1,'g ≈ 9.8 m/s².'],
['Chemistry','Easy','Atomic number of carbon is:',['4','6','8','12'],1,'Carbon has 6 protons.'],
['Chemistry','Easy','pH of pure water at 25 °C is:',['0','5','7','14'],2,'Pure water is neutral: pH 7.'],
['Chemistry','Medium','Number of particles in one mole (Avogadro number):',['6.022×10²³','6.022×10²⁰','3.011×10²³','1.6×10⁻¹⁹'],0,'One mole contains 6.022×10²³ particles.'],
['Higher Math','Medium','Roots of x² − 5x + 6 = 0 are:',['1 and 6','2 and 3','−2 and −3','−1 and −6'],1,'x² − 5x + 6 = (x−2)(x−3).'],
['Higher Math','Medium','d/dx of x³ is:',['x²','3x²','3x','x³/3'],1,'Power rule: d/dx xⁿ = n·xⁿ⁻¹.'],
['Higher Math','Hard','If α and β are roots of x² − 7x + 10 = 0, then α² + β² =',['29','39','49','19'],0,'α+β = 7, αβ = 10, so α²+β² = 49 − 20 = 29.'],
['ICT','Medium','Decimal 10 in binary is:',['1001','1010','1100','1110'],1,'8 + 2 = 10, so 1010.'],
['ICT','Hard','Binary 1101 + 0111 equals:',['10100','10010','10110','11000'],0,'13 + 7 = 20 = 10100 in binary.'],
['Accounting','Easy','The accounting equation is:',['Assets = Liabilities + Owner’s Equity','Assets = Liabilities − Equity','Equity = Assets + Liabilities','Liabilities = Assets + Equity'],0,'Resources are financed by outsiders (liabilities) or the owner (equity).'],
['Economics','Easy','According to the law of demand, when price rises (other things equal), quantity demanded:',['Rises','Falls','Stays same','Doubles'],1,'Price and quantity demanded move in opposite directions.'],
['English','Easy','Choose the correct sentence:',['She go to school daily.','She goes to school daily.','She going to school daily.','She gone to school daily.'],1,'Third-person singular in the simple present takes -s/-es.'],
['English','Easy','He is ___ honest man.',['a','an','the','no article'],1,'“Honest” starts with a vowel sound, so use “an”.']];
const qs=$('#qgo');if(qs){
const subs=[...new Set(Q.map(x=>x[0]))];$('#qsub').innerHTML='<option value="">All subjects</option>'+subs.map(s=>`<option>${s}</option>`).join('');
const sp=new URLSearchParams(location.search).get('subject');if(sp&&subs.includes(sp))$('#qsub').value=sp;
let L,i,A,t0,iv,timed,end;
const shuffle=a=>{a=[...a];for(let j=a.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[a[j],a[k]]=[a[k],a[j]]}return a};
const hist=()=>{const h=DB.get('quiz',[]).slice(0,5);$('#qhist').innerHTML=h.length?h.map(x=>`<li>${x.d} · ${esc(x.s)} · ${x.c}/${x.n}</li>`).join(''):'<li>No attempts yet.</li>'};
const draw=()=>{const q=L[i],a=A[i],fb=!timed&&a>=0;$('#qh').textContent=`Question ${i+1} of ${L.length} · ${q[0]} · ${q[1]}`;$('#qq').textContent=q[2];$('#qo').innerHTML='';
q[3].forEach((o,j)=>{const b=document.createElement('button');b.className='opt'+(fb?(j==q[4]?' ok':j==a?' no':''):j==a?' sel':'');b.textContent=String.fromCharCode(65+j)+'. '+o;b.onclick=()=>{if(fb)return;A[i]=j;draw()};$('#qo').append(b)});
$('#qx').textContent=fb?(a==q[4]?'Correct. ':'Incorrect. ')+q[5]:'';$('#qpv').disabled=i==0;$('#qnx').disabled=i==L.length-1};
const fin=()=>{clearInterval(iv);const sec=Math.round((Date.now()-t0)/1000);let c=0;L.forEach((q,j)=>{if(A[j]==q[4])c++});
const h=DB.get('quiz',[]);h.unshift({d:today(),s:$('#qsub').value||'All',n:L.length,c,sec});DB.set('quiz',h.slice(0,20));
$('#qbox').hidden=true;$('#qres').hidden=false;$('#qsum').textContent=`Score ${c}/${L.length} (${Math.round(c/L.length*100)}% accuracy) · Time ${Math.floor(sec/60)}m ${sec%60}s · Marking: +1 per correct answer, no negative marks`;
$('#qrev').innerHTML=L.map((q,j)=>A[j]==q[4]?'':`<li><b>${esc(q[2])}</b><br>Your answer: ${A[j]<0?'not answered':esc(q[3][A[j]])}<br>Correct: ${esc(q[3][q[4]])}<br>${esc(q[5])}</li>`).join('')||'<li>All answers correct!</li>';hist()};
$('#qgo').onclick=()=>{const s=$('#qsub').value,d=$('#qdif').value;L=shuffle(Q.filter(x=>(!s||x[0]==s)&&(!d||x[1]==d))).slice(0,+$('#qn').value);
if(!L.length){$('#qe').textContent='No sample questions match these filters. Try “All”.';return}
$('#qe').textContent='';timed=$('#qm').value=='t';i=0;A=L.map(()=>-1);t0=Date.now();clearInterval(iv);$('#qset').hidden=true;$('#qres').hidden=true;$('#qbox').hidden=false;$('#qt').textContent='';
if(timed){end=t0+L.length*45000;iv=setInterval(()=>{const r=Math.max(0,Math.ceil((end-Date.now())/1000));$('#qt').textContent='Time left: '+Math.floor(r/60)+':'+String(r%60).padStart(2,'0');if(r<=0)fin()},500)}draw()};
$('#qpv').onclick=()=>{i--;draw()};$('#qnx').onclick=()=>{i++;draw()};$('#qfn').onclick=fin;
$('#qrt').onclick=()=>$('#qgo').click();$('#qnw').onclick=()=>{$('#qres').hidden=true;$('#qset').hidden=false};hist()}

const pf=$('#pf');if(pf){let T=DB.get('tasks',[]),eid=null;$('#pd').value=today();
const save=()=>{DB.set('tasks',T);draw()};
pf.onsubmit=e=>{e.preventDefault();const t=$('#pt').value.trim(),m=parseInt($('#pm').value);
if(!t){$('#pe').textContent='Please enter a task title.';return}if(!(m>0&&m<=720)){$('#pe').textContent='Duration must be 1–720 minutes.';return}$('#pe').textContent='';
const old=T.find(x=>x.id==eid),o={id:eid||Date.now(),t,s:$('#ps').value.trim()||'General',m,p:$('#pp').value,d:$('#pd').value||today(),dn:old?old.dn:null};
T=eid?T.map(x=>x.id==eid?o:x):[...T,o];eid=null;pf.reset();$('#pd').value=today();$('#pb').textContent='Add task';save()};
function draw(){const f=$('#pfl').value,v=T.filter(x=>f=='all'||x.d==today()).sort((a,b)=>a.d.localeCompare(b.d)||'HML'.indexOf(a.p[0])-'HML'.indexOf(b.p[0]));
$('#pl').innerHTML=v.length?'':'<p>No tasks here yet. Add one above.</p>';
v.forEach(x=>{const r=document.createElement('div');r.className='tk';r.innerHTML=`<input type="checkbox" ${x.dn?'checked':''} aria-label="Mark done"><span class="${x.dn?'done':''}">${esc(x.t)} <small>· ${esc(x.s)} · ${x.m} min · ${x.p} · ${x.d}</small></span><button class="s">Edit</button><button class="d">Delete</button>`;
const [c,e,d]=r.querySelectorAll('input,button');c.onchange=()=>{x.dn=c.checked?today():null;save()};
e.onclick=()=>{eid=x.id;$('#pt').value=x.t;$('#ps').value=x.s;$('#pm').value=x.m;$('#pp').value=x.p;$('#pd').value=x.d;$('#pb').textContent='Save changes';scrollTo(0,0)};
d.onclick=()=>{if(confirm('Delete this task?')){T=T.filter(y=>y.id!=x.id);save()}};$('#pl').append(r)});
const td=T.filter(x=>x.d==today()),n=td.filter(x=>x.dn).length;$('#pg').value=td.length?n/td.length*100:0;$('#pgt').textContent=`Today: ${n} of ${td.length} done`;
const ds=new Set(T.map(x=>x.dn).filter(Boolean));let k=0,dt=new Date();if(!ds.has(ymd(dt)))dt.setDate(dt.getDate()-1);while(ds.has(ymd(dt))){k++;dt.setDate(dt.getDate()-1)}$('#pst').textContent=k}
$('#pfl').onchange=draw;draw()}

const ns=$('#ns');if(ns){let B=DB.get('bm',[]);
const f=()=>{const q=ns.value.toLowerCase(),s=$('#nsub').value,v=$('#nsv').checked;let n=0;$$('.note').forEach(e=>{const ok=(!s||e.dataset.s==s)&&(!q||e.textContent.toLowerCase().includes(q))&&(!v||B.includes(e.id));e.hidden=!ok;if(ok)n++});$('#nc').textContent=n?'':'No notes match your filters.'};
$$('.bm').forEach(b=>{const id=b.closest('.note').id,u=()=>b.textContent=B.includes(id)?'★ Saved':'☆ Save';u();b.onclick=()=>{B=B.includes(id)?B.filter(x=>x!=id):[...B,id];DB.set('bm',B);u();f()}});
[ns,$('#nsub'),$('#nsv')].forEach(e=>e.addEventListener('input',f))}

const fw=$('#fw');if(fw){const W=[['diligent','hard-working and careful','পরিশ্রমী'],['abundant','existing in large quantities','প্রচুর'],['benevolent','kind and generous','দয়ালু'],['candid','honest and direct','স্পষ্টবাদী'],['ephemeral','lasting a very short time','ক্ষণস্থায়ী'],['meticulous','very careful about details','খুঁটিনাটিতে সতর্ক'],['ambiguous','having more than one possible meaning','দ্ব্যর্থক'],['eloquent','fluent and persuasive in speech','বাকপটু'],['scarce','not enough; in short supply','দুষ্প্রাপ্য'],['resilient','able to recover quickly','সহনশীল']];
let i=0,K=DB.get('known',[]);const d=()=>{fw.textContent=W[i][0];$('#fm').textContent='';$('#fk').textContent=K.includes(W[i][0])?'✓ Known (tap to undo)':'Mark as known';$('#fcn').textContent=K.length+' of '+W.length+' marked known'};
$('#ff').onclick=()=>$('#fm').textContent=W[i][1]+' — '+W[i][2];$('#fn').onclick=()=>{i=(i+1)%W.length;d()};
$('#fk').onclick=()=>{const w=W[i][0];K=K.includes(w)?K.filter(x=>x!=w):[...K,w];DB.set('known',K);d()};d()}

$$('.ck').forEach(c=>{c.checked=DB.get('ck',[]).includes(c.id);c.onchange=()=>{const k=DB.get('ck',[]).filter(x=>x!=c.id);DB.set('ck',c.checked?[...k,c.id]:k)}});
})();
