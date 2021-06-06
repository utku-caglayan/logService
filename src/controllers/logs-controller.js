
const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

const pubsubRepository = require("../repositories/pub-sub-repo");
const { publishMessage } = pubsubRepository;

const bigqueryRepository = require("../repositories/big-query-repo");
const { executeQuery } = bigqueryRepository


const LogProducer = require("../services/log_producer")
const logProducer = new LogProducer(async (data) => {
    return publishMessage(data)
})

const dailyActiveUserQuery = `SELECT TIMESTAMP_TRUNC(TIMESTAMP_MILLIS(event_time), DAY, "UTC") as day, count(distinct user_id) as user_count
                                FROM \`resolute-grin-311106.logs.logs\` 
                                    group by TIMESTAMP_TRUNC(TIMESTAMP_MILLIS(event_time), DAY, "UTC")`;


const dailyAverageUserDurationQuery = `WITH sessions_and_lengths_foreach_day as
                                        (
                                            SELECT session_id, TIMESTAMP_TRUNC(TIMESTAMP_MILLIS(event_time), DAY, "UTC") as day, 
                                            (max(event_time) - min(event_time))/(1000*60) as minutes  
                                                FROM \`resolute-grin-311106.logs.logs\` 
                                                    group by session_id, TIMESTAMP_TRUNC(TIMESTAMP_MILLIS(event_time), DAY, "UTC")
                                        )
                                        select day, avg(minutes) as minutes from sessions_and_lengths_foreach_day group by day;`

const totalUserQuery = `select count(distinct user_id) FROM \`resolute-grin-311106.logs.logs\``;

module.exports = {
    logs: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Logs route confirmed :)",
        })
    },

    createLogs: async (req, res) => {
        let logObj = req.body;
        let messageId = await logProducer.publish(logObj)
        return res.status(200).json({
            success: true,
            message: `Message ${messageId} published `
        })
    },

    dailyActiveUser: async (req, res) => {
        rows = await executeQuery(dailyActiveUserQuery, bigquery)
        return res.status(200).json(rows)
    },

    dailyAverageUserDuration: async (req, res) => {
        rows = await executeQuery(dailyAverageUserDurationQuery, bigquery)
        return res.status(200).json(rows)
    },

    totalUser: async (req, res) => {
        rows = await executeQuery(totalUserQuery, bigquery)
        return res.status(200).json(rows)
    }

};