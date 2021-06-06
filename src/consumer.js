const morgan = require('morgan');
require('dotenv').config();
consumer = require("./controllers/consumer")

consumer.register();
console.log(`Consumer service started`);