const fs = require('fs');
const https = require('http')
require('dotenv').config();

const { MAIN_PORT, SAMPLE_LOG_PATH } = process.env;

function makePostReq(log) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(log)
        const options = {
            hostname: 'localhost',
            port: MAIN_PORT,
            path: '/api/logs/create',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length
            }
          }
          
          const req = https.request(options, res => {
            console.log(res.statusCode)
            if (200 == res.statusCode) {
                resolve()
                console.log("dude")
                return
            }
            reject('Invalid status code:' + res);
          })
          
          req.on('error', error => {
            reject('Invalid status code' +  error);
          })

          req.write(data)
          req.end() 
    });
}

async function bla(log) {
    try {
        await makePostReq(log)
        console.log(log + "send successfully")
    } catch (error) {
        console.error('ERROR:');
        console.error(error);
        process.exit(5)
    }
}

async function dude() {
    console.log(SAMPLE_LOG_PATH)
    let rawdata = fs.readFileSync(SAMPLE_LOG_PATH);
    const logs = JSON.parse(rawdata);

    for (i = 0; i < logs.length; i++) {
        await bla(logs[i])
        console.log("bla")
    }
}

dude().then(function(val) {
    console.log("finished...")
})