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

  // Visit each assets page one by one
  for (let link of click2Shophrefs) {
    await page.goto(link.href);

    const pageNumbers = await page.$$eval(
      ".active-pages .pagination-button",
      pages => {
        return pages;
      }
    );

    console.log(pageNumbers.length);

    // Now collect all the ICO urls.
    const productList = await page.$$eval(".product-layout", productsArray => {
      return productsArray.map(product => {
        console.log(product);
        let obj = {};
        obj.href = product.href;
        obj.text = product.text;
        return obj;
      });
    });

    console.log(productList.length);

    // Visit each ICO one by one and collect the data.
    // for (let icoUrl of icoUrls) {
    //   await page.goto(icoUrl);

    //   const icoImgUrl = await page.$eval('#asset-logo-wrapper img', img => img.src);
    //   const icoName = await page.$eval('h1', h1 => h1.innerText.trim());
    //   // TODO: Gather all the needed info like description etc here.

    //   results.push([{
    //     icoName,
    //     icoUrl,
    //     icoImgUrl
    //   }]);
    // }

    // icoUrls.forEach(element => {
    //   console.log(element.innerText);
    // });
  }

  //await browser.close();
})();
