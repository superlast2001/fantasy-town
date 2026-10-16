'use strict';
// Smooth anime-style bust portraits drawn with canvas paths + gradients (family-friendly, all original)
const PORTRAITS={
 Mira:{skin:'#ffe0cf',hair:'#ff6fb5',style:'long',eye:'#c03aa8',top:'#7a3ab8',top2:'#ffd84a',acc:'earring'},
 Bolt:{robot:1,top:'#3a4a5e',top2:'#3dff9a',eye:'#3dff9a'},
 'Old Coral':{skin:'#f2c9a8',hair:'#d8dde2',style:'short',eye:'#3a7ac0',top:'#24406e',top2:'#ffffff',acc:'beard,captain',age:1},
 Pip:{skin:'#ffe2c4',hair:'#ff9a3a',style:'spiky',eye:'#3aa060',top:'#ffc93a',top2:'#ffffff',acc:'hood'},
 Nova:{skin:'#fde3d6',hair:'#8f6bff',style:'bob',eye:'#e0a020',top:'#f4f4ff',top2:'#38e0ff',acc:'star'},
 Sigil:{skin:'#e9c3a0',hair:'#22232e',style:'short',eye:'#4a5ad0',top:'#2f4fa8',top2:'#c8d8ff',acc:'glasses'},
 Amber:{skin:'#ffe4d0',hair:'#ffd36a',style:'pony',eye:'#a0602a',top:'#e2483a',top2:'#ffe9c0',acc:'bow'},
 Juno:{skin:'#f6d2b8',hair:'#2ec8b8',style:'bun',eye:'#1a8a8a',top:'#1a7a7a',top2:'#ffd0e8',acc:''},
 Kai:{skin:'#d9a882',hair:'#5a3a22',style:'spiky',eye:'#6a4a2a',top:'#5a6070',top2:'#ffb43a',acc:'band'},
 'Mayor Lumen':{skin:'#f6d6bc',hair:'#f4f4f4',style:'short',eye:'#6a8a3a',top:'#c09a2a',top2:'#ffffff',acc:'glasses,beard',age:1},
 Vexa:{skin:'#ffe0d6',hair:'#e040b0',style:'pony',eye:'#7a2ad0',top:'#2a1a40',top2:'#ff4fd8',acc:'earring'},
 'Conductor Rail':{skin:'#e0b090',hair:'#1a1a1a',style:'short',eye:'#3a3a3a',top:'#a01a2a',top2:'#ffd84a',acc:'cap'},
};
const _pc={};
function portrait(name,expr='smile'){const k=name+expr;if(_pc[k])return _pc[k];const p={acc:'',...(PORTRAITS[name]||PORTRAITS.Pip)};
 const c=document.createElement('canvas');c.width=420;c.height=520;const g=c.getContext('2d');g.lineJoin='round';g.lineCap='round';
 const OL='#3a2230',lw=4;const stroke=(w=lw,col=OL)=>{g.lineWidth=w;g.strokeStyle=col;g.stroke();};
 const lg=(x0,y0,x1,y1,a,b)=>{const q=g.createLinearGradient(x0,y0,x1,y1);q.addColorStop(0,a);q.addColorStop(1,b);return q;};
 const dk=(col,f)=>shade(col,f);
 const cx=210;
 // shoulders / outfit
 g.beginPath();g.moveTo(20,520);g.bezierCurveTo(30,420,90,390,150,372);g.lineTo(270,372);g.bezierCurveTo(330,390,390,420,400,520);g.closePath();
 g.fillStyle=lg(0,370,0,520,p.top,dk(p.top,.6));g.fill();stroke();
 // collar
 g.beginPath();g.moveTo(160,374);g.lineTo(cx,440);g.lineTo(260,374);g.lineTo(240,370);g.lineTo(cx,410);g.lineTo(180,370);g.closePath();g.fillStyle=p.top2;g.fill();stroke(3);
 if(p.acc.includes&&p.acc.includes('hood')){g.beginPath();g.moveTo(110,390);g.quadraticCurveTo(cx,330,310,390);g.quadraticCurveTo(cx,370,110,390);g.fillStyle=dk(p.top,.85);g.fill();stroke(3);}
 if(p.robot){ // Bolt: friendly robot
  g.beginPath();g.rect(cx-22,330,44,46);g.fillStyle='#7a8698';g.fill();stroke(3);
  g.beginPath();g.roundRect(cx-120,110,240,230,60);g.fillStyle=lg(0,110,0,340,'#dfe6ee','#8e9aab');g.fill();stroke(5);
  g.beginPath();g.roundRect(cx-96,170,192,90,40);g.fillStyle='#1a2030';g.fill();stroke(3);
  const glowE=(x)=>{g.save();g.shadowColor=p.eye;g.shadowBlur=18;g.fillStyle=p.eye;g.beginPath();
   if(expr=='happy'){g.lineWidth=10;g.strokeStyle=p.eye;g.arc(x,222,20,Math.PI*1.1,Math.PI*1.9);g.stroke();}else if(expr=='surprised'){g.arc(x,215,22,0,7);g.fill();}else{g.ellipse(x,215,18,24,0,0,7);g.fill();}g.restore();};
  glowE(cx-45);glowE(cx+45);
  g.beginPath();if(expr=='surprised')g.arc(cx,295,12,0,7);else g.moveTo(cx-34,290),g.quadraticCurveTo(cx,expr=='happy'?318:306,cx+34,290);stroke(5,'#3a4a5e');
  g.beginPath();g.moveTo(cx,110);g.lineTo(cx,70);stroke(5,'#5a6678');g.beginPath();g.arc(cx,62,12,0,7);g.save();g.shadowColor='#3dff9a';g.shadowBlur=20;g.fillStyle='#3dff9a';g.fill();g.restore();stroke(3);
  [[-128,225],[128,225]].forEach(([dx,dy])=>{g.beginPath();g.roundRect(cx+dx-14,dy-30,28,60,12);g.fillStyle='#a8b4c4';g.fill();stroke(3);});
  g.beginPath();g.ellipse(cx-60,130,40,10,-.2,0,7);g.fillStyle='#ffffff88';g.fill();
  return _pc[k]=c;}
 // back hair
 g.fillStyle=lg(0,60,0,420,p.hair,dk(p.hair,.7));
 if(p.style=='long'){g.beginPath();g.moveTo(80,170);g.bezierCurveTo(60,300,70,400,110,460);g.lineTo(310,460);g.bezierCurveTo(350,400,360,300,340,170);g.closePath();g.fill();stroke();}
 if(p.style=='bob'){g.beginPath();g.moveTo(85,160);g.bezierCurveTo(70,260,80,320,120,340);g.lineTo(300,340);g.bezierCurveTo(340,320,350,260,335,160);g.closePath();g.fill();stroke();}
 if(p.style=='pony'){g.beginPath();g.moveTo(300,120);g.bezierCurveTo(400,140,400,300,350,400);g.bezierCurveTo(340,300,330,220,290,170);g.closePath();g.fill();stroke();}
 if(p.style=='bun'){g.beginPath();g.arc(cx,58,46,0,7);g.fill();stroke();}
 // neck
 g.beginPath();g.moveTo(178,300);g.lineTo(176,380);g.quadraticCurveTo(cx,395,244,380);g.lineTo(242,300);g.closePath();g.fillStyle=lg(0,300,0,390,dk(p.skin,.82),p.skin);g.fill();stroke(3);
 // ears
 [[-98,1],[98,-1]].forEach(([dx])=>{g.beginPath();g.ellipse(cx+dx,215,16,26,0,0,7);g.fillStyle=dk(p.skin,.95);g.fill();stroke(3);});
 if(p.acc.includes('earring')){g.beginPath();g.arc(cx+98,248,7,0,7);g.fillStyle='#ffd84a';g.fill();stroke(2);}
 // face
 g.beginPath();g.moveTo(cx-100,150);g.bezierCurveTo(cx-104,250,cx-70,300,cx,322);g.bezierCurveTo(cx+70,300,cx+104,250,cx+100,150);g.bezierCurveTo(cx+90,60,cx-90,60,cx-100,150);
 const fg=g.createRadialGradient(cx-30,180,20,cx,210,170);fg.addColorStop(0,shade(p.skin,1.04));fg.addColorStop(1,dk(p.skin,.88));g.fillStyle=fg;g.fill();stroke();
 // blush
 g.fillStyle='rgba(255,110,140,.28)';[[cx-62,262],[cx+62,262]].forEach(([x,y])=>{g.beginPath();g.ellipse(x,y,22,11,0,0,7);g.fill();});
 // eyes
 const eye=(x,flip)=>{if(expr=='happy'){g.beginPath();g.moveTo(x-24,226);g.quadraticCurveTo(x,200,x+24,226);stroke(6);return;}
  const big=expr=='surprised'?1.15:1;g.beginPath();g.ellipse(x,225,25*big,21*big,0,0,7);g.fillStyle='#fff';g.fill();
  g.save();g.clip();const ig=g.createLinearGradient(0,200,0,252);ig.addColorStop(0,dk(p.eye,.45));ig.addColorStop(1,shade(p.eye,1.35));g.fillStyle=ig;g.beginPath();g.ellipse(x+(flip?-2:2),230,15*big,20*big,0,0,7);g.fill();
  g.fillStyle=dk(p.eye,.25);g.beginPath();g.ellipse(x+(flip?-2:2),231,7,10,0,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.ellipse(x-5,220,6,7,0,0,7);g.fill();g.beginPath();g.arc(x+7,240,3,0,7);g.fill();g.restore();
  g.beginPath();g.moveTo(x-28,222);g.quadraticCurveTo(x,198,x+28,220);stroke(7,'#2a1820');
  if(flip)g.beginPath(),g.moveTo(x-28,222),g.lineTo(x-34,214),stroke(4,'#2a1820');else g.beginPath(),g.moveTo(x+28,220),g.lineTo(x+34,212),stroke(4,'#2a1820');};
 eye(cx-48,1);eye(cx+48,0);
 // brows
 const by=expr=='surprised'?184:192;g.beginPath();g.moveTo(cx-72,by+4);g.quadraticCurveTo(cx-48,by-8,cx-24,by+2);stroke(5,dk(p.hair,.55));g.beginPath();g.moveTo(cx+24,by+2);g.quadraticCurveTo(cx+48,by-8,cx+72,by+4);stroke(5,dk(p.hair,.55));
 // nose & mouth
 g.beginPath();g.moveTo(cx+2,252);g.lineTo(cx-4,266);g.lineTo(cx+4,268);stroke(2.5,dk(p.skin,.6));
 if(expr=='happy'){g.beginPath();g.moveTo(cx-24,284);g.quadraticCurveTo(cx,316,cx+24,284);g.closePath();g.fillStyle='#b8384a';g.fill();stroke(3);g.beginPath();g.ellipse(cx,300,10,5,0,0,7);g.fillStyle='#ff8a9a';g.fill();}
 else if(expr=='surprised'){g.beginPath();g.ellipse(cx,292,9,12,0,0,7);g.fillStyle='#b8384a';g.fill();stroke(3);}
 else{g.beginPath();g.moveTo(cx-18,286);g.quadraticCurveTo(cx,298,cx+18,286);stroke(3.5);}
 if(p.acc.includes('beard')){g.beginPath();g.moveTo(cx-96,210);g.bezierCurveTo(cx-90,330,cx-30,350,cx,352);g.bezierCurveTo(cx+30,350,cx+90,330,cx+96,210);g.bezierCurveTo(cx+70,280,cx+30,300,cx+20,296);g.quadraticCurveTo(cx,280,cx-20,296);g.bezierCurveTo(cx-30,300,cx-70,280,cx-96,210);
  g.fillStyle=lg(0,220,0,350,p.hair,dk(p.hair,.75));g.fill();stroke(3);}
 if(p.acc.includes('glasses')){[[cx-48],[cx+48]].forEach(([x])=>{g.beginPath();g.roundRect(x-32,198,64,52,16);stroke(4,'#2a2a3a');});g.beginPath();g.moveTo(cx-16,220);g.lineTo(cx+16,220);stroke(4,'#2a2a3a');
  g.fillStyle='rgba(180,220,255,.18)';g.fillRect(cx-78,200,60,48);g.fillRect(cx+18,200,60,48);}
 // front hair
 g.fillStyle=lg(0,40,0,260,shade(p.hair,1.1),dk(p.hair,.78));g.beginPath();
 if(p.style=='spiky'){g.moveTo(cx-112,190);g.lineTo(cx-130,120);g.lineTo(cx-100,118);g.lineTo(cx-110,60);g.lineTo(cx-60,80);g.lineTo(cx-50,20);g.lineTo(cx,64);g.lineTo(cx+40,14);g.lineTo(cx+56,74);g.lineTo(cx+110,50);g.lineTo(cx+100,110);g.lineTo(cx+134,120);g.lineTo(cx+110,190);
  g.lineTo(cx+86,140);g.lineTo(cx+60,176);g.lineTo(cx+40,128);g.lineTo(cx+8,170);g.lineTo(cx-20,126);g.lineTo(cx-46,172);g.lineTo(cx-70,132);g.lineTo(cx-90,180);g.closePath();}
 else if(p.style=='short'){g.moveTo(cx-106,200);g.bezierCurveTo(cx-130,80,cx-60,40,cx,44);g.bezierCurveTo(cx+80,40,cx+130,90,cx+106,200);g.quadraticCurveTo(cx+92,140,cx+64,136);g.quadraticCurveTo(cx+20,160,cx-10,130);g.quadraticCurveTo(cx-50,160,cx-80,140);g.quadraticCurveTo(cx-96,160,cx-106,200);}
 else{g.moveTo(cx-108,230);g.bezierCurveTo(cx-130,90,cx-60,36,cx,40);g.bezierCurveTo(cx+70,36,cx+130,90,cx+108,230);g.quadraticCurveTo(cx+96,170,cx+80,150);g.lineTo(cx+60,190);g.lineTo(cx+44,138);g.lineTo(cx+14,180);g.lineTo(cx-6,132);g.lineTo(cx-34,184);g.lineTo(cx-56,140);g.lineTo(cx-76,192);g.lineTo(cx-86,152);g.quadraticCurveTo(cx-100,180,cx-108,230);}
 g.fill();stroke();
 g.beginPath();g.moveTo(cx-60,70);g.quadraticCurveTo(cx-20,52,cx+20,60);stroke(8,'rgba(255,255,255,.35)');
 if(p.acc.includes('captain')||p.acc.includes('cap')){g.beginPath();g.moveTo(cx-112,110);g.bezierCurveTo(cx-110,20,cx+110,20,cx+112,110);g.closePath();g.fillStyle=p.acc.includes('captain')?'#f4f4f4':'#a01a2a';g.fill();stroke();
  g.beginPath();g.moveTo(cx-120,110);g.quadraticCurveTo(cx,140,cx+120,110);g.lineTo(cx+110,98);g.quadraticCurveTo(cx,120,cx-110,98);g.closePath();g.fillStyle='#1a1a2a';g.fill();stroke(3);
  g.beginPath();g.arc(cx,72,12,0,7);g.fillStyle='#ffd84a';g.fill();stroke(3);}
 if(p.acc.includes('bow')){g.fillStyle='#e2483a';g.beginPath();g.moveTo(cx+80,60);g.lineTo(cx+130,30);g.lineTo(cx+126,90);g.closePath();g.moveTo(cx+80,60);g.lineTo(cx+40,26);g.lineTo(cx+44,84);g.closePath();g.fill();stroke(3);}
 if(p.acc.includes('star')){g.save();g.translate(cx+82,92);g.beginPath();for(let i=0;i<10;i++){const r=i%2?8:20,a=i*Math.PI/5-Math.PI/2;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.fillStyle='#ffd84a';g.fill();stroke(3);g.restore();}
 if(p.acc.includes('band')){g.beginPath();g.moveTo(cx-110,150);g.quadraticCurveTo(cx,120,cx+110,150);stroke(14,'#ffb43a');}
 return _pc[k]=c;}
