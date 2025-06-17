import kafka from "../configs/kafka";

const topicsList = [
    {
        topic: "project_created",
        numPartitions: 1,
        replicationFactor: 1,
    },
    {
        topic: "card_moved",
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
    {
        topic: "board_updated",
        numPartitions: 1,
        replicationFactor: 1,
    },
    {
        topic: "create_card",
        numPartitions: 1,
        replicationFactor: 1,
    },
];

export async function initKafkaTopics(maxRetries = 5, delayMs = 3000) {
    const admin = kafka.admin();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`🛠 Attempt ${attempt}: Connecting to Kafka admin...`);
            await admin.connect();
            console.log("✅ Kafka admin connected");

            const result = await admin.createTopics({
                topics: topicsList,
                waitForLeaders: true,
            });

            console.log(result ? `✅ Topics created: ${topicsList.map(t => t.topic).join(", ")}` : "ℹ️ Topics already exist");
            break;
        } catch (error) {
            console.error(`❌ Kafka admin error (attempt ${attempt}):`, error);
            if (attempt === maxRetries) {
                console.error("🚫 Max retries reached. Could not initialize Kafka topics.");
            } else {
                console.log(`🔁 Retrying in ${delayMs / 1000}s...`);
                await new Promise(res => setTimeout(res, delayMs));
            }
        } finally {
            try {
                await admin.disconnect();
                console.log("🔌 Kafka admin disconnected");
            } catch (disconnectError) {
                console.error("⚠️ Failed to disconnect Kafka admin:", disconnectError);
            }
        }
    }
}
