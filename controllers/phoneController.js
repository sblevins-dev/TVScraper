const Phone = require("../models/Phones");

const setPhones =
  async (req, res) => {
    console.log(req.body)
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
      numberPrice,
    });

    res.status(200).json(phone)
  };

  module.exports = {
    setPhones
  }
