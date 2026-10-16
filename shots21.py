# v0.0.2.1 portrait screenshots (390x844) + 100% NPC crop at dpr 3 + console-error check
import asyncio
from playwright.async_api import async_playwright
U='file:///workspace/fantasy-town/index.html'
GEAR="[{k:'squatrack',x:1,y:10},{k:'treadmill',x:4,y:10},{k:'punchbag',x:6,y:10},{k:'dumbbells',x:8,y:10},{k:'kettlebells',x:10,y:10},{k:'weightbench',x:16,y:11},{k:'yogamat',x:19,y:10},{k:'proteinshelf',x:21,y:10},{k:'pullupbar',x:23,y:10},{k:'gymfloor',x:16,y:13},{k:'sofa_l',x:20,y:14},{k:'plant_snake',x:25,y:16},{k:'mirrorwall',x:0,y:11,v:1},{k:'mirrorwall',x:0,y:12,v:1},{k:'mirrorwall',x:0,y:13,v:1},{k:'poster_gym3',x:0,y:15,v:1},{k:'poster_gym2',x:0,y:16,v:1}]"
async def shot(pg,name,clip=None):
  await pg.screenshot(path=f'screenshot-v0021-{name}.png',clip=clip)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    for dp in [1,3]:
      pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=dp)
      pg.on('console',lambda m: m.type=='error' and errs.append(m.text));pg.on('pageerror',lambda e: errs.append(str(e)))
      await pg.goto(U);await pg.evaluate("localStorage.clear()");await pg.goto(U+'?t=8');await pg.wait_for_timeout(700)
      await pg.evaluate("window.NOGREET=1;FT.condoAct('ad');sleep();closeMenu();FT.condoAct('pick',0)");await pg.wait_for_timeout(300)
      await pg.evaluate("document.getElementById('dlg').style.display=='block'&&document.getElementById('dlgSkip').click();closeMenu();S.gold=5000")
      tn=await pg.evaluate("S.condo.tenants[0]");print('tenant',tn)
      if dp==1:
        await pg.evaluate("furnShop('gym')");await pg.wait_for_timeout(500);await shot(pg,'shop-390x844')
        await pg.evaluate("menuEl.scrollTop=900");await pg.wait_for_timeout(200);await shot(pg,'shop2-390x844');await pg.evaluate("closeMenu()")
      await pg.evaluate(f"S.rooms.f1.furn.push(...{GEAR});FT.setTime(21);FT.enterRoom('f1');FT.setPos(13,16)");await pg.wait_for_timeout(800)
      if dp==1:
        await shot(pg,'unit-gym-390x844')
        await pg.evaluate("window.ZOOM=1.9;window.CAMT=[5.5,12.5]");await pg.wait_for_timeout(500);await shot(pg,'unit-gym-zoom-390x844');await pg.evaluate("window.ZOOM=0")
        await pg.evaluate("S.fr.Ares={p:30,talk:0,hang:0,scene:0,dated:1};furnUse(S.rooms.f1.furn.find(f=>f.k=='treadmill'))");await pg.wait_for_timeout(2500);await shot(pg,'interaction-390x844')
        await pg.evaluate("document.getElementById('dlgSkip').click()");await pg.wait_for_timeout(300)
        await pg.evaluate("relMenu('Ares')");await pg.wait_for_timeout(500);await shot(pg,'hearts-390x844')
        await pg.evaluate("menuEl.scrollTop=420");await pg.wait_for_timeout(200);await shot(pg,'hearts2-390x844');await pg.evaluate("closeMenu()")
      await pg.evaluate("FT.setTime(10);FT.goArea('town',[32,18]);enterGym()");await pg.wait_for_timeout(1200);await pg.evaluate("FT.setPos(11,11)")
      await pg.evaluate("document.getElementById('dlg').style.display=='block'&&document.getElementById('dlgSkip').click()");await pg.wait_for_timeout(600)
      if dp==1: await shot(pg,'gym-390x844')
      else:
        await shot(pg,'gym-1170x2532')
      if dp==1:
        await pg.evaluate("sleep()");await pg.wait_for_timeout(900);await shot(pg,'rent-390x844')
    print('ERRORS',errs);await b.close()
asyncio.run(main())
import subprocess;subprocess.run(["python3","-c","from PIL import Image;Image.open(\"screenshot-v0021-gym-1170x2532.png\").crop((0,700,1170,1700)).save(\"screenshot-v0021-gym-npcs-100pct-crop.png\")"])
