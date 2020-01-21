const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });
  const page = await browser.newPage();
  await page.goto("https://www.ab.gr/");
  //await page.pdf({ path: "hn.pdf", format: "A4" });

  //document.querySelectorAll('ul[data-level="1"] > li > a');
  await page.waitFor('ul[data-level="1"] > li > a');

  const click2Shophrefs = await page.$$eval(
    'ul[data-level="1"] > li > a',
    href => {
      return href.map(links => {
        let obj = {};
        obj.href = links.href;
        obj.text = links.text;
        return obj;
      });
    }
  );

  console.log(click2Shophrefs);

  click2Shophrefs.forEach(async link => {
    console.log(`Going to ${link.href}`);
    await page.goto(link.href);
    await page.waitFor("li.data-item");
    console.log(`Gone to ${link.href}`);
    //setTimeout(() => {}, 5000);
  });

  //await browser.close();
})();
