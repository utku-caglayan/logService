var expect = require('chai').expect;
const LogProducer = require("../services/log_producer")

describe('log producer', function(){
    it('should publish passed log to pubsub client', function(done) {
        const exampleJson = '{"bla":"bla"}'
        
        const mockPublisher = function(logBuff) {
            expect(logBuff.toString('utf8')).to.be.equal('"{\\"bla\\":\\"bla\\"}"')
            done()
        }

        const logProducer = new LogProducer(mockPublisher)
        setTimeout( function () {
            try {
               logProducer.publish(exampleJson);
            } catch( e ) {
              done( e );
            }
          }, 1000 );
    })
})