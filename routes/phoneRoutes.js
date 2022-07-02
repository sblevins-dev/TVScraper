const express = require('express')
const router = express.Router()
const { setPhones } = require('../controllers/phoneController')

router.route('/').post(setPhones)

module.exports = router