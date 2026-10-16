'use strict';
// v0.0.1.7 ARES — art comes straight from the user's own reference sheet (assets/ares/sheet.png),
// sliced by assets/ares/slice.py (crop + background key only; character pixels untouched). Drawn with uniform scaling.
const ARES_EXPR=['normal','smile','teasing','blush','angry','serious','surprised','sad'];
const ARES_IMG={};const ARES_SLICES=['cg','turn_front','turn_right','turn_back','turn_left',
 ...['normal','smile','teasing','blushing','angry','serious','surprised','sad'].map(e=>'expr_'+e),
 ...['talking','laugh','teasing','embarrassed','angry','thinking','surprised','serious'].map(p=>'pose_'+p),
 'chibi_front','chibi_right','chibi_back','chibi_left',...[0,1,2,3,4,5,6].map(i=>'walk_'+i),
 ...['idle','smile','blush','angry','surprised','happy','sit'].map(e=>'emote_'+e)];
ARES_SLICES.forEach(n=>{const im=new Image();im.src='assets/ares/'+n+'.png';ARES_IMG[n]=im;});
const aresReady=n=>{const i=ARES_IMG[n];return i&&i.complete&&i.naturalWidth>0;};
['icon_heart','icon_hearts','icon_angry','icon_surprise','icon_note'].forEach(n=>{const im=new Image();im.src='assets/ares/'+n+'.png';ARES_IMG[n]=im;});
// Dialogue art: the CG shown at native resolution in a clean frame, keeping its own painted background;
// only the frame's alpha is feathered (sides) and faded (bottom, behind the text box) so no crop edge shows.
let _adc=null,_adcHD=null;
{const im=new Image();im.src='assets/ares/cg_full.png';ARES_IMG.cg_full=im;const hd=new Image();hd.src='assets/ares/cg_full_hd.png';ARES_IMG.cg_full_hd=hd;}
// Big model, whole from head to toe (assets/ares/cg_full.png: the sheet's CG with the limbs the panel cut off completed
// offline), standing over the live, dimmed location. Soft warm rim glow only; no fades, no crop.
// Portrait: cg_full_hd.png = Real-ESRGAN anime x4 of cg_full (head verified against the sheet), Lanczos-reduced to 1200px wide,
// so phones (up to ~1200 device px wide) never upscale it.
function aresDialogueArtHD(){if(_adcHD)return _adcHD;if(!aresReady('cg_full_hd'))return null;const b=ARES_IMG.cg_full_hd,c=document.createElement('canvas');c.width=b.naturalWidth;c.height=b.naturalHeight;
 const g=c.getContext('2d');g.save();g.shadowColor='rgba(255,214,190,.45)';g.shadowBlur=18;g.drawImage(b,0,0);g.restore();g.drawImage(b,0,0);return _adcHD=c;}
function aresDialogueArt(){if(innerHeight>innerWidth){const hd=aresDialogueArtHD();if(hd)return hd;}if(_adc)return _adc;if(!aresReady('cg_full'))return null;const b=ARES_IMG.cg_full,P=12,W=b.naturalWidth+P*2,H=b.naturalHeight+P*2;
 const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 g.save();g.shadowColor='rgba(255,214,190,.5)';g.shadowBlur=9;g.drawImage(b,P,P);g.restore();g.drawImage(b,P,P);return _adc=c;}
// small face badge = the sheet's close-up for the line's emotion (shown at <= native size, anchored to the text box)
function aresFace(expr){expr={happy:'smile',laugh:'smile',smirk:'teasing',embarrassed:'blush',blushing:'blush',thinking:'serious'}[expr]||expr;if(!ARES_EXPR.includes(expr))expr='smile';const n='expr_'+(expr=='blush'?'blushing':expr);return aresReady(n+'_hd')?ARES_IMG[n+'_hd']:aresReady(n)?ARES_IMG[n]:null;}
['normal','smile','teasing','blushing','angry','serious','surprised','sad'].forEach(e=>{const im=new Image();im.src='assets/ares/expr_'+e+'_hd.png';ARES_IMG['expr_'+e+'_hd']=im;});
// small uses (applicant card, tenant list): the CG's upper body at native pixels, 420:520 aspect
const _apc={};
function aresPortrait(expr){if(_apc.b)return _apc.b;const b=ARES_IMG.cg;const c=document.createElement('canvas');if(!aresReady('cg')){c.width=420;c.height=520;return c;}
 const W=b.naturalWidth,H=Math.round(W*520/420);c.width=W;c.height=H;c.getContext('2d').drawImage(b,0,0,W,H,0,0,W,H);return _apc.b=c;}
// in-world sprite: chibi directions + walk frames; emotes use the sheet's emote sprites
const ARES_ICON={heart:'icon_heart',angry:'icon_angry',surprise:'icon_surprise',note:'icon_note'}; // no sweat mark on the sheet
const ARES_H=44; // on-screen chibi height (px); sprites are only ever drawn smaller than native
function aresChibi(c,x,y,o,t,walk){const face=o.face||'down',sd=face=='left'||face=='right';let n,flip=false;
 if(o.sit)n='emote_sit';else if(walk&&sd){n='walk_'+(Math.floor(t*12)%7);flip=face=='left';}else if(o.flex&&!walk)n='emote_happy';
 else n={down:'chibi_front',right:'chibi_right',up:'chibi_back',left:'chibi_left'}[face]||'chibi_front';
 const sg=c.createRadialGradient(x,y,0,x,y,11);sg.addColorStop(0,'rgba(20,10,30,.38)');sg.addColorStop(1,'rgba(20,10,30,0)');c.save();c.translate(x,y);c.scale(1,.38);c.translate(-x,-y);c.fillStyle=sg;c.beginPath();c.arc(x,y,11,0,7);c.fill();c.restore();
 if(!aresReady(n)||!aresReady('chibi_front'))return;const im=ARES_IMG[n],k=ARES_H/ARES_IMG.chibi_front.naturalHeight,w=im.naturalWidth*k,h=im.naturalHeight*k;
 const bob=walk&&!sd?Math.abs(Math.sin(t*10))*1.2:0;c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.translate(x,y-bob);if(flip)c.scale(-1,1);c.drawImage(im,-w/2,-h+1,w,h);c.restore();
 const ic=o.emote&&ARES_ICON[o.emote];if(ic&&aresReady(ic)){const I=ARES_IMG[ic],s=Math.min(1,16/I.naturalHeight),iw=I.naturalWidth*s,ih=I.naturalHeight*s,hb=Math.sin(t*4)*1.2;
  const ax=x+15,ay=y-bob-ARES_H+8+hb; // beside the top of his head (clear of the name tag), follows him
  c.save();c.imageSmoothingQuality='high';c.beginPath();c.ellipse(ax,ay-ih/2,iw/2+3,ih/2+3,0,0,7);c.fillStyle='rgba(255,255,255,.92)';c.fill();c.strokeStyle='rgba(42,26,32,.8)';c.lineWidth=1;c.stroke();
  c.drawImage(I,ax-iw/2,ay-ih,iw,ih);c.restore();}}
const _baseChibi=chibi;chibi=function(c,x,y,o,t,walk){if(o&&o.ares)return aresChibi(c,x,y,o,t,walk);return _baseChibi(c,x,y,o,t,walk);};
const _basePortrait=portrait;portrait=function(name,expr){if(name=='Ares')return aresPortrait(expr);return _basePortrait(name,expr);};
