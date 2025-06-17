import kafka from "../configs/kafka";
import Board from "../models/boardModel";
import { createCardByListId } from "../services/cardServices";
import {
  createListByBoardId,
  getListsByBoardId,
} from "../services/listServices";
import { parseMessage } from "../utils/parseKafkaMesssages";
import {
  boardUpdatedProducer,
  cardCreatedProducer,
  listCreatedProducer,
} from "./producer";
import topicFallback from "./topicFallback";
import { ICreateCard } from "zedspace-shared-types";
const consumer = kafka.consumer({ groupId: "board-service-group" });

export async function consumeProjectCreated() {
  try {
    await topicFallback("project_created");
    await topicFallback("create_list");
    await topicFallback("create_card");
    await consumer.connect();
    await consumer.subscribe({
      topics: ["project_created", "create_list", "create_card"],
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        // console.log("TOPIC:", topic);
        const messageValue = message.value?.toString();

        if (!messageValue) {
          console.log("MESSAGE VALUE IS UNDEFINED");
          return;
        }

        if (topic === "project_created") {
          const parsedMessage = await parseMessage<{
            name: string;
            projectId: string;
            isDefault: boolean;
          }>({ messageValue });

          if (!parsedMessage) {
            return;
          }

          await Board.create({
            name: parsedMessage.name,
            projectId: parsedMessage.projectId,
            isDefault: parsedMessage.isDefault,
          });
        } else if (topic === "create_list") {
          const parsedMessage = await parseMessage<{
            body: { name: string };
            boardId: string;
          }>({ messageValue });

          if (!parsedMessage) {
            return;
          }

          await createListByBoardId({
            body: parsedMessage.body,
            boardId: parsedMessage.boardId,
          });

          const lists = await getListsByBoardId({
            boardId: parsedMessage.boardId,
          });

          await listCreatedProducer({ boardId: parsedMessage.boardId, lists });
        } else if (topic === "create_card") {
          const parsedMessage = await parseMessage<ICreateCard>({
            messageValue,
          });

          if (!parsedMessage) {
            return;
          }

          await createCardByListId(parsedMessage);

          const lists = await getListsByBoardId({
            boardId: parsedMessage.boardId,
          });

          await cardCreatedProducer({ boardId: parsedMessage.boardId, lists });
        } else if (topic === "board_updated") {
          const parsedMessage = await parseMessage<{ boardId: string }>({
            messageValue,
          });

          if (!parsedMessage) {
            return;
          }

          const lists = await getListsByBoardId({
            boardId: parsedMessage.boardId,
          });

          await boardUpdatedProducer({ boardId: parsedMessage.boardId, lists });
        }
      },
    });
  } catch (error) {
    console.error("Kafka consumer setup error:", error);
  }
}
