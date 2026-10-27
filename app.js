const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const PH=['Foundation','Structure','Masonry','Finishing'];
const iso=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const TODAY=iso(0),KEY='siteledger';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const gap=d=>Math.round((new Date(d)-new Date(TODAY))/864e5);
const seed=()=>({
 tasks:[
  {id:1,name:'Excavation and footing',phase:'Foundation',who:'Ravi',due:iso(-30),status:'done'},
  {id:2,name:'Plinth beam casting',phase:'Foundation',who:'Ravi',due:iso(-12),status:'done'},
  {id:3,name:'Column reinforcement',phase:'Structure',who:'Meena',due:iso(-3),status:'progress'},
  {id:4,name:'First-floor slab',phase:'Structure',who:'Meena',due:iso(2),status:'progress'},
  {id:5,name:'Brick walls, ground floor',phase:'Masonry',who:'Kiran',due:iso(14),status:'pending'},
  {id:6,name:'Plastering and painting',phase:'Finishing',who:'Asha',due:iso(40),status:'pending'}],
 mats:[
  {id:1,name:'Cement',qty:120,unit:'bags',min:50},{id:2,name:'Steel bars',qty:2.5,unit:'tonnes',min:3},
  {id:3,name:'Bricks',qty:8000,unit:'pcs',min:2000},{id:4,name:'Sand',qty:18,unit:'tonnes',min:10}],
 crew:[{id:1,name:'Ramesh',role:'Mason'},{id:2,name:'Sunil',role:'Bar bender'},{id:3,name:'Lakshmi',role:'Helper'},{id:4,name:'Imran',role:'Carpenter'}],
 att:{[iso(-1)]:[1,2,3],[iso(-2)]:[1,2,3,4]},
 budget:[{cat:'Foundation',plan:40,actual:42},{cat:'Structure',plan:85,actual:80},{cat:'Masonry',plan:30,actual:28},{cat:'Finishing',plan:45,actual:20}],
 warn:3,dark:false,role:'manager'});
let ed=null,sort={k:'due',d:1},S=JSON.parse(localStorage.getItem(KEY)||'null')||seed(),charts=[];
const save=()=>{localStorage.setItem(KEY,JSON.stringify(S));render()};
const nid=a=>Math.max(0,...a.map(x=>x.id))+1;
const pct=t=>t.status=='done'?1:t.status=='progress'?.5:0;
const phasePct=p=>{const t=S.tasks.filter(x=>x.phase==p);return t.length?Math.round(100*t.reduce((a,x)=>a+pct(x),0)/t.length):0};
const overall=()=>S.tasks.length?Math.round(100*S.tasks.reduce((a,x)=>a+pct(x),0)/S.tasks.length):0;
const sum=k=>S.budget.reduce((a,b)=>a+b[k],0);
const alerts=()=>{const a=[];
 S.tasks.filter(t=>t.status!='done').forEach(t=>{const g=gap(t.due);
  if(g<0)a.push({c:'',m:`Delayed: "${esc(t.name)}" is ${-g} day(s) overdue`});
  else if(g<=S.warn)a.push({c:'a',m:`Due soon: "${esc(t.name)}" in ${g} day(s)`})});
 S.mats.filter(m=>m.qty<=m.min).forEach(m=>a.push({c:'',m:`Low stock: ${esc(m.name)} is ${m.qty} ${esc(m.unit)} (level ${m.min})`}));
 S.budget.filter(b=>b.actual>b.plan).forEach(b=>a.push({c:'a',m:`Over budget: ${esc(b.cat)} by ₹${(b.actual-b.plan).toFixed(1)} lakh`}));
 return a};
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200)};
const tag=(c,t)=>`<span class="tag ${c}">${t}</span>`;
const ST={pending:'Pending',progress:'In progress',done:'Done'};
function render(){
 document.body.dataset.role=S.role;$('#role').value=S.role;
 document.documentElement.dataset.theme=S.dark?'dark':'';$('#theme').textContent=S.dark?'Light mode':'Dark mode';
 const nx=S.tasks.filter(t=>t.status!='done').sort((a,b)=>a.due<b.due?-1:1)[0],al=alerts(),done=S.tasks.filter(t=>t.status=='done').length;
 $('#nb').textContent=al.length||'';
 $('#dash').innerHTML=`<div class="hero"><div class="ring" style="--p:${overall()}"><b>${overall()}%</b></div><div><h2>Project progress</h2><p class="note">${nx?`Next deadline: ${esc(nx.name)} on ${nx.due}`:'All tasks are complete.'}</p></div></div><div class="cards">
  <div class="card ok"><b>${(S.att[TODAY]||[]).length}/${S.crew.length}</b><span>Workers present today</span></div>
  <div class="card"><b>${done}/${S.tasks.length}</b><span>Tasks done</span></div>
  <div class="card ${al.length?'warn':'ok'}"><b>${al.length}</b><span>Active alerts</span></div>
  <div class="card"><b>₹${sum('actual').toFixed(0)}L</b><span>Spent of ₹${sum('plan').toFixed(0)}L budget</span></div></div>
  <h2>Phase progress</h2>${PH.map(p=>`<div class="ph"><span>${p}</span><div class="bar"><i style="width:${phasePct(p)}%"></i></div><b>${phasePct(p)}%</b></div>`).join('')}
  <h2>Alerts</h2>${al.map(a=>`<div class="al ${a.c}">${a.m}</div>`).join('')||'<p class="note">Nothing needs attention.</p>'}`;
 $('#fTask [name=phase]').innerHTML=PH.map(p=>`<option>${p}</option>`).join('');
 const q=$('#q').value.toLowerCase(),fp=$('#fPh').value,fs=$('#fSt').value;
 const rows=S.tasks.filter(t=>(!fp||t.phase==fp)&&(!fs||t.status==fs)&&(t.name+t.who).toLowerCase().includes(q)).sort((a,b)=>(a[sort.k]>b[sort.k]?1:-1)*sort.d);
 const th=(k,l)=>`<th aria-sort="${sort.k==k?(sort.d>0?'ascending':'descending'):'none'}"><button class="th" data-sort="${k}">${l}${sort.k==k?(sort.d>0?' ▲':' ▼'):''}</button>`;
 $('#tTask').innerHTML=rows.length?`<table><tr>${th('name','Task')}${th('phase','Phase')}${th('who','Assigned')}${th('due','Due')}${th('status','Status')}<th></tr>${rows.map(t=>`<tr><td>${esc(t.name)}<td>${t.phase}<td>${esc(t.who)}<td>${t.due}
  <td><select class="st-${t.status}" data-st="${t.id}">${Object.entries(ST).map(([k,v])=>`<option value="${k}"${t.status==k?' selected':''}>${v}</option>`).join('')}</select>
  <td class="eng"><button class="x" data-edit="tasks:${t.id}">Edit</button><button class="x" data-del="tasks:${t.id}">Delete</button></tr>`).join('')}</table>`:'<p class="empty">No tasks match. Clear the filters or add a task above.</p>';
 $('#tMat').innerHTML=`<table><tr><th>Material<th>In stock<th>Low-stock level<th>Status<th></tr>${S.mats.map(m=>`<tr><td>${esc(m.name)}
  <td><input type="number" min="0" step="any" class="mini" value="${m.qty}" data-q="${m.id}"> ${esc(m.unit)}<td>${m.min}
  <td>${m.qty<=m.min?tag('r','Low stock'):tag('g','OK')}<td class="eng"><button class="x" data-edit="mats:${m.id}">Edit</button><button class="x" data-del="mats:${m.id}">Delete</button></tr>`).join('')}</table>`;
 const pres=S.att[TODAY]||[],days=Object.keys(S.att).length;$('#attDate').textContent=TODAY;
 $('#tCrew').innerHTML=`<table><tr><th>Worker<th>Trade<th>Present today<th>Days present<th></tr>${S.crew.map(w=>`<tr><td>${esc(w.name)}<td>${esc(w.role)}
  <td><input type="checkbox" data-at="${w.id}"${pres.includes(w.id)?' checked':''} aria-label="Present"><td>${Object.values(S.att).filter(a=>a.includes(w.id)).length}${days?' of '+days:''}
  <td class="adm"><button class="x" data-del="crew:${w.id}">Remove</button></tr>`).join('')}</table>`;
 $('#tBud').innerHTML=`<table><tr><th>Category<th>Budgeted (₹ lakh)<th>Actual (₹ lakh)<th>Variance<th></tr>${S.budget.map((b,i)=>`<tr><td>${esc(b.cat)}<td>${b.plan}
  <td><input type="number" min="0" step="0.1" class="mini adm-in" value="${b.actual}" data-ba="${i}"><td>${tag(b.actual>b.plan?'r':'g',(b.actual-b.plan>0?'+':'')+(b.actual-b.plan).toFixed(1))}
  <td class="adm"><button class="x" data-del="budget:${i}">Delete</button></tr>`).join('')}
  <tr><th>Total<th>${sum('plan').toFixed(1)}<th>${sum('actual').toFixed(1)}<th>${(sum('actual')-sum('plan')).toFixed(1)}<th></tr></table>`;
 $('#warn').value=S.warn;
 $('#tTime').innerHTML=[...S.tasks].sort((a,b)=>a.due<b.due?-1:1).map(t=>{const g=gap(t.due),d=t.status=='done';
  const c=d?'d':g<0?'r':g<=S.warn?'a':'';
  return `<div class="tl ${c}"><b>${t.due}</b><span>${esc(t.name)} <small class="note">${t.phase}, ${esc(t.who)}</small></span>${d?tag('g','Done'):g<0?tag('r',-g+' days late'):g<=S.warn?tag('a','Due in '+g+' d'):tag('',g+' days left')}</div>`}).join('');
 $$('input:not([type=checkbox]),select').forEach(i=>{if(!i.labels.length&&!i.getAttribute('aria-label'))i.setAttribute('aria-label',i.placeholder||i.name||i.id||'Value')});
 if(!$('#rep').hidden)drawCharts();
}
function drawCharts(){
 if(typeof Chart=='undefined'){$('.charts').innerHTML='<p class="note">Charts need internet once to load Chart.js.</p>';return}
 charts.forEach(c=>c.destroy());
 const ink=getComputedStyle(document.body).color;Chart.defaults.color=ink;
 const mk=(id,cfg)=>charts.push(new Chart($(id),cfg));
 mk('#cBud',{type:'bar',data:{labels:S.budget.map(b=>b.cat),datasets:[{label:'Budgeted',data:S.budget.map(b=>b.plan),backgroundColor:'#2f5d7c'},{label:'Actual',data:S.budget.map(b=>b.actual),backgroundColor:'#e8a400'}]},options:{plugins:{title:{display:true,text:'Budget vs actual (₹ lakh)'}}}});
 mk('#cTask',{type:'doughnut',data:{labels:Object.values(ST),datasets:[{data:Object.keys(ST).map(k=>S.tasks.filter(t=>t.status==k).length),backgroundColor:['#9aa7ad','#e8a400','#2e7d4f']}]},options:{plugins:{title:{display:true,text:'Task status'}}}});
 mk('#cPhase',{type:'bar',data:{labels:PH,datasets:[{label:'% complete',data:PH.map(phasePct),backgroundColor:'#2e7d4f'}]},options:{scales:{y:{max:100,beginAtZero:true}},plugins:{title:{display:true,text:'Phase-wise completion (%)'}}}});
}
function dl(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click()}
const form=(id,fn)=>$(id).addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));for(const k in d)d[k]=d[k].trim();const r=fn(d);if(r.err)return toast(r.err);e.target.reset();ed=null;e.target.querySelector('button').textContent=e.target.dataset.btn;save();toast(r)});
const dup=(a,k,v,id)=>a.some(x=>x.id!=id&&String(x[k]).toLowerCase()==v.toLowerCase());
const eid=k=>ed&&ed.k==k?ed.id:-1;
form('#fTask',d=>{if(!d.name||!d.who)return{err:'Enter a task name and who it is assigned to.'};
 if(eid('tasks')>0){Object.assign(S.tasks.find(x=>x.id==ed.id),d);return'Task updated'}
 S.tasks.push({id:nid(S.tasks),...d,status:'pending'});return'Task added'});
form('#fMat',d=>{if(dup(S.mats,'name',d.name,eid('mats')))return{err:d.name+' is already in the inventory.'};
 const o={name:d.name,unit:d.unit,qty:+d.qty,min:+d.min};
 if(eid('mats')>0){Object.assign(S.mats.find(x=>x.id==ed.id),o);return'Material updated'}
 S.mats.push({id:nid(S.mats),...o});return'Material added'});
form('#fCrew',d=>{if(dup(S.crew,'name',d.name,-1))return{err:d.name+' is already on the list.'};S.crew.push({id:nid(S.crew),...d});return'Worker added'});
form('#fBud',d=>{if(dup(S.budget,'cat',d.cat,-1))return{err:d.cat+' already has a budget line.'};S.budget.push({cat:d.cat,plan:+d.plan,actual:+d.actual});return'Category added'});
document.addEventListener('change',e=>{const t=e.target,d=t.dataset;
 if(d.st){S.tasks.find(x=>x.id==d.st).status=t.value;save();toast('Status updated')}
 if(d.q){S.mats.find(x=>x.id==d.q).qty=+t.value;save()}
 if(d.ba){S.budget[d.ba].actual=+t.value;save()}
 if(d.at){const a=S.att[TODAY]=S.att[TODAY]||[],i=+d.at;t.checked?a.includes(i)||a.push(i):a.splice(a.indexOf(i),1);save()}
 if(['fPh','fSt'].includes(t.id))render();
 if(t.id=='warn'){S.warn=Math.max(0,+t.value||0);save()}
 if(t.id=='role'){S.role=t.value;save()}
 if(t.id=='bImp'&&t.files[0])t.files[0].text().then(x=>{try{const j=JSON.parse(x);if(!j.tasks||!j.budget)throw 0;S=j;save()}catch{alert('That file is not a valid Site Ledger backup.')}})});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.del){const[k,id]=b.dataset.del.split(':');if(!confirm('Delete this entry?'))return;
  S[k]=k=='budget'?S.budget.filter((_,i)=>i!=id):S[k].filter(x=>x.id!=id);save();toast('Entry deleted')}
 if(b.dataset.edit){const[k,id]=b.dataset.edit.split(':'),f=k=='tasks'?'#fTask':'#fMat';ed={k,id:+id};Object.entries(S[k].find(x=>x.id==id)).forEach(([n,v])=>{const i=$(f+' [name='+n+']');if(i)i.value=v});$(f+' button').textContent='Save changes';$(f+' input').focus()}
 if(b.dataset.sort){sort.d=sort.k==b.dataset.sort?-sort.d:1;sort.k=b.dataset.sort;render()}
 if(b.dataset.tab){$$('main>section').forEach(s=>s.hidden=s.id!=b.dataset.tab);$$('#nav button').forEach(x=>{x.classList.toggle('on',x==b);x.setAttribute('aria-current',x==b)});render()}
 if(b.id=='theme'){S.dark=!S.dark;save()}
 if(b.id=='bJson')dl('site-ledger-backup.json',JSON.stringify(S,null,1),'application/json');
 if(b.id=='bCsv'){const q=v=>'"'+String(v).replace(/"/g,'""')+'"',r=a=>a.map(q).join(',');
  dl('site-ledger-report.csv',['TASKS',r(['Task','Phase','Assigned','Due','Status']),...S.tasks.map(t=>r([t.name,t.phase,t.who,t.due,ST[t.status]])),'',
   'MATERIALS',r(['Material','Qty','Unit','Low level']),...S.mats.map(m=>r([m.name,m.qty,m.unit,m.min])),'',
   'BUDGET (Rs lakh)',r(['Category','Budgeted','Actual']),...S.budget.map(x=>r([x.cat,x.plan,x.actual]))].join('\n'),'text/csv')}
 if(b.id=='bPrint')window.print();
 if(b.id=='bReset'&&confirm('Replace all data with the sample project?')){S=seed();save()}});
document.addEventListener('input',e=>{if(e.target.id=='q')render()});
$$('form').forEach(f=>f.dataset.btn=f.querySelector('button').textContent);
render();
