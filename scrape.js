const request = require("request");
const cheerio = require("cheerio");

request(
  "https://www.ab.gr/click2shop/search?q=%CE%BC%CE%B1%CF%81%CE%BF%CF%85%CE%BB%CE%B9",
  (error, responce, html) => {
    if (!error && responce.statusCode == 200) {
      const $ = cheerio.load(html);
      console.log(html);
    }
  }
);
