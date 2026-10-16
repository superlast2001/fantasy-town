# v0.0.2.2 portrait screenshots: dialogue room/town, gym, 100% NPC-vs-Ares crop, chibi crop
import asyncio,subprocess
from playwright.async_api import async_playwright
U='file:///workspace/fantasy-town/index.html'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    for dp in [1,3]:
      pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=dp)
      pg.on('console',lambda m: m.type=='error' and errs.append(m.text));pg.on('pageerror',lambda e: errs.append(str(e)))
      sx='390x844' if dp==1 else '1170x2532'
      await pg.goto(U);await pg.evaluate("localStorage.clear()");await pg.goto(U+'?t=8');await pg.wait_for_timeout(800)
      await pg.evaluate("window.NOGREET=1;FT.condoAct('ad');sleep();closeMenu();FT.condoAct('pick',0)");await pg.wait_for_timeout(300)
      await pg.evaluate("document.getElementById('dlg').style.display=='block'&&document.getElementById('dlgSkip').click();closeMenu()")
      await pg.evaluate("window.NOGREET=0;FT.S.fr.Ares={p:12,talk:0,hang:0,scene:0};FT.setTime(21);FT.enterRoom('f1')");await pg.wait_for_timeout(3800)
      await pg.screenshot(path=f'screenshot-v0022-dialogue-room-{sx}.png');await pg.evaluate("document.getElementById('dlgSkip').click()")
      await pg.evaluate("closeMenu();FT.setTime(10);FT.goArea('town',[32,19]);FT.TN.Ares.px=32.5;FT.TN.Ares.py=18.4;FT.setPos(32,19)");await pg.wait_for_timeout(600)
      tb=pg.get_by_text('TALK · ARES')
      if await tb.count(): await tb.first.click();await pg.wait_for_timeout(3800);await pg.screenshot(path=f'screenshot-v0022-dialogue-town-{sx}.png');await pg.evaluate("document.getElementById('dlgSkip').click()")
      else: print('no talk button')
      await pg.evaluate("enterGym()");await pg.wait_for_timeout(1200);await pg.evaluate("document.getElementById('dlg').style.display=='block'&&document.getElementById('dlgSkip').click();FT.setPos(11,11);selT=null");await pg.wait_for_timeout(1600)
      await pg.screenshot(path=f'screenshot-v0022-gym-{sx}.png')
      if dp==3:
        await pg.evaluate("window.ZOOM=1.75;window.CAMT=[15,4]");await pg.wait_for_timeout(500);await pg.screenshot(path='screenshot-v0022-gym-machines-1170x2532.png');await pg.evaluate("window.ZOOM=2.6;window.CAMT=[12.5,9.2]");await pg.wait_for_timeout(500);await pg.screenshot(path='screenshot-v0022-chibi-zoom-1170x2532.png');await pg.evaluate("window.ZOOM=0")
    print('ERRORS',errs);await b.close()
asyncio.run(main())
subprocess.run(["python3","-c","from PIL import Image;im=Image.open('screenshot-v0022-gym-1170x2532.png');im.crop((150,900,1020,1700)).save('screenshot-v0022-gym-npcs-vs-ares-100pct.png');im2=Image.open('screenshot-v0022-gym-machines-1170x2532.png');im2.crop((0,500,1170,1500)).save('screenshot-v0022-gym-machines-100pct.png');im3=Image.open('screenshot-v0022-chibi-zoom-1170x2532.png');im3.crop((285,700,885,1400)).save('screenshot-v0022-ares-chibi-100pct.png')"])
