const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });
  const page = await browser.newPage();
  await page.goto("https://www.ab.gr/");
  //await page.pdf({ path: "hn.pdf", format: "A4" });

  await page.waitFor('ul[data-level="1"] > li > a');

  // Find All Level 1 hLinks and store them
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

  // Visit each link page one by one
  for (let link of click2Shophrefs) {
    let totalProducetPerCategory = [];
    await page.goto(link.href);

    // Find Pagination Number for each page
    let nodeListLastChild = await page.$$eval(
      "li.pagination-button:last-child",
      () => {
        let pageLength = document.querySelectorAll(
          "li.pagination-button:last-child"
        );

        let nodeListToArray = [...pageLength];

        return nodeListToArray.map(h => h.textContent);
      }
    );

    // Now collect all the procuts for each Pagination Number 20 products
    const productList = await page.$$eval(".product-layout", productsArray => {
      return productsArray.map(product => {
        let obj = {};
        obj.href = product.href;
        obj.text = product.text;
        return obj;
      });
    });

    totalProducetPerCategory = [...productList];

    console.log(`Products: ` + parseInt(nodeListLastChild[0]));

    // For each Page Number get All products
    for (let i = 1; i < parseInt(nodeListLastChild[0]); i++) {
      await page.goto(link.href + `?pageNumber=${i}`);
      // Now collect all the procuts for each Pagination Number 20 products
      const productListPerPage = await page.$$eval(
        ".product-layout",
        productsArrayPerPage => {
          return productsArrayPerPage.map(product => {
            let obj = {};
            obj.href = product.href;
            obj.text = product.text;
            return obj;
          });
        }
      );
      totalProducetPerCategory = [
        ...totalProducetPerCategory,
        ...productListPerPage
      ];
    }

    console.log(totalProducetPerCategory.length);
  }

  //await browser.close();
})();
