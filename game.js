'use strict';
// Fantasy Town v0.0.0.8 — small-town condo life sim (family-friendly)
const VERSION='v0.0.0.9',SAVE='fantasytown_save_v9';
const cv=document.getElementById('c'),ctx=cv.getContext('2d'),menuEl=document.getElementById('menu');
const Q=new URLSearchParams(location.search),$=id=>document.getElementById(id);
const G=0,ROAD=1,WATER=2,CONC=5,PATH=14,DARKG=15,FL1=20,FL2=21,FL3=22;
const L=(t,e='smile')=>({t,e});
// ---------- characters ----------
// likes: themes (see FTHEME) + fav furniture; job: workplace or null; hang: favourite places
const CHARS={
 Pip:{look:{body:'#ffc93a',hair:'#ff9a3a',style:'spiky'},pers:'Cheerful · Energetic',likes:['neon','beach'],fav:'arcade',job:null,hang:['park','plaza','cafe'],offer:[40,55],
  talks:[[L('Morning, manager! Today feels like a lucky day.','happy')],[L('I counted every bench in the park. There are a lot!','surprised'),L('I sat on all of them. For science.','happy')]],
  scenes:[[L('Hey! Want to race to the fountain? ...You let me win, didn\'t you?','happy'),L('Thanks for hanging out. Moving here was the best idea ever.')],[L('I made you a friendship bracelet! It is a little crooked.','happy'),L('Crooked ones are the best kind, right?')],[L('When I was little I wanted to live somewhere with lots of friends.','smile'),L('Now I do. Thanks, manager!','happy')]]},
 Nova:{look:{body:'#f4f4ff',hair:'#8f6bff',style:'bob'},pers:'Dreamy · Stargazer',likes:['modern','luxury'],fav:'floorlamp',job:'studio',hang:['park','cafe'],offer:[55,70],
  talks:[[L('The studio has great light for my star charts.','happy')],[L('Did you see the clouds this morning? Like whipped cream.','surprised')]],
  scenes:[[L('This is my favourite spot. You can see the whole sky from here.','happy'),L('Thanks for keeping me company.')],[L('I named a little star after the condo. Shh, it is a secret.','surprised'),L('Fantasy Star. Has a nice ring!','happy')],[L('I used to move around a lot. This is the first place that feels like home.'),L('So... thank you. Really.','happy')]]},
 Sigil:{look:{body:'#2f4fa8',hair:'#22232e',style:'short'},pers:'Quiet · Bookworm',likes:['wood','modern'],fav:'bookshelf',job:'fshop',hang:['cafe','plaza'],offer:[50,65],
  talks:[[L('I help out at the furniture shop. Ask me about shelves.','smile')],[L('A good book and a warm drink. That is a perfect day.','happy')]],
  scenes:[[L('This cafe makes the best cocoa in town. I come here to read.','happy'),L('You can borrow any book you like.')],[L('I wrote a short story about our condo. You are the hero.','surprised'),L('The hero fixes the elevator. Very brave.','happy')],[L('I am not great at talking... but talking with you is easy.'),L('Same time next week?','happy')]]},
 Amber:{look:{body:'#e2483a',hair:'#ffd36a',style:'pony'},pers:'Sporty · Outgoing',likes:['beach','wood'],fav:'surfboard',job:'cafe',hang:['park','restaurant'],offer:[45,60],
  talks:[[L('I work the morning shift at the cafe. Free smiles included!','happy')],[L('I jog three laps around the park every evening.','smile')]],
  scenes:[[L('Race you around the pond! Ready, set...','happy'),L('Okay, okay, we can walk. Walking is nice too.')],[L('I am training for the town fun-run. Will you cheer for me?','surprised'),L('Yay! Best cheer squad ever.','happy')],[L('Some days are tough, but coming home to a cozy room helps a lot.'),L('You made that happen, manager.','happy')]]},
 Juno:{look:{body:'#1a7a7a',hair:'#2ec8b8',style:'bun'},pers:'Gentle · Animal lover',likes:['beach','modern'],fav:'fishtank',job:null,hang:['park','plaza','restaurant'],offer:[45,60],
  talks:[[L('The ducks in the park pond know me by name. Probably.','happy')],[L('Do you think fish dream? I hope they dream of snacks.','surprised')]],
  scenes:[[L('Look, the ducklings learned to swim in a line!','surprised'),L('Thank you for coming to see them with me.','happy')],[L('I am saving up to volunteer at the aquarium in the next town.'),L('You think I can do it? That means a lot.','happy')],[L('You always listen to my fish facts. Here is the best one:'),L('Some fish can recognise faces. So can I. Yours is my favourite friendly face!','happy')]]},
 Kai:{look:{body:'#5a6070',hair:'#5a3a22',style:'spiky'},pers:'Laid-back · Gamer',likes:['neon','modern'],fav:'gamerdesk',job:'studio',hang:['restaurant','plaza'],offer:[55,75],
  talks:[[L('I design little games at the studio. Pixel by pixel.','happy')],[L('The restaurant noodles are elite. Ten out of ten.','smile')]],
  scenes:[[L('Try this level I made. Jump on the clouds!','happy'),L('You beat it first try? No way!','surprised')],[L('I put the condo in my new game. Your character has a tiny hat.','happy'),L('It is a very good hat.')],[L('Thanks for being a real friend, not just a landlord.'),L('Player two, forever.','happy')]]},
 Mira:{look:{body:'#8a4ac8',hair:'#ff6fb5',style:'long'},pers:'Artsy · Warm',likes:['wood','luxury'],fav:'frame_family',job:'fshop',hang:['cafe','park'],offer:[50,65],
  talks:[[L('I paint the price tags at the furniture shop. Each one is a tiny artwork!','happy')],[L('Pink and teal. That is my colour of the week.','smile')]],
  scenes:[[L('I sketch people in the park. Can I sketch you?','happy'),L('Ta-da! I gave you sparkly eyes.')],[L('I am painting a mural for the plaza. Want to help pick colours?','surprised'),L('Perfect choice. You have a good eye!','happy')],[L('This town feels brighter since you opened the condo.'),L('I mean it. Thanks, friend.','happy')]]},
 Vexa:{look:{body:'#2a1a40',hair:'#e040b0',style:'pony'},pers:'Musical · Night owl',likes:['luxury','neon'],fav:'piano',job:'restaurant',hang:['plaza','cafe'],offer:[60,80],
  talks:[[L('I play piano at the restaurant in the evenings.','happy')],[L('Mornings are hard. Coffee first, words later.','smile')]],
  scenes:[[L('I wrote a little tune about the plaza fountain. Listen!','happy'),L('Splish, splash, la la. It needs work.')],[L('Would you come to my small concert on Friday? Front row seat for you.','surprised'),L('Yay. I will play the fountain song.','happy')],[L('Music is how I say thank you. So this next song is for you.'),L('...You are smiling. Mission complete.','happy')]]},
 Bolt:{look:{body:'#4a5a70',robot:1},pers:'Helpful · Robot',likes:['modern','neon'],fav:'coffeebar',job:'studio',hang:['plaza','park'],offer:[40,55],
  talks:[[L('Beep! Bolt reporting for neighbourly duty.','happy')],[L('I calculated the perfect sandwich. It has extra pickles.','surprised')]],
  scenes:[[L('I am learning what humans call relaxing. Is this it? Sitting?','surprised'),L('Relaxing: 87 percent achieved. Thank you.','happy')],[L('I repaired the park bench. Now it does not wobble.','happy'),L('Friendship protocol upgraded.')],[L('Data shows I smile more when you visit.'),L('Conclusion: you are my best friend. Beep!','happy')]]},
 'Old Coral':{look:{body:'#24406e',hair:'#d8dde2',style:'short',hat:'#f4f4f4'},pers:'Wise · Storyteller',likes:['beach','wood'],fav:'armchair_beach',job:null,hang:['park','restaurant','cafe'],offer:[45,60],
  talks:[[L('Ahoy! A fine morning for a stroll in the park.','happy')],[L('When I was a sailor I saw whales sing. True story.','surprised')]],
  scenes:[[L('Sit, sit. Let me tell you about the great storm of my youth.','happy'),L('...and that is why I always carry a spare sandwich.')],[L('This old captain hat? It was a gift from my crew.'),L('Friends are the best treasure, young one.','happy')],[L('A good harbour is a place you can always come back to.'),L('This condo is my harbour now. Thank you.','happy')]]},
 'Mayor Lumen':{look:{body:'#c09a2a',hair:'#f4f4f4',style:'short'},
  talks:[[L('Welcome to Lumen Town, manager! Small, but full of heart.','happy'),L('Happy tenants make a happy town. Post an ad at your front desk!')],[L('Tenants love rooms with their favourite things.','smile'),L('Check what they like before you decorate!','happy')]]},
};
const TENANT_POOL=['Pip','Nova','Sigil','Amber','Juno','Kai','Mira','Vexa','Bolt','Old Coral'],MAXF=6,FLOORCOL=[FL1,FL2,FL3];
// ---------- town ----------
const CONDO={x:2,y:2,w:5,d:4,door:[4,6]};
const BLDS=[{id:'condo',x:2,y:2,w:5,d:4,door:[4,6]},{id:'cafe',x:9,y:3,w:4,d:3,door:[11,6]},{id:'restaurant',x:21,y:3,w:5,d:3,door:[23,6]},{id:'fshop',x:28,y:3,w:5,d:3,door:[30,6]},{id:'studio',x:25,y:14,w:4,d:3,door:[27,17]}];
const PLACES={home:{n:'Home'},park:{n:'City Park',tag:[7,17],spots:[[6,15],[9,16],[8,21],[11,19],[3,15],[10,14]]},plaza:{n:'Town Plaza',tag:[17.5,15],spots:[[15,14],[20,14],[15,18],[20,17],[14,16]]},
 cafe:{n:'Cafe',tag:[11,4.5],spots:[[10,7],[12,7],[9,8],[13,8]]},restaurant:{n:'Restaurant',tag:[23.5,4.5],spots:[[22,7],[24,7],[25,8],[21,8]]},fshop:{n:'Furniture Shop',tag:[30.5,4.5],spots:[[29,7],[31,7],[32,8]]},studio:{n:'Studio',tag:[27,15.5],spots:[[26,18],[28,18],[25,19]]}};
let S;
function newState(){return{v:9,day:1,min:7*60,gold:600,area:'town',px:4.5*16,py:7.5*16,fx:0,fy:1,
 condo:{floors:1,building:0,ad:0,apps:null,tenants:[null]},offers:{},fr:{},
 rooms:{office:{lay:'office',furn:[{k:'frontdesk',x:5,y:7},{k:'waitchairs',x:1,y:8},{k:'ficus_lobby',x:0,y:6},{k:'watercooler',x:12,y:6},{k:'noticeboard',x:0,y:7,v:1},{k:'rug_lux',x:9,y:7},{k:'filecab',x:10,y:6},
  {k:'bed_wood',x:0,y:1},{k:'nightstand',x:2,y:0},{k:'wardrobe_modern',x:5,y:0},{k:'desk',x:6,y:3},{k:'curtains',x:3,y:0},{k:'plant_monstera',x:8,y:0},{k:'rug_wood',x:3,y:2},{k:'frame_art',x:0,y:3,v:1},
  {k:'toilet',x:13,y:0},{k:'bathsink',x:11,y:0},{k:'shower',x:10,y:0},{k:'bathmat',x:11,y:2},{k:'fire_ext',x:13,y:6}]},f1:{lay:'unit',furn:[]}},finv:{toilet:1,bed:1,stove:1,fridge:1,plant_monstera:1,rug_wood:1},
 opt:{dpad:0},hearts:0};}
const AF=(a,x,y,w,h,t)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(a.tile[j]&&i>=0&&i<a.cols)a.tile[j][i]=t;};
const AS=(a,x,y,w,h,v=1)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(a.solid[j]&&i>=0&&i<a.cols)a.solid[j][i]=v;};
const OB=(a,k,x,y,v=0,solid=true)=>{const o=OBJ[k]||FURN[k];a.objs.push({k,x,y,v,w:o.w,d:o.d});if(solid&&!o.flat&&!o.wall)AS(a,x,y,o.w,o.d);};
function layout(a){a.tile=[];a.solid=[];a.objs=[];for(let y=0;y<a.rows;y++){a.tile.push(new Array(a.cols).fill(a.ground));a.solid.push(new Array(a.cols).fill(0));}}
const TOWN={id:'town',name:'Lumen Town',cols:36,rows:24,ground:G,npcs:[]};
function genTown(a){layout(a);
 AF(a,0,10,36,2,ROAD);AF(a,17,0,2,24,ROAD);AF(a,0,9,36,1,PATH);AF(a,0,12,36,1,PATH);AF(a,16,0,1,24,PATH);AF(a,19,0,1,24,PATH);
 AF(a,1,6,34,1,PATH);[[4,7],[11,7],[23,7],[30,7]].forEach(([x,y])=>AF(a,x,y,1,2,PATH));AF(a,8,7,6,2,CONC);AF(a,20,7,7,2,CONC);
 AF(a,14,13,8,6,CONC);AF(a,20,18,9,1,PATH);AF(a,27,17,1,1,PATH);AF(a,24,18,6,2,CONC);
 AF(a,1,13,13,10,DARKG);AF(a,2,14,11,8,G);AF(a,4,17,3,3,WATER);AS(a,4,17,3,3);AF(a,7,13,1,10,PATH);AF(a,2,18,11,1,PATH);
 for(const b of BLDS)if(b.id!='condo')OB(a,b.id,b.x,b.y);a.objs.push({k:'condo',x:CONDO.x,y:CONDO.y,w:5,d:4});AS(a,CONDO.x,CONDO.y,5,4);
 OB(a,'fountain',16,15);[[9,7,0],[12,8,1],[21,7,2],[25,7,0]].forEach(([x,y,v])=>OB(a,'parasol',x,y,v));
 [[3,14],[9,14],[11,16],[3,21],[11,21],[5,21],[12,14]].forEach(([x,y],i)=>OB(a,'tree',x,y,i));[[1,16],[1,20],[13,15],[13,20]].forEach(([x,y],i)=>OB(a,'tree',x,y,i+2));
 [[8,15],[8,19]].forEach(([x,y])=>OB(a,'bench',x,y));OB(a,'bench',14,17);OB(a,'bench',20,15);
 [[5,13],[6,13],[9,13],[10,13],[2,13],[3,13],[11,13],[12,13]].forEach(([x,y])=>OB(a,'hedge',x,y));
 [[2,15],[10,20],[12,18],[5,15],[3,19]].forEach(([x,y],i)=>OB(a,'flowers',x,y,i,false));[[8,2],[13,4],[20,2],[27,2],[33,3],[34,14],[31,19],[22,21],[30,21],[34,21],[24,13],[14,21],[19,22]].forEach(([x,y],i)=>OB(a,'tree',x,y,i));
 [[0,8],[6,8],[14,8],[21,13],[26,8],[33,8],[15,13],[22,13],[30,13],[15,21],[20,21]].forEach(([x,y])=>OB(a,'lamp',x,y));
 a.spawn=[4,7];}
// ---------- apartments: layouts, zones, interior walls ----------
const ZCOL={kitchen:'#ff9a3a',bedroom:'#5cc85a',bath:'#3a9aff',living:'#ff5a5a',lobby:'#ffcf3a'};
const ZFLOOR={kitchen:23,bath:26,bedroom:24,living:24,lobby:27,door:24};
const LAY={
 unit:{cols:18,rows:12,exit:[9,11],spawn:[9,10],home:[8,9],zones:[['kitchen',0,0,6,6],['bedroom',7,0,6,6],['bath',14,0,4,6],['living',0,7,18,5]],hw:[6,[2,3,9,10,15]],vw:[[6,0,5],[13,0,5]],
  wins:[['y',1.4,4.6,'kitchen'],['y',7.2,9.2,'bedroom'],['y',15,17,'bath'],['x',9.2,11.6,'living']]},
 office:{cols:14,rows:10,exit:[7,9],spawn:[7,8],home:[7,7],zones:[['bedroom',0,0,9,5],['bath',10,0,4,5],['lobby',0,6,14,4]],hw:[5,[3,4,11]],vw:[[9,0,4]],
  wins:[['y',2,5.5,'bedroom'],['y',11,13,'bath'],['x',6.6,9,'lobby']]}};
function zoneOf(L,x,y){if(y==L.hw[0])return L.hw[1].includes(x)?'door':'wall';for(const [cx,y0,y1] of L.vw)if(x==cx&&y>=y0&&y<=y1)return'wall';for(const [z,zx,zy,w,h] of L.zones)if(x>=zx&&y>=zy&&x<zx+w&&y<zy+h)return z;return'wall';}
OBJ.iwall={w:1,d:1,h:20,draw(c,v){box(c,0,0,0,1,1,14,'#f4ece4',{top:'#ffffff'});faceQ(c,0,0,0,1,1,'L',0,1,0,2.5,'#c8bcb0',null);faceQ(c,0,0,0,1,1,'R',0,1,0,2.5,'#b8aca0',null);}};
const REQS=['toilet','bed','stove','fridge'];
function unitHas(id){const R=S.rooms[id],h={};(R?R.furn:[]).forEach(f=>{const F=FURN[f.k];if(F.req)h[F.req]=1;if(F.kit)h[F.kit]=1;});return h;}
function missing(id){const h=unitHas(id);return REQS.filter(r=>!h[r]);}
const rentable=id=>missing(id).length==0;
const KITS={kitchen:[['stove','Stove'],['fridge','Fridge'],['sink','Sink'],['counter','Counter'],['dining','Dining table']],bedroom:[['bed','Bed'],['wardrobe','Wardrobe'],['nightstand','Nightstand'],['desk','Desk']],bath:[['toilet','Toilet'],['bathsink','Sink + mirror'],['wash','Shower / bath']],living:[['sofa','Seating'],['tv','TV'],['table','Coffee table'],['shelf','Shelf']]};
function roomsDone(id){const h=unitHas(id);return Object.entries(KITS).map(([z,L])=>[z,L.filter(([k])=>h[k]).length,L.length]);}
function homeSpot(id){const a=area&&area.room==id?area:roomArea(id),L=LAY[S.rooms[id].lay];const q=[L.home];const seen=new Set();while(q.length){const [x,y]=q.shift(),k=x+','+y;if(seen.has(k))continue;seen.add(k);if(x<0||y<0||x>=a.cols||y>=a.rows)continue;if(!a.solid[y][x]&&!(x==L.exit[0]&&y==L.exit[1])&&zoneOf(L,x,y)!='door')return[x+.5,y+.5];[[1,0],[-1,0],[0,1],[0,-1]].forEach(([i,j])=>q.push([x+i,y+j]));}return L.home;}
function roomArea(id){const R=S.rooms[id],L=LAY[R.lay];const tn=id=='office'?null:S.condo.tenants[+id.slice(1)-1];const a={id:'room:'+id,room:id,lay:L,name:id=='office'?'Manager Office':'Floor '+id.slice(1)+' · '+(tn||'Vacant'),cols:L.cols,rows:L.rows,ground:24,tile:[],solid:[],objs:[],npcs:[]};
 layout(a);for(let y=0;y<a.rows;y++)for(let x=0;x<a.cols;x++){const z=zoneOf(L,x,y);a.tile[y][x]=ZFLOOR[z]||24;if(z=='wall'){a.solid[y][x]=1;a.objs.push({k:'iwall',x,y,w:1,d:1,v:0});}}
 R.furn.forEach(f=>OB(a,f.k,f.x,f.y,f.v||0,true));a.exit=L.exit;a.spawn=L.spawn;return a;}
function load(){try{const j=JSON.parse(localStorage.getItem(SAVE));if(j&&j.v==9){S=Object.assign(newState(),j);return 1;}}catch(e){}S=newState();
 if(['v8','v7','v6','v5'].some(v=>localStorage.getItem('fantasytown_save_'+v))){S.gold+=150;S.oldSave=1;}return 0;}
function save(quiet){localStorage.setItem(SAVE,JSON.stringify(S));if(!quiet)toast('Game saved');}
const loaded=load();genTown(TOWN);
if(Q.has('t'))S.min=parseFloat(Q.get('t'))*60;
let area=null;
function groundOf(a){if(a.gcv)return a.gcv;const W=(a.cols+a.rows)*TW/2,H=(a.cols+a.rows)*TH/2,ox=a.rows*TW/2,top=a.room?70:10,bot=a.room?10:40;const c=document.createElement('canvas');c.width=W*RS;c.height=(H+top+bot)*RS;
 const g=c.getContext('2d');g.scale(RS,RS);g.translate(ox,top);const r=rng(a.cols*7+a.rows);
 if(a.room){const L=a.lay,wh=62,zc=(x,y)=>{let z=zoneOf(L,x,y);if(z=='wall'||z=='door')z=zoneOf(L,x+1,y)!='wall'?zoneOf(L,x+1,y):zoneOf(L,x,y+1);return ZCOL[z]||'#ff8a7a';};
  for(let x=0;x<a.cols;x++){const col=zc(x,0);poly(g,[isoP(x,0,0),isoP(x+1,0,0),isoP(x+1,0,wh),isoP(x,0,wh)],shade(col,1.0),null);poly(g,[isoP(x,0,wh-10),isoP(x+1,0,wh-10),isoP(x+1,0,wh),isoP(x,0,wh)],shade(col,1.12),null);}
  for(let y=0;y<a.rows;y++){const col=zc(0,y);poly(g,[isoP(0,y,0),isoP(0,y+1,0),isoP(0,y+1,wh),isoP(0,y,wh)],shade(col,.84),null);poly(g,[isoP(0,y,wh-10),isoP(0,y+1,wh-10),isoP(0,y+1,wh),isoP(0,y,wh)],shade(col,.95),null);}
  poly(g,[isoP(0,0,0),isoP(a.cols,0,0),isoP(a.cols,0,wh),isoP(0,0,wh)],null,OLC,1.2);poly(g,[isoP(0,0,0),isoP(0,a.rows,0),isoP(0,a.rows,wh),isoP(0,0,wh)],null,OLC,1.2);
  poly(g,[isoP(0,0,0),isoP(a.cols,0,0),isoP(a.cols,0,5),isoP(0,0,5)],'#ffffff');poly(g,[isoP(0,0,0),isoP(0,a.rows,0),isoP(0,a.rows,5),isoP(0,0,5)],'#f0f0f0');
  poly(g,[isoP(0,0,wh),isoP(a.cols,0,wh),isoP(a.cols+.2,-.2,wh+3),isoP(-.2,-.2,wh+3)],'#fff');poly(g,[isoP(0,0,wh),isoP(0,a.rows,wh),isoP(-.2,a.rows+.2,wh+3),isoP(-.2,-.2,wh+3)],'#f4f4f4');
  L.wins.forEach(([ax,u0,u1])=>{const P=ax=='y'?(u,z)=>isoP(u,0,z):(u,z)=>isoP(0,u,z);poly(g,[P(u0-.1,20),P(u1+.1,20),P(u1+.1,52),P(u0-.1,52)],'#ffffff');const sky=g.createLinearGradient(0,P(u0,50)[1],0,P(u0,22)[1]);sky.addColorStop(0,'#7ac8ff');sky.addColorStop(1,'#d8f0ff');poly(g,[P(u0,22),P(u1,22),P(u1,50),P(u0,50)],sky,OLC,.8);
   poly(g,[P(u0,22),P(u1,22),P(u1,29),P(u0,29)],'#9ad86a',null);const m=(u0+u1)/2;poly(g,[P(m-.04,22),P(m+.04,22),P(m+.04,50),P(m-.04,50)],'#fff',null);poly(g,[P(u0,35.5),P(u1,35.5),P(u1,36.5),P(u0,36.5)],'#fff',null);poly(g,[P(u0+.2,40),P(u0+.5,40),P(u0+.9,48),P(u0+.6,48)],'rgba(255,255,255,.45)',null);poly(g,[P(u0-.15,19),P(u1+.15,19),P(u1+.15,21),P(u0-.15,21)],'#e8e8ee');});
  for(let y=0;y<a.rows;y++)for(let x=0;x<a.cols;x++)drawGroundTile(g,a.tile[y][x],x,y,r);
  const [ex,ey]=isoP(a.exit[0]+.5,a.exit[1]+.5);ell(g,ex,ey,12,5,'#c84a5a',OLC,.6);
  poly(g,[isoP(0,a.rows),isoP(a.cols,a.rows),isoP(a.cols,a.rows,-6),isoP(0,a.rows,-6)],'#c8b8a8');poly(g,[isoP(a.cols,0),isoP(a.cols,a.rows),isoP(a.cols,a.rows,-6),isoP(a.cols,0,-6)],'#a89888');}
 else{for(let y=0;y<a.rows;y++)for(let x=0;x<a.cols;x++){const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([i,j])=>(a.tile[y+j]||[])[x+i]??2);drawGroundTile(g,a.tile[y][x],x,y,r,nb);}
  const ec='#8a6a4a';poly(g,[isoP(0,a.rows),isoP(a.cols,a.rows),isoP(a.cols,a.rows,-22),isoP(0,a.rows,-22)],shade(ec,.9));poly(g,[isoP(a.cols,0),isoP(a.cols,a.rows),isoP(a.cols,a.rows,-22),isoP(a.cols,0,-22)],shade(ec,.7));}
 a.gox=ox;a.goy=top;return a.gcv=c;}
function goArea(id,pos){area=id.startsWith('room:')?roomArea(id.slice(5)):TOWN;if(!area.room)area.gcv=area.gcv||null;
 S.area=id;const p=pos||area.spawn||[4,5];S.px=(p[0]+.5)*16;S.py=(p[1]+.5)*16;path=null;area.npcs=makeNpcs(area);banner={t:area.name,l:2.2};if(!area.room)decor=false;camSnap=1;}
function refresh(){const keep=[S.px,S.py];if(area.room)area=roomArea(area.room);area.gcv=null;area.npcs=makeNpcs(area);S.px=keep[0];S.py=keep[1];}
function npc(n,x,y){return{n,x,y,px:(x+.5)*16,py:(y+.5)*16,hx:(x+.5)*16,hy:(y+.5)*16,t:0,dx:0,dy:0,li:0,look:CHARS[n].look,face:'down',stat:1};}
// static NPCs (town greeter / tenants at home are drawn from TN)
function makeNpcs(a){const Ls=[];if(a.id=='town')Ls.push(npc('Mayor Lumen',18,14));return Ls;}
// ---------- tenant simulation ----------
const TN={};// name -> runtime {n,floor,goal,place,px,py,path,inRoom,spot}
const hourNow=()=>(S.min/60)%24+(S.min>=24*60?24:0);
function schedule(name,day,h){const c=CHARS[name],i=TENANT_POOL.indexOf(name),hh=h-(i%4)*.25,hang=k=>c.hang[(day+k+i)%c.hang.length];
 if(hh<8.5||hh>=20)return'home';if(hh<12)return c.job||hang(0);if(hh<13.5)return(day+i+name.length)%2?'cafe':'restaurant';if(hh<17)return c.job?(day%3==2?hang(1):c.job):hang(1);return(day+i)%3==0?'restaurant':hang(2);}
function scheduleText(name){const c=CHARS[name];return[['7–8:30','Home (room)'],['8:30–12',c.job?'Work · '+PLACES[c.job].n:PLACES[c.hang[0]].n],['12–1:30','Lunch · Cafe/Restaurant'],['1:30–5',c.job?'Work · '+PLACES[c.job].n:'Hangout'],['5–8','Evening · '+c.hang.map(p=>PLACES[p].n).join('/')],['8 PM','Back home']];}
function freeSpot(place,name){const sp=PLACES[place].spots,taken=Object.values(TN).filter(t=>t.n!=name&&t.place==place).map(t=>t.spot);let s=sp.find(q=>!taken.includes(q))||sp[0];return s;}
function syncTenants(snap){S.condo.tenants.forEach((n,i)=>{if(!n){return;}let t=TN[n];if(!t){t=TN[n]={n,floor:i+1,goal:null,place:'home',px:0,py:0,path:null,inRoom:true,spot:null};snap=true;}t.floor=i+1;
  const want=schedule(n,S.day,hourNow());if(want==t.goal)return;t.goal=want;
  if(snap){if(want=='home'){t.inRoom=true;t.place='home';t.path=null;}else{t.spot=freeSpot(want,n);t.place=want;t.inRoom=false;t.px=t.spot[0]+.5;t.py=t.spot[1]+.5;t.path=null;}return;}
  const from=t.inRoom?[CONDO.door[0],CONDO.door[1]+1]:[Math.floor(t.px),Math.floor(t.py)];if(t.inRoom){t.inRoom=false;t.px=from[0]+.5;t.py=from[1]+.5;}
  const to=want=='home'?[CONDO.door[0],CONDO.door[1]+1]:(t.spot=freeSpot(want,n));t.place='walking';t.dest=want;
  t.path=bfsOn(TOWN,from[0],from[1],(x,y)=>x==to[0]&&y==to[1]);if(!t.path){t.px=to[0]+.5;t.py=to[1]+.5;arrive(t);}});
 for(const n in TN)if(!S.condo.tenants.includes(n))delete TN[n];}
function arrive(t){t.path=null;if(t.dest=='home'){t.inRoom=true;t.place='home';if(follow==t.n){toast(`${t.n} went home to Floor ${t.floor}`);follow=null;}}else{t.place=t.dest;if(follow==t.n)toast(`${t.n} arrived at the ${PLACES[t.place].n}`);}}
function stepTenants(dt){for(const n in TN){const t=TN[n];if(!t.path||t.inRoom)continue;const nx=t.path[0];if(!nx){arrive(t);continue;}const dx=nx[0]+.5-t.px,dy=nx[1]+.5-t.py,l=Math.hypot(dx,dy),sp=2.4*dt;
  if(l<=sp){t.px=nx[0]+.5;t.py=nx[1]+.5;t.path.shift();if(!t.path.length)arrive(t);}else{t.px+=dx/l*sp;t.py+=dy/l*sp;t.face=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}}}
function tenantsHere(){if(area.room){const i=+area.room.slice(1)-1,n=S.condo.tenants[i];if(!(n&&TN[n]&&TN[n].inRoom))return[];const [hx,hy]=homeSpot(area.room);return[{n,px:hx,py:hy,room:1}];}return Object.values(TN).filter(t=>!t.inRoom);}
// ---------- friendship / happiness ----------
const fr=n=>S.fr[n]||(S.fr[n]={p:0,talk:0,hang:0,scene:0});
const frLv=n=>Math.min(5,Math.floor(fr(n).p/4));
function happiness(n){const i=S.condo.tenants.indexOf(n);if(i<0)return 0;const id='f'+(i+1),R=S.rooms[id],c=CHARS[n];let h=20;
 R.furn.forEach(f=>{const F=FURN[f.k];if(f.k==c.fav)h+=18;else if(c.likes.includes(F.theme))h+=6;else h+=Math.min(3,F.comfort||0);});roomsDone(id).forEach(([z,a,b])=>{if(a==b)h+=6;});if(!rentable(id))h-=30;return Math.max(0,Math.min(100,h+frLv(n)*2));}
function likedIn(n){const i=S.condo.tenants.indexOf(n),R=S.rooms['f'+(i+1)],c=CHARS[n];return R.furn.filter(f=>f.k==c.fav||c.likes.includes(FURN[f.k].theme)).length;}
function rentOf(i){const n=S.condo.tenants[i];if(!n)return 0;const o=S.offers[n]||50;return Math.round(o*(.6+.6*happiness(n)/100)*(1+frLv(n)*.03));}
function rentTotal(){return S.condo.tenants.reduce((s,t,i)=>s+rentOf(i),0);}
const renoCost=n=>({gold:150*n});
function comfort(id){const R=S.rooms[id];return R?R.furn.reduce((s,f)=>s+(FURN[f.k].comfort||0),0):0;}
// ---------- input / modes ----------
const keys={};let decor=false,fsel=0,hold=null,showMap=Q.has('map'),showCondo=false,showApps=false,condoScroll=0,path=null,pendingAct=null,ghostAt=null,camSnap=1,follow=null,selT=null;
addEventListener('keydown',ev=>{const k=ev.key.toLowerCase();
 if(dlg.on){if(k==' '||k=='enter'||k=='e')dlgNext();if(k=='escape')dlgClose();ev.preventDefault();return;}
 if(menuOpen()){if(k=='escape')closeMenu();return;}
 if(showMap||showApps){if(k=='m'||k=='escape')back();return;}
 if(showCondo){if(k=='escape')showCondo=false;if(k=='arrowup'||k=='w')condoScroll+=60;if(k=='arrowdown'||k=='s')condoScroll=Math.max(0,condoScroll-60);ev.preventDefault();return;}
 keys[k]=1;if(k==' '||k=='e'||k=='enter'){useAction();ev.preventDefault();}
 if(k=='b')toggleDecor();if(k=='t')talkNearest();if(k=='f'&&selT)toggleFollow();
 if(decor){const n=DL().length;if(k=='q'||k=='tab'||k=='x')fsel=(fsel+1)%n;if(k=='z')fsel=(fsel+n-1)%n;}
 if(k=='escape')back();if(k=='tab')ev.preventDefault();if(k=='m'&&!area.room)showMap=true;if(k.startsWith('arrow'))ev.preventDefault();});
addEventListener('keyup',ev=>{keys[ev.key.toLowerCase()]=0;});
const isTouch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches||Q.has('touch');if(isTouch)document.body.classList.add('touch');
let triedFS=false;function tryFS(){if(triedFS||!isTouch)return;triedFS=true;const el=document.documentElement;try{const p=el.requestFullscreen?el.requestFullscreen({navigationUI:'hide'}):el.webkitRequestFullscreen&&el.webkitRequestFullscreen();Promise.resolve(p).then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})).catch(()=>{});}catch(e){}}
addEventListener('pointerdown',tryFS,{capture:true});
document.querySelectorAll('.tb').forEach(btn=>{const k=btn.dataset.k;const on=ev=>{ev.preventDefault();ev.stopPropagation();
  if(k=='act')useAction();else if(k=='tool'){if(decor)fsel=(fsel+1)%DL().length;}else if(k=='map'){if(!area.room)showMap=!showMap;}else if(k=='build')toggleDecor();else keys['t_'+k]=1;};
 const off=()=>{keys['t_'+k]=0;};btn.addEventListener('pointerdown',on);btn.addEventListener('pointerup',off);btn.addEventListener('pointerleave',off);btn.addEventListener('pointercancel',off);});
$('talk').onpointerdown=e=>{e.preventDefault();talkNearest();};$('back').onpointerdown=e=>{e.preventDefault();back();};
$('note').onpointerdown=e=>{e.preventDefault();notes();};$('gear').onpointerdown=e=>{e.preventDefault();settings();};
$('tFollow').onpointerdown=e=>{e.preventDefault();e.stopPropagation();toggleFollow();};$('tTalk').onpointerdown=e=>{e.preventDefault();e.stopPropagation();const t=selTenant();if(t)approach(t,'talk');};
$('tHang').onpointerdown=e=>{e.preventDefault();e.stopPropagation();const t=selTenant();if(t)approach(t,'hang');};$('tX').onpointerdown=e=>{e.preventDefault();e.stopPropagation();selT=null;};
let drag=null,btnList=[];
const hit=(L,x,y)=>L.find(b=>x>=b.r[0]&&x<b.r[0]+b.r[2]&&y>=b.r[1]&&y<b.r[1]+b.r[3]);
cv.addEventListener('pointerdown',ev=>{const x=ev.clientX,y=ev.clientY;
 if(showMap||showApps){const bt=hit(btnList,x,y);if(bt)bt.f();return;}
 if(showCondo){const bt=hit(btnList,x,y);if(bt){bt.f();return;}drag={y,s:condoScroll};return;}
 const s=hotRects.findIndex(r=>x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]);if(s>=0&&decor){fsel=s+bOff;return;}
 const tn=tenantAtScreen(x,y);if(tn&&!decor){selT=tn.n;return;}
 const tg=tagRects.find(r=>x>=r.r[0]&&x<r.r[0]+r.r[2]&&y>=r.r[1]&&y<r.r[1]+r.r[3]);if(tg&&!decor){walkTo(tg.x,tg.y);return;}
 const [tx,ty]=screenToTile(x,y);if(decor){if(ghostAt&&ghostAt[0]==tx&&ghostAt[1]==ty)placeFurn();else{ghostAt=[tx,ty];if(!hold)tryPick(tx,ty);}return;}
 walkTo(tx,ty);});
cv.addEventListener('pointermove',ev=>{if(drag&&showCondo)condoScroll=Math.max(0,drag.s+(ev.clientY-drag.y));});addEventListener('pointerup',()=>drag=null);
cv.addEventListener('wheel',ev=>{if(showCondo)condoScroll=Math.max(0,condoScroll-ev.deltaY*.6);},{passive:true});
function back(){if(dlg.on)return dlgClose();if(menuOpen())return closeMenu();if(showApps)return showApps=false;if(showMap)return showMap=false;if(showCondo)return showCondo=false;
 if(decor){if(hold){S.rooms[area.room].furn.push(hold);hold=null;refresh();}decor=false;ghostAt=null;return;}if(follow){follow=null;toast('Stopped following');return;}if(selT){selT=null;return;}
 if(area.room){goArea('town',[CONDO.door[0],CONDO.door[1]+1]);showCondo=true;}}
function toggleDecor(){if(!area.room){toast('Decorate inside condo rooms · buy furniture at the Furniture Shop');return;}if(decor){back();return;}decor=true;hold=null;ghostAt=null;toast('DECOR — tap a tile to preview, tap again to place. Tap furniture to move it');}
function selTenant(){return selT&&TN[selT];}
function toggleFollow(){const t=selTenant();if(!t)return;if(follow==t.n){follow=null;toast('Stopped following');return;}if(t.inRoom){toast(`${t.n} is at home on Floor ${t.floor}`);return;}if(area.room){goArea('town',[CONDO.door[0],CONDO.door[1]+1]);}follow=t.n;toast(`Following ${t.n} · ${t.place=='walking'?'heading to '+PLACES[t.dest].n:'at '+PLACES[t.place].n}`);}
function approach(t,what){if(t.inRoom&&!area.room){toast(`${t.n} is at home — visit Floor ${t.floor}`);return;}
 const hs=area.room?homeSpot(area.room):null;const d=area.room?Math.hypot(hs[0]-ptx(),hs[1]-pty()):Math.hypot(t.px-ptx(),t.py-pty());if(d>2.2){if(area.room){walkTo(Math.floor(hs[0]),Math.floor(hs[1]));}else walkTo(Math.floor(t.px),Math.floor(t.py));pendingTalk={n:t.n,what};return;}
 if(what=='talk')talkTenant(t.n);else hangOut(t.n);}
let pendingTalk=null;
const DL=()=>{const L=FURNLIST.filter(k=>S.finv[k]>0);return L.length?L:['plant_monstera'];};
// ---------- menus ----------
function menuOpen(){return menuEl.style.display=='block';}
function closeMenu(){menuEl.style.display='none';}
function openMenu(h){menuEl.innerHTML=h+`<button class="x" onclick="closeMenu()">Close</button>`;menuEl.style.display='block';for(const k in keys)keys[k]=0;}
window.closeMenu=closeMenu;
const costStr=c=>c&&c.gold?c.gold+'g':'free';const canPay=c=>S.gold>=((c&&c.gold)||0);const pay=c=>{S.gold-=(c&&c.gold)||0;};
const thumbURL={};function fthumb(k){if(!thumbURL[k]){const sp=spriteFor(k,0),W0=sp.cv.width,H0=sp.cv.height,d=sp.cv.getContext('2d').getImageData(0,0,W0,H0).data;let x0=W0,y0=H0,x1=0,y1=0;for(let y=0;y<H0;y++)for(let x=0;x<W0;x++)if(d[(y*W0+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}const bw=Math.max(1,x1-x0+1),bh=Math.max(1,y1-y0+1),c=document.createElement('canvas');c.width=c.height=72;const g=c.getContext('2d'),sc2=Math.min(66/bw,66/bh);g.drawImage(sp.cv,x0,y0,bw,bh,(72-bw*sc2)/2,(72-bh*sc2)/2,bw*sc2,bh*sc2);thumbURL[k]=c.toDataURL();}return thumbURL[k];}
let shopTab='kitchen';function furnShop(tab){if(tab)shopTab=tab;const cats={kitchen:'🍳 Kitchen',bedroom:'🛏 Bedroom',bath:'🚿 Bathroom',living:'🛋 Living',wall:'🖼 Wall decor',lobby:'🏢 Office'};
 let h=`<h3>🛋 FURNITURE SHOP</h3><p>Gold ${S.gold}g · Every unit needs <b>Toilet, Bed, Stove, Fridge</b> before it can be rented. Buy here, then place in DECOR mode.</p><div class="row">`+Object.entries(cats).map(([k,n])=>`<button style="flex:0 1 auto;${k==shopTab?'background:#ffd84a':''}" onclick="furnShop('${k}')">${n}</button>`).join('')+'</div><div class="grid">';
 FURNLIST.filter(k=>{const F=FURN[k];return shopTab=='wall'?F.wall:!F.wall&&F.zone.includes(shopTab);}).forEach(k=>{const F=FURN[k];const fans=S.condo.tenants.filter(n=>n&&(CHARS[n].fav==k||CHARS[n].likes.includes(F.theme)));
  h+=`<button class="it${canPay(F.cost)?'':' no'}" onclick="buyF('${k}')"><img src="${fthumb(k)}"><b>${F.n}</b><span class="th" style="background:${TCOL[F.theme]}">${FTHEME[F.theme]}</span>${F.req?'<span class="rq">REQUIRED</span>':''}<br>${F.cost.gold}g · ♥${F.comfort} · own ${S.finv[k]||0}${fans.length?'<br><small>♥ '+fans.join(', ')+'</small>':''}</button>`;});openMenu(h+'</div>');}
window.buyF=k=>{const F=FURN[k];if(!canPay(F.cost)){toast('Not enough gold');return;}pay(F.cost);S.finv[k]=(S.finv[k]||0)+1;sfx(700);toast('Bought '+F.n);const sc=menuEl.scrollTop;furnShop();menuEl.scrollTop=sc;save(1);};window.furnShop=furnShop;
function eatery(id){const P=PLACES[id],here=Object.values(TN).filter(t=>t.place==id);const food=id=='cafe'?['Cocoa',6]:['Noodle bowl',12];
 let h=`<h3>${id=='cafe'?'☕ CAFE':'🍜 RESTAURANT'}</h3><p>${here.length?'Here now: '+here.map(t=>t.n).join(', '):'No tenants here right now. Check the MAP or FOLLOW someone!'}</p><button onclick="treat('${id}')">Order a ${food[0]} · ${food[1]}g (♥ +1)</button>`;
 here.forEach(t=>h+=`<button onclick="closeMenu();hangOut('${t.n}')">Hang out with ${t.n} · ${food[1]}g · friendship +3</button>`);openMenu(h);}
window.treat=id=>{const c=id=='cafe'?6:12;if(S.gold<c){toast('Not enough gold');return;}S.gold-=c;S.hearts++;sfx(880);toast(id=='cafe'?'Warm cocoa! ♥':'Delicious noodles! ♥');closeMenu();};
function notes(){const c=S.condo,tn=c.tenants.filter(Boolean);const goals=[[tn.length>0,'Post an ad, pick 1 of 3 applicants'],[S.condo.tenants.some(n=>n&&likedIn(n)>0),'Place a furniture piece a tenant likes'],[Object.values(S.fr).some(f=>f.scene>0),'Unlock a friendship scene (hang out at Lv1)'],[c.floors>1,'Renovate a second tenant floor'],[c.floors>=MAXF,'Open all 6 condo floors']];
 let h=`<h3>📒 NOTE</h3><p>Day ${S.day} · Tenants ${tn.length}/${c.floors} · Rent/day ${rentTotal()}g · ♥ ${S.hearts}</p>`+goals.map(([d,t])=>`<p>${d?'✅':'⬜'} ${t}</p>`).join('');
 tn.forEach(n=>{const t=TN[n];h+=`<p><b>${n}</b> · ${'♥'.repeat(frLv(n))}${'♡'.repeat(5-frLv(n))} · happy ${happiness(n)}% · ${t?(t.inRoom?'Home':t.place=='walking'?'→ '+PLACES[t.dest].n:PLACES[t.place].n):''}</p>`;});openMenu(h);}
function settings(){openMenu(`<h3>⚙ SETTINGS</h3><button onclick="S.opt.dpad=!S.opt.dpad;applyOpt();settings()">On-screen D-pad: ${S.opt.dpad?'ON':'OFF'} (tap-to-move always works)</button><button onclick="save();closeMenu()">Save now</button><button onclick="if(confirm('Reset all progress?')){localStorage.removeItem('${SAVE}');location.reload()}">Reset save</button><p>Fantasy Town ${VERSION}</p>`);}
window.applyOpt=()=>document.body.classList.toggle('dpad',!!S.opt.dpad);window.settings=settings;window.save=save;
// ---------- condo / advertising ----------
function makeApps(){const pool=TENANT_POOL.filter(t=>!S.condo.tenants.includes(t));const r=[];while(r.length<3&&pool.length){const n=pool.splice(Math.floor(Math.random()*pool.length),1)[0],[lo,hi]=CHARS[n].offer;r.push({n,offer:lo+Math.round(Math.random()*(hi-lo)/5)*5});}return r;}
window.condoAct=(k,arg)=>{const c=S.condo;
 if(k=='ad'){if(c.ad||c.apps){toast('An ad is already running');return;}if(S.gold<20){toast('Need 20g for an ad');return;}S.gold-=20;c.ad=1;toast('Ad posted! 3 applicants will visit tomorrow morning');sfx(700);save(1);}
 if(k=='apps'){showApps=true;}
 if(k=='pick'){const i=c.tenants.findIndex((t,j)=>!t&&rentable('f'+(j+1))),a=c.apps&&c.apps[arg];if(!a)return;if(i<0){const v=c.tenants.indexOf(null);toast(v<0?'No vacant floor — renovate first':`Floor ${v+1} isn't rentable yet — needs ${missing('f'+(v+1)).map(r=>REQ[r]).join(', ')}`);sfx(150);return;}c.tenants[i]=a.n;S.offers[a.n]=a.offer;const others=c.apps.filter((q,j)=>j!=arg).map(q=>q.n);c.apps=null;showApps=false;showCondo=false;
  syncTenants(true);toast(`${a.n} moved into Floor ${i+1}!`);if(others.length)toast(`${others.join(' & ')} thanked you and left`);sfx(990);save(1);
  startDialogue(a.n,[L(`Hi manager! I'm ${a.n}. Thank you for choosing me for Floor ${i+1}!`,'happy'),L(`I love ${CHARS[a.n].likes.map(t=>FTHEME[t]).join(' and ')} things, especially a ${FURN[CHARS[a.n].fav].n}.`),L('Come find me around town sometime!','happy')]);}
 if(k=='decline'){c.apps=null;showApps=false;toast('The applicants left. Post a new ad anytime');}
 if(k=='reno'){const n=c.floors+1,cost=renoCost(n);if(c.building){toast('Already under construction');return;}if(n>MAXF){toast('The condo is at max height');return;}if(!canPay(cost)){toast('Need '+costStr(cost));return;}pay(cost);c.building=1;toast(`Renovation started! Floor ${n} opens tomorrow`);sfx(500);save(1);}};
function enterRoom(id){showCondo=false;goArea('room:'+id,[4,5]);}
function drawCondo(t){ctx.setTransform(1,0,0,1,0,0);const W=cv.width,H=cv.height,night=nightF();const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,night>.5?'#1a1a4a':'#7ac8ff');bg.addColorStop(1,night>.5?'#8a5a9a':'#ffd8e0');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 if(night>.5)for(let i=0;i<50;i++){ctx.fillStyle='rgba(255,255,255,'+(.3+.3*Math.sin(t+i))+')';ctx.fillRect((i*137)%W,(i*71)%(H*.7),2,2);}
 btnList=[];const s=Math.min(1.2,Math.max(.6,H/600)),fw=Math.min(W-300*s,540*s),fh=118*s;if(condoScroll<0)condoScroll=Math.max(0,(S.condo.floors+2)*(fh+6*s)+90*s-H+60);const x0=Math.max(250*s,(W-fw)/2+40*s),base=H-40*s+condoScroll,c=S.condo,d=28*s;
 const btn=(x,y,w,h,txt,col,f,dis)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,h/2);ctx.fillStyle=dis?'#9a9aaa':col;ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=['#ffd84a','#9fff7a'].includes(col)&&!dis?'#2a2238':'#fff';ctx.font=`bold ${Math.round(12*s)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,x+w/2,y+h/2+1);ctx.textAlign='left';if(!dis)btnList.push({r:[x,y,w,h],f});};
 ctx.fillStyle='#7ac06a';ctx.fillRect(0,base,W,H);ctx.fillStyle='#5a9a4a';ctx.fillRect(0,base,W,6*s);
 const label=(x,y,txt,col='#ffd84a')=>{ctx.font=`bold ${Math.round(12*s)}px sans-serif`;const w=ctx.measureText(txt).width+26*s;ctx.beginPath();ctx.roundRect(x,y-12*s,w,24*s,12*s);ctx.fillStyle='rgba(42,42,58,.94)';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.textBaseline='middle';ctx.fillText(txt,x+13*s,y+1);};
 const room=(y,wall,floor,furn,who)=>{// cutaway: back wall, side wall, floor
  ctx.fillStyle=wall;ctx.fillRect(x0,y-fh,fw,fh-d*.55);ctx.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<fw;i+=18*s)ctx.fillRect(x0+i,y-fh,2,fh-d*.55);
  ctx.fillStyle=shade(wall,.78);ctx.beginPath();ctx.moveTo(x0,y-fh);ctx.lineTo(x0-d,y-fh+d*.55);ctx.lineTo(x0-d,y);ctx.lineTo(x0,y-d*.55);ctx.fill();
  const fl=ctx.createLinearGradient(0,y-d*.55,0,y);fl.addColorStop(0,shade(floor,.9));fl.addColorStop(1,floor);ctx.fillStyle=fl;ctx.beginPath();ctx.moveTo(x0,y-d*.55);ctx.lineTo(x0+fw,y-d*.55);ctx.lineTo(x0+fw-d,y);ctx.lineTo(x0-d,y);ctx.fill();
  ctx.fillStyle='#fff';ctx.fillRect(x0,y-d*.55-4*s,fw,4*s);ctx.fillStyle='#bfe8ff';ctx.fillRect(x0+fw-120*s,y-fh+16*s,60*s,40*s);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.strokeRect(x0+fw-120*s,y-fh+16*s,60*s,40*s);
  (furn||[]).forEach((f,i)=>{const sp=spriteFor(f.k),k=s*1.05,w=sp.cv.width/RS*k,h=sp.cv.height/RS*k;ctx.drawImage(sp.cv,x0+fw*.3+i*fw*.13-w/2,y-d*.25-h+8*s,w,h);});
  if(who){const p=portrait(who,'smile');ctx.drawImage(p,x0+fw-170*s,y-fh+6*s,fh*.64,fh*.79);}
  ctx.fillStyle='#e8dccc';ctx.fillRect(x0-d,y,fw+d,7*s);ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.strokeRect(x0,y-fh,fw,fh-d*.55);ctx.fillStyle='#fffaf0';ctx.fillRect(x0-d-6*s,y-fh-4*s,fw+d+12*s,6*s);};
 let y=base;const off=S.rooms.office;room(y,'#ffcf3a','#f0e6d6',off.furn.filter(f=>f.k!='rug').slice(0,4));label(x0-d-10*s,y-fh+4*s,'G · MANAGER OFFICE + FRONT DESK');
 btn(x0+12*s,y-50*s,124*s,30*s,'ENTER OFFICE','#38a0ff',()=>enterRoom('office'));
 if(c.apps)btn(x0+146*s,y-50*s,200*s,30*s,'👥 VIEW 3 APPLICANTS','#9fff7a',()=>condoAct('apps'));
 else btn(x0+146*s,y-50*s,200*s,30*s,c.ad?'AD POSTED · TOMORROW':'📣 POST AD · 20g','#ffd84a',()=>condoAct('ad'),c.ad);
 for(let f=1;f<=c.floors;f++){y-=fh+6*s;const tn=c.tenants[f-1],R=S.rooms['f'+f];room(y,['#5cc85a','#3a9aff','#ff9a3a','#ff5a5a','#c86aff','#38c8c0'][(f-1)%6],'#e6dccb',R.furn.filter(q=>q.k!='rug').slice(0,4),tn);label(x0-d-10*s,y-fh+4*s,`${f}F · ${tn?tn.toUpperCase()+' · RENT '+rentOf(f-1)+'g · ☺ '+happiness(tn)+'%':'VACANT'}`,tn?'#9fff7a':'#ffd84a');
  btn(x0+12*s,y-50*s,92*s,30*s,'ENTER','#38a0ff',()=>enterRoom('f'+f));ctx.fillStyle='#2a2238';ctx.font=`bold ${Math.round(11*s)}px sans-serif`;const ms=missing('f'+f);ctx.fillStyle=ms.length?'#c8202a':'#1a7a3a';ctx.fillText(tn?'♥ Lv'+frLv(tn)+' · likes '+likedIn(tn)+' item(s)':ms.length?'⚠ needs '+ms.map(r=>REQ[r]).join(', '):'✅ ready to rent',x0+12*s,y-60*s);}
 y-=fh+6*s;if(c.floors<MAXF){ctx.fillStyle='#d8b888';ctx.fillRect(x0-d,y-fh,fw+d,fh);
  for(let i=0;i<6;i++){ctx.save();ctx.translate(x0+fw/2-d/2,y-fh+12*s+i*fh/6.3);ctx.rotate(i%2?.05:-.04);ctx.fillStyle=i%2?'#a07848':'#c0925a';ctx.fillRect(-fw/2-d/2+6,-7*s,fw+d-12,14*s);ctx.strokeStyle='#5a3a20';ctx.lineWidth=1.5;ctx.strokeRect(-fw/2-d/2+6,-7*s,fw+d-12,14*s);[[-fw/2+14],[fw/2-24]].forEach(([nx])=>{ctx.fillStyle='#555';ctx.beginPath();ctx.arc(nx,0,2.5*s,0,7);ctx.fill();});ctx.restore();}
  for(let i=0;i<fw+d;i+=22*s){ctx.fillStyle=Math.round(i/22/s)%2?'#ffd84a':'#2a2238';ctx.fillRect(x0-d+i,y-8*s,Math.min(22*s,fw+d-i),8*s);}
  ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.strokeRect(x0-d,y-fh,fw+d,fh);
  if(c.building){for(let u=0;u<=4;u++){ctx.fillStyle='#8a8a9a';ctx.fillRect(x0-d+u*(fw+d)/4-2*s,y-fh-12*s,4*s,fh+12*s);}ctx.fillRect(x0-d,y-fh*.5,fw+d,4*s);label(x0+fw/2-140*s,y-fh/2-6*s,`🚧 ${c.floors+1}F UNDER CONSTRUCTION — READY TOMORROW`,'#ff9a3a');}
  else{const cost=renoCost(c.floors+1),ok=canPay(cost);btn(x0+fw/2-170*s,y-fh/2-24*s,320*s,36*s,`🔨 RENOVATE ${c.floors+1}F · ${costStr(cost)}`,ok?'#ff6ab0':'#c86a98',()=>condoAct('reno'));label(x0+fw/2-130*s,y-fh/2+30*s,'LOCKED · each new floor = 1 new tenant','#ffd84a');}
  y-=fh;}
 ctx.fillStyle='#5a4a6a';ctx.beginPath();ctx.moveTo(x0-d-14*s,y);ctx.lineTo(x0+fw+14*s,y);ctx.lineTo(x0+fw,y-16*s);ctx.lineTo(x0-d,y-16*s);ctx.fill();
 ctx.beginPath();ctx.roundRect(x0+fw/2-120*s,y-62*s,220*s,38*s,12*s);ctx.fillStyle='#2a2238';ctx.fill();ctx.shadowColor='#ff6ab0';ctx.shadowBlur=14;ctx.fillStyle='#ff9ad0';ctx.font=`bold ${Math.round(19*s)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('FANTASY CONDO',x0+fw/2-10*s,y-42*s);ctx.shadowBlur=0;ctx.textAlign='left';
 // info card
 const cw=Math.min(220*s,x0-d-30*s);ctx.beginPath();ctx.roundRect(14,96,cw,150*s,14);ctx.fillStyle='rgba(255,255,255,.93)';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.stroke();ctx.textBaseline='top';
 [`🏢 ${c.floors} tenant floor${c.floors>1?'s':''}`,`👥 Tenants ${c.tenants.filter(Boolean).length}/${c.floors}`,`💰 Rent/day ${rentTotal()}g`,c.apps?'📋 3 applicants waiting!':c.ad?'📋 Ad running':'📋 No ad posted','↕ drag / wheel to scroll'].forEach((l,i)=>{ctx.fillStyle=i==4?'#8a8a9a':'#2a2238';ctx.font=`bold ${Math.round((i==4?10:13)*s)}px sans-serif`;ctx.fillText(l,26,106+i*26*s);});ctx.textBaseline='alphabetic';}
function drawApps(t){ctx.setTransform(1,0,0,1,0,0);const W=cv.width,H=cv.height;btnList=[];const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#ffd8ec');g.addColorStop(1,'#c8d8ff');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='rgba(255,255,255,.25)';for(let i=-H;i<W;i+=46){ctx.beginPath();ctx.moveTo(i,H);ctx.lineTo(i+H,0);ctx.lineTo(i+H+18,0);ctx.lineTo(i+18,H);ctx.fill();}
 const apps=S.condo.apps||[],s=Math.min(1.25,Math.max(.62,Math.min(W/1100,H/640)));
 ctx.font=`bold italic ${Math.round(22*s)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#2a2238';ctx.fillText('📣 APPLICANTS · CHOOSE ONE TENANT',W/2,Math.max(70,58*s+20));
 const cw=Math.min(300*s,(W-80)/3),ch=Math.min(H-150*s,470*s),gap=Math.min(24*s,(W-cw*3)/4),x0=(W-cw*3-gap*2)/2,y0=Math.max(92,58*s+44);
 apps.forEach((a,i)=>{const x=x0+i*(cw+gap),y=y0,c=CHARS[a.n];ctx.beginPath();ctx.roundRect(x,y,cw,ch,18*s);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=3;ctx.stroke();
  ctx.save();ctx.beginPath();ctx.roundRect(x+6,y+6,cw-12,ch*.42,14*s);ctx.clip();const bg=ctx.createLinearGradient(0,y,0,y+ch*.42);bg.addColorStop(0,['#ffe0f0','#e0ecff','#e8ffe0'][i]);bg.addColorStop(1,'#ffffff');ctx.fillStyle=bg;ctx.fillRect(x,y,cw,ch);
  const p=portrait(a.n,'smile'),ph=ch*.5,pw=ph*420/520;ctx.drawImage(p,x+cw/2-pw/2,y+6,pw,ph);ctx.restore();
  let ty=y+ch*.42+20*s;ctx.fillStyle='#2a2238';ctx.font=`bold ${Math.round(18*s)}px sans-serif`;ctx.fillText(a.n.toUpperCase(),x+cw/2,ty);ty+=20*s;
  ctx.font=`italic ${Math.round(12*s)}px sans-serif`;ctx.fillStyle='#6a5a7a';ctx.fillText(c.pers,x+cw/2,ty);ty+=22*s;
  ctx.font=`bold ${Math.round(11*s)}px sans-serif`;ctx.fillStyle='#2a2238';ctx.fillText('LIKES',x+cw/2,ty);ty+=16*s;
  const chips=[...c.likes.map(k=>FTHEME[k]),'★ '+FURN[c.fav].n];ctx.font=`bold ${Math.round(11*s)}px sans-serif`;const ws=chips.map(q=>ctx.measureText(q).width+16*s),tot=ws.reduce((a,b)=>a+b,0)+(chips.length-1)*5;let cx=x+cw/2-tot/2;
  chips.forEach((q,j)=>{ctx.beginPath();ctx.roundRect(cx,ty-10*s,ws[j],20*s,10*s);ctx.fillStyle=j==chips.length-1?'#ffd84a':'#e6e0f4';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#2a2238';ctx.fillText(q,cx+ws[j]/2,ty+1);cx+=ws[j]+5;});ty+=24*s;
  ctx.font=`${Math.round(11*s)}px sans-serif`;ctx.fillStyle='#6a5a7a';ctx.fillText(c.job?'Works at the '+PLACES[c.job].n:'Free spirit · no job',x+cw/2,ty);ty+=24*s;
  ctx.font=`bold ${Math.round(16*s)}px sans-serif`;ctx.fillStyle='#1a8a3a';ctx.fillText('Rent offer '+a.offer+'g/day',x+cw/2,ty);ty+=26*s;
  const q='“'+c.talks[0][0].t+'”';ctx.font=`italic ${Math.round(12*s)}px sans-serif`;ctx.fillStyle='#4a3a5a';let line='',ly2=ty;for(const wd of q.split(' ')){if(ctx.measureText(line+wd).width>cw-34*s){if(ly2<y+ch-70*s)ctx.fillText(line,x+cw/2,ly2);ly2+=16*s;line='';}line+=wd+' ';}if(ly2<y+ch-70*s)ctx.fillText(line,x+cw/2,ly2);
  const bw=cw*.7,bh=34*s,bx=x+cw/2-bw/2,by=y+ch-bh-12*s;ctx.beginPath();ctx.roundRect(bx,by,bw,bh,bh/2);ctx.fillStyle='#ff6ab0';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.font=`bold ${Math.round(14*s)}px sans-serif`;ctx.fillText('CHOOSE '+a.n.split(' ').pop().toUpperCase(),bx+bw/2,by+bh/2+1);
  btnList.push({r:[bx,by,bw,bh],f:()=>condoAct('pick',i)});});
 const lw=180*s,lh=30*s,lx=W/2-lw/2,ly=Math.min(H-lh-8,y0+ch+12*s);ctx.beginPath();ctx.roundRect(lx,ly,lw,lh,lh/2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#2a2238';ctx.stroke();ctx.fillStyle='#2a2238';ctx.font=`bold ${Math.round(12*s)}px sans-serif`;ctx.fillText('Decline all',W/2,ly+lh/2+1);btnList.push({r:[lx,ly,lw,lh],f:()=>condoAct('decline')});
 ctx.textAlign='left';ctx.textBaseline='alphabetic';}
// ---------- dialogue ----------
const dlg={on:false,lines:[],i:0,ch:0,name:'',hidden:false};
function startDialogue(name,lines){Object.assign(dlg,{on:true,lines,i:0,ch:0,name,hidden:false});$('dlg').style.display='block';$('dlgName').textContent=name.toUpperCase();showLine();for(const k in keys)keys[k]=0;}
function showLine(){const l=dlg.lines[dlg.i];const pc=$('dlgPortrait'),g=pc.getContext('2d');g.clearRect(0,0,pc.width,pc.height);g.drawImage(portrait(dlg.name,l.e),0,0,pc.width,pc.height);dlg.ch=0;$('dlgText').textContent='';$('dlgBox').style.visibility='visible';dlg.hidden=false;}
function dlgNext(){const l=dlg.lines[dlg.i];if(dlg.ch<l.t.length){dlg.ch=l.t.length;$('dlgText').textContent=l.t;return;}dlg.i++;if(dlg.i>=dlg.lines.length)dlgClose();else showLine();}
function dlgClose(){dlg.on=false;$('dlg').style.display='none';}
$('dlgNext').onclick=e=>{e.stopPropagation();dlgNext();};$('dlgSkip').onclick=e=>{e.stopPropagation();dlgClose();};$('dlgHide').onclick=e=>{e.stopPropagation();dlg.hidden=true;$('dlgBox').style.visibility='hidden';};
$('dlg').onclick=()=>{if(dlg.hidden){dlg.hidden=false;$('dlgBox').style.visibility='visible';}else dlgNext();};
function gainFr(n,v){const f=fr(n),before=frLv(n);f.p+=v;S.hearts+=v;if(frLv(n)>before)toast(`♥ ${n} friendship Lv${frLv(n)}! A new scene is unlocked`);else toast(`♥ +${v} friendship with ${n}`);sfx(990);}
function talkTenant(n){const c=CHARS[n],f=fr(n),lv=frLv(n);const conv=[...c.talks[(S.day+f.p)%c.talks.length]];const t=TN[n];
 if(t&&!t.inRoom&&t.place!='walking')conv.unshift(L(`Oh, hi! Fancy meeting you at the ${PLACES[t.place].n}.`,'surprised'));
 if(happiness(n)<50)conv.push(L(`My room could use something ${FTHEME[c.likes[0]]}... maybe a ${FURN[c.fav].n}?`));
 if(f.scene<lv)conv.push(L('Hey, want to hang out sometime? I have something to show you!','happy'));
 startDialogue(n,conv);if(f.talk!=S.day){f.talk=S.day;gainFr(n,1);}}
window.hangOut=n=>{const t=TN[n],f=fr(n);if(!t||t.inRoom&&!area.room||t.place=='walking'){toast(`${n} is busy right now`);return;}if(f.hang==S.day){toast(`You already hung out with ${n} today`);talkTenant(n);return;}
 const place=area.room?'home':t.place,cost=place=='cafe'?6:place=='restaurant'?12:0;if(S.gold<cost){toast('Not enough gold');return;}S.gold-=cost;f.hang=S.day;
 const lv=frLv(n);let lines;if(f.scene<lv&&f.scene<CHARS[n].scenes.length){lines=CHARS[n].scenes[f.scene];f.scene++;toast(`✨ Friendship scene ${f.scene}/3 with ${n}`);}
 else lines=[L(place=='cafe'?'Cocoa break! Thanks for the treat.':place=='restaurant'?'Mmm, this is so good. Thanks for dinner!':place=='park'?'Nice day for a walk in the park, huh?':place=='home'?'Thanks for visiting my room!':'It is nice just hanging out like this.','happy'),L(lv<1?'We should do this again!':'You are a good friend, manager.')];
 S.min+=60;startDialogue(n,lines);gainFr(n,3);save(1);};
function nearNpc(){let best=null,bd=1.9;area.npcs.forEach(n=>{const d=Math.hypot(n.px/16-ptx(),n.py/16-pty());if(d<bd){bd=d;best={n:n.n,stat:n};}});tenantsHere().forEach(t=>{const d=Math.hypot(t.px-ptx(),t.py-pty());if(d<bd){bd=d;best={n:t.n};}});return best;}
function talkNearest(){const n=nearNpc();if(!n)return;if(n.stat){const c=CHARS[n.n];startDialogue(n.n,c.talks[n.stat.li++%c.talks.length]);}else{selT=n.n;talkTenant(n.n);}}
// ---------- feedback / day cycle ----------
let toasts=[],fade=0,parts=[],banner=null,saveT=0,walkT=0,moving=false;
function toast(t){toasts.push({t,life:2.8});if(toasts.length>3)toasts.shift();}
let actx=null;function sfx(f){try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.type='triangle';o.frequency.value=f;g.gain.value=.05;g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+.18);o.connect(g).connect(actx.destination);o.start();o.stop(actx.currentTime+.2);}catch(e){}}
window.sleep=(passed)=>{closeMenu();S.day++;S.min=7*60;const c=S.condo,rent=rentTotal();S.gold+=rent;const msg=[];if(rent)msg.push(`Rent collected: +${rent}g`);
 if(c.building){c.building=0;c.floors++;c.tenants.push(null);const n=c.floors;S.rooms['f'+n]={lay:'unit',furn:[]};msg.push(`Floor ${n} is finished! Furnish it before renting`);}
 if(c.ad&&!c.apps){c.apps=makeApps();c.ad=0;if(c.apps.length)msg.push('3 applicants are waiting at the front desk!');}
 follow=null;for(const n in TN)TN[n].goal=null;syncTenants(true);goArea('room:office',[3,4]);fade=1.2;save(1);toast(passed?'You dozed off... Day '+S.day:'Good morning! Day '+S.day);msg.forEach(toast);};
// ---------- geometry / pathing ----------
const ptx=()=>S.px/16,pty=()=>S.py/16;
let cam={x:0,y:0},Z=2;
function screenToTile(sx,sy){const wx=(sx-cv.width/2)/Z+cam.x,wy=(sy-cv.height/2)/Z+cam.y;return[Math.floor((wx/16+wy/8)/2),Math.floor((wy/8-wx/16)/2)];}
function walkableOn(a,x,y){return!(x<0||y<0||x>=a.cols||y>=a.rows||a.solid[y][x]);}
const walkable=(x,y)=>walkableOn(area,x,y);
function bfsOn(a,sx,sy,goal){const key=(x,y)=>y*999+x,prev=new Map([[key(sx,sy),null]]),q=[[sx,sy]];while(q.length){const [x,y]=q.shift();if(goal(x,y)){const p=[];let c=[x,y];while(c){p.unshift(c);c=prev.get(key(c[0],c[1]));}return p;}
 for(const [i,j] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const nx=x+i,ny=y+j;if(!walkableOn(a,nx,ny)||prev.has(key(nx,ny)))continue;if(i&&j&&(!walkableOn(a,x+i,y)||!walkableOn(a,x,y+j)))continue;prev.set(key(nx,ny),[x,y]);q.push([nx,ny]);if(prev.size>5000)return null;}}return null;}
const bfs=(sx,sy,goal)=>bfsOn(area,sx,sy,goal);
function walkTo(tx,ty){const sx=Math.floor(ptx()),sy=Math.floor(pty()),it=interactAt(tx,ty),target=walkable(tx,ty)&&(!it||it=='exit');
 if(it&&it!='exit'&&Math.max(Math.abs(sx-tx),Math.abs(sy-ty))<=1){faceTo(tx,ty);act(tx,ty);return;}
 const p=bfs(sx,sy,target&&!it?(x,y)=>x==tx&&y==ty:(x,y)=>Math.max(Math.abs(x-tx),Math.abs(y-ty))<=(it=='exit'?0:1));if(!p){toast("Can't reach there");return;}path=p.slice(1);pendingAct=it?[tx,ty]:null;
 if(!path.length){path=null;if(pendingAct){faceTo(tx,ty);act(tx,ty);pendingAct=null;}}}
function faceTo(tx,ty){const dx=tx+.5-ptx(),dy=ty+.5-pty(),l=Math.hypot(dx,dy)||1;S.fx=dx/l;S.fy=dy/l;}
// ---------- interaction ----------
const bldAt=(tx,ty)=>BLDS.find(b=>tx>=b.x&&ty>=b.y&&tx<b.x+b.w&&ty<b.y+b.d);
function furnAt(tx,ty){return area.room&&S.rooms[area.room].furn.find(f=>tx>=f.x&&ty>=f.y&&tx<f.x+FURN[f.k].w&&ty<f.y+FURN[f.k].d&&!FURN[f.k].flat);}
function interactAt(tx,ty){const a=area;if(a.npcs.some(n=>Math.floor(n.px/16)==tx&&Math.floor(n.py/16)==ty))return'npc';
 if(a.room){const f=furnAt(tx,ty);if(f&&FURN[f.k].tag)return'furn';if(tx==a.exit[0]&&ty==a.exit[1])return'exit';return null;}
 if(bldAt(tx,ty))return'bld';return null;}
function facingTile(){return[Math.floor(ptx()+S.fx*.85),Math.floor(pty()+S.fy*.85)];}
function useAction(){if(decor){placeFurn();return;}const nn=nearNpc();if(nn){talkNearest();return;}const [fx,fy]=facingTile();if(interactAt(fx,fy)){act(fx,fy);return;}
 const cx=Math.floor(ptx()),cy=Math.floor(pty());for(const [i,j] of [[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]]){const k=interactAt(cx+i,cy+j);if(k&&k!='exit'){faceTo(cx+i,cy+j);act(cx+i,cy+j);return;}}toast('Nothing here');}
function act(tx,ty){const a=area,kind=interactAt(tx,ty);
 if(kind=='npc'){const n=a.npcs.find(n=>Math.floor(n.px/16)==tx&&Math.floor(n.py/16)==ty),c=CHARS[n.n];startDialogue(n.n,c.talks[n.li++%c.talks.length]);return;}
 if(kind=='exit'){back();return;}if(kind=='furn'){furnUse(furnAt(tx,ty));return;}
 if(kind=='bld'){const b=bldAt(tx,ty);if(b.id=='condo'){showCondo=true;condoScroll=-1;}else if(b.id=='fshop')furnShop();else if(b.id=='cafe'||b.id=='restaurant')eatery(b.id);else{const here=Object.values(TN).filter(t=>t.place=='studio');openMenu(`<h3>🎨 STUDIO</h3><p>A shared creative workspace. ${here.length?'Working here now: '+here.map(t=>t.n).join(', '):'Nobody is working right now.'}</p>`+here.map(t=>`<button onclick="closeMenu();hangOut('${t.n}')">Bring ${t.n} a snack break · friendship +3</button>`).join(''));}return;}}
function furnUse(f){if(FURN[f.k].req=='bed'&&area.room=='office'){openMenu(`<h3>BED</h3><p>Sleep until morning? Rent is collected at dawn.</p><button onclick="sleep()">Sleep (save)</button>`);return;}
 if(f.k=='frontdesk'){showCondo=true;condoScroll=-1;return;}
 const msgs={tv:'You watch a cozy cooking show. ♥',fishtank:'The fish wiggle happily. ♥',bathtub:'Bubbles everywhere! So relaxing. ♥',bed:'A neatly made bed.',toilet:'Squeaky clean!',shower:'Fresh and clean. ♥',piano:'You play a little tune. ♪',arcade:'New high score! ♥',games:'One more round... ♥'};const T=FURN[f.k].tag;if(T)f={k:T.toLowerCase()==='bath'?'bathtub':T.toLowerCase()};S.hearts++;toast(msgs[f.k]||'Nice!');sfx(880);}
// ---------- decor ----------
function furnGhost(){const k=hold?hold.k:DL()[fsel],F=FURN[k];let x,y;if(ghostAt)[x,y]=ghostAt;else[x,y]=facingTile();return{k,x,y,w:F.w,d:F.d,F};}
function canFurn(g){const a=area,R=S.rooms[a.room],L=a.lay;if(g.x<0||g.y<0||g.x+g.w>a.cols||g.y+g.d>a.rows)return'Out of room';
 if(g.F.wall){if(g.y!=0&&g.x!=0)return'Wall decor goes on a tile touching the back wall';const z=zoneOf(L,g.x,g.y);if(z=='wall'||z=='door')return'Not on a doorway';
  for(const f of R.furn)if(FURN[f.k].wall&&f.x==g.x&&f.y==g.y&&(f.v||0)==(g.y==0?0:1))return'Occupied';return'';}
 const zs=new Set();for(let y=g.y;y<g.y+g.d;y++)for(let x=g.x;x<g.x+g.w;x++)zs.add(zoneOf(L,x,y));if(zs.has('wall'))return'Blocked by a wall';if(zs.has('door'))return'Keep the doorway clear';if(zs.size>1)return'Must fit inside one room';
 const z=[...zs][0];if(!g.F.zone.includes(z))return`${g.F.n} belongs in the ${g.F.zone.filter(q=>ZONES[q]).map(q=>ZONES[q]).join(' / ')}`;
 if(g.x<=a.exit[0]&&g.x+g.w>a.exit[0]&&g.y+g.d>a.exit[1])return'Keep the door clear';
 for(const f of R.furn){const F=FURN[f.k];if(F.wall)continue;if(g.x<f.x+F.w&&g.x+g.w>f.x&&g.y<f.y+F.d&&g.y+g.d>f.y&&(!!F.flat==!!g.F.flat))return'Occupied';}
 const px=Math.floor(ptx()),py=Math.floor(pty());if(!g.F.flat&&px>=g.x&&px<g.x+g.w&&py>=g.y&&py<g.y+g.d)return'You are standing there';
 if(!g.F.flat&&a.room!='office'&&tenantsHere().some(t=>t.px>=g.x&&t.px<g.x+g.w&&t.py>=g.y&&t.py<g.y+g.d))return'Someone is there';return'';}
function tryPick(tx,ty){const R=S.rooms[area.room];const hit=f=>tx>=f.x&&ty>=f.y&&tx<f.x+FURN[f.k].w&&ty<f.y+FURN[f.k].d&&!FURN[f.k].fixed;const f=R.furn.find(f=>hit(f)&&!FURN[f.k].wall&&!FURN[f.k].flat)||R.furn.find(f=>hit(f)&&FURN[f.k].wall)||R.furn.find(hit);if(!f)return false;R.furn.splice(R.furn.indexOf(f),1);hold=f;refresh();toast('Picked up '+FURN[f.k].n+' — choose a spot, tap again to place');return true;}
function placeFurn(){const R=S.rooms[area.room];const g=furnGhost(),why=canFurn(g);if(why){toast(why);sfx(150);return;}
 if(!hold){if(!(S.finv[g.k]>0)){toast(`No ${g.F.n} in storage — buy one at the Furniture Shop`);sfx(150);return;}S.finv[g.k]--;}
 R.furn.push({k:g.k,x:g.x,y:g.y,v:g.F.wall?(g.y==0?0:1):0});hold=null;ghostAt=null;refresh();sfx(760);const n=area.room=='office'?null:S.condo.tenants[+area.room.slice(1)-1];
 if(area.room!='office'&&rentable(area.room)&&!S.condo.tenants[+area.room.slice(1)-1])toast('✅ Unit is rentable now!');toast(`Placed ${g.F.n}`+(n?` · ${n} happiness ${happiness(n)}%`+(CHARS[n].fav==g.k||CHARS[n].likes.includes(g.F.theme)?' ♥ they love it!':''):''));save(1);}
// ---------- update ----------
function blocked(x,y){const r=.26;return[[x-r,y-r],[x+r,y-r],[x-r,y+r],[x+r,y+r]].some(([p,q])=>!walkable(Math.floor(p),Math.floor(q)));}
function nightF(){const h=(S.min/60)%24;if(h>=6&&h<17)return 0;if(h>=17&&h<20)return(h-17)/3;if(h>=4&&h<6)return 1-(h-4)/2;return 1;}
function update(dt){if(dlg.on){const l=dlg.lines[dlg.i];if(dlg.ch<l.t.length){dlg.ch=Math.min(l.t.length,dlg.ch+dt*45);$('dlgText').textContent=l.t.slice(0,Math.floor(dlg.ch));}return;}
 if(menuOpen()||showMap||showCondo||showApps)return;
 S.min+=dt*4;if(S.min>=26*60){sleep(true);return;}syncTenants(false);stepTenants(dt);
 const sx=(keys.d||keys.arrowright||keys.t_right?1:0)-(keys.a||keys.arrowleft||keys.t_left?1:0),sy=(keys.s||keys.arrowdown||keys.t_down?1:0)-(keys.w||keys.arrowup||keys.t_up?1:0);
 let vx=sx+sy,vy=sy-sx;if(vx||vy){path=null;pendingAct=null;pendingTalk=null;}
 else if(path&&path.length){const [nx,ny]=path[0];vx=nx+.5-ptx();vy=ny+.5-pty();if(Math.hypot(vx,vy)<.1){S.px=(nx+.5)*16;S.py=(ny+.5)*16;path.shift();vx=vy=0;if(!path.length){path=null;if(area.room&&Math.floor(ptx())==area.exit[0]&&Math.floor(pty())==area.exit[1]){back();return;}if(pendingAct){const [ax,ay]=pendingAct;pendingAct=null;faceTo(ax,ay);act(ax,ay);}}}}
 if(pendingTalk&&!path){const t=TN[pendingTalk.n];const w=pendingTalk.what;pendingTalk=null;if(t)approach(t,w);}
 const l=Math.hypot(vx,vy);moving=l>0;if(moving){vx/=l;vy/=l;S.fx=vx;S.fy=vy;const sp=(keys.shift?5.5:3.6)*dt,nx=ptx()+vx*sp,ny=pty()+vy*sp;if(!blocked(nx,pty()))S.px=nx*16;if(!blocked(ptx(),ny))S.py=ny*16;walkT+=dt;
  if(!path&&area.room&&Math.floor(ptx())==area.exit[0]&&Math.floor(pty())==area.exit[1]){back();return;}}
 area.npcs.forEach(n=>{n.t-=dt;if(n.t<=0){n.t=1+Math.random()*2.5;if(Math.random()<.5)n.dx=n.dy=0;else{const q=Math.floor(Math.random()*4);n.dx=[1,-1,0,0][q];n.dy=[0,0,1,-1][q];n.face=['right','left','down','up'][q];}}
  const nx=n.px+n.dx*14*dt,ny=n.py+n.dy*14*dt,tx=Math.floor(nx/16),ty=Math.floor(ny/16);if(walkable(tx,ty)&&Math.abs(nx-n.hx)<30&&Math.abs(ny-n.hy)<30&&Math.hypot(nx-S.px,ny-S.py)>12){n.px=nx;n.py=ny;}else n.t=0;});
 parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vz-=120*dt;p.l-=dt;});parts=parts.filter(p=>p.l>0&&p.z>-2);
 toasts.forEach(t=>t.life-=dt);toasts=toasts.filter(t=>t.life>0);if(banner)banner.l-=dt;if(fade>0)fade-=dt*1.4;saveT+=dt;if(saveT>30){saveT=0;save(1);}}
// ---------- render ----------
let tagRects=[],hotRects=[],bOff=0,sc=1;
function resize(){cv.width=innerWidth;cv.height=innerHeight;sc=Math.max(.72,Math.min(1.4,Math.min(cv.width/1100,cv.height/560)));$('rot').style.display=isTouch&&innerHeight>innerWidth?'flex':'none';}
addEventListener('resize',resize);resize();
function lightList(a){const Ls=[];a.objs.forEach(o=>{const d=OBJ[o.k]||FURN[o.k];(d&&d.light||[]).forEach(([x,y,z,r,c])=>Ls.push([o.x+x,o.y+y,z,r,c]));if(o.k=='condo')for(let f=0;f<=S.condo.floors;f++)Ls.push([o.x+2.5,o.y+4,14+f*26,44,'#ffd88a']);});return Ls;}
function W2S(x,y,z){const [ix,iy]=isoP(x,y,z);return[cv.width/2+(ix-cam.x)*Z,cv.height/2+(iy-cam.y)*Z];}
const PLOOK={body:'#3a8aff',hair:'#6a3a1a',style:'short',hat:'#e8c050',pants:'#2a3a6a'};
function tenantAtScreen(sx,sy){let best=null,bd=1e9;tenantsHere().forEach(t=>{const [x,y]=W2S(t.px,t.py,0),dx=sx-x,dy=sy-y;if(Math.abs(dx)<12*Z&&dy<5*Z&&dy>-34*Z){const d=Math.abs(dx)+Math.abs(dy+14*Z);if(d<bd){bd=d;best=t;}}});return best;}
function drawScene(t,night){const a=area,W=cv.width,H=cv.height;
 const fit=a.room?Math.min(W/((a.cols+a.rows)*TW/2+40),(H-90)/((a.cols+a.rows)*TH/2+66)):0;Z=a.room?Math.max(1.15,Math.min(2.4,fit)):Math.max(1.5,Math.min(3.2,H/(isTouch?220:300)));
 let fx=ptx(),fy=pty();const ft=follow&&TN[follow];if(ft&&!a.room&&!ft.inRoom){fx=ft.px;fy=ft.py;}
 const [px,py]=isoP(fx,fy);let tx2=px,ty2=py-10;if(a.room&&fit>=1.15){const [mx,my]=isoP(a.cols/2,a.rows/2);tx2=mx;ty2=my-26;}
 if(camSnap){cam.x=tx2;cam.y=ty2;camSnap=0;}else{cam.x+=(tx2-cam.x)*.12;cam.y+=(ty2-cam.y)*.12;}
 const sky=ctx.createLinearGradient(0,0,0,H);if(a.room){sky.addColorStop(0,'#3a2c4a');sky.addColorStop(1,'#6a4a6a');}else{sky.addColorStop(0,night>.5?'#141432':'#9ad8ff');sky.addColorStop(1,night>.5?'#2a1a4a':'#e8f6ff');}
 ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 if(a.room){ctx.fillStyle='rgba(255,255,255,.05)';for(let i=-H;i<W;i+=40){ctx.beginPath();ctx.moveTo(i,H);ctx.lineTo(i+H,0);ctx.lineTo(i+H+16,0);ctx.lineTo(i+16,H);ctx.fill();}}
 ctx.setTransform(Z,0,0,Z,W/2-cam.x*Z,H/2-cam.y*Z);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 const gc=groundOf(a);ctx.drawImage(gc,-a.gox,-a.goy,gc.width/RS,gc.height/RS);
 if(!a.room)for(let i=0;i<9;i++){const x=4+i%3,y=17+Math.floor(i/3),[cx,cy]=isoP(x+.5,y+.5);ctx.strokeStyle=`rgba(255,255,255,${.25+.3*Math.sin(t*2+i)})`;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(cx-4,cy);ctx.quadraticCurveTo(cx,cy-1.5,cx+4,cy);ctx.stroke();}
 const Dr=[];a.objs.forEach(o=>{const F=FURN[o.k];Dr.push({k:o.x+o.w/2+o.y+o.d/2-(F&&F.flat?50:F&&F.wall?45:0),f:()=>{if(o.k=='condo')drawSprite(ctx,condoSprite(S.condo.floors,S.condo.building),o.x,o.y);else drawSprite(ctx,spriteFor(o.k,o.v||0),o.x,o.y);}});});
 a.npcs.forEach(n=>Dr.push({k:n.px/16+n.py/16,f:()=>{const [x,y]=isoP(n.px/16,n.py/16);chibi(ctx,x,y,{...n.look,face:n.face},t+n.px,!!(n.dx||n.dy));}}));
 tenantsHere().forEach(tn=>Dr.push({k:tn.px+tn.py,f:()=>{const [x,y]=isoP(tn.px,tn.py);if(selT==tn.n){ell(ctx,x,y,9+Math.sin(t*5),4.5,null,follow==tn.n?'#ff6ab0':'#ffd84a',1.6);}const T=TN[tn.n];chibi(ctx,x,y,{...CHARS[tn.n].look,face:T&&T.path?T.face:'down'},t*1.3+tn.px,!!(T&&T.path));}}));
 const pface=Math.abs(S.fx-S.fy)>Math.abs(S.fx+S.fy)?(S.fx>S.fy?'right':'left'):(S.fx+S.fy>0?'down':'up');
 Dr.push({k:ptx()+pty(),f:()=>{const [x,y]=isoP(ptx(),pty());chibi(ctx,x,y,{...PLOOK,face:pface},walkT,moving);}});
 Dr.sort((p,q)=>p.k-q.k).forEach(d=>d.f());
 parts.forEach(p=>{const [x,y]=isoP(p.x,p.y,p.z);ell(ctx,x,y,1.3,1.3,p.c,null);});
 if(path&&path.length){const [gx,gy]=path[path.length-1],[cx,cy]=isoP(gx+.5,gy+.5);ell(ctx,cx,cy,6+Math.sin(t*6),3+Math.sin(t*6)*.5,null,'#ffffff',1.2);}
 if(decor){const g=furnGhost(),ok=!canFurn(g)&&(hold||S.finv[g.k]>0);ctx.globalAlpha=.5;poly(ctx,[isoP(g.x,g.y),isoP(g.x+g.w,g.y),isoP(g.x+g.w,g.y+g.d),isoP(g.x,g.y+g.d)],ok?'#3dff9a':'#ff5070','#fff',1.2);ctx.globalAlpha=.75;drawSprite(ctx,spriteFor(g.k),g.x,g.y);ctx.globalAlpha=1;}
 const nf=a.room?night*.15:night;ctx.setTransform(1,0,0,1,0,0);if(nf>0){ctx.fillStyle=`rgba(24,16,70,${.5*nf})`;ctx.fillRect(0,0,W,H);}
 ctx.setTransform(Z,0,0,Z,W/2-cam.x*Z,H/2-cam.y*Z);ctx.globalCompositeOperation='lighter';const ga=a.room?.25+.3*night:.06+.9*night;
 lightList(a).forEach(([x,y,z,r,c])=>{const [sx,sy]=isoP(x,y,z);ctx.globalAlpha=ga*.85;ctx.drawImage(glowS(c),sx-r,sy-r*.75,r*2,r*1.5);});ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 tagRects=[];ctx.setTransform(1,0,0,1,0,0);
 const tag=(x,y,z,label,stars,tx,ty,col='rgba(50,50,66,.93)',small)=>{const [sx,sy]=W2S(x,y,z);ctx.font=`bold ${Math.round((small?10:11)*sc)}px sans-serif`;const w=ctx.measureText(label).width+(small?14:24)*sc,h=(small?17:21)*sc;ctx.beginPath();ctx.roundRect(sx-w/2,sy-h,w,h,h/2);ctx.fillStyle=col;ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,sx,sy-h/2+.5);ctx.beginPath();ctx.moveTo(sx-4,sy);ctx.lineTo(sx,sy+5);ctx.lineTo(sx+4,sy);ctx.fillStyle=col;ctx.fill();
  if(stars!=null){ctx.font=`${Math.round(10*sc)}px sans-serif`;for(let i=0;i<5;i++){ctx.fillStyle=i<stars?'#ffd84a':'#6a6a7a';ctx.fillText('★',sx-18*sc+i*9*sc,sy+10*sc);}}if(tx!=null)tagRects.push({r:[sx-w/2,sy-h,w,h],x:tx,y:ty});};
 if(a.room){S.rooms[a.room].furn.forEach(f=>{const F=FURN[f.k];if(F.tag)tag(f.x+F.w/2,f.y+F.d/2,F.h+6,F.tag,F.comfort?Math.min(5,F.comfort+1):null,f.x,f.y);});tag(a.exit[0]+.5,a.exit[1]+.5,10,'EXIT',null,a.exit[0],a.exit[1]);
  a.lay.zones.forEach(([z,zx,zy,w,h])=>{const [sx,sy]=W2S(zx+w/2,zy+h/2,0);ctx.font=`bold ${Math.round(10*sc)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.globalAlpha=.85;const tw=ctx.measureText(ZONES[z]).width+16;ctx.beginPath();ctx.roundRect(sx-tw/2,sy-9*sc,tw,18*sc,9*sc);ctx.fillStyle=ZCOL[z];ctx.fill();ctx.fillStyle='#fff';ctx.fillText(ZONES[z].toUpperCase(),sx,sy+.5);ctx.globalAlpha=1;});}
 else{tag(CONDO.x+2.5,CONDO.y+4,104+(S.condo.floors+S.condo.building)*26,'CONDO',Math.min(5,S.condo.floors),CONDO.door[0],CONDO.door[1]-1);
  BLDS.forEach(b=>{if(b.id!='condo')tag(b.x+b.w/2,b.y+b.d/2,b.id=='studio'?66:62,PLACES[b.id].n.toUpperCase(),null,b.door[0],b.door[1]-1);});
  tag(PLACES.park.tag[0],PLACES.park.tag[1],30,'🌳 CITY PARK',null,7,17,'rgba(40,120,60,.93)');tag(PLACES.plaza.tag[0],PLACES.plaza.tag[1],46,'⛲ TOWN PLAZA',null,null,null,'rgba(40,90,150,.93)');}
 tenantsHere().forEach(tn=>{const T=TN[tn.n];tag(tn.px,tn.py,40,(follow==tn.n?'👁 ':'')+tn.n+' '+'♥'.repeat(frLv(tn.n)),null,null,null,selT==tn.n?'rgba(255,106,176,.95)':'rgba(255,140,60,.9)',1);});}
function drawHUD(t){ctx.setTransform(1,0,0,1,0,0);const W=cv.width,H=cv.height;hotRects=[];
 if(area.room&&area.room!='office'&&!dlg.on){const id=area.room,ms=missing(id),rd=roomsDone(id),n=S.condo.tenants[+id.slice(1)-1],k=sc*.9,x=10,y=Math.round(84*Math.min(1,sc)+6),w=190*k,lh=15*k;const lines=[[ms.length?'⚠ NOT RENTABLE':'✅ RENTABLE',ms.length?'#e8282a':'#1a9a3a'],...(ms.length?[['Needs: '+ms.map(r=>REQ[r]).join(', '),'#e8282a']]:[]),...rd.map(([z,a,b])=>[`${a==b?'★':'·'} ${ZONES[z]} ${a}/${b}`,a==b?'#1a9a3a':'#2a2238']),...(n?[[`☺ ${n} happiness ${happiness(n)}%`,'#c0306a']]:[])];
  ctx.textAlign='left';ctx.beginPath();ctx.roundRect(x,y,w,lines.length*lh+12*k,10);ctx.fillStyle='rgba(255,255,255,.93)';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.stroke();ctx.textBaseline='top';lines.forEach(([t2,col],i)=>{ctx.fillStyle=col;ctx.font=`bold ${Math.round((i?10.5:12)*k)}px sans-serif`;ctx.fillText(t2,x+8,y+6*k+i*lh);});ctx.textBaseline='alphabetic';}
 const s=Math.round((isTouch?38:44)*sc),n=7,hx=Math.round((W-n*(s+6))/2),hy=H-s-12;
 if(decor){ctx.beginPath();ctx.roundRect(hx-8,hy-8,n*(s+6)+10,s+16,14);ctx.fillStyle='rgba(42,34,56,.85)';ctx.fill();ctx.strokeStyle='#9fff7a';ctx.lineWidth=2;ctx.stroke();
  bOff=Math.max(0,Math.min(DL().length-n,fsel-3));for(let i=0;i<n;i++){const id=DL()[i+bOff];if(!id)break;const x=hx+i*(s+6),sel=i+bOff==fsel,own=S.finv[id]||0;hotRects.push([x,hy,s,s]);ctx.beginPath();ctx.roundRect(x,hy,s,s,9);ctx.fillStyle=sel?'#fff4d0':'#f4f0f8';ctx.fill();ctx.strokeStyle=sel?'#ffb43a':'#c8c0d8';ctx.lineWidth=sel?3:1.5;ctx.stroke();
   ctx.globalAlpha=own?1:.35;const sp=spriteFor(id),k=Math.min((s-6)/(sp.cv.width/RS),(s-6)/(sp.cv.height/RS)),w=sp.cv.width/RS*k,h=sp.cv.height/RS*k;ctx.drawImage(sp.cv,x+(s-w)/2,hy+(s-h)/2,w,h);ctx.globalAlpha=1;
   ctx.fillStyle='#2a2238';ctx.font=`bold ${Math.round(10*sc)}px sans-serif`;ctx.textAlign='right';ctx.fillText('×'+own,x+s-3,hy+s-4);ctx.textAlign='left';}
  const F=FURN[hold?hold.k:DL()[fsel]],nm=area.room=='office'?null:S.condo.tenants[+area.room.slice(1)-1],love=nm&&(CHARS[nm].fav==(hold?hold.k:DL()[fsel])||CHARS[nm].likes.includes(F.theme));
  const txt=hold?`Moving ${F.n} — tap a spot, tap again to place`:`${F.n} · ${FTHEME[F.theme]} · in storage ${S.finv[DL()[fsel]]||0}${love?' · ♥ '+nm+' likes this':''}`;
  ctx.font=`bold ${Math.round(12*sc)}px sans-serif`;const tw=ctx.measureText(txt).width+28;ctx.beginPath();ctx.roundRect(W/2-tw/2,hy-42*sc,tw,26*sc,13*sc);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=love?'#c0306a':'#2a2238';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,W/2,hy-29*sc);}
 ctx.textAlign='center';ctx.textBaseline='middle';const tb=decor?hy-54*sc:H-20*sc;ctx.font=`bold ${Math.round(12*sc)}px sans-serif`;
 toasts.forEach((tt,i)=>{const j=toasts.length-1-i;ctx.globalAlpha=Math.min(1,tt.life);const w=ctx.measureText(tt.t).width+24,y=tb-(j+1)*26*sc;ctx.beginPath();ctx.roundRect(W/2-w/2,y-11*sc,w,22*sc,11*sc);ctx.fillStyle='rgba(42,34,56,.9)';ctx.fill();ctx.fillStyle='#fff';ctx.fillText(tt.t,W/2,y);});ctx.globalAlpha=1;
 const ft=follow&&TN[follow];if(ft){const txt=`👁 FOLLOWING ${ft.n.toUpperCase()} · ${ft.place=='walking'?'walking to '+PLACES[ft.dest].n:PLACES[ft.place].n}`;ctx.font=`bold ${Math.round(13*sc)}px sans-serif`;const w=ctx.measureText(txt).width+30;ctx.beginPath();ctx.roundRect(W/2-w/2,64*sc,w,28*sc,14*sc);ctx.fillStyle='#ff6ab0';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.fillText(txt,W/2,78*sc);}
 if(banner&&banner.l>0&&!ft){ctx.globalAlpha=Math.min(1,banner.l);ctx.font=`bold ${Math.round(20*sc)}px sans-serif`;const w=ctx.measureText(banner.t).width+50;ctx.beginPath();ctx.roundRect(W/2-w/2,H*.22-19*sc,w,38*sc,19*sc);ctx.fillStyle='rgba(255,255,255,.92)';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#2a2238';ctx.fillText(banner.t.toUpperCase(),W/2,H*.22);ctx.globalAlpha=1;}
 ctx.textAlign='left';ctx.textBaseline='alphabetic';if(fade>0){ctx.fillStyle=`rgba(0,0,0,${Math.min(1,fade)})`;ctx.fillRect(0,0,W,H);}}
// ---------- town map ----------
let mapThumb=null,mapKey='';
function townThumb(){const key=S.condo.floors+'_'+S.condo.building;if(mapThumb&&mapKey==key)return mapThumb;const keep=area;area=TOWN;const gc=groundOf(TOWN);area=keep;const c=document.createElement('canvas');c.width=gc.width/RS;c.height=gc.height/RS;const g=c.getContext('2d');g.drawImage(gc,0,0,c.width,c.height);g.save();g.translate(TOWN.gox,TOWN.goy);
 [...TOWN.objs].sort((p,q)=>p.x+p.w/2+p.y+p.d/2-q.x-q.w/2-q.y-q.d/2).forEach(o=>{if(o.k=='condo')drawSprite(g,condoSprite(S.condo.floors,S.condo.building),o.x,o.y);else drawSprite(g,spriteFor(o.k,o.v||0),o.x,o.y);});g.restore();mapKey=key;return mapThumb=c;}
function drawMap(t){ctx.setTransform(1,0,0,1,0,0);const W=cv.width,H=cv.height;btnList=[];ctx.fillStyle='#e8f0d8';ctx.fillRect(0,0,W,H);ctx.fillStyle='#d8e4c4';for(let i=0;i<W;i+=28)ctx.fillRect(i,0,1,H);for(let j=0;j<H;j+=28)ctx.fillRect(0,j,W,1);
 const th=townThumb(),k=Math.min((W-60)/th.width,(H-90)/th.height),mw=th.width*k,mh=th.height*k,mx=(W-mw)/2,my=(H-mh)/2+18;
 ctx.beginPath();ctx.roundRect(mx-10,my-10,mw+20,mh+20,20);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=3;ctx.stroke();ctx.drawImage(th,mx,my,mw,mh);
 const M=(x,y,z=0)=>{const [ix,iy]=isoP(x,y,z);return[mx+(ix+TOWN.gox)*k,my+(iy+TOWN.goy)*k];};
 ctx.font=`bold italic ${Math.round(20*sc)}px sans-serif`;ctx.fillStyle='#2a2238';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🗺 LUMEN TOWN',W/2,24*sc+6);
 const pin=(x,y,label,col,f)=>{ctx.font=`bold ${Math.round(12*sc)}px sans-serif`;const w=ctx.measureText(label).width+20*sc,h=24*sc;ctx.beginPath();ctx.roundRect(x-w/2,y-h,w,h,h/2);ctx.fillStyle=col;ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.fillText(label,x,y-h/2+1);btnList.push({r:[x-w/2,y-h,w,h],f});};
 const go=(p,pos)=>()=>{showMap=false;if(area.room)goArea('town',pos);else{S.px=(pos[0]+.5)*16;S.py=(pos[1]+.5)*16;path=null;camSnap=1;}fade=.8;toast('→ '+p);};
 let [x,y]=M(4.5,4,70);y=Math.max(y,my+30);pin(x,y,'🏢 CONDO','#ff6ab0',()=>{showMap=false;showCondo=true;condoScroll=-1;});
 BLDS.forEach(b=>{if(b.id=='condo')return;[x,y]=M(b.x+b.w/2,b.y+b.d/2,64);pin(x,y,PLACES[b.id].n.toUpperCase(),{cafe:'#c87a4a',restaurant:'#e8404a',fshop:'#2a8ad8',studio:'#8a6aff'}[b.id],go(PLACES[b.id].n,[b.door[0],b.door[1]+1]));});
 [x,y]=M(7,17,20);pin(x,y,'🌳 CITY PARK','#3a9a4a',go('City Park',[7,16]));[x,y]=M(17.5,16,40);pin(x,y,'⛲ PLAZA','#3a7ac8',go('Town Plaza',[17,18]));
 // tenants as portrait bubbles
 Object.values(TN).forEach((tn,i)=>{const [cx,cy]=tn.inRoom?M(2.6+i*.9,6,30+i*10):M(tn.px,tn.py,0);const r=15*sc;ctx.save();ctx.beginPath();ctx.arc(cx,cy-r-6,r,0,7);ctx.fillStyle='#fff';ctx.fill();ctx.clip();ctx.drawImage(portrait(tn.n,'smile'),cx-r*1.3,cy-r*2.2-6,r*2.6,r*3.2);ctx.restore();
  ctx.beginPath();ctx.arc(cx,cy-r-6,r,0,7);ctx.strokeStyle=follow==tn.n?'#ff6ab0':'#ffb43a';ctx.lineWidth=3;ctx.stroke();ctx.font=`bold ${Math.round(10*sc)}px sans-serif`;ctx.fillStyle='#2a2238';ctx.fillText(tn.n.split(' ')[0],cx,cy+5);
  btnList.push({r:[cx-r,cy-2*r-6,2*r,2*r+12],f:()=>{selT=tn.n;showMap=false;if(!tn.inRoom){if(area.room)goArea('town',[CONDO.door[0],CONDO.door[1]+1]);follow=tn.n;toast('Following '+tn.n);}else toast(`${tn.n} is at home on Floor ${tn.floor}`);}});});
 if(!area.room){[x,y]=M(ptx(),pty());ctx.beginPath();ctx.arc(x,y-4,6+Math.sin(t*5),0,7);ctx.fillStyle='#3a8aff';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#2a2238';ctx.font=`bold ${Math.round(10*sc)}px sans-serif`;ctx.fillText('YOU',x,y+10);}
 ctx.font=`${Math.round(11*sc)}px sans-serif`;ctx.fillStyle='#5a5a6a';ctx.fillText('Tap a place to go there · tap a tenant to FOLLOW them',W/2,H-12);
 const bw=90*sc,bh=30*sc;ctx.beginPath();ctx.roundRect(W-bw-14,10,bw,bh,bh/2);ctx.fillStyle='#ffd84a';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#2a2238';ctx.font=`bold ${Math.round(13*sc)}px sans-serif`;ctx.fillText('CLOSE',W-bw/2-14,10+bh/2+1);btnList.push({r:[W-bw-14,10,bw,bh],f:()=>showMap=false});
 ctx.textAlign='left';ctx.textBaseline='alphabetic';}
// ---------- DOM chrome ----------
let lastTop='';function updateTop(){const h=Math.floor(S.min/60)%24,m=Math.floor(S.min%60/10)*10,ap=h<12?'AM':'PM',hh=(h%12)||12,tm=`DAY ${S.day} · ${hh}:${String(m).padStart(2,'0')} ${ap}`;const c=S.condo;
 const res=`<span class="chip">🏢 ${c.floors}F</span><span class="chip">👥 ${c.tenants.filter(Boolean).length}/${c.floors}</span><span class="chip">💰 ${rentTotal()}g/day</span><span class="chip">🛋 ${Object.values(S.finv).reduce((a,b)=>a+b,0)}</span>`;
 const key=tm+S.gold+S.hearts+res+(area&&area.name);if(key==lastTop)return;lastTop=key;$('timer').textContent=tm;$('gold').textContent=String(S.gold).padStart(8,'0');$('hearts').textContent=S.hearts;$('res').innerHTML=res;$('where').textContent=(area?area.name:'')+' · '+VERSION;}
let lastCard='';function updateButtons(){const modal=showMap||showCondo||showApps||dlg.on;const nn=!modal&&!menuOpen()&&nearNpc();$('talk').classList.toggle('show',!!nn);if(nn)$('talk').textContent='TALK · '+nn.n.split(' ')[0].toUpperCase();
 $('back').classList.toggle('show',!!(area.room||decor||showMap||showCondo||showApps||follow||selT));$('bbuild').textContent=area.room?(decor?'DONE':'DECOR'):'DECOR';document.body.classList.toggle('modal',modal);document.body.classList.toggle('mapopen',showMap||showApps);
 const t=selTenant(),card=$('tcard');if(!t||modal||menuOpen()){card.style.display='none';if(selT&&!TN[selT])selT=null;return;}card.style.display='flex';
 const loc=t.inRoom?'Home · Floor '+t.floor:t.place=='walking'?'Walking to '+PLACES[t.dest].n:'At the '+PLACES[t.place].n,f=fr(t.n),key=t.n+loc+f.p+f.hang+follow+S.day;if(key==lastCard)return;lastCard=key;
 const pc=$('tcPortrait').getContext('2d');pc.clearRect(0,0,80,80);pc.save();pc.beginPath();pc.arc(40,40,38,0,7);pc.clip();pc.fillStyle='#fff4d0';pc.fillRect(0,0,80,80);pc.drawImage(portrait(t.n,'smile'),-8,-6,96,118);pc.restore();
 $('tcName').textContent=t.n;$('tcInfo').innerHTML=`${'♥'.repeat(frLv(t.n))}${'♡'.repeat(5-frLv(t.n))} Lv${frLv(t.n)} · scenes ${f.scene}/3<br>${loc} · ☺ ${happiness(t.n)}%`;
 $('tFollow').textContent=follow==t.n?'STOP':'FOLLOW';$('tHang').classList.toggle('dim',f.hang==S.day);}
let last=performance.now(),T0=0;
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;T0+=dt;update(dt);const night=nightF();
 if(showApps)drawApps(T0);else if(showMap)drawMap(T0);else if(showCondo)drawCondo(T0);else{drawScene(T0,night);drawHUD(T0);}
 updateTop();updateButtons();requestAnimationFrame(frame);}
syncTenants(true);
goArea(S.area.startsWith('room:')&&!S.rooms[S.area.slice(5)]?'town':S.area,[S.px/16-.5,S.py/16-.5]);applyOpt();
if(!loaded)setTimeout(()=>{toast(S.oldSave?'Fantasy Town v0.0.0.8 — a new small town! Old save reset (+150g)':'Welcome to Lumen Town, manager! Tap the CONDO to post an ad');toast(isTouch?'Tap to walk · tap a tenant to FOLLOW':'Click to walk · E use · M map · tap a tenant to FOLLOW');},400);
requestAnimationFrame(frame);
// ---------- test hooks ----------
window.FT={get S(){return S},get TN(){return TN},CHARS,PLACES,act,goArea,enterRoom,walkTo,condoAct,startDialogue,talkTenant,hangOut:window.hangOut,syncTenants,schedule,happiness,rentOf,toggleFollow,frLv,
 setPos:(x,y)=>{S.px=(x+.5)*16;S.py=(y+.5)*16;camSnap=1;},placeFurn,set decor(v){decor=v},set fsel(v){fsel=v},set ghost(v){ghostAt=v},set map(v){showMap=v},set condo(v){showCondo=v},set apps(v){showApps=v},set scroll(v){condoScroll=v},set sel(v){selT=v},set follow(v){follow=v},get follow(){return follow},
 tryPlace:(k,x,y)=>{S.finv[k]=(S.finv[k]||0)+1;hold=null;decor=true;fsel=DL().indexOf(k);ghostAt=[x,y];const why=canFurn(furnGhost());if(!why)placeFurn();else S.finv[k]--;decor=false;return why;},missing,rentable,DL:()=>DL(),
 setTime:h=>{S.min=h*60;syncTenants(true);},fastForward:(h)=>{const steps=Math.round(h*60/4*20);for(let i=0;i<steps;i++){S.min+=0.2;syncTenants(false);stepTenants(.05);}},get area(){return area}};
