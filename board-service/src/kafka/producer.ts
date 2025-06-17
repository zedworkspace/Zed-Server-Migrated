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
    await producer.send({
      topic: process.env.KAFKA_TOPIC_CARD_MOVED || "card_moved",
      messages: [
        {
          key: cardDetails.boardId,
          value: JSON.stringify(cardDetails),
        },
      ],
    });
  } catch (error) {
    console.log("Error happened in send card moved event", error);
  }
};

export const listCreatedProducer = async ({
  lists,
  boardId,
}: {
  lists: any[];
  boardId: string;
}) => {
  try {
    await producer.send({
      topic: "list_created",
      messages: [
        {
          key: boardId,
          value: JSON.stringify(lists),
        },
      ],
    });
  } catch (error) {
    console.log("LIST CREATED PRODUCER HAS ERROR", error);
  }
};

export const cardCreatedProducer = async ({
  lists,
  boardId,
}: {
  lists: any[];
  boardId: string;
}) => {
  try {
    await producer.send({
      topic: "card_created",
      messages: [
        {
          key: boardId,
          value: JSON.stringify(lists),
        },
      ],
    });
  } catch (error) {
    console.log("CARD CREATED PRODUCER HAS ERROR", error);
  }
};
export const boardUpdatedProducer = async ({
  lists,
  boardId,
}: {
  lists: any[];
  boardId: string;
}) => {
  try {
    console.log("BOARD UPDATED PRODUCER IS RUNNING....");
    await producer.send({
      topic: "board_updated",
      messages: [
        {
          key: boardId,
          value: JSON.stringify(lists),
        },
      ],
    });
    console.log("BOARD UPDATED PRODUCER PUBLISHED...");
  } catch (error) {
    console.log("BOARD UPDATED PRODUCER HAS ERROR", error);
  }
};
