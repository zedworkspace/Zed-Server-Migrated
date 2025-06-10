import kafka from "../configs/kafka";

const producer = kafka.producer();

export const connectProducer = async () => {
    try {
        console.log("producer connecting...");
        await producer.connect();
        console.log("producer connected...");
    } catch (error) {
        console.log("Error while connecting producer:", error)
    }
};



type ProjectDetails = {
    projectId: string;
    name: string;
    isDefault: boolean;
};

export const sendProjectCreatedEvent = async (
    projectDetails: ProjectDetails
) => {
    try {
        console.log("KAFKA_TOPIC_PROJECT:", process.env.KAFKA_TOPIC_PROJECT)

        console.log("project details in producer:", projectDetails)

        const result = await producer.send({
            topic: process.env.KAFKA_TOPIC_PROJECT || "project_created",
            messages: [
                {
                    key: projectDetails.projectId,
                    value: JSON.stringify(projectDetails),
                },
            ],
        });

        console.log("Send project create Successfully...", JSON.stringify(result, null, 2));
    } catch (error) {
        console.log("Error happened in send project create event", error);
    }
};
