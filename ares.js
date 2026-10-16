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
// emotion of the line -> base art (CG or matching full-body pose) + matching close-up expression
const ARES_BASE={normal:'cg',smile:'cg',teasing:'pose_teasing',blush:'pose_embarrassed',angry:'pose_angry',serious:'pose_serious',surprised:'pose_surprised',sad:'pose_thinking'};
const _apc={};
function aresPortrait(expr){expr={happy:'smile',laugh:'smile',smirk:'teasing',embarrassed:'blush',blushing:'blush',thinking:'sad'}[expr]||expr;if(!ARES_EXPR.includes(expr))expr='smile';
 if(_apc[expr])return _apc[expr];const c=document.createElement('canvas');c.width=420;c.height=520;const g=c.getContext('2d');
 const base=ARES_BASE[expr],face='expr_'+(expr=='blush'?'blushing':expr);if(!aresReady(base)||!aresReady(face))return c; // not cached until loaded
 const b=ARES_IMG[base];
 if(base=='cg'){const k=420/b.naturalWidth;g.drawImage(b,0,0,b.naturalWidth,b.naturalHeight,0,0,420,b.naturalHeight*k);} // upper body of the CG
 else{const k=520/b.naturalHeight;g.drawImage(b,(420-b.naturalWidth*k)/2,0,b.naturalWidth*k,520);}
 const f=ARES_IMG[face],fw=150,fh=fw*f.naturalHeight/f.naturalWidth,fx=420-fw-8,fy=8;g.save();g.beginPath();g.roundRect(fx,fy,fw,fh,14);g.clip();g.drawImage(f,fx,fy,fw,fh);g.restore();
 g.beginPath();g.roundRect(fx,fy,fw,fh,14);g.lineWidth=5;g.strokeStyle='#e8323a';g.stroke();
 return _apc[expr]=c;}
// in-world sprite: chibi directions + walk frames; emotes use the sheet's emote sprites
const ARES_EMO={heart:'emote_blush',angry:'emote_angry',surprise:'emote_surprised',note:'emote_happy',sweat:'emote_idle'};
const ARES_H=44; // on-screen chibi height (px), uniform scale
function aresChibi(c,x,y,o,t,walk){const face=o.face||'down';let n,flip=false;
 if(o.sit)n='emote_sit';else if(walk&&(face=='left'||face=='right')){n='walk_'+(Math.floor(t*12)%7);flip=face=='left';}
 else if(o.emote&&ARES_EMO[o.emote])n=ARES_EMO[o.emote];else if(o.flex)n='emote_happy';
 else n={down:'chibi_front',right:'chibi_right',up:'chibi_back',left:'chibi_left'}[face]||'chibi_front';
 shadowE(c,x,y,9,3.6);if(!aresReady(n))return;const im=ARES_IMG[n],k=ARES_H/ARES_IMG.chibi_front.naturalHeight,w=im.naturalWidth*k,h=im.naturalHeight*k;
 const bob=walk&&!flip&&!(face=='left'||face=='right')?Math.abs(Math.sin(t*10))*1.2:0;c.save();c.translate(x,y-bob);if(flip)c.scale(-1,1);c.imageSmoothingQuality='high';c.drawImage(im,-w/2,-h+1,w,h);c.restore();}
const _baseChibi=chibi;chibi=function(c,x,y,o,t,walk){if(o&&o.ares)return aresChibi(c,x,y,o,t,walk);return _baseChibi(c,x,y,o,t,walk);};
const _basePortrait=portrait;portrait=function(name,expr){if(name=='Ares')return aresPortrait(expr);return _basePortrait(name,expr);};
