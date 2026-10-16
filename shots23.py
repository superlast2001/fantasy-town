import asyncio
from playwright.async_api import async_playwright
U='file:///workspace/fantasy-town/index.html'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
    pg.on('console',lambda m: m.type=='error' and errs.append(m.text));pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.goto(U);await pg.evaluate("localStorage.clear()");await pg.goto(U+'?t=10');await pg.wait_for_timeout(800)
    await pg.evaluate("window.NOGREET=1;FT.condoAct('ad');sleep();closeMenu();FT.condoAct('pick',0)");await pg.wait_for_timeout(300)
    await pg.evaluate("document.getElementById('dlg').style.display=='block'&&document.getElementById('dlgSkip').click();closeMenu();FT.enterRoom('office')");await pg.wait_for_timeout(500)
    await pg.evaluate("FT.act(...FT.S&&[12,19])");await pg.wait_for_timeout(500);await pg.screenshot(path='screenshot-v0023-travel-390x844.png')
    print('menu',(await pg.evaluate("menuEl.innerText.slice(0,40)")).replace('\n',' '))
    await pg.evaluate("travelTo('cafe')");await pg.wait_for_timeout(500);print('at',await pg.evaluate("area.id+' '+Math.floor(S.px/16)+','+Math.floor(S.py/16)"))
    await pg.evaluate("travelTo('gym')");await pg.wait_for_timeout(1200);await pg.evaluate("dlg.on&&document.getElementById('dlgSkip').click()");print('at',await pg.evaluate("area.id"))
    await pg.locator('#btravel').dispatch_event('pointerdown');await pg.wait_for_timeout(300);print('travel btn',await pg.evaluate("menuOpen()"));await pg.evaluate("closeMenu()")
    await pg.evaluate("settings()");await pg.wait_for_timeout(200);await pg.evaluate("toggleDev();closeMenu()")
    await pg.evaluate("devDo('dbg');devDo('gold',1000);devDo('rel',6);devDo('floors');devDo('furn',3);devDo('hour')");await pg.wait_for_timeout(700)
    print('dev',await pg.evaluate("[localStorage.getItem('ft_dev'),S.gold,frLv('Ares'),S.condo.floors,document.getElementById('dbgov').textContent]"))
    await pg.screenshot(path='screenshot-v0023-dev-panel-390x844.png')
    await pg.evaluate("devDo('tp','f2')");await pg.wait_for_timeout(500);print('tp',await pg.evaluate("area.id"))
    await pg.reload();await pg.wait_for_timeout(800);print('persist',await pg.evaluate("document.getElementById('bdev').style.display"))
    print('ERRORS',errs);await b.close()
asyncio.run(main())
