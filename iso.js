'use strict';
// Isometric renderer helpers: 2:1 diamonds, outlined shaded boxes, cached sprites
const TW=32,TH=16,RS=2,OLC='#2a2238';
const isoP=(x,y,z=0)=>[(x-y)*TW/2,(x+y)*TH/2-z];
function poly(c,pts,fill,ol=OLC,lw=1){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(ol){c.lineWidth=lw;c.strokeStyle=ol;c.stroke();}}
// box in local tile coords at origin (x0,y0,z0) size w,d,h(px)
function box(c,x0,y0,z0,w,d,h,col,o={}){const P=(x,y,z)=>isoP(x0+x,y0+y,z0+z);
 const top=o.top||shade(col,1.12),L=o.left||shade(col,.86),R=o.right||shade(col,.7),ol=o.ol===undefined?OLC:o.ol;
 poly(c,[P(0,d,0),P(w,d,0),P(w,d,h),P(0,d,h)],L,ol);poly(c,[P(w,0,0),P(w,d,0),P(w,d,h),P(w,0,h)],R,ol);poly(c,[P(0,0,h),P(w,0,h),P(w,d,h),P(0,d,h)],top,ol);
 if(o.hl!==false){c.beginPath();const a=P(0,d,h),b=P(w,d,h),e=P(w,0,h);c.moveTo(a[0],a[1]+.5);c.lineTo(b[0],b[1]+.5);c.lineTo(e[0],e[1]+.5);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=.8;c.stroke();}}
// rect on a box face: face 'L' (+y side, u along x) or 'R' (+x side, u along y). u,v in px-ish tile fractions; z in px
function faceQ(c,x0,y0,z0,w,d,face,u0,u1,z1,z2,fill,ol=OLC){const P=face=='L'?(u,z)=>isoP(x0+u,y0+d,z0+z):(u,z)=>isoP(x0+w,y0+u,z0+z);poly(c,[P(u0,z1),P(u1,z1),P(u1,z2),P(u0,z2)],fill,ol,.8);}
function roof(c,x0,y0,z0,w,d,rh,col){const P=(x,y,z)=>isoP(x0+x,y0+y,z0+z),ov=.15;
 poly(c,[P(-ov,-ov,0),P(w+ov,-ov,0),P(w+ov,d/2,rh),P(-ov,d/2,rh)],shade(col,1.15));
 poly(c,[P(-ov,d+ov,0),P(w+ov,d+ov,0),P(w+ov,d/2,rh),P(-ov,d/2,rh)],shade(col,.95));
 poly(c,[P(w+ov,-ov,0),P(w+ov,d+ov,0),P(w+ov,d/2,rh)],shade(col,.72));
 for(let i=1;i<6;i++){const t=i/6;const a=P(-ov,d+ov-(d/2+ov)*t,rh*t),b=P(w+ov,d+ov-(d/2+ov)*t,rh*t);c.beginPath();c.moveTo(...a);c.lineTo(...b);c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=.7;c.stroke();}}
function ell(c,x,y,rx,ry,fill,ol=OLC,lw=1){c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);if(fill){c.fillStyle=fill;c.fill();}if(ol){c.strokeStyle=ol;c.lineWidth=lw;c.stroke();}}
function shadowE(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.fillStyle='rgba(20,10,40,.28)';c.fill();}
// sprite cache: draw fn(c) in local coords where footprint top corner at (0,0)
const SPR={};
function sprite(key,w,d,hpx,fn){if(SPR[key])return SPR[key];const W=(w+d)*TW/2+24,H=(w+d)*TH/2+hpx+24,ox=d*TW/2+12,oy=hpx+12;
 const cv=document.createElement('canvas');cv.width=Math.ceil(W*RS);cv.height=Math.ceil(H*RS);const c=cv.getContext('2d');c.scale(RS,RS);c.translate(ox,oy);c.lineJoin='round';c.lineCap='round';fn(c);
 return SPR[key]={cv,ox,oy};}
function drawSprite(g,s,x,y){const [px,py]=isoP(x,y);g.drawImage(s.cv,px-s.ox,py-s.oy,s.cv.width/RS,s.cv.height/RS);}
// ---- ground tile painter ----
const GCOL={23:['#ffffff','#f2f4f8'],26:['#e8f6ff','#d8eefa'],27:['#f6f0ea','#ece4dc'],24:['#e2a868','#d89e5e'],25:['#c8c0d8','#c0b8d0'],0:['#8fd27a','#86c972'],15:['#5fa866','#58a060'],1:['#6a6a80','#64647a'],2:['#4aa8e8','#45a0e0'],3:['#f2dca0','#ecd496'],4:['#3a2c7a','#352872'],5:['#b8b8c8','#b0b0c2'],6:['#9a6a44','#94643f'],7:['#c8945a','#c08c52'],8:['#c89a72','#c0926a'],9:['#6ad8ff','#60d0f8'],10:['#d8d8e2','#c8c8d6'],12:['#5a5670','#545068'],13:['#5a5670','#545068'],14:['#e2c89a','#dcc090'],20:['#f0e6d6','#e6dccb'],21:['#c8a8e0','#bea0d8'],22:['#b9d6f0','#b0cceb']};
function drawGroundTile(c,t,x,y,r,nb){const [cx,cy]=isoP(x,y);const pts=[[cx,cy],[cx+16,cy+8],[cx,cy+16],[cx-16,cy+8]];const cols=GCOL[t]||GCOL[0],base=(x+y)%2?cols[0]:cols[1];
 poly(c,pts,base,shade(base,.9),.6);
 if(t==0||t==15){for(let i=0;i<3;i++){const u=r()*.8+.1,v=r()*.8+.1,[a,b]=isoP(x+u,y+v);c.strokeStyle=shade(base,1.18);c.lineWidth=.8;c.beginPath();c.moveTo(a,b);c.lineTo(a-1,b-2.5);c.moveTo(a+1.5,b);c.lineTo(a+2,b-2);c.stroke();}
  if(r()<.06){const [a,b]=isoP(x+.5,y+.5);ell(c,a,b-1,1.6,1.6,['#ff8ac8','#fff27a','#ffffff','#9ad8ff'][Math.floor(r()*4)],null);}}
 else if(t==14||t==1){c.strokeStyle='rgba(0,0,0,.12)';c.lineWidth=.6;c.beginPath();const [a,b]=isoP(x+.5,y);const [e,f]=isoP(x+.5,y+1);c.moveTo(a,b);c.lineTo(e,f);const [g2,h]=isoP(x,y+.5),[i2,j]=isoP(x+1,y+.5);c.moveTo(g2,h);c.lineTo(i2,j);c.stroke();}
 else if(t==2){if(r()<.4){const [a,b]=isoP(x+r(),y+r());c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=.8;c.beginPath();c.moveTo(a-3,b);c.quadraticCurveTo(a,b-1.5,a+3,b);c.stroke();}}
 else if(t==6){c.strokeStyle='rgba(60,30,10,.45)';c.lineWidth=.8;for(let k=1;k<4;k++){const [a,b]=isoP(x+k/4,y+.1),[e,f]=isoP(x+k/4,y+.9);c.beginPath();c.moveTo(a,b);c.lineTo(e,f);c.stroke();}}
 else if(t==7){c.strokeStyle='rgba(80,40,10,.4)';c.lineWidth=.6;for(let k=1;k<4;k++){const [a,b]=isoP(x+.05,y+k/4),[e,f]=isoP(x+.95,y+k/4);c.beginPath();c.moveTo(a,b);c.lineTo(e,f);c.stroke();}}
 else if(t==4){c.strokeStyle='rgba(120,90,255,.7)';c.lineWidth=.6;poly(c,pts,null,'rgba(150,120,255,.6)',.6);}
 else if(t==23||t==26||t==27){poly(c,[[cx,cy+.8],[cx+15,cy+8],[cx,cy+15.2],[cx-15,cy+8]],null,'rgba(120,130,150,.35)',.5);ell(c,cx,cy+8,1.2,.6,'rgba(255,255,255,.6)',null);}
 else if(t==24){c.strokeStyle='rgba(90,50,20,.35)';c.lineWidth=.6;for(let k=1;k<3;k++){const [a,b]=isoP(x+k/3,y),[e,f]=isoP(x+k/3,y+1);c.beginPath();c.moveTo(a,b);c.lineTo(e,f);c.stroke();}const o=((x*7+y*3)%3)/3,[g,h]=isoP(x+.15+o*.6,y+.5),[i2,j]=isoP(x+.33+o*.6,y+.5);c.beginPath();c.moveTo(g,h);c.lineTo(i2,j);c.stroke();}
 else if(t==25){if(r()<.5){const [a,b]=isoP(x+r(),y+r());ell(c,a,b,1.2,.6,'rgba(255,255,255,.25)',null);}}
 else if(t==20||t==21||t==22){poly(c,[[cx,cy+2],[cx+12,cy+8],[cx,cy+14],[cx-12,cy+8]],null,'rgba(255,255,255,.35)',.6);}
 else if(t==8||t==12||t==13){if(r()<.3){const [a,b]=isoP(x+r(),y+r());ell(c,a,b,1.5,.8,shade(base,.8),null);}}
 // water foam edge
 if(t==2&&nb&&nb.some(v=>v!=2)){c.save();c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.clip();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=2;c.stroke();c.restore();}}
// ---- character (smooth chibi, vector) ----
function chibi(c,x,y,o,t,walk){const s=1;const bob=walk?Math.abs(Math.sin(t*10))*1.2:Math.sin(t*2)*.3;shadowE(c,x,y,7,3.2);
 const back=o.face=='up'||o.face=='left',flip=o.face=='left'||o.face=='down'?-1:1,lg=walk?Math.sin(t*10)*2:0;
 c.lineJoin='round';
 // legs
 poly(c,[[x-3.5,y-7],[x-.5,y-7],[x-.5+lg*.3,y-1],[x-3.5+lg*.3,y-1]],o.pants||'#3a3a5a',OLC,.8);poly(c,[[x+.5,y-7],[x+3.5,y-7],[x+3.5-lg*.3,y-1],[x+.5-lg*.3,y-1]],o.pants||'#3a3a5a',OLC,.8);
 ell(c,x-2+lg*.3,y-.8,2.4,1.3,'#2a2030',null);ell(c,x+2-lg*.3,y-.8,2.4,1.3,'#2a2030',null);
 // body
 const by=y-7-bob;c.beginPath();c.moveTo(x-6,by);c.quadraticCurveTo(x-7,by-9,x-3,by-11);c.lineTo(x+3,by-11);c.quadraticCurveTo(x+7,by-9,x+6,by);c.closePath();
 const gr=c.createLinearGradient(0,by-11,0,by);gr.addColorStop(0,shade(o.body,1.15));gr.addColorStop(1,shade(o.body,.8));c.fillStyle=gr;c.fill();c.strokeStyle=OLC;c.lineWidth=.9;c.stroke();
 ell(c,x-6.5,by-4+(walk?-lg*.4:0),1.8,3.2,o.skin||'#ffd8c0',OLC,.7);ell(c,x+6.5,by-4+(walk?lg*.4:0),1.8,3.2,o.skin||'#ffd8c0',OLC,.7);
 // head
 const hy=by-17;c.save();c.translate(x,hy+4);c.scale(1.28,1.28);c.translate(-x,-hy-4);const hg=c.createRadialGradient(x-2,hy-2,1,x,hy,9);hg.addColorStop(0,shade(o.skin||'#ffd8c0',1.05));hg.addColorStop(1,shade(o.skin||'#ffd8c0',.88));ell(c,x,hy,8,7.6,hg,OLC,.9);
 if(o.robot){ell(c,x,hy,8.4,7.8,'#c8d2de',OLC,.9);if(!back){c.fillStyle='#1a2030';c.beginPath();c.roundRect(x-6,hy-3,12,5,2.5);c.fill();ell(c,x-2.5+flip*.8,hy-.5,1.3,1.3,'#3dff9a',null);ell(c,x+2.5+flip*.8,hy-.5,1.3,1.3,'#3dff9a',null);}c.strokeStyle='#8a96a8';c.beginPath();c.moveTo(x,hy-8);c.lineTo(x,hy-12);c.stroke();ell(c,x,hy-12.5,1.6,1.6,'#3dff9a',null);c.restore();return;}
 if(!back){ell(c,x-3+flip*-.6,hy+.5,1.3,1.9,'#2a1820',null);ell(c,x+3+flip*-.6,hy+.5,1.3,1.9,'#2a1820',null);ell(c,x-3.3+flip*-.6,hy-.2,.5,.6,'#fff',null);ell(c,x+2.7+flip*-.6,hy-.2,.5,.6,'#fff',null);
  c.fillStyle='rgba(255,120,150,.35)';ell(c,x-5,hy+3,1.6,.9,'rgba(255,120,150,.35)',null);ell(c,x+5,hy+3,1.6,.9,'rgba(255,120,150,.35)',null);}
 // hair cap
 c.beginPath();if(back){c.ellipse(x,hy-.5,8.4,7.8,0,0,7);}else{c.moveTo(x-8.3,hy+1);c.quadraticCurveTo(x-9,hy-9,x,hy-8.6);c.quadraticCurveTo(x+9,hy-9,x+8.3,hy+1);c.quadraticCurveTo(x+6,hy-3,x+3,hy-3.5);c.lineTo(x+1,hy-1.5);c.lineTo(x-1,hy-3.8);c.quadraticCurveTo(x-6,hy-3,x-8.3,hy+1);}
 const hgr=c.createLinearGradient(0,hy-9,0,hy+2);hgr.addColorStop(0,shade(o.hair,1.15));hgr.addColorStop(1,shade(o.hair,.8));c.fillStyle=hgr;c.fill();c.strokeStyle=OLC;c.lineWidth=.9;c.stroke();
 if(o.style=='long'||o.style=='pony'){ell(c,x+(o.style=='pony'?(back?0:-flip*6):0),hy+6,3,6,shade(o.hair,.85),OLC,.8);}
 if(o.hat){c.beginPath();c.ellipse(x,hy-6,9.5,3,0,0,7);c.fillStyle=o.hat;c.fill();c.stroke();c.beginPath();c.ellipse(x,hy-9,6,4,0,Math.PI,0);c.fillStyle=o.hat;c.fill();c.stroke();}c.restore();}
// ---- glow sprite ----
const _glow={};function glowS(col){if(_glow[col])return _glow[col];const g=document.createElement('canvas');g.width=g.height=64;const c=g.getContext('2d');const gr=c.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,col+'bb');gr.addColorStop(.4,col+'44');gr.addColorStop(1,col+'00');c.fillStyle=gr;c.fillRect(0,0,64,64);return _glow[col]=g;}
