import kafka from "../configs/kafka";
import Board from "../models/boardModel";
import topicFallback from "./topicFallback";

const consumer = kafka.consumer({ groupId: "board-group-1" });

const topic = process.env.KAFKA_TOPIC_PROJECT || "project_created";

export async function consumeProjectCreated() {
    try {
        await topicFallback(topic)
        // Now connect the consumer
        console.log("📦 Consumer connecting...");
        await consumer.connect();
        console.log("✅ Consumer connected!");

        await consumer.subscribe({ topic, fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, message }) => {

                console.log("📨 Topic:", topic);
                console.log("📦 Message:", message);

                const messageValueStr = message.value?.toString();

                // Step 2: Parse it to object
                let parsedMessage: { name: string; projectId: string; isDefault: boolean };
                try {
                    parsedMessage = JSON.parse(messageValueStr || '{}');
                } catch (error) {
                    console.error("❌ Failed to parse Kafka message:", error);
                    return;
                }
                console.log("📦 Parsed Message:", parsedMessage);

                await Board.create({
                    name: parsedMessage.name,
                    projectId: parsedMessage.projectId,
                    isDefault: parsedMessage.isDefault,
                });

                console.log("💾 Board saved successfully.");
                console.log("✅ MISSION SUCCESS....")

            },
        });

    } catch (error) {
        console.error("❌ Kafka consumer setup error:", error);
    }
}
