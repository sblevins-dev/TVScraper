const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const Phone = require("./models/Phones");
const dotenv = require("dotenv").config();
const { response } = require("express");

const PORT = 8000;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routes
app.use('/addPhones', require('./routes/phoneRoutes'))

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));

mongoose.connect(
  process.env.MONGO_DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) return console.log("Connected to DB");
    else console.log(err);
  }
);

const baseUrl = "https://www.bestbuy.com/site";
const URL =
  "https://www.bestbuy.com/site/mobile-cell-phones/all-cell-phones/pcmcat1625163553254.c?id=pcmcat1625163553254";

const addPhone = async (phone) => {
  try {
    const response = await axios.post("http://localhost:8000/addPhones", phone, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const getDescription = (url) =>
  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const descContainer = $(".shop-product-description");

      desc = descContainer.find(".html-fragment").text();
      return desc;
    })
    .catch((err) => console.log('error'));

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
          const sku = parseInt($(el).children("div").attr("data-sku-id"));
          const prodImg = $(el).find(".product-image").attr("src");
          const prodHref =
            baseUrl +
            $(el).find(".information").find(".sku-title a").attr("href");
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
          const numberPrice = parseFloat(splitPrice.split("$")[1]);

          let details = {
            sku,
            prodImg,
            prodHref,
            prodName,
            prodDesc,
            numberPrice,
          };
          addPhone(details);
        });

    objCall();
    data = list;
    return data;
  })
  .catch((err) => console.log('error'));
