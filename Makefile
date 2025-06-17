DEV_COMPOSE_FILE=docker-compose-dev.yml

.PHONY:compose-up-build
compose-up-build:
	docker compose -f $(DEV_COMPOSE_FILE) up --build

.PHONY:insert-topics
insert-topics:
	./kafka-topics.sh 