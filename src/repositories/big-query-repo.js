module.exports = {
    getRecordInserter: (tableId, datasetId, bigquery) => {
        return async function(record) {
            // Insert data into a table  
            await bigquery
            .dataset(datasetId)
            .table(tableId)
            .insert([JSON.parse(record),]).catch(err => { console.log("err" + err) })
      }
    },

    executeQuery: async (query, bigquery) => {
        try {
            const options = {
                query: query
            };
            // Run the query as a job
            const [rows] = await bigquery.query(options);
            return rows
        } catch(error) {
            console.log("err:", error)
        }
    }
};