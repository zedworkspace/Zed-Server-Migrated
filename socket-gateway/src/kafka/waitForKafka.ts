import kafka from "../configs/kafka"

export async function waitForKafka() {
  const admin = kafka.admin()
  let retries = 10
  
  while (retries > 0) {
    try {
      await admin.connect()
      await admin.listTopics()
      await admin.disconnect()
      console.log('Kafka is ready')
      return
    } catch (error) {
      console.log(`Kafka not ready, retrying... (${retries} attempts left)`)
      retries--
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  throw new Error('Kafka not available after retries')
}