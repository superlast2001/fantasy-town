import asyncio
from playwright.async_api import async_playwright
U='file:///workspace/fantasy-town/index.html'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();errs=[]
    def hook(pg):
      pg.on('console',lambda m: m.type=='error' and errs.append(m.text));pg.on('pageerror',lambda e: errs.append(str(e)))
    pg=await b.new_page(viewport={'width':1280,'height':720});hook(pg)
    await pg.goto(U);await pg.evaluate("localStorage.clear()");await pg.goto(U+'?t=8');await pg.wait_for_timeout(700)
    await pg.screenshot(path='/tmp/start.png')
    # advertise -> 3 applicants
    await pg.evaluate("FT.S.gold=3000;FT.condoAct('ad');sleep()");await pg.wait_for_timeout(300)
    print('apps',await pg.evaluate("FT.S.condo.apps.map(a=>a.n+':'+a.offer).join(',')"))
    await pg.evaluate("FT.condo=true;FT.apps=true");await pg.wait_for_timeout(400)
    await pg.screenshot(path='screenshot-advertise.png')
    print('pick unfurnished ->',await pg.evaluate("FT.condoAct('pick',0),FT.S.condo.tenants[0]"))
    await pg.evaluate("FT.enterRoom('f1');FT.setPos(9,10)")
    for (k,x,y) in [('stove',1,0),('fridge',4,0),('bed_wood',7,0),('toilet',17,0)]:
      await pg.evaluate(f"FT.tryPlace('{k}',{x},{y})")
    await pg.evaluate("FT.condoAct('pick',0)");await pg.wait_for_timeout(300)
    await pg.keyboard.press('Escape')
    print('tenants',await pg.evaluate("FT.S.condo.tenants"),'apps after',await pg.evaluate("FT.S.condo.apps"))
    # renovate + second tenant
    await pg.evaluate("FT.condoAct('reno');sleep();FT.S.rooms.f2.furn=[{k:'stove',x:1,y:0},{k:'fridge',x:4,y:0},{k:'bed',x:7,y:0},{k:'toilet',x:17,y:0}];FT.condoAct('ad');sleep();FT.condoAct('pick',1)");await pg.wait_for_timeout(200);await pg.keyboard.press('Escape')
    await pg.evaluate("FT.condoAct('reno');sleep();FT.S.rooms.f3.furn=[{k:'stove',x:1,y:0},{k:'fridge',x:4,y:0},{k:'bed',x:7,y:0},{k:'toilet',x:17,y:0}];FT.condoAct('ad');sleep();FT.condoAct('pick',2)");await pg.wait_for_timeout(200);await pg.keyboard.press('Escape')
    print('tenants',await pg.evaluate("FT.S.condo.tenants"))
    FULL=[('counter',0,0),('stove',1,0),('sink',2,0),('counter_wood',3,0),('fridge',4,0),('coffeebar',5,0),('spiceshelf',0,2),('clock',0,4),('dining',1,3),('fire_ext',5,4),('plant_monstera',0,5),
      ('bed_wood',7,0),('nightstand',9,0),('frame_family',10,0),('wardrobe',11,0),('desk',10,3),('rug_wood',7,3),('plant_palm',7,5),('lavalamp',12,3),
      ('bathtub',14,0),('bathsink',16,0),('toilet',17,0),('bathmat',16,2),('towelrack',14,4),('plant_palm',17,4),
      ('tv',1,7),('rug_lux',1,8),('sofa_wood',1,10),('bookshelf',4,7),('frame_art',0,8),('floorlamp',3,10),('plant_fiddle',0,11),('armchair_beach',5,9),
      ('fishtank',12,7),('dumbbells',14,10),('gymball',15,8),('surfboard',17,7),('poster_surf',0,10),('arcade',11,7),('coffeetable',6,11) ]
    await pg.evaluate("FT.S.rooms.f1.furn=[];FT.enterRoom('f1');FT.setPos(9,10)")
    bad=[]
    for (k,x,y) in FULL:
      r=await pg.evaluate(f"FT.tryPlace('{k}',{x},{y})")
      if r: bad.append((k,x,y,r))
    print('place fails',bad,'missing',await pg.evaluate("FT.missing('f1')"))
    # rule check: toilet in kitchen should fail
    print('rule',await pg.evaluate("FT.tryPlace('toilet',0,1)"))
    # furniture shop + decorate tenant 1 room with liked items
    await pg.evaluate("""(()=>{const n=FT.S.condo.tenants[0],c=FT.CHARS[n];FT.S.finv[c.fav]=1;FT.S.finv.plant=2;FT.S.finv.sofa=1;FT.S.finv.bookshelf=1;})()""")
    await pg.evaluate("FT.enterRoom('f1')");await pg.wait_for_timeout(200)
    fav=await pg.evaluate("FT.CHARS[FT.S.condo.tenants[0]].fav")
    keys=await pg.evaluate("Object.keys(FURN).filter(k=>!FURN[k].fixed)")
    h0=await pg.evaluate("FT.happiness(FT.S.condo.tenants[0])")
    print('fav place',fav,await pg.evaluate(f"FT.tryPlace('{fav}',8,9)"))
    print('happiness',h0,'->',await pg.evaluate("FT.happiness(FT.S.condo.tenants[0])"),'rent',await pg.evaluate("FT.rentOf(0)"))
    await pg.evaluate("FT.setTime(7.5);FT.setPos(9,10)");await pg.wait_for_timeout(700)
    await pg.screenshot(path='screenshot-apartment.png')
    await pg.evaluate("FT.enterRoom('office');FT.setPos(7,8)");await pg.wait_for_timeout(500);await pg.screenshot(path='screenshot-office.png')
    await pg.evaluate("FT.goArea('town',[30,7]);FT.act(30,4)");await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/shop.png');await pg.evaluate("closeMenu();FT.enterRoom('f1')")
    await pg.evaluate("FT.decor=true;FT.fsel=0;FT.ghost=[8,9]");await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/decor.png');await pg.evaluate("FT.decor=false")
    # condo tower
    await pg.evaluate("FT.condoAct('ad');FT.condo=true;FT.scroll=-1");await pg.wait_for_timeout(400);await pg.screenshot(path='screenshot-condo.png');await pg.evaluate("FT.condo=false")
    # schedules: daytime in town
    await pg.evaluate("FT.goArea('town',[17,13]);FT.setTime(10)");await pg.wait_for_timeout(300)
    print('10am',await pg.evaluate("Object.values(FT.TN).map(t=>t.n+'@'+t.place).join(' ')"))
    await pg.evaluate("FT.setTime(12.9)");await pg.evaluate("FT.fastForward(.25)")
    print('walking',await pg.evaluate("Object.values(FT.TN).map(t=>t.n+'@'+t.place+(t.dest?'>'+t.dest:'')).join(' ')"))
    n=await pg.evaluate("Object.values(FT.TN).find(t=>!t.inRoom).n")
    await pg.evaluate(f"FT.sel={n!r};FT.toggleFollow()");await pg.wait_for_timeout(1500)
    await pg.screenshot(path='screenshot-town.png')
    print('follow',await pg.evaluate("FT.follow"))
    # meet + hang out (friendship scene)
    await pg.evaluate(f"(()=>{{const t=FT.TN[{n!r}];FT.S.fr[{n!r}]={{p:4,talk:0,hang:0,scene:0}};FT.setPos(Math.floor(t.px)+1,Math.floor(t.py));}})()")
    await pg.evaluate(f"FT.hangOut({n!r})");await pg.wait_for_timeout(1500)
    await pg.screenshot(path='screenshot-dialogue.png')
    print('fr',await pg.evaluate(f"JSON.stringify(FT.S.fr[{n!r}])"),'lv',await pg.evaluate(f"FT.frLv({n!r})"))
    await pg.click('#dlgSkip');await pg.evaluate("FT.follow=null;FT.sel=null")
    await pg.evaluate("FT.setTime(18.5)");await pg.wait_for_timeout(500);await pg.screenshot(path='/tmp/town-evening.png')
    await pg.evaluate("FT.setTime(21.5)");await pg.wait_for_timeout(300)
    print('9pm',await pg.evaluate("Object.values(FT.TN).map(t=>t.n+'@'+t.place).join(' ')"))
    await pg.evaluate("FT.setTime(11);FT.map=true");await pg.wait_for_timeout(500);await pg.screenshot(path='screenshot-map.png');await pg.evaluate("FT.map=false")
    for k in ['cafe','restaurant','fshop','studio']:
      await pg.evaluate(f"FT.act(...[{{cafe:[10,4],restaurant:[22,4],fshop:[29,4],studio:[26,15]}}['{k}']].flat())");await pg.wait_for_timeout(150);await pg.screenshot(path=f'/tmp/menu-{k}.png');await pg.evaluate("closeMenu()")
    # tap tenant on screen to select
    await pg.evaluate("FT.setPos(17,13)");await pg.wait_for_timeout(500)
    # reload persistence
    await pg.evaluate("save(1)");await pg.reload();await pg.wait_for_timeout(500)
    print('reload',await pg.evaluate("FT.S.day"),await pg.evaluate("FT.S.condo.tenants"))
    # phone landscape
    ph=await b.new_page(viewport={'width':844,'height':390},has_touch=True,is_mobile=True,device_scale_factor=2);hook(ph)
    await ph.goto(U+'?t=11');await ph.wait_for_timeout(700)
    await ph.evaluate("FT.S.rooms.f1.furn=[{k:'stove',x:1,y:0},{k:'fridge',x:4,y:0},{k:'bed',x:7,y:0},{k:'toilet',x:17,y:0}];FT.S.condo.apps=[{n:'Amber',offer:50}];FT.condoAct('pick',0)");await ph.click('#dlgSkip');await ph.evaluate("FT.goArea('town',[17,13]);FT.setTime(11)");await ph.wait_for_timeout(400)
    await ph.touchscreen.tap(600,250);await ph.wait_for_timeout(900)
    nn=await ph.evaluate("Object.values(FT.TN).find(t=>!t.inRoom)?.n")
    if nn: await ph.evaluate(f"FT.sel={nn!r};FT.toggleFollow()")
    await ph.wait_for_timeout(1200);await ph.screenshot(path='screenshot-phone.png')
    print('phone pos',await ph.evaluate("FT.S.px/16+','+FT.S.py/16"))
    await ph.evaluate("FT.condo=true;FT.scroll=-1");await ph.wait_for_timeout(300);await ph.screenshot(path='/tmp/phone-condo.png');await ph.evaluate("FT.condo=false")
    await ph.evaluate("FT.S.condo.apps=null;FT.S.condo.ad=1;sleep();FT.apps=true");await ph.wait_for_timeout(300);await ph.screenshot(path='/tmp/phone-apps.png');await ph.evaluate("FT.apps=false")
    await ph.evaluate("FT.map=true");await ph.wait_for_timeout(300);await ph.screenshot(path='/tmp/phone-map.png')
    pp=await b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True);hook(pp);await pp.goto(U);await pp.wait_for_timeout(400);await pp.screenshot(path='/tmp/phone-portrait.png')
    print('ERRORS',errs);await b.close()
asyncio.run(main())
