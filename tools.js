/* Study Assistant tools: calculator, unit converter, focus timer, stopwatch. */
(()=>{
function calc(src,deg){let s=src.toLowerCase().replace(/\s+/g,'').replace(/×/g,'*').replace(/÷/g,'/').replace(/π/g,'pi').replace(/√/g,'sqrt'),i=0;
const r=x=>deg?x*Math.PI/180:x,pos=(x,n)=>{if(x<=0)throw Error(n+' needs a positive number');return x};
const F={sin:x=>Math.sin(r(x)),cos:x=>Math.cos(r(x)),tan:x=>Math.tan(r(x)),sqrt:x=>{if(x<0)throw Error('Square root of a negative number');return Math.sqrt(x)},log:x=>Math.log10(pos(x,'log')),ln:x=>Math.log(pos(x,'ln')),abs:Math.abs};
const close=()=>{if(s[i++]!=')')throw Error('Missing closing bracket')};
const E=()=>{let v=T();while(s[i]=='+'||s[i]=='-'){const o=s[i++],y=T();v=o=='+'?v+y:v-y}return v},
T=()=>{let v=U();while(s[i]=='*'||s[i]=='/'){const o=s[i++],y=U();if(o=='/'&&y==0)throw Error('Cannot divide by zero');v=o=='*'?v*y:v/y}return v},
U=()=>{if(s[i]=='-'){i++;return -U()}if(s[i]=='+'){i++;return U()}return P()},
P=()=>{const b=A();if(s[i]=='^'){i++;return Math.pow(b,U())}return b},
A=()=>{let m;if(s[i]=='('){i++;const v=E();close();return v}
if(m=/^(\d+\.?\d*|\.\d+)/.exec(s.slice(i))){i+=m[0].length;return +m[0]}
if(m=/^[a-z]+/.exec(s.slice(i))){const n=m[0];i+=n.length;if(n=='pi')return Math.PI;if(n=='e')return Math.E;if(!F[n])throw Error('Unknown name: '+n);if(s[i++]!='(')throw Error('Use brackets, e.g. '+n+'(30)');const v=E();close();return F[n](v)}
throw Error('Unexpected input')};
if(!s)throw Error('Enter an expression');const v=E();if(i<s.length)throw Error('Unexpected input near "'+s.slice(i,i+3)+'"');if(!isFinite(v))throw Error('Result is not a finite number');return +v.toPrecision(12)}

const ex=$('#ex');if(ex){const go=()=>{try{$('#cr').textContent='= '+calc(ex.value,$('#ang').value=='deg');$('#ce').textContent=''}catch(e){$('#cr').textContent='';$('#ce').textContent=e.message}};
$$('.keys button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(k=='=')go();else if(k=='C'){ex.value='';$('#cr').textContent='';$('#ce').textContent=''}else if(k=='B')ex.value=ex.value.slice(0,-1);else ex.value+=k;ex.focus()});
ex.onkeydown=e=>{if(e.key=='Enter')go()}}

const UN={Length:{m:1,km:1000,cm:.01,mm:.001,mile:1609.344,ft:.3048,inch:.0254},Mass:{kg:1,g:.001,mg:1e-6,lb:.45359237,tonne:1000},Time:{s:1,min:60,h:3600,day:86400},Speed:{'m/s':1,'km/h':1/3.6,mph:.44704},Area:{'m²':1,'cm²':1e-4,'km²':1e6,hectare:1e4,acre:4046.8564224},Temperature:{'°C':0,'°F':0,K:0}};
const uc=$('#uc');if(uc){const conv=()=>{const v=parseFloat($('#uv').value),a=$('#uf').value,b=$('#ut').value,o=$('#ur');if(isNaN(v)){o.textContent='Enter a number.';return}let r;
if(uc.value=='Temperature'){const c=a=='°F'?(v-32)*5/9:a=='K'?v-273.15:v;if(c<-273.15){o.textContent='Below absolute zero is not possible.';return}r=b=='°F'?c*9/5+32:b=='K'?c+273.15:c}else r=v*UN[uc.value][a]/UN[uc.value][b];
o.textContent=v+' '+a+' = '+(+r.toPrecision(10))+' '+b};
const fill=()=>{$('#uf').innerHTML=$('#ut').innerHTML=Object.keys(UN[uc.value]).map(x=>`<option>${x}</option>`).join('');$('#ut').selectedIndex=1;conv()};
uc.innerHTML=Object.keys(UN).map(x=>`<option>${x}</option>`).join('');uc.onchange=fill;['uv','uf','ut'].forEach(id=>$('#'+id).addEventListener('input',conv));fill()}

const tm=$('#tm');if(tm){let F=25,B=5,ph='Focus',left=1500,end=0,iv=null;
const cnt=()=>DB.get('focus',{})[today()]||0;
const show=()=>{const s=Math.max(0,Math.ceil(left));tm.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');$('#ph').textContent=ph+(iv?' (running)':'');$('#fc').textContent=cnt()};
const stop=()=>{clearInterval(iv);iv=null};
const beep=()=>{try{const c=new AudioContext(),o=c.createOscillator();o.connect(c.destination);o.frequency.value=880;o.start();o.stop(c.currentTime+.6)}catch(e){}if(navigator.vibrate)navigator.vibrate([300,100,300])};
const tick=()=>{left=(end-Date.now())/1000;if(left<=0){stop();beep();if(ph=='Focus'){const f=DB.get('focus',{});f[today()]=cnt()+1;DB.set('focus',f);const mm=DB.get('focusMin',{});mm[today()]=(+mm[today()]||0)+F;DB.set('focusMin',mm)}$('#tmsg').textContent=ph+' finished! Press Start for the next phase.';ph=ph=='Focus'?'Break':'Focus';left=(ph=='Focus'?F:B)*60}show()};
$('#ts').onclick=()=>{if(iv)return;end=Date.now()+left*1000;$('#tmsg').textContent='';iv=setInterval(tick,250);show()};
$('#tp').onclick=()=>{if(iv){tick();stop();show()}};
$('#tr').onclick=()=>{stop();ph='Focus';left=F*60;$('#tmsg').textContent='';show()};
$$('[data-f]').forEach(b=>b.onclick=()=>{F=+b.dataset.f;B=+b.dataset.b;$('#tr').click()});
$('#tc').onclick=()=>{const f=parseInt($('#cf').value),b=parseInt($('#cb').value);if(!(f>=1&&f<=180&&b>=1&&b<=60)){$('#tmsg').textContent='Enter focus 1–180 and break 1–60 minutes.';return}F=f;B=b;$('#tr').click()};
show()}

const sw=$('#sw');if(sw){let t0=0,acc=0,iv=null,laps=[];
const fmt=ms=>[Math.floor(ms/60000),Math.floor(ms/1000)%60].map(x=>String(x).padStart(2,'0')).join(':')+'.'+String(Math.floor(ms/10)%100).padStart(2,'0');
const el=()=>acc+(iv?Date.now()-t0:0),up=()=>sw.textContent=fmt(el());
$('#ws').onclick=()=>{if(iv){acc=el();clearInterval(iv);iv=null;$('#ws').textContent='Start';up()}else{t0=Date.now();iv=setInterval(up,50);$('#ws').textContent='Stop'}};
$('#wl').onclick=()=>{if(el()>0){laps.push(fmt(el()));$('#laps').innerHTML=laps.map((l,i)=>`<li>Lap ${i+1}: ${l}</li>`).join('')}};
$('#wr').onclick=()=>{clearInterval(iv);iv=null;acc=0;laps=[];$('#laps').innerHTML='';$('#ws').textContent='Start';up()}}
})();
