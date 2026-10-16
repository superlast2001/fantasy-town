import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    errs=[]
    pg=await b.new_page(viewport={'width':1280,'height':720})
    pg.on('console',lambda m: m.type=='error' and errs.append(m.text)); pg.on('pageerror',lambda e: errs.append(str(e)))
    url='file:///workspace/fantasy-town/index.html'
    await pg.goto(url+'?t=22&map'); await pg.wait_for_timeout(1200)
    await pg.screenshot(path='screenshot-overview.png')
    await pg.goto(url+'?t=22'); await pg.wait_for_timeout(300)
    await pg.evaluate("FT.setPos(46,30)")
    # gameplay test: farm
    await pg.evaluate("""()=>{const S=FT.S;S.px=12*16+8;S.py=30*16+12;S.face='down';S.sel=0;FT.act();S.sel=1;FT.act();S.sel=4;FT.act();}""")
    r=await pg.evaluate("JSON.stringify(FT.S.soil)"); print('soil',r)
    await pg.evaluate("FT.sleep()"); r=await pg.evaluate("JSON.stringify(FT.S.soil)+' day '+FT.S.day"); print('after sleep',r)
    await pg.goto(url+'?t=22'); await pg.wait_for_timeout(300)
    print('loaded day', await pg.evaluate("FT.S.day"))
    await pg.evaluate("FT.S.min=22*60;FT.setPos(47,31)")
    await pg.keyboard.down('ArrowLeft'); await pg.wait_for_timeout(400); await pg.keyboard.up('ArrowLeft')
    await pg.wait_for_timeout(2500)
    await pg.screenshot(path='screenshot-play.png')
    m=await b.new_page(viewport={'width':390,'height':780},has_touch=True,is_mobile=True)
    m.on('pageerror',lambda e: errs.append(str(e)))
    await m.goto(url+'?t=21'); await m.wait_for_timeout(1000); await m.screenshot(path='/tmp/mobile.png')
    print('ERRORS',errs); await b.close()
asyncio.run(main())
