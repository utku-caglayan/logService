const express = require('express');
const router = express();
const consumerController = require("../controllers/consumer");


router.get("/", consumerController.healthcheck);
router.get("/start", consumerController.startListening)

module.exports = router;