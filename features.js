/* Home extras: site search, syllabus tracker, flashcard decks. All data stays in this browser (sa:syl, sa:decks). */
(()=>{
if(!$('#sq'))return;
const set=(id,v)=>{$('#'+id).textContent=v};
const IDX=[['Study Materials','study-materials.html','notes revision bookmarks'],['Practice quiz','practice.html','mcq quiz mock test timed'],['Calculator & unit converter','study-tools.html','calculator scientific converter formulas'],['Admission preparation','admission.html','university admission roadmap checklist'],['Planner, focus timer & relax sounds','study-planner.html','tasks planner pomodoro timer stopwatch relax breathing streak'],['English grammar & vocabulary','english.html','english grammar vocabulary flashcards'],['Help, backup & privacy','help.html','help backup restore privacy delete data'],['Physics notes','study-materials.html#n1','newton laws motion'],['Chemistry notes','study-materials.html#n2','mole avogadro'],['Higher Math notes','study-materials.html#n3','quadratic equation'],['ICT notes','study-materials.html#n4','binary number systems'],['Accounting notes','study-materials.html#n5','debit credit equation'],['Economics notes','study-materials.html#n6','demand elasticity']];
['Physics','Chemistry','Higher Math','ICT','Accounting','Economics','English'].forEach(s=>IDX.push([s+' practice questions','practice.html?subject='+encodeURIComponent(s),'quiz mcq '+s]));
$('#sq').oninput=e=>{const w=e.target.value.toLowerCase().split(/\s+/).filter(Boolean);
const r=w.length?IDX.filter(x=>w.every(t=>(x[0]+' '+x[2]).toLowerCase().includes(t))).slice(0,8):[];
$('#sr').innerHTML=w.length&&!r.length?'<li>No match. Try another word.</li>':r.map(x=>`<li><a href="${x[1]}">${esc(x[0])}</a></li>`).join('')};
const SUB=['Physics','Chemistry','Higher Math','Biology','ICT','Bangla','English','Accounting','Finance','Business Organization','Economics','Civics','History','Other'];
$('#ys').innerHTML=SUB.map(s=>`<option>${s}</option>`).join('');
let Y=DB.get('syl',[]);
const saveY=()=>{DB.set('syl',Y);drawY()};
function drawY(){const g={};Y.forEach(x=>(g[x.s]=g[x.s]||[]).push(x));const ks=Object.keys(g);
$('#yl').innerHTML=ks.length?ks.map(s=>{const a=g[s],d=a.filter(x=>x.d).length,p=Math.round(d/a.length*100);
return `<div class="sj"><b>${esc(s)}</b> <small>${d}/${a.length} chapters (${p}%)</small><div class="tr"><i style="width:${p}%"></i></div>${a.map(x=>`<div class="yk"><label><input type="checkbox" data-y="${x.id}" ${x.d?'checked':''}> <span class="${x.d?'done':''}">${esc(x.c)}</span></label><button type="button" class="s" data-yd="${x.id}" aria-label="Remove ${esc(x.c)}">✕</button></div>`).join('')}</div>`}).join(''):'<p>No chapters yet. Add the chapters you need to cover.</p>';
$$('[data-y]').forEach(c=>c.onchange=()=>{Y=Y.map(x=>x.id==c.dataset.y?{...x,d:c.checked}:x);saveY()});
$$('[data-yd]').forEach(b=>b.onclick=()=>{Y=Y.filter(x=>x.id!=b.dataset.yd);saveY()})}
$('#yf').onsubmit=e=>{e.preventDefault();const c=$('#yc').value.trim();
if(!c){set('ym','Enter a chapter name.');return}if(Y.length>=200){set('ym','You can keep up to 200 chapters.');return}
Y=[...Y,{id:Date.now(),s:$('#ys').value,c:c.slice(0,60),d:false}];$('#yc').value='';set('ym','Chapter added.');saveY()};
drawY();
let K=DB.get('decks',[]),ci=0,back=false;
const cur=()=>K.find(x=>x.id==$('#kd').value);
const saveK=()=>DB.set('decks',K);
function drawK(sel){$('#kd').innerHTML=K.length?K.map(x=>`<option value="${x.id}">${esc(x.n)} (${x.c.length})</option>`).join(''):'<option value="">No decks yet</option>';if(sel)$('#kd').value=sel;view()}
function view(){const d=cur(),v=$('#kv');
if(!d)v.textContent='Create a deck first.';
else if(!d.c.length)v.textContent='This deck has no cards yet. Add one below.';
else{ci=Math.min(ci,d.c.length-1);const c=d.c[ci];v.innerHTML=`<small>${back?'Back':'Front'} · card ${ci+1} of ${d.c.length}</small><div>${esc(back?c.b:c.f)}</div>`}}
$('#kd').onchange=()=>{ci=0;back=false;view()};
$('#kfl').onclick=()=>{back=!back;view()};
$('#knx').onclick=()=>{const d=cur();if(d&&d.c.length){ci=(ci+1)%d.c.length;back=false;view()}};
$('#kdc').onclick=()=>{const d=cur();if(d&&d.c.length&&confirm('Delete this card?')){d.c.splice(ci,1);ci=0;back=false;saveK();drawK(d.id)}};
$('#kdd').onclick=()=>{const d=cur();if(d&&confirm('Delete the deck "'+d.n+'" and all its cards?')){K=K.filter(x=>x.id!=d.id);ci=0;back=false;saveK();drawK()}};
$('#kn').onsubmit=e=>{e.preventDefault();const n=$('#kni').value.trim();if(!n){set('kmm','Enter a deck name.');return}if(K.length>=20){set('kmm','You can keep up to 20 decks.');return}
const d={id:Date.now(),n:n.slice(0,40),c:[]};K.push(d);saveK();$('#kni').value='';ci=0;back=false;set('kmm','Deck created.');drawK(d.id)};
$('#kc').onsubmit=e=>{e.preventDefault();const d=cur(),f=$('#kfr').value.trim(),b=$('#kbk').value.trim();
if(!d){set('kmm','Create or choose a deck first.');return}if(!f||!b){set('kmm','Fill in both the front and the back.');return}if(d.c.length>=200){set('kmm','A deck can hold up to 200 cards.');return}
d.c.push({f:f.slice(0,200),b:b.slice(0,200)});saveK();$('#kfr').value=$('#kbk').value='';set('kmm','Card added.');drawK(d.id)};
drawK();
})();
