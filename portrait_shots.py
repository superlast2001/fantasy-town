# Portrait screenshots (390x844 and 720x1280) + console-error check
import asyncio,sys
from playwright.async_api import async_playwright
U='file:///workspace/fantasy-town/index.html'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    for (w,h,dp) in [(390,844,1),(720,1280,1),(360,780,3)]:
      pg=await b.new_page(viewport={'width':w,'height':h},has_touch=True,is_mobile=True,device_scale_factor=dp)
      pg.on('console',lambda m: m.type=='error' and errs.append(m.text));pg.on('pageerror',lambda e: errs.append(str(e)))
      sfx=f'{w*dp}x{h*dp}';await pg.goto(U);await pg.evaluate("localStorage.clear()");await pg.goto(U+'?t=8');await pg.wait_for_timeout(700)
      rot=await pg.evaluate("document.getElementById('rot')?'present':'removed'")
      await pg.evaluate("FT.condoAct('ad');sleep();FT.condoAct('pick',0)");await pg.wait_for_timeout(300)
      await pg.evaluate("document.getElementById('dlg').style.display=='block'&&document.getElementById('dlgSkip').click()")
      await pg.evaluate("FT.condo=true");await pg.wait_for_timeout(500);await pg.screenshot(path=f'screenshot-portrait-condo-{sfx}.png');await pg.evaluate("FT.condo=false")
      window_ng="window.NOGREET=1;"
      await pg.evaluate(window_ng+"FT.enterRoom('f1');FT.setPos(13,16)");await pg.wait_for_timeout(600);await pg.screenshot(path=f'screenshot-portrait-room-{sfx}.png')
      await pg.evaluate("window.NOGREET=0;FT.S.fr.Ares={p:12,talk:0,hang:0,scene:0};FT.enterRoom('f1')");await pg.wait_for_timeout(3500);await pg.screenshot(path=f'screenshot-portrait-dialogue-room-{sfx}.png')
      geo=await pg.evaluate("""(()=>{const r=e=>{const q=document.getElementById(e);if(!q||q.offsetParent===null&&getComputedStyle(q).position!='fixed')return null;const b=q.getBoundingClientRect();return [Math.round(b.left),Math.round(b.top),Math.round(b.right),Math.round(b.bottom)]};return {portrait:r('dlgPortrait'),box:r('dlgBox'),face:r('dlgFace'),back:r('back')}})()""")
      await pg.evaluate("document.getElementById('dlgSkip').click()")
      await pg.evaluate("FT.goArea('town',[24,23]);FT.setTime(22)");await pg.wait_for_timeout(500);await pg.screenshot(path=f'screenshot-portrait-town-{sfx}.png')
      await pg.evaluate("FT.TN.Ares.px=24.5;FT.TN.Ares.py=22.4;FT.setPos(24,23)");await pg.wait_for_timeout(400)
      tb=pg.get_by_text('TALK · ARES')
      if await tb.count(): await tb.first.click();await pg.wait_for_timeout(3500);await pg.screenshot(path=f'screenshot-portrait-dialogue-town-{sfx}.png')
      else: print('no talk button',sfx)
      print(sfx,'rot',rot,'geo',geo)
    print('ERRORS',errs);await b.close()
asyncio.run(main())
