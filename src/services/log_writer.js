module.exports = class LogWriter {
    constructor(writer) {
        this.writer = writer;
        this.messageCount = 0;
    }

    write = async (message) => {
        const data = message.data.toString()
        console.log(data)
        this.messageCount += 1;
        // wait for this before sending an ack
        await this.writer(data)
        message.ack();
    }
 }