const { PubSub  } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();
const subscriptionName = "LogSink-sub";

const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();
const datasetId = 'logs';
const tableId = 'logs';
    
const pubsubRepository = require("../repositories/pub-sub-repo");
const { listenForPullMessageWithCallback } = pubsubRepository;
const bigqueryRepository = require("../repositories/big-query-repo");
const { getRecordInserter } = bigqueryRepository

module.exports = {
    healthcheck: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "alive",
        })
    },

    startListening: (req, res) => {
        let recordInserter = getRecordInserter(tableId, datasetId, bigquery)
        try {
            listenForPullMessageWithCallback(pubSubClient, subscriptionName, recordInserter);
            res.status(200).json({
                success: true,
                message: "Started to listen subscription",
            })                        
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Couldn't receive log object :(",
                data: error
            })                        
        }
    },
};