export const parseMessage = async <T>({
  messageValue,
}: {
  messageValue: string;
}): Promise<T | undefined> => {
  let parsedMessage: T;
  try {
    parsedMessage = JSON.parse(messageValue || "{}");
  } catch (error) {
    console.error("Failed to parse Kafka message:", error);
    return undefined;
  }
  return parsedMessage;
};
