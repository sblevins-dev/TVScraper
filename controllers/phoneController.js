const Phone = require("../models/Phones");

const setPhones =
  async (req, res) => {
    if (!req.body) {
      res.status(400);
      throw new Error("Information Empty");
    }

    const { sku, prodImg, prodHref, prodName, prodDesc, numberPrice } =
      req.body;


    const phone = await Phone.create({
      sku,
      prodImg,
      prodHref,
      prodName,
      prodDesc,
      price: numberPrice,
    });

    res.status(200)
  };

  module.exports = {
    setPhones
  }
