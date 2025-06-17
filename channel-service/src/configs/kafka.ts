import { Kafka } from "kafkajs"
import dotenv from "dotenv"

dotenv.config()

const brokers = (process.env.KAFKA_BROKERS || "kafka:29092").split(',');

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "channel-service",
    brokers: brokers,
    retry: {
        initialRetryTime: 100,
        retries: 8
    }
})

export default kafka






