const webdriver = require("selenium-webdriver");
const request = require("request");
const cheerio = require("cheerio");

async function searchTextOnGoogle() {
  let driver = new webdriver.Builder().forBrowser("chrome").build();

  let Elements = driver.get("https://www.ab.gr/").then(() => {
    return driver.findElements(webdriver.By.className("main seeAll"));
  });
  // .then(Elements => {
  //   // Promise.all(Elements).then(function(values) {
  //   //   console.log(values);
  //   // });

  //   //console.log(Elements);

  //   // Elements.forEach(element => {
  //   //   setTimeout(() => {
  //   //     console.log(element.getText());
  //   //     //element.click();
  //   //   }, 2000);
  //   // });
  // });

  // await driver.get("https://www.ab.gr/").then(() => {

  //   console.log("Before");
  //   let test = await driver.findElements(webdriver.By.className("main seeAll"));

  //   test.forEach(element => {
  //     setTimeout(() => {
  //       element.click();
  //     });
  //   }, 5000);
  // });
  console.log(Elements);
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
