'use strict';
// Fantasy Town v0.0.0.7 — isometric condo + village builder. Uses art.js (helpers), iso.js, objects.js, portrait.js, worldmap.js
const VERSION='v0.0.0.7',SAVE='fantasytown_save_v7';
const cv=document.getElementById('c'),ctx=cv.getContext('2d'),menuEl=document.getElementById('menu');
const Q=new URLSearchParams(location.search),$=id=>document.getElementById(id);
const G=0,ROAD=1,WATER=2,SAND=3,GRID=4,CONC=5,SOIL=6,BOARD=7,DIRT=8,ROCK=12,WALL=13,PATH=14,DARKG=15,FL1=20,FL2=21,FL3=22;
const ITEMS={wood:{n:'Wood',p:4,c:'#9a6a3a'},ore:{n:'Ore',p:12,c:'#8fa3c8'},scrap:{n:'Scrap',p:6,c:'#b0a080'},shell:{n:'Shell',p:9,c:'#ffd0e8'},neon:{n:'Neon',p:20,c:'#ff4fd8'},
 fish:{n:'Glowfish',p:18,c:'#38e0ff'},turnip:{n:'Lumi Turnip',p:30,c:'#e8f0ff'},berry:{n:'Glowberry',p:55,c:'#3dff9a'},star:{n:'Starfruit',p:120,c:'#ffd84a'}};
const CROPS={turnip:{seed:'s_turnip',days:3,c:'#e8f0ff',cost:15},berry:{seed:'s_berry',days:4,c:'#3dff9a',cost:30},star:{seed:'s_star',days:6,c:'#ffd84a',cost:60,city:1}};
const HOT=[{id:'hoe',n:'Hoe'},{id:'can',n:'Water Can'},{id:'pick',n:'Pickaxe'},{id:'rod',n:'Rod'},{id:'s_turnip',n:'Turnip Seed',crop:'turnip'},{id:'s_berry',n:'Berry Seed',crop:'berry'},{id:'s_star',n:'Star Seed',crop:'star'}];
const RES=['wood','ore','scrap','shell','neon','fish'];
const BLD=[
 {id:'path',n:'Stone Path',w:1,h:1,cost:{gold:2},d:'Walkway tile'},{id:'lamp',n:'Street Lamp',w:1,h:1,cost:{gold:5,scrap:1},d:'Lights the night'},
 {id:'flowers',n:'Flower Bed',w:1,h:1,cost:{gold:3},d:'Decoration',walk:1},{id:'fence',n:'Fence',w:1,h:1,cost:{wood:1},d:'Decoration'},
 {id:'plot',n:'Farm Plot',w:3,h:3,cost:{gold:10,wood:3},d:'9 tiles of soil',walk:1},
 {id:'stall',n:'Shop Stall',w:4,h:3,cost:{gold:50,wood:8},u:1,d:'Selling + seeds. Mira opens shop'},
 {id:'workshop',n:'Workshop',w:4,h:3,cost:{gold:100,wood:15,ore:5,scrap:8},u:1,d:'Tool upgrades. Bolt moves in'},
 {id:'dock',n:'Boat Dock',w:3,h:3,cost:{gold:80,wood:12,shell:3},u:1,d:'On water: fishing + boat. Old Coral',water:1},
 {id:'busstop',n:'Bus Stop',w:3,h:2,cost:{gold:150,scrap:10},u:1,d:'Bus to Rust Badlands'},
 {id:'cable',n:'Cable Car',w:3,h:3,cost:{gold:200,ore:12,scrap:10},u:1,d:'Cable car to Mount Vapor'},
 {id:'train',n:'Train Station',w:5,h:3,cost:{gold:400,ore:20,neon:5},u:1,d:'Train to Neon City'},
 {id:'fountain',n:'Fountain',w:3,h:3,cost:{gold:60,shell:4,neon:2},d:'Plaza centerpiece'}];
const BL=Object.fromEntries(BLD.map(b=>[b.id,b]));
const REPAIR={bridge:{n:'Repair the old bridge',cost:{wood:15,ore:3}},portal:{n:'Re-light the ancient portal',cost:{neon:8,shell:6,ore:5}}};
const ROUTES=[{a:'village',b:'forest',type:'walk'},{a:'forest',b:'badlands',type:'walk',req:'bridge'},{a:'badlands',b:'mine',type:'walk'},
 {a:'village',b:'badlands',type:'bus',req:'busstop'},{a:'village',b:'mine',type:'cable',req:'cable'},{a:'village',b:'island',type:'boat',req:'dock'},
 {a:'village',b:'city',type:'train',req:'train'},{a:'mine',b:'city',type:'magic',req:'portal'}];
const RT={walk:{n:'Walking Path',c:'#111111'},blocked:{n:'Blocked Path',c:'#8a7350'},magic:{n:'Magic Path',c:'#ff6ad5'},bus:{n:'Bus Route',c:'#ffcc00'},train:{n:'Train Route',c:'#e8202a'},boat:{n:'Boat Route',c:'#109a2a'},cable:{n:'Cable Car Route',c:'#5a5aff'}};
const L=(t,e='smile')=>({t,e});
const CHARS={
 Mira:{look:{body:'#8a4ac8',hair:'#ff6fb5',style:'long'},talks:[[L('Welcome to my stall! Fresh seeds on the left, and I buy anything you gather.','happy'),L('Turnips are quick, but Glowberries sell for almost double.')],[L('Did you know Neon City pays fifty percent more?','surprised'),L('Someday I want a stall there too!','happy')]]},
 Bolt:{look:{body:'#4a5a70',robot:1},talks:[[L('Beep! Workshop online. Bring ore and scrap for upgrades.','happy'),L('An upgraded pickaxe digs up extra ore with every swing.')],[L('My circuits tingle near the old portal in the mine.','surprised'),L('Neon shards could light it again, I calculate.')]]},
 'Old Coral':{look:{body:'#24406e',hair:'#d8dde2',style:'short',hat:'#f4f4f4'},talks:[[L('Ahoy! The dock is the heart of any village by the water.','happy'),L('Face the water and cast. Glowfish love the night.')],[L('Shell Isle is just a short boat ride. Use your map!'),L('Bring back shells for fish tanks.','happy')]]},
 Pip:{look:{body:'#ffc93a',hair:'#ff9a3a',style:'spiky'},talks:[[L('My own room! I already love it here.','happy'),L('Could you add a sofa? Comfy rooms make me want to stay forever.')],[L('I painted a tiny sign for the front desk!','happy'),L('More floors means more neighbours. More friends!','surprised')]]},
 Nova:{look:{body:'#f4f4ff',hair:'#8f6bff',style:'bob'},talks:[[L('The view from up here is wonderful at night.','happy'),L('A floor lamp would make my room feel like a star.')],[L('I study the sky. The neon sparkles look like comets.','surprised'),L('Thanks for keeping the building so cozy.')]]},
 Sigil:{look:{body:'#2f4fa8',hair:'#22232e',style:'short'},talks:[[L('A bookshelf would be perfect for my collection.'),L('Quiet rooms, happy reader.','happy')],[L('The badlands are full of old scrap. Treasure, really.','surprised'),L('Rent is on time, every morning. Promise.','happy')]]},
 Amber:{look:{body:'#e2483a',hair:'#ffd36a',style:'pony'},talks:[[L('Hi hi! This condo is the cutest place in town.','happy'),L('Plants make any room brighter.')],[L('I jog around the village every morning.'),L('The flower beds by the path are lovely!','happy')]]},
 Juno:{look:{body:'#1a7a7a',hair:'#2ec8b8',style:'bun'},talks:[[L('I love fish! Do you think I could have a fish tank?','surprised'),L('I would name every single fish.','happy')]]},
 Kai:{look:{body:'#5a6070',hair:'#5a3a22',style:'spiky'},talks:[[L('Yo! I fix bikes and play arcade games.','happy'),L('An arcade cabinet in my room would be legendary.')]]},
 'Mayor Lumen':{look:{body:'#c09a2a',hair:'#f4f4f4',style:'short'},talks:[[L('Welcome to Neon City, young manager!','happy'),L('Our market pays more, and only we sell Starfruit seeds.')]]},
 Vexa:{look:{body:'#2a1a40',hair:'#e040b0',style:'pony'},talks:[[L('The city lights never sleep. Neither does the music.','happy'),L('The portal in Vapor Mine connects straight here when lit.','surprised')]]},
 'Conductor Rail':{look:{body:'#a01a2a',hair:'#1a1a1a',style:'short',hat:'#a01a2a'},talks:[[L('All aboard! Hearth Village is one tap away on your map.','happy')]]},
};
const TENANT_POOL=['Pip','Nova','Sigil','Amber','Juno','Kai'],WORKERS={stall:'Mira',workshop:'Bolt',dock:'Old Coral'},MAXF=6,FLOORCOL=[FL1,FL2,FL3];
let S;
function newState(){return{v:7,day:1,min:7*60,gold:120,inv:{s_turnip:5,wood:6},area:'village',px:5.5*16,py:8.5*16,fx:1,fy:1,sel:4,soil:{},nodes:{},blds:[],flags:{},tools:{pick:1,can:1,rod:1},visited:{village:1},
 condo:{floors:1,building:0,ad:0,applicant:null,tenants:[null]},rooms:{office:{wall:'#f2c6d2',floor:FL1,furn:[{k:'desk',x:5,y:1},{k:'bed',x:1,y:1},{k:'plant',x:7,y:1},{k:'rug',x:3,y:3}]},f1:{wall:'#c9dcf4',floor:FL2,furn:[{k:'bed',x:1,y:1},{k:'table',x:5,y:3}]}},opt:{dpad:0},hearts:0};}
const AREAS={},AORDER=['village','forest','badlands','mine','island','city'];
function mkArea(id,name,region,cols,rows,ground){return AREAS[id]={id,name,region,cols,rows,ground,tile:[],solid:[],objs:[],exitList:[],tags:{},spawn:[4,4],station:null,npcs:[]};}
mkArea('village','Hearth Village','HEARTH VILLAGE',40,28,G);mkArea('forest','Whisper Forest','WHISPER WOODS',36,24,DARKG);mkArea('badlands','Rust Badlands','RUST BADLANDS',36,24,DIRT);
mkArea('mine','Vapor Mine','MOUNT VAPOR',30,22,ROCK);mkArea('island','Shell Isle','SHELL ISLE',34,24,WATER);mkArea('city','Neon City','NEON CITY',40,26,GRID);
const EXITS=[['village','E',11,12,'forest','W'],['forest','E',11,12,'badlands','W'],['badlands','N',16,18,'mine','S']];
const isUnlocked=r=>!r.req||S.flags[r.req]||S.blds.some(b=>b.id==r.req);
const AF=(a,x,y,w,h,t)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(a.tile[j]&&i>=0&&i<a.cols)a.tile[j][i]=t;};
const AS=(a,x,y,w,h,v=1)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(a.solid[j]&&i>=0&&i<a.cols)a.solid[j][i]=v;};
const OB=(a,k,x,y,v=0,solid=true)=>{const o=OBJ[k]||FURN[k];a.objs.push({k,x,y,v,w:o.w,d:o.d});if(solid&&!o.flat)AS(a,x,y,o.w,o.d);};
function layout(a){a.tile=[];a.solid=[];a.objs=[];a.tags={};for(let y=0;y<a.rows;y++){a.tile.push(new Array(a.cols).fill(a.ground));a.solid.push(new Array(a.cols).fill(0));}
 AS(a,0,0,a.cols,1);AS(a,0,a.rows-1,a.cols,1);AS(a,0,0,1,a.rows);AS(a,a.cols-1,0,1,a.rows);
 a.exitList=[];EXITS.forEach(e=>{if(e[0]==a.id)a.exitList.push({side:e[1],f:e[2],t:e[3],to:e[4],ts:e[5]});if(e[4]==a.id)a.exitList.push({side:e[5],f:e[2],t:e[3],to:e[0],ts:e[1]});});
 a.exitList.forEach(x=>{for(let k=x.f;k<=x.t;k++){const [i,j]=x.side=='E'?[a.cols-1,k]:x.side=='W'?[0,k]:x.side=='N'?[k,0]:[k,a.rows-1];a.solid[j][i]=0;a.tile[j][i]=PATH;}});}
const RESERVED={x:2,y:2,w:8,h:7},CONDO={x:3,y:2,w:5,d:4,door:[5,6]};
function genVillage(a){layout(a);AF(a,1,23,a.cols-2,4,WATER);AS(a,1,23,a.cols-2,4);AF(a,5,6,1,5,PATH);AF(a,5,11,a.cols-5,2,PATH);a.spawn=[5,8];
 a.objs.push({k:'condo',x:CONDO.x,y:CONDO.y,w:5,d:4});AS(a,CONDO.x,CONDO.y,5,4);
 S.blds.forEach(b=>{const d=BL[b.id];if(b.id=='path')AF(a,b.x,b.y,1,1,PATH);else if(b.id=='plot'){AF(a,b.x,b.y,3,3,SOIL);OB(a,'plot',b.x,b.y,0,false);}else if(b.id=='dock'){AF(a,b.x,b.y,3,3,BOARD);AS(a,b.x,b.y,3,3,0);}
  else OB(a,b.id,b.x,b.y,0,!d.walk);});
 [[13,3],[19,2],[29,4],[35,7],[36,17],[26,18],[15,19],[9,16],[3,20],[37,3],[2,13],[22,6]].forEach(([x,y],i)=>{if(!a.solid[y][x]&&a.tile[y][x]==G&&!S.blds.some(b=>inB(x,y,b)))OB(a,'tree',x,y,i);});}
function genForest(a){layout(a);a.spawn=[2,11];const r=rng(42);AF(a,0,11,36,2,PATH);AF(a,27,1,3,22,WATER);AS(a,27,1,3,22);
 if(S.flags.bridge){AF(a,27,11,3,2,BOARD);AS(a,27,11,3,2,0);}else a.tags.bridge=[27,11,3,2];
 for(let i=0;i<110;i++){const x=1+Math.floor(r()*34),y=1+Math.floor(r()*22);if(y>=9&&y<=14||a.solid[y][x]||a.tile[y][x]!=DARKG)continue;OB(a,'tree',x,y,i);}
 for(let i=0;i<14;i++){const x=1+Math.floor(r()*25),y=1+Math.floor(r()*22);if(!a.solid[y][x]&&a.tile[y][x]==DARKG)OB(a,'shroom',x,y,i,false);}}
function genBadlands(a){layout(a);a.spawn=[2,11];a.station=[8,16];AF(a,0,11,18,2,PATH);AF(a,16,0,3,12,PATH);
 for(let i=0;i<4;i++)OB(a,'container',22+(i%2)*5,15+Math.floor(i/2)*4,i);OB(a,'crane',31,3);OB(a,'busSign',7,15);
 const r=rng(7);for(let i=0;i<16;i++){const x=1+Math.floor(r()*34),y=1+Math.floor(r()*22);if(!a.solid[y][x]&&a.tile[y][x]==DIRT)OB(a,'rock',x,y,i);}}
function genMine(a){layout(a);a.spawn=[16,19];a.station=[6,18];AF(a,15,16,3,6,PATH);
 for(let x=0;x<a.cols;x++)OB(a,'wallrock',x,0,x);for(let y=1;y<a.rows-1;y++)OB(a,'wallrock',0,y,y);
 const r=rng(3);for(let i=0;i<22;i++){const x=2+Math.floor(r()*26),y=2+Math.floor(r()*16);if(Math.abs(x-16)<3&&y>13||x>21&&y<8||a.solid[y][x])continue;OB(a,r()<.35?'crystal':'wallrock',x,y,i);}
 OB(a,'cableSt',4,16);a.tags.portal=[23,3,3,3];AS(a,23,3,3,3);}
function genIsland(a){layout(a);a.spawn=[17,6];a.station=[17,6];
 for(let y=0;y<a.rows;y++)for(let x=0;x<a.cols;x++){const dx=(x-17)/12,dy=(y-12)/8,d=dx*dx+dy*dy;if(d<1)a.tile[y][x]=SAND;else a.solid[y][x]=1;}
 AF(a,16,1,3,4,BOARD);AS(a,16,1,3,4,0);AF(a,26,14,2,7,BOARD);AS(a,26,14,2,7,0);
 [[8,10],[10,15],[22,8],[25,11],[14,17],[20,17]].forEach(([x,y],i)=>OB(a,'palm',x,y,i));OB(a,'hut',11,7);}
function genCity(a){layout(a);a.spawn=[19,19];a.station=[19,19];AF(a,0,20,40,6,CONC);
 [[2,2],[8,2],[27,2],[33,2]].forEach(([x,y],i)=>OB(a,'tower',x,y,i));OB(a,'fount',18,10);
 OB(a,'cityStall',14,3,0);OB(a,'cityStall',21,3,1);a.tags.shopA=[14,3,4,3];a.tags.shopB=[21,3,4,3];OB(a,'trainSt',16,21);
 a.npcStatic=[['Mayor Lumen',12,15],['Vexa',27,14],['Conductor Rail',24,19]];}
AORDER.forEach((id,i)=>AREAS[id].gen=[genVillage,genForest,genBadlands,genMine,genIsland,genCity][i]);
const RC=9,RR=7;
function roomArea(id){const R=S.rooms[id];const a={id:'room:'+id,room:id,name:id=='office'?'Manager Office':'Floor '+id.slice(1)+' · '+(S.condo.tenants[+id.slice(1)-1]||'Vacant'),cols:RC,rows:RR,ground:R.floor,tile:[],solid:[],objs:[],exitList:[],tags:{},spawn:[4,5],npcs:[]};
 for(let y=0;y<RR;y++){a.tile.push(new Array(RC).fill(R.floor));a.solid.push(new Array(RC).fill(0));}
 R.furn.forEach(f=>OB(a,f.k,f.x,f.y,0,true));a.exit=[4,RR-1];return a;}
const NODESPEC={village:[['wood',4],['scrap',2]],forest:[['wood',12]],badlands:[['scrap',12],['ore',6]],mine:[['ore',10],['neon',4]],island:[['shell',9]],city:[['neon',2]]};
const inRect=(x,y,r)=>x>=r.x&&y>=r.y&&x<r.x+r.w&&y<r.y+r.h,inB=(x,y,b)=>x>=b.x&&y>=b.y&&x<b.x+BL[b.id].w&&y<b.y+BL[b.id].h;
function spawnNodes(){for(const id of AORDER){const a=AREAS[id];a.gen(a);const Ls=[];let tries=0;for(const [type,n] of NODESPEC[id]){let k=n;while(k>0&&tries++<900){const x=2+Math.floor(Math.random()*(a.cols-4)),y=2+Math.floor(Math.random()*(a.rows-4)),t=a.tile[y][x];
  if(a.solid[y][x]||t==PATH||t==SOIL||t==BOARD||t==WATER||Ls.some(o=>Math.abs(o.x-x)+Math.abs(o.y-y)<2))continue;if(id=='village'&&(inRect(x,y,RESERVED)||S.blds.some(b=>inB(x,y,b))))continue;if(id=='city'&&y>19)continue;Ls.push({x,y,type});k--;}}S.nodes[id]=Ls;}}
function load(){try{const j=JSON.parse(localStorage.getItem(SAVE));if(j&&j.v==7){S=Object.assign(newState(),j);return 1;}}catch(e){}S=newState();
 if(localStorage.getItem('fantasytown_save_v6')||localStorage.getItem('fantasytown_save_v5')){S.gold+=150;S.oldSave=1;}return 0;}
function save(quiet){localStorage.setItem(SAVE,JSON.stringify(S));if(!quiet)toast('Game saved');}
const loaded=load();if(!loaded||!S.nodes.village)spawnNodes();AORDER.forEach(id=>AREAS[id].gen(AREAS[id]));
if(Q.has('t'))S.min=parseFloat(Q.get('t'))*60;
let area=null;
// ---------- ground cache ----------
function groundOf(a){if(a.gcv)return a.gcv;const W=(a.cols+a.rows)*TW/2,H=(a.cols+a.rows)*TH/2,ox=a.rows*TW/2,top=a.room?70:10,bot=a.room?10:40;const c=document.createElement('canvas');c.width=W*RS;c.height=(H+top+bot)*RS;
 const g=c.getContext('2d');g.scale(RS,RS);g.translate(ox,top);const r=rng(a.cols*7+a.rows);
 if(a.room){const R=S.rooms[a.room],wh=62,wc=R.wall;
  poly(g,[isoP(0,0,0),isoP(a.cols,0,0),isoP(a.cols,0,wh),isoP(0,0,wh)],shade(wc,.92));poly(g,[isoP(0,0,0),isoP(0,a.rows,0),isoP(0,a.rows,wh),isoP(0,0,wh)],wc);
  g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=.6;for(let i=1;i<a.cols;i++){const [x1,y1]=isoP(i,0,4),[x2,y2]=isoP(i,0,wh);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}
  for(let i=1;i<a.rows;i++){const [x1,y1]=isoP(0,i,4),[x2,y2]=isoP(0,i,wh);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}
  poly(g,[isoP(0,0,0),isoP(a.cols,0,0),isoP(a.cols,0,5),isoP(0,0,5)],'#ffffff');poly(g,[isoP(0,0,0),isoP(0,a.rows,0),isoP(0,a.rows,5),isoP(0,0,5)],'#f4f4f4');
  poly(g,[isoP(0,0,wh),isoP(a.cols,0,wh),isoP(a.cols+.15,-.15,wh+2),isoP(-.15,-.15,wh+2)],'#fff');poly(g,[isoP(0,0,wh),isoP(0,a.rows,wh),isoP(-.15,a.rows+.15,wh+2),isoP(-.15,-.15,wh+2)],'#fff');
  poly(g,[isoP(5,0,22),isoP(7.5,0,22),isoP(7.5,0,50),isoP(5,0,50)],'#bfe8ff');poly(g,[isoP(6.22,0,22),isoP(6.28,0,22),isoP(6.28,0,50),isoP(6.22,0,50)],'#fff',null);poly(g,[isoP(5,0,35),isoP(7.5,0,35),isoP(7.5,0,36),isoP(5,0,36)],'#fff',null);
  poly(g,[isoP(0,2,26),isoP(0,4,26),isoP(0,4,46),isoP(0,2,46)],'#ffd84a');poly(g,[isoP(0,2.2,28),isoP(0,3.8,28),isoP(0,3.8,44),isoP(0,2.2,44)],'#7ad0a0',null);
  for(let y=0;y<a.rows;y++)for(let x=0;x<a.cols;x++)drawGroundTile(g,a.tile[y][x],x,y,r);
  const [ex,ey]=isoP(a.exit[0]+.5,a.exit[1]+.5);ell(g,ex,ey,12,5,'#c84a5a',OLC,.6);
  poly(g,[isoP(0,a.rows),isoP(a.cols,a.rows),isoP(a.cols,a.rows,-6),isoP(0,a.rows,-6)],'#c8b8a8');poly(g,[isoP(a.cols,0),isoP(a.cols,a.rows),isoP(a.cols,a.rows,-6),isoP(a.cols,0,-6)],'#a89888');}
 else{for(let y=0;y<a.rows;y++)for(let x=0;x<a.cols;x++){const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([i,j])=>(a.tile[y+j]||[])[x+i]??2);drawGroundTile(g,a.tile[y][x],x,y,r,nb);}
  const ec=a.ground==WATER?'#2a6aa8':a.ground==GRID?'#1a1440':'#8a6a4a';poly(g,[isoP(0,a.rows),isoP(a.cols,a.rows),isoP(a.cols,a.rows,-22),isoP(0,a.rows,-22)],shade(ec,.9));poly(g,[isoP(a.cols,0),isoP(a.cols,a.rows),isoP(a.cols,a.rows,-22),isoP(a.cols,0,-22)],shade(ec,.7));
  if(a.tags.bridge){const [x,y,w]=a.tags.bridge;for(let i=0;i<w;i++)poly(g,[isoP(x+i+.1,y+.3,2),isoP(x+i+.6,y+.3,2),isoP(x+i+.6,y+.6,2),isoP(x+i+.1,y+.6,2)],'#8a5a34');}
  a.exitList.forEach(x=>{for(let k=x.f;k<=x.t;k++){const [i,j]=x.side=='E'?[a.cols-1,k]:x.side=='W'?[0,k]:x.side=='N'?[k,0]:[k,a.rows-1];const [cx,cy]=isoP(i+.5,j+.5);ell(g,cx,cy,6,3,'rgba(80,240,255,.6)',null);}});}
 a.gox=ox;a.goy=top;return a.gcv=c;}
function goArea(id,pos){if(id.startsWith('room:')){area=roomArea(id.slice(5));}else{area=AREAS[id];area.gen(area);area.gcv=null;S.visited[id]=1;}
 S.area=id;const p=pos||area.spawn;S.px=(p[0]+.5)*16;S.py=(p[1]+.5)*16;path=null;area.npcs=makeNpcs(area);banner={t:area.name,l:2.2};if(!area.room)decor=false;if(id!='village')build=false;camSnap=1;}
function refresh(){const keep=[S.px,S.py];if(area.room)area=roomArea(area.room);else area.gen(area);area.gcv=null;area.thumb=null;area.npcs=makeNpcs(area);S.px=keep[0];S.py=keep[1];}
function npc(n,x,y){return{n,x,y,px:(x+.5)*16,py:(y+.5)*16,hx:(x+.5)*16,hy:(y+.5)*16,t:0,dx:0,dy:0,li:0,look:CHARS[n].look,face:'down'};}
function makeNpcs(a){const Ls=[];if(a.id=='village'){S.blds.forEach(b=>{const w=WORKERS[b.id];if(w){const d=BL[b.id];Ls.push(npc(w,Math.min(a.cols-2,b.x+Math.floor(d.w/2)),b.id=='dock'?b.y:Math.min(22,b.y+d.h)));}});
  S.condo.tenants.forEach((t,i)=>{if(t)Ls.push(npc(t,9+i*2,8+(i%2)));});}
 else if(a.room&&a.room!='office'){const t=S.condo.tenants[+a.room.slice(1)-1];if(t)Ls.push(npc(t,6,4));}
 else if(a.npcStatic)a.npcStatic.forEach(([n,x,y])=>Ls.push(npc(n,x,y)));return Ls;}
// ---------- input / modes ----------
const keys={};let build=false,decor=false,bsel=0,fsel=0,hold=null,showMap=Q.has('map'),showCondo=false,condoScroll=0,path=null,pendingAct=null,ghostAt=null,camSnap=1;
addEventListener('keydown',ev=>{const k=ev.key.toLowerCase();
 if(dlg.on){if(k==' '||k=='enter'||k=='e')dlgNext();if(k=='escape')dlgClose();ev.preventDefault();return;}
 if(menuOpen()){if(k=='escape')closeMenu();return;}
 if(showMap){if(k=='m'||k=='escape')showMap=false;const n=parseInt(k);if(n>0&&mapBtns[n-1])mapBtns[n-1].f();return;}
 if(showCondo){if(k=='escape')showCondo=false;if(k=='arrowup'||k=='w')condoScroll+=60;if(k=='arrowdown'||k=='s')condoScroll=Math.max(0,condoScroll-60);ev.preventDefault();return;}
 keys[k]=1;if(k==' '||k=='e'||k=='enter'){useAction();ev.preventDefault();}
 if(k=='b')toggleBuild();if(k=='t')talkNearest();
 if(build||decor){const n=build?BLD.length:FURNLIST.length;if(k=='q'||k=='tab'||k=='x'){if(build)bsel=(bsel+1)%n;else fsel=(fsel+1)%n;}if(k=='z'){if(build)bsel=(bsel+n-1)%n;else fsel=(fsel+n-1)%n;}if(k=='escape')back();}
 else{if(k>='1'&&k<='7')S.sel=+k-1;if(k=='q'||k=='tab')S.sel=(S.sel+1)%HOT.length;if(k=='escape')back();}
 if(k=='tab')ev.preventDefault();if(k=='m'&&!area.room){showMap=true;build=false;}if(k.startsWith('arrow'))ev.preventDefault();});
addEventListener('keyup',ev=>{keys[ev.key.toLowerCase()]=0;});
const isTouch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches||Q.has('touch');if(isTouch)document.body.classList.add('touch');
let triedFS=false;function tryFS(){if(triedFS||!isTouch)return;triedFS=true;const el=document.documentElement;try{const p=el.requestFullscreen?el.requestFullscreen({navigationUI:'hide'}):el.webkitRequestFullscreen&&el.webkitRequestFullscreen();Promise.resolve(p).then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})).catch(()=>{});}catch(e){}}
addEventListener('pointerdown',tryFS,{capture:true});
document.querySelectorAll('.tb').forEach(btn=>{const k=btn.dataset.k;const on=ev=>{ev.preventDefault();ev.stopPropagation();
  if(k=='act')useAction();else if(k=='tool'){if(build)bsel=(bsel+1)%BLD.length;else if(decor)fsel=(fsel+1)%FURNLIST.length;else S.sel=(S.sel+1)%HOT.length;}else if(k=='map'){if(!area.room){showMap=!showMap;build=false;}}else if(k=='build')toggleBuild();else keys['t_'+k]=1;};
 const off=()=>{keys['t_'+k]=0;};btn.addEventListener('pointerdown',on);btn.addEventListener('pointerup',off);btn.addEventListener('pointerleave',off);btn.addEventListener('pointercancel',off);});
$('talk').onpointerdown=e=>{e.preventDefault();talkNearest();};$('back').onpointerdown=e=>{e.preventDefault();back();};
$('note').onpointerdown=e=>{e.preventDefault();notes();};$('gear').onpointerdown=e=>{e.preventDefault();settings();};
let drag=null;
cv.addEventListener('pointerdown',ev=>{const x=ev.clientX,y=ev.clientY;
 if(showMap){const bt=mapBtns.find(b=>x>=b.r[0]&&x<b.r[0]+b.r[2]&&y>=b.r[1]&&y<b.r[1]+b.r[3]);if(bt)bt.f();return;}
 if(showCondo){const bt=condoBtns.find(b=>x>=b.r[0]&&x<b.r[0]+b.r[2]&&y>=b.r[1]&&y<b.r[1]+b.r[3]);if(bt){bt.f();return;}drag={y,s:condoScroll};return;}
 const s=hotRects.findIndex(r=>x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]);if(s>=0){if(build)bsel=s+bOff;else if(decor)fsel=s+bOff;else S.sel=s;return;}
 const tg=tagRects.find(r=>x>=r.r[0]&&x<r.r[0]+r.r[2]&&y>=r.r[1]&&y<r.r[1]+r.r[3]);if(tg&&!build&&!decor){walkTo(tg.x,tg.y);return;}
 const [tx,ty]=screenToTile(x,y);if(build||decor){if(ghostAt&&ghostAt[0]==tx&&ghostAt[1]==ty)(build?place:placeFurn)();else{ghostAt=[tx,ty];if(decor&&!hold)tryPick(tx,ty);}return;}
 walkTo(tx,ty);});
cv.addEventListener('pointermove',ev=>{if(drag&&showCondo)condoScroll=Math.max(0,drag.s+(ev.clientY-drag.y));});addEventListener('pointerup',()=>drag=null);
cv.addEventListener('wheel',ev=>{if(showCondo)condoScroll=Math.max(0,condoScroll-ev.deltaY*.6);},{passive:true});
function back(){if(dlg.on)return dlgClose();if(menuOpen())return closeMenu();if(showMap)return showMap=false;if(showCondo)return showCondo=false;if(build||decor){if(hold){S.rooms[area.room].furn.push(hold);hold=null;refresh();}build=decor=false;ghostAt=null;return;}
 if(area.room){goArea('village',[CONDO.door[0],CONDO.door[1]+1]);showCondo=true;}}
function toggleBuild(){if(area.room){if(decor){back();return;}decor=true;hold=null;ghostAt=null;toast('DECOR — tap a tile to preview, tap again to place. Tap furniture to move it');return;}
 if(area.id!='village'){toast('You can only build in Hearth Village');return;}build=!build;ghostAt=null;toast(build?'BUILD — tap a tile to preview, tap again to place':'Build mode off');}
// ---------- menus ----------
function menuOpen(){return menuEl.style.display=='block';}
function closeMenu(){menuEl.style.display='none';}
function openMenu(h){menuEl.innerHTML=h+`<button class="x" onclick="closeMenu()">Close</button>`;menuEl.style.display='block';for(const k in keys)keys[k]=0;}
window.closeMenu=closeMenu;
const costStr=c=>Object.entries(c||{}).filter(([k,v])=>v).map(([k,v])=>k=='gold'?v+'g':v+' '+ITEMS[k].n).join(', ')||'free';
const canPay=c=>Object.entries(c||{}).every(([k,v])=>k=='gold'?S.gold>=v:(S.inv[k]||0)>=v);
const pay=c=>Object.entries(c||{}).forEach(([k,v])=>{if(k=='gold')S.gold-=v;else S.inv[k]-=v;});
function shop(mult,city){const sell=Object.keys(ITEMS).filter(k=>S.inv[k]>0);let tot=0;sell.forEach(k=>tot+=Math.round(ITEMS[k].p*mult)*S.inv[k]);
 let h=`<h3>${city?'NEON CITY MARKET (+50%)':"MIRA'S SHOP STALL"}</h3><div>Gold: ${S.gold}g</div><div class="row">`;
 for(const c in CROPS){const s=CROPS[c];if(s.city&&!city)continue;h+=`<button onclick="buy('${s.seed}',${s.cost},${mult},${city})">Buy ${HOT.find(x=>x.id==s.seed).n} ${s.cost}g (${S.inv[s.seed]||0})</button>`;}
 h+=`</div><button onclick="sellAll(${mult},${city})">Sell all goods — ${tot}g</button><div class="row">`;sell.forEach(k=>h+=`<button onclick="sell1('${k}',${mult},${city})">${ITEMS[k].n} ×${S.inv[k]} · ${Math.round(ITEMS[k].p*mult)}g</button>`);openMenu(h+'</div>');}
window.buy=(id,c,m,ci)=>{if(S.gold>=c){S.gold-=c;S.inv[id]=(S.inv[id]||0)+1;sfx(660);}else toast('Not enough gold');shop(m,ci);};
window.sellAll=(m,ci)=>{for(const k in ITEMS)if(S.inv[k]>0){S.gold+=Math.round(ITEMS[k].p*m)*S.inv[k];S.inv[k]=0;}sfx(880);shop(m,ci);};
window.sell1=(k,m,ci)=>{if(S.inv[k]>0){S.inv[k]--;S.gold+=Math.round(ITEMS[k].p*m);sfx(800);}shop(m,ci);};
const TOOLUP={pick:{n:'Pickaxe',cost:{gold:100,ore:8,scrap:6},d:'+1 ore/scrap/neon per hit'},can:{n:'Water Can',cost:{gold:80,ore:5},d:'Waters 3 tiles'},rod:{n:'Rod',cost:{gold:60,wood:5,shell:3},d:'Faster bites, 2 fish at night'}};
function workshop(){let h="<h3>BOLT'S WORKSHOP</h3>";for(const k in TOOLUP){const u=TOOLUP[k];h+=S.tools[k]>1?`<p>✔ ${u.n} Lv2 — ${u.d}</p>`:`<button onclick="upTool('${k}')" ${canPay(u.cost)?'':'class="no"'}>Upgrade ${u.n}: ${costStr(u.cost)}<br><small>${u.d}</small></button>`;}openMenu(h);}
window.upTool=k=>{const u=TOOLUP[k];if(!canPay(u.cost)){toast('Need '+costStr(u.cost));return;}pay(u.cost);S.tools[k]=2;sfx(990);toast(u.n+' upgraded!');workshop();};
function repairMenu(k){const r=REPAIR[k];openMenu(`<h3>${r.n.toUpperCase()}</h3><p>Cost: ${costStr(r.cost)}</p><button onclick="doRepair('${k}')" ${canPay(r.cost)?'':'class="no"'}>Repair</button>`);}
window.doRepair=k=>{const r=REPAIR[k];if(!canPay(r.cost)){toast('Need '+costStr(r.cost));return;}pay(r.cost);S.flags[k]=1;refresh();closeMenu();toast(k=='bridge'?'Bridge repaired! Route to Rust Badlands open':'The portal blazes! Magic route to Neon City');sfx(1200);save(1);};
function notes(){const c=S.condo,tn=c.tenants.filter(Boolean).length;const goals=[
  [S.blds.some(b=>b.id=='stall'),'Build a Shop Stall so you can sell goods'],[tn>0,'Post an ad at the Front Desk and register your first tenant'],[c.floors>1,'Renovate a second tenant floor'],
  [S.flags.bridge,'Repair the bridge in Whisper Forest'],[S.blds.some(b=>b.id=='dock'),'Build a Boat Dock'],[S.flags.portal||S.blds.some(b=>b.id=='train'),'Reach Neon City (train or portal)'],[c.floors>=MAXF,'Open all 6 condo floors']];
 openMenu(`<h3>📒 NOTE</h3><p>Day ${S.day} · Tenants ${tn}/${c.floors} · Rent/day ${rentTotal()}g · ♥ ${S.hearts}</p>`+goals.map(([d,t])=>`<p>${d?'✅':'⬜'} ${t}</p>`).join(''));}
function settings(){openMenu(`<h3>⚙ SETTINGS</h3><button onclick="S.opt.dpad=!S.opt.dpad;applyOpt();settings()">On-screen D-pad: ${S.opt.dpad?'ON':'OFF'} (tap-to-move always works)</button><button onclick="save();closeMenu()">Save now</button><button onclick="if(confirm('Reset all progress?')){localStorage.removeItem('${SAVE}');location.reload()}">Reset save</button><p>Fantasy Town ${VERSION}</p>`);}
window.applyOpt=()=>document.body.classList.toggle('dpad',!!S.opt.dpad);window.settings=settings;window.save=save;
// ---------- condo ----------
function comfort(id){const R=S.rooms[id];return R?R.furn.reduce((s,f)=>s+(FURN[f.k].comfort||0),0):0;}
function rentOf(i){return S.condo.tenants[i]?20+comfort('f'+(i+1))*3:0;}
function rentTotal(){return S.condo.tenants.reduce((s,t,i)=>s+rentOf(i),0);}
const renoCost=n=>({gold:120*n,wood:8*n,ore:2*n});
window.condoAct=k=>{const c=S.condo;
 if(k=='ad'){if(S.gold<20){toast('Need 20g for an ad');return;}S.gold-=20;c.ad=1;toast('Ad posted! An applicant will visit tomorrow morning');sfx(700);}
 if(k=='reg'){const i=c.tenants.indexOf(null);if(i<0||!c.applicant){toast('No vacant unit — renovate a new floor');return;}c.tenants[i]=c.applicant;const nm=c.applicant;c.applicant=null;toast(`${nm} moved into Floor ${i+1}!`);sfx(990);refresh();save(1);showCondo=false;
  startDialogue(nm,[L(`Hi manager! I'm ${nm}. Thank you for the room on Floor ${i+1}!`,'happy'),L('I pay rent every morning. Decorate my room and I will be even happier!')]);}
 if(k=='reno'){const n=c.floors+1,cost=renoCost(n);if(c.building){toast('Already under construction');return;}if(n>MAXF){toast('The condo is at max height');return;}if(!canPay(cost)){toast('Need '+costStr(cost));return;}pay(cost);c.building=1;toast(`Renovation started! Floor ${n} opens tomorrow`);sfx(500);refresh();save(1);}};
function enterRoom(id){showCondo=false;goArea('room:'+id,[4,5]);}
let condoBtns=[];
function drawCondo(t){ctx.setTransform(1,0,0,1,0,0);const W=cv.width,H=cv.height,night=nightF();const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,night>.5?'#1a1a4a':'#7ac8ff');bg.addColorStop(1,night>.5?'#8a5a9a':'#ffd8e0');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 if(night>.5)for(let i=0;i<50;i++){ctx.fillStyle='rgba(255,255,255,'+(.3+.3*Math.sin(t+i))+')';ctx.fillRect((i*137)%W,(i*71)%(H*.7),2,2);}
 condoBtns=[];const s=Math.min(1.2,Math.max(.6,H/600)),fw=Math.min(W-300*s,540*s),fh=118*s;if(condoScroll<0)condoScroll=Math.max(0,(S.condo.floors+2)*(fh+6*s)+90*s-H+60);const x0=Math.max(250*s,(W-fw)/2+40*s),base=H-40*s+condoScroll,c=S.condo,d=28*s;
 const btn=(x,y,w,h,txt,col,f,dis)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,h/2);ctx.fillStyle=dis?'#9a9aaa':col;ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=['#ffd84a','#9fff7a'].includes(col)&&!dis?'#2a2238':'#fff';ctx.font=`bold ${Math.round(12*s)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,x+w/2,y+h/2+1);ctx.textAlign='left';if(!dis)condoBtns.push({r:[x,y,w,h],f});};
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
 let y=base;const off=S.rooms.office;room(y,off.wall,'#f0e6d6',off.furn.filter(f=>f.k!='rug').slice(0,4));label(x0-d-10*s,y-fh+4*s,'G · MANAGER OFFICE + FRONT DESK');
 btn(x0+12*s,y-50*s,124*s,30*s,'ENTER OFFICE','#38a0ff',()=>enterRoom('office'));
 if(c.applicant)btn(x0+146*s,y-50*s,190*s,30*s,c.tenants.includes(null)?'REGISTER '+c.applicant.toUpperCase():'NO VACANCY','#9fff7a',()=>condoAct('reg'),!c.tenants.includes(null));
 else btn(x0+146*s,y-50*s,190*s,30*s,c.ad?'AD POSTED · TOMORROW':'POST AD · 20g','#ffd84a',()=>condoAct('ad'),c.ad);
 for(let f=1;f<=c.floors;f++){y-=fh+6*s;const tn=c.tenants[f-1],R=S.rooms['f'+f];room(y,R.wall,'#e6dccb',R.furn.filter(q=>q.k!='rug').slice(0,4),tn);label(x0-d-10*s,y-fh+4*s,`${f}F · ${tn?tn.toUpperCase()+' · RENT '+rentOf(f-1)+'g':'VACANT'}`,tn?'#9fff7a':'#ffd84a');
  btn(x0+12*s,y-50*s,92*s,30*s,'ENTER','#38a0ff',()=>enterRoom('f'+f));ctx.fillStyle='#2a2238';ctx.font=`bold ${Math.round(11*s)}px sans-serif`;ctx.fillText('♥ comfort '+comfort('f'+f),x0+12*s,y-60*s);}
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
 [`🏢 ${c.floors} tenant floor${c.floors>1?'s':''}`,`👥 Tenants ${c.tenants.filter(Boolean).length}/${c.floors}`,`💰 Rent/day ${rentTotal()}g`,c.applicant?`📋 ${c.applicant} is waiting`:c.ad?'📋 Ad running':'📋 No ad posted','↕ drag / wheel to scroll'].forEach((l,i)=>{ctx.fillStyle=i==4?'#8a8a9a':'#2a2238';ctx.font=`bold ${Math.round((i==4?10:13)*s)}px sans-serif`;ctx.fillText(l,26,106+i*26*s);});ctx.textBaseline='alphabetic';}
// ---------- dialogue ----------
const dlg={on:false,lines:[],i:0,ch:0,name:'',hidden:false};
function startDialogue(name,lines){Object.assign(dlg,{on:true,lines,i:0,ch:0,name,hidden:false});$('dlg').style.display='block';$('dlgName').textContent=name.toUpperCase();showLine();for(const k in keys)keys[k]=0;}
function showLine(){const l=dlg.lines[dlg.i];const pc=$('dlgPortrait'),g=pc.getContext('2d');g.clearRect(0,0,pc.width,pc.height);g.drawImage(portrait(dlg.name,l.e),0,0,pc.width,pc.height);dlg.ch=0;$('dlgText').textContent='';$('dlgBox').style.visibility='visible';dlg.hidden=false;}
function dlgNext(){const l=dlg.lines[dlg.i];if(dlg.ch<l.t.length){dlg.ch=l.t.length;$('dlgText').textContent=l.t;return;}dlg.i++;if(dlg.i>=dlg.lines.length)dlgClose();else showLine();}
function dlgClose(){dlg.on=false;$('dlg').style.display='none';}
$('dlgNext').onclick=e=>{e.stopPropagation();dlgNext();};$('dlgSkip').onclick=e=>{e.stopPropagation();dlgClose();};$('dlgHide').onclick=e=>{e.stopPropagation();dlg.hidden=true;$('dlgBox').style.visibility='hidden';};
$('dlg').onclick=()=>{if(dlg.hidden){dlg.hidden=false;$('dlgBox').style.visibility='visible';}else dlgNext();};
function talk(n){n.dx=n.dy=0;const ch=CHARS[n.n];const conv=ch.talks[n.li++%ch.talks.length];S.hearts++;startDialogue(n.n,conv);}
function nearNpc(){let best=null,bd=1.9*16;area.npcs.forEach(n=>{const d=Math.hypot(n.px-S.px,n.py-S.py);if(d<bd){bd=d;best=n;}});return best;}
function talkNearest(){const n=nearNpc();if(n)talk(n);}
// ---------- feedback ----------
let toasts=[],fade=0,parts=[],banner=null,fishing=null,saveT=0,walkT=0,moving=false;
function toast(t){toasts.push({t,life:2.8});if(toasts.length>3)toasts.shift();}
let actx=null;function sfx(f){try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.type='triangle';o.frequency.value=f;g.gain.value=.05;g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+.18);o.connect(g).connect(actx.destination);o.start();o.stop(actx.currentTime+.2);}catch(e){}}
function give(k,n,tx,ty){S.inv[k]=(S.inv[k]||0)+n;toast(`+${n} ${ITEMS[k].n}`);sfx(520+Math.random()*200);for(let i=0;i<10;i++)parts.push({x:tx+.5,y:ty+.5,z:8,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,vz:30+Math.random()*30,l:.7,c:ITEMS[k].c});}
window.sleep=(passed)=>{closeMenu();S.day++;S.min=7*60;
 for(const k in S.soil){const s=S.soil[k];if(s.crop&&s.w&&s.g<CROPS[s.crop].days)s.g++;s.w=false;}
 const c=S.condo,rent=rentTotal();S.gold+=rent;const msg=[];if(rent)msg.push(`Rent collected: +${rent}g`);
 if(c.building){c.building=0;c.floors++;c.tenants.push(null);const n=c.floors;S.rooms['f'+n]={wall:['#f8d0d8','#d0e0f8','#e0f0d0','#f8e8c0','#e0d0f8','#d0f0f0'][(n-1)%6],floor:FLOORCOL[n%3],furn:[{k:'bed',x:1,y:1},{k:'table',x:5,y:3}]};msg.push(`Floor ${n} is finished!`);}
 if(c.ad&&!c.applicant){const pool=TENANT_POOL.filter(t=>!c.tenants.includes(t));if(pool.length){c.applicant=pool[Math.floor(Math.random()*pool.length)];msg.push(`${c.applicant} is waiting at the front desk!`);}c.ad=0;}
 spawnNodes();AORDER.forEach(id=>{AREAS[id].gcv=null;AREAS[id].thumb=null;});goArea('room:office',[3,4]);fade=1.2;save(1);toast(passed?'You passed out... Day '+S.day:'Good morning! Day '+S.day);msg.forEach(toast);};
function stationPos(id,type){if(id=='village'){const b=S.blds.find(b=>b.id==({bus:'busstop',cable:'cable',boat:'dock',train:'train'}[type]));if(b){const d=BL[b.id];return[b.x+Math.floor(d.w/2),type=='boat'?b.y:Math.min(22,b.y+d.h)];}return AREAS.village.spawn;}
 if(type=='magic')return id=='mine'?[24,7]:[19,18];return AREAS[id].station||AREAS[id].spawn;}
function travel(r){const cur=area.room?'village':area.id;const to=r.a==cur?r.b:r.a;fade=1;goArea(to,stationPos(to,r.type));showMap=false;toast(`${RT[r.type].n.split(' ')[0]} → ${AREAS[to].name}`);sfx(500);}
// ---------- geometry / pathing ----------
const ptx=()=>S.px/16,pty=()=>S.py/16;
let cam={x:0,y:0},Z=2;
function screenToTile(sx,sy){const wx=(sx-cv.width/2)/Z+cam.x,wy=(sy-cv.height/2)/Z+cam.y;return[Math.floor((wx/16+wy/8)/2),Math.floor((wy/8-wx/16)/2)];}
function walkable(x,y){const a=area;if(x<0||y<0||x>=a.cols||y>=a.rows||a.solid[y][x])return false;if(!a.room&&(S.nodes[a.id]||[]).some(o=>o.x==x&&o.y==y&&o.type!='shell'))return false;return true;}
function bfs(sx,sy,goal){const key=(x,y)=>y*999+x,prev=new Map([[key(sx,sy),null]]),q=[[sx,sy]];while(q.length){const [x,y]=q.shift();if(goal(x,y)){const p=[];let c=[x,y];while(c){p.unshift(c);c=prev.get(key(c[0],c[1]));}return p;}
 for(const [i,j] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const nx=x+i,ny=y+j;if(!walkable(nx,ny)||prev.has(key(nx,ny)))continue;if(i&&j&&(!walkable(x+i,y)||!walkable(x,y+j)))continue;prev.set(key(nx,ny),[x,y]);q.push([nx,ny]);if(prev.size>5000)return null;}}return null;}
function walkTo(tx,ty){const sx=Math.floor(ptx()),sy=Math.floor(pty()),it=interactAt(tx,ty),target=walkable(tx,ty)&&(!it||it=='soil'||it=='exit');
 if(it&&it!='exit'&&Math.max(Math.abs(sx-tx),Math.abs(sy-ty))<=1){faceTo(tx,ty);act(tx,ty);return;}
 const p=bfs(sx,sy,target&&!it?(x,y)=>x==tx&&y==ty:(x,y)=>Math.max(Math.abs(x-tx),Math.abs(y-ty))<=(it=='exit'?0:1));if(!p){toast("Can't reach there");return;}path=p.slice(1);pendingAct=it?[tx,ty]:null;
 if(!path.length){path=null;if(pendingAct){faceTo(tx,ty);act(tx,ty);pendingAct=null;}}}
function faceTo(tx,ty){const dx=tx+.5-ptx(),dy=ty+.5-pty(),l=Math.hypot(dx,dy)||1;S.fx=dx/l;S.fy=dy/l;}
// ---------- interaction ----------
function furnAt(tx,ty){return area.room&&S.rooms[area.room].furn.find(f=>tx>=f.x&&ty>=f.y&&tx<f.x+FURN[f.k].w&&ty<f.y+FURN[f.k].d&&!FURN[f.k].flat);}
function interactAt(tx,ty){const a=area;if(a.npcs.some(n=>Math.floor(n.px/16)==tx&&Math.floor(n.py/16)==ty))return'npc';
 if(a.room){const f=furnAt(tx,ty);if(f&&FURN[f.k].tag)return'furn';if(tx==a.exit[0]&&ty==a.exit[1])return'exit';return null;}
 if(a.id=='village'){if(tx>=CONDO.x&&ty>=CONDO.y&&tx<CONDO.x+5&&ty<CONDO.y+4||tx==CONDO.door[0]&&ty==CONDO.door[1]+1&&false)return'condo';const b=S.blds.find(b=>inB(tx,ty,b));if(b&&['stall','workshop','busstop','cable','train'].includes(b.id))return'bld';}
 for(const k in a.tags){const r=a.tags[k];if(tx>=r[0]&&ty>=r[1]&&tx<r[0]+r[2]&&ty<r[1]+r[3])return'tag';}
 if((S.nodes[a.id]||[]).some(o=>o.x==tx&&o.y==ty))return'node';const t=a.tile[ty]&&a.tile[ty][tx];if(t==SOIL)return'soil';if(t==WATER)return'water';return null;}
function facingTile(){return[Math.floor(ptx()+S.fx*.85),Math.floor(pty()+S.fy*.85)];}
function useAction(){if(build){place();return;}if(decor){placeFurn();return;}const [fx,fy]=facingTile();if(interactAt(fx,fy)){act(fx,fy);return;}
 const cx=Math.floor(ptx()),cy=Math.floor(pty());if(interactAt(cx,cy)=='soil'){act(cx,cy);return;}
 for(const [i,j] of [[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,-1],[1,-1],[-1,1]]){const k=interactAt(cx+i,cy+j);if(k&&k!='exit'){faceTo(cx+i,cy+j);act(cx+i,cy+j);return;}}toast('Nothing here');}
function act(tx,ty){const a=area,kind=interactAt(tx,ty);
 if(kind=='npc'){talk(a.npcs.find(n=>Math.floor(n.px/16)==tx&&Math.floor(n.py/16)==ty));return;}
 if(kind=='exit'){back();return;}
 if(kind=='furn'){furnUse(furnAt(tx,ty));return;}
 if(kind=='condo'){showCondo=true;condoScroll=-1;return;}
 if(kind=='bld'){const b=S.blds.find(b=>inB(tx,ty,b));if(b.id=='stall')shop(1,0);else if(b.id=='workshop')workshop();else showMap=true;return;}
 if(kind=='tag'){for(const k in a.tags){const r=a.tags[k];if(tx>=r[0]&&ty>=r[1]&&tx<r[0]+r[2]&&ty<r[1]+r[3]){if(k=='bridge')repairMenu('bridge');else if(k=='portal'){if(S.flags.portal)travel(ROUTES.find(r=>r.type=='magic'));else repairMenu('portal');}else shop(1.5,1);return;}}}
 if(kind=='node'){const nodes=S.nodes[a.id],ni=nodes.findIndex(o=>o.x==tx&&o.y==ty),o=nodes[ni];nodes.splice(ni,1);const pick=['ore','scrap'].includes(o.type)||o.type=='neon'&&a.id=='mine';let n=o.type=='wood'?2+(Math.random()<.5):1+(o.type=='scrap'&&Math.random()<.4);if(pick&&S.tools.pick>1)n++;give(o.type,n,tx,ty);return;}
 if(kind=='soil'){const key=tx+','+ty;const s=S.soil[key],tool=HOT[S.sel];
  if(s&&s.crop&&s.g>=CROPS[s.crop].days){give(s.crop,1,tx,ty);delete s.crop;return;}
  if(!s){S.soil[key]={w:false};sfx(220);toast('Tilled');return;}
  if(!s.crop){const seed=tool.crop&&S.inv[tool.id]>0?tool:HOT.find(h=>h.crop&&S.inv[h.id]>0);if(!seed){toast('No seeds — buy at the Shop Stall');return;}S.inv[seed.id]--;s.crop=seed.crop;s.g=0;sfx(320);toast('Planted '+seed.n.replace(' Seed',''));return;}
  if(!s.w){const Ls=[[tx,ty]];if(S.tools.can>1)Ls.push([tx+1,ty],[tx-1,ty]);Ls.forEach(([x,y])=>{const q=S.soil[x+','+y];if(q){q.w=true;for(let i=0;i<6;i++)parts.push({x:x+.5,y:y+.5,z:10,vx:(Math.random()-.5),vy:(Math.random()-.5),vz:20,l:.5,c:'#5cf'});}});sfx(420);toast('Watered');return;}
  toast(`${ITEMS[s.crop].n}: day ${s.g}/${CROPS[s.crop].days} (watered)`);return;}
 if(kind=='water'){if(a.id=='village'&&!S.blds.some(b=>b.id=='dock')){toast('Build a Boat Dock to fish here');return;}if(!fishing){fishing={t:(S.tools.rod>1?.6:1.2)+Math.random()*1.2,x:tx,y:ty};toast('Casting...');}return;}}
function furnUse(f){if(f.k=='bed'&&area.room=='office'){openMenu(`<h3>BED</h3><p>Sleep until morning? Rent is collected at dawn.</p><button onclick="sleep()">Sleep (save)</button>`);return;}
 if(f.k=='desk'){showCondo=true;condoScroll=-1;return;}
 const msgs={tv:'You watch a cozy cooking show. ♥',fishtank:'The fish wiggle happily. ♥',bathtub:'Bubbles everywhere! So relaxing. ♥',bed:'A neatly made bed.'};S.hearts++;toast(msgs[f.k]||'Nice!');sfx(880);}
// ---------- building / decor ----------
function ghostRect(){const d=BLD[bsel];let x,y;if(ghostAt){[x,y]=ghostAt;x-=Math.floor(d.w/2);y-=Math.floor(d.h/2);}else{const [fx,fy]=facingTile();x=fx-(S.fx<0?d.w-1:0);y=fy-(S.fy<0?d.h-1:0);}return{x,y,w:d.w,h:d.h,d};}
function canPlace(g){const a=AREAS.village;if(g.d.u&&S.blds.some(b=>b.id==g.d.id))return'Already built';const px=Math.floor(ptx()),py=Math.floor(pty());
 for(let j=g.y;j<g.y+g.h;j++)for(let i=g.x;i<g.x+g.w;i++){if(i<1||j<1||i>=a.cols-1||j>=a.rows-1)return'Out of bounds';const t=a.tile[j][i];
  if(g.d.water){if(t!=WATER)return'Dock must be on water';continue;}
  if(a.solid[j][i]||t==WATER||t==SOIL||t==BOARD)return'Blocked';if(t==PATH&&!['path','lamp','flowers'].includes(g.d.id))return'Keep paths clear';
  if(inRect(i,j,RESERVED))return'Condo lot';if(S.blds.some(b=>inB(i,j,b)))return'Occupied';if((S.nodes.village||[]).some(o=>o.x==i&&o.y==j))return'Clear resources first';if(i==px&&j==py&&!g.d.walk&&g.d.id!='path')return'You are standing there';}
 if(g.d.water&&!(a.tile[g.y-1]&&a.tile[g.y-1][g.x+1]!=WATER))return'Dock must touch the shore';return'';}
function place(){const g=ghostRect(),why=canPlace(g);if(why){toast(why);sfx(150);return;}if(!canPay(g.d.cost)){toast('Need '+costStr(g.d.cost));sfx(150);return;}
 pay(g.d.cost);S.blds.push({id:g.d.id,x:g.x,y:g.y});refresh();sfx(700);for(let i=0;i<16;i++)parts.push({x:g.x+g.w/2,y:g.y+g.h/2,z:10,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,vz:40+Math.random()*30,l:.8,c:'#ffd84a'});
 const w=WORKERS[g.d.id];toast(`Built ${g.d.n}!`+(w?` ${w} moved in!`:''));const rt=ROUTES.find(r=>r.req==g.d.id);if(rt)toast(`${RT[rt.type].n} unlocked — open the MAP`);ghostAt=null;save(1);}
const FURNLIST=Object.keys(FURN).filter(k=>!FURN[k].fixed);
function furnGhost(){const k=hold?hold.k:FURNLIST[fsel],F=FURN[k];let x,y;if(ghostAt)[x,y]=ghostAt;else[x,y]=facingTile();return{k,x,y,w:F.w,d:F.d,F};}
function canFurn(g){const a=area,R=S.rooms[a.room];if(g.x<0||g.y<0||g.x+g.w>a.cols||g.y+g.d>a.rows)return'Out of room';if(g.x<=a.exit[0]&&g.x+g.w>a.exit[0]&&g.y+g.d>a.exit[1])return'Keep the door clear';
 for(const f of R.furn){const F=FURN[f.k];if(g.x<f.x+F.w&&g.x+g.w>f.x&&g.y<f.y+F.d&&g.y+g.d>f.y&&!F.flat&&!g.F.flat)return'Occupied';if(F.flat&&g.F.flat&&g.x<f.x+F.w&&g.x+g.w>f.x&&g.y<f.y+F.d&&g.y+g.d>f.y)return'Occupied';}
 const px=Math.floor(ptx()),py=Math.floor(pty());if(!g.F.flat&&px>=g.x&&px<g.x+g.w&&py>=g.y&&py<g.y+g.d)return'You are standing there';
 if(!g.F.flat&&area.npcs.some(n=>{const x=Math.floor(n.px/16),y=Math.floor(n.py/16);return x>=g.x&&x<g.x+g.w&&y>=g.y&&y<g.y+g.d;}))return'Someone is there';return'';}
function tryPick(tx,ty){const R=S.rooms[area.room];const f=R.furn.find(f=>tx>=f.x&&ty>=f.y&&tx<f.x+FURN[f.k].w&&ty<f.y+FURN[f.k].d&&!FURN[f.k].fixed);if(!f)return false;R.furn.splice(R.furn.indexOf(f),1);hold=f;refresh();toast('Picked up '+FURN[f.k].n+' — choose a spot, tap again to place');return true;}
function placeFurn(){const R=S.rooms[area.room];const g=furnGhost(),why=canFurn(g);if(why){toast(why);sfx(150);return;}if(!hold){if(!canPay(g.F.cost)){toast('Need '+costStr(g.F.cost));sfx(150);return;}pay(g.F.cost);}
 R.furn.push({k:g.k,x:g.x,y:g.y});hold=null;ghostAt=null;refresh();sfx(760);toast(`Placed ${g.F.n} · room comfort ${comfort(area.room)}`);save(1);}
// ---------- movement / update ----------
function blocked(x,y){const r=.26;return[[x-r,y-r],[x+r,y-r],[x-r,y+r],[x+r,y+r]].some(([p,q])=>!walkable(Math.floor(p),Math.floor(q)));}
function checkExit(){const a=area;if(a.room)return;const tx=Math.floor(ptx()),ty=Math.floor(pty());for(const x of a.exitList){const on=(x.side=='E'&&tx>=a.cols-1||x.side=='W'&&tx<=0)&&ty>=x.f&&ty<=x.t||(x.side=='N'&&ty<=0||x.side=='S'&&ty>=a.rows-1)&&tx>=x.f&&tx<=x.t;
 if(on){const b=AREAS[x.to],k=x.side=='E'||x.side=='W'?ty:tx;const p=x.ts=='W'?[1,k]:x.ts=='E'?[b.cols-2,k]:x.ts=='N'?[k,1]:[k,b.rows-2];goArea(x.to,p);return;}}}
function nightF(){const h=(S.min/60)%24;if(h>=6&&h<17)return 0;if(h>=17&&h<20)return(h-17)/3;if(h>=4&&h<6)return 1-(h-4)/2;return 1;}
function update(dt){if(dlg.on){const l=dlg.lines[dlg.i];if(dlg.ch<l.t.length){dlg.ch=Math.min(l.t.length,dlg.ch+dt*45);$('dlgText').textContent=l.t.slice(0,Math.floor(dlg.ch));}return;}
 if(menuOpen()||showMap||showCondo)return;
 S.min+=dt*4;if(S.min>=26*60){sleep(true);return;}
 const sx=(keys.d||keys.arrowright||keys.t_right?1:0)-(keys.a||keys.arrowleft||keys.t_left?1:0),sy=(keys.s||keys.arrowdown||keys.t_down?1:0)-(keys.w||keys.arrowup||keys.t_up?1:0);
 let vx=sx+sy,vy=sy-sx;if(vx||vy){path=null;pendingAct=null;}
 else if(path&&path.length){const [nx,ny]=path[0];vx=nx+.5-ptx();vy=ny+.5-pty();if(Math.hypot(vx,vy)<.1){S.px=(nx+.5)*16;S.py=(ny+.5)*16;path.shift();vx=vy=0;if(!path.length){path=null;checkExit();if(area.room&&Math.floor(ptx())==area.exit[0]&&Math.floor(pty())==area.exit[1]){back();return;}if(pendingAct){const [ax,ay]=pendingAct;pendingAct=null;faceTo(ax,ay);act(ax,ay);}}}}
 const l=Math.hypot(vx,vy);moving=l>0;if(moving){vx/=l;vy/=l;S.fx=vx;S.fy=vy;if(fishing){fishing=null;toast('Line reeled in');}
  const sp=(keys.shift?5.5:3.6)*dt,nx=ptx()+vx*sp,ny=pty()+vy*sp;if(!blocked(nx,pty()))S.px=nx*16;if(!blocked(ptx(),ny))S.py=ny*16;walkT+=dt;checkExit();
  if(!path&&area.room&&Math.floor(ptx())==area.exit[0]&&Math.floor(pty())==area.exit[1]){back();return;}}
 if(fishing){fishing.t-=dt;if(fishing.t<=0){const n=nightF()>.5&&S.tools.rod>1?2:1;if(Math.random()<.85)give('fish',n,fishing.x,fishing.y);else give('shell',1,fishing.x,fishing.y);fishing=null;}}
 area.npcs.forEach(n=>{n.t-=dt;if(n.t<=0){n.t=1+Math.random()*2.5;if(Math.random()<.5)n.dx=n.dy=0;else{const q=Math.floor(Math.random()*4);n.dx=[1,-1,0,0][q];n.dy=[0,0,1,-1][q];n.face=['right','left','down','up'][q];}}
  const nx=n.px+n.dx*14*dt,ny=n.py+n.dy*14*dt,tx=Math.floor(nx/16),ty=Math.floor(ny/16);
  if(walkable(tx,ty)&&area.tile[ty][tx]!=WATER&&Math.abs(nx-n.hx)<36&&Math.abs(ny-n.hy)<36&&Math.hypot(nx-S.px,ny-S.py)>12&&!(area.room&&tx==area.exit[0]&&ty==area.exit[1])){n.px=nx;n.py=ny;}else n.t=0;});
 parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vz-=120*dt;p.l-=dt;});parts=parts.filter(p=>p.l>0&&p.z>-2);
 toasts.forEach(t=>t.life-=dt);toasts=toasts.filter(t=>t.life>0);if(banner)banner.l-=dt;if(fade>0)fade-=dt*1.4;saveT+=dt;if(saveT>30){saveT=0;save(1);}}
// ---------- render ----------
let tagRects=[],hotRects=[],bOff=0,sc=1;
function resize(){cv.width=innerWidth;cv.height=innerHeight;sc=Math.max(.72,Math.min(1.4,Math.min(cv.width/1100,cv.height/560)));$('rot').style.display=isTouch&&innerHeight>innerWidth?'flex':'none';}
addEventListener('resize',resize);resize();
function lightList(a){const Ls=[];a.objs.forEach(o=>{const d=OBJ[o.k]||FURN[o.k];(d&&d.light||[]).forEach(([x,y,z,r,c])=>Ls.push([o.x+x,o.y+y,z,r,c]));if(o.k=='condo')for(let f=0;f<=S.condo.floors;f++)Ls.push([o.x+2.5,o.y+4,14+f*26,44,'#ffd88a']);});
 (S.nodes[a.id]||[]).forEach(o=>{if(o.type=='neon')Ls.push([o.x+.5,o.y+.5,8,26,'#ff4fd8']);});if(a.tags.portal&&S.flags.portal)Ls.push([a.tags.portal[0]+1.5,a.tags.portal[1]+1.5,20,90,'#ff6ad5']);return Ls;}
function drawCrop(g,s,x,y,t){const C=CROPS[s.crop],f=Math.min(1,s.g/C.days),ripe=s.g>=C.days,[cx,cy]=isoP(x+.5,y+.5),h=3+f*9;g.strokeStyle='#2f8f3a';g.lineWidth=1.4;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx,cy-h);g.stroke();
 [[-1,.5],[1,.7]].forEach(([dir,k])=>{g.beginPath();g.ellipse(cx+dir*3,cy-h*k,3,1.6,dir*.5,0,7);g.fillStyle='#5ccf5a';g.fill();g.strokeStyle=OLC;g.lineWidth=.5;g.stroke();});
 if(ripe){ell(g,cx,cy-h-3,3.5,3.5,C.c,OLC,.7);ell(g,cx-1,cy-h-4,1,1,'#fff',null);}}
function W2S(x,y,z){const [ix,iy]=isoP(x,y,z);return[cv.width/2+(ix-cam.x)*Z,cv.height/2+(iy-cam.y)*Z];}
function drawScene(t,night){const a=area,W=cv.width,H=cv.height;
 Z=a.room?Math.max(1.5,Math.min(W/((a.cols+a.rows)*TW/2+60),(H-120)/((a.cols+a.rows)*TH/2+70))):Math.max(1.5,Math.min(3.2,H/(isTouch?220:300)));
 const [px,py]=isoP(ptx(),pty());let tx2=px,ty2=py-10;if(a.room){const [mx,my]=isoP(a.cols/2,a.rows/2);tx2=mx;ty2=my-24;}
 if(camSnap){cam.x=tx2;cam.y=ty2;camSnap=0;}else{cam.x+=(tx2-cam.x)*.15;cam.y+=(ty2-cam.y)*.15;}
 const sky=ctx.createLinearGradient(0,0,0,H);if(a.room){sky.addColorStop(0,'#3a2c4a');sky.addColorStop(1,'#6a4a6a');}else if(a.ground==GRID){sky.addColorStop(0,'#141432');sky.addColorStop(1,'#3a1a5a');}else{const n=night;sky.addColorStop(0,n>.5?'#141432':'#9ad8ff');sky.addColorStop(1,n>.5?'#2a1a4a':'#e8f6ff');}
 ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 if(a.room){ctx.fillStyle='rgba(255,255,255,.05)';for(let i=-H;i<W;i+=40){ctx.beginPath();ctx.moveTo(i,H);ctx.lineTo(i+H,0);ctx.lineTo(i+H+16,0);ctx.lineTo(i+16,H);ctx.fill();}}
 ctx.setTransform(Z,0,0,Z,W/2-cam.x*Z,H/2-cam.y*Z);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 const gc=groundOf(a);ctx.drawImage(gc,-a.gox,-a.goy,gc.width/RS,gc.height/RS);
 if(!a.room)for(let i=0;i<70;i++){const x=(i*37)%a.cols,y=(i*53)%a.rows;if(a.tile[y][x]==WATER){const [cx,cy]=isoP(x+.5,y+.5);ctx.strokeStyle=`rgba(255,255,255,${.25+.3*Math.sin(t*2+i)})`;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(cx-4,cy);ctx.quadraticCurveTo(cx,cy-1.5,cx+4,cy);ctx.stroke();}}
 if(a.id=='village')for(const k in S.soil){const [x,y]=k.split(',').map(Number),s=S.soil[k];if(a.tile[y][x]!=SOIL)continue;const [cx,cy]=isoP(x,y);poly(ctx,[[cx,cy+1],[cx+15,cy+8],[cx,cy+15],[cx-15,cy+8]],s.w?'#5a3a24':'#8a5a36','rgba(0,0,0,.25)',.6);}
 const Dr=[];a.objs.forEach(o=>{const F=FURN[o.k];Dr.push({k:o.x+o.w/2+o.y+o.d/2-(F&&F.flat?50:0),f:()=>{if(o.k=='condo')drawSprite(ctx,condoSprite(S.condo.floors,S.condo.building),o.x,o.y);else drawSprite(ctx,spriteFor(o.k,o.v||0),o.x,o.y);}});});
 (S.nodes[a.id]||[]).forEach(o=>Dr.push({k:o.x+o.y+1,f:()=>{const s=spriteFor('n_'+o.type),[x,y]=isoP(o.x,o.y);ctx.drawImage(s.cv,x-s.ox,y-s.oy+(o.type=='neon'?Math.sin(t*3+o.x)*1.5:0),s.cv.width/RS,s.cv.height/RS);}}));
 if(a.id=='village')for(const k in S.soil){const s=S.soil[k];if(!s.crop)continue;const [x,y]=k.split(',').map(Number);Dr.push({k:x+y+1,f:()=>drawCrop(ctx,s,x,y,t)});}
 a.npcs.forEach(n=>Dr.push({k:n.px/16+n.py/16,f:()=>{const [x,y]=isoP(n.px/16,n.py/16);chibi(ctx,x,y,{...n.look,face:n.face},t+n.px,!!(n.dx||n.dy));}}));
 const pface=Math.abs(S.fx-S.fy)>Math.abs(S.fx+S.fy)?(S.fx>S.fy?'right':'left'):(S.fx+S.fy>0?'down':'up');
 Dr.push({k:ptx()+pty(),f:()=>{const [x,y]=isoP(ptx(),pty());chibi(ctx,x,y,{body:'#3a8aff',hair:'#6a3a1a',style:'short',hat:'#e8c050',face:pface,pants:'#2a3a6a'},walkT,moving);
  if(fishing){const [fx,fy]=isoP(fishing.x+.5,fishing.y+.5);ctx.strokeStyle='#eee';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x+6,y-24);ctx.quadraticCurveTo((x+fx)/2,y-30,fx,fy);ctx.stroke();ell(ctx,fx,fy+Math.sin(t*6),1.6,1.6,'#ff3050',null);}}});
 Dr.sort((p,q)=>p.k-q.k).forEach(d=>d.f());
 parts.forEach(p=>{const [x,y]=isoP(p.x,p.y,p.z);ell(ctx,x,y,1.3,1.3,p.c,null);});
 if(a.tags.portal){const r=a.tags.portal;box(ctx,r[0],r[1],0,3,3,8,'#6e6a88');const [cx,cy]=isoP(r[0]+1.5,r[1]+1.5,8);ctx.beginPath();ctx.ellipse(cx,cy-18,10,18,0,0,7);ctx.fillStyle=S.flags.portal?`rgba(255,106,213,${.7+.2*Math.sin(t*4)})`:'#2a2238';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#9a96b8';ctx.stroke();}
 if(path&&path.length){const [gx,gy]=path[path.length-1],[cx,cy]=isoP(gx+.5,gy+.5);ell(ctx,cx,cy,6+Math.sin(t*6),3+Math.sin(t*6)*.5,null,'#ffffff',1.2);}
 if(build){const g=ghostRect(),ok=!canPlace(g)&&canPay(g.d.cost);ctx.globalAlpha=.5;poly(ctx,[isoP(g.x,g.y),isoP(g.x+g.w,g.y),isoP(g.x+g.w,g.y+g.h),isoP(g.x,g.y+g.h)],ok?'#3dff9a':'#ff5070','#fff',1.2);ctx.globalAlpha=.65;if(OBJ[g.d.id])drawSprite(ctx,spriteFor(g.d.id),g.x,g.y);ctx.globalAlpha=1;}
 if(decor){const g=furnGhost(),ok=!canFurn(g)&&(hold||canPay(g.F.cost));ctx.globalAlpha=.5;poly(ctx,[isoP(g.x,g.y),isoP(g.x+g.w,g.y),isoP(g.x+g.w,g.y+g.d),isoP(g.x,g.y+g.d)],ok?'#3dff9a':'#ff5070','#fff',1.2);ctx.globalAlpha=.75;drawSprite(ctx,spriteFor(g.k),g.x,g.y);ctx.globalAlpha=1;}
 const nf=a.room?night*.15:night;ctx.setTransform(1,0,0,1,0,0);if(nf>0){ctx.fillStyle=`rgba(24,16,70,${.5*nf})`;ctx.fillRect(0,0,W,H);}
 ctx.setTransform(Z,0,0,Z,W/2-cam.x*Z,H/2-cam.y*Z);ctx.globalCompositeOperation='lighter';const ga=a.room?.25+.3*night:.06+.9*night;
 lightList(a).forEach(([x,y,z,r,c])=>{const [sx,sy]=isoP(x,y,z);ctx.globalAlpha=ga*.85;ctx.drawImage(glowS(c),sx-r,sy-r*.75,r*2,r*1.5);});ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 tagRects=[];ctx.setTransform(1,0,0,1,0,0);
 const tag=(x,y,z,label,stars,tx,ty)=>{const [sx,sy]=W2S(x,y,z);ctx.font=`bold ${Math.round(11*sc)}px sans-serif`;const w=ctx.measureText(label).width+24*sc,h=21*sc;ctx.beginPath();ctx.roundRect(sx-w/2,sy-h,w,h,h/2);ctx.fillStyle='rgba(50,50,66,.93)';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,sx,sy-h/2+.5);ctx.beginPath();ctx.moveTo(sx-4,sy);ctx.lineTo(sx,sy+5);ctx.lineTo(sx+4,sy);ctx.fillStyle='rgba(50,50,66,.93)';ctx.fill();
  if(stars!=null){ctx.font=`${Math.round(10*sc)}px sans-serif`;for(let i=0;i<5;i++){ctx.fillStyle=i<stars?'#ffd84a':'#6a6a7a';ctx.fillText('★',sx-18*sc+i*9*sc,sy+10*sc);}}tagRects.push({r:[sx-w/2,sy-h,w,h],x:tx,y:ty});};
 if(a.room){S.rooms[a.room].furn.forEach(f=>{const F=FURN[f.k];if(F.tag)tag(f.x+F.w/2,f.y+F.d/2,F.h+6,F.tag,F.comfort?Math.min(5,F.comfort+1):null,f.x,f.y);});tag(a.exit[0]+.5,a.exit[1]+.5,10,'EXIT',null,a.exit[0],a.exit[1]);}
 else if(a.id=='village'){tag(CONDO.x+2.5,CONDO.y+4,104+(S.condo.floors+S.condo.building)*26,'CONDO',Math.min(5,S.condo.floors),CONDO.door[0],CONDO.door[1]-1);S.blds.forEach(b=>{if(['stall','workshop'].includes(b.id))tag(b.x+BL[b.id].w/2,b.y+BL[b.id].h/2,62,b.id=='stall'?'SHOP':'WORKSHOP',null,b.x,b.y+BL[b.id].h-1);});}
 else{a.exitList.forEach(x=>{const k=(x.f+x.t+1)/2;const [i,j]=x.side=='E'?[a.cols-.5,k]:x.side=='W'?[.5,k]:x.side=='N'?[k,.5]:[k,a.rows-.5];tag(i,j,22,(x.side=='W'||x.side=='N'?'← ':'')+AREAS[x.to].name+(x.side=='E'||x.side=='S'?' →':''),null,Math.min(a.cols-1,Math.floor(i)),Math.min(a.rows-1,Math.floor(j)));});
  for(const k in a.tags){const r=a.tags[k];const lbl=k=='bridge'?'BROKEN BRIDGE':k=='portal'?(S.flags.portal?'PORTAL':'ANCIENT PORTAL'):k=='shopA'?'SEEDS':'MARKET';tag(r[0]+r[2]/2,r[1]+r[3]/2,k=='portal'?52:44,lbl,null,r[0],r[1]);}}}
function drawHUD(t){ctx.setTransform(1,0,0,1,0,0);const W=cv.width,H=cv.height;
 const s=Math.round((isTouch?38:44)*sc),n=7,hx=Math.round((W-n*(s+6))/2),hy=H-s-12;hotRects=[];
 ctx.beginPath();ctx.roundRect(hx-8,hy-8,n*(s+6)+10,s+16,14);ctx.fillStyle='rgba(42,34,56,.85)';ctx.fill();ctx.strokeStyle=build||decor?'#9fff7a':'#ffffff88';ctx.lineWidth=2;ctx.stroke();
 const slot=(i,sel,dim,draw)=>{const x=hx+i*(s+6);hotRects.push([x,hy,s,s]);ctx.beginPath();ctx.roundRect(x,hy,s,s,9);ctx.fillStyle=sel?'#fff4d0':'#f4f0f8';ctx.fill();ctx.strokeStyle=sel?'#ffb43a':'#c8c0d8';ctx.lineWidth=sel?3:1.5;ctx.stroke();ctx.globalAlpha=dim?.35:1;draw(x);ctx.globalAlpha=1;};
 if(build||decor){const list=build?BLD:FURNLIST,cur=build?bsel:fsel;bOff=Math.max(0,Math.min(list.length-n,cur-3));for(let i=0;i<n;i++){const it=list[i+bOff];if(!it)break;const id=build?it.id:it,def=build?it:FURN[it];
   slot(i,i+bOff==cur,!canPay(def.cost)||build&&def.u&&S.blds.some(b=>b.id==def.id),x=>{if(OBJ[id]||FURN[id]){const sp=spriteFor(id),k=Math.min((s-6)/(sp.cv.width/RS),(s-6)/(sp.cv.height/RS)),w=sp.cv.width/RS*k,h=sp.cv.height/RS*k;ctx.drawImage(sp.cv,x+(s-w)/2,hy+(s-h)/2,w,h);}
    else{ctx.fillStyle=id=='dock'?'#c8945a':'#d8c090';ctx.beginPath();ctx.moveTo(x+s/2,hy+s*.3);ctx.lineTo(x+s*.85,hy+s/2);ctx.lineTo(x+s/2,hy+s*.7);ctx.lineTo(x+s*.15,hy+s/2);ctx.fill();ctx.strokeStyle=OLC;ctx.stroke();}});}
  const def=build?BLD[bsel]:FURN[hold?hold.k:FURNLIST[fsel]];const txt=hold?`Moving ${def.n} — tap a spot, tap again to place`:`${def.n} — ${costStr(def.cost)}${build?' · '+def.d:' · comfort +'+(def.comfort||0)}`;
  ctx.font=`bold ${Math.round(12*sc)}px sans-serif`;const tw=ctx.measureText(txt).width+28;ctx.beginPath();ctx.roundRect(W/2-tw/2,hy-42*sc,tw,26*sc,13*sc);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=canPay(def.cost)||hold?'#2a2238':'#c03050';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,W/2,hy-29*sc);}
 else{HOT.forEach((it,i)=>slot(i,i==S.sel,false,x=>{icon(it.id,x+s*.15,hy+s*.12,s*.7);if(it.crop){ctx.fillStyle='#2a2238';ctx.font=`bold ${Math.round(10*sc)}px sans-serif`;ctx.textAlign='right';ctx.textBaseline='alphabetic';ctx.fillText(S.inv[it.id]||0,x+s-4,hy+s-4);ctx.textAlign='left';}if(S.tools[it.id]>1){ctx.fillStyle='#ffb43a';ctx.textAlign='left';ctx.fillText('★',x+3,hy+12);}}));}
 ctx.textAlign='center';ctx.textBaseline='middle';const tb=hy-(build||decor?54:14)*sc;ctx.font=`bold ${Math.round(12*sc)}px sans-serif`;
 toasts.forEach((tt,i)=>{const j=toasts.length-1-i;ctx.globalAlpha=Math.min(1,tt.life);const w=ctx.measureText(tt.t).width+24,y=tb-(j+1)*26*sc;ctx.beginPath();ctx.roundRect(W/2-w/2,y-11*sc,w,22*sc,11*sc);ctx.fillStyle='rgba(42,34,56,.9)';ctx.fill();ctx.fillStyle='#fff';ctx.fillText(tt.t,W/2,y);});ctx.globalAlpha=1;
 if(banner&&banner.l>0){ctx.globalAlpha=Math.min(1,banner.l);ctx.font=`bold ${Math.round(20*sc)}px sans-serif`;const w=ctx.measureText(banner.t).width+50;ctx.beginPath();ctx.roundRect(W/2-w/2,H*.22-19*sc,w,38*sc,19*sc);ctx.fillStyle='rgba(255,255,255,.92)';ctx.fill();ctx.strokeStyle='#2a2238';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#2a2238';ctx.fillText(banner.t.toUpperCase(),W/2,H*.22);ctx.globalAlpha=1;}
 ctx.textAlign='left';ctx.textBaseline='alphabetic';if(fade>0){ctx.fillStyle=`rgba(0,0,0,${Math.min(1,fade)})`;ctx.fillRect(0,0,W,H);}}
let lastTop='';function updateTop(){const h=Math.floor(S.min/60)%24,m=Math.floor(S.min%60/10)*10,ap=h<12?'AM':'PM',hh=(h%12)||12,tm=`DAY ${S.day} · ${hh}:${String(m).padStart(2,'0')} ${ap}`;
 const res=RES.map(k=>`<span class="chip" title="${ITEMS[k].n}"><i class="ic ic-${k}"></i>${S.inv[k]||0}</span>`).join('');const key=tm+S.gold+S.hearts+res+(area&&area.name);if(key==lastTop)return;lastTop=key;
 $('timer').textContent=tm;$('gold').textContent=String(S.gold).padStart(8,'0');$('hearts').textContent=S.hearts;$('res').innerHTML=res;$('where').textContent=(area?area.name:'')+' · '+VERSION;}
function updateButtons(){const nn=!dlg.on&&!showMap&&!showCondo&&!menuOpen()&&nearNpc();$('talk').classList.toggle('show',!!nn);if(nn)$('talk').textContent='TALK · '+nn.n.split(' ')[0].toUpperCase();
 $('back').classList.toggle('show',!!(area.room||build||decor||showMap||showCondo));$('bbuild').textContent=area.room?(decor?'DONE':'DECOR'):(build?'DONE':'BUILD');document.body.classList.toggle('modal',showMap||showCondo||dlg.on);document.body.classList.toggle('mapopen',showMap);}
function thumb(id){const a=AREAS[id];if(!a.thumb){const keep=area;area=a;const gc=groundOf(a);const c=document.createElement('canvas'),k=320/(gc.width/RS);c.width=320;c.height=Math.round(gc.height/RS*k);const g=c.getContext('2d');g.imageSmoothingEnabled=true;g.drawImage(gc,0,0,c.width,c.height);g.save();g.scale(k,k);g.translate(a.gox,a.goy);
  [...a.objs].sort((p,q)=>p.x+p.y-q.x-q.y).forEach(o=>{if(o.k=='condo')drawSprite(g,condoSprite(S.condo.floors,S.condo.building),o.x,o.y);else drawSprite(g,spriteFor(o.k,o.v||0),o.x,o.y);});g.restore();a.thumb=c;a.tk=k;area=keep;}return a.thumb;}
function thumbXY(id,px,py,w,h){const a=AREAS[id],th=thumb(id),[ix,iy]=isoP(ptx(),pty());return[px+(ix+a.gox)*a.tk*w/th.width,py+(iy+a.goy)*a.tk*h/th.height];}
let last=performance.now(),T0=0;
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;T0+=dt;update(dt);const night=nightF();
 if(showMap){const keep=area;if(area.room)area=AREAS.village;drawMap(T0);area=keep;}else if(showCondo)drawCondo(T0);else{drawScene(T0,night);drawHUD(T0);}
 updateTop();updateButtons();requestAnimationFrame(frame);}
goArea(S.area.startsWith('room:')&&!S.rooms[S.area.slice(5)]?'village':S.area,[S.px/16-.5,S.py/16-.5]);applyOpt();
if(!loaded)setTimeout(()=>{toast(S.oldSave?'Fantasy Town v0.0.0.7! Old save reset (+150g bonus)':'Welcome, manager! Tap the CONDO to post an ad');toast(isTouch?'Tap the ground to walk · BUILD to build':'Click to walk · E use · B build · M map');},400);
requestAnimationFrame(frame);
window.FT={get S(){return S},get area(){return area},act,place,placeFurn,goArea,travel,ROUTES,refresh,startDialogue,condoAct,enterRoom,walkTo,setPos(x,y){S.px=(x+.5)*16;S.py=(y+.5)*16;camSnap=1;},set bsel(v){bsel=v},set fsel(v){fsel=v},set build(v){build=v},set decor(v){decor=v},set ghost(v){ghostAt=v},set map(v){showMap=v},set condo(v){showCondo=v},set scroll(v){condoScroll=v},CHARS};
