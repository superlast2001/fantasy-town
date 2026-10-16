'use strict';const T=16;
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const shade=(c,a)=>{const n=parseInt(c.slice(1),16);let r=n>>16,g=n>>8&255,bl=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(v*a)));return'#'+((1<<24)|(f(r)<<16)|(f(g)<<8)|f(bl)).toString(16).slice(1);};
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h);}
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
const glowC={};
function glow(col){if(glowC[col])return glowC[col];const g=document.createElement('canvas');g.width=g.height=64;const c=g.getContext('2d');const gr=c.createRadialGradient(32,32,0,32,32,32);
 gr.addColorStop(0,col+'cc');gr.addColorStop(.35,col+'55');gr.addColorStop(1,col+'00');c.fillStyle=gr;c.fillRect(0,0,64,64);return glowC[col]=g;}
function person(c,x,y,body,hair,face,step,isPlayer){x=Math.round(x);y=Math.round(y);const bob=step?Math.round(Math.sin(step)*1):0;
 rect(c,x-5,y-1,10,3,'#0006');
 const l=Math.sin(step||0)>0;rect(c,x-3,y-4,2,4-(l?1:0),'#223');rect(c,x+1,y-4,2,4-(l?0:1),'#223');
 rect(c,x-4,y-11+bob,8,8,body);rect(c,x-4,y-11+bob,8,1,shade(body,1.3));rect(c,x-5,y-10+bob,1,5,'#f0c8a0');rect(c,x+4,y-10+bob,1,5,'#f0c8a0');
 rect(c,x-3,y-17+bob,6,6,'#f0c8a0');rect(c,x-4,y-18+bob,8,3,hair);
 if(face=='down'){rect(c,x-2,y-14+bob,1,1,'#123');rect(c,x+1,y-14+bob,1,1,'#123');}else if(face=='up')rect(c,x-4,y-17+bob,8,5,hair);else if(face=='left'){rect(c,x-3,y-14+bob,1,1,'#123');rect(c,x+1,y-17+bob,3,4,hair);}else{rect(c,x+2,y-14+bob,1,1,'#123');rect(c,x-4,y-17+bob,3,4,hair);}
 if(isPlayer){rect(c,x-5,y-19+bob,10,2,'#e8c050');rect(c,x-3,y-21+bob,6,2,'#e8c050');}}
function icon(id,x,y,s){const p=s/16;const r=(a,b,w,h,c)=>rect(ctx,x+a*p,y+b*p,w*p,h*p,c);
 switch(id){case'hoe':r(7,2,2,12,'#8a6238');r(3,2,6,3,'#bbb');break;case'can':r(3,6,9,7,'#5a9ad8');r(11,4,4,2,'#5a9ad8');r(5,4,4,2,'#3a6aa8');break;
 case'pick':r(7,4,2,11,'#8a6238');r(2,2,12,3,'#aab');r(2,5,2,2,'#aab');r(12,5,2,2,'#aab');break;case'rod':r(3,13,2,2,'#555');for(let i=0;i<10;i++)r(4+i,12-i,1,1,'#c08040');r(13,3,1,9,'#ddd');break;
 case'wood':r(2,6,12,5,'#9a6a3a');r(2,6,3,5,'#d0a060');break;case'ore':r(3,5,10,8,'#6e6e84');r(5,7,2,2,'#7fd0ff');r(9,9,2,2,'#7fd0ff');break;case'scrap':r(3,7,10,6,'#8a7a60');r(5,4,5,4,'#a09070');r(9,8,3,3,'#5a8aa0');break;
 case'shell':r(4,6,8,6,'#ffd0e8');r(6,5,4,1,'#fff');r(7,7,1,5,'#d080a0');break;case'neon':r(6,2,4,12,'#ff4fd8');r(7,3,2,10,'#ffc0f4');break;case'fish':r(3,6,9,5,'#38e0ff');r(11,5,3,7,'#2090c0');r(5,7,1,1,'#012');break;
 default:if(id.startsWith('s_')){const c=CROPS[id.slice(2)];r(4,5,8,9,'#c8a870');r(4,5,8,2,'#a08050');r(6,8,4,4,c.c);}else{const c=ITEMS[id];r(4,4,8,9,c.c);r(7,1,2,4,'#3fbf4a');}}}
