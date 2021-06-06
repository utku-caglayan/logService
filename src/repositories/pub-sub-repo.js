const { PubSub  } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();
const subscriptionName = "LogSink-sub";
const topicName = "LogSink";

module.exports = {
    publishMessage: async (payload) => {
        const messageId = await pubSubClient.topic(topicName).publish(payload);
        console.log(`Message ${messageId} published.`);
        return messageId;
    },

    subscribeCallback: async (callback) => {
        const subscription = pubSubClient.subscription(subscriptionName);
        let messageCount = 0;
        const messageHandler = (message) => {
            callback(message)
        };
        subscription.on('message', messageHandler);
    }
};