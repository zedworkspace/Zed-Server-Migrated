import kafka from "../configs/kafka";

async function topicFallback(topic: string) {
    const admin = kafka.admin()
    try {
        console.log("📡 Admin connecting...");
        await admin.connect();
        console.log("✅ Admin connected!");

        // Wait for topic to exist in metadata
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
            const metadata = await admin.fetchTopicMetadata();
            const topicNames = metadata.topics.map((t) => t.name);
            if (topicNames.includes(topic)) break;

            console.log(`⏳ Waiting for topic "${topic}" to be ready... (${attempts + 1}/${maxAttempts})`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            attempts++;
        }

        if (attempts === maxAttempts) {
            throw new Error(`❌ Topic "${topic}" not found after waiting.`);
        }
        await admin.disconnect();
    } catch (error) {
        console.log("Topic fallback function got an error:", error)
    }
}
export default topicFallback