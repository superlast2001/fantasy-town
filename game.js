'use strict';
// Fantasy Town v0.0.0.5 — all art drawn in code
const VERSION='v0.0.0.5', T=16, COLS=98, ROWS=68, W=COLS*T, H=ROWS*T, SAVE='fantasytown_save_v5';
const cv=document.getElementById('c'), ctx=cv.getContext('2d');
const menuEl=document.getElementById('menu');
const Q=new URLSearchParams(location.search);
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=rng(1337);
// ---------- districts ----------
const D={
 resort:{n:'1 RESORT HOME',r:[2,2,30,20]}, sky:{n:'2 SKY TOWERS',r:[34,2,30,20]}, scrap:{n:'3 SCRAP YARD',r:[66,2,30,20]},
 garden:{n:'4 GARDEN DOME',r:[2,24,30,20]}, plaza:{n:'5 CENTRAL PLAZA',r:[34,24,30,20]}, market:{n:'6 NEON MARKET',r:[66,24,30,20]},
 res:{n:'7 RESIDENCES',r:[2,46,30,20]}, marina:{n:'8 MARINA',r:[34,46,62,20]}};
const G=0,ROAD=1,WATER=2,SAND=3,GRID=4,CONC=5,SOIL=6,BOARD=7,DIRT=8,POOL=9,CHECK=10,LAWN=11;
const tile=[],solid=[];
for(let y=0;y<ROWS;y++){tile.push(new Array(COLS).fill(ROAD));solid.push(new Array(COLS).fill(0));}
function fill(x,y,w,h,t){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)tile[j][i]=t;}
function sol(x,y,w,h,v=1){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)solid[j][i]=v;}
function inD(k,x,y){const r=D[k].r;return x>=r[0]&&y>=r[1]&&x<r[0]+r[2]&&y<r[1]+r[3];}
function districtAt(x,y){for(const k in D)if(inD(k,x,y))return k;return null;}
fill(...D.resort.r,G);fill(...D.sky.r,CONC);fill(...D.scrap.r,DIRT);fill(...D.garden.r,G);
fill(...D.plaza.r,GRID);fill(...D.market.r,CONC);fill(...D.res.r,CHECK);fill(...D.marina.r,SAND);
// borders
sol(0,0,COLS,1);sol(0,ROWS-1,COLS,1);sol(0,0,1,ROWS);sol(COLS-1,0,1,ROWS);
// resort
fill(6,10,9,5,POOL);sol(6,10,9,5);
const HOUSE={x:19,y:4,w:9,h:6,door:[23,9]};sol(HOUSE.x,HOUSE.y,HOUSE.w,HOUSE.h);
fill(17,10,12,1,CONC);fill(23,10,1,5,CONC);
// sky towers
const TOWERS=[[36,6,6,13,'#5b6cff'],[43,4,6,15,'#38e0ff'],[50,7,5,12,'#ff4fd8'],[56,5,6,14,'#8f7bff']];
TOWERS.forEach(t=>sol(t[0],t[1],t[2],t[3]));
// scrap
const CRANE={x:88,y:5};sol(88,5,2,12);sol(80,5,10,1,0);
// garden
const DOME={cx:17,cy:34,r:9};
const PLOT={x:11,y:31,w:12,h:7};fill(PLOT.x,PLOT.y,PLOT.w,PLOT.h,SOIL);
const TREES=[[5,27],[8,40],[28,28],[27,40],[4,35],[29,34],[10,27],[24,27]];TREES.forEach(t=>solid[t[1]][t[0]]=1);
// plaza
const FOUNT={x:47,y:33,w:4,h:3};sol(FOUNT.x,FOUNT.y,FOUNT.w,FOUNT.h);
const STAGE={x:36,y:37,w:7,h:4};sol(STAGE.x,STAGE.y,STAGE.w,STAGE.h);
const CLUB={x:48,y:26,w:8,h:3};sol(CLUB.x,CLUB.y,CLUB.w,CLUB.h);
// market
const STALLS=[[69,28,7,4,'#38e0ff','SEEDS'],[78,28,7,4,'#3dff9a','GOODS'],[87,28,7,4,'#c45bff','TRADE']];
STALLS.forEach(s=>sol(s[0],s[1],s[2],s[3]));
const MINI=[[70,37,'#ff4fd8'],[75,37,'#38e0ff'],[80,37,'#ffb43a'],[85,37,'#3dff9a']];MINI.forEach(m=>sol(m[0],m[1],3,2));
// residences
const APTS=[[3,48,6,11,'#c23a7a','AMBER'],[10,48,6,11,'#d0832a','PIP'],[17,48,6,11,'#a3203a','NOVA'],[24,48,6,11,'#3a5ac2','SIGIL']];
APTS.forEach(a=>sol(a[0],a[1],a[2],a[3]));
const PALMS=[[3,5],[3,13],[5,19],[13,4],[15,18],[30,15],[29,4],[4,62],[12,62],[20,62],[28,62],[35,48],[94,48]];PALMS.forEach(p=>solid[p[1]][p[0]]=1);
// marina
fill(34,52,62,2,BOARD);fill(34,54,62,12,WATER);sol(34,54,62,12);
const PIERS=[40,52,66,80,90];PIERS.forEach(px=>{fill(px,54,2,8,BOARD);sol(px,54,2,8,0);});
const LAMPS=[];for(let x=36;x<96;x+=6)LAMPS.push([x,52]);
// ---------- items ----------
const ITEMS={wood:{n:'Wood',p:4,c:'#9a6a3a'},ore:{n:'Ore',p:12,c:'#8fa3c8'},scrap:{n:'Scrap',p:6,c:'#b0a080'},shell:{n:'Shell',p:9,c:'#ffd0e8'},neon:{n:'Neon',p:20,c:'#ff4fd8'},
 fish:{n:'Glowfish',p:18,c:'#38e0ff'},turnip:{n:'Lumi Turnip',p:30,c:'#e8f0ff'},berry:{n:'Glowberry',p:55,c:'#3dff9a'},star:{n:'Starfruit',p:120,c:'#ffd84a'}};
const CROPS={turnip:{seed:'s_turnip',days:3,c:'#e8f0ff',cost:15},berry:{seed:'s_berry',days:4,c:'#3dff9a',cost:30},star:{seed:'s_star',days:6,c:'#ffd84a',cost:60}};
const HOT=[{id:'hoe',n:'Hoe'},{id:'can',n:'Water Can'},{id:'pick',n:'Pickaxe'},{id:'rod',n:'Rod'},{id:'s_turnip',n:'Turnip Seed',crop:'turnip'},{id:'s_berry',n:'Berry Seed',crop:'berry'},{id:'s_star',n:'Star Seed',crop:'star'}];
// ---------- state ----------
let S;
function newState(){return{day:1,min:6*60,gold:150,inv:{s_turnip:6,s_berry:2},px:23*T+8,py:12*T,face:'down',sel:0,soil:{},nodes:[],seen:{}};}
function spawnNodes(){
 S.nodes=[];const put=(k,type,n)=>{const r=D[k].r;let tries=0;while(n>0&&tries++<500){const x=r[0]+1+Math.floor(Math.random()*(r[2]-2)),y=r[1]+2+Math.floor(Math.random()*(r[3]-3));
  if(solid[y][x]||S.nodes.some(o=>o.x==x&&o.y==y)||(type=='shell'&&tile[y][x]!=SAND))continue;S.nodes.push({x,y,type});n--;}};
 put('scrap','scrap',12);put('scrap','ore',7);put('marina','shell',8);put('sky','neon',3);put('plaza','neon',2);
 S.trees={};
}
function load(){try{const j=JSON.parse(localStorage.getItem(SAVE));if(j&&j.day){S=Object.assign(newState(),j);return true;}}catch(e){}S=newState();spawnNodes();return false;}
function save(){localStorage.setItem(SAVE,JSON.stringify(S));toast('Game saved');}
load();if(!S.nodes.length)spawnNodes();
if(Q.has('t'))S.min=parseFloat(Q.get('t'))*60;
// ---------- art ----------
const base=document.createElement('canvas');base.width=W;base.height=H;const b=base.getContext('2d');
const emis=document.createElement('canvas');emis.width=W;emis.height=H;const e=emis.getContext('2d');
const BOTH=f=>{f(b);f(e);};
const LIGHTS=[];// [x,y,radius,color]
const shade=(c,a)=>{const n=parseInt(c.slice(1),16);let r=n>>16,g=n>>8&255,bl=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(v*a)));return'#'+((1<<24)|(f(r)<<16)|(f(g)<<8)|f(bl)).toString(16).slice(1);};
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h);}
function drawTile(x,y){
 const t=tile[y][x],px=x*T,py=y*T,v=R();
 switch(t){
 case G:case LAWN:rect(b,px,py,T,T,v<.5?'#2f6b3a':'#2c6536');for(let i=0;i<3;i++)rect(b,px+Math.floor(R()*15),py+Math.floor(R()*14),1,2,'#3f8a47');break;
 case ROAD:rect(b,px,py,T,T,'#1d1f2e');rect(b,px,py,T,1,'#23263a');if(R()<.1)rect(b,px+Math.floor(R()*14),py+Math.floor(R()*14),2,1,'#2a2d44');break;
 case WATER:rect(b,px,py,T,T,v<.5?'#0d2050':'#0f2458');if(R()<.3)rect(b,px+Math.floor(R()*12),py+Math.floor(R()*14),4,1,'#1c3c80');break;
 case SAND:rect(b,px,py,T,T,v<.5?'#6e6150':'#6a5d4c');for(let i=0;i<3;i++)rect(b,px+Math.floor(R()*15),py+Math.floor(R()*15),1,1,'#857560');break;
 case GRID:rect(b,px,py,T,T,'#16123a');BOTH(c=>{rect(c,px,py,T,1,'#3a2cff88');rect(c,px,py,1,T,'#3a2cff88');});break;
 case CONC:rect(b,px,py,T,T,(x+y)%2?'#3a3a52':'#36364c');rect(b,px,py,T,1,'#43435e');break;
 case SOIL:rect(b,px,py,T,T,'#3b5a2e');rect(b,px+1,py+1,T-2,T-2,'#35532a');break;
 case BOARD:rect(b,px,py,T,T,'#6b4a2c');for(let i=0;i<4;i++)rect(b,px,py+i*4+3,T,1,'#4f3520');break;
 case DIRT:rect(b,px,py,T,T,v<.5?'#4a4650':'#47434c');if(R()<.4)rect(b,px+Math.floor(R()*13),py+Math.floor(R()*13),3,2,'#3a3740');break;
 case POOL:rect(b,px,py,T,T,'#1aa6d8');BOTH(c=>{rect(c,px,py,T,T,'#22c8ff88');if(R()<.4)rect(c,px+Math.floor(R()*10),py+Math.floor(R()*14),5,1,'#b8f4ff');});break;
 case CHECK:rect(b,px,py,T,T,(x+y)%2?'#4d4d5c':'#5a5a6a');break;}
}
function palm(c,x,y){const px=x*T+8,py=y*T+14;rect(c,px-1,py-14,3,14,'#6b4a2c');rect(c,px,py-14,1,14,'#8a6238');
 c.fillStyle='#2e9a4a';[[-9,-16,8,3],[2,-16,8,3],[-7,-19,5,3],[2,-19,5,3],[-3,-20,6,3],[-11,-13,4,3],[7,-13,4,3]].forEach(a=>c.fillRect(px+a[0],py+a[1],a[2],a[3]));
 rect(c,px-2,py-17,5,2,'#3fc060');rect(c,px-6,py-1,12,2,'#0005');}
function tree(c,x,y){const px=x*T+8,py=y*T+15;rect(c,px-7,py-1,14,2,'#0005');rect(c,px-1,py-6,3,6,'#5b3a20');
 c.fillStyle='#1f6b33';c.beginPath();c.arc(px,py-11,7,0,7);c.fill();c.fillStyle='#2f8f44';c.beginPath();c.arc(px-2,py-13,4,0,7);c.fill();}
function sign(c,x,y,txt,big=true){
 c.font=big?'bold 18px monospace':'bold 7px monospace';const w=Math.ceil(c.measureText(txt).width)+(big?14:6),h=big?24:9;
 x=Math.round(x-w/2);rect(c,x-2,y-2,w+4,h+4,'#2a1a08');rect(c,x,y,w,h,'#f0d58a');rect(c,x,y,w,2,'#fff3c8');rect(c,x,y+h-2,w,2,'#b8954a');
 if(big){rect(c,x+4,y+9,5,5,'#2a1a08');}
 c.fillStyle='#1a1008';c.textBaseline='middle';c.textAlign='center';c.fillText(txt,x+w/2+(big?2:0),y+h/2+1);}
function windows(c,x,y,w,h,col,rnd){for(let j=y;j<y+h;j+=4)for(let i=x;i<x+w;i+=4){const on=rnd()<.78;rect(c,i,j,2,2,on?col:'#141428');}}
function buildArt(){
 for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)drawTile(x,y);
 // road neon edges + lamp nodes
 const edge='#2ff6ff';
 for(const k in D){const r=D[k].r;const x=r[0]*T,y=r[1]*T,w=r[2]*T,h=r[3]*T;
  BOTH(c=>{rect(c,x-3,y-3,w+6,2,'#1ec8ff');rect(c,x-3,y+h+1,w+6,2,'#1ec8ff');rect(c,x-3,y-3,2,h+6,'#1ec8ff');rect(c,x+w+1,y-3,2,h+6,'#1ec8ff');});
  for(let i=0;i<=r[2];i+=5){for(const yy of[y-2,y+h+2]){BOTH(c=>rect(c,x+i*T-2,yy-2,4,4,'#c8ffff'));LIGHTS.push([x+i*T,yy,22,'#2ff6ff']);}}
  for(let j=0;j<=r[3];j+=5){for(const xx of[x-2,x+w+2]){BOTH(c=>rect(c,xx-2,y+j*T-2,4,4,'#c8ffff'));LIGHTS.push([xx,y+j*T,22,'#2ff6ff']);}}
 }
 // road dashes
 for(const ry of[22.5,44.5])for(let x=0;x<W;x+=24)BOTH(c=>rect(c,x,ry*T,10,1,'#ffd84a66'));
 for(const rx of[32.5,64.5])for(let y=0;y<H;y+=24)BOTH(c=>rect(c,rx*T,y,1,10,'#ffd84a66'));
 // resort
 const hx=HOUSE.x*T,hy=HOUSE.y*T;rect(b,hx-4,hy+HOUSE.h*T-6,HOUSE.w*T+8,10,'#0006');
 rect(b,hx,hy+18,HOUSE.w*T,HOUSE.h*T-18,'#d8d0c0');rect(b,hx,hy+18,HOUSE.w*T,4,'#fff');
 rect(b,hx-4,hy,HOUSE.w*T+8,22,'#5a4a6a');rect(b,hx-4,hy,HOUSE.w*T+8,3,'#7a6a90');rect(b,hx+8,hy+4,HOUSE.w*T-16,12,'#463a56');
 for(let i=0;i<4;i++)BOTH(c=>{rect(c,hx+10+i*32,hy+34,18,14,'#ffd88a');rect(c,hx+10+i*32,hy+40,18,1,'#c09040');rect(c,hx+19+i*32,hy+34,1,14,'#c09040');});
 const dx=HOUSE.door[0]*T,dy=HOUSE.door[1]*T;rect(b,dx+2,dy-4,12,20,'#5b3a20');BOTH(c=>rect(c,dx+11,dy+6,2,2,'#ffd84a'));LIGHTS.push([dx+8,dy+14,40,'#ffcf7a']);
 LIGHTS.push([hx+72,hy+44,90,'#ffcf7a']);
 // pool
 BOTH(c=>{c.strokeStyle='#bff';c.lineWidth=2;c.strokeRect(6*T+1,10*T+1,9*T-2,5*T-2);});LIGHTS.push([10.5*T,12.5*T,110,'#22d8ff']);
 rect(b,5*T,15*T+2,11*T,6,'#c8c0b0');for(let i=0;i<3;i++){rect(b,7*T+i*40,16*T+2,20,8,'#ff7ab0');rect(b,7*T+i*40,16*T+2,20,2,'#fff');}
 // sky towers
 const wr=rng(77);
 TOWERS.forEach(([x,y,w,h,col])=>{const px=x*T,py=y*T,pw=w*T,ph=h*T;rect(b,px+6,py+ph-4,pw,10,'#0007');
  rect(b,px,py,pw,ph,'#1a1a34');rect(b,px,py,3,ph,'#2a2a50');rect(b,px+pw-3,py,3,ph,'#101022');rect(b,px-2,py-4,pw+4,6,'#2c2c56');
  BOTH(c=>{windows(c,px+5,py+8,pw-10,ph-30,col,wr);rect(c,px+pw/2-8,py+ph-14,16,14,'#9ff');rect(c,px,py-4,pw,2,col);});
  LIGHTS.push([px+pw/2,py+ph,70,col]);LIGHTS.push([px+pw/2,py+ph/2,60,col]);
  BOTH(c=>rect(c,px+pw/2-1,py-14,2,10,'#888'));BOTH(c=>rect(c,px+pw/2-2,py-16,4,3,'#ff3050'));LIGHTS.push([px+pw/2,py-15,16,'#ff3050']);});
 // scrap yard: crane + debris decor + container stacks
 const cx=CRANE.x*T,cy=CRANE.y*T;b.fillStyle='#c08a1a';for(let j=0;j<12*T;j+=8){b.fillRect(cx,cy+j,3,8);b.fillRect(cx+29,cy+j,3,8);b.fillRect(cx+3,cy+j,26,2);}
 b.fillRect(cx-140,cy-4,180,6);for(let i=0;i<180;i+=10)b.fillRect(cx-140+i,cy-8,2,4);rect(b,cx-110,cy+2,1,60,'#888');rect(b,cx-116,cy+62,13,8,'#666');
 BOTH(c=>rect(c,cx+14,cy-14,4,4,'#ff3050'));LIGHTS.push([cx+16,cy-12,20,'#ff3050']);
 [[69,15,'#7a3a2a'],[69,17,'#3a5a7a'],[73,17,'#5a6a3a'],[76,4,'#5a4a6a']].forEach(([x,y,col])=>{sol(x,y,3,2);rect(b,x*T,y*T,3*T,2*T-2,col);for(let i=2;i<3*T;i+=4)rect(b,x*T+i,y*T,1,2*T-2,shade(col,.7));rect(b,x*T,y*T+2*T-2,3*T,2,'#0006');});
 // garden dome
 const dX=DOME.cx*T,dY=DOME.cy*T,dr=DOME.r*T;
 b.save();b.beginPath();b.arc(dX,dY,dr,0,7);b.clip();rect(b,dX-dr,dY-dr,dr*2,dr*2,'#28603355');b.restore();
 for(const c of[b,e]){c.save();c.strokeStyle='#5dff9a';c.lineWidth=2;c.beginPath();c.arc(dX,dY,dr,0,7);c.stroke();c.globalAlpha=.35;c.lineWidth=1;
  for(let a=0;a<6;a++){c.beginPath();c.ellipse(dX,dY,dr*Math.abs(Math.cos(a*Math.PI/6)),dr,0,0,7);c.stroke();}c.beginPath();c.ellipse(dX,dY,dr,dr*.45,0,0,7);c.stroke();c.restore();}
 LIGHTS.push([dX,dY,dr*1.3,'#3dff7a']);
 [[12,28],[22,28],[9,33],[25,33],[13,39],[21,39],[17,29]].forEach(t=>{tree(b,t[0],t[1]);solid[t[1]][t[0]]=1;});
 TREES.forEach(t=>tree(b,t[0],t[1]));
 const sr=rng(9);for(let i=0;i<70;i++){const x=(67+sr()*28)*T,y=(4+sr()*17)*T;rect(b,x,y,3+sr()*6|0,2+sr()*3|0,['#5a5660','#6a5a48','#3a3a44','#7a4a30'][i%4]);}
 for(let i=0;i<4;i++){const x=(70+i*5)*T,y=10*T;rect(b,x,y+8,20,8,'#0006');rect(b,x+2,y,16,10,'#5a5868');rect(b,x+6,y-4,8,6,'#6e6a7a');}
 rect(b,PLOT.x*T-3,PLOT.y*T-3,PLOT.w*T+6,PLOT.h*T+6,'#5b3a20');
 // plaza
 const fx=FOUNT.x*T,fy=FOUNT.y*T;BOTH(c=>{c.fillStyle='#2a2a6a';c.beginPath();c.ellipse(fx+32,fy+30,34,16,0,0,7);c.fill();c.fillStyle='#38e0ff';c.beginPath();c.ellipse(fx+32,fy+28,28,11,0,0,7);c.fill();});
 LIGHTS.push([fx+32,fy+24,90,'#38e0ff']);
 const sx=STAGE.x*T,sy=STAGE.y*T;rect(b,sx,sy,STAGE.w*T,STAGE.h*T,'#2a1a3a');rect(b,sx,sy,STAGE.w*T,6,'#4a2a6a');
 BOTH(c=>{rect(c,sx,sy+STAGE.h*T-3,STAGE.w*T,3,'#ff4fd8');for(let i=0;i<5;i++)rect(c,sx+10+i*20,sy+2,6,3,'#ffd84a');});LIGHTS.push([sx+56,sy+30,80,'#ff4fd8']);
 const kx=CLUB.x*T,ky=CLUB.y*T;rect(b,kx,ky,CLUB.w*T,CLUB.h*T,'#1a0f2a');BOTH(c=>{rect(c,kx,ky+CLUB.h*T-4,CLUB.w*T,4,'#c45bff');c.font='bold 9px monospace';c.fillStyle='#ff9cf0';c.textAlign='center';c.textBaseline='middle';c.fillText('NIGHTCLUB',kx+64,ky+20);});LIGHTS.push([kx+64,ky+40,70,'#c45bff']);
 // market
 STALLS.forEach(([x,y,w,h,col,nm])=>{const px=x*T,py=y*T,pw=w*T,ph=h*T;rect(b,px+4,py+ph,pw,6,'#0007');rect(b,px,py+16,pw,ph-16,'#22223a');
  BOTH(c=>{for(let i=0;i<pw;i+=14){rect(c,px+i,py,7,18,col);rect(c,px+i+7,py,7,18,shade(col,.55));}rect(c,px,py+18,pw,2,'#fff');rect(c,px+6,py+28,pw-12,ph-38,shade(col,.8));
   c.font='bold 10px monospace';c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(nm,px+pw/2,py+ph-16);});
  for(let i=0;i<4;i++)BOTH(c=>rect(c,px+14+i*22,py+34,8,6,['#ffd84a','#ff6a6a','#9fff7a','#fff'][i]));
  LIGHTS.push([px+pw/2,py+ph,90,col]);});
 MINI.forEach(([x,y,col])=>{const px=x*T,py=y*T;rect(b,px,py+8,48,24,'#22223a');BOTH(c=>{rect(c,px-2,py,52,10,col);rect(c,px+4,py+14,40,6,shade(col,.7));});LIGHTS.push([px+24,py+20,40,col]);});
 // residences
 const ar=rng(5);
 APTS.forEach(([x,y,w,h,col,nm])=>{const px=x*T,py=y*T,pw=w*T,ph=h*T;rect(b,px+5,py+ph-4,pw,8,'#0007');rect(b,px,py,pw,ph,col);rect(b,px,py,pw,6,shade(col,1.3));rect(b,px+pw-4,py,4,ph,shade(col,.7));
  BOTH(c=>{for(let j=py+12;j<py+ph-24;j+=12)for(let i=px+6;i<px+pw-10;i+=12){const on=ar()<.7;rect(c,i,j,7,7,on?(ar()<.5?'#ffe08a':'#b8a0ff'):'#2a2040');}rect(c,px+pw/2-6,py+ph-16,12,16,'#8ff');});
  rect(b,px+4,py+ph-24,pw-8,3,'#0006');LIGHTS.push([px+pw/2,py+ph,50,'#ffd08a']);
  sign(b,px+pw/2,py+ph+20,nm,false);sign(e,px+pw/2,py+ph+20,nm,false);});
 // marina
 for(let x=34*T;x<96*T;x+=8)rect(b,x,52*T-3,4,3,'#4f3520');
 PIERS.forEach(px=>{for(let j=54;j<62;j++)rect(b,px*T-2,j*T+12,2,4,'#3a2414');rect(b,px*T+2*T,62*T,1,1,'#000');});
 LAMPS.forEach(([x,y])=>{const px=x*T+8,py=y*T;rect(b,px-1,py-14,2,14,'#444');BOTH(c=>{rect(c,px-3,py-18,6,5,'#ffe9a8');});LIGHTS.push([px,py-15,46,'#ffd88a']);});
 BOTH(c=>{for(let i=0;i<60;i++){c.fillStyle='#38e0ff22';c.fillRect(34*T+Math.floor(R()*62*T),54*T+Math.floor(R()*12*T),6,1);}});
 PALMS.forEach(p=>palm(b,p[0],p[1]));
 // district signs + small labels
 for(const k in D){const r=D[k].r;const s=c=>sign(c,(r[0]+(k=='marina'?20:r[2]/2))*T,r[1]*T+4,D[k].n);s(b);s(e);}
 [[10.5,9.2,'POOL'],[23.5,3.2,'PENTHOUSE'],[49,36.6,'HOLO FOUNTAIN'],[39.5,41.4,'STAGE'],[11,44.1,'GARDEN PLOT'],[42,51,'BOARDWALK'],[17,21,'RIVER LANE']].forEach(([x,y,t])=>{sign(b,x*T,y*T,t,false);sign(e,x*T,y*T,t,false);});
}
buildArt();
// glow sprite cache
const glowC={};
function glow(col){if(glowC[col])return glowC[col];const g=document.createElement('canvas');g.width=g.height=64;const c=g.getContext('2d');const gr=c.createRadialGradient(32,32,0,32,32,32);
 gr.addColorStop(0,col+'cc');gr.addColorStop(.35,col+'55');gr.addColorStop(1,col+'00');c.fillStyle=gr;c.fillRect(0,0,64,64);return glowC[col]=g;}
// ---------- NPCs ----------
const NPCS=[
 {n:'Mayor Lumen',x:44,y:31,c:'#ffd84a',h:'#f0f0f0',lines:['Welcome to Fantasy Town! The neon never sleeps, but you should.','Grow something in the Garden Dome. The soil there remembers sunlight.','Sleep at your Resort Home to end the day and save.']},
 {n:'Vexa',x:53,y:38,c:'#ff4fd8',h:'#3a1a5a',lines:['Scrap Yard piles refresh every morning. Bring a pickaxe!','Neon shards fall from the Sky Towers. Rare, and they sell for 20g.','The nightclub opens at dusk. Just kidding, it is always open.']},
 {n:'Old Coral',x:58,y:29,c:'#38e0ff',h:'#c0c0c0',lines:['Stand on a pier, face the water and use your rod. Glowfish bite at night.','Shells wash up on the Marina sand each dawn.','Starfruit takes six days, but merchants pay 120g!']},
 {n:'Bolt',x:40,y:33,c:'#3dff9a',h:'#ff8a2a',lines:['Beep. Water your crops every day or they will not grow.','Hotbar: 1-7 or tap the slots. B cycles tools on touch.','Press M for the town map.']},
];
NPCS.forEach(n=>{n.px=n.x*T+8;n.py=n.y*T+8;n.hx=n.px;n.hy=n.py;n.t=0;n.dx=0;n.dy=0;n.li=0;});
function npcSolidAt(tx,ty){return NPCS.some(n=>Math.floor(n.px/T)==tx&&Math.floor(n.py/T)==ty);}
// ---------- input ----------
const keys={};let actPressed=false;
addEventListener('keydown',ev=>{const k=ev.key.toLowerCase();if(menuOpen()){if(k=='escape'||k=='e'||k==' '&&!dialog)closeMenu();else if(dialog&&(k==' '||k=='enter'||k=='e'))closeMenu();return;}
 keys[k]=1;if(k==' '||k=='e'||k=='enter'){actPressed=true;ev.preventDefault();}
 if(k>='1'&&k<='7')S.sel=+k-1;if(k=='q'||k=='tab'){S.sel=(S.sel+1)%HOT.length;ev.preventDefault();}if(k=='m')showMap=!showMap;if(k.startsWith('arrow'))ev.preventDefault();});
addEventListener('keyup',ev=>{keys[ev.key.toLowerCase()]=0;});
const touchEl=document.getElementById('touch');const isTouch=('ontouchstart' in window)||matchMedia('(pointer:coarse)').matches||Q.has('touch');
if(isTouch)touchEl.style.display='block';
touchEl.querySelectorAll('.tb').forEach(btn=>{const k=btn.dataset.k;const on=ev=>{ev.preventDefault();if(k=='act')actPressed=true;else if(k=='tool')S.sel=(S.sel+1)%HOT.length;else if(k=='map')showMap=!showMap;else keys['t_'+k]=1;};
 const off=ev=>{ev.preventDefault();keys['t_'+k]=0;};btn.addEventListener('pointerdown',on);btn.addEventListener('pointerup',off);btn.addEventListener('pointerleave',off);btn.addEventListener('pointercancel',off);});
cv.addEventListener('pointerdown',ev=>{const s=hotbarSlotAt(ev.clientX,ev.clientY);if(s>=0)S.sel=s;else if(showMap)showMap=false;});
// ---------- menus ----------
let dialog=false;
function menuOpen(){return menuEl.style.display=='block';}
function closeMenu(){menuEl.style.display='none';dialog=false;}
function openMenu(html){menuEl.innerHTML=html;menuEl.style.display='block';for(const k in keys)keys[k]=0;}
function talk(n){dialog=true;openMenu(`<h3>${n.n}</h3><p>${n.lines[n.li++%n.lines.length]}</p><button onclick="closeMenu()">OK</button>`);
 if(!S.seen[n.n]){S.seen[n.n]=1;}}
function shop(){const sellable=Object.keys(ITEMS).filter(k=>S.inv[k]>0);let tot=0;sellable.forEach(k=>tot+=ITEMS[k].p*S.inv[k]);
 let h=`<h3>NEON MARKET</h3><div>Gold: ${S.gold}g</div>`;
 for(const c in CROPS){const s=CROPS[c];h+=`<button onclick="buy('${s.seed}',${s.cost})">Buy ${HOT.find(x=>x.id==s.seed).n} — ${s.cost}g (have ${S.inv[s.seed]||0})</button>`;}
 h+=`<button onclick="sellAll()">Sell all goods — ${tot}g</button>`;
 sellable.forEach(k=>h+=`<button onclick="sell1('${k}')">Sell 1 ${ITEMS[k].n} (${S.inv[k]}) — ${ITEMS[k].p}g</button>`);
 h+=`<button onclick="closeMenu()">Close (Esc)</button>`;openMenu(h);}
window.buy=(id,c)=>{if(S.gold>=c){S.gold-=c;S.inv[id]=(S.inv[id]||0)+1;sfx(660);}else toast('Not enough gold');shop();};
window.sellAll=()=>{for(const k in ITEMS)if(S.inv[k]>0){S.gold+=ITEMS[k].p*S.inv[k];S.inv[k]=0;}sfx(880);shop();};
window.sell1=k=>{if(S.inv[k]>0){S.inv[k]--;S.gold+=ITEMS[k].p;sfx(800);}shop();};
window.closeMenu=closeMenu;
function sleepMenu(){openMenu(`<h3>Resort Home</h3><p>Sleep until morning? (saves the game)</p><button onclick="sleep()">Sleep</button><button onclick="closeMenu()">Not yet</button>`);}
window.sleep=(passed)=>{closeMenu();S.day++;S.min=6*60;
 for(const k in S.soil){const s=S.soil[k];if(s.crop&&s.w&&s.g<CROPS[s.crop].days)s.g++;s.w=false;}
 spawnNodes();S.px=23*T+8;S.py=11*T;S.face='down';fade=1;save();toast(passed?'You passed out... Day '+S.day:'Good morning! Day '+S.day);};
// ---------- feedback ----------
let toasts=[],fade=0,showMap=Q.has('map'),parts=[];
function toast(t){toasts.push({t,life:2.5});}
let actx=null;function sfx(f){try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.type='square';o.frequency.value=f;g.gain.value=.04;g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+.15);o.connect(g).connect(actx.destination);o.start();o.stop(actx.currentTime+.16);}catch(e){}}
function give(k,n=1,x,y){S.inv[k]=(S.inv[k]||0)+n;toast(`+${n} ${ITEMS[k].n}`);sfx(520+Math.random()*200);for(let i=0;i<8;i++)parts.push({x,y,vx:(Math.random()-.5)*60,vy:-Math.random()*60,l:.6,c:ITEMS[k].c});}
// ---------- actions ----------
function facingTile(){const cx=Math.floor(S.px/T),cy=Math.floor((S.py-4)/T);const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[S.face];return[cx+d[0],cy+d[1]];}
function act(){
 const [tx,ty]=facingTile();const tool=HOT[S.sel];const wx=tx*T+8,wy=ty*T+8;
 const npc=NPCS.find(n=>Math.abs(n.px-wx)<14&&Math.abs(n.py-wy)<14);if(npc){npc.dx=npc.dy=0;talk(npc);return;}
 if(tx==HOUSE.door[0]&&ty==HOUSE.door[1]){sleepMenu();return;}
 if(STALLS.some(s=>tx>=s[0]&&tx<s[0]+s[2]&&ty>=s[1]&&ty<s[1]+s[3])){shop();return;}
 const ni=S.nodes.findIndex(o=>o.x==tx&&o.y==ty);
 if(ni>=0){const o=S.nodes[ni];if(o.type=='shell'||o.type=='neon'||tool.id=='pick'){S.nodes.splice(ni,1);give(o.type,o.type=='scrap'?1+(Math.random()<.4):1,wx,wy);}else toast('Use the Pickaxe (3)');return;}
 const tr=TREES.findIndex(t=>t[0]==tx&&t[1]==ty);
 if(tr>=0){S.trees=S.trees||{};if(S.trees[tr])toast('This tree needs to rest');else{S.trees[tr]=1;give('wood',2,wx,wy);}return;}
 if(tile[ty]&&tile[ty][tx]==SOIL){const key=tx+','+ty;let s=S.soil[key];
  if(s&&s.crop&&s.g>=CROPS[s.crop].days){give(s.crop,1,wx,wy);delete s.crop;return;}
  if(tool.id=='hoe'){if(!s){S.soil[key]={w:false};sfx(200);}else toast('Already tilled');return;}
  if(tool.id=='can'){if(s){s.w=true;sfx(400);for(let i=0;i<6;i++)parts.push({x:wx,y:wy,vx:(Math.random()-.5)*40,vy:-Math.random()*30,l:.4,c:'#5cf'});}else toast('Till it first (Hoe)');return;}
  if(tool.crop){if(!s)toast('Till it first (Hoe)');else if(s.crop)toast('Already planted');else if(!(S.inv[tool.id]>0))toast('No seeds — buy at Neon Market');else{S.inv[tool.id]--;s.crop=tool.crop;s.g=0;sfx(300);}return;}
  if(s&&s.crop)toast(`${ITEMS[s.crop].n}: day ${s.g}/${CROPS[s.crop].days}${s.w?' (watered)':''}`);return;}
 if(tile[ty]&&tile[ty][tx]==WATER){if(tool.id=='rod'){if(fishing)return;fishing={t:1+Math.random()*1.5,x:wx,y:wy};toast('Casting...');}else toast('Use the Rod (4) to fish');return;}
 if(tile[ty]&&tile[ty][tx]==POOL){toast('No fishing in the pool!');return;}
}
let fishing=null;
// ---------- movement ----------
function blocked(x,y){const pts=[[x-5,y-5],[x+5,y-5],[x-5,y],[x+5,y]];return pts.some(([a,c])=>{const tx=Math.floor(a/T),ty=Math.floor(c/T);
 return tx<0||ty<0||tx>=COLS||ty>=ROWS||solid[ty][tx]||S.nodes.some(o=>o.x==tx&&o.y==ty&&o.type!='shell');});}
let walkT=0,moving=false;
function update(dt){
 if(menuOpen()||showMap){actPressed=false;return;}
 S.min+=dt*5; if(S.min>=26*60){sleep(true);return;}
 let vx=(keys.d||keys.arrowright||keys.t_right?1:0)-(keys.a||keys.arrowleft||keys.t_left?1:0),vy=(keys.s||keys.arrowdown||keys.t_down?1:0)-(keys.w||keys.arrowup||keys.t_up?1:0);
 moving=!!(vx||vy);if(moving&&fishing){fishing=null;toast('Line reeled in');}
 if(vx&&vy){vx*=.7071;vy*=.7071;}
 if(vx>0)S.face='right';else if(vx<0)S.face='left';if(vy>0)S.face='down';else if(vy<0)S.face='up';
 const sp=(keys.shift?130:85)*dt;if(!blocked(S.px+vx*sp,S.py))S.px+=vx*sp;if(!blocked(S.px,S.py+vy*sp))S.py+=vy*sp;
 if(moving)walkT+=dt*10;
 const dk=districtAt(Math.floor(S.px/T),Math.floor(S.py/T));if(dk&&dk!=curD){curD=dk;banner={t:D[dk].n,l:2};}
 if(actPressed){actPressed=false;act();}
 if(fishing){fishing.t-=dt;if(fishing.t<=0){const n=nightF()>.5?1+(Math.random()<.5):1;if(Math.random()<.85)give('fish',n,fishing.x,fishing.y);else if(Math.random()<.5)give('shell',1,fishing.x,fishing.y);else toast('It got away...');fishing=null;}}
 NPCS.forEach(n=>{n.t-=dt;if(n.t<=0){n.t=1+Math.random()*2.5;const r=Math.random();if(r<.5){n.dx=n.dy=0;}else{const a=Math.floor(Math.random()*4);n.dx=[1,-1,0,0][a];n.dy=[0,0,1,-1][a];}}
  const nx=n.px+n.dx*20*dt,ny=n.py+n.dy*20*dt,tx=Math.floor(nx/T),ty=Math.floor(ny/T);
  if(!solid[ty][tx]&&Math.abs(nx-n.hx)<56&&Math.abs(ny-n.hy)<40&&Math.hypot(nx-S.px,ny-S.py)>12&&districtAt(tx,ty)=='plaza'){n.px=nx;n.py=ny;}else n.t=0;});
 parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=120*dt;p.l-=dt;});parts=parts.filter(p=>p.l>0);
 toasts.forEach(t=>t.life-=dt);toasts=toasts.filter(t=>t.life>0);if(banner)banner.l-=dt;if(fade>0)fade-=dt;
 saveT+=dt;if(saveT>30){saveT=0;localStorage.setItem(SAVE,JSON.stringify(S));}
}
let curD=null,banner=null,saveT=0;
function nightF(){const h=(S.min/60)%24;if(h>=6&&h<17)return 0;if(h>=17&&h<20)return(h-17)/3;if(h>=4&&h<6)return 1-(h-4)/2;return 1;}
// ---------- render ----------
let zoom=3,vw=0,vh=0;
function resize(){const dpr=1;cv.width=innerWidth*dpr;cv.height=innerHeight*dpr;zoom=Math.max(2,Math.round(Math.min(cv.width,cv.height)/300));vw=cv.width/zoom;vh=cv.height/zoom;ctx.imageSmoothingEnabled=false;}
addEventListener('resize',resize);resize();
function person(c,x,y,body,hair,face,step,isPlayer){x=Math.round(x);y=Math.round(y);const bob=step?Math.round(Math.sin(step)*1):0;
 rect(c,x-5,y-1,10,3,'#0006');
 const l=Math.sin(step||0)>0;rect(c,x-3,y-4,2,4-(l?1:0),'#223');rect(c,x+1,y-4,2,4-(l?0:1),'#223');
 rect(c,x-4,y-11+bob,8,8,body);rect(c,x-4,y-11+bob,8,1,shade(body,1.3));rect(c,x-5,y-10+bob,1,5,'#f0c8a0');rect(c,x+4,y-10+bob,1,5,'#f0c8a0');
 rect(c,x-3,y-17+bob,6,6,'#f0c8a0');rect(c,x-4,y-18+bob,8,3,hair);
 if(face=='down'){rect(c,x-2,y-14+bob,1,1,'#123');rect(c,x+1,y-14+bob,1,1,'#123');}else if(face=='up')rect(c,x-4,y-17+bob,8,5,hair);else if(face=='left'){rect(c,x-3,y-14+bob,1,1,'#123');rect(c,x+1,y-17+bob,3,4,hair);}else{rect(c,x+2,y-14+bob,1,1,'#123');rect(c,x-4,y-17+bob,3,4,hair);}
 if(isPlayer){rect(c,x-5,y-19+bob,10,2,'#e8c050');rect(c,x-3,y-21+bob,6,2,'#e8c050');}}
function drawWorld(cam,night,t){
 ctx.drawImage(base,-cam.x,-cam.y);
 // animated water shimmer
 for(let i=0;i<40;i++){const x=34*T+((i*197+t*12)%(62*T)),y=54*T+((i*89)%(12*T));if(x>cam.x-10&&x<cam.x+vw+10&&y>cam.y-10&&y<cam.y+vh+10)rect(ctx,x-cam.x,y-cam.y,5,1,'#4aa0ff66');}
 // soil
 for(const k in S.soil){const [x,y]=k.split(',').map(Number),s=S.soil[k],px=x*T-cam.x,py=y*T-cam.y;rect(ctx,px+1,py+1,14,14,s.w?'#2a1a10':'#5a3a22');rect(ctx,px+2,py+4,12,1,s.w?'#1a0f08':'#6a4a2a');rect(ctx,px+2,py+10,12,1,s.w?'#1a0f08':'#6a4a2a');
  if(s.crop){const C=CROPS[s.crop],g=s.g,ripe=g>=C.days,f=Math.min(1,g/C.days);const h=3+Math.round(f*8);rect(ctx,px+7,py+13-h,2,h,'#3fbf4a');
   if(g>0){rect(ctx,px+4,py+12-h/2,3,2,'#4fdf5a');rect(ctx,px+9,py+11-h/2,3,2,'#4fdf5a');}if(ripe){rect(ctx,px+5,py+1,6,5,C.c);rect(ctx,px+6,py+2,2,1,'#fff');}}}
 // nodes
 S.nodes.forEach(o=>{const px=o.x*T-cam.x,py=o.y*T-cam.y;if(px<-16||py<-16||px>vw||py>vh)return;
  if(o.type=='scrap'){rect(ctx,px+1,py+10,14,5,'#0006');rect(ctx,px+2,py+6,12,7,'#7a6a58');rect(ctx,px+4,py+3,6,5,'#9a8a70');rect(ctx,px+9,py+4,4,3,'#5a8aa0');rect(ctx,px+3,py+9,3,2,'#c06030');}
  else if(o.type=='ore'){rect(ctx,px+1,py+11,14,4,'#0006');rect(ctx,px+2,py+5,12,9,'#5a5a6e');rect(ctx,px+4,py+3,8,4,'#6e6e84');rect(ctx,px+5,py+7,2,2,'#7fd0ff');rect(ctx,px+10,py+9,2,2,'#7fd0ff');}
  else if(o.type=='shell'){rect(ctx,px+5,py+8,6,5,'#ffd0e8');rect(ctx,px+6,py+7,4,1,'#fff');rect(ctx,px+7,py+9,1,4,'#e090b0');}
  else{const p=Math.sin(t*4+o.x)*1;rect(ctx,px+6,py+4+p,4,8,'#ff4fd8');rect(ctx,px+7,py+3+p,2,10,'#ffb0f0');}});
 // boats
 for(let i=0;i<3;i++){const x=34*T+((t*(8+i*3)+i*300)%(62*T)),y=(57+i*3)*T;if(x>cam.x-30&&x<cam.x+vw)drawBoat(x-cam.x,y-cam.y,['#ff4fd8','#38e0ff','#ffd84a'][i]);}
 // entities sorted
 const ents=NPCS.map(n=>({y:n.py,f:()=>person(ctx,n.px-cam.x,n.py-cam.y,n.c,n.h,n.dy<0?'up':n.dx<0?'left':n.dx>0?'right':'down',(n.dx||n.dy)?t*10:0)}));
 ents.push({y:S.py,f:()=>{person(ctx,S.px-cam.x,S.py-cam.y,'#3a8aff','#5a3a1a',S.face,moving?walkT:0,true);if(fishing){const [tx,ty]=facingTile();ctx.strokeStyle='#ddd';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(S.px-cam.x+4,S.py-cam.y-14);ctx.lineTo(tx*T+8-cam.x,ty*T+8-cam.y);ctx.stroke();rect(ctx,tx*T+7-cam.x,ty*T+7-cam.y+Math.round(Math.sin(t*6)),3,3,'#ff3050');}}});
 ents.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
 parts.forEach(p=>rect(ctx,p.x-cam.x,p.y-cam.y,2,2,p.c));
 // holo fountain animation
 const fx=FOUNT.x*T+32-cam.x,fy=FOUNT.y*T+22-cam.y;for(let i=0;i<6;i++){const h=10+Math.sin(t*3+i)*6;ctx.fillStyle=`rgba(120,240,255,${.5+.3*Math.sin(t*5+i)})`;ctx.fillRect(fx-12+i*5,fy-h,2,h);}
 {const hy=fy-30-Math.sin(t*2)*2;ctx.globalAlpha=.6+.2*Math.sin(t*7);rect(ctx,fx-3,hy,6,6,'#b8ffff');rect(ctx,fx-4,hy+6,8,10,'#7ff0ff');rect(ctx,fx-7,hy+7,3,7,'#7ff0ff');rect(ctx,fx+4,hy+7,3,7,'#7ff0ff');rect(ctx,fx-3,hy+16,2,8,'#7ff0ff');rect(ctx,fx+1,hy+16,2,8,'#7ff0ff');ctx.globalAlpha=1;}
 // darkness
 if(night>0){ctx.fillStyle=`rgba(8,6,38,${.62*night})`;ctx.fillRect(0,0,vw,vh);}
 ctx.globalAlpha=.25+.75*night;ctx.drawImage(emis,-cam.x,-cam.y);ctx.globalAlpha=1;
 // glows
 ctx.globalCompositeOperation='lighter';const ga=.12+.88*night;
 LIGHTS.forEach(([x,y,r,col])=>{const sx=x-cam.x,sy=y-cam.y;if(sx<-r||sy<-r||sx>vw+r||sy>vh+r)return;const fl=1+.06*Math.sin(t*3+x);ctx.globalAlpha=ga*.8;ctx.drawImage(glow(col),sx-r*fl,sy-r*fl,r*2*fl,r*2*fl);});
 S.nodes.forEach(o=>{if(o.type=='neon'){ctx.globalAlpha=.6;ctx.drawImage(glow('#ff4fd8'),o.x*T-16-cam.x,o.y*T-16-cam.y,48,48);}});
 for(let i=0;i<3;i++){const x=34*T+((t*(8+i*3)+i*300)%(62*T))+10,y=(57+i*3)*T+2;ctx.globalAlpha=ga;ctx.drawImage(glow(['#ff4fd8','#38e0ff','#ffd84a'][i]),x-24-cam.x,y-24-cam.y,48,48);}
 if(night>.3){ctx.globalAlpha=night*.5;ctx.drawImage(glow('#fff2c0'),S.px-36-cam.x,S.py-44-cam.y,72,72);}
 ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 // highlight facing tile
 const [tx,ty]=facingTile();ctx.strokeStyle='#ffffff55';ctx.strokeRect(tx*T-cam.x+.5,ty*T-cam.y+.5,T-1,T-1);
}
function drawBoat(x,y,col){rect(ctx,x,y+6,22,5,'#ddd');rect(ctx,x+2,y+11,18,2,'#999');rect(ctx,x+7,y+1,8,5,'#eef');rect(ctx,x+3,y+8,16,1,col);rect(ctx,x-4,y+12,4,1,'#8cf8');}
// HUD (screen space)
let hotRects=[];
function hotbarSlotAt(x,y){for(let i=0;i<hotRects.length;i++){const r=hotRects[i];if(x>=r[0]&&x<r[0]+r[2]&&y>=r[1]&&y<r[1]+r[3])return i;}return-1;}
function panel(x,y,w,h){rect(ctx,x,y,w,h,'#2a1a08');rect(ctx,x+3,y+3,w-6,h-6,'#f0d58a');rect(ctx,x+3,y+3,w-6,3,'#fff3c8');}
function npanel(x,y,w,h,col='#38e0ff'){ctx.fillStyle='#0c0820e0';ctx.fillRect(x,y,w,h);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.shadowColor=col;ctx.shadowBlur=10;ctx.strokeRect(x+1,y+1,w-2,h-2);ctx.shadowBlur=0;}
function icon(id,x,y,s){const p=s/16;const r=(a,b,w,h,c)=>rect(ctx,x+a*p,y+b*p,w*p,h*p,c);
 switch(id){case'hoe':r(7,2,2,12,'#8a6238');r(3,2,6,3,'#bbb');break;case'can':r(3,6,9,7,'#5a9ad8');r(11,4,4,2,'#5a9ad8');r(5,4,4,2,'#3a6aa8');break;
 case'pick':r(7,4,2,11,'#8a6238');r(2,2,12,3,'#aab');r(2,5,2,2,'#aab');r(12,5,2,2,'#aab');break;case'rod':r(3,13,2,2,'#555');for(let i=0;i<10;i++)r(4+i,12-i,1,1,'#c08040');r(13,3,1,9,'#ddd');break;
 case'wood':r(2,6,12,5,'#9a6a3a');r(2,6,3,5,'#d0a060');break;case'ore':r(3,5,10,8,'#6e6e84');r(5,7,2,2,'#7fd0ff');r(9,9,2,2,'#7fd0ff');break;case'scrap':r(3,7,10,6,'#8a7a60');r(5,4,5,4,'#a09070');r(9,8,3,3,'#5a8aa0');break;
 case'shell':r(4,6,8,6,'#ffd0e8');r(6,5,4,1,'#fff');r(7,7,1,5,'#d080a0');break;case'neon':r(6,2,4,12,'#ff4fd8');r(7,3,2,10,'#ffc0f4');break;case'fish':r(3,6,9,5,'#38e0ff');r(11,5,3,7,'#2090c0');r(5,7,1,1,'#012');break;
 default:if(id.startsWith('s_')){const c=CROPS[id.slice(2)];r(4,5,8,9,'#c8a870');r(4,5,8,2,'#a08050');r(6,8,4,4,c.c);}else{const c=ITEMS[id];r(4,4,8,9,c.c);r(7,1,2,4,'#3fbf4a');}}}
function drawHUD(night,t){
 ctx.setTransform(1,0,0,1,0,0);const sc=Math.max(1,Math.min(2,cv.width/700));
 ctx.font=`bold ${Math.round(13*sc)}px monospace`;ctx.textBaseline='top';ctx.textAlign='left';
 // clock panel
 const h=Math.floor(S.min/60)%24,m=Math.floor(S.min%60/10)*10,ap=h<12?'AM':'PM',hh=(h%12)||12;
 const pw=150*sc,ph=58*sc;npanel(8,8,pw,ph,'#ff4fd8');
 ctx.fillStyle='#ffd84a';ctx.fillText(`DAY ${S.day}`,16*sc,14*sc);ctx.fillStyle='#bff';ctx.fillText(`${hh}:${String(m).padStart(2,'0')} ${ap}`,16*sc+62*sc,14*sc);
 ctx.fillStyle='#ffd84a';ctx.fillText(`◉ ${S.gold}g`,16*sc,34*sc);ctx.fillStyle=night>.5?'#c8b8ff':'#ffe08a';ctx.fillText(night>.5?'☾ NIGHT':'☀ DAY',16*sc+70*sc,34*sc);
 // version
 ctx.font=`bold ${Math.round(11*sc)}px monospace`;ctx.fillStyle='#3ff';ctx.shadowColor='#3ff';ctx.shadowBlur=8;ctx.fillText('FANTASY TOWN '+VERSION,16*sc,ph+16);ctx.shadowBlur=0;
 // resources legend (like reference)
 const res=['wood','ore','scrap','shell','neon','fish'],lw=168*sc,lh=(30+res.length*0+3*22)*sc,lx=cv.width-lw-8,ly=8;
 panel(lx,ly,lw,lh+20*sc);ctx.fillStyle='#2a1a08';ctx.font=`bold ${Math.round(11*sc)}px monospace`;ctx.fillText('RESOURCES',lx+10*sc,ly+8*sc);
 res.forEach((k,i)=>{const cx=lx+10*sc+(i%2)*78*sc,cy=ly+26*sc+Math.floor(i/2)*22*sc;icon(k,cx,cy,16*sc);ctx.fillStyle='#2a1a08';ctx.fillText(`${k=='wood'?'WOOD':ITEMS[k].n.toUpperCase().slice(0,5)} ${S.inv[k]||0}`,cx+19*sc,cy+3*sc);});
 // crops in bag
 const cr=['turnip','berry','star'].filter(k=>S.inv[k]>0);if(cr.length){ctx.fillStyle='#2a1a08';ctx.fillText(cr.map(k=>ITEMS[k].n.split(' ').pop()+' '+S.inv[k]).join(' '),lx+10*sc,ly+lh+4*sc);}
 // hotbar
 const s=Math.round(40*sc),n=HOT.length,hx=Math.round((cv.width-n*(s+4))/2),hy=cv.height-s-(isTouch?205:12);hotRects=[];
 npanel(hx-6,hy-6,n*(s+4)+8,s+12);
 HOT.forEach((it,i)=>{const x=hx+i*(s+4);hotRects.push([x,hy,s,s]);rect(ctx,x,hy,s,s,i==S.sel?'#3a2a7a':'#1a1438');if(i==S.sel){ctx.strokeStyle='#ffd84a';ctx.lineWidth=2;ctx.strokeRect(x+1,hy+1,s-2,s-2);}
  icon(it.id,x+s*.15,hy+s*.12,s*.7);ctx.font=`bold ${Math.round(9*sc)}px monospace`;ctx.fillStyle='#8ff';ctx.fillText(i+1,x+3,hy+2);
  if(it.crop){ctx.fillStyle='#fff';ctx.textAlign='right';ctx.fillText(S.inv[it.id]||0,x+s-3,hy+s-11*sc);ctx.textAlign='left';}});
 ctx.font=`bold ${Math.round(11*sc)}px monospace`;ctx.fillStyle='#ffd84a';ctx.textAlign='center';ctx.fillText(HOT[S.sel].n,cv.width/2,hy-22*sc);
 // toasts
 toasts.slice(-4).forEach((tt,i)=>{ctx.globalAlpha=Math.min(1,tt.life);ctx.fillStyle='#000a';const w=ctx.measureText(tt.t).width+16;ctx.fillRect(cv.width/2-w/2,hy-50*sc-i*20*sc,w,18*sc);ctx.fillStyle='#bff';ctx.fillText(tt.t,cv.width/2,hy-48*sc-i*20*sc);});ctx.globalAlpha=1;
 if(banner&&banner.l>0){ctx.globalAlpha=Math.min(1,banner.l);ctx.font=`bold ${Math.round(20*sc)}px monospace`;ctx.fillStyle='#ffd84a';ctx.shadowColor='#f0f';ctx.shadowBlur=14;ctx.fillText(banner.t,cv.width/2,(isTouch?150:90)*sc);ctx.shadowBlur=0;ctx.globalAlpha=1;}
 ctx.textAlign='left';
 if(!isTouch){ctx.font=`${Math.round(10*sc)}px monospace`;ctx.fillStyle='#9ab';ctx.fillText('WASD move · E/Space act · 1-7/Q tool · M map',12,cv.height-16*sc);}
 if(fade>0){ctx.fillStyle=`rgba(0,0,0,${fade})`;ctx.fillRect(0,0,cv.width,cv.height);}
}
function drawMap(t,night){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#05030f';ctx.fillRect(0,0,cv.width,cv.height);
 const s=Math.min(cv.width/W,(cv.height)/H)*.98,ox=(cv.width-W*s)/2,oy=(cv.height-H*s)/2;ctx.imageSmoothingEnabled=true;
 const m=document.createElement('canvas');m.width=W;m.height=H;const mc=m.getContext('2d');mc.drawImage(base,0,0);
 S.nodes.forEach(o=>{mc.fillStyle=ITEMS[o.type].c;mc.fillRect(o.x*T+4,o.y*T+4,8,8);});
 for(const k in S.soil){const [x,y]=k.split(',').map(Number);mc.fillStyle=S.soil[k].crop?'#3fbf4a':'#5a3a22';mc.fillRect(x*T+1,y*T+1,14,14);}
 NPCS.forEach(n=>person(mc,n.px,n.py,n.c,n.h,'down',0));
 for(let i=0;i<3;i++){const x=34*T+((t*(8+i*3)+i*300)%(62*T)),y=(57+i*3)*T;mc.fillStyle='#ddd';mc.fillRect(x,y+6,22,6);}
 person(mc,S.px,S.py,'#3a8aff','#5a3a1a','down',0,true);
 mc.fillStyle=`rgba(8,6,38,${.55*night})`;mc.fillRect(0,0,W,H);mc.globalAlpha=.3+.7*night;mc.drawImage(emis,0,0);mc.globalAlpha=1;
 mc.globalCompositeOperation='lighter';LIGHTS.forEach(([x,y,r,col])=>{mc.globalAlpha=.15+.75*night;mc.drawImage(glow(col),x-r,y-r,r*2,r*2);});mc.globalCompositeOperation='source-over';mc.globalAlpha=1;
 ctx.drawImage(m,ox,oy,W*s,H*s);ctx.imageSmoothingEnabled=false;
 const pr=Math.max(4,6*s*3);ctx.strokeStyle='#ffd84a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(ox+S.px*s,oy+(S.py-8)*s,pr+3*Math.sin(t*5),0,7);ctx.stroke();
 ctx.font='bold 14px monospace';ctx.fillStyle='#3ff';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText('FANTASY TOWN '+VERSION+' — MAP (M to close)',ox+8,oy+H*s-22);}
let last=performance.now(),T0=0;
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;T0+=dt;update(dt);const night=nightF();
 if(showMap){drawMap(T0,night);}else{
 ctx.setTransform(zoom,0,0,zoom,0,0);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#05030f';ctx.fillRect(0,0,vw,vh);
 const cam={x:Math.round(Math.max(0,Math.min(W-vw,S.px-vw/2))),y:Math.round(Math.max(0,Math.min(H-vh,S.py-vh/2)))};if(W<vw)cam.x=-(vw-W)/2;if(H<vh)cam.y=-(vh-H)/2;
 drawWorld(cam,night,T0);drawHUD(night,T0);}
 requestAnimationFrame(frame);}
requestAnimationFrame(frame);
window.FT={get S(){return S},act,sleep:window.sleep,setPos(x,y){S.px=x*T+8;S.py=y*T+8}};
