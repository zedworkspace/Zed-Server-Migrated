import kafka from "../configs/kafka";

const producer = kafka.producer();

export const connectProducer = async () => {
    try {
        console.log("producer connecting...");
        await producer.connect();
        console.log("producer connected...");
    } catch (error) {
        console.log("Error while connecting producer:", error);
    }
};

type CardMovedEvent = {
    entityId: string;
    entityType: string;
    action: string;
    oldValue?: string;
    newValue: string;
    details: string;
    boardId?: string;
    user: string;
    timestamp: Date;
};

export const cardMovedEvent = async (cardDetails: CardMovedEvent) => {
    try {
        console.log("KAFKA_TOPIC_CARD_MOVED:", process.env.KAFKA_TOPIC_CARD_MOVED);

        console.log("card details in producer:", cardDetails);

        const result = await producer.send({
            topic: process.env.KAFKA_TOPIC_CARD_MOVED || "card_moved",
            messages: [
                {
                    key: cardDetails.boardId,
                    value: JSON.stringify(cardDetails),
                },
            ],
        });

        console.log(
            "Send card moved Successfully...",
            JSON.stringify(result, null, 2)
        );
    } catch (error) {
        console.log("Error happened in send card moved event", error);
    }
};


