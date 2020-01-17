const webdriver = require("selenium-webdriver");
const request = require("request");
const cheerio = require("cheerio");

function searchTextOnGoogle() {
  let driver = new webdriver.Builder().forBrowser("chrome").build();

  driver.get("https://www.ab.gr/").then(() => {
    driver
      .findElement()
      //.findElement(webdriver.By.className("promotions"))
      //.findElement(webdriver.By.className("promotions"))
      .click()
      .then(() => {
        driver.getPageSource().then(html => {
          console.log(html);
        });

        driver.getTitle().then(title => {
          console.log(title);
          driver.quit();
        });
      });
  });
}

searchTextOnGoogle();

// (async function example() {
//   let driver = await new Builder().forBrowser("chrome").build();
//   try {
//     await driver.get("http://www.google.com/ncr");
//     await driver.findElement(By.name("q")).sendKeys("webdriver", Key.RETURN);
//     await driver.wait(until.titleIs("webdriver - Google Search"), 1000);
//   } finally {
//     await driver.quit();
//   }
// })();
