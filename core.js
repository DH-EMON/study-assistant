/* Study Assistant core: helpers + localStorage wrapper (all keys prefixed "sa:"). No server, no sync. */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>ymd(new Date());
const DB={get(k,d){try{const v=localStorage.getItem('sa:'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
set(k,v){try{localStorage.setItem('sa:'+k,JSON.stringify(v))}catch(e){alert('Could not save: browser storage is blocked or full.')}}};
(()=>{
$('#mb').onclick=()=>{const n=$('#nv').classList.toggle('open');$('#mb').setAttribute('aria-expanded',n)};
const tips=['Study in short focused blocks, then take a real break.','Test yourself with MCQs instead of only re-reading.','Revise a topic again after 1 day, 1 week and 1 month.','Write formulas from memory, then check them.','Sleep well: memory is consolidated during sleep.','Start with your hardest subject when you are freshest.','Review every mistake and write why the right answer is right.'];
const t=$('#tip');if(t)t.textContent=tips[Math.floor(Date.now()/864e5)%tips.length];
const me=$('#me');if(me){const q=DB.get('quiz',[]),k=DB.get('tasks',[]).filter(x=>x.d==today());me.textContent=`Quizzes taken: ${q.length} · Tasks done today: ${k.filter(x=>x.dn).length}/${k.length} · Focus sessions today: ${DB.get('focus',{})[today()]||0}`}
const ex=$('#exp');if(ex){
ex.onclick=()=>{const o={};Object.keys(localStorage).filter(k=>k.startsWith('sa:')).forEach(k=>o[k]=localStorage[k]);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o)],{type:'application/json'}));a.download='study-assistant-backup.json';a.click()};
$('#imp').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(x=>{try{const o=JSON.parse(x);let n=0;for(const k in o)if(k.startsWith('sa:')&&typeof o[k]=='string'){localStorage.setItem(k,o[k]);n++}$('#bk').textContent='Imported '+n+' items. Reload other pages to see them.'}catch(err){$('#bk').textContent='That is not a valid backup file.'}})};
$('#clr').onclick=()=>{if(confirm('Delete all Study Assistant data saved on this device?')){Object.keys(localStorage).filter(k=>k.startsWith('sa:')).forEach(k=>localStorage.removeItem(k));$('#bk').textContent='All local data deleted.'}}}
})();
