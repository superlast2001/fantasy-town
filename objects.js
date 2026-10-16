'use strict';
// Isometric object/furniture sprite definitions. draw(c,v) local coords: footprint top corner at origin.
const P0=isoP;
function winL(c,w,d,z0,u,z,col='#ffe6a0'){faceQ(c,0,0,0,w,d,'L',u,u+.42,z,z+9,col);faceQ(c,0,0,0,w,d,'L',u+.04,u+.38,z+4.2,z+4.8,'rgba(0,0,0,.25)',null);}
function winR(c,w,d,u,z,col='#ffe6a0'){faceQ(c,0,0,0,w,d,'R',u,u+.42,z,z+9,col);}
function treeBlob(c,x,y,r,col){const g=c.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);g.addColorStop(0,shade(col,1.25));g.addColorStop(1,shade(col,.78));ell(c,x,y,r,r*.92,g,OLC,1);}
const OBJ={
 tree:{w:1,d:1,h:46,draw(c,v){const [x,y]=P0(.5,.5);shadowE(c,x,y,11,5);poly(c,[[x-2,y],[x+2,y],[x+1.5,y-16],[x-1.5,y-16]],'#8a5a34');const col=['#4caf50','#5cb85c','#43a047'][v%3];treeBlob(c,x-5,y-20,8,col);treeBlob(c,x+5,y-22,8,col);treeBlob(c,x,y-30,10,col);ell(c,x-3,y-34,3,2,'rgba(255,255,255,.35)',null);if(v%4==0)[[-4,-24],[4,-28],[0,-20]].forEach(([a,b])=>ell(c,x+a,y+b,1.4,1.4,'#ff6a8a',null));}},
 palm:{w:1,d:1,h:46,draw(c){const [x,y]=P0(.5,.5);shadowE(c,x,y,10,4.5);c.beginPath();c.moveTo(x-1.5,y);c.quadraticCurveTo(x+4,y-16,x+2,y-32);c.lineTo(x+5,y-32);c.quadraticCurveTo(x+7,y-16,x+1.5,y);c.closePath();c.fillStyle='#b07a44';c.fill();c.strokeStyle=OLC;c.stroke();
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;c.beginPath();c.moveTo(x+3.5,y-33);c.quadraticCurveTo(x+3.5+Math.cos(a)*10,y-40+Math.sin(a)*3,x+3.5+Math.cos(a)*15,y-30+Math.sin(a)*5);c.lineWidth=4;c.strokeStyle='#3d9a4a';c.stroke();c.lineWidth=1.2;c.strokeStyle='#2a6a34';c.stroke();}c.lineWidth=1;ell(c,x+3.5,y-33,2.5,2,'#6a4a2a',OLC,.6);}},
 shroom:{w:1,d:1,h:14,draw(c,v){const [x,y]=P0(.5,.5);[[-3,0,'#3dffd0'],[4,2,'#ff7ad8']].forEach(([a,b,col])=>{poly(c,[[x+a-1,y+b],[x+a+1,y+b],[x+a+1,y+b-5],[x+a-1,y+b-5]],'#eee');c.beginPath();c.ellipse(x+a,y+b-5,4,2.6,0,Math.PI,0);c.fillStyle=col;c.fill();c.strokeStyle=OLC;c.stroke();});},light:[[.5,.5,4,22,'#3dffd0']]},
 rock:{w:1,d:1,h:12,draw(c){const [x,y]=P0(.5,.5);shadowE(c,x,y+1,7,3);c.beginPath();c.moveTo(x-7,y);c.quadraticCurveTo(x-6,y-8,x,y-8);c.quadraticCurveTo(x+7,y-7,x+7,y);c.quadraticCurveTo(x,y+3,x-7,y);c.fillStyle='#9a8a7e';c.fill();c.strokeStyle=OLC;c.stroke();ell(c,x-2,y-5,2,1,'rgba(255,255,255,.3)',null);}},
 wallrock:{w:1,d:1,h:28,draw(c,v){box(c,0,0,0,1,1,18+v%3*4,'#6e6a88');ell(c,...P0(.4,.4,22),2,1,'rgba(255,255,255,.2)',null);}},
 container:{w:3,d:2,h:30,draw(c,v){const col=['#c0503a','#3a7ac0','#6a9a3a'][v%3];box(c,0,0,0,3,2,20,col);for(let i=1;i<9;i++)faceQ(c,0,0,0,3,2,'L',i/3,i/3+.02,1,19,'rgba(0,0,0,.2)',null);}},
 crane:{w:2,d:2,h:150,draw(c){for(let z=0;z<120;z+=12){box(c,.3,.3,z,.3,.3,12,'#e8a820',{hl:false});box(c,1.4,1.4,z,.3,.3,12,'#e8a820',{hl:false});}box(c,-4,.8,120,6,.4,6,'#e8a820');const [a,b]=P0(-3,1,120);c.strokeStyle='#555';c.beginPath();c.moveTo(a,b);c.lineTo(a,b+70);c.stroke();box(c,-3.3,.7,40,.6,.6,8,'#666');},light:[[1,1,128,20,'#ff3050']]},
 busSign:{w:1,d:1,h:34,draw(c){const [x,y]=P0(.5,.5);poly(c,[[x-1,y],[x+1,y],[x+1,y-26],[x-1,y-26]],'#888');c.beginPath();c.roundRect(x-7,y-32,14,9,3);c.fillStyle='#ffcc00';c.fill();c.strokeStyle=OLC;c.stroke();c.fillStyle='#222';c.font='bold 5px sans-serif';c.textAlign='center';c.fillText('BUS',x,y-25.5);},light:[[.5,.5,28,30,'#ffcc00']]},
 crystal:{w:1,d:1,h:34,draw(c,v){box(c,0,0,0,1,1,14,'#6e6a88');const [x,y]=P0(.5,.5,14);[[-3,'#7fd0ff',14],[3,'#ff7ad8',10]].forEach(([a,col,h])=>poly(c,[[x+a-2.5,y],[x+a,y-h],[x+a+2.5,y],[x+a,y+2]],col));},light:[[.5,.5,20,30,'#9fd8ff']]},
 cableSt:{w:3,d:2,h:60,draw(c){box(c,0,0,0,3,2,22,'#8aa0c8');roof(c,0,0,22,3,2,10,'#5a5aff');const [a,b]=P0(1.5,1,32);c.strokeStyle='#777';c.lineWidth=1;c.beginPath();c.moveTo(a,b);c.lineTo(a+60,b-40);c.stroke();},light:[[1.5,2,10,40,'#5a5aff']]},
 hut:{w:4,d:3,h:50,draw(c){box(c,0,0,0,4,3,18,'#e8c890');roof(c,0,0,18,4,3,14,'#c8a040');faceQ(c,0,0,0,4,3,'L',1.6,2.3,0,13,'#7a4a2a');},light:[[2,3,8,40,'#ffcf7a']]},
 tower:{w:5,d:5,h:200,draw(c,v){const cols=['#5b6cff','#38e0ff','#ff4fd8','#8f7bff'],col=cols[v%4],h=120+v%3*30;box(c,0,0,0,5,5,h,'#2a2a52',{top:'#3a3a6a'});const r=rng(v+3);
  for(let z=10;z<h-8;z+=10)for(let u=.3;u<4.7;u+=.6){faceQ(c,0,0,0,5,5,'L',u,u+.35,z,z+6,r()<.75?col:'#1a1a34',null);faceQ(c,0,0,0,5,5,'R',u,u+.35,z,z+6,r()<.75?shade(col,.8):'#1a1a34',null);}box(c,2,2,h,1,1,8,'#555');},light:[[2.5,5,10,80,'#7a6aff']]},
 fount:{w:3,d:3,h:40,draw(c){fountain(c,3);},light:[[1.5,1.5,10,80,'#38e0ff']]},
 cityStall:{w:4,d:3,h:46,draw(c,v){stallDraw(c,4,3,['#38e0ff','#3dff9a'][v%2],v%2?'MARKET':'SEEDS');},light:[[2,3,12,70,'#38e0ff']]},
 trainSt:{w:7,d:3,h:60,draw(c){stationDraw(c,7,3);},light:[[3.5,3,10,80,'#e8202a']]},
 // ---- village buildings ----
 lamp:{w:1,d:1,h:40,draw(c){const [x,y]=P0(.5,.5);shadowE(c,x,y,4,2);poly(c,[[x-1,y],[x+1,y],[x+1,y-26],[x-1,y-26]],'#4a4a5e');c.beginPath();c.roundRect(x-4,y-34,8,8,2);c.fillStyle='#fff3c0';c.fill();c.strokeStyle=OLC;c.stroke();c.beginPath();c.moveTo(x-5,y-34);c.lineTo(x,y-38);c.lineTo(x+5,y-34);c.closePath();c.fillStyle='#4a4a5e';c.fill();c.stroke();},light:[[.5,.5,30,46,'#ffd88a']]},
 flowers:{w:1,d:1,h:12,draw(c,v){for(let i=0;i<6;i++){const [x,y]=P0(.2+(i%3)*.3,.25+Math.floor(i/3)*.45);c.strokeStyle='#3a8a3a';c.beginPath();c.moveTo(x,y);c.lineTo(x,y-4);c.stroke();ell(c,x,y-5,2,2,['#ff6ab0','#ffd84a','#6ad8ff','#ffffff','#c48aff','#ff8a5a'][(i+v)%6],OLC,.5);}},light:[[.5,.5,4,16,'#ff8ad8']]},
 fence:{w:1,d:1,h:16,draw(c){[[.1,.5],[.9,.5]].forEach(([a,b])=>box(c,a-.07,b-.07,0,.14,.14,11,'#b07a48',{hl:false}));box(c,0,.45,5,1,.1,2,'#c88a58',{hl:false});box(c,0,.45,8.5,1,.1,2,'#c88a58',{hl:false});}},
 plot:{w:3,d:3,h:6,draw(c){const P=(x,y)=>P0(x,y,1);poly(c,[P(0,0),P(3,0),P(3,3),P(0,3)],null,'#7a4a24',2);}},
 stall:{w:4,d:3,h:50,draw(c){stallDraw(c,4,3,'#ff6ab0','SHOP');},light:[[2,3,12,60,'#ff6ab0']]},
 workshop:{w:4,d:3,h:56,draw(c){box(c,0,0,0,4,3,24,'#9aa0b4');faceQ(c,0,0,0,4,3,'L',.4,1.9,0,16,'#5a5e70');for(let z=2;z<16;z+=3)faceQ(c,0,0,0,4,3,'L',.4,1.9,z,z+.6,'rgba(0,0,0,.25)',null);winL(c,4,3,0,2.6,10,'#ffcf6a');winR(c,4,3,1,10,'#ffcf6a');
  roof(c,0,0,24,4,3,10,'#5a6070');box(c,3,.5,30,.5,.5,14,'#777');sign3(c,P0(2,3,30),'WORKSHOP','#ffb43a');},light:[[3,3,12,44,'#ffb43a']]},
 busstop:{w:3,d:2,h:34,draw(c){[[.2,1.6],[2.8,1.6],[.2,.3],[2.8,.3]].forEach(([a,b])=>box(c,a-.06,b-.06,0,.12,.12,22,'#888',{hl:false}));box(c,.3,.2,4,2.4,.6,5,'#8a6a4a');box(c,0,0,22,3,2,3,'#ffcc00');sign3(c,P0(1.5,2,26),'BUS','#ffcc00');},light:[[1.5,1,22,40,'#ffcc00']]},
 cable:{w:3,d:3,h:80,draw(c){box(c,0,0,0,3,3,20,'#8aa0c8');roof(c,0,0,20,3,3,10,'#5a5aff');box(c,1.3,1.3,30,.4,.4,30,'#888',{hl:false});const [a,b]=P0(1.5,1.5,60);c.strokeStyle='#555';c.beginPath();c.moveTo(a,b);c.lineTo(a+70,b-30);c.stroke();c.beginPath();c.roundRect(a+26,b-12,12,10,3);c.fillStyle='#5a5aff';c.fill();c.strokeStyle=OLC;c.stroke();},light:[[1.5,3,10,50,'#7a7aff']]},
 train:{w:5,d:3,h:60,draw(c){stationDraw(c,5,3);},light:[[2.5,3,10,70,'#e8202a']]},
 fountain:{w:3,d:3,h:40,draw(c){fountain(c,3);},light:[[1.5,1.5,10,70,'#38e0ff']]},
 // ---- nodes / crops ----
 n_wood:{w:1,d:1,h:30,draw(c){const [x,y]=P0(.5,.5);shadowE(c,x,y,8,3.5);poly(c,[[x-1.5,y],[x+1.5,y],[x+1,y-10],[x-1,y-10]],'#8a5a34');treeBlob(c,x,y-16,8,'#6abf4a');ell(c,x-3,y-19,1.5,1.5,'#ffd84a',null);}},
 n_scrap:{w:1,d:1,h:16,draw(c){box(c,.15,.25,0,.5,.45,7,'#a89880');box(c,.45,.1,0,.4,.4,5,'#6a9ab0');box(c,.3,.4,7,.35,.3,4,'#c87040');}},
 n_ore:{w:1,d:1,h:16,draw(c){const [x,y]=P0(.5,.5);c.beginPath();c.moveTo(x-7,y);c.lineTo(x-5,y-8);c.lineTo(x+1,y-11);c.lineTo(x+7,y-5);c.lineTo(x+6,y);c.quadraticCurveTo(x,y+3,x-7,y);c.fillStyle='#7e7a94';c.fill();c.strokeStyle=OLC;c.stroke();[[-3,-5],[2,-7],[3,-2]].forEach(([a,b])=>poly(c,[[x+a,y+b-2],[x+a+1.5,y+b],[x+a,y+b+2],[x+a-1.5,y+b]],'#7fe0ff',null));}},
 n_shell:{w:1,d:1,h:8,draw(c){const [x,y]=P0(.5,.5);c.beginPath();c.moveTo(x-4,y);c.quadraticCurveTo(x,y-8,x+4,y);c.closePath();c.fillStyle='#ffd0e8';c.fill();c.strokeStyle=OLC;c.stroke();for(let i=-2;i<=2;i+=2){c.beginPath();c.moveTo(x,y);c.lineTo(x+i*1.3,y-4);c.strokeStyle='#d080a0';c.stroke();}}},
 n_neon:{w:1,d:1,h:20,draw(c){const [x,y]=P0(.5,.5);shadowE(c,x,y,4,2);poly(c,[[x-3,y-2],[x,y-16],[x+3,y-2],[x,y+1]],'#ff7ad8');poly(c,[[x-1,y-3],[x,y-12],[x+1,y-3]],'#ffd0f4',null);},light:[[.5,.5,8,24,'#ff4fd8']]},
};
function sign3(c,[x,y],txt,col){c.font='bold 6px sans-serif';const w=c.measureText(txt).width+8;c.beginPath();c.roundRect(x-w/2,y-9,w,9,3);c.fillStyle='#2a2238';c.fill();c.strokeStyle=col;c.lineWidth=1;c.stroke();c.fillStyle=col;c.textAlign='center';c.textBaseline='middle';c.fillText(txt,x,y-4.3);}
function stallDraw(c,w,d,col,txt){box(c,.3,.4,0,w-.6,d-.8,14,'#a07850');box(c,.3,.4,14,w-.6,d-.8,1.5,'#d8b080');
 [[.4,1,'#ffd84a'],[1.2,1.2,'#ff6a6a'],[2,.9,'#9fff7a'],[2.7,1.3,'#ffffff']].forEach(([a,b,cc])=>{const [x,y]=P0(a,b,16);ell(c,x,y,2.3,1.6,cc,OLC,.6);});
 [[.3,.4],[w-.3,.4],[.3,d-.4],[w-.3,d-.4]].forEach(([a,b])=>box(c,a-.05,b-.05,0,.1,.1,30,'#7a5a3a',{hl:false}));
 const P=(x,y,z)=>P0(x,y,z),n=8;for(let i=0;i<n;i++){const x0=i*w/n,x1=(i+1)*w/n;poly(c,[P(x0,0,30),P(x1,0,30),P(x1,d,26),P(x0,d,26)],i%2?'#ffffff':col,OLC,.6);poly(c,[P(x0,d,26),P(x1,d,26),P(x1,d+.2,21),P(x0,d+.2,21)],i%2?'#eeeeee':shade(col,.85),OLC,.6);}
 sign3(c,P(w/2,d,40),txt,col);}
function stationDraw(c,w,d){box(c,0,0,0,w,d,26,'#d8c8c8');for(let u=.4;u<w-.4;u+=.8)winL(c,w,d,0,u,10,'#ffe08a');roof(c,0,0,26,w,d,12,'#b02a3a');box(c,-.2,d,0,w+.4,.6,2,'#777');sign3(c,P0(w/2,d,34),'STATION','#ff6a6a');}
function fountain(c,s){const [x,y]=P0(s/2,s/2);ell(c,x,y,s*11,s*5.5,'#9aa0c0',OLC,1);ell(c,x,y-3,s*11,s*5.5,'#c8cce0',OLC,1);ell(c,x,y-3,s*9,s*4.4,'#5ad0ff',OLC,.8);ell(c,x,y-5,s*4,s*2,'#9aa0c0',OLC,.8);poly(c,[[x-2,y-5],[x+2,y-5],[x+1.5,y-20],[x-1.5,y-20]],'#c8cce0');ell(c,x,y-20,5,2.5,'#c8cce0',OLC,.8);}
// ---- furniture (interiors) ----
const FURN={
 bed:{n:'Bed',w:2,d:2,h:24,cost:{gold:40,wood:6},comfort:4,tag:'BED',draw(c){box(c,0,0,0,2,2,8,'#a0704a');box(c,.1,.1,8,1.8,1.8,4,'#ffffff');box(c,.15,1,12,1.7,.9,2,'#6a8aff');box(c,.25,.15,12,.6,.7,3,'#fff6e8');box(c,1.15,.15,12,.6,.7,3,'#fff6e8');box(c,0,0,0,.25,2,18,'#8a5a3a');}},
 sofa:{n:'Sofa',w:2,d:1,h:20,cost:{gold:35,wood:4},comfort:3,draw(c){box(c,0,0,0,2,1,7,'#e85a6a');box(c,0,0,7,2,.3,8,'#e85a6a');box(c,0,0,7,.25,1,5,'#d84a5a');box(c,1.75,0,7,.25,1,5,'#d84a5a');box(c,.3,.35,7,.7,.6,2,'#ffd84a');}},
 tv:{n:'TV',w:1,d:1,h:30,cost:{gold:60,scrap:4},comfort:3,tag:'TV',draw(c){box(c,.1,.2,0,.8,.6,8,'#4a3a5a');box(c,.15,.35,8,.7,.15,16,'#1a1a24');faceQ(c,.15,.35,8,.7,.15,'L',.06,.64,2,14,'#38c0ff',null);},light:[[.5,.6,16,24,'#38c0ff']]},
 fishtank:{n:'Fish Tank',w:2,d:1,h:30,cost:{gold:50,shell:3,fish:2},comfort:4,tag:'FISHTANK',draw(c){box(c,0,0,0,2,1,8,'#5a4a6a');box(c,0,0,8,2,1,16,'rgba(120,210,255,.55)',{top:'rgba(200,240,255,.7)'});[[.5,.8,14,'#ff8a3a'],[1.3,.9,18,'#ffd84a']].forEach(([a,b,z,col])=>{const [x,y]=P0(a,b,z);ell(c,x,y,2.6,1.4,col,OLC,.5);});const [x,y]=P0(1.6,.9,10);c.fillStyle='#3a9a4a';c.fillRect(x,y-6,1.4,6);},light:[[1,.5,16,30,'#38e0ff']]},
 plant:{n:'Plant',w:1,d:1,h:30,cost:{gold:12},comfort:1,draw(c){box(c,.3,.3,0,.4,.4,7,'#d8784a');const [x,y]=P0(.5,.5,8);[[-4,-6],[4,-8],[0,-12],[-2,-4],[3,-3]].forEach(([a,b])=>{c.beginPath();c.ellipse(x+a,y+b,3,5,a*.15,0,7);c.fillStyle='#4caf50';c.fill();c.strokeStyle=OLC;c.lineWidth=.6;c.stroke();});}},
 rug:{n:'Rug',w:2,d:2,h:2,cost:{gold:20},comfort:2,flat:1,draw(c){const P=(x,y)=>P0(x,y,.5);poly(c,[P(.1,.1),P(1.9,.1),P(1.9,1.9),P(.1,1.9)],'#ff9ac8');poly(c,[P(.4,.4),P(1.6,.4),P(1.6,1.6),P(.4,1.6)],'#ffd0e4',null);}},
 bathtub:{n:'Bathtub',w:2,d:1,h:16,cost:{gold:70,ore:3},comfort:4,tag:'BATHROOM',draw(c){box(c,0,0,0,2,1,10,'#ffffff');const P=(x,y)=>P0(x,y,10);poly(c,[P(.15,.15),P(1.85,.15),P(1.85,.85),P(.15,.85)],'#7ad8ff');[[.5,.5],[1,.4],[1.4,.6]].forEach(([a,b])=>{const [x,y]=P0(a,b,12);ell(c,x,y,2,1.5,'#fff',OLC,.4);});}},
 lamp:{n:'Floor Lamp',w:1,d:1,h:34,cost:{gold:15,neon:1},comfort:1,draw(c){const [x,y]=P0(.5,.5);ell(c,x,y,3,1.5,'#555',OLC,.6);poly(c,[[x-.6,y],[x+.6,y],[x+.6,y-22],[x-.6,y-22]],'#666');poly(c,[[x-5,y-22],[x+5,y-22],[x+3,y-30],[x-3,y-30]],'#ffe8a0');},light:[[.5,.5,26,34,'#ffd88a']]},
 table:{n:'Table',w:1,d:1,h:16,cost:{gold:15,wood:3},comfort:1,draw(c){[[.2,.2],[.8,.2],[.2,.8],[.8,.8]].forEach(([a,b])=>box(c,a-.05,b-.05,0,.1,.1,9,'#8a5a3a',{hl:false}));box(c,.05,.05,9,.9,.9,2,'#c8945a');const [x,y]=P0(.5,.5,11);ell(c,x,y-2,2,1.2,'#fff',OLC,.5);}},
 bookshelf:{n:'Bookshelf',w:1,d:1,h:40,cost:{gold:25,wood:5},comfort:2,draw(c){box(c,.1,.3,0,.8,.4,30,'#9a6a40');for(let z=4;z<28;z+=7)for(let u=.15;u<.75;u+=.12)faceQ(c,.1,.3,0,.8,.4,'L',u,u+.09,z,z+5,['#e85a6a','#5a8aff','#ffd84a','#3dbf6a'][Math.floor(u*20+z)%4],null);}},
 arcade:{n:'Arcade',w:1,d:1,h:40,cost:{gold:90,neon:3,scrap:4},comfort:3,draw(c){box(c,.15,.2,0,.7,.6,30,'#3a2a7a');faceQ(c,.15,.2,0,.7,.6,'L',.1,.6,16,26,'#ff4fd8',null);box(c,.15,.75,12,.7,.15,3,'#222');},light:[[.5,.8,22,26,'#ff4fd8']]},
 fridge:{n:'Fridge',w:1,d:1,h:40,cost:{gold:45,ore:2},comfort:1,draw(c){box(c,.1,.15,0,.8,.7,30,'#e8f0f8');faceQ(c,.1,.15,0,.8,.7,'L',.55,.6,12,24,'#888',null);faceQ(c,.1,.15,0,.8,.7,'L',0,.8,10,10.6,'#9aa',null);}},
 desk:{n:'Front Desk',w:2,d:1,h:24,cost:{gold:0},comfort:0,tag:'FRONT DESK',fixed:1,draw(c){box(c,0,0,0,2,1,14,'#c8945a');box(c,0,0,14,2,1,2,'#8a5a3a');box(c,.6,.2,16,.5,.3,6,'#2a2a3a');faceQ(c,.6,.2,16,.5,.3,'L',.05,.45,1,5,'#5ad0ff',null);}},
};
function spriteFor(kind,v=0){const o=OBJ[kind]||FURN[kind];return sprite(kind+'#'+v,o.w,o.d,o.h,c=>o.draw(c,v));}
// condo tower (village), floors = open tenant floors, building = under construction
function condoSprite(floors,building){return sprite('condo'+floors+'_'+building,5,4,60+(floors+1+(building?1:0))*26+20,c=>{const fh=26;
 box(c,0,0,0,5,4,fh,'#f0e0c8');faceQ(c,0,0,0,5,4,'L',2,3,0,16,'#8a5a3a');faceQ(c,0,0,0,5,4,'L',.4,1.6,6,18,'#bfe8ff');faceQ(c,0,0,0,5,4,'L',3.4,4.6,6,18,'#bfe8ff');
 box(c,1.6,4,16,1.8,.6,2,'#ff6ab0');
 for(let f=1;f<=floors;f++){const z=f*fh,col=['#f8d0d8','#d0e0f8','#e0f0d0','#f8e8c0','#e0d0f8','#d0f0f0'][(f-1)%6];box(c,0,0,z,5,4,fh,col);box(c,-.1,-.1,z,5.2,4.2,1.5,'#ffffff',{hl:false});
  for(let u=.4;u<4.6;u+=1.1)winL(c,5,4,0,u,z+8);for(let u=.5;u<3.5;u+=1.1)winR(c,5,4,u,z+8);box(c,1.8,4,z+4,1.4,.5,1.2,'#9a9aaa');}
 let z=(floors+1)*fh;if(building){box(c,0,0,z,5,4,fh,'#c8b8a0');for(let u=0;u<5;u+=.5)faceQ(c,0,0,0,5,4,'L',u,u+.08,z,z+fh,'#8a6a3a',null);faceQ(c,0,0,0,5,4,'L',0,5,z+8,z+10,'#8a6a3a',null);faceQ(c,0,0,0,5,4,'L',0,5,z+18,z+20,'#8a6a3a',null);z+=fh;}
 box(c,-.2,-.2,z,5.4,4.4,4,'#5a4a6a');box(c,1,1,z+4,3,2,6,'#3a3a4a');sign3(c,P0(2.5,4,z+22),'FANTASY CONDO','#ff6ab0');});}
