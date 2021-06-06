var expect = require('chai').expect;
const LogWriter = require("../services/log_writer")

describe('log writer', function(){
    it('should wait for writing action to be completed before sending an ack', function(done) {
        const exampleJson = '{"bla":"bla"}'
        
        var messageWritten = false

        const MockMessage = class {
            constructor(data) {
              this.data = data
            }
          
            ack() {
              if (messageWritten == true) {
                console.log("acked")
                done()
              }
            }
        };

        const mockWriter = async function(log) {
            console.log("asjdfjasdjf" + log)
            expect(log).to.be.equal(exampleJson)
            await new Promise(resolve => {
                setTimeout(() => {
                  resolve('resolved');
                }, 1000);
              });
            messageWritten = true
        }

        const logWriter = new LogWriter(mockWriter)
        logWriter.write(new MockMessage(exampleJson));
    })
})