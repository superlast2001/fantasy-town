'use strict';
// Fantasy Town v0.0.0.6 — build-your-village neon life sim. Helpers in art.js.
const VERSION='v0.0.0.6',SAVE='fantasytown_save_v6';
const cv=document.getElementById('c'),ctx=cv.getContext('2d'),menuEl=document.getElementById('menu');
const Q=new URLSearchParams(location.search);
const G=0,ROAD=1,WATER=2,SAND=3,GRID=4,CONC=5,SOIL=6,BOARD=7,DIRT=8,POOL=9,CHECK=10,ROCK=12,WALL=13,PATH=14,DARKG=15;
// ---------- data ----------
const ITEMS={wood:{n:'Wood',p:4,c:'#9a6a3a'},ore:{n:'Ore',p:12,c:'#8fa3c8'},scrap:{n:'Scrap',p:6,c:'#b0a080'},shell:{n:'Shell',p:9,c:'#ffd0e8'},neon:{n:'Neon',p:20,c:'#ff4fd8'},
 fish:{n:'Glowfish',p:18,c:'#38e0ff'},turnip:{n:'Lumi Turnip',p:30,c:'#e8f0ff'},berry:{n:'Glowberry',p:55,c:'#3dff9a'},star:{n:'Starfruit',p:120,c:'#ffd84a'}};
const CROPS={turnip:{seed:'s_turnip',days:3,c:'#e8f0ff',cost:15},berry:{seed:'s_berry',days:4,c:'#3dff9a',cost:30},star:{seed:'s_star',days:6,c:'#ffd84a',cost:60,city:1}};
const HOT=[{id:'hoe',n:'Hoe'},{id:'can',n:'Water Can'},{id:'pick',n:'Pickaxe'},{id:'rod',n:'Rod'},{id:'s_turnip',n:'Turnip Seed',crop:'turnip'},{id:'s_berry',n:'Berry Seed',crop:'berry'},{id:'s_star',n:'Star Seed',crop:'star'}];
const RES=['wood','ore','scrap','shell','neon','fish'];
// buildings (village build mode)
const BLD=[
 {id:'path',n:'Neon Path',w:1,h:1,cost:{gold:2},d:'Glowing walkway'},
 {id:'lamp',n:'Street Lamp',w:1,h:1,cost:{gold:5,scrap:1},d:'Lights the night'},
 {id:'flowers',n:'Glow Flowers',w:1,h:1,cost:{gold:3},d:'Decoration',walk:1},
 {id:'fence',n:'Fence',w:1,h:1,cost:{wood:1},d:'Decoration'},
 {id:'plot',n:'Farm Plot',w:3,h:3,cost:{gold:10,wood:3},d:'9 tiles of soil to farm',walk:1},
 {id:'stall',n:'Shop Stall',w:4,h:3,cost:{gold:50,wood:8},u:1,d:'Unlocks selling + seeds. Mira moves in'},
 {id:'cottage',n:'Villager Cottage',w:3,h:3,cost:{gold:80,wood:12,ore:2},d:'A new villager moves in'},
 {id:'workshop',n:'Workshop',w:4,h:3,cost:{gold:100,wood:15,ore:5,scrap:8},u:1,d:'Tool upgrades. Bolt moves in'},
 {id:'dock',n:'Boat Dock',w:3,h:3,cost:{gold:80,wood:12,shell:3},u:1,d:'Place on water. Fishing + boat to Shell Isle',water:1},
 {id:'busstop',n:'Bus Stop',w:3,h:2,cost:{gold:150,scrap:10},u:1,d:'Bus route to Rust Badlands'},
 {id:'cable',n:'Cable Car Station',w:3,h:3,cost:{gold:200,ore:12,scrap:10},u:1,d:'Cable car to Mount Vapor'},
 {id:'train',n:'Train Station',w:5,h:3,cost:{gold:400,ore:20,neon:5},u:1,d:'Train to Neon City'},
 {id:'fountain',n:'Holo Fountain',w:3,h:3,cost:{gold:60,shell:4,neon:2},d:'Plaza centerpiece'},
];
const BL=Object.fromEntries(BLD.map(b=>[b.id,b]));
const HOMEUP=[{n:'Tent'},{n:'Cottage',cost:{gold:150,wood:20,ore:3}},{n:'Neon Manor',cost:{gold:500,wood:30,ore:10,neon:6}}];
const REPAIR={bridge:{n:'Repair the old bridge',cost:{wood:15,ore:3}},portal:{n:'Re-light the ancient portal',cost:{neon:8,shell:6,ore:5}}};
const ROUTES=[
 {a:'village',b:'forest',type:'walk'},{a:'forest',b:'badlands',type:'walk',req:'bridge'},{a:'badlands',b:'mine',type:'walk'},
 {a:'village',b:'badlands',type:'bus',req:'busstop'},{a:'village',b:'mine',type:'cable',req:'cable'},{a:'village',b:'island',type:'boat',req:'dock'},
 {a:'village',b:'city',type:'train',req:'train'},{a:'mine',b:'city',type:'magic',req:'portal'}];
const RT={walk:{n:'Walking Path',c:'#111111'},blocked:{n:'Blocked Path',c:'#8a7350'},magic:{n:'Magic Path',c:'#ff6ad5'},bus:{n:'Bus Route',c:'#ffcc00'},train:{n:'Train Route',c:'#e8202a'},boat:{n:'Boat Route',c:'#109a2a'},cable:{n:'Cable Car Route',c:'#5a5aff'}};
const VILLAGERS={stall:{n:'Mira',c:'#ff4fd8',h:'#2a1040',lines:['My stall buys anything you gather! Seeds are on the left shelf.','Neon City pays more... but you need a train to get there.']},
 workshop:{n:'Bolt',c:'#3dff9a',h:'#ff8a2a',lines:['Beep. Bring ore and scrap, I upgrade tools.','Upgraded pickaxe = more ore per swing.']},
 dock:{n:'Old Coral',c:'#38e0ff',h:'#c0c0c0',lines:['Face the water with your rod. Glowfish bite best at night.','My boat can take you to Shell Isle any time — use the map.']},
 cottage:[{n:'Pip',c:'#ffb43a',h:'#5a3a1a',lines:['Thanks for the cottage! This village is getting cozy.','I heard the bridge in Whisper Forest can be fixed with wood and ore.']},
  {n:'Nova',c:'#c45bff',h:'#ffd84a',lines:['More lamps please! I love the glow at night.','A cable car would let us visit Mount Vapor.']},
  {n:'Sigil',c:'#5b6cff',h:'#111',lines:['There is an old portal deep in the mine. It hums with neon.','A fountain would make this a real plaza.']},
  {n:'Amber',c:'#ff6a6a',h:'#ffe0a0',lines:['I sell nothing, I just like it here.','Crops only grow if watered before you sleep.']}]};
// ---------- areas ----------
const AREAS={},AORDER=['village','forest','badlands','mine','island','city'];
function mkArea(id,name,region,col,cols,rows,ground,gen){const a={id,name,region,col,cols,rows,tile:[],solid:[],gen,ground,exits:[],lights:[],npcs:[],spawn:[4,4],station:null,tags:{}};AREAS[id]=a;return a;}
const A_V=mkArea('village','Hearth Village','HEARTH VILLAGE','#e8d8c0',46,30,G),A_F=mkArea('forest','Whisper Forest','WHISPER WOODS','#d8f0e0',40,26,DARKG),
 A_B=mkArea('badlands','Rust Badlands','RUST BADLANDS','#f2f2d8',40,26,DIRT),A_M=mkArea('mine','Vapor Mine','MOUNT VAPOR','#d8eef2',36,24,ROCK),
 A_I=mkArea('island','Shell Isle','SHELL ISLE','#dcf5e4',40,26,WATER),A_C=mkArea('city','Neon City','NEON CITY','#fadde6',46,28,GRID);
// exits: [area,side,from,to,target,targetSide]
const EXITS=[['village','E',12,15,'forest','W'],['forest','E',12,13,'badlands','W'],['badlands','N',18,21,'mine','S']];
const isUnlocked=r=>!r.req||(S.flags[r.req])||S.blds.some(b=>b.id==r.req);
let S;
function newState(){return{v:6,day:1,min:6*60,gold:100,inv:{s_turnip:5,wood:4},area:'village',px:6*T+8,py:8*T+4,face:'down',sel:0,soil:{},nodes:{},blds:[],flags:{},home:0,tools:{pick:1,can:1,rod:1},visited:{village:1},stats:{built:0}};}
// generic helpers on area
const AF=(a,x,y,w,h,t)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(a.tile[j]&&i>=0&&i<a.cols)a.tile[j][i]=t;};
const AS=(a,x,y,w,h,v=1)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(a.solid[j]&&i>=0&&i<a.cols)a.solid[j][i]=v;};
function layout(a){a.tile=[];a.solid=[];for(let y=0;y<a.rows;y++){a.tile.push(new Array(a.cols).fill(a.ground));a.solid.push(new Array(a.cols).fill(0));}
 AS(a,0,0,a.cols,1);AS(a,0,a.rows-1,a.cols,1);AS(a,0,0,1,a.rows);AS(a,a.cols-1,0,1,a.rows);a.lights=[];a.deco=[];a.tags={};
 a.exitList=[];EXITS.forEach(e=>{if(e[0]==a.id)a.exitList.push({side:e[1],f:e[2],t:e[3],to:e[4],ts:e[5]});if(e[4]==a.id)a.exitList.push({side:e[5],f:e[2],t:e[3],to:e[0],ts:e[1]});});
 a.exitList.forEach(x=>{for(let k=x.f;k<=x.t;k++){if(x.side=='E')a.solid[k][a.cols-1]=0,a.tile[k][a.cols-1]=PATH;if(x.side=='W')a.solid[k][0]=0,a.tile[k][0]=PATH;if(x.side=='N')a.solid[0][k]=0,a.tile[0][k]=PATH;if(x.side=='S')a.solid[a.rows-1][k]=0,a.tile[a.rows-1][k]=PATH;}});
}
const RESERVED={x:2,y:2,w:9,h:7};// home lot in village
function genVillage(a){layout(a);
 AF(a,1,25,a.cols-2,4,WATER);AS(a,1,25,a.cols-2,4);
 AF(a,6,9,1,4,PATH);AF(a,6,12,a.cols-6,2,PATH);// dirt lane to east exit
 a.spawn=[6,9];
 S.blds.forEach(b=>{const d=BL[b.id];if(b.id=='path')AF(a,b.x,b.y,1,1,PATH);else if(b.id=='plot')AF(a,b.x,b.y,3,3,SOIL);else if(b.id=='dock'){AF(a,b.x,b.y,3,3,BOARD);AS(a,b.x,b.y,3,3,0);}
  else if(!d.walk)AS(a,b.x,b.y,d.w,d.h);});
 const hf=[[5,6,3,2],[4,4,5,3],[3,3,7,4]][S.home];AS(a,...hf);a.door=[6,hf[1]+hf[3]-1];
 a.wild=[[14,4],[20,3],[31,5],[38,8],[40,18],[27,19],[16,20],[9,17],[3,21],[43,4]];// decorative wild trees
 a.wild.forEach(([x,y])=>{if(!S.blds.some(b=>x>=b.x&&x<b.x+BL[b.id].w&&y>=b.y&&y<b.y+BL[b.id].h))a.solid[y][x]=1;});
}
function genForest(a){layout(a);a.spawn=[3,12];
 const r=rng(42);for(let i=0;i<120;i++){const x=1+Math.floor(r()*30),y=1+Math.floor(r()*24);if(y>=10&&y<=15)continue;a.deco.push(['tree',x,y]);a.solid[y][x]=1;}
 AF(a,0,12,40,2,PATH);AF(a,31,1,3,24,WATER);AS(a,31,1,3,24);
 if(S.flags.bridge){AF(a,31,12,3,2,BOARD);AS(a,31,12,3,2,0);}else{a.tags.bridge=[31,12,3,2];}
 for(let i=0;i<14;i++){const x=1+Math.floor(r()*30),y=1+Math.floor(r()*24);if(!a.solid[y][x])a.deco.push(['shroom',x,y]);}
 for(let i=0;i<30;i++){const x=34+Math.floor(r()*5),y=1+Math.floor(r()*24);if(y<11||y>14){a.deco.push(['tree',x,y]);a.solid[y][x]=1;}}
}
function genBadlands(a){layout(a);a.spawn=[3,12];a.station=[8,16];
 AF(a,0,12,20,2,PATH);AF(a,18,0,4,13,PATH);
 const r=rng(7);for(let i=0;i<6;i++){const x=24+i%3*4,y=16+Math.floor(i/3)*4;a.deco.push(['container',x,y,['#7a3a2a','#3a5a7a','#5a6a3a'][i%3]]);AS(a,x,y,3,2);}
 a.deco.push(['crane',34,3]);AS(a,34,3,2,10);a.deco.push(['busSign',7,15]);a.solid[15][7]=1;
 for(let i=0;i<30;i++){const x=Math.floor(r()*40),y=Math.floor(r()*26);if(x>=24&&y>=15)continue;a.deco.push(['rock',x,y]);}
}
function genMine(a){layout(a);a.spawn=[17,21];a.station=[6,20];
 for(let y=0;y<a.rows;y++)for(let x=0;x<a.cols;x++){const edge=x<2||y<2||x>a.cols-3;if(edge&&!(y>=a.rows-2)){a.tile[y][x]=WALL;a.solid[y][x]=1;}}
 const r=rng(3);for(let i=0;i<28;i++){const x=3+Math.floor(r()*30),y=3+Math.floor(r()*17);if(Math.abs(x-17)<3&&y>14)continue;if(Math.abs(x-28)<3&&y<9)continue;a.tile[y][x]=WALL;a.solid[y][x]=1;if(r()<.4)a.deco.push(['crystal',x,y]);}
 AF(a,16,18,4,6,PATH);a.deco.push(['cableSt',4,18]);AS(a,4,18,3,2);
 a.tags.portal=[27,4,3,3];AS(a,27,4,3,3);a.portalOn=!!S.flags.portal;
}
function genIsland(a){layout(a);a.spawn=[20,7];a.station=[20,7];
 for(let y=0;y<a.rows;y++)for(let x=0;x<a.cols;x++){const dx=(x-20)/14,dy=(y-12)/8.5,d=dx*dx+dy*dy;if(d<1){a.tile[y][x]=d<.75?SAND:SAND;}else a.solid[y][x]=1;}
 AF(a,19,2,3,5,BOARD);AS(a,19,2,3,5,0);AF(a,29,15,2,8,BOARD);AS(a,29,15,2,8,0);
 [[10,10],[12,15],[25,9],[30,12],[16,17],[22,18]].forEach(([x,y])=>{a.deco.push(['palm',x,y]);a.solid[y][x]=1;});
 a.deco.push(['hut',13,8]);AS(a,13,8,4,3);
}
function genCity(a){layout(a);a.spawn=[22,24];a.station=[22,24];
 AF(a,0,22,46,6,CONC);
 [[2,2,6,9,'#5b6cff'],[9,2,5,11,'#38e0ff'],[31,2,6,10,'#ff4fd8'],[38,2,6,8,'#8f7bff']].forEach(t=>{a.deco.push(['tower',...t]);AS(a,t[0],t[1],t[2],t[3]);});
 a.deco.push(['fount',21,10]);AS(a,21,10,4,3);
 [[16,3,'#38e0ff','SEEDS'],[23,3,'#3dff9a','MARKET']].forEach(s=>{a.deco.push(['stall',s[0],s[1],s[2],s[3]]);AS(a,s[0],s[1],6,4);a.tags['shop'+s[0]]=[s[0],s[1],6,4];});
 a.deco.push(['trainSt',19,23]);AS(a,19,23,8,3);
 a.npcStatic=[{n:'Mayor Lumen',x:12,y:16,c:'#ffd84a',h:'#f0f0f0',lines:['Welcome to Neon City, builder! Our market pays 50% more.','Starfruit seeds are only sold here.']},
  {n:'Vexa',x:30,y:17,c:'#ff4fd8',h:'#3a1a5a',lines:['The nightclub never closes. Neither do I.','The portal in Vapor Mine links straight here once it is lit.']},
  {n:'Conductor Rail',x:28,y:21,c:'#e8202a',h:'#222',lines:['All aboard for Hearth Village — just open the map.']}];
}
A_V.gen=genVillage;A_F.gen=genForest;A_B.gen=genBadlands;A_M.gen=genMine;A_I.gen=genIsland;A_C.gen=genCity;
// ---------- art ----------
function drawTile(c,a,x,y,r){const t=a.tile[y][x],px=x*T,py=y*T,v=r();
 switch(t){
 case G:rect(c,px,py,T,T,v<.5?'#2f6b3a':'#2c6536');for(let i=0;i<3;i++)rect(c,px+Math.floor(r()*15),py+Math.floor(r()*14),1,2,'#3f8a47');break;
 case DARKG:rect(c,px,py,T,T,v<.5?'#1f4a2c':'#1c4528');for(let i=0;i<3;i++)rect(c,px+Math.floor(r()*15),py+Math.floor(r()*14),1,2,'#2c6a3a');break;
 case PATH:rect(c,px,py,T,T,'#5a4a3a');rect(c,px+1,py+1,T-2,T-2,'#64523f');if(r()<.5)rect(c,px+Math.floor(r()*13),py+Math.floor(r()*13),2,2,'#4a3c2e');break;
 case WATER:rect(c,px,py,T,T,v<.5?'#0d2050':'#0f2458');if(r()<.3)rect(c,px+Math.floor(r()*12),py+Math.floor(r()*14),4,1,'#1c3c80');break;
 case SAND:rect(c,px,py,T,T,v<.5?'#c8b07a':'#c0a872');for(let i=0;i<3;i++)rect(c,px+Math.floor(r()*15),py+Math.floor(r()*15),1,1,'#e0c890');break;
 case GRID:rect(c,px,py,T,T,'#16123a');rect(c,px,py,T,1,'#3a2cff');rect(c,px,py,1,T,'#3a2cff');break;
 case CONC:rect(c,px,py,T,T,(x+y)%2?'#3a3a52':'#36364c');rect(c,px,py,T,1,'#43435e');break;
 case SOIL:rect(c,px,py,T,T,'#4a3220');rect(c,px+1,py+1,T-2,T-2,'#553a26');rect(c,px+2,py+5,12,1,'#3e2a1a');rect(c,px+2,py+11,12,1,'#3e2a1a');break;
 case BOARD:rect(c,px,py,T,T,'#7b5a3c');for(let i=0;i<4;i++)rect(c,px,py+i*4+3,T,1,'#4f3520');break;
 case DIRT:rect(c,px,py,T,T,v<.5?'#6a4a38':'#664634');if(r()<.4)rect(c,px+Math.floor(r()*13),py+Math.floor(r()*13),3,2,'#5a3c2c');break;
 case ROCK:rect(c,px,py,T,T,v<.5?'#2a2838':'#282634');if(r()<.3)rect(c,px+Math.floor(r()*13),py+Math.floor(r()*13),3,2,'#34324a');break;
 case WALL:rect(c,px,py,T,T,'#3e3a52');rect(c,px,py,T,3,'#56506e');rect(c,px+3,py+6,5,3,'#2e2a40');rect(c,px,py+T-2,T,2,'#1a1826');break;}
}
// water edge foam
function edges(c,a){for(let y=1;y<a.rows;y++)for(let x=0;x<a.cols;x++){if(a.tile[y][x]==WATER&&a.tile[y-1][x]!=WATER&&a.tile[y-1][x]!=BOARD){rect(c,x*T,y*T,T,2,'#8fd8ff');rect(c,x*T,y*T+2,T,1,'#3a7ac0');}
 if(a.tile[y][x]!=WATER&&a.tile[y-1][x]==WATER&&a.tile[y][x]!=BOARD)rect(c,x*T,y*T,T,2,'#8fd8ff');}}
function both(a,f){f(a.b);f(a.e);}
function drawBuilding(a,bd,ghost){const d=BL[bd.id],px=bd.x*T,py=bd.y*T,pw=d.w*T,ph=d.h*T,L=a.lights,E=f=>both(a,f),b=a.b;
 switch(bd.id){
 case'path':E(c=>{rect(c,px+7,py+7,2,2,'#38e0ff');});break;
 case'lamp':rect(b,px+7,py+2,2,13,'#555');rect(b,px+5,py+14,6,2,'#333');E(c=>{rect(c,px+4,py-2,8,5,'#ffe9a8');rect(c,px+5,py-3,6,1,'#fff');});L.push([px+8,py,48,'#ffd88a']);break;
 case'flowers':[[3,10,'#ff4fd8'],[9,6,'#38e0ff'],[11,12,'#ffd84a'],[5,4,'#3dff9a']].forEach(([x,y,col])=>{rect(b,px+x,py+y+2,1,3,'#2a8a3a');E(c=>rect(c,px+x-1,py+y,3,3,col));});L.push([px+8,py+8,14,'#ff4fd8']);break;
 case'fence':rect(b,px,py+6,T,2,'#9a6a3a');rect(b,px,py+11,T,2,'#9a6a3a');rect(b,px+2,py+3,2,12,'#7a4a2a');rect(b,px+12,py+3,2,12,'#7a4a2a');break;
 case'plot':rect(b,px-2,py-2,pw+4,2,'#9a6a3a');rect(b,px-2,py+ph,pw+4,2,'#9a6a3a');rect(b,px-2,py,2,ph,'#9a6a3a');rect(b,px+pw,py,2,ph,'#9a6a3a');break;
 case'stall':rect(b,px+4,py+ph-2,pw,6,'#0007');rect(b,px,py+16,pw,ph-16,'#2a2246');
  E(c=>{for(let i=0;i<pw;i+=8){rect(c,px+i,py,4,16,'#ff4fd8');rect(c,px+i+4,py,4,16,'#8a2a7a');}rect(c,px,py+16,pw,2,'#fff');rect(c,px+6,py+24,pw-12,10,'#c84aa8');
   for(let i=0;i<5;i++)rect(c,px+10+i*10,py+26,5,5,['#ffd84a','#ff6a6a','#9fff7a','#fff','#38e0ff'][i]);c.font='bold 8px monospace';c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText('SHOP',px+pw/2,py+ph-6);});L.push([px+pw/2,py+ph,70,'#ff4fd8']);break;
 case'cottage':{const col=['#ffb43a','#c45bff','#5b6cff','#ff6a6a'][bd.n%4];rect(b,px+3,py+ph-3,pw,6,'#0007');rect(b,px+2,py+14,pw-4,ph-14,'#d8ccb8');rect(b,px-1,py+2,pw+2,14,shade(col,.6));rect(b,px+2,py,pw-4,4,shade(col,.8));
  rect(b,px+pw/2-4,py+ph-12,8,12,'#5b3a20');E(c=>{rect(c,px+6,py+20,8,7,'#ffd88a');rect(c,px+pw-14,py+20,8,7,'#ffd88a');rect(c,px+pw/2+2,py+ph-7,2,2,col);});L.push([px+pw/2,py+ph-4,40,'#ffcf7a']);break;}
 case'workshop':rect(b,px+4,py+ph-2,pw,6,'#0007');rect(b,px,py+10,pw,ph-10,'#4a4a5e');rect(b,px-2,py+2,pw+4,10,'#2e2e40');for(let i=0;i<pw;i+=8)rect(b,px+i,py+2,1,10,'#444458');
  rect(b,px+8,py+22,22,ph-22,'#2a2a38');for(let j=py+24;j<py+ph;j+=4)rect(b,px+8,j,22,1,'#3a3a4a');rect(b,px+pw-14,py-8,6,12,'#555');
  E(c=>{rect(c,px+38,py+20,16,8,'#ffb43a');c.font='bold 7px monospace';c.fillStyle='#ffb43a';c.textAlign='center';c.textBaseline='middle';c.fillText('WORKSHOP',px+pw/2,py+15);});L.push([px+46,py+26,40,'#ffb43a']);break;
 case'dock':for(let i=0;i<3;i++)rect(b,px+i*16+2,py+ph-2,3,6,'#3a2414');rect(b,px,py,pw,2,'#9a7a5a');E(c=>{rect(c,px+2,py+ph-6,4,4,'#3dff9a');rect(c,px+pw-6,py+ph-6,4,4,'#3dff9a');});
  drawBoatOn(b,px+pw+4,py+16,'#3dff9a');L.push([px+pw/2,py+ph,40,'#3dff9a']);break;
 case'busstop':rect(b,px+2,py+ph-2,pw,5,'#0007');rect(b,px,py+4,pw,4,'#ffcc00');rect(b,px+2,py+8,2,ph-8,'#888');rect(b,px+pw-4,py+8,2,ph-8,'#888');rect(b,px+6,py+20,pw-12,4,'#7a5a3a');
  E(c=>{rect(c,px+4,py,pw-8,5,'#ffcc00');c.font='bold 6px monospace';c.fillStyle='#000';c.textAlign='center';c.textBaseline='middle';c.fillText('BUS',px+pw/2,py+3);});L.push([px+pw/2,py+6,34,'#ffcc00']);break;
 case'cable':rect(b,px+4,py+ph-2,pw,6,'#0007');rect(b,px,py+12,pw,ph-12,'#3a4a6a');rect(b,px+pw/2-1,py-24,3,36,'#888');rect(b,px+pw/2,py-24,40,1,'#aaa');
  E(c=>{rect(c,px+pw/2+20,py-22,10,8,'#5a5aff');rect(c,px+pw/2+22,py-20,6,3,'#bff');rect(c,px+6,py+18,pw-12,6,'#8a8aff');});L.push([px+pw/2,py+ph,50,'#5a5aff']);break;
 case'train':rect(b,px+4,py+ph-2,pw,6,'#0007');rect(b,px,py+12,pw,ph-12,'#3a2a3a');rect(b,px-2,py+4,pw+4,10,'#5a2030');rect(b,px,py+ph-6,pw,2,'#888');rect(b,px,py+ph-3,pw,2,'#888');
  E(c=>{for(let i=0;i<5;i++)rect(c,px+6+i*15,py+18,8,8,'#ffe08a');c.font='bold 8px monospace';c.fillStyle='#ff6a6a';c.textAlign='center';c.textBaseline='middle';c.fillText('STATION',px+pw/2,py+9);});L.push([px+pw/2,py+ph,70,'#e8202a']);break;
 case'fountain':E(c=>{c.fillStyle='#2a2a6a';c.beginPath();c.ellipse(px+24,py+30,22,12,0,0,7);c.fill();c.fillStyle='#38e0ff';c.beginPath();c.ellipse(px+24,py+29,18,8,0,0,7);c.fill();});L.push([px+24,py+24,70,'#38e0ff']);break;}
}
function drawBoatOn(c,x,y,col){rect(c,x,y+6,22,5,'#ddd');rect(c,x+2,y+11,18,2,'#999');rect(c,x+7,y+1,8,5,'#eef');rect(c,x+3,y+8,16,1,col);}
function drawDeco(a,d){const b=a.b,E=f=>both(a,f),L=a.lights;const [k,x,y]=d,px=x*T,py=y*T;
 switch(k){
 case'tree':tree(b,x,y);break;case'palm':palm(b,x,y);break;
 case'shroom':E(c=>{rect(c,px+5,py+8,2,4,'#ccc');rect(c,px+3,py+6,6,3,'#3dffd0');rect(c,px+10,py+11,2,3,'#ccc');rect(c,px+9,py+9,4,2,'#ff4fd8');});L.push([px+7,py+8,18,'#3dffd0']);break;
 case'rock':rect(b,px+4,py+9,7,4,'#4a3a30');rect(b,px+5,py+8,5,2,'#5a4a3e');break;
 case'container':{const col=d[3];rect(b,px,py,3*T,2*T-2,col);for(let i=2;i<3*T;i+=4)rect(b,px+i,py,1,2*T-2,shade(col,.7));rect(b,px,py+2*T-2,3*T,3,'#0006');break;}
 case'crane':b.fillStyle='#c08a1a';for(let j=0;j<10*T;j+=8){b.fillRect(px,py+j,3,8);b.fillRect(px+29,py+j,3,8);b.fillRect(px+3,py+j,26,2);}b.fillRect(px-140,py-4,180,6);rect(b,px-110,py+2,1,60,'#888');
  E(c=>rect(c,px+14,py-12,4,4,'#ff3050'));L.push([px+16,py-10,20,'#ff3050']);break;
 case'busSign':rect(b,px+7,py,2,16,'#888');E(c=>{rect(c,px+2,py-6,12,8,'#ffcc00');});L.push([px+8,py-2,30,'#ffcc00']);break;
 case'crystal':E(c=>{rect(c,px+5,py+2,3,9,'#7fd0ff');rect(c,px+9,py+5,3,7,'#ff4fd8');rect(c,px+6,py+3,1,6,'#fff');});L.push([px+8,py+8,30,(x+y)%2?'#7fd0ff':'#ff4fd8']);break;
 case'cableSt':rect(b,px,py,3*T,2*T,'#3a4a6a');E(c=>rect(c,px+6,py+8,36,6,'#8a8aff'));L.push([px+24,py+28,40,'#5a5aff']);break;
 case'hut':rect(b,px,py+14,4*T,3*T-14,'#c8a070');rect(b,px-3,py,4*T+6,16,'#8a6a2a');for(let i=0;i<4*T;i+=4)rect(b,px+i,py+2,2,14,'#a0802a');rect(b,px+26,py+3*T-14,12,14,'#5b3a20');L.push([px+32,py+44,40,'#ffcf7a']);break;
 case'tower':{const [,,,w,h,col]=d,pw=w*T,ph=h*T,wr=rng(x*7+y);rect(b,px+6,py+ph-4,pw,10,'#0007');rect(b,px,py,pw,ph,'#1a1a34');rect(b,px,py,3,ph,'#2a2a50');
  E(c=>{windows(c,px+5,py+8,pw-10,ph-24,col,wr);rect(c,px+pw/2-8,py+ph-12,16,12,'#9ff');rect(c,px,py-2,pw,2,col);});L.push([px+pw/2,py+ph,70,col]);L.push([px+pw/2,py+ph/2,60,col]);break;}
 case'fount':E(c=>{c.fillStyle='#2a2a6a';c.beginPath();c.ellipse(px+32,py+30,34,16,0,0,7);c.fill();c.fillStyle='#38e0ff';c.beginPath();c.ellipse(px+32,py+28,28,11,0,0,7);c.fill();});L.push([px+32,py+24,90,'#38e0ff']);break;
 case'stall':{const col=d[3],nm=d[4],pw=6*T,ph=4*T;rect(b,px+4,py+ph,pw,6,'#0007');rect(b,px,py+16,pw,ph-16,'#22223a');
  E(c=>{for(let i=0;i<pw;i+=12){rect(c,px+i,py,6,18,col);rect(c,px+i+6,py,6,18,shade(col,.55));}rect(c,px,py+18,pw,2,'#fff');rect(c,px+6,py+28,pw-12,ph-38,shade(col,.8));c.font='bold 10px monospace';c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(nm,px+pw/2,py+ph-14);});L.push([px+pw/2,py+ph,90,col]);break;}
 case'trainSt':rect(b,px,py,8*T,3*T,'#3a2a3a');rect(b,px-2,py-6,8*T+4,10,'#5a2030');E(c=>{for(let i=0;i<7;i++)rect(c,px+8+i*17,py+10,9,9,'#ffe08a');c.font='bold 9px monospace';c.fillStyle='#ff6a6a';c.textAlign='center';c.textBaseline='middle';c.fillText('CENTRAL STATION',px+64,py-1);});L.push([px+64,py+40,80,'#e8202a']);break;}
}
function drawHome(a){const b=a.b,L=a.lights,E=f=>both(a,f),dx=a.door[0]*T,dy=a.door[1]*T;
 if(S.home==0){const px=5*T,py=6*T;rect(b,px-2,py+28,52,5,'#0006');b.fillStyle='#d0763a';b.beginPath();b.moveTo(px,py+30);b.lineTo(px+24,py-4);b.lineTo(px+48,py+30);b.fill();b.fillStyle='#a8562a';b.beginPath();b.moveTo(px+24,py-4);b.lineTo(px+48,py+30);b.lineTo(px+30,py+30);b.fill();
  rect(b,dx+3,dy+2,10,14,'#2a1a10');E(c=>rect(c,px+44,py+30,4,3,'#ffb43a'));L.push([dx+8,dy+12,36,'#ffb43a']);rect(b,px+52,py+24,10,6,'#555');E(c=>{rect(c,px+54,py+20,6,4,'#ff8a2a');rect(c,px+56,py+17,2,3,'#ffd84a');});L.push([px+57,py+22,40,'#ff8a2a']);}
 else{const big=S.home==2,hx=(big?3:4)*T,hy=(big?3:4)*T,hw=(big?7:5)*T,hh=(big?4:3)*T;rect(b,hx-3,hy+hh-4,hw+6,8,'#0006');rect(b,hx,hy+16,hw,hh-16,big?'#2a2a4a':'#d8d0c0');rect(b,hx-4,hy,hw+8,18,big?'#4a2a6a':'#7a4a3a');rect(b,hx-4,hy,hw+8,3,big?'#7a5aa0':'#9a6a5a');
  rect(b,dx+3,dy,10,16,'#5b3a20');const n=big?5:3;E(c=>{for(let i=0;i<n;i++)rect(c,hx+8+i*((hw-24)/(n-1)),hy+24,10,8,'#ffd88a');if(big){rect(c,hx-4,hy+16,hw+8,2,'#ff4fd8');rect(c,hx-4,hy,hw+8,2,'#38e0ff');}rect(c,dx+10,dy+8,2,2,'#ffd84a');});
  L.push([dx+8,dy+14,44,'#ffcf7a']);if(big)L.push([hx+hw/2,hy+20,110,'#ff4fd8']);}
}
function sign2(c,x,y,txt,sz){c.font=`bold ${sz}px monospace`;const w=Math.ceil(c.measureText(txt).width)+12,h=sz+8;x=Math.round(x-w/2);rect(c,x-2,y-2,w+4,h+4,'#2a1a08');rect(c,x,y,w,h,'#f0d58a');rect(c,x,y,w,2,'#fff3c8');rect(c,x,y+h-2,w,2,'#b8954a');c.fillStyle='#1a1008';c.textBaseline='middle';c.textAlign='center';c.fillText(txt,x+w/2,y+h/2+1);}
function render(a){const W=a.cols*T,H=a.rows*T;if(!a.bc){a.bc=document.createElement('canvas');a.ec=document.createElement('canvas');}a.bc.width=a.ec.width=W;a.bc.height=a.ec.height=H;
 const b=a.bc.getContext('2d'),e=a.ec.getContext('2d');a.b=b;a.e=e;
 const r=rng(a.id.length*99+7);for(let y=0;y<a.rows;y++)for(let x=0;x<a.cols;x++)drawTile(b,a,x,y,r);edges(b,a);
 if(a.id=='city')for(let y=0;y<22;y++)for(let x=0;x<a.cols;x++){rect(e,x*T,y*T,T,1,'#3a2cff');rect(e,x*T,y*T,1,T,'#3a2cff');}
 // neon road edges along exits
 a.exitList.forEach(x=>{for(let k=x.f;k<=x.t+1;k+=1){const p=x.side=='E'?[(a.cols-1)*T,k*T]:x.side=='W'?[0,k*T]:x.side=='N'?[k*T,0]:[k*T,(a.rows-1)*T];both(a,c=>rect(c,p[0],p[1],x.side=='E'||x.side=='W'?T:1,x.side=='N'||x.side=='S'?T:1,'#2ff6ff'));}
  const tgt=AREAS[x.to],locked=(a.id=='forest'&&x.to=='badlands'||a.id=='badlands'&&x.to=='forest')&&!S.flags.bridge;const mid=(x.f+x.t+1)/2*T;
  const pos=x.side=='E'?[a.cols*T-50,x.f*T-30]:x.side=='W'?[50,x.f*T-30]:x.side=='N'?[mid,22]:[mid,a.rows*T-50];both(a,c=>sign2(c,pos[0],pos[1],(x.side=='W'?'◀ ':x.side=='N'?'▲ ':'')+tgt.name+(x.side=='E'?' ▶':'')+(locked?' ✖':''),8));});
 (a.deco||[]).forEach(d=>drawDeco(a,d));
 if(a.id=='village'){drawHome(a);a.wild.forEach(([x,y])=>{if(a.solid[y][x]&&!S.blds.some(b=>x>=b.x&&x<b.x+BL[b.id].w&&y>=b.y&&y<b.y+BL[b.id].h))tree(b,x,y);});
  [...S.blds].sort((p,q)=>p.y-q.y).forEach(bd=>drawBuilding(a,bd));both(a,c=>sign2(c,6*T+8,2,'HOME',7));}
 if(a.tags.bridge){const [x,y,w,h]=a.tags.bridge;for(let i=0;i<w;i++){rect(b,(x+i)*T,y*T+2,T-4,3,'#5a3a20');rect(b,(x+i)*T+3,(y+1)*T+6,T-6,3,'#5a3a20');}rect(b,x*T-2,y*T-6,2,2*T+12,'#6a4a2c');rect(b,(x+w)*T,y*T-6,2,2*T+12,'#6a4a2c');both(a,c=>sign2(c,(x+1.5)*T,(y-2)*T,'BROKEN BRIDGE',7));}
 else if(a.id=='forest'){for(let i=0;i<3;i++){rect(b,(31+i)*T,12*T-2,T,2,'#9a7a5a');rect(b,(31+i)*T,14*T,T,2,'#9a7a5a');}}
 if(a.tags.portal){const [x,y]=a.tags.portal,px=x*T,py=y*T;rect(b,px,py+8,48,40,'#2a2838');rect(b,px+4,py,40,8,'#3e3a52');rect(b,px+10,py+12,28,36,'#111');
  if(S.flags.portal){both(a,c=>{rect(c,px+12,py+14,24,34,'#ff6ad5');rect(c,px+16,py+18,16,26,'#ffd0f4');});a.lights.push([px+24,py+30,90,'#ff6ad5']);}else both(a,c=>{rect(c,px+12,py+40,4,4,'#8a3a7a');});both(a,c=>sign2(c,px+24,py-14,S.flags.portal?'PORTAL ▶ NEON CITY':'ANCIENT PORTAL (dark)',7));}
 // area title plaque
 both(a,c=>sign2(c,a.cols*T/2,6,a.name.toUpperCase(),14));
}
function rebuild(id){const a=AREAS[id];a.gen(a);render(a);a.npcs=makeNpcs(a);}
// ---------- NPCs ----------
function makeNpcs(a){let L=[];
 if(a.id=='village'){let ci=0;S.blds.forEach(b=>{let v=VILLAGERS[b.id];if(b.id=='cottage')v=VILLAGERS.cottage[ci++%4];if(!v)return;const d=BL[b.id];L.push({...v,x:b.x+Math.floor(d.w/2),y:Math.min(a.rows-2,b.y+d.h+(b.id=='dock'?-1:1))});});}
 else if(a.npcStatic)L=a.npcStatic.map(n=>({...n}));
 return L.map(n=>({...n,px:n.x*T+8,py:n.y*T+8,hx:n.x*T+8,hy:n.y*T+8,t:0,dx:0,dy:0,li:0}));}
// ---------- nodes ----------
const NODESPEC={village:[['wood',4],['scrap',2]],forest:[['wood',12],['shell',0]],badlands:[['scrap',12],['ore',6]],mine:[['ore',10],['neon',4]],island:[['shell',9]],city:[['neon',2]]};
function spawnNodes(){for(const id of AORDER){const a=AREAS[id];if(!a.tile.length)a.gen(a);const L=[];let tries=0;for(const [type,n] of NODESPEC[id]){let k=n;while(k>0&&tries++<800){const x=2+Math.floor(Math.random()*(a.cols-4)),y=2+Math.floor(Math.random()*(a.rows-4));
  const t=a.tile[y][x];if(a.solid[y][x]||t==PATH||t==SOIL||t==BOARD||L.some(o=>Math.abs(o.x-x)+Math.abs(o.y-y)<2))continue;if(id=='village'&&(inRect(x,y,RESERVED)||S.blds.some(b=>inB(x,y,b))))continue;if(id=='city'&&y>21)continue;L.push({x,y,type});k--;}}S.nodes[id]=L;}}
const inRect=(x,y,r)=>x>=r.x&&y>=r.y&&x<r.x+r.w&&y<r.y+r.h;
const inB=(x,y,b)=>x>=b.x&&y>=b.y&&x<b.x+BL[b.id].w&&y<b.y+BL[b.id].h;
// ---------- save/load ----------
function load(){try{const j=JSON.parse(localStorage.getItem(SAVE));if(j&&j.v==6){S=Object.assign(newState(),j);return 1;}}catch(e){}S=newState();
 if(localStorage.getItem('fantasytown_save_v5')){S.gold+=100;S.oldSave=1;}return 0;}
function save(quiet){localStorage.setItem(SAVE,JSON.stringify(S));if(!quiet)toast('Game saved');}
const loaded=load();
AORDER.forEach(id=>AREAS[id].gen(AREAS[id]));if(!loaded||!S.nodes.village)spawnNodes();AORDER.forEach(rebuild);
if(Q.has('t'))S.min=parseFloat(Q.get('t'))*60;
let area=AREAS[S.area]||A_V;
// ---------- input ----------
const keys={};let actPressed=false,build=false,bsel=0,showMap=Q.has('map'),menuKind=null;
addEventListener('keydown',ev=>{const k=ev.key.toLowerCase();
 if(menuOpen()){if(k=='escape'||k=='e'||k=='enter'||k==' ')closeMenu();ev.preventDefault();return;}
 if(showMap){if(k=='m'||k=='escape')showMap=false;const n=parseInt(k);if(n>0&&mapBtns[n-1])mapBtns[n-1].f();return;}
 keys[k]=1;if(k==' '||k=='e'||k=='enter'){actPressed=true;ev.preventDefault();}
 if(k=='b')toggleBuild();
 if(build){if(k=='q'||k=='tab'||k=='x')bsel=(bsel+1)%BLD.length;if(k=='z')bsel=(bsel+BLD.length-1)%BLD.length;if(k=='escape')build=false;}
 else{if(k>='1'&&k<='7')S.sel=+k-1;if(k=='q'||k=='tab')S.sel=(S.sel+1)%HOT.length;}
 if(k=='tab')ev.preventDefault();if(k=='m'){showMap=true;build=false;}if(k.startsWith('arrow'))ev.preventDefault();});
addEventListener('keyup',ev=>{keys[ev.key.toLowerCase()]=0;});
function toggleBuild(){if(area.id!='village'){toast('You can only build in Hearth Village');return;}build=!build;toast(build?'BUILD MODE — A/E place · B/Q next item':'Build mode off');}
const touchEl=document.getElementById('touch');const isTouch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches||Q.has('touch');
if(isTouch)document.body.classList.add('touch');
let triedFS=false;
function tryFS(){if(triedFS||!isTouch)return;triedFS=true;const el=document.documentElement;try{const p=el.requestFullscreen?el.requestFullscreen({navigationUI:'hide'}):el.webkitRequestFullscreen&&el.webkitRequestFullscreen();
 Promise.resolve(p).then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})).catch(()=>{});}catch(e){}}
addEventListener('pointerdown',tryFS,{capture:true});
touchEl.querySelectorAll('.tb').forEach(btn=>{const k=btn.dataset.k;const on=ev=>{ev.preventDefault();
  if(showMap&&k!='map')return;
  if(k=='act')actPressed=true;else if(k=='tool'){if(build)bsel=(bsel+1)%BLD.length;else S.sel=(S.sel+1)%HOT.length;}else if(k=='map'){showMap=!showMap;build=false;}else if(k=='build')toggleBuild();else keys['t_'+k]=1;};
 const off=ev=>{ev.preventDefault();keys['t_'+k]=0;};btn.addEventListener('pointerdown',on);btn.addEventListener('pointerup',off);btn.addEventListener('pointerleave',off);btn.addEventListener('pointercancel',off);});
cv.addEventListener('pointerdown',ev=>{const x=ev.clientX*cv.width/cv.clientWidth,y=ev.clientY*cv.height/cv.clientHeight;
 if(showMap){const bt=mapBtns.find(b=>x>=b.r[0]&&x<b.r[0]+b.r[2]&&y>=b.r[1]&&y<b.r[1]+b.r[3]);if(bt)bt.f();return;}
 const s=hotRects.findIndex(r=>x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3]);if(s>=0){if(build)bsel=s+bOff;else S.sel=s;}});
// ---------- menus ----------
function menuOpen(){return menuEl.style.display=='block';}
function closeMenu(){menuEl.style.display='none';}
function openMenu(h){menuEl.innerHTML=h+`<button class="x" onclick="closeMenu()">Close</button>`;menuEl.style.display='block';for(const k in keys)keys[k]=0;}
window.closeMenu=closeMenu;
const costStr=c=>Object.entries(c||{}).map(([k,v])=>k=='gold'?v+'g':v+' '+ITEMS[k].n).join(', ');
const canPay=c=>Object.entries(c||{}).every(([k,v])=>k=='gold'?S.gold>=v:(S.inv[k]||0)>=v);
const pay=c=>Object.entries(c||{}).forEach(([k,v])=>{if(k=='gold')S.gold-=v;else S.inv[k]-=v;});
function talk(n){openMenu(`<h3>${n.n}</h3><p>${n.lines[n.li++%n.lines.length]}</p>`);}
function shop(mult,city){const sell=Object.keys(ITEMS).filter(k=>S.inv[k]>0);let tot=0;sell.forEach(k=>tot+=Math.round(ITEMS[k].p*mult)*S.inv[k]);
 let h=`<h3>${city?'NEON CITY MARKET (+50%)':'VILLAGE SHOP STALL'}</h3><div>Gold: ${S.gold}g</div><div class="row">`;
 for(const c in CROPS){const s=CROPS[c];if(s.city&&!city)continue;h+=`<button onclick="buy('${s.seed}',${s.cost},${mult},${city})">Buy ${HOT.find(x=>x.id==s.seed).n} ${s.cost}g (${S.inv[s.seed]||0})</button>`;}
 h+=`</div><button onclick="sellAll(${mult},${city})">Sell all goods — ${tot}g</button><div class="row">`;
 sell.forEach(k=>h+=`<button onclick="sell1('${k}',${mult},${city})">${ITEMS[k].n} ×${S.inv[k]} · ${Math.round(ITEMS[k].p*mult)}g</button>`);openMenu(h+'</div>');}
window.buy=(id,c,m,ci)=>{if(S.gold>=c){S.gold-=c;S.inv[id]=(S.inv[id]||0)+1;sfx(660);}else toast('Not enough gold');shop(m,ci);};
window.sellAll=(m,ci)=>{for(const k in ITEMS)if(S.inv[k]>0){S.gold+=Math.round(ITEMS[k].p*m)*S.inv[k];S.inv[k]=0;}sfx(880);shop(m,ci);};
window.sell1=(k,m,ci)=>{if(S.inv[k]>0){S.inv[k]--;S.gold+=Math.round(ITEMS[k].p*m);sfx(800);}shop(m,ci);};
const TOOLUP={pick:{n:'Pickaxe',cost:{gold:100,ore:8,scrap:6},d:'+1 ore/scrap/neon per hit'},can:{n:'Water Can',cost:{gold:80,ore:5},d:'Waters 3 tiles in a row'},rod:{n:'Rod',cost:{gold:60,wood:5,shell:3},d:'Faster bites, 2 fish at night'}};
function workshop(){let h='<h3>BOLT\'S WORKSHOP</h3>';for(const k in TOOLUP){const u=TOOLUP[k];h+=S.tools[k]>1?`<p>✔ ${u.n} Lv2 — ${u.d}</p>`:`<button onclick="upTool('${k}')" ${canPay(u.cost)?'':'class="no"'}>Upgrade ${u.n}: ${costStr(u.cost)}<br><small>${u.d}</small></button>`;}openMenu(h);}
window.upTool=k=>{const u=TOOLUP[k];if(!canPay(u.cost)){toast('Need '+costStr(u.cost));return;}pay(u.cost);S.tools[k]=2;sfx(990);toast(u.n+' upgraded!');workshop();};
function homeMenu(){const nx=HOMEUP[S.home+1];openMenu(`<h3>HOME — ${HOMEUP[S.home].n}</h3><button onclick="sleep()">Sleep until morning (save)</button>`+(nx?`<button onclick="upHome()" ${canPay(nx.cost)?'':'class="no"'}>Upgrade to ${nx.n}: ${costStr(nx.cost)}</button>`:'<p>Fully upgraded!</p>'));}
window.upHome=()=>{const nx=HOMEUP[S.home+1];if(!canPay(nx.cost)){toast('Need '+costStr(nx.cost));return;}pay(nx.cost);S.home++;rebuild('village');S.px=6*T+8;S.py=(area.door[1]+1)*T+10;closeMenu();toast('Home upgraded to '+nx.n+'!');sfx(990);};
function repairMenu(k){const r=REPAIR[k];openMenu(`<h3>${r.n.toUpperCase()}</h3><p>Cost: ${costStr(r.cost)}</p><button onclick="doRepair('${k}')" ${canPay(r.cost)?'':'class="no"'}>Repair</button>`);}
window.doRepair=k=>{const r=REPAIR[k];if(!canPay(r.cost)){toast('Need '+costStr(r.cost));return;}pay(r.cost);S.flags[k]=1;rebuild(area.id);if(k=='bridge')rebuild('badlands');closeMenu();toast(k=='bridge'?'Bridge repaired! Route to Rust Badlands open':'The portal blazes! Magic route to Neon City');sfx(1200);save(1);};
window.sleep=(passed)=>{closeMenu();S.day++;S.min=6*60;
 for(const k in S.soil){const s=S.soil[k];if(s.crop&&s.w&&s.g<CROPS[s.crop].days)s.g++;s.w=false;}
 spawnNodes();goArea('village',[6,A_V.door[1]+1]);S.face='down';fade=1;save();toast(passed?'You passed out... Day '+S.day:'Good morning! Day '+S.day);};
// ---------- travel ----------
function goArea(id,pos){S.area=id;area=AREAS[id];S.visited[id]=1;const p=pos||area.spawn;S.px=p[0]*T+8;S.py=p[1]*T+10;banner={t:area.name,l:2.2};if(id!='village')build=false;}
function stationPos(id,type){if(id=='village'){const b=S.blds.find(b=>b.id==({bus:'busstop',cable:'cable',boat:'dock',train:'train'}[type]));if(b){const d=BL[b.id];return[b.x+Math.floor(d.w/2),type=='boat'?b.y:b.y+d.h];}return area.spawn;}
 if(type=='magic')return id=='mine'?[28,8]:[22,20];return AREAS[id].station||AREAS[id].spawn;}
function travel(r){const to=r.a==area.id?r.b:r.a;fade=1;goArea(to,stationPos(to,r.type));showMap=false;toast(`${RT[r.type].n.split(' ')[0]} → ${AREAS[to].name}`);sfx(500);}
// ---------- feedback ----------
let toasts=[],fade=0,parts=[],banner=null,fishing=null,saveT=0,walkT=0,moving=false;
function toast(t){toasts.push({t,life:2.6});if(toasts.length>4)toasts.shift();}
let actx=null;function sfx(f){try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.type='square';o.frequency.value=f;g.gain.value=.04;g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+.15);o.connect(g).connect(actx.destination);o.start();o.stop(actx.currentTime+.16);}catch(e){}}
function give(k,n,x,y){S.inv[k]=(S.inv[k]||0)+n;toast(`+${n} ${ITEMS[k].n}`);sfx(520+Math.random()*200);for(let i=0;i<8;i++)parts.push({x,y,vx:(Math.random()-.5)*60,vy:-Math.random()*60,l:.6,c:ITEMS[k].c});}
// ---------- actions ----------
function facingTile(){const cx=Math.floor(S.px/T),cy=Math.floor((S.py-4)/T);const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[S.face];return[cx+d[0],cy+d[1]];}
function ghostRect(){const d=BLD[bsel],[fx,fy]=facingTile();let x=fx-Math.floor(d.w/2),y=fy;if(S.face=='up')y=fy-d.h+1;if(S.face=='left'){x=fx-d.w+1;y=fy-Math.floor(d.h/2);}if(S.face=='right'){x=fx;y=fy-Math.floor(d.h/2);}return{x,y,w:d.w,h:d.h,d};}
function canPlace(g){const a=A_V;if(g.d.u&&S.blds.some(b=>b.id==g.d.id))return'Already built';const px=Math.floor(S.px/T),py=Math.floor((S.py-4)/T);
 for(let j=g.y;j<g.y+g.h;j++)for(let i=g.x;i<g.x+g.w;i++){if(i<1||j<1||i>=a.cols-1||j>=a.rows-1)return'Out of bounds';const t=a.tile[j][i];
  if(g.d.water){if(t!=WATER)return'Dock must be on water';continue;}
  if(a.solid[j][i]||t==WATER||t==SOIL||t==BOARD)return'Blocked';if(g.d.id!='path'&&t==PATH&&g.d.id!='lamp'&&g.d.id!='flowers')return'Keep paths clear';
  if(inRect(i,j,RESERVED))return'Home lot';if(S.blds.some(b=>inB(i,j,b)))return'Occupied';if((S.nodes.village||[]).some(o=>o.x==i&&o.y==j))return'Clear resources first';if(i==px&&j==py&&!g.d.walk&&g.d.id!='path')return'You are standing there';}
 if(g.d.water&&!(g.y>0&&a.tile[g.y-1][g.x+1]!=WATER))return'Dock must touch the shore';return'';}
function place(){const g=ghostRect(),why=canPlace(g);if(why){toast(why);sfx(150);return;}if(!canPay(g.d.cost)){toast('Need '+costStr(g.d.cost));sfx(150);return;}
 pay(g.d.cost);const n=S.blds.filter(b=>b.id=='cottage').length;S.blds.push({id:g.d.id,x:g.x,y:g.y,n});S.stats.built++;rebuild('village');sfx(700);for(let i=0;i<14;i++)parts.push({x:(g.x+g.w/2)*T,y:(g.y+g.h/2)*T,vx:(Math.random()-.5)*90,vy:-Math.random()*80,l:.7,c:'#ffd84a'});
 const v=g.d.id=='cottage'?VILLAGERS.cottage[n%4]:VILLAGERS[g.d.id];toast(`Built ${g.d.n}!`+(v?` ${v.n} moved in!`:''));
 const rt=ROUTES.find(r=>r.req==g.d.id);if(rt)toast(`${RT[rt.type].n} unlocked — open the Map (M)`);save(1);}
function act(){
 if(build){place();return;}
 const [tx,ty]=facingTile();const tool=HOT[S.sel],wx=tx*T+8,wy=ty*T+8,a=area;
 const npc=a.npcs.find(n=>Math.abs(n.px-wx)<14&&Math.abs(n.py-wy)<14);if(npc){npc.dx=npc.dy=0;talk(npc);return;}
 if(a.id=='village'){if(tx==a.door[0]&&ty==a.door[1]){homeMenu();return;}const bd=S.blds.find(b=>inB(tx,ty,b));
  if(bd){if(bd.id=='stall'){shop(1,0);return;}if(bd.id=='workshop'){workshop();return;}if(['busstop','cable','train'].includes(bd.id)){showMap=true;return;}}}
 for(const k in a.tags){const r=a.tags[k];if(tx>=r[0]&&ty>=r[1]&&tx<r[0]+r[2]&&ty<r[1]+r[3]){if(k=='bridge'){repairMenu('bridge');return;}if(k=='portal'){if(S.flags.portal)travel(ROUTES.find(r=>r.type=='magic'));else repairMenu('portal');return;}if(k.startsWith('shop')){shop(1.5,1);return;}}}
 const nodes=S.nodes[a.id]||[],ni=nodes.findIndex(o=>o.x==tx&&o.y==ty);
 if(ni>=0){const o=nodes[ni];const needPick=o.type=='ore'||o.type=='scrap'||(o.type=='neon'&&a.id=='mine');if(!needPick||tool.id=='pick'){nodes.splice(ni,1);let n=o.type=='wood'?2+(Math.random()<.5):1+(o.type=='scrap'&&Math.random()<.4);if(needPick&&S.tools.pick>1)n++;give(o.type,n,wx,wy);}else toast('Use the Pickaxe (3)');return;}
 const t=a.tile[ty]&&a.tile[ty][tx];
 if(t==SOIL){const key=tx+','+ty;let s=S.soil[key];
  if(s&&s.crop&&s.g>=CROPS[s.crop].days){give(s.crop,1,wx,wy);delete s.crop;return;}
  if(tool.id=='hoe'){if(!s){S.soil[key]={w:false};sfx(200);}else toast('Already tilled');return;}
  if(tool.id=='can'){if(!s){toast('Till it first (Hoe)');return;}const L=[[tx,ty]];if(S.tools.can>1){if(S.face=='up'||S.face=='down')L.push([tx-1,ty],[tx+1,ty]);else L.push([tx,ty-1],[tx,ty+1]);}
   L.forEach(([x,y])=>{const q=S.soil[x+','+y];if(q){q.w=true;for(let i=0;i<5;i++)parts.push({x:x*T+8,y:y*T+8,vx:(Math.random()-.5)*40,vy:-Math.random()*30,l:.4,c:'#5cf'});}});sfx(400);return;}
  if(tool.crop){if(!s)toast('Till it first (Hoe)');else if(s.crop)toast('Already planted');else if(!(S.inv[tool.id]>0))toast('No seeds — build a Shop Stall');else{S.inv[tool.id]--;s.crop=tool.crop;s.g=0;sfx(300);}return;}
  if(s&&s.crop)toast(`${ITEMS[s.crop].n}: day ${s.g}/${CROPS[s.crop].days}${s.w?' (watered)':''}`);return;}
 if(t==WATER){if(tool.id!='rod'){toast('Use the Rod (4) to fish');return;}if(a.id=='village'&&!S.blds.some(b=>b.id=='dock')){toast('Build a Boat Dock to fish here');return;}if(!fishing){fishing={t:(S.tools.rod>1?.6:1.2)+Math.random()*1.2,x:wx,y:wy};toast('Casting...');}return;}
}
// ---------- movement ----------
function blocked(x,y){const a=area,nodes=S.nodes[a.id]||[];return[[x-5,y-5],[x+5,y-5],[x-5,y],[x+5,y]].some(([p,q])=>{const tx=Math.floor(p/T),ty=Math.floor(q/T);
 return tx<0||ty<0||tx>=a.cols||ty>=a.rows||a.solid[ty][tx]||nodes.some(o=>o.x==tx&&o.y==ty&&o.type!='shell');});}
function checkExit(){const a=area,tx=Math.floor(S.px/T),ty=Math.floor((S.py-2)/T);for(const x of a.exitList){const on=(x.side=='E'&&tx>=a.cols-1||x.side=='W'&&tx<=0)&&ty>=x.f&&ty<=x.t||(x.side=='N'&&ty<=0||x.side=='S'&&ty>=a.rows-1)&&tx>=x.f&&tx<=x.t;
 if(on){const b=AREAS[x.to],k=x.side=='E'||x.side=='W'?ty:tx;const p=x.ts=='W'?[1,k]:x.ts=='E'?[b.cols-2,k]:x.ts=='N'?[k,1]:[k,b.rows-2];goArea(x.to,p);return;}}}
function update(dt){
 if(menuOpen()||showMap){actPressed=false;return;}
 S.min+=dt*5;if(S.min>=26*60){sleep(true);return;}
 let vx=(keys.d||keys.arrowright||keys.t_right?1:0)-(keys.a||keys.arrowleft||keys.t_left?1:0),vy=(keys.s||keys.arrowdown||keys.t_down?1:0)-(keys.w||keys.arrowup||keys.t_up?1:0);
 moving=!!(vx||vy);if(moving&&fishing){fishing=null;toast('Line reeled in');}if(vx&&vy){vx*=.7071;vy*=.7071;}
 if(vx>0)S.face='right';else if(vx<0)S.face='left';if(vy>0)S.face='down';else if(vy<0)S.face='up';
 const sp=(keys.shift?130:85)*dt;if(!blocked(S.px+vx*sp,S.py))S.px+=vx*sp;if(!blocked(S.px,S.py+vy*sp))S.py+=vy*sp;if(moving){walkT+=dt*10;checkExit();}
 if(actPressed){actPressed=false;act();}
 if(fishing){fishing.t-=dt;if(fishing.t<=0){const n=nightF()>.5&&S.tools.rod>1?2:1;if(Math.random()<.85)give('fish',n,fishing.x,fishing.y);else give('shell',1,fishing.x,fishing.y);fishing=null;}}
 area.npcs.forEach(n=>{n.t-=dt;if(n.t<=0){n.t=1+Math.random()*2.5;if(Math.random()<.5)n.dx=n.dy=0;else{const q=Math.floor(Math.random()*4);n.dx=[1,-1,0,0][q];n.dy=[0,0,1,-1][q];}}
  const nx=n.px+n.dx*20*dt,ny=n.py+n.dy*20*dt,tx=Math.floor(nx/T),ty=Math.floor(ny/T);
  if(area.solid[ty]&&!area.solid[ty][tx]&&area.tile[ty][tx]!=WATER&&Math.abs(nx-n.hx)<40&&Math.abs(ny-n.hy)<28&&Math.hypot(nx-S.px,ny-S.py)>12){n.px=nx;n.py=ny;}else n.t=0;});
 parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=120*dt;p.l-=dt;});parts=parts.filter(p=>p.l>0);
 toasts.forEach(t=>t.life-=dt);toasts=toasts.filter(t=>t.life>0);if(banner)banner.l-=dt;if(fade>0)fade-=dt*1.5;
 saveT+=dt;if(saveT>30){saveT=0;save(1);}
}
function nightF(){const h=(S.min/60)%24;if(h>=6&&h<17)return 0;if(h>=17&&h<20)return(h-17)/3;if(h>=4&&h<6)return 1-(h-4)/2;return 1;}
// ---------- render ----------
let zoom=3,vw=0,vh=0,sc=1;
function resize(){cv.width=innerWidth;cv.height=innerHeight;zoom=Math.max(2,Math.round(Math.min(cv.width,cv.height)/(isTouch?190:300)));vw=cv.width/zoom;vh=cv.height/zoom;
 sc=Math.max(.72,Math.min(1.5,Math.min(cv.width/1100,cv.height/560)));document.getElementById('rot').style.display=isTouch&&innerHeight>innerWidth?'flex':'none';}
addEventListener('resize',resize);resize();
function drawNode(o,px,py,t){switch(o.type){
 case'wood':rect(ctx,px+2,py+13,12,3,'#0005');rect(ctx,px+6,py+8,4,7,'#6b4a2c');ctx.fillStyle='#2a7a3a';ctx.beginPath();ctx.arc(px+8,py+5,6,0,7);ctx.fill();rect(ctx,px+5,py+1,3,3,'#4aaa55');rect(ctx,px+9,py+5,2,2,'#ffb4d0');break;
 case'scrap':rect(ctx,px+1,py+10,14,5,'#0006');rect(ctx,px+2,py+6,12,7,'#7a6a58');rect(ctx,px+4,py+3,6,5,'#9a8a70');rect(ctx,px+9,py+4,4,3,'#5a8aa0');rect(ctx,px+3,py+9,3,2,'#c06030');break;
 case'ore':rect(ctx,px+1,py+11,14,4,'#0006');rect(ctx,px+2,py+5,12,9,'#5a5a6e');rect(ctx,px+4,py+3,8,4,'#6e6e84');rect(ctx,px+5,py+7,2,2,'#7fd0ff');rect(ctx,px+10,py+9,2,2,'#7fd0ff');break;
 case'shell':rect(ctx,px+5,py+8,6,5,'#ffd0e8');rect(ctx,px+6,py+7,4,1,'#fff');rect(ctx,px+7,py+9,1,4,'#e090b0');break;
 default:{const p=Math.sin(t*4+o.x);rect(ctx,px+6,py+4+p,4,8,'#ff4fd8');rect(ctx,px+7,py+3+p,2,10,'#ffb0f0');}}}
function drawWorld(cam,night,t){const a=area;
 ctx.drawImage(a.b.canvas||a.b,-cam.x,-cam.y);
 for(let i=0;i<50;i++){const x=(i*197+t*10)%(a.cols*T),y=(i*89)%(a.rows*T),tx=Math.floor(x/T),ty=Math.floor(y/T);if(a.tile[ty]&&a.tile[ty][tx]==WATER)rect(ctx,x-cam.x,y-cam.y,5,1,'#4aa0ff88');}
 if(a.id=='village')for(const k in S.soil){const [x,y]=k.split(',').map(Number),s=S.soil[k];if(a.tile[y][x]!=SOIL)continue;const px=x*T-cam.x,py=y*T-cam.y;rect(ctx,px+1,py+1,14,14,s.w?'#2a1a10':'#6a4a2a');rect(ctx,px+2,py+4,12,1,s.w?'#1a0f08':'#7a5a3a');rect(ctx,px+2,py+10,12,1,s.w?'#1a0f08':'#7a5a3a');
  if(s.crop){const C=CROPS[s.crop],g=s.g,ripe=g>=C.days,f=Math.min(1,g/C.days),h=3+Math.round(f*8);rect(ctx,px+7,py+13-h,2,h,'#3fbf4a');if(g>0){rect(ctx,px+4,py+12-h/2,3,2,'#4fdf5a');rect(ctx,px+9,py+11-h/2,3,2,'#4fdf5a');}if(ripe){rect(ctx,px+5,py+1,6,5,C.c);rect(ctx,px+6,py+2,2,1,'#fff');}}}
 (S.nodes[a.id]||[]).forEach(o=>{const px=o.x*T-cam.x,py=o.y*T-cam.y;if(px>-16&&py>-16&&px<vw&&py<vh)drawNode(o,px,py,t);});
 if(a.id=='island'||a.id=='village')for(let i=0;i<2;i++){const x=((t*(8+i*4)+i*300)%(a.cols*T)),y=a.id=='island'?(i?22:3)*T:(26+i*1.5)*T;drawBoatOn(ctx,x-cam.x,y-cam.y,['#ff4fd8','#38e0ff'][i]);}
 const ents=a.npcs.map(n=>({y:n.py,f:()=>person(ctx,n.px-cam.x,n.py-cam.y,n.c,n.h,n.dy<0?'up':n.dx<0?'left':n.dx>0?'right':'down',(n.dx||n.dy)?t*10:0)}));
 ents.push({y:S.py,f:()=>{person(ctx,S.px-cam.x,S.py-cam.y,'#3a8aff','#5a3a1a',S.face,moving?walkT:0,true);if(fishing){const [tx,ty]=facingTile();ctx.strokeStyle='#ddd';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(S.px-cam.x+4,S.py-cam.y-14);ctx.lineTo(tx*T+8-cam.x,ty*T+8-cam.y);ctx.stroke();rect(ctx,tx*T+7-cam.x,ty*T+7-cam.y+Math.round(Math.sin(t*6)),3,3,'#ff3050');}}});
 ents.sort((p,q)=>p.y-q.y).forEach(o=>o.f());
 parts.forEach(p=>rect(ctx,p.x-cam.x,p.y-cam.y,2,2,p.c));
 const fnt=a.id=='city'?[21*T+32,10*T+22]:(()=>{const f=S.blds.find(b=>b.id=='fountain');return f&&a.id=='village'?[f.x*T+24,f.y*T+22]:null;})();
 if(fnt){const [fx0,fy0]=[fnt[0]-cam.x,fnt[1]-cam.y];for(let i=0;i<5;i++){const h=8+Math.sin(t*3+i)*5;ctx.fillStyle=`rgba(120,240,255,${.5+.3*Math.sin(t*5+i)})`;ctx.fillRect(fx0-10+i*5,fy0-h,2,h);}}
 if(night>0){ctx.fillStyle=`rgba(8,6,38,${.62*night})`;ctx.fillRect(0,0,vw,vh);}
 ctx.globalAlpha=.3+.7*night;ctx.drawImage(a.e.canvas||a.e,-cam.x,-cam.y);ctx.globalAlpha=1;
 ctx.globalCompositeOperation='lighter';const ga=.12+.88*night;
 a.lights.forEach(([x,y,r,col])=>{const sx=x-cam.x,sy=y-cam.y;if(sx<-r||sy<-r||sx>vw+r||sy>vh+r)return;const fl=1+.06*Math.sin(t*3+x);ctx.globalAlpha=ga*.8;ctx.drawImage(glow(col),sx-r*fl,sy-r*fl,r*2*fl,r*2*fl);});
 if(night>.3){ctx.globalAlpha=night*.5;ctx.drawImage(glow('#fff2c0'),S.px-36-cam.x,S.py-44-cam.y,72,72);}
 ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 if(build){const g=ghostRect(),why=canPlace(g),ok=!why&&canPay(g.d.cost);ctx.fillStyle=ok?'#3dff9a44':'#ff305044';ctx.fillRect(g.x*T-cam.x,g.y*T-cam.y,g.w*T,g.h*T);ctx.strokeStyle=ok?'#3dff9a':'#ff3050';ctx.lineWidth=1;ctx.strokeRect(g.x*T-cam.x+.5,g.y*T-cam.y+.5,g.w*T-1,g.h*T-1);
  ctx.globalAlpha=.1;for(let y=Math.floor(cam.y/T);y<(cam.y+vh)/T;y++)for(let x=Math.floor(cam.x/T);x<(cam.x+vw)/T;x++){ctx.strokeStyle='#38e0ff';ctx.strokeRect(x*T-cam.x+.5,y*T-cam.y+.5,T,T);}ctx.globalAlpha=1;}
 else{const [tx,ty]=facingTile();ctx.strokeStyle='#ffffff55';ctx.strokeRect(tx*T-cam.x+.5,ty*T-cam.y+.5,T-1,T-1);}
}
// ---------- HUD ----------
let hotRects=[],bOff=0;
function npanel(x,y,w,h,col='#38e0ff'){ctx.fillStyle='#0c0820e0';ctx.fillRect(x,y,w,h);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.shadowColor=col;ctx.shadowBlur=8;ctx.strokeRect(x+1,y+1,w-2,h-2);ctx.shadowBlur=0;}
const F=n=>`bold ${Math.round(n*sc)}px monospace`;
function bicon(id,x,y,s){const p=s/16,r=(a,b,w,h,c)=>rect(ctx,x+a*p,y+b*p,w*p,h*p,c);switch(id){
 case'path':r(1,6,14,4,'#64523f');r(7,7,2,2,'#38e0ff');break;case'lamp':r(7,4,2,11,'#666');r(5,1,6,4,'#ffe9a8');break;case'flowers':r(3,8,3,3,'#ff4fd8');r(9,5,3,3,'#38e0ff');r(10,10,3,3,'#ffd84a');break;
 case'fence':r(1,6,14,2,'#9a6a3a');r(1,10,14,2,'#9a6a3a');r(3,3,2,11,'#7a4a2a');r(11,3,2,11,'#7a4a2a');break;case'plot':r(1,1,14,14,'#9a6a3a');r(2,2,12,12,'#553a26');r(4,5,8,2,'#3fbf4a');break;
 case'stall':r(1,2,14,4,'#ff4fd8');r(2,6,12,8,'#2a2246');r(4,8,8,3,'#ffd84a');break;case'cottage':r(1,2,14,6,'#8a4a2a');r(2,8,12,7,'#d8ccb8');r(7,10,3,5,'#5b3a20');break;
 case'workshop':r(1,3,14,4,'#2e2e40');r(2,7,12,8,'#4a4a5e');r(9,9,4,2,'#ffb43a');break;case'dock':r(1,9,14,4,'#7b5a3c');r(3,4,9,4,'#ddd');r(0,13,16,3,'#0d2050');break;
 case'busstop':r(1,2,14,3,'#ffcc00');r(2,5,2,10,'#888');r(12,5,2,10,'#888');break;case'cable':r(7,1,2,14,'#888');r(9,3,6,5,'#5a5aff');r(1,1,14,1,'#aaa');break;
 case'train':r(1,4,14,9,'#5a2030');r(3,6,3,3,'#ffe08a');r(10,6,3,3,'#ffe08a');r(1,13,14,2,'#888');break;case'fountain':r(1,9,14,5,'#2a2a6a');r(3,10,10,3,'#38e0ff');r(7,2,2,8,'#b8ffff');break;}}
function drawHUD(night,t){ctx.setTransform(1,0,0,1,0,0);ctx.textBaseline='top';ctx.textAlign='left';const W=cv.width,H=cv.height;
 const h=Math.floor(S.min/60)%24,m=Math.floor(S.min%60/10)*10,ap=h<12?'AM':'PM',hh=(h%12)||12;
 const pw=Math.round(176*sc),ph=Math.round(58*sc);npanel(8,8,pw,ph,'#ff4fd8');ctx.font=F(14);
 ctx.fillStyle='#ffd84a';ctx.fillText(`DAY ${S.day}`,16,14*sc);ctx.fillStyle='#bff';ctx.fillText(`${hh}:${String(m).padStart(2,'0')} ${ap}`,16+72*sc,14*sc);
 ctx.fillStyle='#ffd84a';ctx.fillText(`◉ ${S.gold}g`,16,36*sc);ctx.fillStyle=night>.5?'#c8b8ff':'#ffe08a';ctx.fillText(night>.5?'☾':'☀',16+138*sc,36*sc);
 ctx.font=F(11);ctx.fillStyle='#3ff';ctx.shadowColor='#3ff';ctx.shadowBlur=6;ctx.fillText(`${area.name.toUpperCase()} · ${VERSION}`,12,ph+14);ctx.shadowBlur=0;
 // resources: compact 3x2 grid
 const cw=Math.round(62*sc),lw=cw*3+14,lh=Math.round(56*sc)+10,lx=W-lw-8,ly=8;npanel(lx,ly,lw,lh,'#ffd84a');ctx.font=F(12);
 RES.forEach((k,i)=>{const cx=lx+7+(i%3)*cw,cy=ly+6+Math.floor(i/3)*Math.round(28*sc);icon(k,cx,cy,Math.round(20*sc));ctx.fillStyle='#ffe9b0';ctx.fillText(S.inv[k]||0,cx+23*sc,cy+5*sc);});
 const pop=A_V.npcs.length;ctx.font=F(10);ctx.fillStyle='#ffd84a';ctx.textAlign='right';ctx.fillText(`VILLAGERS ${pop} · BUILT ${S.blds.length}`,W-10,ly+lh+4);ctx.textAlign='left';
 // hotbar / build palette
 const s=Math.round(42*sc),touchPad=isTouch?0:0,n=7,hx=Math.round((W-n*(s+4))/2),hy=H-s-10;hotRects=[];npanel(hx-6,hy-6,n*(s+4)+8,s+12,build?'#3dff9a':'#38e0ff');
 if(build){bOff=Math.max(0,Math.min(BLD.length-n,bsel-3));for(let i=0;i<n;i++){const d=BLD[i+bOff],x=hx+i*(s+4);hotRects.push([x,hy,s,s]);const sel=i+bOff==bsel,ok=canPay(d.cost)&&!(d.u&&S.blds.some(b=>b.id==d.id));
   rect(ctx,x,hy,s,s,sel?'#1f4a3a':'#1a1438');if(sel){ctx.strokeStyle='#ffd84a';ctx.lineWidth=2;ctx.strokeRect(x+1,hy+1,s-2,s-2);}ctx.globalAlpha=ok?1:.35;bicon(d.id,x+s*.15,hy+s*.12,s*.7);ctx.globalAlpha=1;}
  const d=BLD[bsel];const box=[hx-6,hy-58*sc,n*(s+4)+8,46*sc];npanel(...box,'#3dff9a');ctx.font=F(12);ctx.fillStyle='#ffd84a';ctx.textAlign='center';ctx.fillText(`${d.n} (${d.w}×${d.h}) — ${costStr(d.cost)}`,W/2,box[1]+6*sc);
  ctx.font=F(10);ctx.fillStyle=canPay(d.cost)?'#bff':'#ff8a9a';ctx.fillText(d.d+(d.u&&S.blds.some(b=>b.id==d.id)?' · BUILT':''),W/2,box[1]+26*sc);ctx.textAlign='left';}
 else{HOT.forEach((it,i)=>{const x=hx+i*(s+4);hotRects.push([x,hy,s,s]);rect(ctx,x,hy,s,s,i==S.sel?'#3a2a7a':'#1a1438');if(i==S.sel){ctx.strokeStyle='#ffd84a';ctx.lineWidth=2;ctx.strokeRect(x+1,hy+1,s-2,s-2);}
   icon(it.id,x+s*.15,hy+s*.12,s*.7);if(S.tools[it.id]>1){ctx.font=F(9);ctx.fillStyle='#3dff9a';ctx.fillText('★',x+s-12*sc,hy+2);}ctx.font=F(9);ctx.fillStyle='#8ff';ctx.fillText(i+1,x+3,hy+2);
   if(it.crop){ctx.fillStyle='#fff';ctx.textAlign='right';ctx.fillText(S.inv[it.id]||0,x+s-3,hy+s-11*sc);ctx.textAlign='left';}});
  ctx.font=F(11);ctx.fillStyle='#ffd84a';ctx.textAlign='center';ctx.fillText(HOT[S.sel].n,W/2,hy-20*sc);ctx.textAlign='left';}
 ctx.font=F(12);ctx.textAlign='center';const tb=build?hy-64*sc:hy-24*sc;
 toasts.forEach((tt,i)=>{const j=toasts.length-1-i;ctx.globalAlpha=Math.min(1,tt.life);const w=ctx.measureText(tt.t).width+16;ctx.fillStyle='#000b';ctx.fillRect(W/2-w/2,tb-(j+1)*20*sc,w,18*sc);ctx.fillStyle='#bff';ctx.fillText(tt.t,W/2,tb-(j+1)*20*sc+2*sc);});ctx.globalAlpha=1;
 if(banner&&banner.l>0){ctx.globalAlpha=Math.min(1,banner.l);ctx.font=F(22);ctx.fillStyle='#ffd84a';ctx.shadowColor='#f0f';ctx.shadowBlur=14;ctx.fillText(banner.t.toUpperCase(),W/2,H*.2);ctx.shadowBlur=0;ctx.globalAlpha=1;}
 ctx.textAlign='left';if(!isTouch){ctx.font=F(10);ctx.fillStyle='#9ab';ctx.fillText('WASD move · E act · 1-7/Q tool · B build · M map',12,H-16*sc);}
 if(fade>0){ctx.fillStyle=`rgba(0,0,0,${Math.min(1,fade)})`;ctx.fillRect(0,0,W,H);}}
// ---------- world map ----------
const MAPL={village:[330,250],forest:[560,250],badlands:[790,250],mine:[790,70],island:[330,440],city:[560,440]};
const REG={village:'#e8d8c0',forest:'#d0eedb',badlands:'#f2eecc',mine:'#d4eaf2',island:'#d2f2df',city:'#f8d6e2'};
let mapBtns=[],thumbs={};
function thumb(id){const a=AREAS[id];const c=document.createElement('canvas');c.width=a.cols*4;c.height=a.rows*4;const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.drawImage(a.b.canvas||a.b,0,0,c.width,c.height);x.globalAlpha=.4;x.drawImage(a.e.canvas||a.e,0,0,c.width,c.height);return c;}
function drawMap(t){ctx.setTransform(1,0,0,1,0,0);const W=cv.width,H=cv.height;ctx.fillStyle='#fbfbf6';ctx.fillRect(0,0,W,H);
 const s=Math.min(W/1060,H/600),ox=(W-1060*s)/2,oy=(H-600*s)/2;mapBtns=[];
 const P=(x,y)=>[ox+x*s,oy+y*s];const tw=184,th=118;
 ctx.font=`bold ${Math.round(20*s)}px sans-serif`;ctx.fillStyle='#222';ctx.textBaseline='top';ctx.textAlign='left';ctx.fillText('FANTASY TOWN — WORLD MAP',P(20,14)[0],P(20,14)[1]);
 // regions
 for(const id of AORDER){const [x,y]=MAPL[id],a=AREAS[id],[rx,ry]=P(x-24,y-40);ctx.fillStyle=REG[id];ctx.fillRect(rx,ry,(tw+48)*s,(th+66)*s);
  ctx.fillStyle='#333';ctx.font=`${Math.round(15*s)}px sans-serif`;ctx.fillText(a.region.replace(/\b(\w)(\w*)/g,(m,p,q)=>p+q.toLowerCase()),rx+8*s,ry+8*s);}
 // routes
 ROUTES.forEach((r,i)=>{const un=isUnlocked(r),A=MAPL[r.a],B=MAPL[r.b];const off=(i%3-1)*14;let pts;
  const ca=[A[0]+tw/2,A[1]+th/2],cb=[B[0]+tw/2,B[1]+th/2];
  if(r.type=='walk'||r.type=='magic'&&false)pts=[ca,[ca[0],ca[1]],cb];
  pts=Math.abs(ca[1]-cb[1])<5?[[ca[0],ca[1]+off],[cb[0],cb[1]+off]]:[[ca[0]+off,ca[1]],[ca[0]+off,(ca[1]+cb[1])/2+off],[cb[0]+off,(ca[1]+cb[1])/2+off],[cb[0]+off,cb[1]]];
  if(r.type=='boat')pts=[[ca[0]-40,ca[1]],[cb[0]-40,cb[1]]];if(r.type=='cable')pts=[[ca[0]+40,ca[1]],[ca[0]+40,A[1]-60],[cb[0]-10,A[1]-60],[cb[0]-10,cb[1]]];if(r.type=='train')pts=[[ca[0]+30,ca[1]],[ca[0]+30,cb[1]+30],[cb[0],cb[1]+30]];if(r.type=='magic')pts=[[ca[0]+40,ca[1]],[ca[0]+40,cb[1]+20],[cb[0],cb[1]+20]];
  if(r.type=='bus')pts=[[ca[0],ca[1]-30],[ca[0]+40,ca[1]-30],[ca[0]+40,A[1]-25],[cb[0]-20,A[1]-25],[cb[0]-20,cb[1]-30]];
  ctx.strokeStyle=un?RT[r.type].c:RT.blocked.c;ctx.lineWidth=Math.max(2,4*s);ctx.setLineDash(un?[]:[8*s,6*s]);ctx.beginPath();pts.forEach((p,k)=>{const q=P(...p);k?ctx.lineTo(...q):ctx.moveTo(...q);});ctx.stroke();ctx.setLineDash([]);
  if(!un){const m=pts[Math.floor(pts.length/2)],q=P(...m);rect(ctx,q[0]-9*s,q[1]-9*s,18*s,18*s,'#fff');ctx.fillStyle='#8a7350';ctx.font=`bold ${Math.round(13*s)}px sans-serif`;ctx.textAlign='center';ctx.fillText('🔒',q[0],q[1]-8*s);ctx.textAlign='left';}});
 // thumbnails
 for(const id of AORDER){const [x,y]=MAPL[id],[px,py]=P(x,y);thumbs[id]=thumbs[id]||thumb(id);ctx.imageSmoothingEnabled=true;
  const vis=S.visited[id];ctx.globalAlpha=vis?1:.45;ctx.drawImage(thumbs[id],px,py,tw*s,th*s);ctx.globalAlpha=1;ctx.strokeStyle='#222';ctx.lineWidth=2;ctx.strokeRect(px,py,tw*s,th*s);
  if(!vis){ctx.fillStyle='#0008';ctx.fillRect(px,py,tw*s,th*s);ctx.fillStyle='#fff';ctx.font=`bold ${Math.round(14*s)}px sans-serif`;ctx.textAlign='center';ctx.fillText('? unexplored',px+tw*s/2,py+th*s/2-7*s);ctx.textAlign='left';}
  ctx.fillStyle='#222';ctx.font=`bold ${Math.round(12*s)}px sans-serif`;ctx.fillText(AREAS[id].name,px,py+th*s+4*s);
  if(id==area.id){ctx.strokeStyle='#ff2a8a';ctx.lineWidth=3+Math.sin(t*5)*1.5;ctx.strokeRect(px-4,py-4,tw*s+8,th*s+8);const a=AREAS[id];ctx.fillStyle='#ff2a8a';ctx.beginPath();ctx.arc(px+S.px/(a.cols*T)*tw*s,py+S.py/(a.rows*T)*th*s,5*s+2,0,7);ctx.fill();ctx.fillStyle='#ff2a8a';ctx.font=`bold ${Math.round(12*s)}px sans-serif`;ctx.fillText('YOU ARE HERE',px+tw*s-90*s,py+th*s+4*s);}
  const r=ROUTES.find(r=>r.type!='walk'&&isUnlocked(r)&&(r.a==area.id&&r.b==id||r.b==area.id&&r.a==id));if(r)mapBtns.push({r:[px,py,tw*s,th*s],f:()=>travel(r),thumb:1});}
 ctx.imageSmoothingEnabled=false;
 // legend
 const [lx,ly]=P(30,330);const L=Object.keys(RT);ctx.fillStyle='#fff';ctx.fillRect(lx,ly,190*s,(L.length*24+16)*s);ctx.strokeStyle='#666';ctx.lineWidth=1;ctx.strokeRect(lx,ly,190*s,(L.length*24+16)*s);
 L.forEach((k,i)=>{rect(ctx,lx+10*s,ly+(10+i*24)*s,18*s,18*s,'#333');rect(ctx,lx+11*s,ly+(11+i*24)*s,16*s,16*s,RT[k].c);ctx.fillStyle='#222';ctx.font=`${Math.round(14*s)}px sans-serif`;ctx.fillText(RT[k].n,lx+36*s,ly+(11+i*24)*s);});
 // travel buttons
 const avail=ROUTES.filter(r=>r.type!='walk'&&(r.a==area.id||r.b==area.id));let bx=P(30,140)[0],by=P(30,140)[1];
 ctx.font=`bold ${Math.round(13*s)}px sans-serif`;ctx.fillStyle='#222';ctx.fillText('FAST TRAVEL',bx,by-20*s);
 if(!avail.length){ctx.font=`${Math.round(12*s)}px sans-serif`;ctx.fillText('No stations here.',bx,by);}
 avail.forEach((r,i)=>{const un=isUnlocked(r),to=r.a==area.id?r.b:r.a,bw=230*s,bh=30*s,y=by+i*36*s;ctx.fillStyle=un?RT[r.type].c:'#ccc';ctx.fillRect(bx,y,bw,bh);ctx.fillStyle=un?(r.type=='bus'?'#000':'#fff'):'#666';ctx.font=`bold ${Math.round(12*s)}px sans-serif`;
  const need=r.req&&BL[r.req]?'build '+BL[r.req].n:r.req?'repair '+r.req:'';ctx.fillText(`${i+1}. ${RT[r.type].n.split(' ')[0]} → ${AREAS[to].name}${un?'':' 🔒 '+need}`,bx+8*s,y+8*s);if(un)mapBtns.unshift({r:[bx,y,bw,bh],f:()=>travel(r)});});
 mapBtns.sort((p,q)=>(p.thumb||0)-(q.thumb||0));
 const cb=[W-110*s-10,10,110*s,34*s];rect(ctx,...cb,'#222');ctx.fillStyle='#fff';ctx.font=`bold ${Math.round(14*s)}px sans-serif`;ctx.fillText('✕ CLOSE',cb[0]+16*s,cb[1]+9*s);mapBtns.push({r:cb,f:()=>{showMap=false;}});
 ctx.font=`${Math.round(11*s)}px sans-serif`;ctx.fillStyle='#555';ctx.fillText(isTouch?'Tap a destination or route to travel':'Click a destination or press its number · M to close',P(30,560)[0],P(30,560)[1]);}
let last=performance.now(),T0=0;
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;T0+=dt;update(dt);const night=nightF();
 if(showMap){thumbs={};drawMap(T0);}else{const a=area,W=a.cols*T,H=a.rows*T;
  ctx.setTransform(zoom,0,0,zoom,0,0);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#05030f';ctx.fillRect(0,0,vw,vh);
  const cam={x:Math.round(Math.max(0,Math.min(W-vw,S.px-vw/2))),y:Math.round(Math.max(0,Math.min(H-vh,S.py-vh/2)))};if(W<vw)cam.x=Math.round(-(vw-W)/2);if(H<vh)cam.y=Math.round(-(vh-H)/2);
  drawWorld(cam,night,T0);drawHUD(night,T0);}
 document.body.classList.toggle('mapopen',showMap);requestAnimationFrame(frame);}
if(!loaded)setTimeout(()=>{toast(S.oldSave?'New v0.0.0.6 world! Old save reset (+100g bonus)':'Welcome! Gather wood in Whisper Forest ▶');toast(isTouch?'Tap BUILD to place buildings':'Press B to build, M for world map');},400);
requestAnimationFrame(frame);
window.FT={get S(){return S},act,place,rebuild,goArea,travel,ROUTES,setPos(x,y){S.px=x*T+8;S.py=y*T+8},set bsel(v){bsel=v},set build(v){build=v},set map(v){showMap=v}};
