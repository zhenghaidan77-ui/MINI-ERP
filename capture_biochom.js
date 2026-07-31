const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Set viewport to a typical desktop width
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log("Navigating to https://www.biochom.com/...");
    await page.goto('https://www.biochom.com/', { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Scroll down to load lazy images
    console.log("Scrolling down to load lazy images...");
    await autoScroll(page);
    
    const outputPath = "C:\\Users\\FAMILY\\Desktop\\바이오촘_홈페이지_상세페이지용.png";
    console.log("Taking full page screenshot...");
    await page.screenshot({ path: outputPath, fullPage: true });
    
    console.log("Screenshot saved successfully to: " + outputPath);
    await browser.close();
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    process.exit(1);
  }
})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 300;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 150);
        });
    });
}
