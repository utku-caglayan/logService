const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const logsRoute = require('./routes/logs');
const helmet = require('helmet');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { MAIN_PORT, NODE_ENV } = process.env;
NODE_ENV !== "production" ? app.use(morgan('dev')) : app.use(morgan('combined'));

app.use(helmet());
app.use(cors());
app.use('/api/logs', logsRoute);



app.listen(MAIN_PORT);
if (NODE_ENV !== "production" ) {
    console.log(`LogPublisher service is running at http://localhost:${MAIN_PORT}`);
}

process.on('unhandledRejection', err => {
    console.error(err.message);
    process.exitCode = 1;
});