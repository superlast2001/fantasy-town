'use strict';
// v0.0.1.6 ARES — first custom tenant. All art drawn in code (original). Family-friendly: athletic, non-suggestive.
const ARES_SKIN='#d9a07a',ARES_RED='#e8323a';
const ARES_EXPR=['normal','smile','teasing','blush','angry','serious','surprised','sad'];
const _apc={};
function aresPortrait(expr){const outfit='brief';expr={happy:'smile',smirk:'teasing',embarrassed:'blush',blushing:'blush'}[expr]||expr;if(!ARES_EXPR.includes(expr))expr='smile';const ck=expr+outfit;if(_apc[ck])return _apc[ck];
 const c=document.createElement('canvas');c.width=420;c.height=520;const g=c.getContext('2d');g.lineJoin='round';g.lineCap='round';const OL='#2a1a20',cx=210;
 const st=(w=4,col=OL)=>{g.lineWidth=w;g.strokeStyle=col;g.stroke();};const lg=(x0,y0,x1,y1,a,b)=>{const q=g.createLinearGradient(x0,y0,x1,y1);q.addColorStop(0,a);q.addColorStop(1,b);return q;};const S=ARES_SKIN;
 {// shirtless swimmer/fitness bust: broad shoulders, simple muscle shading only
  g.beginPath();g.moveTo(-10,520);g.bezierCurveTo(-6,420,30,366,128,346);g.lineTo(292,346);g.bezierCurveTo(390,366,426,420,430,520);g.closePath();const bg=g.createRadialGradient(cx-40,400,40,cx,440,260);bg.addColorStop(0,shade(S,1.06));bg.addColorStop(1,shade(S,.78));g.fillStyle=bg;g.fill();st(5);
  g.lineWidth=3;g.strokeStyle=shade(S,.66);[[96,380,60,440,40,520],[324,380,360,440,380,520]].forEach(([a,b,c2,d,e,f])=>{g.beginPath();g.moveTo(a,b);g.quadraticCurveTo(c2,d,e,f);g.stroke();});
  g.beginPath();g.moveTo(cx-120,470);g.quadraticCurveTo(cx-60,505,cx-4,480);g.moveTo(cx+4,480);g.quadraticCurveTo(cx+60,505,cx+120,470);g.stroke();g.beginPath();g.moveTo(cx,400);g.lineTo(cx,520);g.stroke();
  g.beginPath();g.moveTo(150,372);g.quadraticCurveTo(cx-30,386,cx-8,378);g.moveTo(270,372);g.quadraticCurveTo(cx+30,386,cx+8,378);g.lineWidth=2.5;g.stroke();
  g.beginPath();g.ellipse(110,410,30,9,-.6,0,7);g.ellipse(300,420,24,8,.6,0,7);g.fillStyle='rgba(255,255,255,.14)';g.fill();}
 // thick neck + traps
 g.beginPath();g.moveTo(150,300);g.lineTo(140,350);g.quadraticCurveTo(cx,378,280,350);g.lineTo(270,300);g.closePath();g.fillStyle=lg(0,300,0,370,shade(S,.78),S);g.fill();st(3);
 // ears
 [[-104],[104]].forEach(([dx])=>{g.beginPath();g.ellipse(cx+dx,220,15,24,0,0,7);g.fillStyle=shade(S,.94);g.fill();st(3);});
 // square jaw face
 g.beginPath();g.moveTo(cx-104,150);g.bezierCurveTo(cx-108,250,cx-96,292,cx-48,318);g.quadraticCurveTo(cx,334,cx+48,318);g.bezierCurveTo(cx+96,292,cx+108,250,cx+104,150);g.bezierCurveTo(cx+92,62,cx-92,62,cx-104,150);
 const fg=g.createRadialGradient(cx-30,180,20,cx,220,180);fg.addColorStop(0,shade(S,1.06));fg.addColorStop(1,shade(S,.84));g.fillStyle=fg;g.fill();st(5);
 // stubble
 g.save();g.clip();g.beginPath();g.moveTo(cx-100,250);g.bezierCurveTo(cx-90,300,cx-40,332,cx,334);g.bezierCurveTo(cx+40,332,cx+90,300,cx+100,250);g.bezierCurveTo(cx+60,290,cx+30,276,cx,276);g.bezierCurveTo(cx-30,276,cx-60,290,cx-100,250);g.fillStyle='rgba(40,28,30,.2)';g.fill();
 const rr=rng(5);for(let i=0;i<260;i++){const a=rr()*Math.PI,r=60+rr()*45,x=cx+Math.cos(a)*r*1.05,y=250+Math.sin(a)*r*.75;if(y>262){g.fillStyle='rgba(30,20,24,.35)';g.fillRect(x,y,1.6,1.6);}}g.restore();
 // cheeks
 if(expr=='blush'){g.fillStyle='rgba(255,90,110,.45)';[[cx-66,262],[cx+66,262]].forEach(([x,y])=>{g.beginPath();g.ellipse(x,y,26,12,0,0,7);g.fill();});g.strokeStyle='rgba(200,40,60,.7)';g.lineWidth=2.5;[[cx-80],[cx-66],[cx+56],[cx+70]].forEach(([x])=>{g.beginPath();g.moveTo(x,256);g.lineTo(x+8,268);g.stroke();});}
 // brows (above the shades)
 const br={normal:[0,0],smile:[-3,0],teasing:[-10,8],blush:[4,-6],angry:[10,-14],serious:[4,0],surprised:[-18,0],sad:[2,-12]}[expr];
 const brow=(s)=>{const inner=cx+s*22,outer=cx+s*84,yi=184+br[0]+(s>0?0:0)+(expr=='teasing'&&s>0?-10:0),tilt=br[1];g.beginPath();g.moveTo(outer,184+br[0]-tilt*.2+(expr=='teasing'&&s>0?-12:0));g.quadraticCurveTo((inner+outer)/2,172+br[0]+(expr=='teasing'&&s>0?-12:0),inner,yi-tilt);g.lineWidth=12;g.strokeStyle='#1a1418';g.stroke();};brow(-1);brow(1);
 // wraparound red shades
 const gy=expr=='surprised'?198:206;g.beginPath();g.moveTo(cx-102,gy+6);g.quadraticCurveTo(cx-60,gy-6,cx-12,gy+2);g.quadraticCurveTo(cx,gy+10,cx+12,gy+2);g.quadraticCurveTo(cx+60,gy-6,cx+102,gy+6);g.lineTo(cx+92,gy+40);g.quadraticCurveTo(cx+56,gy+54,cx+20,gy+38);g.quadraticCurveTo(cx,gy+28,cx-20,gy+38);g.quadraticCurveTo(cx-56,gy+54,cx-92,gy+40);g.closePath();
 g.fillStyle=lg(0,gy,0,gy+50,'#ff5a5a','#9a0a18');g.fill();st(5,'#14101a');g.beginPath();g.moveTo(cx-80,gy+12);g.lineTo(cx-56,gy+10);g.lineTo(cx-70,gy+34);g.lineTo(cx-86,gy+32);g.closePath();g.fillStyle='rgba(255,255,255,.45)';g.fill();g.beginPath();g.moveTo(cx+40,gy+12);g.lineTo(cx+52,gy+11);g.lineTo(cx+44,gy+30);g.lineTo(cx+34,gy+30);g.closePath();g.fill();
 if(expr=='surprised'){g.beginPath();g.ellipse(cx-56,gy+60,12,10,0,0,7);g.ellipse(cx+56,gy+60,12,10,0,0,7);g.fillStyle='#fff';g.fill();st(3);g.beginPath();g.arc(cx-56,gy+60,5,0,7);g.arc(cx+56,gy+60,5,0,7);g.fillStyle='#3a2a2a';g.fill();}
 // nose
 g.beginPath();g.moveTo(cx+3,252);g.lineTo(cx-8,272);g.quadraticCurveTo(cx,278,cx+8,272);st(3,shade(S,.55));
 // mouth
 const M={normal:()=>{g.beginPath();g.moveTo(cx-26,294);g.quadraticCurveTo(cx+4,306,cx+30,290);st(4);},
  smile:()=>{g.beginPath();g.moveTo(cx-40,288);g.quadraticCurveTo(cx,330,cx+40,288);g.closePath();g.fillStyle='#fff';g.fill();st(4);g.beginPath();g.moveTo(cx-34,292);g.lineTo(cx+34,292);st(2,'#c8b8b8');},
  teasing:()=>{g.beginPath();g.moveTo(cx-30,296);g.quadraticCurveTo(cx+10,300,cx+38,280);g.quadraticCurveTo(cx+14,314,cx-30,296);g.fillStyle='#fff';g.fill();st(4);g.beginPath();g.ellipse(cx+12,306,8,6,.3,0,Math.PI);g.fillStyle='#e8607a';g.fill();st(2.5);},
  blush:()=>{g.beginPath();g.moveTo(cx-24,296);g.quadraticCurveTo(cx-12,288,cx,296);g.quadraticCurveTo(cx+12,304,cx+24,294);st(4);},
  angry:()=>{g.beginPath();g.roundRect(cx-34,284,68,22,6);g.fillStyle='#fff';g.fill();st(4);[cx-17,cx,cx+17].forEach(x=>{g.beginPath();g.moveTo(x,285);g.lineTo(x,305);st(2,'#9a8a8a');});g.beginPath();g.moveTo(cx-34,295);g.lineTo(cx+34,295);st(2,'#9a8a8a');},
  serious:()=>{g.beginPath();g.moveTo(cx-24,296);g.lineTo(cx+24,296);st(5);},
  surprised:()=>{g.beginPath();g.ellipse(cx,300,14,18,0,0,7);g.fillStyle='#7a2030';g.fill();st(4);},
  sad:()=>{g.beginPath();g.moveTo(cx-26,304);g.quadraticCurveTo(cx,286,cx+26,304);st(4);}};M[expr]();
 // spiky black hair with red tips
 const hp=[[-112,196],[-128,130],[-104,128],[-124,70],[-80,86],[-86,26],[-40,66],[-26,4],[4,58],[30,2],[48,62],[86,22],[82,84],[126,66],[106,128],[130,132],[112,196],[100,150],[84,124],[60,140],[34,112],[6,136],[-24,110],[-52,140],[-78,120],[-98,150]];
 g.beginPath();hp.forEach(([x,y],i)=>i?g.lineTo(cx+x,y):g.moveTo(cx+x,y));g.closePath();const hg=g.createLinearGradient(0,0,0,130);hg.addColorStop(0,ARES_RED);hg.addColorStop(.32,'#a01a24');hg.addColorStop(.5,'#1a1418');hg.addColorStop(1,'#0e0c10');g.fillStyle=hg;g.fill();st(5,'#0a0608');
 g.beginPath();g.moveTo(cx-50,76);g.quadraticCurveTo(cx-10,60,cx+30,70);st(6,'rgba(255,255,255,.22)');
 // emote marks
 if(expr=='angry'){g.save();g.translate(cx+120,90);g.strokeStyle='#e8202a';g.lineWidth=7;[[0,0],[1,0],[0,1],[1,1]].forEach(([a,b])=>{g.beginPath();g.arc(a?16:-16,b?16:-16,14,(a?Math.PI:0)+(b?-Math.PI/2:0)+(a==b?Math.PI/2:0),(a?Math.PI:0)+(b?-Math.PI/2:0)+(a==b?Math.PI:Math.PI/2));g.stroke();});g.restore();}
 if(expr=='surprised'){g.fillStyle='#ffd84a';g.strokeStyle=OL;g.lineWidth=3;[[cx+118,30],[cx+142,40]].forEach(([x,y])=>{g.beginPath();g.moveTo(x-6,y);g.lineTo(x+6,y);g.lineTo(x+3,y+46);g.lineTo(x-3,y+46);g.closePath();g.fill();g.stroke();g.beginPath();g.arc(x,y+58,6,0,7);g.fill();g.stroke();});}
 if(expr=='sad'||expr=='blush'){g.beginPath();g.moveTo(cx+108,150);g.quadraticCurveTo(cx+96,176,cx+108,182);g.quadraticCurveTo(cx+120,176,cx+108,150);g.fillStyle='#9ad8ff';g.fill();st(2.5);}
 return _apc[ck]=c;}
// ---- in-game chibi: 4 directions, walk cycle, single reference look, flex + emotes ----
// one look everywhere: red swim briefs, black fingerless gloves, red shades
const ARES_OUT={brief:{top:null,pants:'#d8202a',brief:1,legsLong:0,boots:null,gloves:1}};
function aresChibi(c,x,y,o,t,walk){const out=ARES_OUT.brief,face=o.face||'down',side=face=='left'||face=='right',back=face=='up',fl=face=='left'?-1:1,S=ARES_SKIN;
 const ph=walk?Math.sin(t*10):0,bob=walk?Math.abs(Math.sin(t*10))*1.1:Math.sin(t*2)*.3;c.save();c.translate(x,y);c.scale(1.22*(side?fl:1),1.22);
 shadowE(c,0,0,8,3.4);const ol=(lw=.8)=>{c.strokeStyle=OLC;c.lineWidth=lw;c.stroke();};const E=(a,b,rx,ry,f,r=0)=>{c.beginPath();c.ellipse(a,b,rx,ry,r,0,7);c.fillStyle=f;c.fill();ol(.7);};
 const sit=o.sit;
 // legs
 const leg=(lx,sw,lift)=>{const top=-9,len=sit?4:8;c.beginPath();c.roundRect(lx-1.9+(side?sw:0),top+(sit?2:0)-lift,3.8,len,1.4);c.fillStyle=out.legsLong?out.pants:S;c.fill();ol();
  if(!out.legsLong&&!sit&&!out.brief){c.beginPath();c.roundRect(lx-2.2+(side?sw*.4:0),top-lift,4.4,4.2,1.2);c.fillStyle=out.pants;c.fill();ol();}
  const fx=lx+(side?sw+1:0),fy=(sit?-2:-1)-lift;if(out.boots)E(fx,fy,side?2.8:2.3,1.4,out.boots);else E(fx,fy,side?2.4:2,1.1,shade(S,.9));};
 if(sit){c.beginPath();c.roundRect(-5,-8,10,4,1.5);c.fillStyle=out.legsLong?out.pants:out.pants;c.fill();ol();leg(-2.6,0,-3);leg(2.6,0,-3);}
 else if(side){leg(-.5,-ph*2.2,0);leg(.5,ph*2.2,0);}else{leg(-2.6,0,Math.max(0,ph)*1.2);leg(2.6,0,Math.max(0,-ph)*1.2);}
 // shorts band (gym / beach)
 if(out.brief&&!sit){const yb=-11.2-bob*.3,w=side?3.4:5.2;c.beginPath();c.moveTo(-w,yb);c.lineTo(w,yb);c.lineTo(w-.3,yb+1.6);c.quadraticCurveTo(side?1:1.6,yb+2,side?.6:1,yb+3.1);c.lineTo(side?-.6:-1,yb+3.1);c.quadraticCurveTo(side?-1:-1.6,yb+2,-w+.3,yb+1.6);c.closePath();c.fillStyle=out.pants;c.fill();ol();}
 else if(!out.legsLong&&!sit){c.beginPath();c.roundRect(side?-3.4:-5.4,-11-bob*.3,side?6.8:10.8,4.4,1.6);c.fillStyle=out.pants;c.fill();ol();c.fillStyle=out.stripe;c.fillRect(side?-3.4:-5.4,-8.2-bob*.3,side?6.8:10.8,.8);
  if(out.flowers){[[-3,-9.6],[1.6,-8.8],[3.6,-10]].forEach(([a,b])=>E(a,b-bob*.3,.8,.8,'#ffffff'));}}
 // torso (V-taper)
 const by=-9-bob,sh=side?5:8.5,ws=side?3.6:5;c.beginPath();c.moveTo(-ws,by);c.quadraticCurveTo(-sh-1,by-7,-sh,by-12);c.quadraticCurveTo(0,by-14,sh,by-12);c.quadraticCurveTo(sh+1,by-7,ws,by);c.closePath();
 const tg=c.createLinearGradient(0,by-13,0,by);const tc=out.top||S;tg.addColorStop(0,shade(tc,1.12));tg.addColorStop(1,shade(tc,.82));c.fillStyle=tg;c.fill();ol(.9);
 if(!out.top&&!back){c.strokeStyle=shade(S,.72);c.lineWidth=.6;c.beginPath();if(side){c.moveTo(1,by-10);c.quadraticCurveTo(3.4,by-8,1.6,by-6);}else{c.moveTo(0,by-11);c.lineTo(0,by-2);c.moveTo(-4.4,by-10);c.quadraticCurveTo(-1.6,by-7.4,0,by-9.6);c.quadraticCurveTo(1.6,by-7.4,4.4,by-10);[-5,-3].forEach(q=>{c.moveTo(-2.2,by+q+2);c.lineTo(2.2,by+q+2);});}c.stroke();}
 if(!out.top&&back){c.strokeStyle=shade(S,.72);c.lineWidth=.6;c.beginPath();c.moveTo(0,by-12);c.lineTo(0,by-2);c.moveTo(-5,by-11);c.quadraticCurveTo(-2,by-6,-3,by-2);c.moveTo(5,by-11);c.quadraticCurveTo(2,by-6,3,by-2);c.stroke();}
 if(out.label&&!side){c.fillStyle='#f4f4f4';c.font='bold 2.3px Arial';c.textAlign='center';c.fillText(out.label,0,by-(back?8:5.5));c.textAlign='left';}
 if(out.top&&!back&&!side){c.beginPath();c.moveTo(-2.4,by-12.6);c.quadraticCurveTo(0,by-10,2.4,by-12.6);c.strokeStyle=shade(S,.9);c.lineWidth=1.2;c.stroke();}
 // arms
 const arm=(ax,sw,flex)=>{const top=by-11.2;if(flex){E(ax*1.25,top-3.6,2.6,3.4,out.top&&!out.gloves?out.top:S,ax>0?.6:-.6);E(ax*1.2,top-8.4,2,2.6,S);E(ax*1.15,top-11,1.9,1.7,out.gloves?'#1a1a22':S);return;}
  c.beginPath();c.ellipse(ax,top+4.6+sw*.4,2.6,5.4,(side?sw*.12:0),0,7);c.fillStyle=out.top?out.top:S;c.fill();ol(.7);if(out.top){E(ax,top+7.6+sw*.4,2.2,2.6,S);}
  E(ax+(side?sw*.5:0),top+10.4+sw*.4,1.9,1.7,out.gloves?'#1a1a22':S);if(out.gloves){c.fillStyle=S;c.fillRect(ax-1.2+(side?sw*.5:0),top+11.3+sw*.4,2.4,.7);}};
 const flex=o.flex&&!walk;if(side){arm(-.6,-ph*2,0);}else{arm(-sh-.6,ph*1.6,flex);arm(sh+.6,-ph*1.6,flex);}
 // neck + head
 const hy=by-19;E(0,by-13,3,2,shade(S,.86));
 const hg=c.createRadialGradient(-2,hy-2,1,0,hy,9);hg.addColorStop(0,shade(S,1.06));hg.addColorStop(1,shade(S,.86));c.beginPath();c.moveTo(-7.6,hy-2);c.quadraticCurveTo(-7.8,hy+5,-3.6,hy+7.4);c.quadraticCurveTo(0,hy+8.4,3.6,hy+7.4);c.quadraticCurveTo(7.8,hy+5,7.6,hy-2);c.quadraticCurveTo(7,hy-9,0,hy-9);c.quadraticCurveTo(-7,hy-9,-7.6,hy-2);c.fillStyle=hg;c.fill();ol(.9);
 if(!back){c.fillStyle='rgba(40,28,30,.22)';c.beginPath();c.moveTo(-7,hy+2);c.quadraticCurveTo(0,hy+12,7,hy+2);c.quadraticCurveTo(0,hy+6,-7,hy+2);c.fill();
  if(side){c.beginPath();c.moveTo(1,hy-1.6);c.lineTo(8.2,hy-1.2);c.lineTo(7.6,hy+1.4);c.lineTo(2,hy+1.2);c.closePath();c.fillStyle=ARES_RED;c.fill();ol(.6);c.beginPath();c.moveTo(-3,hy-1.2);c.lineTo(1,hy-1.6);c.strokeStyle='#14101a';c.lineWidth=.8;c.stroke();
   c.beginPath();c.moveTo(7.6,hy+1.6);c.lineTo(8.6,hy+3);c.lineTo(7.4,hy+3.4);c.strokeStyle=OLC;c.lineWidth=.6;c.stroke();c.beginPath();c.moveTo(4.4,hy+5);c.quadraticCurveTo(6,hy+5.6,7,hy+4.6);c.stroke();}
  else{c.beginPath();c.moveTo(-7.4,hy-1.6);c.quadraticCurveTo(0,hy-3,7.4,hy-1.6);c.lineTo(6.6,hy+1.6);c.quadraticCurveTo(3.4,hy+2.6,1,hy+1.2);c.lineTo(-1,hy+1.2);c.quadraticCurveTo(-3.4,hy+2.6,-6.6,hy+1.6);c.closePath();c.fillStyle=ARES_RED;c.fill();ol(.6);c.fillStyle='rgba(255,255,255,.55)';c.fillRect(-5.4,hy-1.2,1.2,1.6);c.fillRect(2.6,hy-1.2,1.2,1.6);
   const em=o.emote;c.beginPath();if(em=='angry'){c.moveTo(-2.4,hy+5);c.lineTo(2.4,hy+5);}else if(em=='surprise'){c.ellipse(0,hy+5,1.2,1.4,0,0,7);}else{c.moveTo(-2.6,hy+4.2);c.quadraticCurveTo(0,hy+6.6,2.8,hy+3.8);}c.strokeStyle=OLC;c.lineWidth=.7;c.stroke();if(em!='angry'&&em!='surprise'){c.beginPath();c.moveTo(-2,hy+4.6);c.quadraticCurveTo(0,hy+5.8,2.2,hy+4.4);c.strokeStyle='#fff';c.lineWidth=.6;c.stroke();}}}
 // spiky hair, red tips
 const sp=back?[[-7.8,-1],[-9,-6],[-6,-7],[-7,-11],[-3,-9.6],[-2,-13],[1,-9.8],[3,-12.8],[4.4,-9],[8,-10.6],[6.6,-6.4],[9,-5],[7.8,-1],[4,-2],[0,0],[-4,-2]]:side?[[-7.8,1],[-9.6,-4],[-7,-5.4],[-9,-9.6],[-4.6,-8.6],[-4,-13],[-.6,-9.6],[2,-12.8],[3.4,-8.8],[7.4,-10],[6.4,-6],[8.6,-4],[7.4,-2.6],[4,-4],[1,-3.6],[-3,-3],[-6,-1]]
  :[[-8,1],[-9.6,-4.4],[-7.2,-5],[-8.8,-10],[-4.6,-8.4],[-3.6,-13],[-.6,-9.4],[2.2,-13],[3.6,-8.6],[8,-10.4],[6.8,-5.6],[9.4,-4.4],[8,1],[6.2,-3],[4,-2.2],[2.6,-4.4],[0,-2.6],[-2.6,-4.4],[-4,-2.2],[-6.2,-3]];
 c.beginPath();sp.forEach(([a,b],i)=>i?c.lineTo(a,hy+b):c.moveTo(a,hy+b));c.closePath();const hr=c.createLinearGradient(0,hy-13,0,hy-1);hr.addColorStop(0,ARES_RED);hr.addColorStop(.4,'#8a1420');hr.addColorStop(.6,'#1a1418');hr.addColorStop(1,'#0e0c10');c.fillStyle=hr;c.fill();ol(.8);
 c.beginPath();c.ellipse(-2.4,hy-7,2.6,.9,-.3,0,7);c.fillStyle='rgba(255,255,255,.25)';c.fill();
 c.restore();if(o.emote)aresEmote(c,x,y-48,o.emote,t);}
function aresEmote(c,x,y,k,t){const b=Math.sin(t*4)*1.2;c.save();c.translate(x+10,y+b);c.lineJoin='round';
 c.beginPath();c.ellipse(0,0,7,6,0,0,7);c.fillStyle='#fff';c.fill();c.strokeStyle=OLC;c.lineWidth=.8;c.stroke();c.beginPath();c.moveTo(-3,5);c.lineTo(-6,9);c.lineTo(0,5.6);c.fillStyle='#fff';c.fill();
 if(k=='heart'){c.beginPath();c.moveTo(0,3);c.bezierCurveTo(-6,-1,-3,-6,0,-2.6);c.bezierCurveTo(3,-6,6,-1,0,3);c.fillStyle='#ff4a7a';c.fill();c.stroke();}
 else if(k=='angry'){c.strokeStyle='#e8202a';c.lineWidth=1.3;[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,q])=>{c.beginPath();c.arc(a*2.6,q*2.6,2.2,0,Math.PI*2);c.stroke();});c.fillStyle='#fff';c.fillRect(-1.2,-1.2,2.4,2.4);}
 else if(k=='surprise'){c.fillStyle='#ffb43a';c.beginPath();c.moveTo(-1.2,-4.4);c.lineTo(1.2,-4.4);c.lineTo(.6,1);c.lineTo(-.6,1);c.closePath();c.fill();c.stroke();c.beginPath();c.arc(0,3,1.1,0,7);c.fill();}
 else if(k=='note'){c.fillStyle='#7a4ae8';c.beginPath();c.ellipse(-2,2.4,1.8,1.4,-.4,0,7);c.fill();c.fillRect(-.4,-4.4,.9,6.8);c.beginPath();c.moveTo(.5,-4.4);c.quadraticCurveTo(4,-3,3,0);c.lineWidth=1;c.strokeStyle='#7a4ae8';c.stroke();}
 else if(k=='sweat'){c.beginPath();c.moveTo(0,-4);c.quadraticCurveTo(-3,1,0,2.6);c.quadraticCurveTo(3,1,0,-4);c.fillStyle='#9ad8ff';c.fill();c.stroke();}
 c.restore();}
// hook into the shared renderers
const _baseChibi=chibi;chibi=function(c,x,y,o,t,walk){if(o&&o.ares)return aresChibi(c,x,y,o,t,walk);return _baseChibi(c,x,y,o,t,walk);};
const _basePortrait=portrait;portrait=function(name,expr){if(name=='Ares')return aresPortrait(expr);return _basePortrait(name,expr);};
// ---- full-body figure (dialogue CG, turnaround, dialogue poses). Simple athletic shapes, no anatomical detail ----
const ARES_POSES={talking:[[.15,.1],[.6,1.3]],laugh:[[.7,-.9],[2.5,-2.4]],teasing:[[.7,-.9],[.5,1.0]],embarrassed:[[.15,.1],[2.5,-2.4]],angry:[[.35,-1.6],[.35,-1.6]],thinking:[[.3,-1.5],[.3,-2.6]],surprised:[[1.2,2.6],[1.2,2.6]],serious:[[.12,.05],[.12,.05]],flex:[[1.6,3.0],[1.6,3.0]],idle:[[.15,.1],[.15,.1]]};
const ARES_POSE_EXPR={talking:'smile',laugh:'smile',teasing:'teasing',embarrassed:'blush',angry:'angry',thinking:'serious',surprised:'surprised',serious:'serious',flex:'smile',idle:'normal'};
function aresBody(g,x,y,u,o={}){const dir=o.dir||'front',pose=ARES_POSES[o.pose||'idle'],expr=o.expr||ARES_POSE_EXPR[o.pose||'idle'],S=ARES_SKIN,OL='#2a1a20';
 const side=dir=='right'||dir=='left',back=dir=='back';g.save();g.translate(x,y);if(dir=='left')g.scale(-1,1);g.lineJoin='round';g.lineCap='round';
 const st=(w=.06)=>{g.lineWidth=w*u;g.strokeStyle=OL;g.stroke();};const P=(a,b)=>[a*u,b*u];
 const skinG=(y0,y1)=>{const q=g.createLinearGradient(-u,y0*u,u,y1*u);q.addColorStop(0,shade(S,1.08));q.addColorStop(1,shade(S,.78));return q;};
 const limb=(x1,y1,x2,y2,w1,w2,f)=>{const seg=(w,col)=>{g.beginPath();g.moveTo(x1*u,y1*u);g.lineTo(x2*u,y2*u);g.lineWidth=w*u;g.strokeStyle=col;g.stroke();};const w=(w1+w2)*1.25;seg(w+.1,OL);seg(w,typeof f=='string'?f:shade(S,.95));g.beginPath();g.moveTo((x1-.04)*u,y1*u);g.lineTo((x2-.04)*u,y2*u);g.lineWidth=w*.35*u;g.strokeStyle='rgba(255,255,255,.18)';g.stroke();};
 g.beginPath();g.ellipse(0,0,1.3*u,.22*u,0,0,7);g.fillStyle='rgba(20,10,30,.25)';g.fill();
 const hipY=-4.3,shY=-6.85;
 // legs
 if(side){limb(.1,hipY,.25,-2.2,.36,.28,skinG(-4,-2));limb(.25,-2.2,.05,-.25,.28,.2,skinG(-2,0));limb(-.15,hipY,-.35,-2.2,.36,.28,skinG(-4,-2));limb(-.35,-2.2,-.45,-.25,.28,.2,skinG(-2,0));[[.2,-.12],[-.3,-.12]].forEach(([a,b])=>{g.beginPath();g.ellipse(a*u,b*u,.32*u,.13*u,0,0,7);g.fillStyle=shade(S,.9);g.fill();st();});}
 else{[-1,1].forEach(sd=>{limb(sd*.45,hipY,sd*.55,-2.2,.36,.28,skinG(-4,-2));limb(sd*.55,-2.2,sd*.5,-.25,.28,.2,skinG(-2,0));g.beginPath();g.ellipse(sd*.55*u,-.12*u,.26*u,.13*u,0,0,7);g.fillStyle=shade(S,.9);g.fill();st();});}
 // torso V-taper
 const sw=side?.85:1.5,ww=side?.6:.78;g.beginPath();g.moveTo(...P(-ww*1.05,hipY+.1));g.quadraticCurveTo(...P(-ww*.95,-5.4),...P(-sw,shY));g.quadraticCurveTo(...P(0,shY-.45),...P(sw,shY));g.quadraticCurveTo(...P(ww*.95,-5.4),...P(ww*1.05,hipY+.1));g.closePath();g.fillStyle=skinG(shY,hipY);g.fill();st();
 g.lineWidth=.035*u;g.strokeStyle=shade(S,.64);g.beginPath();if(back){g.moveTo(0,(shY+.2)*u);g.lineTo(0,(hipY-.2)*u);g.moveTo(-.9*u,(shY+.2)*u);g.quadraticCurveTo(-.4*u,-5.8*u,-.55*u,-5*u);g.moveTo(.9*u,(shY+.2)*u);g.quadraticCurveTo(.4*u,-5.8*u,.55*u,-5*u);}
 else if(side){g.moveTo(.35*u,(shY+.25)*u);g.quadraticCurveTo(.75*u,-6.2*u,.4*u,-5.95*u);}else{g.moveTo(-.95*u,-6.35*u);g.quadraticCurveTo(-.45*u,-5.95*u,-.04*u,-6.1*u);g.moveTo(.95*u,-6.35*u);g.quadraticCurveTo(.45*u,-5.95*u,.04*u,-6.1*u);g.moveTo(0,-6.6*u);g.lineTo(0,-4.9*u);}g.stroke();
 // red swim brief (solid, plain)
 const bw=side?.6:.78;g.beginPath();g.moveTo(...P(-bw,hipY-.12));g.lineTo(...P(bw,hipY-.12));g.lineTo(...P(bw-.06,hipY+.22));g.quadraticCurveTo(...P(bw*.35,hipY+.3),...P(bw*.22,hipY+.5));g.lineTo(...P(-bw*.22,hipY+.5));g.quadraticCurveTo(...P(-bw*.35,hipY+.3),...P(-bw+.06,hipY+.22));g.closePath();
 const rb=g.createLinearGradient(0,(hipY-.1)*u,0,(hipY+.5)*u);rb.addColorStop(0,'#ee3a40');rb.addColorStop(1,'#a8121c');g.fillStyle=rb;g.fill();st();
 // arms
 const L1=1.25,L2=1.1,arm=(sd,[a1,a2],front)=>{const sx=sd*(side?.2:1.22),sy=shY+.12,ex=sx+Math.sin(a1)*L1*sd,ey=sy+Math.cos(a1)*L1,hx=ex+Math.sin(a2)*L2*sd,hy=ey+Math.cos(a2)*L2;
  limb(sx,sy,ex,ey,.36,.26,skinG(sy,ey));limb(ex,ey,hx,hy,.27,.2,skinG(ey,hy));g.beginPath();g.arc(hx*u,hy*u,.24*u,0,7);g.fillStyle='#16141c';g.fill();st();g.fillStyle=S;[-1,0,1].forEach(k=>{g.beginPath();g.arc((hx+k*.09)*u,(hy+.16)*u,.05*u,0,7);g.fill();});};
 if(side)arm(1,pose[0]);else{arm(-1,pose[0]);arm(1,pose[1]);}
 // neck + head
 limb(0,shY+.1,0,shY-.35,.3,.3,skinG(shY-.4,shY));const hy=-7.7;g.beginPath();g.ellipse(0,hy*u,.56*u,.64*u,0,0,7);g.fillStyle=skinG(hy-.6,hy+.6);g.fill();st();
 if(!back){g.save();g.beginPath();g.ellipse(0,hy*u,.56*u,.64*u,0,0,7);g.clip();g.fillStyle='rgba(40,28,30,.22)';g.beginPath();g.ellipse(side?.15*u:0,(hy+.45)*u,.5*u,.3*u,0,0,7);g.fill();g.restore();
  if(expr=='blush'){g.fillStyle='rgba(255,90,110,.45)';[[-.3],[.3]].forEach(([a])=>{g.beginPath();g.ellipse((side?.25:a)*u,(hy+.18)*u,.13*u,.06*u,0,0,7);g.fill();});}
  g.beginPath();if(side){g.moveTo(.05*u,(hy-.1)*u);g.lineTo(.6*u,(hy-.08)*u);g.lineTo(.56*u,(hy+.1)*u);g.lineTo(.1*u,(hy+.12)*u);}else{g.moveTo(-.58*u,(hy-.12)*u);g.quadraticCurveTo(0,(hy-.22)*u,.58*u,(hy-.12)*u);g.lineTo(.5*u,(hy+.12)*u);g.quadraticCurveTo(.2*u,(hy+.2)*u,.04*u,(hy+.08)*u);g.lineTo(-.04*u,(hy+.08)*u);g.quadraticCurveTo(-.2*u,(hy+.2)*u,-.5*u,(hy+.12)*u);}g.closePath();g.fillStyle=ARES_RED;g.fill();st(.04);
  const mx=side?.3:0,my=hy+.36;g.beginPath();if(expr=='surprised')g.ellipse(mx*u,my*u,.08*u,.1*u,0,0,7);else if(expr=='angry'||expr=='serious'){g.moveTo((mx-.15)*u,my*u);g.lineTo((mx+.15)*u,my*u);}else if(expr=='sad'){g.moveTo((mx-.15)*u,(my+.04)*u);g.quadraticCurveTo(mx*u,(my-.06)*u,(mx+.15)*u,(my+.04)*u);}else{g.moveTo((mx-.2)*u,(my-.04)*u);g.quadraticCurveTo(mx*u,(my+.14)*u,(mx+.22)*u,(my-.07)*u);}
  if(expr=='smile'||expr=='teasing'){g.fillStyle='#fff';g.fill();}st(.04);
  const bry=hy-.3+(expr=='surprised'?-.08:0);g.lineWidth=.08*u;g.strokeStyle='#1a1418';[-1,1].forEach(sd=>{if(side&&sd<0)return;const bx=side?.35:sd*.3,tilt=expr=='angry'?sd*-.06:expr=='sad'||expr=='blush'?sd*.06:0;g.beginPath();g.moveTo((bx-.15)*u,(bry+tilt*(sd>0?1:-1))*u);g.lineTo((bx+.15)*u,(bry-tilt*(sd>0?1:-1))*u);g.stroke();});}
 // hair spikes with red tips
 const spikes=back?[[-.6,0],[-.7,-.45],[-.45,-.5],[-.55,-.85],[-.2,-.7],[-.12,-1.05],[.12,-.72],[.3,-1.0],[.4,-.68],[.68,-.82],[.55,-.42],[.7,-.3],[.6,.05],[.2,.1],[-.2,.1]]:[[-.62,-.05],[-.75,-.4],[-.52,-.44],[-.66,-.8],[-.32,-.66],[-.25,-1.05],[0,-.72],[.18,-1.06],[.3,-.68],[.62,-.86],[.52,-.44],[.74,-.36],[.62,-.05],[.45,-.26],[.25,-.18],[.1,-.34],[-.1,-.2],[-.3,-.34],[-.45,-.2]];
 g.beginPath();spikes.forEach(([a,b],i)=>{const q=P(a,hy+b-.15);i?g.lineTo(...q):g.moveTo(...q);});g.closePath();const hr=g.createLinearGradient(0,(hy-1.2)*u,0,(hy-.2)*u);hr.addColorStop(0,ARES_RED);hr.addColorStop(.4,'#8a1420');hr.addColorStop(.62,'#1a1418');hr.addColorStop(1,'#0e0c10');g.fillStyle=hr;g.fill();st(.05);
 g.restore();}
