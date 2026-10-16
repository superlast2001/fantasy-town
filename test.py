import asyncio
from playwright.async_api import async_playwright
U='file:///workspace/fantasy-town/index.html'
GIVE="Object.assign(FT.S.inv,{wood:300,ore:120,scrap:80,shell:30,neon:30,fish:6});FT.S.gold=5000;"
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    def hook(pg):
      pg.on('console',lambda m: m.type=='error' and errs.append(m.text));pg.on('pageerror',lambda e: errs.append(str(e)))
    pg=await b.new_page(viewport={'width':1280,'height':720});hook(pg)
    await pg.goto(U);await pg.evaluate("localStorage.clear()");await pg.goto(U+'?t=10');await pg.wait_for_timeout(800)
    await pg.screenshot(path='/tmp/start.png')
    await pg.evaluate(GIVE+"FT.S.nodes.village=[]")
    plan=[(5,26,14),(4,14,15),(6,32,15),(7,20,24),(8,37,8),(9,24,3),(10,33,3),(11,25,19)]
    for (i,x,y) in plan:
      await pg.evaluate(f"FT.build=true;FT.bsel={i};FT.ghost=[{x},{y}];FT.place()")
    for x in range(10,38,4): await pg.evaluate(f"FT.bsel=1;FT.ghost=[{x},10];FT.place()")
    for x in range(8,13): await pg.evaluate(f"FT.bsel=2;FT.ghost=[{x},14];FT.place()")
    print('built',await pg.evaluate("FT.S.blds.map(b=>b.id).join(',')"))
    await pg.evaluate("FT.S.condo.tenants=['Pip'];FT.S.condo.floors=2;FT.S.condo.tenants=['Pip','Nova'];FT.S.rooms.f2={wall:'#d0e0f8',floor:21,furn:[{k:'bed',x:1,y:1},{k:'lamp',x:7,y:1}]};FT.S.condo.building=1;FT.refresh()")
    await pg.evaluate("FT.build=true;FT.bsel=10;FT.setPos(18,13);FT.ghost=[19,17];FT.S.min=17.5*60");await pg.wait_for_timeout(1200)
    await pg.screenshot(path='screenshot-build.png')
    await pg.evaluate("FT.build=false;FT.setPos(13,13);FT.S.min=20.5*60;FT.walkTo(14,15)");await pg.wait_for_timeout(1500)
    await pg.evaluate("FT.walkTo(14,15)");await pg.wait_for_timeout(300);await pg.evaluate("FT.walkTo(14,15)");await pg.wait_for_timeout(300)
    print('soil',await pg.evaluate("JSON.stringify(FT.S.soil)"))
    await pg.evaluate("FT.setPos(12,12);FT.S.min=10*60");await pg.wait_for_timeout(1500);await pg.screenshot(path='screenshot-iso-village.png')
    await pg.evaluate("FT.S.min=21*60");await pg.wait_for_timeout(800);await pg.screenshot(path='/tmp/village-night.png')
    # condo
    await pg.evaluate("FT.condo=true;FT.scroll=0");await pg.wait_for_timeout(500);await pg.screenshot(path='screenshot-condo.png')
    # room decor
    await pg.evaluate("FT.condo=false;FT.enterRoom('f1');FT.S.min=15*60")
    for (k,x,y) in [('sofa',1,4),('tv',3,1),('fishtank',6,1),('plant',8,1),('rug',2,3),('bathtub',6,5),('lamp',0,3),('bookshelf',0,5),('arcade',8,4)]:
      r=await pg.evaluate(f"(()=>{{const L=Object.keys(FT.S.rooms);FT.decor=true;FT.fsel=['bed','sofa','tv','fishtank','plant','rug','bathtub','lamp','table','bookshelf','arcade','fridge'].indexOf('{k}');FT.ghost=[{x},{y}];FT.placeFurn();FT.decor=false;return FT.S.rooms.f1.furn.length}})()")
    print('furn',await pg.evaluate("FT.S.rooms.f1.furn.map(f=>f.k).join(',')"))
    await pg.evaluate("FT.setPos(4,4)");await pg.wait_for_timeout(1200);await pg.screenshot(path='screenshot-room.png')
    await pg.evaluate("FT.startDialogue('Pip',FT.CHARS.Pip.talks[0])");await pg.wait_for_timeout(1800);await pg.screenshot(path='screenshot-dialogue.png')
    for n in ['Mira','Bolt','Old Coral','Nova','Sigil','Amber']:
      await pg.evaluate(f"FT.startDialogue('{n}',FT.CHARS['{n}'].talks[0])");await pg.wait_for_timeout(300);await pg.screenshot(path=f'/tmp/p-{n}.png')
    await pg.keyboard.press('Escape')
    await pg.evaluate("FT.goArea('village');FT.map=true");await pg.wait_for_timeout(600);await pg.screenshot(path='screenshot-worldmap.png')
    await pg.evaluate("FT.map=false")
    for a in ['forest','badlands','mine','island','city']:
      await pg.evaluate(f"FT.goArea('{a}')");await pg.wait_for_timeout(400);await pg.screenshot(path=f'/tmp/{a}.png')
    await pg.evaluate("FT.goArea('room:office');sleep()");await pg.wait_for_timeout(300)
    print('after sleep',await pg.evaluate("JSON.stringify(FT.S.condo)+' '+FT.S.gold"))
    await pg.goto(U);await pg.wait_for_timeout(500);print('reload',await pg.evaluate("FT.S.day+' '+FT.S.area"))
    sv=await pg.evaluate("localStorage.getItem('fantasytown_save_v7')")
    ctxp=await b.new_context(viewport={'width':844,'height':390},has_touch=True,is_mobile=True)
    m=await ctxp.new_page();hook(m);await m.goto(U);await m.evaluate('s=>localStorage.setItem("fantasytown_save_v7",s)',sv);await m.goto(U+'?t=19')
    await m.evaluate("FT.goArea('village',[12,13])");await m.wait_for_timeout(1500);await m.screenshot(path='screenshot-phone.png')
    await m.tap('canvas',position={'x':600,'y':200});await m.wait_for_timeout(1500);await m.screenshot(path='/tmp/phone-tap.png')
    print('phone pos',await m.evaluate("FT.S.px/16+','+FT.S.py/16"))
    await m.evaluate("FT.scroll=-1;FT.condo=true");await m.wait_for_timeout(300);await m.screenshot(path='/tmp/phone-condo.png')
    await m.evaluate("FT.condo=false;FT.startDialogue('Mira',FT.CHARS.Mira.talks[0])");await m.wait_for_timeout(1500);await m.screenshot(path='/tmp/phone-dlg.png')
    pm=await (await b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)).new_page();hook(pm);await pm.goto(U);await pm.wait_for_timeout(500);await pm.screenshot(path='/tmp/phone-portrait.png')
    print('ERRORS',errs);await b.close()
asyncio.run(main())
