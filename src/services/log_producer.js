
module.exports = class LogProducer {
    constructor(publisher) {
        this.publisher = publisher;
    }

    publish = async (payload) => {
        console.log(payload)
        const dataBuffer = Buffer.from(JSON.stringify(payload));
        return await this.publisher(dataBuffer);
    }
 }