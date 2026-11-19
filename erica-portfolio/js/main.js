(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

/* scroll spy: one long page, the nav follows the section in view */
var SECS=['home','skills','projects','case-study','case-study-tugma','contact'];
function spy(){
  var cur=SECS[0];
  SECS.forEach(function(id){var el=document.getElementById(id);if(el.getBoundingClientRect().top<innerHeight*0.45)cur=id});
  if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)cur='contact';
  var key=cur.indexOf('case-study')===0?'projects':cur;
  $$('.nav a').forEach(function(a){if(a.dataset.nav===key)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
}
/* toast + copy */
var tt;function toast(m){var t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(tt);tt=setTimeout(function(){t.hidden=true},2200)}
function copyText(s){
  if(navigator.clipboard&&navigator.clipboard.writeText){return navigator.clipboard.writeText(s).then(function(){return true},function(){return false})}
  return Promise.resolve(false);
}
document.addEventListener('click',function(e){
  var c=e.target.closest('[data-copy]');
  if(c){copyText(c.dataset.copy).then(function(ok){toast(ok?'Email copied':'Email: '+c.dataset.copy)})}
});

/* greeting */
var greets=['Hello!','Kumusta!','Hola!','Bonjour!','Konnichiwa!'],gi=0;
$('#hello').addEventListener('click',function(){gi=(gi+1)%greets.length;this.textContent=greets[gi]});

/* envelope */
var env=$('#env'),hit=$('#envhit');
hit.addEventListener('click',function(){
  var closed=env.classList.toggle('closed');
  hit.setAttribute('aria-pressed',closed?'false':'true');
  $('#tip').hidden=true;
  $('#envhint').textContent=closed?'tap the envelope to open it again':'tap a skill, drag the stickers, tap the envelope to close it';
});
(function(){
  var pts=[],n=14;
  for(var i=0;i<n*2;i++){var r=i%2?38:49,a=Math.PI*i/n-Math.PI/2;pts.push((50+r*Math.cos(a)).toFixed(1)+','+(50+r*Math.sin(a)).toFixed(1))}
  $('#burst').setAttribute('points',pts.join(' '));
})();
var TIPS={py:'Python: the language I use most for data science and research projects.',cp:'C++: part of my programming foundation as a Computer Science student.',co:'Google Colab: where I run and share data science notebooks in the cloud.',jp:'Jupyter Notebook: where I explore data and document my analysis step by step.'};
var tip=$('#tip');
$$('.sk').forEach(function(b){b.addEventListener('click',function(){
  var k=b.dataset.sk,same=b.classList.contains('sel');
  $$('.sk').forEach(function(x){x.classList.remove('sel')});
  if(same){tip.hidden=true;return}
  b.classList.add('sel');tip.textContent=TIPS[k];tip.hidden=false;
  var pr=$('#paper').getBoundingClientRect(),br=b.getBoundingClientRect();
  var cx=br.left+br.width/2-pr.left;
  tip.style.left=Math.max(tip.offsetWidth/2+6,Math.min(pr.width-tip.offsetWidth/2-6,cx))+'px';
  tip.style.bottom=(pr.height-(br.top-pr.top)+10)+'px';
})});
/* drag stickers */
$$('[data-stk]').forEach(function(el){
  var sx,sy,ox,oy,id=null,paper=$('#paper');
  el.addEventListener('pointerdown',function(e){
    id=e.pointerId;el.setPointerCapture(id);el.classList.add('drag');
    sx=e.clientX;sy=e.clientY;ox=el.offsetLeft;oy=el.offsetTop;e.preventDefault();
  });
  el.addEventListener('pointermove',function(e){
    if(id===null)return;
    var nx=ox+e.clientX-sx,ny=oy+e.clientY-sy,pw=paper.clientWidth,ph=paper.clientHeight;
    nx=Math.max(0,Math.min(pw-el.offsetWidth,nx));ny=Math.max(0,Math.min(ph-el.offsetHeight,ny));
    el.style.left=(nx/pw*100)+'%';el.style.top=(ny/ph*100)+'%';
  });
  var end=function(){id=null;el.classList.remove('drag')};
  el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
});

/* case study: personas */
var P=[
 {n:'Nilou',photo:'persona',meta:'Age 23 · College · Olongapo City · Student',q:'“Deadline is coming, I badly need to get this done!”',ps:'Nilou is a graduating student who needs to have her thesis consulted with her thesis adviser, because her final defense is coming up next week and she needs guidance.',goal:'Have her project consulted with her respective instructor.',fr:'Uncertain whether the instructor is available or not, leading to wasted time waiting.',story:'With her final defense approaching next week, Nilou is under immense pressure to finalize her thesis manuscript and urgently needs guidance from her adviser. However, due to her hectic schedule and the uncertainty of faculty availability on campus, she often spends hours waiting outside the faculty room, resulting in wasted time and mounting anxiety as the deadline draws closer.'},
 {n:'Albedo Santos',photo:'persona2',meta:'Age 43 · College · Bataan · Full-time college instructor',q:'“I want to help every student, but walk-ins keep breaking up my day.”',ps:'Albedo is a full-time college instructor who needs to meet his students’ expectations in providing support and guidance to the course.',goal:'Give students prompt support without disrupting his daily workflow.',fr:'Ad-hoc, walk-in consultations disrupt his work, and he struggles to track requests or tell students about sudden schedule changes.',story:'As a full-time college instructor handling multiple classes and administrative tasks, Sir Albedo strives to provide prompt academic support and mentorship to his students. However, managing ad-hoc, walk-in consultations disrupts his daily workflow, and he often struggles to track appointment requests or inform students of sudden schedule changes, leading to disorganized consultation hours.'}
];
function showP(i,P,sel,key){
  var p=P[i],ph=p.photo?'<img src="'+shot(p.photo)+'" alt="Portrait for the persona '+p.n+'">':'';
  $(sel).innerHTML='<div class="ph">'+ph+'<div><div class="psn">'+p.n+'</div><div style="color:var(--mute);font-size:14px">'+p.meta+'</div><div class="q">'+p.q+'</div></div></div><p style="margin:0 0 8px"><b>Problem statement:</b> '+p.ps+'</p><div class="gf"><div><h4>Goal</h4><p>'+p.goal+'</p></div><div><h4>Frustration</h4><p>'+p.fr+'</p></div></div><p style="margin:14px 0 0;color:var(--mute)">'+p.story+'</p>';
  $$('[data-psn]').forEach(function(b){if((b.dataset.for||'ask')===key)b.setAttribute('aria-selected',b.dataset.psn==i?'true':'false')});
}
var P2=[
 {n:'Maribel Santos',photo:'persona_tg_staff',meta:'Age 49 · Barangay Sta. Rita · Front desk staff',q:'“I remember a wallet came in, but which page of the logbook was it?”',ps:'Maribel records lost and found reports in the barangay hall and is expected to reunite items with their owners, but matching depends on her memory and on flipping through the logbook.',goal:'Find the right owner quickly and be sure the match is correct before calling.',fr:'Reports are spread across a logbook and chat messages, and matching by eye takes a day or more.',story:'Between certificates, complaints and walk-ins, Maribel writes each lost or found item in the logbook. When a resident asks about a missing item, she reads back through earlier pages and guesses which report might fit. Some matches are found late, and some are never found.'},
 {n:'Rosalie Dela Cruz',photo:'persona_tg_resident',meta:'Age 42 · Resident of Sta. Rita · Market vendor',q:'“I only need to know if someone already found it.”',ps:'Rosalie lost a bag with her ID and wants a simple way to tell the barangay what she lost and to hear back without making repeated trips.',goal:'Report the item in a few minutes and be contacted when there is a likely match.',fr:'She does not know whether her report was seen, and she cannot easily check whether someone turned the item in.',story:'After losing her bag at the market, Rosalie goes to the barangay hall to ask. She describes the item in her own words, leaves her number and goes back to work. Days later she still does not know whether anyone has matched it.'}
];
function pClick(sel,arr,key){$$('[data-psn]').forEach(function(b){if((b.dataset.for||'ask')===key)b.addEventListener('click',function(){showP(+b.dataset.psn,arr,sel,key)})})}
pClick('#psn',P,'ask');pClick('#tg-psn',P2,'tugma');showP(0,P,'#psn','ask');showP(0,P2,'#tg-psn','tugma');

/* journey maps */
var J=[
 {t:'Nilou, a student who needs a consultation',g:'Goal: get her thesis consulted before the final defense',s:[
  {a:'Find an instructor and open hours',f:'Confused',v:2,o:'Show the fixed schedule and today’s live status side by side.'},
  {a:'Request a slot with a purpose',f:'Nervous',v:2.5,o:'Show seats left and ask for a short purpose.'},
  {a:'Wait for approval',f:'Anxious',v:2,o:'Notify on every decision. Expire stale requests so seats free up.'},
  {a:'Attend the consultation',f:'Reassured',v:4,o:'Remind before the slot. Show if the instructor is running late.'},
  {a:'Rate the consultation',f:'Heard',v:4.5,o:'A familiar paper-style form. Names are never shown to instructors.'}]},
 {t:'Albedo, an instructor who runs consultations',g:'Goal: help students without losing track of who came',s:[
  {a:'Set weekly hours',f:'Organized',v:4,o:'Choose own slot length and seats per slot.'},
  {a:'Review requests',f:'Pressed',v:2.5,o:'Pending list shows seats held and the purpose up front.'},
  {a:'Approve or decline',f:'In control',v:4,o:'Approve up to the seats. The rest are declined automatically.'},
  {a:'Hold the consultation',f:'Focused',v:4,o:'Status shows busy, then returns to available.'},
  {a:'Record the outcome',f:'Relieved',v:3.5,o:'One short form: held or no-show, resolved, follow-up. No-shows free the slot.'},
  {a:'See ratings and remarks',f:'Curious',v:3.5,o:'Scores per criterion. Comments appear only after enough responses.'}]}
];
function showJ(i,J,sel,key){
  var j=J[i],n=j.s.length,W=760,H=120,pad=60,dx=(W-pad*2)/(n-1);
  var xs=j.s.map(function(_,k){return (k+.5)*W/n}),ys=j.s.map(function(s){return 14+(5-s.v)/4*(H-30)});
  var path=xs.map(function(x,k){return (k?'L':'M')+x+' '+ys[k]}).join(' ');
  var svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Emotion curve across the journey"><rect x="0" y="0" width="'+W+'" height="'+H+'" rx="10" fill="#fff6e4"/><line x1="'+pad/2+'" x2="'+(W-pad/2)+'" y1="'+(H/2)+'" y2="'+(H/2)+'" stroke="#eadfbd" stroke-dasharray="4 5"/><text x="8" y="16" font-size="11" fill="#6d6a58">positive</text><text x="8" y="'+(H-6)+'" font-size="11" fill="#6d6a58">negative</text><path d="'+path+'" fill="none" stroke="#ee86b0" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>'+
   xs.map(function(x,k){return '<circle cx="'+x+'" cy="'+ys[k]+'" r="7" fill="#fff" stroke="#8e2f63" stroke-width="3"/>'}).join('')+'</svg>';
  var cols='<div class="steps" style="grid-template-columns:repeat('+n+',minmax(0,1fr))">'+j.s.map(function(s,k){return '<div class="step"><b>'+(k+1)+'. '+s.a+'</b><span class="feel">'+s.f+'</span><div class="opp">'+s.o+'</div></div>'}).join('')+'</div>';
  $(sel).innerHTML='<p style="margin:0 0 4px"><b>'+j.t+'</b><br><span style="color:var(--mute)">'+j.g+'</span></p>'+svg+cols;
  $$('[data-jm]').forEach(function(b){if((b.dataset.for||'ask')===key)b.setAttribute('aria-selected',b.dataset.jm==i?'true':'false')});
}
var J2=[
 {t:'Rosalie, a resident who lost a bag',g:'Goal: report it once and hear back when there is a likely match',s:[
  {a:'Go to the barangay or open the form',f:'Worried',v:2,o:'A short form for lost and found, usable on a phone.'},
  {a:'Describe the item',f:'Unsure',v:2.5,o:'Pick a category, then describe it in her own words, in English or Filipino.'},
  {a:'Wait for news',f:'Anxious',v:2,o:'Every report is compared with the others right away, so she does not wait for a manual check.'},
  {a:'Get contacted by staff',f:'Hopeful',v:4,o:'Staff call only after they have checked a likely match.'},
  {a:'Claim the item',f:'Relieved',v:4.5,o:'The report is marked as claimed, so it leaves the open list.'}]},
 {t:'Maribel, a staff member who matches reports',g:'Goal: find the right owner without searching the logbook',s:[
  {a:'Record a new report',f:'Busy',v:3,o:'One form and one list for lost and found reports.'},
  {a:'Open the possible matches',f:'Curious',v:3.5,o:'A ranked shortlist with High, Medium and Low tiers.'},
  {a:'Check the details',f:'Careful',v:3.5,o:'Scores are split into five parts, so she can see why a pair was suggested.'},
  {a:'Confirm the match',f:'In control',v:4.5,o:'She makes the final decision. The system only suggests.'},
  {a:'Contact the owner',f:'Relieved',v:4,o:'Contact details are shown only to signed-in staff.'}]}
];
$$('[data-jm]').forEach(function(b){var k=b.dataset.for||'ask';b.addEventListener('click',function(){if(k==='tugma')showJ(+b.dataset.jm,J2,'#tg-jm','tugma');else showJ(+b.dataset.jm,J,'#jm','ask')})});showJ(0,J,'#jm','ask');showJ(0,J2,'#tg-jm','tugma');

/* lightbox */
var lb=$('#lb');
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-lb]');
  if(b){var im=b.querySelector('img');$('#lbimg').src=im.src;$('#lbimg').alt=im.alt;lb.hidden=false;$('#lbx').focus()}
  else if(e.target===lb||e.target.id==='lbx'){lb.hidden=true}
});
document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.hidden=true});

/* progress + toc */
function onScroll(){
  var h=document.documentElement.scrollHeight-innerHeight;
  $('#prog').style.width=(h>0?Math.min(100,scrollY/h*100):0)+'%';
  $$('.cs-view').forEach(function(v){
    var r=v.getBoundingClientRect(),cur=null;
    if(r.top<innerHeight&&r.bottom>0){$$('.sec',v).forEach(function(x){if(x.getBoundingClientRect().top<140)cur=x.id})}
    $$('.toc a',v).forEach(function(a){a.classList.toggle('on',a.dataset.t===cur)});
  });
  spy();
}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);
$$('.toc a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var t=document.getElementById(a.dataset.t);if(t)t.scrollIntoView({behavior:'smooth',block:'start'})})});

/* design thinking */
var D=[
 {t:'Empathize',did:['Surveyed and interviewed faculty members and students of the college.','Turned our assumption into a confirmed hypothesis with the data we gathered.','Presented our design at the final defense and collected the panel’s written critiques.'],found:['Nobody can tell if “available” means available right now.','Part-time instructors can’t update a calendar every day.','Nothing records whether a consultation actually happened.']},
 {t:'Define',did:['Grouped the research and comments into four pain points.','Wrote a problem statement for each user, starting with Nilou.','Turned the gaps into “How might we” questions.'],found:['How might we show real availability without extra work for part-time instructors?','How might we close every consultation, even when nobody shows up?','How might we give the department fair evidence of how consultations go?','How might we reflect who actually holds authority in the department?']},
 {t:'Ideate',did:['Compared two options for each open question and picked one.'],dec:[
   ['Who sits at the top of the system?','A separate admin account','The department dean, with the admin tools merged in','b'],
   ['Who sets slot length and seats?','The department dean, as a department default','Each instructor, with the department dean setting only limits','b'],
   ['How does a no-show end?','Mark it “Completed”','Close it as “Student no-show”, with the outcome recorded','b'],
   ['Who sees a rating first?','The department dean directly','The program chair, who escalates upward','b'],
   ['How do chairs and the department dean teach too?','Two separate accounts','One account with an instructor view and a manager view','b']]},
 {t:'Prototype',did:['Designed FACS, a clickable first prototype of the student and instructor flows.','Modeled the data: students and instructors are many-to-many through Request.','Drew the use case, class, sequence and state diagrams to check the logic.'],found:['A prototype made the panel’s questions concrete, because they could review the exact flow they were asking about.','Writing the state diagram exposed the missing “closed” step for no-shows.']},
 {t:'Test',did:['Round 1: the final defense panel returned 13 critiques, and we answered each one in the system.','We refined the design into the deployed Askademic.','Round 2: the faculty representative sent follow-up comments on tracking, no-shows, records and polish.'],found:['Round 1 was mostly about roles and records. Round 2 is about daily use: tracking, clear no-shows and how history is kept.','Next: let students contest a no-show, and flag appointments that never got an outcome.']}
];
function showD(i,D,panel,key){
  var d=D[i],h='';
  if(d.dec){h+='<h3>What we did</h3><p>'+d.did[0]+'</p><div class="dec">'+d.dec.map(function(x){return '<div class="d"><div class="q">'+x[0]+'</div><div'+(x[3]==='a'?' class="win"':'')+'>'+x[1]+'</div><div'+(x[3]==='b'?' class="win"':'')+'>'+x[2]+'</div></div>'}).join('')+'</div><p style="font-size:13px;color:var(--mute);margin-top:8px">Green marks the option we chose.</p>'}
  else{h+='<div class="cols"><div><h3>What we did</h3><ul class="tight">'+d.did.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div><div><h3>'+(i===1?'How might we':'What we learned')+'</h3><ul class="tight">'+d.found.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div></div>'}
  $(panel).innerHTML=h;
  $$('[data-dt][data-for="'+key+'"],[data-dt]:not([data-for])').filter(function(b){return (b.dataset.for||'ask')===key}).forEach(function(b){b.setAttribute('aria-selected',b.dataset.dt==i?'true':'false')});
}



var D2=[
 {t:'Research',did:['Surveyed 10 barangay staff and 30 residents about how reports are recorded and matched.','Checked our assumption that matching was slow against what staff actually said.','Looked at how the barangay logs a report today, mostly in a logbook.'],found:['Nine of 10 staff use a logbook.','Six of 10 say finding a match takes a day or more.','All 10 find it hard to tell from words alone whether two reports are the same item.']},
 {t:'Define',did:['Grouped the survey answers into four pain points.','Wrote the goal: one list of reports and a ranked shortlist of matches.','Turned the gaps into “How might we” questions.'],found:['How might we compare two descriptions even when the words differ?','How might we handle English and Filipino in the same report?','How might we show staff why a match was suggested?','How might we keep names and numbers away from everyone but staff?']},
 {t:'Design',did:['Compared two options for each open question and picked one.'],dec:[
   ['How are descriptions compared?','Exact text, as one string','Word by word, with typo tolerance','b'],
   ['What about Filipino and English?','Ask for one language only','A synonym list that links both','b'],
   ['What do staff see for each pair?','A yes or no','A 0 to 100 score in High, Medium and Low tiers','b'],
   ['Machine learning or rules?','A trained AI model','Rules staff can read and check','b'],
   ['Who sees names and numbers?','Anyone who can open the page','Only signed-in staff, through the server','b']]},
 {t:'Build',did:['Wrote the report form and staff screens in plain HTML, CSS and vanilla JavaScript.','Built a small Node.js server on Vercel that does the matching and talks to the database.','Stored reports in Supabase, with staff sign in.'],found:['Keeping the database key on the server meant the browser never holds it.','Putting the scoring in one file made V1 and V2 easy to switch and compare.']},
 {t:'Evaluate',did:['Wrote 50 lost and 50 found simulated reports, with 35 true pairs.','Tuned on 40 reports and tested on the other 60, comparing V1 and V2.','Ran a Wilcoxon signed-rank test and a technology acceptance survey.'],found:['V2 raised precision from 51% to 79% and F1 from 66% to 84%.','Recall stayed at 90%, with 2 true pairs missed by both versions.','Against all 50 found reports, V2 still makes wrong suggestions, so staff confirmation stays essential.']}
];
$$('[data-dt]').forEach(function(b){b.addEventListener('click',function(){
  var k=b.dataset.for||'ask';
  if(k==='tugma')showD(+b.dataset.dt,D2,'#tg-dtp','tugma');else showD(+b.dataset.dt,D,'#dtp','ask');
})});
showD(0,D,'#dtp','ask');showD(0,D2,'#tg-dtp','tugma');

/* devices: one 3D scene per case study */
function shot(n){var e=document.querySelector('[data-shot="'+n+'"]');return e?e.src:''}
var SCENES={
  ask:{name:'Askademic',scr:[['f_login_fac','ph_login_stu','Sign in'],['f_dash_fac','ph_welcome','Welcome page'],['f_cal','ph_cal','Calendar']]},
  tugma:{name:'Tugma',scr:[['t_report','tph_report','Report form'],['t_records','tph_records','Records'],['t_matches','tph_matches','Matches'],['t_login','tph_login','Staff sign in']]}
};
function initScene(root,key){
  var cfg=SCENES[key],A=$('.sa',root),B=$('.sb',root),ph=$('.pa',root),st=$('.stage3d',root),flip=false;
  var tabs=$$('[data-scr]').filter(function(t){return (t.dataset.for||'ask')===key});
  function setScr(i){
    var s=cfg.scr[i],cur=flip?B:A,old=flip?A:B;
    cur.src=shot(s[0]);cur.alt=cfg.name+' '+s[2]+' on a laptop';
    cur.classList.remove('off');old.classList.add('off');
    ph.src=shot(s[1]);ph.alt=cfg.name+' '+s[2]+' on a phone';
    flip=!flip;
    tabs.forEach(function(t){t.setAttribute('aria-selected',t.dataset.scr==i?'true':'false')});
  }
  tabs.forEach(function(t){t.addEventListener('click',function(){setScr(+t.dataset.scr)})});
  setScr(0);
  function fit(){root.style.setProperty('--sc',Math.min(1,root.clientWidth/880))}
  fit();addEventListener('resize',fit);
  root.addEventListener('pointermove',function(e){
    if(e.pointerType==='touch')return;
    var r=root.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    st.style.setProperty('--ry',(-14+x*24)+'deg');st.style.setProperty('--rx',(5-y*14)+'deg');
  });
  root.addEventListener('pointerleave',function(){st.style.removeProperty('--ry');st.style.removeProperty('--rx')});
}
$$('.scene').forEach(function(r){initScene(r,r.dataset.scene||'ask')});
onScroll();
})();
