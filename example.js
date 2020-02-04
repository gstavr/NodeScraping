const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });
  const page = await browser.newPage();
  await page.goto("https://www.ab.gr/");

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

    // Get The First 20 From Page 0
    const productListTest = await page.$$eval(
      ".product-layout",
      productsArray => {
        return productsArray.map(element => {
          return element.outerHTML;
        });
      }
    );

    totalProducetPerCategory = [...productListTest];
    // For each Page Number get All products
    for (let i = 1; i < parseInt(nodeListLastChild[0]); i++) {
      await page.goto(link.href + `?pageNumber=${i}`);
      // Now collect all the procuts for each Pagination Number 20 products
      const productListPerPage = await page.$$eval(
        ".product-layout",
        productsArray => {
          return productsArray.map(element => {
            return element.outerHTML;
          });
        }
      );

      totalProducetPerCategory = [
        ...totalProducetPerCategory,
        ...productListPerPage
      ];
    }

    console.log(totalProducetPerCategory.length);

    let ProductsArray = [];
    for (let index = 0; index < totalProducetPerCategory.length; index++) {
      const $ = cheerio.load(totalProducetPerCategory[index]);

      let layoutContent = $(".layout-content");
      let product = {};
      //text-bold title ellipsis
      product.Company = layoutContent
        .find(".text-bold .title .ellipsis")
        .first()
        .text()
        .trim();

      product.Description = layoutContent
        .find('[class="ellipsis"]')
        .first()
        .text()
        .trim();

      product.WeightPrice = layoutContent
        .find('[class="layout-table-cell v-bottom"]')
        .first()
        .text()
        .trim();

      product.ProductWeight = layoutContent
        .find('[class="layout-table-cell v-bottom"]')
        .last()
        .text()
        .trim();

      product.ProductPrice = layoutContent
        .find('[class="layout-table-cell v-bottom property--price"]')
        .last()
        .text()
        .trim();

      ProductsArray.push(product);
    }

    ProductsArray.map(product => {
      console.log(
        `Procut Name: ${product.Description}, Product Price: ${product.ProductPrice}`
      );
    });
  }

  //await browser.close();
})();
