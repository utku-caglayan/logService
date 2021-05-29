module.exports = {
    publishMessage: async (pubSubClient, topicName, payload) => {
        const dataBuffer = Buffer.from(JSON.stringify(payload));

        const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
        console.log(`Message ${messageId} published.`);
        return messageId;
    },

    listenForPullMessageWithCallback: async (pubSubClient, subscriptionName, callback) => {
        const subscription = pubSubClient.subscription(subscriptionName);

        let messageCount = 0;
        const messageHandler = message => {
            const data = message.data.toString()
            console.log(`Received message ${data}:`);
            messageCount += 1;
            callback(JSON.parse(data))
            message.ack();
        };

        subscription.on('message', messageHandler);
    }
};