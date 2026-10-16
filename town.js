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
