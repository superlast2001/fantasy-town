import asyncio
from playwright.async_api import async_playwright
U='file:///workspace/fantasy-town/index.html'
GIVE="Object.assign(FT.S.inv,{wood:200,ore:80,scrap:80,shell:30,neon:30});FT.S.gold=3000;"
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    def hook(pg):
      pg.on('console',lambda m: m.type=='error' and errs.append(m.text));pg.on('pageerror',lambda e: errs.append(str(e)))
    pg=await b.new_page(viewport={'width':1280,'height':720});hook(pg)
    await pg.goto(U+'?t=21');await pg.evaluate("localStorage.clear()");await pg.goto(U+'?t=21');await pg.wait_for_timeout(800)
    await pg.screenshot(path='/tmp/start.png')
    await pg.evaluate(GIVE+'FT.S.nodes.village=[];FT.S.min=18.6*60')
    # place buildings via build mode
    plan=[(5,26,15,'down'),(4,15,15,'down'),(6,19,16,'down'),(6,37,16,'down'),(7,31,15,'down'),(8,22,25,'down'),(9,40,9,'down'),(10,24,4,'down'),(11,36,4,'down'),(12,26,20,'down')]
    for (i,x,y,f) in plan:
      r=await pg.evaluate(f"FT.build=true;FT.bsel={i};FT.setPos({x},{y-1});FT.S.face='{f}';FT.place();FT.S.blds.length")
    for x in range(12,44,4): await pg.evaluate(f"FT.bsel=1;FT.setPos({x},10);FT.S.face='down';FT.place()")
    for x in range(8,14): await pg.evaluate(f"FT.bsel=2;FT.setPos({x},14);FT.S.face='down';FT.place()")
    print('built',await pg.evaluate("FT.S.blds.map(b=>b.id).join(',')"))
    await pg.evaluate("FT.build=true;FT.bsel=6;FT.setPos(28,20);FT.S.face='right'");await pg.wait_for_timeout(1500)
    await pg.screenshot(path='screenshot-build.png')
    # farming in plot at 22,13
    await pg.evaluate("FT.build=false;FT.setPos(15,14);FT.S.face='down';FT.S.sel=0;FT.act();FT.S.sel=1;FT.act();FT.S.sel=4;FT.act()")
    print('soil',await pg.evaluate("JSON.stringify(FT.S.soil)"))
    await pg.evaluate("FT.setPos(20,16);FT.S.face='left';FT.S.min=22*60");await pg.wait_for_timeout(2500)
    await pg.screenshot(path='screenshot-village.png')
    # repairs and travel
    await pg.evaluate("FT.goArea('forest',[29,12]);FT.S.face='right';FT.act()");await pg.wait_for_timeout(200)
    await pg.evaluate("doRepair('bridge')");print('bridge',await pg.evaluate("FT.S.flags.bridge"))
    await pg.keyboard.down('d');await pg.wait_for_timeout(2000);await pg.keyboard.up('d');print('area after walk',await pg.evaluate("FT.S.area"))
    await pg.evaluate("FT.goArea('mine');FT.S.flags.portal=1;FT.rebuild('mine')")
    await pg.evaluate("FT.map=true");await pg.wait_for_timeout(600);await pg.screenshot(path='screenshot-worldmap.png')
    await pg.evaluate("FT.travel(FT.ROUTES.find(r=>r.type=='magic'))");print('area',await pg.evaluate("FT.S.area"))
    await pg.wait_for_timeout(600);await pg.screenshot(path='/tmp/city.png')
    for a in ['island','badlands','mine']:
      await pg.evaluate(f"FT.goArea('{a}')");await pg.wait_for_timeout(400);await pg.screenshot(path=f'/tmp/{a}.png')
    await pg.evaluate("sleep()");await pg.goto(U+'?t=20');await pg.wait_for_timeout(500);print('reload day',await pg.evaluate("FT.S.day+' '+FT.S.blds.length"))
    ctxp=await b.new_context(viewport={'width':844,'height':390},has_touch=True,is_mobile=True,device_scale_factor=1)
    sv=await pg.evaluate("localStorage.getItem('fantasytown_save_v6')");m=await ctxp.new_page();hook(m);await m.goto(U);await m.evaluate('s=>localStorage.setItem("fantasytown_save_v6",s)',sv);await m.goto(U+'?t=21');await m.wait_for_timeout(500)
    await m.evaluate("FT.goArea('village');FT.setPos(23,19);FT.S.face='down'");await m.wait_for_timeout(1200);await m.screenshot(path='screenshot-phone.png')
    await m.tap('[data-k=build]');await m.wait_for_timeout(300);await m.screenshot(path='/tmp/phone-build.png')
    await m.tap('[data-k=map]');await m.wait_for_timeout(300);await m.screenshot(path='/tmp/phone-map.png')
    m=await (await b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)).new_page();await m.goto(U);await m.wait_for_timeout(500);await m.screenshot(path='/tmp/phone-portrait.png')
    print('ERRORS',errs);await b.close()
asyncio.run(main())
