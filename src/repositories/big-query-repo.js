module.exports = {
    getRecordInserter: (tableId, datasetId, bigquery) => {
        return function(record) {
            // Insert data into a table
            bigquery
            .dataset(datasetId)
            .table(tableId)
            .insert([record,]).catch(err => { console.log(err) })
      }
    },
    executeQuery: async (query, bigquery) => {
        const options = {
            query: query
        };

        console.log("asdfasdfasdf")
        // Run the query as a job
        const [rows] = await bigquery.query(options);
        return rows
    }
};