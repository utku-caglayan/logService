
const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();
const datasetId = 'logs';
const tableId = 'logs';
    
const pubsubRepository = require("../repositories/pub-sub-repo");
const { subscribeCallback } = pubsubRepository;
const bigqueryRepository = require("../repositories/big-query-repo");
const { getRecordInserter } = bigqueryRepository
const recordInserter = getRecordInserter(tableId, datasetId, bigquery)

const LogWriter = require("../services/log_writer")
const logWriter = new LogWriter(recordInserter)

exports.register = () => {
    try {
        subscribeCallback(logWriter.write);
    } catch (error) {
        console.log("something went wrong while subscribing to queue")
    }
}