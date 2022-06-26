const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const { response } = require("express");

const PORT = 8000;
const app = express();

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

axios("https://www.bestbuy.com/site/promo/tvs-for-gaming")
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    let list = [];

    // Here targeting CSS class and its Attributes to fetch data
    // Make changes here
    const skuList = $(".component-sku-list").children();

    skuList
      .children("div")
      .children("ol")
      .children("li")
      .next()
      .find(".shop-sku-list-item")
      .each((i, el) => {
        const sku = $(el).children('div').attr('data-sku-id')
        const prodName = $(el).find('.information').find(".sku-title a").text();
        const prodPrice = $(el).find('.price-block').find('.priceView-customer-price').children('span').text()
        const splitPrice = prodPrice.split('Y')[0]

        list.push({ sku, prodName, splitPrice });
      });
  })
  .catch((err) => console.log(err));
