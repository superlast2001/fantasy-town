'use strict';
// v0.0.1.2 smooth 2D illustration layer: curved volumes, bezier leaves, cel shading + soft contact shadows.
// Overrides the draw functions of the most-seen furniture; other items keep the box drawing as fallback.
const IP=(x,y,z=0)=>isoP(x,y,z);
function hull(pts){pts=pts.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
 for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}
 for(let i=pts.length-1;i>=0;i--){const p=pts[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}up.pop();lo.pop();return lo.concat(up);}
function rloop(x0,y0,w,d,r,n=7){r=Math.max(0,Math.min(r,w/2,d/2));const out=[];[[x0+w-r,y0+r,-Math.PI/2],[x0+w-r,y0+d-r,0],[x0+r,y0+d-r,Math.PI/2],[x0+r,y0+r,Math.PI]].forEach(([cx,cy,a0])=>{for(let i=0;i<=n;i++){const a=a0+i/n*Math.PI/2;out.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}});return out;}
function pp(c,pts){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();}
const cl=v=>Math.max(0,Math.min(1,v));
// soft contact shadow on the floor
function cshadow(c,x0,y0,w,d,a=.32){c.save();c.transform(16,8,-16,8,0,0);c.translate(x0+w/2,y0+d/2);c.scale(w/2+.12,d/2+.12);const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,`rgba(30,18,50,${a})`);g.addColorStop(.7,`rgba(30,18,50,${a*.6})`);g.addColorStop(1,'rgba(30,18,50,0)');c.fillStyle=g;c.fillRect(-1.1,-1.1,2.2,2.2);c.restore();}
// rounded volume: plan-rounded corners (r, tiles) + rounded top edge (bz, px); 2-tone cel sides, bevel, top
function rvol(c,x0,y0,z0,w,d,h,col,o={}){const r=o.r??.12,bz=Math.min(o.bz??2.2,h*.6),ol=o.ol===undefined?OLC:o.ol;
 const lp=rloop(x0,y0,w,d,r),bot=lp.map(([x,y])=>IP(x,y,z0)),mid=lp.map(([x,y])=>IP(x,y,z0+h-bz));
 const ins=Math.min(bz*.03,w/4,d/4),top=rloop(x0+ins,y0+ins,w-2*ins,d-2*ins,Math.max(0,r-ins*.5)).map(([x,y])=>IP(x,y,z0+h));
 const sil=hull(bot.concat(mid,top)),L=o.left||shade(col,.92),R=o.right||shade(col,.74),T=o.top||shade(col,1.1);
 const fx=IP(x0+w,y0+d)[0],xs=sil.map(p=>p[0]),xl=Math.min(...xs),xr=Math.max(...xs),f=(fx-xl)/((xr-xl)||1);
 const sg=(k1,k2)=>{const g=c.createLinearGradient(xl,0,xr,0);g.addColorStop(0,shade(L,k1*1.05));g.addColorStop(cl(f-.08),shade(L,k1));g.addColorStop(cl(f+.05),shade(R,k2));g.addColorStop(1,shade(R,k2*.9));return g;};
 c.save();pp(c,sil);c.fillStyle=sg(1,1);c.fill();
 c.save();c.clip();const yb=IP(x0+w,y0+d,z0)[1];const gv=c.createLinearGradient(0,yb-Math.min(h,14),0,yb);gv.addColorStop(0,'rgba(20,10,40,0)');gv.addColorStop(1,'rgba(20,10,40,.18)');c.fillStyle=gv;c.fillRect(xl-2,yb-h-40,xr-xl+4,h+44);c.restore();
 pp(c,hull(mid.concat(top)));c.fillStyle=sg(1.12,1.1);c.fill();
 pp(c,top);const ys=top.map(p=>p[1]),gt=c.createLinearGradient(0,Math.min(...ys),0,Math.max(...ys));gt.addColorStop(0,shade(T,1.06));gt.addColorStop(1,shade(T,.96));c.fillStyle=gt;c.fill();
 if(o.hl!==false){const a=IP(x0+Math.min(r,w/3),y0+d-ins,z0+h),b=IP(x0+w-Math.min(r,w/3)*1.4,y0+d-ins,z0+h);c.beginPath();c.moveTo(a[0],a[1]+.5);c.lineTo(b[0],b[1]+.5);c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=.8;c.stroke();}
 if(ol){pp(c,sil);c.lineWidth=o.lw||1;c.strokeStyle=ol;c.lineJoin='round';c.stroke();}c.restore();}
// rounded rect lying in a vertical plane: y-plane (u along x) or x-plane (u along y) when o.xp
function prr(c,u0,u1,z0,z1,pl,r,fill,ol=OLC,lw=.8,xp){const lp=rloop(u0,z0,u1-u0,z1-z0,r,5).map(([u,z])=>xp?IP(pl,u,z):IP(u,pl,z));pp(c,lp);if(fill){c.fillStyle=fill;c.fill();}if(ol){c.strokeStyle=ol;c.lineWidth=lw;c.stroke();}return lp;}
// rounded rect lying on a floor/top plane at height z
function frr(c,x0,y0,w,d,z,r,fill,ol=OLC,lw=.8){pp(c,rloop(x0,y0,w,d,r).map(([x,y])=>IP(x,y,z)));if(fill){c.fillStyle=fill;c.fill();}if(ol){c.strokeStyle=ol;c.lineWidth=lw;c.stroke();}}
function vgrad(c,y0,y1,a,b){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
// curved leaf in screen space
function leaf(c,x,y,ang,len,wid,col,notch){const ca=Math.cos(ang),sa=Math.sin(ang),T=(u,v)=>[x+u*ca-v*sa,y+u*sa+v*ca];const tip=T(len,0),l1=T(len*.45,-wid),l2=T(len*.55,wid),bend=T(len*.9,-wid*.25);
 c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(l1[0],l1[1],tip[0],tip[1]);c.quadraticCurveTo(l2[0],l2[1],x,y);c.fillStyle=col;c.fill();
 c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(...T(len*.55,wid*.9),tip[0],tip[1]);c.quadraticCurveTo(...T(len*.5,wid*.15),x,y);c.fillStyle=shade(col,.78);c.fill();
 c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(l1[0],l1[1],tip[0],tip[1]);c.quadraticCurveTo(l2[0],l2[1],x,y);c.strokeStyle=OLC;c.lineWidth=.6;c.stroke();
 c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(...T(len*.5,wid*.1),bend[0],bend[1]);c.strokeStyle=shade(col,1.3);c.lineWidth=.45;c.stroke();
 if(notch){c.strokeStyle=shade(col,.6);c.lineWidth=.55;for(const k of[.35,.55,.75]){const a=T(len*k,-wid*.15),b=T(len*(k+.08),-wid*.85);c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}}}
function potI(c,x,y,rad,h,col,o={}){const [a,b]=IP(x,y);c.save();ell(c,a,b+.5,rad*1.5,rad*.75,'rgba(30,18,50,.25)',null);
 c.beginPath();c.moveTo(a-rad,b-h);c.bezierCurveTo(a-rad,b-h*.3,a-rad*.75,b,a,b+rad*.35);c.bezierCurveTo(a+rad*.75,b,a+rad,b-h*.3,a+rad,b-h);c.closePath();const g=c.createLinearGradient(a-rad,0,a+rad,0);g.addColorStop(0,shade(col,1.12));g.addColorStop(.55,col);g.addColorStop(.62,shade(col,.8));g.addColorStop(1,shade(col,.72));c.fillStyle=g;c.fill();c.strokeStyle=OLC;c.lineWidth=.9;c.stroke();
 if(o.band){c.beginPath();c.moveTo(a-rad*.98,b-h*.55);c.quadraticCurveTo(a,b-h*.55+rad*.6,a+rad*.98,b-h*.55);c.strokeStyle=o.band;c.lineWidth=1.4;c.stroke();}
 ell(c,a,b-h,rad*1.06,rad*.5,shade(col,1.15),OLC,.8);ell(c,a,b-h+.3,rad*.85,rad*.36,'#5a3a24',null);c.restore();return[a,b-h];}
function plantI(c,a,b,kind,s=1){const L=(x,y,an,l,w,col,n)=>leaf(c,a+x*s,b+y*s,an,l*s,w*s,col,n);
 if(kind=='monstera'){[[-2.7,7,4],[-.4,9,4.6],[-2.1,8,4],[.6,8,4.4],[-1.4,10,4.5],[-3.1,6,3.6],[.2,7,3.8]].forEach(([an,l,w],i)=>L(0,0,an,l*1.05,w,i%2?'#2f9a4a':'#3fae55',1));}
 else if(kind=='palm'){c.strokeStyle='#8a5a34';c.lineWidth=2*s;c.beginPath();c.moveTo(a,b);c.quadraticCurveTo(a+3*s,b-12*s,a+1*s,b-24*s);c.stroke();c.strokeStyle=OLC;c.lineWidth=.5;c.stroke();const tx=a+1*s,ty=b-24*s;[-2.9,-2.4,-1.9,-1.2,-.6,-.2,.3].forEach((an,i)=>leaf(c,tx,ty,an,13*s,2.6*s,i%2?'#2f9a4a':'#46b85a'));}
 else if(kind=='fiddle'){c.strokeStyle='#6a4a2a';c.lineWidth=1.6*s;c.beginPath();c.moveTo(a,b);c.quadraticCurveTo(a-1*s,b-15*s,a+.5*s,b-30*s);c.stroke();[[-2,-2.4],[-6,-.7],[-10,-2.6],[-14,-.5],[-18,-2.2],[-22,-.9],[-26,-2],[-29,-1.4]].forEach(([dy,an],i)=>L(i%2?.5:-.5,dy,an,7.5,3.6,i%3?'#2f8a3a':'#45a84e'));}
 else{[[-2.6,6],[-2,7],[-1.3,7.5],[-.6,7],[-.1,6.5],[-3,5],[-1.6,6.5],[-.9,6],[.2,5]].forEach(([an,l],i)=>L(Math.cos(an)*2,Math.sin(an)*2-2,an,l,2.8,['#3faa4a','#2f9a4a','#52bf5c'][i%3]));}}
// override generic plant helper so centrepieces/shelves also get leaves
plantTop=function(c,x,y,z,s=1,col){const [a,b]=IP(x,y,z);plantI(c,a,b,'bush',s*.9);};
function pillowI(c,x,y,z,col,s=1,tilt=0){const [a,b]=IP(x,y,z);c.save();c.translate(a,b);c.rotate(tilt);c.scale(s,s);
 c.beginPath();c.moveTo(-6.5,-1);c.quadraticCurveTo(-8,-5,-6.2,-9.5);c.quadraticCurveTo(0,-8,6.2,-10.2);c.quadraticCurveTo(8,-5.5,6.5,-.5);c.quadraticCurveTo(0,1.3,-6.5,-1);c.closePath();
 c.fillStyle=vgrad(c,-10,1,shade(col,1.1),shade(col,.84));c.fill();c.strokeStyle=OLC;c.lineWidth=.9;c.stroke();
 c.beginPath();c.moveTo(-4.5,-7.6);c.quadraticCurveTo(-1,-7,2,-8);c.strokeStyle='rgba(255,255,255,.65)';c.lineWidth=1;c.stroke();
 c.beginPath();c.moveTo(-3,-2.5);c.quadraticCurveTo(0,-4.5,3,-3);c.strokeStyle=shade(col,.7);c.lineWidth=.6;c.stroke();c.restore();}
function cleg(c,x,y,z,col,k=1){const [a,b]=IP(x,y,z),[e,f]=IP(x,y,0);c.beginPath();c.moveTo(a-1,b);c.bezierCurveTo(a-1,b+(f-b)*.5,e-1.6*k,f-3,e-1.3*k,f);c.lineTo(e+.3*k,f);c.bezierCurveTo(e,f-3,a+1,b+(f-b)*.5,a+1,b);c.closePath();c.fillStyle=col;c.fill();c.strokeStyle=OLC;c.lineWidth=.7;c.stroke();}
function seam(c,pts,col){c.save();c.setLineDash([1.3,1.1]);c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=col;c.lineWidth=.6;c.stroke();c.restore();}
const SET=(id,fn)=>{if(FURN[id])FURN[id].draw=fn;};
// ---------- SOFAS ----------
function sofaI(c,col,o={}){cshadow(c,0,.08,2,.86);const lg=o.leg||'#4a3428';[[.14,.88],[1.86,.88],[1.86,.16]].forEach(([x,y])=>{const [a,b]=IP(x,y,0);ell(c,a,b-1,1.4,1.1,lg,OLC,.5);});
 rvol(c,0,.08,2,2,.84,7.5,col,{r:.16,bz:2.5});rvol(c,0,.05,8,2,.3,13,col,{r:.14,bz:6});
 if(o.tuft)for(let u=.3;u<1.8;u+=.35)for(const z of[14,18]){const [a,b]=IP(u,.36,z);ell(c,a,b,.8,.6,shade(col,.6),null);}
 rvol(c,0,.08,9,.26,.84,8,col,{r:.13,bz:4});
 for(let i=0;i<2;i++){const x=.24+i*.77;rvol(c,x,.34,9.5,.76,.56,4.8,shade(col,1.07),{r:.17,bz:2.6});seam(c,[IP(x+.08,.89,11.6),IP(x+.68,.89,11.6)],shade(col,.68));}
 pillowI(c,.55,.4,14.5,o.pil||'#fff',.95,-.08);pillowI(c,1.5,.4,14.5,o.pil2||o.pil||'#fff',.95,.06);
 rvol(c,1.74,.08,9,.26,.84,8,col,{r:.13,bz:4});
 if(o.blanket){const B=o.blanket;c.beginPath();const p0=IP(1.2,.2,21),p1=IP(1.75,.2,21.5),p2=IP(2,.6,17),p3=IP(2.02,.95,6),p4=IP(1.72,.95,4.2),p5=IP(1.5,.6,12);c.moveTo(...p0);c.quadraticCurveTo(...IP(1.6,.12,23),...p1);c.quadraticCurveTo(...IP(2.05,.3,20),...p2);c.lineTo(...p3);c.quadraticCurveTo(...IP(1.88,1,3.4),...p4);c.quadraticCurveTo(...IP(1.6,.8,10),...p5);c.quadraticCurveTo(...IP(1.25,.4,15),...p0);c.closePath();c.fillStyle=vgrad(c,p0[1],p4[1],shade(B,1.1),shade(B,.85));c.fill();c.strokeStyle=OLC;c.lineWidth=.9;c.stroke();
  c.save();c.clip();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.2;for(let k=0;k<4;k++){const a=IP(1.25+k*.15,.25,20-k),b=IP(1.6+k*.12,.95,2);c.beginPath();c.moveTo(...a);c.quadraticCurveTo(...IP(1.5+k*.16,.6,12),...b);c.stroke();}c.restore();}}
SET('sofa',c=>sofaI(c,'#5a8aff',{pil:'#ffffff',pil2:'#ffd84a'}));
SET('sofa_wood',c=>sofaI(c,'#c8845a',{leg:'#6a4228',pil:'#f4e4c8',pil2:'#7aaa5a',blanket:'#e85a4a'}));
SET('sofa_lux',c=>sofaI(c,'#8a2a4a',{leg:'#c8a030',pil:'#e8b830',tuft:1}));
SET('beanbags',c=>{[[.45,.5,'#ff4fd8'],[1.45,.45,'#38e0ff'],[1,.95,'#ffd84a']].forEach(([x,y,col])=>{const [a,b]=IP(x,y,0);ell(c,a,b,10,4.6,'rgba(30,18,50,.25)',null);c.beginPath();c.moveTo(a-10,b-1);c.bezierCurveTo(a-11,b-10,a-5,b-15,a+1,b-14);c.bezierCurveTo(a+8,b-13,a+11,b-8,a+10,b-1);c.quadraticCurveTo(a,b+3.5,a-10,b-1);c.closePath();const g=c.createRadialGradient(a-3,b-10,1,a,b-5,13);g.addColorStop(0,shade(col,1.25));g.addColorStop(.6,col);g.addColorStop(1,shade(col,.7));c.fillStyle=g;c.fill();c.strokeStyle=OLC;c.lineWidth=.9;c.stroke();c.beginPath();c.moveTo(a-6,b-7);c.quadraticCurveTo(a-1,b-5,a+4,b-8);c.strokeStyle=shade(col,.7);c.lineWidth=.7;c.stroke();ell(c,a-4,b-11,2.2,1.1,'rgba(255,255,255,.55)',null);});});
// ---------- BEDS ----------
function bedI(c,fr,sheet,bl,pil,o={}){cshadow(c,0,0,2,2);rvol(c,0,0,0,2,.22,o.hb||20,shade(fr,1.04),{r:.1,bz:o.hbR||6});
 if(o.hbPanel)prr(c,.2,1.8,8,(o.hb||20)-3,.225,1.2,shade(fr,.9),shade(fr,.7),.6);
 rvol(c,0,.12,0,2,1.88,6,fr,{r:.12,bz:2});if(o.glow){c.beginPath();c.moveTo(...IP(.05,2.02,.6));c.lineTo(...IP(1.98,2.02,.6));c.strokeStyle=o.glow;c.lineWidth=1.6;c.stroke();}
 rvol(c,.07,.2,6,1.86,1.74,4,sheet,{r:.14,bz:2.2});pillowI(c,.55,.42,10.5,pil,1.15,-.06);pillowI(c,1.45,.42,10.5,pil,1.15,.05);
 const z=10.3,y0=.82;// blanket top + draped hem over the front and side
 c.beginPath();c.moveTo(...IP(.03,y0,z));c.quadraticCurveTo(...IP(1,y0-.06,z+.8),...IP(1.97,y0,z));c.lineTo(...IP(1.99,1.9,z));c.quadraticCurveTo(...IP(2.04,2.0,z-1),...IP(2.04,2.02,4.8));
 for(let k=0;k<4;k++){const x1=2.04-(k+1)*.5;c.quadraticCurveTo(...IP(x1+.25,2.05,2.6+(k%2)),...IP(x1,2.04,4.6));}
 c.quadraticCurveTo(...IP(0,2.0,z-1),...IP(.01,1.9,z));c.closePath();c.fillStyle=bl;c.fill();
 c.save();c.clip();const tp=IP(1,1.4,z);const g=c.createLinearGradient(tp[0]-20,tp[1]-14,tp[0]+24,tp[1]+18);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(.6,'rgba(255,255,255,0)');g.addColorStop(.62,'rgba(20,10,40,.08)');g.addColorStop(1,'rgba(20,10,40,.2)');c.fillStyle=g;c.fillRect(tp[0]-60,tp[1]-40,120,80);
 // hanging part darker
 c.beginPath();c.moveTo(...IP(-.1,2.0,z-1.2));c.lineTo(...IP(2.1,2.0,z-1.2));c.lineTo(...IP(2.1,2.2,0));c.lineTo(...IP(-.1,2.2,0));c.closePath();c.fillStyle='rgba(20,10,40,.14)';c.fill();
 c.beginPath();c.moveTo(...IP(1.99,.8,z-1));c.lineTo(...IP(2.2,.8,z-1));c.lineTo(...IP(2.2,2.1,0));c.lineTo(...IP(1.99,2.1,0));c.fillStyle='rgba(20,10,40,.2)';c.fill();
 if(o.quilt){c.strokeStyle=shade(bl,.75);c.lineWidth=.6;for(let k=1;k<4;k++){c.beginPath();c.moveTo(...IP(k*.5,y0+.05,z));c.lineTo(...IP(k*.5,1.98,z));c.stroke();}for(let k=1;k<3;k++){c.beginPath();c.moveTo(...IP(.05,y0+k*.38,z));c.lineTo(...IP(1.97,y0+k*.38,z));c.stroke();}}
 if(o.pattern){for(let i=0;i<7;i++){const [a,b]=IP(.3+(i*.53)%1.5,.95+(i*.37)%1,z);ell(c,a,b,2.4,1.2,o.pattern,null);}}
 // folds
 c.strokeStyle=shade(bl,.72);c.lineWidth=.7;[[.5,1.2,.75,1.9],[1.3,1.0,1.5,1.7]].forEach(([x1,y1,x2,y2])=>{c.beginPath();c.moveTo(...IP(x1,y1,z));c.quadraticCurveTo(...IP((x1+x2)/2+.15,(y1+y2)/2,z),...IP(x2,y2,z));c.stroke();});c.restore();
 c.beginPath();c.moveTo(...IP(.03,y0,z));c.quadraticCurveTo(...IP(1,y0-.06,z+.8),...IP(1.97,y0,z));c.lineTo(...IP(1.99,1.9,z));c.quadraticCurveTo(...IP(2.04,2.0,z-1),...IP(2.04,2.02,4.8));for(let k=0;k<4;k++){const x1=2.04-(k+1)*.5;c.quadraticCurveTo(...IP(x1+.25,2.05,2.6+(k%2)),...IP(x1,2.04,4.6));}c.quadraticCurveTo(...IP(0,2.0,z-1),...IP(.01,1.9,z));c.closePath();c.strokeStyle=OLC;c.lineWidth=.9;c.stroke();
 // turned-down sheet band
 c.beginPath();c.moveTo(...IP(.05,y0-.02,z+.2));c.quadraticCurveTo(...IP(1,y0-.1,z+1),...IP(1.95,y0-.02,z+.2));c.lineTo(...IP(1.95,y0+.16,z+.1));c.quadraticCurveTo(...IP(1,y0+.1,z+.9),...IP(.05,y0+.16,z+.1));c.closePath();c.fillStyle=o.band||'#ffffff';c.fill();c.strokeStyle=OLC;c.lineWidth=.6;c.stroke();}
SET('bed',c=>bedI(c,'#8a8e9a','#f4f4f8','#5a8aff','#ffffff',{hb:18}));
SET('bed_wood',c=>bedI(c,'#a8744a','#fbf4e8','#e8a04a','#ffffff',{hb:22,hbPanel:1,quilt:1}));
SET('bed_neon',c=>bedI(c,'#2a2240','#e8e4f4','#7a4aff','#38e0ff',{hb:18,glow:'#ff4fd8',band:'#ff9af0'}));
SET('bed_beach',c=>bedI(c,'#d8b07a','#ffffff','#38c8c0','#ffd84a',{hb:24,hbR:10,pattern:'rgba(255,255,255,.7)'}));
SET('bed_lux',c=>bedI(c,'#7a2a3a','#fff8f0','#e8b830','#ffffff',{hb:28,hbR:10,hbPanel:1,band:'#fff4d8'}));
// ---------- TVs ----------
function tvI(c,con,scr,o={}){cshadow(c,0,.2,2,.6);rvol(c,0,.2,0,2,.6,9,con,{r:.1,bz:1.6});[.08,1.02].forEach(u=>{prr(c,u,u+.9,1.5,7.5,.805,.8,shade(con,.95),shade(con,.7),.5);const [a,b]=IP(u+.45,.81,4.5);ell(c,a,b,2,.7,'#c8c8d0',OLC,.4);});
 rvol(c,.85,.4,9,.3,.2,3,'#2a2a34',{r:.1,bz:1});
 prr(c,.12,1.88,11,36,.42,1.6,'#1a1a24',OLC,1);const pts=prr(c,.17,1.83,12.5,34.5,.43,1,null,null);pp(c,pts);c.save();c.clip();const t=IP(1,.43,34.5),b=IP(1,.43,12.5);c.fillStyle=vgrad(c,t[1]-12,b[1]+12,scr[0],scr[1]);c.fillRect(t[0]-60,t[1]-30,120,90);
 if(o.scene=='sea'){const h=IP(1,.43,20);c.fillStyle='#38a8e8';c.fillRect(h[0]-60,h[1]-14,120,60);ell(c,...IP(1.4,.43,28),3.5,3.5,'#ffe27a',null);c.fillStyle='#f2dca0';c.beginPath();c.moveTo(...IP(.1,.43,13));c.quadraticCurveTo(...IP(.9,.43,19),...IP(1.9,.43,15));c.lineTo(...IP(1.9,.43,10));c.lineTo(...IP(.1,.43,10));c.fill();}
 else{for(let i=0;i<5;i++){const [a,b2]=IP(.4+i*.3,.43,16+(i%2)*6);c.fillStyle=['#ff4fd8','#3dff9a','#ffd84a','#38e0ff','#ff7a3a'][i];c.beginPath();c.roundRect(a-2,b2-2,4,4,1.2);c.fill();}}
 c.fillStyle='rgba(255,255,255,.16)';c.beginPath();c.moveTo(...IP(.3,.43,34.5));c.lineTo(...IP(.7,.43,34.5));c.lineTo(...IP(.35,.43,12.5));c.lineTo(...IP(-.05,.43,12.5));c.fill();c.restore();
 if(o.extra)o.extra(c);}
SET('tv',c=>tvI(c,'#f4f4f8',['#9ad8ff','#e8f6ff'],{scene:'sea',extra:c=>plantI(c,...IP(1.85,.5,9),'bush',.55)}));
SET('tv_neon',c=>tvI(c,'#2a2240',['#3a1a6a','#ff4fd8'],{extra:c=>{const [a,b]=IP(.5,.6,9);ell(c,a,b-1,3.5,1.6,'#e8e8f0',OLC,.6);ell(c,a,b-1.5,1.2,.6,'#ff4fd8',null);}}));
// ---------- FRIDGES ----------
function fridgeI(c,col,o={}){cshadow(c,.05,.1,.9,.8);rvol(c,.05,.1,0,.9,.8,44,col,{r:.14,bz:3});
 c.beginPath();c.moveTo(...IP(.08,.9,29));c.quadraticCurveTo(...IP(.5,.91,29),...IP(.93,.9,29));c.lineTo(...IP(.95,.13,29));c.strokeStyle=shade(col,.62);c.lineWidth=.8;c.stroke();
 prr(c,.74,.8,31,40,.905,.03,shade(col,.7),OLC,.5);prr(c,.74,.8,16,26,.905,.03,shade(col,.7),OLC,.5);
 if(o.glass){prr(c,.12,.68,3,27,.905,.06,'rgba(120,220,255,.28)',o.edge,.9);[[8,'#ff4fd8'],[8,'#3dff9a'],[15,'#ffd84a'],[15,'#38e0ff'],[22,'#ff7a3a'],[22,'#c48aff']].forEach(([z,cc],i)=>{const u=.18+(i%2)*.24;prr(c,u,u+.14,z-2.5,z+3,.906,.05,cc,'rgba(0,0,0,.4)',.4);});[10.5,17.5,24.5].forEach(z=>{c.beginPath();c.moveTo(...IP(.12,.906,z));c.lineTo(...IP(.68,.906,z));c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=.6;c.stroke();});}
 else{prr(c,.18,.32,33,37.5,.906,.03,'#ffd84a',OLC,.4);ell(c,...IP(.45,.906,35),1.6,1.6,'#ff6a8a',OLC,.4);prr(c,.2,.42,19,24,.906,.02,'#ffffff','#aaa',.4);}
 c.save();c.globalAlpha=.55;prr(c,.12,.19,3,42,.906,.035,'#ffffff',null);c.globalAlpha=.25;prr(c,.23,.26,8,40,.906,.015,'#ffffff',null);c.restore();
 if(o.edge){c.beginPath();c.moveTo(...IP(.06,.9,43.5));c.lineTo(...IP(.94,.9,43.5));c.strokeStyle=o.edge;c.lineWidth=1.4;c.stroke();}}
SET('fridge',c=>fridgeI(c,'#e4e9f0'));
SET('fridge_neon',c=>fridgeI(c,'#2a2240',{glass:1,edge:'#ff4fd8'}));
// ---------- STOVES ----------
function stoveI(c,body,o={}){cshadow(c,0,.05,1,.9);if(o.back){rvol(c,0,.05,18,1,.16,12,body,{r:.06,bz:3});prr(c,.2,.8,22,27,.215,.6,'#c8945a',OLC,.5);}
 rvol(c,0,.05,0,1,.9,16,body,{r:.07,bz:1.5});rvol(c,-.02,.03,16,1.04,.94,2,o.top||'#22222c',{r:.08,bz:1});
 [[.3,.32],[.7,.32],[.3,.72],[.7,.72]].forEach(([x,y],i)=>{const [a,b]=IP(x,y,18);ell(c,a,b,4,2,'#3a3a46',null);ell(c,a,b,3,1.5,null,i==1?'#ff5a3a':'#55556a',i==1?1.1:.7);if(i==1){ell(c,a,b,1.6,.8,null,'#ffa04a',.7);}});
 const w=prr(c,.12,.88,3,12.5,.955,.8,shade(body,.85),OLC,.7);prr(c,.2,.8,5,10.5,.957,.6,vgrad(c,...[IP(.5,.95,10.5)[1],IP(.5,.95,5)[1]],'#4a2a2a','#ff9a5a'),OLC,.5);
 c.beginPath();c.moveTo(...IP(.22,.97,13.6));c.lineTo(...IP(.78,.97,13.6));c.strokeStyle='#b8b8c4';c.lineWidth=1.3;c.stroke();
 for(let k=0;k<3;k++)ell(c,...IP(.25+k*.25,.956,15),1,.9,'#c8c8d0',OLC,.4);
 const [a,b]=IP(.3,.72,18);c.beginPath();c.moveTo(a-4,b-1);c.lineTo(a-4,b-6);c.quadraticCurveTo(a,b-7.5,a+4,b-6);c.lineTo(a+4,b-1);c.quadraticCurveTo(a,b+1.2,a-4,b-1);c.fillStyle=vgrad(c,b-7,b+1,o.pot||'#e85a4a',shade(o.pot||'#e85a4a',.7));c.fill();c.strokeStyle=OLC;c.lineWidth=.7;c.stroke();ell(c,a,b-6,4,1.6,shade(o.pot||'#e85a4a',1.2),OLC,.6);ell(c,a-1.4,b-4,1.2,1.4,'rgba(255,255,255,.45)',null);
 c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.8;[[-1.5,0],[1.5,1]].forEach(([dx,ph])=>{c.beginPath();c.moveTo(a+dx,b-8);c.bezierCurveTo(a+dx-2,b-10,a+dx+2,b-12,a+dx,b-14-ph);c.stroke();});}
SET('stove',c=>stoveI(c,'#e0e4ec',{pot:'#5a8aff'}));
SET('stove_retro',c=>stoveI(c,'#efe2c4',{back:1,top:'#3a2a2a',pot:'#e85a4a'}));
FURN.stove_retro.h=42;
// ---------- TOILETS ----------
function toiletI(c,trim){cshadow(c,.15,.1,.7,.8,.28);rvol(c,.2,.06,7,.6,.24,15,'#ffffff',{r:.08,bz:3,left:'#f2f4f8',right:'#d4dae4'});ell(c,...IP(.62,.3,22),1.4,.8,trim||'#c8ccd8',OLC,.4);
 rvol(c,.36,.32,0,.3,.36,7,'#ffffff',{r:.14,bz:1,left:'#eef0f4',right:'#cfd5df'});rvol(c,.22,.24,6.5,.58,.66,5.5,'#ffffff',{r:.29,bz:2.5,left:'#f2f4f8',right:'#d0d6e0'});
 frr(c,.27,.3,.48,.56,12.05,.24,null,trim||'#b8c0cc',1.4);frr(c,.33,.36,.36,.44,12.1,.18,vgrad(c,...[IP(.5,.36,12)[1],IP(.5,.8,12)[1]],'#a8d8f0','#d8f0ff'),null);
 const [a,b]=IP(.45,.42,12.2);ell(c,a,b,1.4,.6,'rgba(255,255,255,.8)',null);}
SET('toilet',c=>toiletI(c));SET('toilet_lux',c=>toiletI(c,'#e8b830'));
// ---------- BATHTUBS ----------
function tubI(c,o={}){cshadow(c,0,.1,2,.84);const z0=o.feet?3:0,H=o.feet?11:12,body=o.body||'#ffffff';
 if(o.feet)[[.25,.85],[1.75,.85],[1.75,.25],[.25,.25]].forEach(([x,y])=>{const [a,b]=IP(x,y,0);c.beginPath();c.moveTo(a-1.6,b);c.quadraticCurveTo(a-1.4,b-3.5,a,b-4);c.quadraticCurveTo(a+1.4,b-3.5,a+1.6,b);c.closePath();c.fillStyle='#e8b830';c.fill();c.strokeStyle=OLC;c.lineWidth=.6;c.stroke();});
 rvol(c,.04,.12,z0,1.92,.8,H,body,{r:.38,bz:3.5,left:shade(body,.97),right:shade(body,.8)});
 frr(c,.15,.2,1.7,.64,z0+H-.1,.3,'#e4ecf4',null);frr(c,.2,.25,1.6,.54,z0+H-.05,.26,vgrad(c,...[IP(1,.25,z0+H)[1]-8,IP(1,.8,z0+H)[1]+4],'#5ab8f0','#a8e4ff'),'#7aa8c8',.6);
 [[.6,.5],[.85,.62],[1.2,.45],[1.45,.6],[.95,.4]].forEach(([x,y],i)=>{const [a,b]=IP(x,y,z0+H);ell(c,a,b-.4,1.6+(i%2),1+(i%2)*.4,'rgba(255,255,255,.9)','rgba(150,190,220,.8)',.4);});
 const [a,b]=IP(.12,.5,z0+H);c.beginPath();c.moveTo(a,b);c.lineTo(a,b-6);c.quadraticCurveTo(a+.5,b-9,a+4,b-7);c.strokeStyle=o.tap||'#c8ccd8';c.lineWidth=1.6;c.stroke();c.strokeStyle=OLC;c.lineWidth=.4;c.stroke();
 if(o.caddy){rvol(c,1.15,.1,z0+H,.18,.84,1.2,'#c8945a',{r:.04,bz:.6});ell(c,...IP(1.24,.4,z0+H+1.2),1.5,.8,'#ff9ac8',OLC,.4);}}
SET('bathtub',c=>tubI(c,{feet:1,tap:'#e8b830'}));SET('bathtub_modern',c=>tubI(c,{caddy:1}));
// ---------- TABLES & CHAIRS ----------
function chairI(c,x,y,col,seat,back){[[.04,.04],[.26,.04],[.04,.26],[.26,.26]].forEach(([dx,dy])=>cleg(c,x+dx,y+dy,8,col,.8));rvol(c,x-.02,y-.02,8,.34,.34,1.8,seat||shade(col,1.2),{r:.12,bz:1});
 if(back){const p=[IP(x,y,9.5),IP(x+.32,y,9.5),IP(x+.32,y,19),IP(x,y,19)];c.beginPath();c.moveTo(...p[0]);c.lineTo(...p[1]);c.lineTo(...IP(x+.32,y,16));c.quadraticCurveTo(...IP(x+.34,y,21),...IP(x+.16,y,21));c.quadraticCurveTo(...IP(x-.02,y,21),...IP(x,y,16));c.closePath();c.fillStyle=vgrad(c,p[3][1]-3,p[0][1],shade(col,1.15),shade(col,.85));c.fill();c.strokeStyle=OLC;c.lineWidth=.8;c.stroke();prr(c,x+.08,x+.24,13,18,y+.005,.05,shade(col,.8),null);}}
function stoolI(c,x,y,col,seat){[[.06,.06],[.24,.06],[.06,.24],[.24,.24]].forEach(([dx,dy])=>cleg(c,x+dx,y+dy,8,col,.8));rvol(c,x,y,8,.32,.32,2,seat,{r:.16,bz:1.2});}
function tableTop(c,x0,y0,w,d,z,col,r,o={}){rvol(c,x0,y0,z,w,d,o.th||2,col,{r,bz:1.1});if(o.grain){c.save();frr(c,x0+.02,y0+.02,w-.04,d-.04,z+(o.th||2),r,null,null);c.clip();c.strokeStyle=shade(col,.82);c.lineWidth=.5;for(let k=1;k<5;k++){c.beginPath();c.moveTo(...IP(x0,y0+k*d/5,z+(o.th||2)));c.bezierCurveTo(...IP(x0+w*.3,y0+k*d/5+.04,z+2),...IP(x0+w*.6,y0+k*d/5-.05,z+2),...IP(x0+w,y0+k*d/5,z+(o.th||2)));c.stroke();}c.restore();}}
SET('dining',c=>{cshadow(c,.1,.05,1.8,.95);chairI(c,.2,.0,'#8a5a34','#e8c898',1);chairI(c,1.5,.0,'#8a5a34','#e8c898',1);
 [[.3,.2],[1.7,.2],[.3,.78],[1.7,.78]].forEach(([x,y])=>cleg(c,x,y,13,'#7a4a2a'));tableTop(c,.18,.16,1.64,.72,13,'#c8945a',.2,{grain:1});
 const [a,b]=IP(.65,.5,15);ell(c,a,b,3.6,1.7,'#fff',OLC,.5);ell(c,a,b-.4,2.2,.9,'#ff9a5a',null);const [e,f]=IP(1.35,.45,15);ell(c,e,f,3.6,1.7,'#fff',OLC,.5);ell(c,e+.5,f-.6,1.3,1.3,'#3dbf6a',null);
 const [g,h]=IP(1,.52,15);c.beginPath();c.moveTo(g-3,h-1);c.quadraticCurveTo(g,h+2,g+3,h-1);c.closePath();c.fillStyle='#e8d8c0';c.fill();c.stroke();[['#ff5a5a',-1.5],['#ffd84a',0],['#ff9a3a',1.5]].forEach(([cc,dx])=>ell(c,g+dx,h-2,1.3,1.3,cc,OLC,.3));
 stoolI(c,.6,.95,'#7a4a2a','#e8c898');stoolI(c,1.12,.95,'#7a4a2a','#e8c898');});
SET('dining_lux',c=>{cshadow(c,.1,.1,1.8,1.8);chairI(c,.85,.0,'#5a1a2a','#a83a4a',1);chairI(c,.0,.85,'#5a1a2a','#a83a4a',0);
 rvol(c,.88,.88,0,.24,.24,13,'#c8a030',{r:.12,bz:1});tableTop(c,.25,.25,1.5,1.5,13,'#f4f0ec',.75,{th:2.2});const [a,b]=IP(1,1,15.2);[[-8,1],[5,-2],[-2,4]].forEach(([dx,dy])=>{c.beginPath();c.moveTo(a+dx,b+dy);c.quadraticCurveTo(a+dx+3,b+dy-1,a+dx+6,b+dy+.5);c.strokeStyle='rgba(150,150,170,.5)';c.lineWidth=.6;c.stroke();});
 c.beginPath();c.moveTo(a-3,b-1);c.quadraticCurveTo(a,b+2,a+3,b-1);c.fillStyle='#e8b830';c.fill();c.strokeStyle=OLC;c.lineWidth=.5;c.stroke();plantI(c,a,b-1,'bush',.5);
 stoolI(c,1.7,.85,'#5a1a2a','#a83a4a');stoolI(c,.85,1.7,'#5a1a2a','#a83a4a');});
SET('coffeetable',c=>{cshadow(c,.15,.2,1.7,.6);[[.25,.28],[1.75,.28],[.25,.72],[1.75,.72]].forEach(([x,y])=>cleg(c,x,y,8,'#6a4228'));tableTop(c,.12,.18,1.76,.64,8,'#a8744a',.28,{th:2.4,grain:1});
 const [a,b]=IP(.6,.45,10.4);prr(c,.45,.85,10.4,11.4,.55,.1,'#5a8aff',OLC,.5);c.beginPath();const [e,f]=IP(1.4,.5,10.4);c.moveTo(e-2,f);c.lineTo(e-2,f-4);c.quadraticCurveTo(e,f-5,e+2,f-4);c.lineTo(e+2,f);c.quadraticCurveTo(e,f+1,e-2,f);c.fillStyle='#ffffff';c.fill();c.strokeStyle=OLC;c.lineWidth=.6;c.stroke();ell(c,e,f-4,2,.8,'#6a3a1a',null);c.beginPath();c.arc(e+2.6,f-2.2,1.2,-1.5,1.5);c.stroke();});
SET('coffeetable_glass',c=>{cshadow(c,.15,.2,1.7,.6,.22);[[.3,.3],[1.7,.3],[.3,.7],[1.7,.7]].forEach(([x,y])=>cleg(c,x,y,8,'#e8b830',.6));c.save();c.globalAlpha=.55;tableTop(c,.12,.18,1.76,.64,8,'#bfe6f4',.3,{th:1.5});c.restore();frr(c,.12,.18,1.76,.64,9.5,.3,null,'#5a7a8a',.8);
 const [a,b]=IP(.5,.3,9.5),[e,f]=IP(.9,.6,9.5);c.beginPath();c.moveTo(a,b);c.lineTo(e,f);c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1;c.stroke();potI(c,1.4,.5,2.4,3,'#ffffff');});
SET('waitchairs',c=>{cshadow(c,.1,.15,1.8,.7);[0,1].forEach(i=>{const x=.12+i;[[.1,.2],[.66,.2],[.1,.7],[.66,.7]].forEach(([dx,dy])=>cleg(c,x+dx,dy+.0,6,'#3a3a48',.7));rvol(c,x,.15,10,.76,.18,10,'#ff6ab0',{r:.09,bz:5});rvol(c,x,.15,6,.76,.68,4.5,'#ff6ab0',{r:.25,bz:2.4});});const [a,b]=IP(1,.45,0);potI(c,1,.5,2.6,5,'#e8e8f0');});
SET('armchair_beach',c=>{cshadow(c,.15,.15,.7,.7);const [a,b]=IP(.4,.3,10);c.beginPath();c.moveTo(a-11,b);c.bezierCurveTo(a-15,b-22,a+15,b-30,a+12,b+2);c.closePath();c.fillStyle=vgrad(c,b-26,b,'#e8c88a','#b8925a');c.fill();c.strokeStyle=OLC;c.lineWidth=1;c.stroke();
 c.save();c.clip();c.strokeStyle='rgba(120,80,30,.55)';c.lineWidth=.6;for(let k=-5;k<=5;k++){c.beginPath();c.moveTo(a,b);c.lineTo(a+k*4,b-30);c.stroke();}for(let r=6;r<30;r+=5){c.beginPath();c.ellipse(a,b,r*.8,r,0,Math.PI,0);c.stroke();}c.restore();
 [[.25,.25],[.75,.25],[.25,.75],[.75,.75]].forEach(([x,y])=>cleg(c,x,y,9,'#b8925a',.8));rvol(c,.15,.2,9,.7,.65,4,'#38c8c0',{r:.3,bz:2});pillowI(c,.48,.4,13,'#ffd84a',.8);});
// ---------- LAMPS ----------
function shadeI(c,a,b,r,col,glow){c.beginPath();c.moveTo(a-r,b);c.quadraticCurveTo(a,b+r*.45,a+r,b);c.lineTo(a+r*.62,b-r*1.35);c.quadraticCurveTo(a,b-r*1.1,a-r*.62,b-r*1.35);c.closePath();const g=c.createLinearGradient(a-r,0,a+r,0);g.addColorStop(0,shade(col,1.12));g.addColorStop(.5,col);g.addColorStop(.58,shade(col,.84));g.addColorStop(1,shade(col,.78));c.fillStyle=g;c.fill();c.strokeStyle=OLC;c.lineWidth=.8;c.stroke();
 ell(c,a,b,r*.92,r*.32,glow||'#fff4c8',null);ell(c,a,b-r*1.35,r*.62,r*.18,shade(col,1.2),OLC,.5);}
shadeLamp=function(c,x,y,z,col,r=4){const [a,b]=IP(x,y,z);c.strokeStyle='#8a7a6a';c.lineWidth=1;c.beginPath();c.moveTo(a,b);c.lineTo(a,b+1);c.stroke();shadeI(c,a,b,r,col);};
SET('floorlamp',c=>{const [a,b]=IP(.3,.3,0);ell(c,a,b,4.6,2.2,'rgba(30,18,50,.25)',null);ell(c,a,b-1,4,1.9,'#2a2a34',OLC,.7);ell(c,a-1,b-1.6,1.6,.6,'rgba(255,255,255,.35)',null);const [e,f]=IP(.85,.85,44);
 c.beginPath();c.moveTo(a,b-1);c.bezierCurveTo(a-2,b-40,e-2,f-22,e,f-6);c.strokeStyle=OLC;c.lineWidth=2.6;c.stroke();c.strokeStyle='#4a4a5a';c.lineWidth=1.5;c.stroke();c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=.5;c.stroke();shadeI(c,e,f+2,6,'#f4ecd8');});
SET('nightstand',c=>{cshadow(c,.15,.15,.7,.7);rvol(c,.15,.15,0,.7,.7,16,'#a8744a',{r:.1,bz:1.6});prr(c,.22,.78,8.5,14,.855,.5,'#b8844a',OLC,.5);ell(c,...IP(.5,.86,11.2),1.1,.8,'#e8c88a',OLC,.4);
 const [a,b]=IP(.5,.5,16);c.beginPath();c.moveTo(a-2.5,b);c.bezierCurveTo(a-4,b-4,a-1.5,b-7,a,b-7);c.bezierCurveTo(a+1.5,b-7,a+4,b-4,a+2.5,b);c.closePath();c.fillStyle=vgrad(c,b-7,b,'#ffffff','#c8d8e8');c.fill();c.strokeStyle=OLC;c.lineWidth=.6;c.stroke();shadeI(c,a,b-8,5,'#ffe8b0');});
SET('nightstand_lux',c=>{cshadow(c,.15,.15,.7,.7);[[.22,.82],[.78,.82]].forEach(([x,y])=>cleg(c,x,y,5,'#c8a030',.6));rvol(c,.15,.15,5,.7,.7,12,'#f4f0ec',{r:.12,bz:1.6});prr(c,.22,.78,8,14.5,.855,.4,null,'#e8b830',.7);
 const [a,b]=IP(.5,.5,17);ell(c,a,b,2.4,1,'#e8b830',OLC,.5);c.strokeStyle='#e8b830';c.lineWidth=1.2;c.beginPath();c.moveTo(a,b);c.lineTo(a,b-6);c.stroke();shadeI(c,a,b-7,5.5,'#fff0d8');});
SET('lavalamp',c=>{cshadow(c,.2,.2,.6,.6);rvol(c,.2,.2,0,.6,.6,14,'#2a2240',{r:.2,bz:2});const [a,b]=IP(.5,.5,14);ell(c,a,b,3,1.3,'#8a8a9a',OLC,.5);c.beginPath();c.moveTo(a-2.4,b-1);c.bezierCurveTo(a-4.2,b-9,a-1.5,b-16,a-1.2,b-20);c.lineTo(a+1.2,b-20);c.bezierCurveTo(a+1.5,b-16,a+4.2,b-9,a+2.4,b-1);c.closePath();c.fillStyle=vgrad(c,b-20,b,'#ff9af0','#ff4fd8');c.fill();c.strokeStyle=OLC;c.lineWidth=.7;c.stroke();
 ell(c,a-.5,b-6,1.5,2,'#ffd84a',null);ell(c,a+.6,b-12,1,1.5,'#ffd84a',null);ell(c,a-1.5,b-10,.5,3,'rgba(255,255,255,.5)',null);ell(c,a,b-20.5,1.4,.6,'#8a8a9a',OLC,.4);});
// ---------- PLANTS ----------
SET('plant_monstera',c=>{const [a,b]=potI(c,.5,.5,4.6,8,'#e8d8c0',{band:'#c8945a'});plantI(c,a,b,'monstera',1.05);});
SET('plant_palm',c=>{const [a,b]=potI(c,.5,.5,4.2,9,'#f4f4f4',{band:'#38c8c0'});plantI(c,a,b,'palm',1.1);});
SET('plant_fiddle',c=>{const [a,b]=potI(c,.5,.5,4.4,10,'#2a2a34');plantI(c,a,b,'fiddle',1);});
SET('ficus_lobby',c=>{const [a,b]=potI(c,.5,.5,4.4,9,'#e8b830');plantI(c,a,b-6,'bush',1.25);plantI(c,a,b-14,'bush',1);});
// ---------- RUGS ----------
function fringe(c,x0,y0,w,d,col){c.strokeStyle=col;c.lineWidth=.6;for(let u=.05;u<w;u+=.08){const [a,b]=IP(x0+u,y0+d,.5),[e,f]=IP(x0+u,y0+d+.07,.3);c.beginPath();c.moveTo(a,b);c.lineTo(e,f);c.stroke();}for(let u=.05;u<d;u+=.08){const [a,b]=IP(x0+w,y0+u,.5),[e,f]=IP(x0+w+.07,y0+u,.3);c.beginPath();c.moveTo(a,b);c.lineTo(e,f);c.stroke();}}
function rugI(c,base,inner,o={}){cshadow(c,.1,.1,1.8,1.8,.12);fringe(c,.1,.1,1.8,1.8,o.fr||'#f4e8d0');frr(c,.1,.1,1.8,1.8,.6,.12,base,OLC,.8);frr(c,.25,.25,1.5,1.5,.65,.1,null,inner,1);if(o.fn)o.fn(c);}
SET('rug_lux',c=>rugI(c,'#8a1a2a','#e8b830',{fn:c=>{frr(c,.55,.55,.9,.9,.7,.45,'#1a3a6a','#e8b830',.8);frr(c,.8,.8,.4,.4,.75,.2,'#e8b830',null);[[.4,.4],[1.6,.4],[.4,1.6],[1.6,1.6]].forEach(([x,y])=>{const [a,b]=IP(x,y,.7);ell(c,a,b,2.4,1.2,'#e8b830',null);});}}));
SET('rug_beach',c=>rugI(c,'#f4f0e0','#38c8c0',{fr:'#d8c8a0',fn:c=>{for(let i=0;i<4;i++){c.beginPath();const y=.35+i*.38;c.moveTo(...IP(.15,y,.7));for(let k=0;k<6;k++)c.quadraticCurveTo(...IP(.15+(k+.5)*.28,y+(k%2?.06:-.06),.7),...IP(.15+(k+1)*.28,y,.7));c.strokeStyle=['#38c8c0','#ff9a5a','#ffd84a','#38a8e8'][i];c.lineWidth=2.2;c.stroke();}}}));
SET('rug_neon',c=>rugI(c,'#2a2240','#ff4fd8',{fr:'#38e0ff',fn:c=>{c.strokeStyle='rgba(56,224,255,.8)';c.lineWidth=.8;for(let i=1;i<4;i++){c.beginPath();c.moveTo(...IP(.25+i*.375,.25,.7));c.lineTo(...IP(.25+i*.375,1.75,.7));c.stroke();c.beginPath();c.moveTo(...IP(.25,.25+i*.375,.7));c.lineTo(...IP(1.75,.25+i*.375,.7));c.stroke();}}}));
SET('rug_modern',c=>rugI(c,'#e4e8f0','#5a8aff',{fr:'#c8ccd8',fn:c=>{const [a,b]=IP(1,1,.7);ell(c,a,b,14,7,'#5a8aff',null);ell(c,a+5,b+1,8,4,'#ffd84a',null);ell(c,a-7,b+2,5,2.5,'#ff8ac8',null);}}));
SET('rug_wood',c=>{cshadow(c,.05,.05,1.9,1.9,.12);const [a,b]=IP(1,1,.5);ell(c,a,b,26,13,'#e8c898',OLC,.8);ell(c,a,b,20,10,null,'#d8784a',2.2);ell(c,a,b,14,7,'#f4e0b8',null);ell(c,a,b,14,7,null,'#7aaa5a',1.6);ell(c,a,b,6,3,'#d8784a',null);for(let k=0;k<24;k++){const an=k/24*Math.PI*2;ell(c,a+Math.cos(an)*23,b+Math.sin(an)*11.5,.9,.5,'#c8a070',null);}});
// ---------- BOOKSHELF ----------
function bottle(c,a,b,col,h=6){c.beginPath();c.moveTo(a-1.6,b);c.lineTo(a-1.6,b-h*.55);c.quadraticCurveTo(a-1.6,b-h*.72,a-.6,b-h*.78);c.lineTo(a-.6,b-h);c.lineTo(a+.6,b-h);c.lineTo(a+.6,b-h*.78);c.quadraticCurveTo(a+1.6,b-h*.72,a+1.6,b-h*.55);c.lineTo(a+1.6,b);c.closePath();c.fillStyle=col;c.fill();c.strokeStyle=OLC;c.lineWidth=.5;c.stroke();c.beginPath();c.moveTo(a-.8,b-1);c.lineTo(a-.8,b-h*.5);c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=.5;c.stroke();}
SET('bookshelf',c=>{cshadow(c,0,.05,2,.55);rvol(c,0,.05,0,2,.55,54,'#9a6a44',{r:.05,bz:1.5});const Y=.605;prr(c,.08,1.92,2,52,Y,.4,'#6a4228',OLC,.7);
 const shelves=[2,14.5,27,39.5];const cols=['#e85a6a','#5a8aff','#ffd84a','#3dbf6a','#9a6aff','#ff9a3a','#f4f4f4','#38c8c0'];
 shelves.forEach((z,si)=>{c.beginPath();c.moveTo(...IP(.08,Y,z+12));c.lineTo(...IP(1.92,Y,z+12));c.strokeStyle='#b8845a';c.lineWidth=1.4;c.stroke();let u=.14,i=si*3;
  while(u<1.86){const kind=(i*7+si)%9;if(kind==4&&u<1.7){bottle(c,...IP(u+.06,Y,z+.5),['#3dbf6a','#5ab8f0','#c84a5a'][i%3],7+(i%2)*2);u+=.15;}
   else if(kind==7&&u<1.6){plantI(c,...IP(u+.1,Y,z+3),'bush',.38);const [a,b]=IP(u+.1,Y,z+.5);c.beginPath();c.roundRect(a-2.2,b-3,4.4,3,1);c.fillStyle='#f4f4f4';c.fill();c.strokeStyle=OLC;c.lineWidth=.4;c.stroke();u+=.22;}
   else{const bw=.055+(i%3)*.012,bh=7+((i*5)%4),tilt=(i%11==5)?.12:0;const col=cols[(i*3)%8];c.save();const [a,b]=IP(u,Y,z+.5);c.translate(a,b);c.rotate(tilt);c.translate(-a,-b);prr(c,u,u+bw,z+.5,z+.5+bh,Y,.012,col,OLC,.4);c.restore();const [e,f]=IP(u+bw/2,Y,z+bh-1.5);c.fillStyle='rgba(255,255,255,.5)';c.fillRect(e-.5,f,1,.6);u+=bw+.01;}i++;}});
 c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=.6;c.beginPath();c.moveTo(...IP(.04,.62,1));c.lineTo(...IP(.04,.62,53));c.stroke();});
// ---------- TREES (town) ----------
treeBlob=function(c,x,y,r,col){c.save();const pts=[];for(let k=0;k<9;k++){const an=k/9*Math.PI*2;pts.push([x+Math.cos(an)*r,y+Math.sin(an)*r*.92]);}
 c.beginPath();pts.forEach((p,k)=>{const q=pts[(k+1)%9],mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,ox=(mx-x)*.28,oy=(my-y)*.28;if(!k)c.moveTo(...p);c.quadraticCurveTo(mx+ox,my+oy,q[0],q[1]);});c.closePath();c.fillStyle=shade(col,.82);c.fill();c.strokeStyle=OLC;c.lineWidth=1;c.stroke();c.clip();
 ell(c,x-r*.2,y-r*.25,r*.8,r*.7,col,null);ell(c,x-r*.38,y-r*.42,r*.38,r*.3,shade(col,1.22),null);[[.3,-.1],[-.1,.3],[.45,.35]].forEach(([dx,dy])=>{c.beginPath();c.arc(x+dx*r,y+dy*r,r*.18,Math.PI*.1,Math.PI*.9);c.strokeStyle=shade(col,.7);c.lineWidth=.7;c.stroke();});c.restore();};
