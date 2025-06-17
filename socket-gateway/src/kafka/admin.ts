import kafka from "../configs/kafka";

const topicsList = [
    {
        topic: "send_message",
        numPartitions: 1,
        replicationFactor: 1,
    },
    {
        topic: "message_created",
        numPartitions: 1,
        replicationFactor: 1,
    },
    {
        topic: "read_message",
        numPartitions: 1,
        replicationFactor: 1,
    },
    {
        topic: "read_message_update",
        numPartitions: 1,
        replicationFactor: 1,
    },
    {
        topic: "create_list",
        numPartitions: 1,
        replicationFactor: 1,
    },
    {
        topic: "create_card",
        numPartitions: 1,
        replicationFactor: 1,
    },
    {
        topic: "board_updated",
        numPartitions: 1,
        replicationFactor: 1,
    },
    {
        topic: "list_created",
        numPartitions: 1,
        replicationFactor: 1,
    },
    {
        topic: "card_created",
        numPartitions: 1,
        replicationFactor: 1,
    },
];

export async function initKafkaTopics(maxRetries = 5, delayMs = 3000) {
    const admin = kafka.admin();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Kafka Admin: Connecting (Attempt ${attempt})...`);
            await admin.connect();
            console.log("Kafka Admin connected");

            const result = await admin.createTopics({
                topics: topicsList,
                waitForLeaders: true,
            });

            if (result) {
                console.log(`Topic(s) created: ${topicsList.map(t => t.topic).join(", ")}`);
            } else {
                console.log("Topic(s) already exist.");
            }

            break; // Success, exit retry loop
        } catch (error) {
            console.error(`Kafka Admin Error (Attempt ${attempt}):`, error);
            if (attempt === maxRetries) {
                console.error("Maximum retry limit reached. Kafka topics could not be initialized.");
            } else {
                console.log(`Retrying in ${delayMs / 1000} seconds...`);
                await new Promise(res => setTimeout(res, delayMs));
            }
        } finally {
            try {
                await admin.disconnect();
                console.log("Kafka Admin disconnected");
            } catch (disconnectErr) {
                console.error("Error during Kafka admin disconnect:", disconnectErr);
            }
        }
    }
}
