'use strict';
const MAPL={village:[330,250],forest:[560,250],badlands:[790,250],mine:[790,70],island:[330,440],city:[560,440]};
const REG={village:'#e8d8c0',forest:'#d0eedb',badlands:'#f2eecc',mine:'#d4eaf2',island:'#d2f2df',city:'#f8d6e2'};
let mapBtns=[],thumbs={};
function drawMap(t){ctx.setTransform(1,0,0,1,0,0);const W=cv.width,H=cv.height;ctx.fillStyle='#fbfbf6';ctx.fillRect(0,0,W,H);
 const s=Math.min(W/1060,H/600),ox=(W-1060*s)/2,oy=(H-600*s)/2;mapBtns=[];
 const P=(x,y)=>[ox+x*s,oy+y*s];const tw=184,th=118;
 ctx.font=`bold ${Math.round(20*s)}px sans-serif`;ctx.fillStyle='#222';ctx.textBaseline='top';ctx.textAlign='left';ctx.fillText('FANTASY TOWN — WORLD MAP',P(20,14)[0],P(20,14)[1]);
 // regions
 for(const id of AORDER){const [x,y]=MAPL[id],a=AREAS[id],[rx,ry]=P(x-24,y-40);ctx.fillStyle=REG[id];ctx.fillRect(rx,ry,(tw+48)*s,(th+66)*s);
  ctx.fillStyle='#333';ctx.font=`${Math.round(15*s)}px sans-serif`;ctx.fillText(a.region.replace(/\b(\w)(\w*)/g,(m,p,q)=>p+q.toLowerCase()),rx+8*s,ry+8*s);}
 // routes
 ROUTES.forEach((r,i)=>{const un=isUnlocked(r),A=MAPL[r.a],B=MAPL[r.b];const off=(i%3-1)*14;let pts;
  const ca=[A[0]+tw/2,A[1]+th/2],cb=[B[0]+tw/2,B[1]+th/2];
  if(r.type=='walk'||r.type=='magic'&&false)pts=[ca,[ca[0],ca[1]],cb];
  pts=Math.abs(ca[1]-cb[1])<5?[[ca[0],ca[1]+off],[cb[0],cb[1]+off]]:[[ca[0]+off,ca[1]],[ca[0]+off,(ca[1]+cb[1])/2+off],[cb[0]+off,(ca[1]+cb[1])/2+off],[cb[0]+off,cb[1]]];
  if(r.type=='boat')pts=[[ca[0]-40,ca[1]],[cb[0]-40,cb[1]]];if(r.type=='cable')pts=[[ca[0]+40,ca[1]],[ca[0]+40,A[1]-60],[cb[0]-10,A[1]-60],[cb[0]-10,cb[1]]];if(r.type=='train')pts=[[ca[0]+30,ca[1]],[ca[0]+30,cb[1]+30],[cb[0],cb[1]+30]];if(r.type=='magic')pts=[[ca[0]+40,ca[1]],[ca[0]+40,cb[1]+20],[cb[0],cb[1]+20]];
  if(r.type=='bus')pts=[[ca[0],ca[1]-30],[ca[0]+40,ca[1]-30],[ca[0]+40,A[1]-25],[cb[0]-20,A[1]-25],[cb[0]-20,cb[1]-30]];
  ctx.strokeStyle=un?RT[r.type].c:RT.blocked.c;ctx.lineWidth=Math.max(2,4*s);ctx.setLineDash(un?[]:[8*s,6*s]);ctx.beginPath();pts.forEach((p,k)=>{const q=P(...p);k?ctx.lineTo(...q):ctx.moveTo(...q);});ctx.stroke();ctx.setLineDash([]);
  if(!un){const m=pts[Math.floor(pts.length/2)],q=P(...m);ctx.fillStyle="#fff";ctx.fillRect(q[0]-9*s,q[1]-9*s,18*s,18*s);ctx.fillStyle='#8a7350';ctx.font=`bold ${Math.round(13*s)}px sans-serif`;ctx.textAlign='center';ctx.fillText('🔒',q[0],q[1]-8*s);ctx.textAlign='left';}});
 // thumbnails
 for(const id of AORDER){const [x,y]=MAPL[id],[px,py]=P(x,y);ctx.imageSmoothingEnabled=true;const TH0=thumb(id);
  const vis=S.visited[id];ctx.globalAlpha=vis?1:.45;ctx.drawImage(TH0,px,py,tw*s,th*s);ctx.globalAlpha=1;ctx.strokeStyle='#222';ctx.lineWidth=2;ctx.strokeRect(px,py,tw*s,th*s);
  if(!vis){ctx.fillStyle='#0008';ctx.fillRect(px,py,tw*s,th*s);ctx.fillStyle='#fff';ctx.font=`bold ${Math.round(14*s)}px sans-serif`;ctx.textAlign='center';ctx.fillText('? unexplored',px+tw*s/2,py+th*s/2-7*s);ctx.textAlign='left';}
  ctx.fillStyle='#222';ctx.font=`bold ${Math.round(12*s)}px sans-serif`;ctx.fillText(AREAS[id].name,px,py+th*s+4*s);
  if(id==area.id){ctx.strokeStyle='#ff2a8a';ctx.lineWidth=3+Math.sin(t*5)*1.5;ctx.strokeRect(px-4,py-4,tw*s+8,th*s+8);const a=AREAS[id];ctx.fillStyle='#ff2a8a';ctx.beginPath();ctx.arc(...thumbXY(id,px,py,tw*s,th*s),5*s+2,0,7);ctx.fill();ctx.fillStyle='#ff2a8a';ctx.font=`bold ${Math.round(12*s)}px sans-serif`;ctx.fillText('YOU ARE HERE',px+tw*s-90*s,py+th*s+4*s);}
  const r=ROUTES.find(r=>r.type!='walk'&&isUnlocked(r)&&(r.a==area.id&&r.b==id||r.b==area.id&&r.a==id));if(r)mapBtns.push({r:[px,py,tw*s,th*s],f:()=>travel(r),thumb:1});}
 ctx.imageSmoothingEnabled=false;
 // legend
 const [lx,ly]=P(30,330);const L=Object.keys(RT);ctx.fillStyle='#fff';ctx.fillRect(lx,ly,190*s,(L.length*24+16)*s);ctx.strokeStyle='#666';ctx.lineWidth=1;ctx.strokeRect(lx,ly,190*s,(L.length*24+16)*s);
 L.forEach((k,i)=>{ctx.fillStyle="#333";ctx.fillRect(lx+10*s,ly+(10+i*24)*s,18*s,18*s);ctx.fillStyle=RT[k].c;ctx.fillRect(lx+11*s,ly+(11+i*24)*s,16*s,16*s);ctx.fillStyle='#222';ctx.font=`${Math.round(14*s)}px sans-serif`;ctx.fillText(RT[k].n,lx+36*s,ly+(11+i*24)*s);});
 // travel buttons
 const avail=ROUTES.filter(r=>r.type!='walk'&&(r.a==area.id||r.b==area.id));let bx=P(30,140)[0],by=P(30,140)[1];
 ctx.font=`bold ${Math.round(13*s)}px sans-serif`;ctx.fillStyle='#222';ctx.fillText('FAST TRAVEL',bx,by-20*s);
 if(!avail.length){ctx.font=`${Math.round(12*s)}px sans-serif`;ctx.fillText('No stations here.',bx,by);}
 avail.forEach((r,i)=>{const un=isUnlocked(r),to=r.a==area.id?r.b:r.a,bw=230*s,bh=30*s,y=by+i*36*s;ctx.fillStyle=un?RT[r.type].c:'#ccc';ctx.fillRect(bx,y,bw,bh);ctx.fillStyle=un?(r.type=='bus'?'#000':'#fff'):'#666';ctx.font=`bold ${Math.round(12*s)}px sans-serif`;
  const need=r.req&&BL[r.req]?'build '+BL[r.req].n:r.req?'repair '+r.req:'';ctx.fillText(`${i+1}. ${RT[r.type].n.split(' ')[0]} → ${AREAS[to].name}${un?'':' 🔒 '+need}`,bx+8*s,y+8*s);if(un)mapBtns.unshift({r:[bx,y,bw,bh],f:()=>travel(r)});});
 mapBtns.sort((p,q)=>(p.thumb||0)-(q.thumb||0));
 const cb=[W-110*s-10,10,110*s,34*s];ctx.fillStyle="#222";ctx.fillRect(...cb);ctx.fillStyle='#fff';ctx.font=`bold ${Math.round(14*s)}px sans-serif`;ctx.fillText('✕ CLOSE',cb[0]+16*s,cb[1]+9*s);mapBtns.push({r:cb,f:()=>{showMap=false;}});
 ctx.font=`${Math.round(11*s)}px sans-serif`;ctx.fillStyle='#555';ctx.fillText(isTouch?'Tap a destination or route to travel':'Click a destination or press its number · M to close',P(30,560)[0],P(30,560)[1]);}
