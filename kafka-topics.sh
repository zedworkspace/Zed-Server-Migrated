#!/bin/bash

echo "Zed Kafka topics creating..."

docker exec kafka /usr/bin/kafka-topics \
  --create --topic project_created \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1 \
  --if-not-exists

docker exec kafka /usr/bin/kafka-topics \
  --create --topic __consumer_offsets \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1 \
  --if-not-exists

echo "Topic creation is successfull..."
echo "Created Topics:"
docker exec kafka /usr/bin/kafka-topics --bootstrap-server localhost:9092 --list
