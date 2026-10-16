'use strict';
// v0.0.2.1: Lumen Gym interior + gym-goers, Ares' room activities, relationship ladder, gifts/training/dates/proposal,
// furniture preferences, £20/day rent popup, Gym shop tab, furniture use.
// ---------- Lumen Gym interior ----------
const GYM_FURN=[
 {k:'gymfloor',x:1,y:8},{k:'gymfloor',x:4,y:8},{k:'gymfloor',x:13,y:8},{k:'gymfloor',x:16,y:8},
 {k:'treadmill',x:2,y:2},{k:'treadmill',x:4,y:2},{k:'treadmill',x:6,y:2},{k:'spinbike',x:9,y:2},{k:'spinbike',x:11,y:2},
 {k:'rowmachine',x:13,y:2},{k:'pullupbar',x:17,y:2},{k:'punchbag',x:20,y:4},{k:'punchbag',x:20,y:7},
 {k:'squatrack',x:2,y:8},{k:'dumbbells',x:6,y:7},{k:'kettlebells',x:8,y:8},{k:'weightbench',x:5,y:11},
 {k:'yogamat',x:14,y:8},{k:'yogamat',x:16,y:8},{k:'proteinshelf',x:19,y:11},{k:'towelrack_gym',x:21,y:12},
 {k:'plant_snake',x:0,y:14},{k:'plant_snake',x:21,y:14},{k:'beanbag_gym',x:18,y:14},
 ...[1,2,3,4,5,6,7].map(x=>({k:'mirrorwall',x,y:0,v:0})),{k:'poster_gym2',x:9,y:0,v:0},{k:'poster_gym3',x:11,y:0,v:0},{k:'poster_gym',x:13,y:0,v:0},{k:'poster_gym2',x:16,y:0,v:0},
 ...[2,3,4,5,6].map(y=>({k:'mirrorwall',x:0,y,v:1})),{k:'poster_gym3',x:0,y:9,v:1}];
const GYM_SPOTS=[['Mika',2.5,3.35],['Bree',4.5,3.35],['Hana',10.05,2.9,12],['Sora',13.95,2.75,3],['Leon',18,2.6,8],['Jett',20.5,5.95],['Big Dano',3.05,9.3],['Tomas',6.4,8.5],['Zuri',9.3,9.2],
 ['Priya',14.5,9.3],['Coach Rin',16.5,9.3],['Gus',19.6,12.9],['Kenji',11.2,13.2],['Old Ben',7.5,13.4]];
function ensureGym(){S.rooms.gym={lay:'gymhall',furn:GYM_FURN.map(f=>({...f}))};}
ensureGym();
window.gymNpcs=()=>GYM_SPOTS.map(([n,x,y,z])=>{const q=npc(n,Math.floor(x),Math.floor(y));if(z)q.look={gym:{...q.look.gym,z}};q.px=x*16;q.py=y*16;q.hx=q.px;q.hy=q.py;q.t=1e9;return q;});
window.enterGym=()=>{ensureGym();showCondo=false;goArea('room:gym');const t=TN.Ares;
 if(t&&t.place=='gym')setTimeout(()=>{if(!dlg.on){aresEmote('heart');startDialogue('Ares',[L('Welcome to Lumen Gym, boss! Fourteen clients today and every single one is crushing it.','smile'),L('Tap any machine to use it. Tap me for a training session!','teasing')]);}},700);
 else toast('Trainer Ares is off shift (works 7:30 AM – 5:30 PM)');};
// ---------- Ares at home: activities by time of day ----------
const GYMACTS=['lift','squat','punch','run','pullup','stretch','row','bike'];
const aresUnit=()=>{const i=S.condo.tenants.indexOf('Ares');return i<0?null:'f'+(i+1);};
let _ra={k:'',v:null};
window.roomAct=function(){const id=aresUnit();if(!id||!area||area.room!=id)return null;const h=hourNow()%24;let mode=h>=23||h<7?'sleep':h<7.6?'cook':h<21.5?'gym':'tv';
 const R=S.rooms[id],key=id+mode+R.furn.length+R.furn.map(f=>f.k+f.x+f.y).join('');if(_ra.k==key)return _ra.v;
 const pick=acts=>R.furn.find(f=>acts.includes(FURN[f.k].act));const want={sleep:['sleep'],cook:['cook'],gym:GYMACTS,tv:['sit']}[mode];let f=pick(want);if(!f&&mode=='gym'){mode='tv';f=pick(['sit']);}if(!f&&mode=='tv')f=pick(['tv']);
 let spot=null;if(f){const [w,d]=fdim(f.k,f.r||0),A=FURN[f.k].act;if(A=='sit'||A=='sleep')spot=[f.x+w/2,f.y+d/2+.25];else{const a=area,c=[[f.x+Math.floor(w/2),f.y+d],[f.x+w,f.y+Math.floor(d/2)],[f.x-1,f.y],[f.x,f.y-1]].find(([x,y])=>x>=0&&y>=0&&x<a.cols&&y<a.rows&&!a.solid[y][x]);if(c)spot=[c[0]+.5,c[1]+.5];}}
 const v={mode,f,spot,sit:mode=='tv'||mode=='sleep',flex:mode=='gym'&&!!f,emote:mode=='cook'?'note':null,zz:mode=='sleep'};_ra={k:key,v};return v;};
const _chibiV21=chibi;chibi=function(c,x,y,o,t,walk){_chibiV21(c,x,y,o,t,walk);if(o&&o.ares&&TN.Ares&&TN.Ares.inRoom&&area&&area.room==aresUnit()){const r=roomAct();if(r&&r.zz){c.save();c.font='bold 7px sans-serif';c.lineWidth=2;c.strokeStyle='#fff';c.fillStyle='#5a6aff';
 for(let i=0;i<3;i++){const k=(t*.6+i/3)%1;c.globalAlpha=1-k;c.strokeText('z',x+10+k*8,y-36-k*14);c.fillText('z',x+10+k*8,y-36-k*14);}c.restore();}}};
// ---------- preferences ----------
const isGym=k=>FURN[k]&&(FURN[k].kit=='gym'||FURN[k].theme=='gym');const isFrilly=k=>FURN[k]&&(FURN[k].frilly||FURN[k].theme=='cute');
function unitCount(n,test){const i=S.condo.tenants.indexOf(n);if(i<0)return 0;return S.rooms['f'+(i+1)].furn.filter(f=>test(f.k)).length;}
const _happyBase=happiness;happiness=function(n){let h=_happyBase(n);const c=CHARS[n];if(c&&c.dislikes&&S.condo.tenants.includes(n))h-=12*unitCount(n,k=>c.dislikes.includes(FURN[k].theme));return Math.max(0,Math.min(100,h));};
window.dailyPrefs=function(){const out=[];if(S.condo.tenants.includes('Ares')){const g=unitCount('Ares',isGym),fr2=unitCount('Ares',isFrilly);
 if(g){const b=Math.min(4,g);gainFr('Ares',b,1);out.push(`🏋 Home gym bonus: ${g} gym item${g>1?'s':''} in Ares' unit → ♥ +${b} relationship, happier tenant`);out.push('Ares: “'+(g>=3?'Morning set done before breakfast. This place is a PALACE, boss!':'Got my reps in at home. More iron wouldn\'t hurt, buddy!')+'”');}
 else out.push('Ares: “No iron in my unit, boss? A squat rack would make my whole week.”');
 if(fr2){fr('Ares').p=Math.max(0,fr('Ares').p-1);out.push(`🎀 Ares dislikes the ${fr2} frilly item${fr2>1?'s':''} in his unit (♥ −1, happiness −${12*fr2}%)`);out.push('Ares: “Boss... the lace. The LACE. I can\'t lift next to doilies.”');}}return out;};
// ---------- rent popup (£20 per tenant per day) ----------
window.rentPopup=function(rent,msg,pref){const tn=S.condo.tenants.map((n,i)=>[n,i]).filter(([n])=>n);
 let h=`<h3>🌅 DAY ${S.day} · RENT DAY</h3><div class="rentbox">`+(tn.length?tn.map(([n,i])=>`<p class="rr"><b>Floor ${i+1} · ${n}</b><span>+${money(rentOf(i))}</span></p>`).join('')+`<p class="rr tot"><b>Total collected</b><span>+${money(rent)}</span></p>`:'<p>No tenants yet — no rent today.</p>')+
 `</div><p>💷 Cash now: <b>${money(S.gold)}</b> · every tenant pays £20 each day</p>`+msg.filter(m=>!/^Rent collected/.test(m)).map(m=>`<p>${m}</p>`).join('')+pref.map(m=>`<p>${m}</p>`).join('')+`<button onclick="closeMenu()">Great!</button>`;setTimeout(()=>{openMenu(h);sfx(1320);},250);};
// ---------- relationship ladder ----------
const REL_LINES={Ares:{
 1:[L('Heh. You keep showing up, boss. Guess that makes us friends now.','smile'),L('Friends get free form checks. Don\'t say I never gave you anything!','teasing')],
 2:[L('You know... I don\'t let many people this close. You\'re a real one, buddy.','serious'),L('Close friends. Officially. I\'ll even let you pick the gym playlist.','blush')],
 3:[L('So... that was a date. A real one. My heart\'s pounding harder than leg day.','blush'),L('We\'re dating now, right? Good. Just checking. Totally calm.','surprised')],
 4:[L('Hey. I\'m all in, okay? You and me. Partners.','serious'),L('I already cleared a shelf for your stuff next to my protein. That\'s love, boss.','blush')],
 5:[L('Married. MARRIED! I\'m gonna shout it off the gym roof!','surprised'),L('...Thanks for choosing me. I\'ll spot you for the rest of our lives.','blush')]},
 _:{1:[L('I think we\'re real friends now!','happy')],2:[L('You\'re one of my closest friends in Lumen Town.','happy')]}};
window.relUnlock=function(n,lv){if(menuOpen()){setTimeout(()=>relUnlock(n,lv),1200);return;}const ls=(REL_LINES[n]||REL_LINES._)[lv];if(!ls)return;const lines=[L(`✨ ${n} — ${REL[lv]} unlocked!`,'surprised'),...ls];if(n=='Ares')aresEmote('heart',6);
 if(dlg.on&&dlg.name==n)dlg.lines.push(...lines);else if(!dlg.on)startDialogue(n,lines);else setTimeout(()=>relUnlock(n,lv),1500);};
const GIFTS=[['shake','🥤 Protein shake',6,3,'A chocolate shake? Bro. BRO. You get me.','smile'],['gloves','🧤 New lifting gloves',18,5,'Fingerless, black, perfect fit. You know my style, boss!','surprised'],
 ['cake','🍰 Chocolate cake',10,2,'Cheat day! ...Don\'t tell my clients.','teasing'],['band','🏋 Resistance bands',14,4,'Ooh, these are the good ones! Arm day tonight!','smile'],['bouquet','🎀 Frilly pink bouquet',12,0,'Uh... it\'s very... lacy. Thanks, I guess? I\'ll put it... somewhere.','sad']];
function aresNear(){return tenantsHere().some(t=>t.n=='Ares')||!!(TN.Ares&&!TN.Ares.inRoom&&TN.Ares.place!='walking');}
window.relMenu=function(n){const c=CHARS[n],f=fr(n),lv=frLv(n),nx=lv<5?REL_P[Math.min(5,lv+1)]:REL_P[5],pct=Math.min(100,Math.round(f.p/REL_P[5]*100));
 let h=`<h3>${n=='Ares'?'💪':'🙂'} ${n.toUpperCase()} · ${REL[lv].toUpperCase()}${f.married?' 💍':''}</h3><div class="relhd"><canvas id="relPc" width="168" height="208"></canvas><div><div class="hrt">${hearts(n)}</div><div class="bar"><i style="width:${pct}%"></i></div><small>${f.p} / ${REL_P[5]} ♥ points · happiness ${happiness(n)}%</small></div></div>`;
 h+='<div class="ladder">'+REL.map((r,i)=>`<span class="${i<=lv?'on':''}">${i<=lv?'♥':'🔒'} ${r}<small>${i==0?'start':i==3?'♥'+REL_P[i]+' + ask out':i==5?'♥'+REL_P[i]+' + proposal':'♥'+REL_P[i]}</small></span>`).join('')+'</div>';
 if(n=='Ares'){const pp=aresPay();h+=`<p><b>Job:</b> Personal trainer at Lumen Gym · £${c.wage.toFixed(2)}/h · ${c.shiftH}h × ${c.nights} days (≈${money(pp.month)}/mo)</p>`+
  `<p><b>♥ Likes:</b> ${c.likes.map(t=>FTHEME[t]).join(', ')} themes · <b>Favourite:</b> ${FURN[c.fav].n}<br><b>♥ Loves:</b> ${c.loves.filter(k=>FURN[k]).map(k=>FURN[k].n).join(', ')}<br><b>✖ Dislikes:</b> Frilly Cute decor (lace, doilies, plushies, ribbons)</p>`+
  `<p>🏋 Gym items in his unit: <b>${unitCount('Ares',isGym)}</b> (daily ♥ bonus) · 🎀 frilly items: <b>${unitCount('Ares',isFrilly)}</b></p>`;
  const near=aresNear(),gymOk=TN.Ares&&(TN.Ares.place=='gym'||TN.Ares.inRoom&&unitCount('Ares',isGym)>0);
  h+=`<button onclick="closeMenu();talkTenant('Ares')">💬 Talk</button><div class="row">`+GIFTS.map(([k,nm,cost])=>`<button ${f.gift==S.day?'disabled':''} onclick="giveGift('${k}')">${nm} · ${money(cost)}</button>`).join('')+'</div>'+
  `<button ${f.train==S.day||!gymOk?'disabled':''} onclick="trainTogether()">🏋 Train together ${gymOk?'· ♥ +4':'(at Lumen Gym, or home with gym gear)'}${f.train==S.day?' · done today':''}</button>`+
  `<button ${f.comp==S.day?'disabled':''} onclick="compliment()">✨ Compliment ${f.comp==S.day?'· done today':'· ♥ +2'}</button>`+
  (lv>=2?`<button ${f.date==S.day||(!f.dated&&f.p<REL_P[3])?'disabled':''} onclick="goDate()">🌹 ${f.dated?'Go on a date · £25 · ♥ +5':'Ask Ares on a date'+(f.p<REL_P[3]?` (needs ♥${REL_P[3]})`:'')}</button>`:`<button disabled>🌹 Date · unlocks at Close friend</button>`)+
  (f.married?`<button disabled>💍 Married to Ares</button>`:lv>=4?`<button ${f.p<REL_P[5]?'disabled':''} onclick="propose()">💍 Propose · ring £300${f.p<REL_P[5]?` (needs max ♥ ${REL_P[5]})`:''}</button>`:`<button disabled>💍 Proposal · unlocks at Partner + max hearts</button>`);if(!near)h+='<p><small>Ares is walking right now — some actions wait until he arrives.</small></p>';}
 else h+=`<p>${c.pers||''}</p><button onclick="closeMenu();talkTenant('${n}')">💬 Talk</button>`;openMenu(h);menuEl.scrollTop=0;const pc=$('relPc');if(pc){const P=portrait(n,'smile'),g=pc.getContext('2d');g.fillStyle='#fff4d0';g.fillRect(0,0,168,208);g.drawImage(P,0,0,P.width,P.width*208/168,0,0,168,208);}};
window.giveGift=k=>{const g=GIFTS.find(q=>q[0]==k),f=fr('Ares');if(f.gift==S.day){toast('One gift per day');return;}if(S.gold<g[2]){toast('Not enough money');return;}S.gold-=g[2];f.gift=S.day;closeMenu();
 aresEmote(g[3]?'heart':'surprise',5);startDialogue('Ares',[L(g[4],g[5])]);if(g[3])gainFr('Ares',g[3]);else toast('Ares didn\'t love that one… (frilly)');save(1);};
window.trainTogether=quiet=>{const f=fr('Ares');if(f.train==S.day){if(!quiet)toast('Already trained together today');return;}const atGym=TN.Ares&&TN.Ares.place=='gym';if(atGym&&!quiet){if(S.gold<5){toast('Not enough money');return;}S.gold-=5;}f.train=S.day;closeMenu();S.min+=60;aresEmote('heart',6);
 startDialogue('Ares',[L(['Alright, partner — squats! Chest up, knees out... GOOD! Look at you go!','Spot me, buddy. ...Okay, that\'s ten. TEN! Teamwork makes the dream work!','Punch combo: jab, jab, cross! Ha! You\'ve got fire, boss!'][S.day%3],'smile'),L(frLv('Ares')>=3?'You know you look really good when you train... I said that out loud, didn\'t I.':'Same time tomorrow? Your trainer insists.',frLv('Ares')>=3?'blush':'teasing')]);gainFr('Ares',4);save(1);};
window.compliment=()=>{const f=fr('Ares');if(f.comp==S.day)return;f.comp=S.day;closeMenu();const lv=frLv('Ares');aresEmote('heart',5);
 startDialogue('Ares',[L('You: “'+['Those red shades really suit you, Ares.','Your clients are lucky to have you.','You\'ve got the best laugh in Lumen Town.','I feel safe when you\'re around.'][(S.day+lv)%4]+'”','surprised'),L(lv>=3?'S-stop it, you\'re gonna make me drop the bar... say it again later?':'Ha! Flattery gets you an extra set, buddy. ...Thanks though.',lv>=3?'blush':'teasing')]);
 gainFr('Ares',2);save(1);};
window.goDate=()=>{const f=fr('Ares');closeMenu();if(!f.dated){if(f.p<REL_P[3])return;startDialogue('Ares',[L('A... date? Like a DATE date? With me?','surprised'),L('...Yes. Obviously yes. Dinner at the restaurant, eight o\'clock. I\'ll wear a shirt. Probably.','blush')]);f.dated=1;f.date=S.day;gainFr('Ares',2,1);aresEmote('heart',8);setTimeout(()=>relUnlock('Ares',3),400);save(1);return;}
 if(f.date==S.day||S.gold<25){toast(S.gold<25?'Not enough money':'One date per day');return;}S.gold-=25;f.date=S.day;S.min+=120;aresEmote('heart',8);
 startDialogue('Ares',[L(['Noodles at the restaurant, then a walk through the park. Best night all week.','A picnic in the park? You even brought protein bars. Marry me. ...Kidding! Unless?','Stargazing on the condo roof. Shh, I\'m being romantic.'][S.day%3],'smile'),L('Same time next week? I\'m already looking forward to it.','blush')]);gainFr('Ares',5);save(1);};
window.propose=()=>{const f=fr('Ares');if(f.married||frLv('Ares')<4||f.p<REL_P[5])return;if(S.gold<300){toast('You need £300 for the ring');return;}S.gold-=300;closeMenu();aresEmote('heart',12);
 startDialogue('Ares',[L('(You kneel down at the gym, right where you first trained together, and open a small box.)','normal'),L('Wait. Boss. Is that... a RING?','surprised'),L('I— I\'m not crying. It\'s sweat. From my eyes.','blush'),L('YES. A thousand times yes! Let\'s get married!','smile')]);f.married=1;f.marriedDay=S.day;setTimeout(()=>relUnlock('Ares',5),400);toast('💍 You and Ares are now MARRIED!');save(1);};
// ---------- furniture use (player + training with Ares) ----------
const _furnUseBase=furnUse;furnUse=function(f){const F=FURN[f.k],A=F.act;if(!A||(area.room=='office'&&F.req=='bed'))return _furnUseBase(f);
 const aresHere=tenantsHere().some(t=>t.n=='Ares'),M={lift:'You pump out a set of curls. 💪',squat:'Deep squats! Your legs are on fire. 💪',punch:'Jab, jab, cross! 🥊',run:'You jog a quick kilometre. 🏃',pullup:'You manage three pull-ups! 💪',stretch:'A long, slow stretch. Ahh. 🧘',row:'Row, row, row! 🚣',bike:'You spin until your legs wobble. 🚴',sit:'You sink into the cushions. So comfy. ♥',tv:'You watch a cosy cooking show. ♥',sleep:'A quick nap… (sleep in the Staff Room bed to end the day)',cook:'You cook a fluffy omelette. Smells great! ♥'};
 S.hearts++;sfx(880);toast(M[A]||'Nice!');if(GYMACTS.includes(A)){S.min+=20;for(let i=0;i<8;i++)parts.push({x:ptx(),y:pty(),z:16,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,vz:30+Math.random()*30,l:.8,c:'#9ad8ff'});
  if(aresHere&&fr('Ares').train!=S.day){trainTogether(true);return;}if(aresHere){aresEmote('heart',3);startDialogue('Ares',[L(['Nice form, boss!','Breathe out on the push!','That\'s my client!'][Math.floor(Math.random()*3)],'smile')]);}}
 else if(A=='sit'&&aresHere&&roomAct()&&roomAct().mode=='tv'){aresEmote('heart',4);startDialogue('Ares',[L('Scoot over, buddy. Movie night! I call the big cushion.','smile')]);gainFr('Ares',1,1);}
 else if(A=='cook'&&aresHere){aresEmote('note',4);startDialogue('Ares',[L('Ooh, eggs! Six for me. Protein, boss!','smile')]);}};
// frilly comments when talking
const _talkV21=talkTenant;talkTenant=function(n){_talkV21(n);if(n=='Ares'&&unitCount('Ares',isFrilly)&&dlg.on){dlg.lines.push(L('Also, boss... who put the frilly stuff in my room? It\'s giving "tea party", not "gains".','sad'));aresEmote('angry',4);}};
// ---------- shop: Gym tab + dislike labels ----------
furnShop=function(tab){if(tab)shopTab=tab;const cats={gym:'🏋 Gym',kitchen:'🍳 Kitchen',bedroom:'🛏 Bedroom',bath:'🚿 Bathroom',living:'🛋 Living',wall:'🖼 Wall decor',lobby:'🏢 Office'};
 let h=`<h3>🛋 FURNITURE SHOP</h3><p>Cash ${money(S.gold)} · ${FURNLIST.length} items · Every unit needs <b>Toilet, Bed, Stove, Fridge</b>. Buy here, then place and ROTATE in DECOR mode.</p><div class="row">`+Object.entries(cats).map(([k,n])=>`<button style="flex:0 1 auto;${k==shopTab?'background:#ffd84a':''}" onclick="furnShop('${k}')">${n}</button>`).join('')+'</div><div class="grid">';
 FURNLIST.filter(k=>{const F=FURN[k];if(F.fixed)return false;if(shopTab=='gym')return isGym(k);return shopTab=='wall'?F.wall:!F.wall&&(F.zone.includes(shopTab)||F.zone.includes('any')&&shopTab=='living');}).forEach(k=>{const F=FURN[k];const fans=S.condo.tenants.filter(n=>n&&(CHARS[n].fav==k||(CHARS[n].loves||[]).includes(k)||CHARS[n].likes.includes(F.theme))),haters=S.condo.tenants.filter(n=>n&&(CHARS[n].dislikes||[]).includes(F.theme));
  h+=`<button class="it${canPay(F.cost)?'':' no'}" onclick="buyF('${k}')"><img src="${fthumb(k)}"><b>${F.n}</b><span class="th" style="background:${TCOL[F.theme]}">${FTHEME[F.theme]}</span>${F.req?'<span class="rq">REQUIRED</span>':''}<br>${money(F.cost.gold)} · ♥${F.comfort} · own ${S.finv[k]||0}${fans.length?'<br><small>♥ '+fans.join(', ')+'</small>':''}${haters.length?'<br><small class="hate">✖ '+haters.join(', ')+' dislikes</small>':''}</button>`;});openMenu(h+'</div>');};window.furnShop=furnShop;
// tenant card: relationship / actions button
(()=>{const b=$('tRel');if(b)b.onpointerdown=e=>{e.preventDefault();e.stopPropagation();const t=selTenant();if(t)relMenu(t.n);};})();
if(S.area=='room:gym'&&area&&area.room!='gym')goArea('room:gym');
