const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const { response } = require("express");

const PORT = 8000;
const app = express();

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

const URL = "https://www.bestbuy.com/site/promo/tvs-for-gaming";

const getDescription = (url) =>
  axios(url)
    .then((response) => {
      let tempList = [];

      const html = response.data;
      const $ = cheerio.load(html);

      const descContainer = $(".shop-product-description");

      desc = descContainer.find(".product-description").text();

      tempList.push(desc);

      return tempList;
    })
    .catch((err) => console.log(err));

let data = [];

axios(URL)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    let list = [];

    // Here targeting CSS class and its Attributes to fetch data
    // Make changes here
    const skuList = $(".component-sku-list").children();

    let objCall = async () =>
      skuList
        .children("div")
        .children("ol")
        .children("li")
        .next()
        .find(".shop-sku-list-item")
        .each(async (i, el) => {
          const sku = $(el).children("div").attr("data-sku-id");
          const prodImg = URL + $(el).find(".image-link").attr("href");
          const prodHref =
            URL + $(el).find(".information").find(".sku-title a").attr("href");
          const prodName = $(el)
            .find(".information")
            .find(".sku-title a")
            .text();
          const prodDesc = await getDescription(prodHref);
          const prodPrice = $(el)
            .find(".price-block")
            .find(".priceView-customer-price")
            .children("span")
            .text();
          const splitPrice = prodPrice.split("Y")[0];

          let details = {
            sku,
            prodImg,
            prodHref,
            prodName,
            prodDesc,
            splitPrice,
          };

          console.log(details)
          list.push(details);
        });

    objCall();
    data = list;
  })
  .catch((err) => console.log(err));

  console.log(data)
