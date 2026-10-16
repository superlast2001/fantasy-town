'use strict';
// v0.0.1.4 ground floor: street entrance, round marble lobby, curved reception, lounge, elevator + stairs, manager office, staff room.
// Real curves: arcs are sampled densely in tile space and projected, cylinders use true ellipses.
const LB={};
function arcP(cx,cy,r,a0,a1,n=36){const p=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;p.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return p;}
// extruded arc band (rIn..rOut, a0..a1). face: which vertical face is toward the camera ('outer' convex, 'inner' concave)
function arcSolid(c,cx,cy,rIn,rOut,a0,a1,z0,h,col,o={}){const O=arcP(cx,cy,rOut,a0,a1),I=arcP(cx,cy,rIn,a0,a1),F=(o.face||'outer')=='outer'?O:I,P=(p,z)=>isoP(p[0],p[1],z);
 const top=o.top||shade(col,1.12),ol=o.ol===undefined?OLC:o.ol;
 [[a0,-1],[a1,1]].forEach(([a,sg])=>{const tx=-Math.sin(a)*sg,ty=Math.cos(a)*sg;if(tx+ty>0){const i=sg<0?0:O.length-1;poly(c,[P(O[i],z0),P(I[i],z0),P(I[i],z0+h),P(O[i],z0+h)],shade(col,.8),ol,.9);}});
 const pts=[...F.map(p=>P(p,z0)),...F.slice().reverse().map(p=>P(p,z0+h))];let xs=pts.map(p=>p[0]);const g=c.createLinearGradient(Math.min(...xs),0,Math.max(...xs),0);
 g.addColorStop(0,shade(col,o.lA||.98));g.addColorStop(.5,shade(col,.86));g.addColorStop(1,shade(col,o.lB||.7));poly(c,pts,g,ol,1);
 if(o.stripe)o.stripe.forEach(([s0,s1,sc])=>poly(c,[...F.map(p=>P(p,z0+s0)),...F.slice().reverse().map(p=>P(p,z0+s1))],sc,null));
 const tp=[...O.map(p=>P(p,z0+h)),...I.slice().reverse().map(p=>P(p,z0+h))];poly(c,tp,top,ol,1);
 if(o.gloss!==false){c.beginPath();F.forEach((p,i)=>{const q=P(p,z0+h-.4);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=.8;c.stroke();}}
// cylinder: front half shaded, elliptical top
function cyl(c,cx,cy,r,z0,h,col,top){const k=Math.SQRT2*r,[a,b]=isoP(cx,cy,z0),rx=TW/2*k,ry=TH/2*k;const g=c.createLinearGradient(a-rx,0,a+rx,0);g.addColorStop(0,shade(col,1.02));g.addColorStop(.45,shade(col,.9));g.addColorStop(1,shade(col,.68));
 c.beginPath();c.ellipse(a,b,rx,ry,0,0,Math.PI);c.lineTo(a-rx,b-h);c.ellipse(a,b-h,rx,ry,0,Math.PI,0,true);c.closePath();c.fillStyle=g;c.fill();c.strokeStyle=OLC;c.lineWidth=1;c.stroke();
 ell(c,a,b-h,rx,ry,top||shade(col,1.12),OLC,1);return[a,b-h,rx,ry];}
function plate(c,x,y,txt,bg,fg,fs=5){c.font=`bold ${fs}px sans-serif`;const w=c.measureText(txt).width+6;c.beginPath();c.roundRect(x-w/2,y-fs-1.5,w,fs+3,2);c.fillStyle=bg;c.fill();c.strokeStyle=OLC;c.lineWidth=.6;c.stroke();c.fillStyle=fg;c.textAlign='center';c.textBaseline='alphabetic';c.fillText(txt,x,y);c.textAlign='left';}
// text written along an iso face that runs along +x (the 'L' face)
function faceText(c,x,y,z,txt,col,fs,stroke){const [a,b]=isoP(x,y,z);c.save();c.translate(a,b);c.transform(1,.5,0,1,0,0);c.font=`bold ${fs}px Georgia,serif`;c.textAlign='center';c.textBaseline='middle';if(stroke){c.lineWidth=2;c.strokeStyle=stroke;c.strokeText(txt,0,0);}c.fillStyle=col;c.fillText(txt,0,0);c.restore();}
function potPlant(c,x,y,s=1,pot='#e8e2d8'){const [a,b]=isoP(x,y);shadowE(c,a,b+1,8*s,3.5*s);cyl(c,x,y,.24*s,0,9*s,pot);plantTop(c,x,y,9*s,1.1*s,'#3f9a4a');}
function curvedFloor(c,cx,cy,r,col){const P=arcP(cx,cy,r,0,Math.PI*2,72).map(p=>isoP(p[0],p[1]));poly(c,P,col,null);return P;}

// ---------- reception desk (curved, convex toward the lobby) ----------
F('frontdesk',{n:'Curved Reception Desk',zone:['lobby'],theme:'luxury',cost:0,comfort:0,w:4,d:2,h:46,fixed:1,tag:'FRONT DESK',light:[[2,.6,24,26,'#ffe2a0']]},c=>{
 const cx=2,cy=-1.45,A0=Math.PI*.3,A1=Math.PI*.7;
 const [s0,s1]=isoP(2,.8);shadowE(c,s0,s1+6,40,12);
 arcSolid(c,cx,cy,2.0,2.55,A0-.05,A1+.05,0,12,'#3a2c28',{face:'inner',gloss:false});// staff work counter behind
 [[1.3,.75],[2.7,.75]].forEach(([x,y])=>{const [a,b]=isoP(x,y,12);c.fillStyle='#1d1d26';c.fillRect(a-3.5,b-9,7,6);c.fillStyle='#58b8ff';c.fillRect(a-3,b-8.5,6,5);});
 arcSolid(c,cx,cy,2.55,3.2,A0,A1,0,17,'#8a5a3c',{stripe:[[2,3.2,'#e8b830'],[7,8,'rgba(255,255,255,.18)'],[13,14,'#e8b830']],top:'#f3efe8'});
 arcSolid(c,cx,cy,3.05,3.3,A0+.04,A1-.04,17,5,'#f6f2ec',{top:'#ffffff',lA:1.02,lB:.84});// marble transaction ledge
 const [a,b]=isoP(2,1.85,10);plate(c,a,b,'RECEPTION','#2a2238','#ffd86a',4.6);
 const [e,f]=isoP(1.05,1.25,22);ell(c,e,f-1,2.2,1,'#d8d8e0',OLC,.5);ell(c,e,f-2.4,1,.6,'#e8b830',OLC,.4);// bell
 const [g,h]=isoP(3.0,1.15,22);cyl(c,3.0,1.15,.1,22,6,'#bfe0ff');ell(c,g,h-9,2.4,2.4,'#ff8ab0',OLC,.5);ell(c,g+2,h-10.5,1.8,1.8,'#ffd84a',OLC,.5);ell(c,g-2,h-10,1.6,1.6,'#ffffff',OLC,.5);
 const [m,n]=isoP(2.1,1.3,22);poly(c,[[m-4,n],[m+2,n+2],[m+5,n+.5],[m-1,n-1.5]],'#ffffff',OLC,.4);});
// ---------- round fountain (centre feature) ----------
F('fountain_lobby',{n:'Marble Fountain',zone:['lobby'],theme:'luxury',cost:0,comfort:3,w:2,d:2,h:50,fixed:1,tag:'FOUNTAIN'},(c,v)=>{
 const [a,b]=isoP(1,1);shadowE(c,a,b+2,34,13);cyl(c,1,1,.98,0,8,'#ece6de','#f8f4ee');
 const k=Math.SQRT2*.84,rx=TW/2*k,ry=TH/2*k,[w0,w1]=isoP(1,1,7.2);const wg=c.createRadialGradient(w0-6,w1-2,1,w0,w1,rx);wg.addColorStop(0,'#c8f0ff');wg.addColorStop(1,'#3aa0e0');ell(c,w0,w1,rx,ry,wg,OLC,.8);
 [.35,.6,.85].forEach(q=>ell(c,w0,w1,rx*q,ry*q,null,'rgba(255,255,255,.55)',.6));
 cyl(c,1,1,.2,7,14,'#e4ddd2');const [p,q]=cyl(c,1,1,.5,21,2.5,'#ece6de','#7ac8f0');cyl(c,1,1,.09,23.5,7,'#e4ddd2');const [t0,t1]=isoP(1,1,31);ell(c,t0,t1,2.2,2.2,'#e8b830',OLC,.6);
 c.strokeStyle='rgba(200,240,255,.85)';c.lineWidth=1.2;for(let i=0;i<8;i++){const an=i/8*Math.PI*2,ex=Math.cos(an),ey=Math.sin(an);c.beginPath();c.moveTo(p+ex*rx*.55,q+ey*ry*.55);c.quadraticCurveTo(p+ex*rx*.8,q+ey*ry*.6-3,p+ex*rx*.72,w1+ey*ry*.72-1);c.stroke();}
 c.strokeStyle='rgba(220,248,255,.9)';c.beginPath();c.moveTo(t0,t1-1);c.quadraticCurveTo(t0-5,t1-8,t0-7,q-1);c.moveTo(t0,t1-1);c.quadraticCurveTo(t0+5,t1-8,t0+7,q-1);c.stroke();
 [[-9,3],[10,2],[-3,6],[6,-2]].forEach(([dx,dy])=>ell(c,w0+dx,w1+dy,.8,.5,'#ffffff',null));});
// ---------- chandelier (hangs above the fountain) ----------
F('chandelier',{n:'Crystal Chandelier',zone:['lobby','living'],theme:'luxury',cost:220,comfort:4,w:2,d:2,h:96,air:1,light:[[1,1,62,70,'#ffe6a0']]},c=>{
 const [a,b]=isoP(1,1,62);c.strokeStyle='#8a7040';c.lineWidth=1;c.beginPath();c.moveTo(a,b-30);c.lineTo(a,b-4);c.stroke();
 const k=Math.SQRT2*.62,rx=TW/2*k,ry=TH/2*k;ell(c,a,b,rx,ry,null,'#e8b830',2);ell(c,a,b+5,rx*.6,ry*.6,null,'#e8b830',1.6);
 for(let i=0;i<10;i++){const an=i/10*Math.PI*2,x=a+Math.cos(an)*rx,y=b+Math.sin(an)*ry;c.strokeStyle='rgba(220,240,255,.9)';c.lineWidth=.6;c.beginPath();c.moveTo(x,y);c.lineTo(x,y+5);c.stroke();ell(c,x,y+6,.9,1.4,'#e8f6ff','#9ab8d8',.4);
  if(i%2==0){c.fillStyle='#fff8e0';c.fillRect(x-.8,y-5,1.6,4.5);const g=c.createRadialGradient(x,y-6,0,x,y-6,5);g.addColorStop(0,'rgba(255,240,180,.95)');g.addColorStop(1,'rgba(255,240,180,0)');c.fillStyle=g;c.fillRect(x-5,y-11,10,10);}}
 c.strokeStyle='#e8b830';c.lineWidth=1;c.beginPath();c.moveTo(a-rx,b);c.quadraticCurveTo(a,b-14,a+rx,b);c.stroke();ell(c,a,b+9,1.6,2.6,'#e8f6ff','#9ab8d8',.5);});
// ---------- pendant light ----------
F('pendant',{n:'Brass Pendant Light',zone:['any'],theme:'luxury',cost:40,comfort:1,h:96,air:1,light:[[.5,.5,46,44,'#ffd88a']]},c=>{
 const [a,b]=isoP(.5,.5,52);c.strokeStyle='#4a3a30';c.lineWidth=.8;c.beginPath();c.moveTo(a,b-40);c.lineTo(a,b-6);c.stroke();
 c.beginPath();c.moveTo(a-7,b);c.bezierCurveTo(a-7,b-8,a+7,b-8,a+7,b);c.closePath();const g=c.createLinearGradient(a-7,0,a+7,0);g.addColorStop(0,'#f2cf6a');g.addColorStop(1,'#a87a20');c.fillStyle=g;c.fill();c.strokeStyle=OLC;c.lineWidth=.8;c.stroke();
 ell(c,a,b,7,2.2,'#fff4c8',OLC,.6);const r=c.createRadialGradient(a,b+3,0,a,b+3,9);r.addColorStop(0,'rgba(255,240,190,.8)');r.addColorStop(1,'rgba(255,240,190,0)');c.fillStyle=r;c.fillRect(a-9,b-6,18,18);});
// ---------- curved lounge sofa (concave, wraps the coffee table) ----------
F('sofa_curve',{n:'Curved Lounge Sofa',zone:['lobby','living'],theme:'luxury',cost:180,comfort:6,w:4,d:2,h:34,kit:'sofa'},c=>{
 const cx=2,cy=3.25,A0=-Math.PI*.82,A1=-Math.PI*.18;const [s0,s1]=isoP(2,1);shadowE(c,s0,s1+2,40,10);
 arcSolid(c,cx,cy,2.0,3.05,A0,A1,0,2.5,'#3a2a2a',{face:'inner',gloss:false});
 arcSolid(c,cx,cy,2.72,3.05,A0,A1,2.5,17,'#2f6f74',{face:'inner',top:'#4a9aa0'});
 arcSolid(c,cx,cy,2.0,2.72,A0+.02,A1-.02,2.5,7,'#2f6f74',{face:'inner',top:'#5aaab0'});
 for(let i=1;i<4;i++){const an=A0+(A1-A0)*i/4;const p=[cx+2.36*Math.cos(an),cy+2.36*Math.sin(an)],q=[cx+2.72*Math.cos(an),cy+2.72*Math.sin(an)];c.strokeStyle='rgba(20,40,50,.45)';c.lineWidth=.8;c.beginPath();c.moveTo(...isoP(p[0]+(cx-p[0])*.15,p[1]+(cy-p[1])*.15,9.5));c.lineTo(...isoP(q[0],q[1],9.5));c.stroke();}
 [[.22,'#e8b830'],[.5,'#ffffff'],[.78,'#ff9a8a']].forEach(([t,col])=>{const an=A0+(A1-A0)*t;pillow(c,cx+2.55*Math.cos(an),cy+2.55*Math.sin(an),10,col,3.4);});});
FURN.sofa_curve.back=null;
// ---------- round coffee table with magazines ----------
F('table_round',{n:'Round Marble Coffee Table',zone:['lobby','living'],theme:'luxury',cost:60,comfort:2,w:2,d:2,h:20,kit:'table'},c=>{
 const [a,b]=isoP(1,1);shadowE(c,a,b+1,20,8);cyl(c,1,1,.16,0,9,'#c8a030');cyl(c,1,1,.5,0,1,'#c8a030');const [t0,t1]=cyl(c,1,1,.72,9,2,'#ece6de','#faf7f2');
 const mag=(x,y,r,w,h,col)=>{const P=[[-w,-h],[w,-h],[w,h],[-w,h]].map(([u,v])=>{const X=x+u*Math.cos(r)-v*Math.sin(r),Y=y+u*Math.sin(r)+v*Math.cos(r);return isoP(X,Y,11.2);});poly(c,P,col,OLC,.5);};
 mag(.75,.85,.3,.22,.16,'#ff6a8a');mag(.8,.9,.9,.2,.15,'#5a8aff');mag(1.3,1.15,-.2,.2,.15,'#ffd84a');
 const [v0,v1]=isoP(1.2,.7,11);cyl(c,1.2,.7,.08,11,5,'#bfe0ff');ell(c,v0,v1-8,2.2,2.2,'#ff8ab0',OLC,.4);ell(c,v0+2,v1-9,1.6,1.6,'#ffffff',OLC,.4);});
// ---------- elevator (back-wall item, 2 tiles) ----------
F('elevator',{n:'Elevator',zone:['lobby'],theme:'modern',cost:0,comfort:0,w:2,h:66,wall:1,fixed:1,tag:'ELEVATOR',light:[[1,.2,52,16,'#9ae0ff']]},(c,v)=>{
 wq(c,0,-.08,2.08,0,52,'#b8bcc8');wq(c,0,.12,1.88,0,44,'#2a2a34');
 const dg=(u0,u1)=>{wq(c,0,u0,u1,.5,43.5,'#d8dde6',OLC,.6);wq(c,0,u0+.06,u0+.25,4,40,'rgba(255,255,255,.35)',null);};dg(.16,.99);dg(1.01,1.84);
 wq(c,0,.4,1.6,46,51,'#1a1a24');const [a,b]=isoP(1,.06,48.5);c.fillStyle='#ff9a3a';c.font='bold 4px sans-serif';c.textAlign='center';c.fillText('▲ G',a,b+1.5);c.textAlign='left';
 wq(c,0,1.93,2.03,22,30,'#9aa0ac');const [e,f]=isoP(1.98,.06,27);ell(c,e,f,.9,.9,'#9ae0ff',OLC,.3);const [g,h]=isoP(1.98,.06,24.5);ell(c,g,h,.9,.9,'#ffffff',OLC,.3);
 faceText(c,1,.06,57,'ELEVATOR','#4a4a5a',4.5);});
// ---------- stairs up to the tenant floors ----------
F('stairs',{n:'Grand Staircase',zone:['lobby'],theme:'luxury',cost:0,comfort:0,w:4,d:3,h:70,fixed:1,tag:'STAIRS'},c=>{
 wq(c,0,.25,3.75,46,62,'#2a2238',null);const og=c.createLinearGradient(0,isoP(2,0,62)[1],0,isoP(2,0,46)[1]);og.addColorStop(0,'#1a1428');og.addColorStop(1,'#5a4a6a');wq(c,0,.3,3.7,46,61,og,null);
 const n=6;for(let i=n-1;i>=0;i--){const y0=3-.5*(i+1),hz=(i+1)*8;box(c,.3,y0,0,3.4,.5,hz,'#ece6de',{top:'#f8f4ee',r:.6});poly(c,[isoP(1.45,y0,hz),isoP(2.55,y0,hz),isoP(2.55,y0+.5,hz),isoP(1.45,y0+.5,hz)],'#b8323f',null);poly(c,[isoP(1.45,y0+.5,hz),isoP(2.55,y0+.5,hz),isoP(2.55,y0+.5,hz-2.2),isoP(1.45,y0+.5,hz-2.2)],'#8a2230',null);}
 const rail=(x,a)=>{c.globalAlpha=a;poly(c,[isoP(x,3,0),isoP(x,3,16),isoP(x,0,62),isoP(x,0,48)],'rgba(190,230,255,.35)','rgba(120,160,190,.8)',.6);c.globalAlpha=1;c.strokeStyle='#c8a030';c.lineWidth=1.6;c.beginPath();c.moveTo(...isoP(x,3.05,16));c.lineTo(...isoP(x,0,62));c.stroke();};rail(3.72,1);
 const [a,b]=isoP(3.9,2.9,0);cyl(c,3.85,2.9,.1,0,18,'#c8a030');faceText(c,2,.02,64,'↑ TENANT FLOORS','#ffd86a',4.2,'#2a2238');});
// ---------- wall items ----------
F('mailboxes',{n:'Brass Mailboxes',zone:['lobby'],theme:'luxury',cost:30,comfort:1,wall:1,h:56},(c,v)=>{wq(c,v,.04,.96,16,48,'#8a6a3a');for(let r=0;r<4;r++)for(let k=0;k<3;k++){const u0=.08+k*.29,z0=18+r*7.5;wq(c,v,u0,u0+.26,z0,z0+6.6,'#e8c060',OLC,.5);wq(c,v,u0+.03,u0+.23,z0+4.4,z0+5.2,'#4a3a2a',null);const [a,b]=v?isoP(.06,u0+.2,z0+2):isoP(u0+.2,.06,z0+2);ell(c,a,b,.6,.6,'#4a3a2a',null);}});
F('seccam',{n:'Security Camera',zone:['any'],theme:'modern',cost:25,comfort:0,wall:1,h:66,light:[[.5,.4,56,8,'#ff3a3a']]},(c,v)=>{wq(c,v,.4,.6,56,60,'#e8e8f0');const [a,b]=v?isoP(.3,.5,56):isoP(.5,.3,56);c.save();c.translate(a,b);c.rotate(v?-.35:.35);c.beginPath();c.roundRect(-5,-3,10,5,2);c.fillStyle='#f4f4f8';c.fill();c.strokeStyle=OLC;c.lineWidth=.7;c.stroke();ell(c,v?-5:5,-.5,1.6,1.8,'#2a2a34',OLC,.5);ell(c,v?3:-3,-1.5,.8,.8,'#ff3a3a',null);c.restore();});
F('certificate',{n:'Framed Certificate',zone:['any'],theme:'luxury',cost:20,comfort:1,wall:1,h:56},(c,v)=>{wq(c,v,.18,.82,30,46,'#c8a030');wq(c,v,.22,.78,31.5,44.5,'#fff8e8',null);[42,39.5,37,34.5].forEach((z,i)=>wq(c,v,.3,i?.66:.7,z,z+.8,i?'#8a8aa0':'#2a2238',null));const [a,b]=v?isoP(.06,.66,33.5):isoP(.66,.06,33.5);ell(c,a,b,2,2,'#d8323f',OLC,.4);poly(c,[[a-1,b+1],[a-2,b+5],[a,b+3.5],[a+1.8,b+5],[a+1,b+1]],'#d8323f',null);});
// ---------- office furniture ----------
F('execdesk',{n:'Executive Desk',zone:['office','bedroom','living'],theme:'wood',cost:120,comfort:3,w:3,h:44,kit:'desk',tag:'COMPUTER',light:[[2.4,.5,24,20,'#7ac8ff']]},c=>{
 box(c,.05,.12,0,.85,.8,13,'#6a3e24');box(c,2.1,.12,0,.85,.8,13,'#6a3e24');box(c,.9,.2,1.5,1.2,.12,11,'#5a3420');
 [[.05,2],[.05,6.5],[2.1,2],[2.1,6.5]].forEach(([x,z])=>{faceQ(c,x,.12,0,.85,.8,'L',.08,.77,z,z+3.8,'#7a4a2c');faceQ(c,x,.12,0,.85,.8,'L',.36,.5,z+1.7,z+2.3,'#e8b830',null);});
 box(c,-.05,.05,13,3.1,.95,2.4,'#8a5232',{top:'#9a5e3a'});faceQ(c,-.05,.05,13,3.1,.95,'L',1.1,1.9,.4,2,'#e8b830',null);
 box(c,2.15,.25,15.4,.42,.42,.8,'#2a2a34');box(c,2.33,.38,16.2,.08,.12,4,'#2a2a34');box(c,2.36,.08,19,.12,.86,9.5,'#1a1a24',{r:.4});screen(c,2.36,.08,19,.12,.86,'R',.06,.8,1,9,'#5ab8ff');
 const [k0,k1]=isoP(1.6,.6,15.4);poly(c,[[k0-5,k1],[k0+1,k1+3],[k0+5,k1+1],[k0-1,k1-2]],'#e8e8f0',OLC,.5);
 const [l0,l1]=isoP(.35,.35,15.4);c.strokeStyle='#2a2a34';c.lineWidth=1;c.beginPath();c.moveTo(l0,l1);c.lineTo(l0+1,l1-9);c.lineTo(l0+5,l1-12);c.stroke();shadeLamp(c,.62,.18,25,'#3dbf6a',3);
 const [p0,p1]=isoP(1.1,.4,15.4);poly(c,[[p0-3,p1],[p0+2,p1+2.4],[p0+5,p1+.8],[p0,p1-1.6]],'#ffffff',OLC,.4);poly(c,[[p0-2,p1-1],[p0+3,p1+1.4],[p0+6,p1-.2],[p0+1,p1-2.6]],'#fffbe0',OLC,.4);
 const [n0,n1]=isoP(1.5,1.0,10);plate(c,n0,n1,'MANAGER','#2a2238','#ffd86a',3.6);});
F('officechair',{n:'Leather Office Chair',zone:['office','bedroom','living'],theme:'modern',cost:50,comfort:3,h:36},c=>{
 const [a,b]=isoP(.5,.55);shadowE(c,a,b,8,3.5);c.strokeStyle='#2a2a34';c.lineWidth=1.4;for(let i=0;i<5;i++){const an=i/5*Math.PI*2+.3;c.beginPath();c.moveTo(a,b-1.5);c.lineTo(a+Math.cos(an)*7,b+Math.sin(an)*3.5);c.stroke();ell(c,a+Math.cos(an)*7,b+Math.sin(an)*3.5,1,.7,'#1a1a24',null);}
 box(c,.45,.5,1.5,.1,.1,7,'#888',{hl:false});box(c,.15,.12,9,.7,.22,20,'#2a2a34',{r:1.5});cush(c,.15,.25,8.5,.7,.62,3,'#2f2f3c');box(c,.12,.3,11.5,.08,.5,4.5,'#2a2a34');box(c,.8,.3,11.5,.08,.5,4.5,'#2a2a34');});
F('doormat',{n:'Welcome Mat',zone:['lobby','living'],theme:'wood',cost:10,comfort:1,w:3,h:4,flat:1},c=>{poly(c,[isoP(.1,.12,0),isoP(2.9,.12,0),isoP(2.9,.88,0),isoP(.1,.88,0)],'#5a3a2a',OLC,.8);poly(c,[isoP(.25,.25,.1),isoP(2.75,.25,.1),isoP(2.75,.75,.1),isoP(.25,.75,.1)],'#8a5a3a',null);faceText(c,1.5,.52,.4,'WELCOME','#ffd86a',5);});
// ---------- door frames for interior doors ----------
OBJ.doorway={w:1,d:1,h:46,draw(c,v){const vert=v%10==1,lab=['','OFFICE','STAFF ONLY'][Math.floor(v/10)]||'',fc='#f4f0ea';
 if(vert){box(c,.33,0,0,.34,.1,32,fc,{r:0});box(c,.33,.9,0,.34,.1,32,fc,{r:0});box(c,.33,0,30,.34,1,5,fc,{r:0});poly(c,[isoP(.5,.1,0),isoP(.5,.9,0),isoP(.95,.95,0),isoP(.95,.15,0)],'rgba(0,0,0,.08)',null);if(lab){const [a,b]=isoP(.67,.5,36);plate(c,a,b-1,lab,'#2a2238','#ffd86a',3.8);}}
 else{box(c,0,.33,0,.1,.34,32,fc,{r:0});box(c,.9,.33,0,.1,.34,32,fc,{r:0});box(c,0,.33,30,1,.34,5,fc,{r:0});if(lab){const [a,b]=isoP(.5,.67,36);plate(c,a,b-1,lab,'#2a2238','#ffd86a',3.8);}}}};
// ---------- street entrance: glass storefront, double doors, canopy, sign, planters (static, 26 wide) ----------
OBJ.entrance={w:26,d:4,h:96,draw(c){const Y=1,P=(x,z,y=Y)=>isoP(x,y,z),DX0=11,DX1=14;
 // potted plants on the street side
 [[9.6,2.05],[15.4,2.05],[4,1.7],[21.5,1.7]].forEach(([x,y],i)=>potPlant(c,x,y,i<2?1.25:1,i<2?'#2a3a5a':'#e8e2d8'));
 // glass storefront with mullions
 const glass=(x0,x1)=>{const g=c.createLinearGradient(0,P(x0,50)[1],0,P(x0,0)[1]);g.addColorStop(0,'rgba(200,235,255,.22)');g.addColorStop(1,'rgba(160,210,240,.12)');poly(c,[P(x0,3),P(x1,3),P(x1,50),P(x0,50)],g,null);
  for(let x=x0;x<x1;x+=2.2){poly(c,[P(x+.3,10),P(x+.7,10),P(x+1.3,40),P(x+.9,40)],'rgba(255,255,255,.16)',null);}};
 glass(0,DX0-.35);glass(DX1+.35,26);poly(c,[P(0,0),P(DX0-.35,0),P(DX0-.35,3),P(0,3)],'#b8ac9c',OLC,.6);poly(c,[P(DX1+.35,0),P(26,0),P(26,3),P(DX1+.35,3)],'#b8ac9c',OLC,.6);
 for(let x=0;x<=26.01;x+=2){if(x>DX0-1&&x<DX1+1)continue;poly(c,[P(x-.05,3),P(x+.05,3),P(x+.05,50),P(x-.05,50)],'#4a4a5a',null);}
 poly(c,[P(0,50),P(26,50),P(26,53),P(0,53)],'#4a4a5a',OLC,.6);
 // stone portal + glass double doors
 box(c,DX0-.45,Y-.15,0,.45,.4,58,'#d8cab4',{top:'#efe4d2'});box(c,DX1,Y-.15,0,.45,.4,58,'#d8cab4',{top:'#efe4d2'});
 const leaf=(u0,u1,hx)=>{poly(c,[P(u0,0),P(u1,0),P(u1,46),P(u0,46)],'#3a3040',OLC,.8);const g=c.createLinearGradient(...P(u0,40),...P(u1,6));g.addColorStop(0,'rgba(210,240,255,.45)');g.addColorStop(1,'rgba(150,200,235,.25)');poly(c,[P(u0+.08,1.5),P(u1-.08,1.5),P(u1-.08,44.5),P(u0+.08,44.5)],g,null);
  poly(c,[P(u0+.25,12),P(u0+.5,12),P(u0+.95,38),P(u0+.7,38)],'rgba(255,255,255,.3)',null);poly(c,[P(hx-.04,16),P(hx+.04,16),P(hx+.04,30),P(hx-.04,30)],'#e8b830',OLC,.4);};
 leaf(DX0,12.5,12.3);leaf(12.5,DX1,12.7);poly(c,[P(DX0,46),P(DX1,46),P(DX1,50),P(DX0,50)],'#3a3040',OLC,.6);
 // canopy with building-name sign
 [DX0-.2,DX1+.2].forEach(x=>{c.strokeStyle='#2a2a34';c.lineWidth=1;c.beginPath();c.moveTo(...isoP(x,Y+1.6,51));c.lineTo(...isoP(x,Y,70));c.stroke();});
 const cp=[isoP(DX0-.7,Y,52),isoP(DX1+.7,Y,52),isoP(DX1+.7,Y+1.8,52),isoP(DX0-.7,Y+1.8,52)];poly(c,cp,'#2a3a5a',OLC,1);
 poly(c,[isoP(DX0-.7,Y+1.8,52),isoP(DX1+.7,Y+1.8,52),isoP(DX1+.7,Y+1.8,46),isoP(DX0-.7,Y+1.8,46)],'#1f2c48',OLC,1);poly(c,[isoP(DX1+.7,Y,52),isoP(DX1+.7,Y+1.8,52),isoP(DX1+.7,Y+1.8,46),isoP(DX1+.7,Y,46)],'#18223a',OLC,1);
 for(let i=0;i<5;i++){const x=DX0-.3+i*(DX1-DX0+.6)/4;const [a,b]=isoP(x,Y+1.75,46);const g=c.createRadialGradient(a,b+4,0,a,b+4,10);g.addColorStop(0,'rgba(255,230,160,.7)');g.addColorStop(1,'rgba(255,230,160,0)');c.fillStyle=g;c.fillRect(a-10,b-4,20,18);ell(c,a,b+.5,1.4,.6,'#fff4c8',null);}
 faceText(c,12.5,Y+1.8,49,'LUMEN RESIDENCES','#ffd86a',5.2);
 // big building sign above the entrance
 poly(c,[P(DX0-.2,56),P(DX1+.2,56),P(DX1+.2,66),P(DX0-.2,66)],'#f6f0e4',OLC,1);faceText(c,12.5,Y,61,'LUMEN','#2a3a5a',7.5);
 faceText(c,12.5,Y,57.6,'· RESIDENCES · EST. 2026 ·','#c8a030',2.6);}};
// office/lobby zone permissions for existing pieces
['desk','bookshelf','shelf_modern','floorlamp','plant_monstera','plant_palm','plant_fiddle','rug_lux','rug_modern','filecab','watercooler','fire_ext','waitchairs','ficus_lobby','armchair_beach','sofa_lux'].forEach(k=>{const z=FURN[k].zone;if(!z.includes('office'))z.push('office');});
['bookshelf','floorlamp','sofa_lux','armchair_beach'].forEach(k=>{if(!FURN[k].zone.includes('lobby'))FURN[k].zone.push('lobby');});
Object.keys(FURN).forEach(k=>{if(!FURN[k].fixed&&!FURNLIST.includes(k))FURNLIST.push(k);});
ZONES.office='Office';
// floor art: street sidewalk, round marble inlay with compass star, soft wall shadows
function lobbyFloor(g,a,L){const P=(x,y,z=0)=>isoP(x,y,z);
 if(L.street){const R=a.rows;poly(g,[P(-.5,R),P(a.cols,R),P(a.cols,R+2.6),P(-.5,R+2.6)],'#d9d3c8',null);
  for(let x=0;x<a.cols;x+=1.3)poly(g,[P(x,R),P(x+.04,R),P(x+.04,R+2.6),P(x,R+2.6)],'rgba(120,110,100,.25)',null);[R+1.3].forEach(y=>poly(g,[P(-.5,y),P(a.cols,y),P(a.cols,y+.04),P(-.5,y+.04)],'rgba(120,110,100,.25)',null));
  poly(g,[P(-.5,R+2.6),P(a.cols,R+2.6),P(a.cols,R+2.6,-4),P(-.5,R+2.6,-4)],'#a8a098',null);poly(g,[P(-.5,R+2.6,-4),P(a.cols,R+2.6,-4),P(a.cols,R+4,-4),P(-.5,R+4,-4)],'#6a6a80',null);
  for(let x=1;x<a.cols;x+=3)poly(g,[P(x,R+3.3,-4),P(x+1.4,R+3.3,-4),P(x+1.4,R+3.4,-4),P(x,R+3.4,-4)],'#f4f4f4',null);
  poly(g,[P(10.6,R),P(14.4,R),P(14.4,R+2.6),P(10.6,R+2.6)],'#7a2a3a',null);poly(g,[P(10.8,R),P(14.2,R),P(14.2,R+2.5),P(10.8,R+2.5)],'#9a3442',null);}
 // soft ambient occlusion along back walls
 const sh=(p0,p1,p2,p3)=>{const gr=g.createLinearGradient(...p0,...p3);gr.addColorStop(0,'rgba(40,20,40,.16)');gr.addColorStop(1,'rgba(40,20,40,0)');poly(g,[p0,p1,p2,p3],gr,null);};
 sh(P(0,0),P(a.cols,0),P(a.cols,.9),P(0,.9));sh(P(0,0),P(0,a.rows),P(.9,a.rows),P(.9,0));
 if(L.circle){const [cx,cy,r]=L.circle;g.save();
  const out=arcP(cx,cy,r+.25,0,Math.PI*2,90).map(p=>P(...p));poly(g,out,'#3a2c3a',null);
  const pts=arcP(cx,cy,r,0,Math.PI*2,90).map(p=>P(...p));g.beginPath();pts.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();
  const [mx,my]=P(cx,cy);const mg=g.createRadialGradient(mx-30,my-15,10,mx,my,r*24);mg.addColorStop(0,'#ffffff');mg.addColorStop(1,'#e6e0d8');g.fillStyle=mg;g.fill();g.save();g.clip();
  const rr=rng(77);for(let i=0;i<26;i++){const x=cx-r+rr()*2*r,y=cy-r+rr()*2*r;const [a0,b0]=P(x,y);g.beginPath();g.moveTo(a0,b0);g.bezierCurveTo(a0+10+rr()*20,b0-6+rr()*12,a0+20+rr()*30,b0-8+rr()*16,a0+40+rr()*30,b0-4+rr()*8);g.strokeStyle=`rgba(150,140,160,${.12+rr()*.18})`;g.lineWidth=.5+rr()*.8;g.stroke();}
  g.restore();
  [[r-.35,'#c8a030',1.6],[r-.55,'#2a3a5a',.8],[2.2,'#c8a030',1.2],[1.6,'#2a3a5a',.7]].forEach(([q,col,lw])=>{poly(g,arcP(cx,cy,q,0,Math.PI*2,80).map(p=>P(...p)),null,col,lw);});
  for(let i=0;i<8;i++){const an=i/8*Math.PI*2-Math.PI/4,len=i%2?2.6:3.9,w=.32;const tip=[cx+Math.cos(an)*len,cy+Math.sin(an)*len],l=[cx+Math.cos(an+Math.PI/2)*w+Math.cos(an)*1.7,cy+Math.sin(an+Math.PI/2)*w+Math.sin(an)*1.7],rt=[cx+Math.cos(an-Math.PI/2)*w+Math.cos(an)*1.7,cy+Math.sin(an-Math.PI/2)*w+Math.sin(an)*1.7];
   poly(g,[P(...tip),P(...l),P(cx+Math.cos(an)*1.55,cy+Math.sin(an)*1.55)],i%2?'#9aa6c0':'#2a3a5a',null);poly(g,[P(...tip),P(...rt),P(cx+Math.cos(an)*1.55,cy+Math.sin(an)*1.55)],i%2?'#c8d0e0':'#c8a030',null);}
  g.restore();}
 // light pools from pendants / chandelier
 a.objs.forEach(o=>{const F=FURN[o.k];if(!F||!F.air)return;const [x,y]=P(o.x+o.w/2,o.y+o.d/2);const gr=g.createRadialGradient(x,y,0,x,y,o.w*26);gr.addColorStop(0,'rgba(255,230,170,.32)');gr.addColorStop(1,'rgba(255,230,170,0)');g.fillStyle=gr;g.beginPath();g.ellipse(x,y,o.w*26,o.w*13,0,0,7);g.fill();});}
window.lobbyFloor=lobbyFloor;
