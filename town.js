'use strict';
// v0.0.0.8 small-town buildings + furniture economy/themes
function shopFront(c,w,d,h,wall,roofCol,awn,txt,signCol,winCol='#ffe6a0'){box(c,0,0,0,w,d,h,wall);
 faceQ(c,0,0,0,w,d,'L',w/2-.45,w/2+.45,0,15,'#7a4a2a');faceQ(c,0,0,0,w,d,'L',w/2-.4,w/2+.4,1,14,'#bfe8ff',null);
 for(let u=.3;u<w/2-.6;u+=.9)faceQ(c,0,0,0,w,d,'L',u,u+.6,6,17,winCol);for(let u=w/2+.7;u<w-.3;u+=.9)faceQ(c,0,0,0,w,d,'L',u,u+.6,6,17,winCol);
 for(let u=.4;u<d-.3;u+=1)faceQ(c,0,0,0,w,d,'R',u,u+.55,8,17,winCol);
 const P=(x,y,z)=>isoP(x,y,z),n=Math.round(w*2);for(let i=0;i<n;i++){const x0=i*w/n,x1=(i+1)*w/n;poly(c,[P(x0,d,21),P(x1,d,21),P(x1,d+.5,17),P(x0,d+.5,17)],i%2?'#ffffff':awn,OLC,.6);}
 roof(c,0,0,h,w,d,10,roofCol);sign3(c,P(w/2,d,h+18),txt,signCol);}
Object.assign(OBJ,{
 cafe:{w:4,d:3,h:62,draw(c){shopFront(c,4,3,26,'#ffd88a','#ff7a3a','#ff9a3a','CAFE','#ffb46a');},light:[[2,3.4,12,60,'#ffb46a']]},
 restaurant:{w:5,d:3,h:66,draw(c){shopFront(c,5,3,28,'#ff9a9a','#e8323f','#e8404a','RESTAURANT','#ff6a6a');},light:[[2.5,3.4,12,70,'#ff6a6a']]},
 fshop:{w:5,d:3,h:66,draw(c){shopFront(c,5,3,28,'#9ad8ff','#2a7ae8','#38a0ff','FURNITURE','#6ad0ff');box(c,.3,3.3,0,.8,.6,8,'#e85a6a');box(c,3.9,3.3,0,.8,.6,10,'#c8945a');},light:[[2.5,3.4,12,70,'#6ad0ff']]},
 studio:{w:4,d:3,h:70,draw(c){shopFront(c,4,3,34,'#c8a8ff','#7a4ae8','#9a7aff','STUDIO','#b49aff','#d8f0ff');},light:[[2,3.4,12,60,'#b49aff']]},
 bench:{w:2,d:1,h:16,draw(c){[[.2,.3],[1.8,.3],[.2,.8],[1.8,.8]].forEach(([a,b])=>box(c,a-.06,b-.06,0,.12,.12,5,'#555',{hl:false}));box(c,0,.2,5,2,.7,1.5,'#c8945a');box(c,0,.15,6.5,2,.15,6,'#b07a48');}},
 parasol:{w:1,d:1,h:34,draw(c,v){box(c,.15,.15,0,.7,.7,0,'#000',{ol:null});const [x,y]=P0(.5,.5);shadowE(c,x,y,9,4.5);box(c,.25,.25,0,.5,.5,8,'#f4f4f4');poly(c,[[x-.6,y-8],[x+.6,y-8],[x+.6,y-26],[x-.6,y-26]],'#888');
  const col=['#ff6a6a','#38a0ff','#ffb43a'][v%3];c.beginPath();c.moveTo(x-14,y-22);c.quadraticCurveTo(x,y-36,x+14,y-22);c.closePath();c.fillStyle=col;c.fill();c.strokeStyle=OLC;c.stroke();c.beginPath();c.moveTo(x,y-29);c.lineTo(x-5,y-22.5);c.moveTo(x,y-29);c.lineTo(x+5,y-22.5);c.strokeStyle='rgba(255,255,255,.7)';c.stroke();}},
 hedge:{w:1,d:1,h:14,draw(c){box(c,.05,.05,0,.9,.9,9,'#3d9a4a',{top:'#5cbf5a'});}},
});
// v0.0.1.6 NIGHT CLUB (neon sign, black double door, red carpet) + velvet rope line, and the town GYM
function neonText(c,[x,y],txt,col,fs){c.save();c.font=`bold ${fs}px sans-serif`;c.textAlign='center';c.shadowColor=col;c.shadowBlur=8;c.lineWidth=2.4;c.strokeStyle=col;c.strokeText(txt,x,y);c.shadowBlur=3;c.fillStyle='#ffffff';c.fillText(txt,x,y);c.restore();}
Object.assign(OBJ,{
 club:{w:5,d:3,h:96,draw(c){const P=(x,y,z)=>isoP(x,y,z);box(c,0,0,0,5,3,30,'#2a1a3a',{top:'#3a2650'});
  faceQ(c,0,0,0,5,3,'L',1.7,3.3,0,22,'#140c1c');faceQ(c,0,0,0,5,3,'L',1.78,2.48,1,21,'#1e1428');faceQ(c,0,0,0,5,3,'L',2.52,3.22,1,21,'#1e1428');faceQ(c,0,0,0,5,3,'L',2.36,2.44,8,13,'#e8b830',null);faceQ(c,0,0,0,5,3,'L',2.56,2.64,8,13,'#e8b830',null);
  faceQ(c,0,0,0,5,3,'L',1.6,3.4,22,24,'#ff4fd8',null);for(let u=.3;u<1.5;u+=.6)faceQ(c,0,0,0,5,3,'L',u,u+.4,10,22,'#5a2a8a');for(let u=3.6;u<4.8;u+=.6)faceQ(c,0,0,0,5,3,'L',u,u+.4,10,22,'#5a2a8a');
  for(let u=.4;u<2.8;u+=.8)faceQ(c,0,0,0,5,3,'R',u,u+.4,12,22,'#38e0ff55');
  poly(c,[P(1.6,3,0),P(3.4,3,0),P(3.4,3.9,0),P(1.6,3.9,0)],'#c8202a',OLC,.6);
  roof(c,0,0,30,5,3,6,'#1a1028');box(c,.6,2.7,36,3.8,.25,22,'#120a1a',{r:1});neonText(c,P(2.5,2.95,52),'NIGHT CLUB','#ff4fd8',8);
  const [a,b]=P(4.4,2.95,62);c.save();c.shadowColor='#38e0ff';c.shadowBlur=8;c.strokeStyle='#38e0ff';c.lineWidth=1.6;c.beginPath();c.arc(a,b,4,0,7);c.stroke();c.restore();},light:[[2.5,3.4,36,70,'#ff4fd8'],[4.4,3.2,40,30,'#38e0ff'],[2.5,3.6,8,40,'#ff6a9a']]},
 rope:{w:5,d:1,h:20,draw(c){const post=(x,y)=>{const [a,b]=isoP(x,y);shadowE(c,a,b,3,1.3);box(c,x-.07,y-.07,0,.14,.14,11,'#e8b830',{top:'#ffe080'});const [p,q]=isoP(x,y,12);ell(c,p,q,1.8,1.8,'#ffd84a',OLC,.5);};
  const pts=[[.4,.5],[1.4,.5],[3.6,.5],[4.6,.5]];pts.forEach(([x,y])=>post(x,y));[[0,1],[2,3]].forEach(([i,j])=>{const [a,b]=isoP(...pts[i],10.5),[d,e]=isoP(...pts[j],10.5);c.beginPath();c.moveTo(a,b);c.quadraticCurveTo((a+d)/2,(b+e)/2+5,d,e);c.strokeStyle='#4a0a14';c.lineWidth=2.6;c.stroke();c.strokeStyle='#c8202a';c.lineWidth=1.8;c.stroke();});}},
 gym:{w:4,d:3,h:66,draw(c){shopFront(c,4,3,28,'#dfe4ec','#3a4a5a','#ff7a3a','LUMEN GYM','#ff9a3a','#d8f0ff');const [a,b]=isoP(2,1.5,48);c.lineCap='round';c.strokeStyle='#2a2a34';c.lineWidth=2;c.beginPath();c.moveTo(a-9,b);c.lineTo(a+9,b);c.stroke();[[-9,4],[9,4],[-7,3],[7,3]].forEach(([dx,r])=>{c.beginPath();c.roundRect(a+dx-1.4,b-r,2.8,r*2,1);c.fillStyle='#ff7a3a';c.fill();c.strokeStyle=OLC;c.lineWidth=.7;c.stroke();});},light:[[2,3.4,12,60,'#ff9a3a']]},
});
