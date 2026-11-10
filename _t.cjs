const { chromium } = require("playwright");
(async()=>{const b=await chromium.launch();
for(const w of [1024,1280,1366,1536,1920]){const p=await b.newPage({viewport:{width:w,height:700}});await p.goto("http://localhost:3105/",{waitUntil:"load",timeout:120000});
const r=await p.evaluate(()=>{const h=document.querySelector("header>div");const els=[...h.querySelectorAll(":scope > a, :scope > nav > a, :scope > nav > div, :scope > div > a")].filter(e=>e.offsetParent);const rects=els.map(e=>e.getBoundingClientRect());let ov=0;for(let i=1;i<rects.length;i++)if(rects[i].left<rects[i-1].right-1)ov++;return {n:els.length,ov,right:Math.max(...rects.map(r=>r.right)),sw:document.documentElement.scrollWidth}});
console.log(w,JSON.stringify(r));
if(w==1280||w==1024)await p.screenshot({path:`/tmp/h${w}.png`,clip:{x:0,y:0,width:w,height:90}});}
await b.close()})();
