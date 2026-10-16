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
    print('starter unit',await pg.evaluate("FT.S.rooms.f1.furn.map(f=>f.k).join(',')"),'missing',await pg.evaluate("FT.missing('f1')"))
    await pg.evaluate("FT.apps=false;FT.condo=false;FT.enterRoom('f1');FT.setPos(13,16)");await pg.wait_for_timeout(600);await pg.screenshot(path='screenshot-starter-unit.png');await pg.evaluate("FT.apps=true");await pg.evaluate("FT.goArea('town',[4,7])")
    print('pick starter unit ->',await pg.evaluate("FT.condoAct('pick',0),FT.S.condo.tenants[0]"))
    await pg.evaluate("FT.enterRoom('f1');FT.setPos(13,16)")
    for (k,x,y) in [('stove',1,0),('fridge',4,0),('bed_wood',10,1),('toilet',25,0)]:
      await pg.evaluate(f"FT.tryPlace('{k}',{x},{y})")
    await pg.evaluate("FT.condoAct('pick',0)");await pg.wait_for_timeout(300)
    await pg.keyboard.press('Escape')
    print('tenants',await pg.evaluate("FT.S.condo.tenants"),'apps after',await pg.evaluate("FT.S.condo.apps"))
    # renovate + second tenant
    await pg.evaluate("FT.condoAct('reno');sleep();FT.S.rooms.f2.furn=[{k:'stove',x:1,y:0},{k:'fridge',x:4,y:0},{k:'bed',x:10,y:1},{k:'toilet',x:25,y:0}];FT.condoAct('ad');sleep();FT.condoAct('pick',1)");await pg.wait_for_timeout(200);await pg.keyboard.press('Escape')
    await pg.evaluate("FT.condoAct('reno');sleep();FT.S.rooms.f3.furn=[{k:'stove',x:1,y:0},{k:'fridge',x:4,y:0},{k:'bed',x:10,y:1},{k:'toilet',x:25,y:0}];FT.condoAct('ad');sleep();FT.condoAct('pick',2)");await pg.wait_for_timeout(200);await pg.keyboard.press('Escape')
    print('tenants',await pg.evaluate("FT.S.condo.tenants"))
    FULL=await pg.evaluate("FT.DEMO()")
    await pg.evaluate("FT.S.rooms.f1.furn=[];FT.enterRoom('f1');FT.setPos(13,16)")
    bad=[]
    for it in FULL:
      k,x,y=it[0],it[1],it[2];rr=it[3] if len(it)>3 else 0
      r=await pg.evaluate(f"FT.tryPlace('{k}',{x},{y},{rr})")
      if r: bad.append((k,x,y,r))
    print('room size',await pg.evaluate("FT.area.cols+'x'+FT.area.rows"),'items',len(FULL))
    # rotation rules: rotated sofa footprint must block overlaps / walls
    print('rot overlap',await pg.evaluate("FT.tryPlace('sofa',4,13,1)"),'| rot wall',await pg.evaluate("FT.tryPlace('sofa',9,7,1)"))
    # NPC pathing: tenant home spot reachable from the door
    print('home reachable',await pg.evaluate("(()=>{const a=FT.area,h=FT.homeSpot('f1');return !!FT.bfsOn(a,a.exit[0],a.exit[1]-1,(x,y)=>x==Math.floor(h[0])&&y==Math.floor(h[1]))})()"))
    print('all rooms reachable',await pg.evaluate("(()=>{const a=FT.area;return [[4,4],[14,5],[22,5],[20,13]].map(([x,y])=>!!FT.bfsOn(a,13,16,(i,j)=>Math.abs(i-x)+Math.abs(j-y)<=1)).join()})()"))
    print('place fails',bad,'missing',await pg.evaluate("FT.missing('f1')"))
    # rule check: toilet in kitchen should fail
    print('rule',await pg.evaluate("FT.tryPlace('toilet',0,1)"))
    # furniture shop + decorate tenant 1 room with liked items
    await pg.evaluate("""(()=>{const n=FT.S.condo.tenants[0],c=FT.CHARS[n];FT.S.finv[c.fav]=1;FT.S.finv.plant=2;FT.S.finv.sofa=1;FT.S.finv.bookshelf=1;})()""")
    await pg.evaluate("FT.enterRoom('f1')");await pg.wait_for_timeout(200)
    fav=await pg.evaluate("FT.CHARS[FT.S.condo.tenants[0]].fav")
    keys=await pg.evaluate("Object.keys(FURN).filter(k=>!FURN[k].fixed)")
    h0=await pg.evaluate("FT.happiness(FT.S.condo.tenants[0])")
    fr_=None
    for (x,y) in [(9,12),(10,15),(6,3),(14,6),(24,8),(7,7)]:
      fr_=await pg.evaluate(f"FT.tryPlace('{fav}',{x},{y})")
      if not fr_: break
    print('fav place',fav,fr_)
    print('happiness',h0,'->',await pg.evaluate("FT.happiness(FT.S.condo.tenants[0])"),'rent',await pg.evaluate("FT.rentOf(0)"))
    await pg.evaluate("FT.setTime(7.5);FT.setPos(13,16)");await pg.wait_for_timeout(700)
    await pg.screenshot(path='screenshot-apartment.png')
    await pg.evaluate("document.querySelectorAll('#top,#talk,#tcard').forEach(e=>e.style.visibility='hidden')")
    await pg.screenshot(path='/tmp/full.png')
    await pg.evaluate("window.ZOOM=3.4;window.CAMT=[8,7];window.CLEAN=1;document.querySelectorAll('body>*:not(canvas)').forEach(e=>e.dataset.h=e.style.visibility,e=>0);document.body.classList.add('clean')");await pg.add_style_tag(content='body.clean>*:not(#c){visibility:hidden!important}');await pg.wait_for_timeout(400);await pg.screenshot(path='screenshot-furniture-closeup.png');await pg.evaluate("window.ZOOM=0;window.CLEAN=0;document.body.classList.remove('clean')")
    await pg.evaluate("document.querySelectorAll('#top,#talk,#tcard').forEach(e=>e.style.visibility='')")
    await pg.evaluate("FT.enterRoom('office')");await pg.wait_for_timeout(600);await pg.screenshot(path='screenshot-lobby.png')
    print('ground',await pg.evaluate("FT.area.cols+'x'+FT.area.rows+' '+FT.area.name"),'reach desk/elev/office/staff',await pg.evaluate("(()=>{const a=FT.area;return [[11,8],[9,1],[21,5],[3,4]].map(([x,y])=>!!FT.bfsOn(a,12,18,(i,j)=>i==x&&j==y)).join()})()"))
    print('desk menu',await pg.evaluate("FT.act(11,7),document.getElementById('menu').innerText.slice(0,60)"));await pg.evaluate("closeMenu()")
    print('elevator',await pg.evaluate("FT.act(9,0),FT.condoOpen"));await pg.evaluate("FT.condo=false")
    print('office rule',await pg.evaluate("FT.tryPlace('toilet',22,6)"),'| bed in office?',await pg.evaluate("FT.S.rooms.office.furn.some(f=>f.k.startsWith('bed')&&f.x>=18)"))
    await pg.evaluate("window.ZOOM=2.6;window.CAMT=[21.5,4];window.CLEAN=1");await pg.add_style_tag(content='body.clean>*:not(#c){visibility:hidden!important}');await pg.evaluate("document.body.classList.add('clean')");await pg.wait_for_timeout(500);await pg.screenshot(path='screenshot-office.png')
    await pg.evaluate("window.CAMT=[12,12]");await pg.wait_for_timeout(400);await pg.screenshot(path='/tmp/lobby-close.png')
    await pg.evaluate("window.CAMT=[17,5]");await pg.wait_for_timeout(400);await pg.screenshot(path='/tmp/officedoor.png');await pg.evaluate("window.CAMT=[3.5,3.5]");await pg.wait_for_timeout(400);await pg.screenshot(path='/tmp/staff.png')
    await pg.evaluate("window.ZOOM=0;window.CLEAN=0;document.body.classList.remove('clean')")
    await pg.evaluate("FT.goArea('town',[30,7]);FT.act(30,4)");await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/shop.png');await pg.evaluate("closeMenu();FT.enterRoom('f1')")
    await pg.evaluate("FT.decor=true;FT.fsel=0;FT.ghost=[11,14]");await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/decor.png');await pg.evaluate("FT.decor=false")
    # condo tower
    await pg.evaluate("FT.condoAct('ad');FT.condo=true;FT.scroll=0");await pg.wait_for_timeout(400);await pg.screenshot(path='screenshot-condo.png');await pg.evaluate("FT.condo=false")
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
    await ph.evaluate("FT.S.rooms.f1.furn=[{k:'stove',x:1,y:0},{k:'fridge',x:4,y:0},{k:'bed',x:10,y:1},{k:'toilet',x:25,y:0}];FT.S.condo.apps=[{n:'Amber',offer:50}];FT.condoAct('pick',0)");await ph.click('#dlgSkip');await ph.evaluate("FT.goArea('town',[17,13]);FT.setTime(11)");await ph.wait_for_timeout(400)
    await ph.touchscreen.tap(600,250);await ph.wait_for_timeout(900)
    nn=await ph.evaluate("Object.values(FT.TN).find(t=>!t.inRoom)?.n")
    if nn: await ph.evaluate(f"FT.sel={nn!r};FT.toggleFollow()")
    await ph.wait_for_timeout(1200);await ph.screenshot(path='screenshot-phone.png')
    print('phone pos',await ph.evaluate("FT.S.px/16+','+FT.S.py/16"))
    await ph.evaluate("FT.condo=true;FT.scroll=-1");await ph.wait_for_timeout(300);await ph.screenshot(path='/tmp/phone-condo.png');await ph.evaluate("FT.condo=false")
    await ph.evaluate("FT.S.condo.apps=null;FT.S.condo.ad=1;sleep();FT.apps=true");await ph.wait_for_timeout(300);await ph.screenshot(path='/tmp/phone-apps.png');await ph.evaluate("FT.apps=false")
    await ph.evaluate("FT.map=true");await ph.wait_for_timeout(300);await ph.screenshot(path='/tmp/phone-map.png')
    await ph.evaluate("FT.map=false;FT.S.rooms.f1.furn=[];FT.enterRoom('f1');FT.setPos(13,16)")
    await ph.evaluate("FT.DEMO().forEach(i=>FT.tryPlace(i[0],i[1],i[2],i[3]||0));FT.setPos(9,13)");await ph.wait_for_timeout(900);await ph.screenshot(path='screenshot-apartment-phone.png')
    print('phone room Z',await ph.evaluate("FT.zoom"))
    await ph.evaluate("FT.decor=true;FT.ghost=[11,14]");await ph.wait_for_timeout(300);await ph.screenshot(path='/tmp/phone-decor.png');await ph.evaluate("FT.decor=false")
    await ph.evaluate("FT.map=false;FT.enterRoom('office')");await ph.wait_for_timeout(800);await ph.screenshot(path='screenshot-lobby-phone.png')
    pp=await b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True);hook(pp);await pp.goto(U);await pp.wait_for_timeout(400);await pp.screenshot(path='/tmp/phone-portrait.png')
    print('ERRORS',errs);await b.close()
asyncio.run(main())
