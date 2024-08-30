# .ENV
setup-env:
	@touch .env
	@sed -i '/^NAME=/d' .env
	@sed -i '/^ENV=/d' .env
	@temp_file=$$(mktemp); \
	owner=$$(stat -c '%u' .env); \
	group=$$(stat -c '%g' .env); \
	echo "NAME=$(repo_name)" > $$temp_file; \
	echo "ENV=$(branch_name)" >> $$temp_file; \
	cat .env >> $$temp_file; \
	mv $$temp_file .env; \
	chmod 664 .env; \
	chown $$owner:$$group .env

load-env: setup-env
	$(eval NAME=$(shell grep -E '^NAME=' .env | cut -d '=' -f 2))
	$(eval ENV=$(shell grep -E '^ENV=' .env | cut -d '=' -f 2))


# Docker
build: load-env
	@docker build -t hub.playgroundvina.com/pg/$(NAME):$(ENV) -f docker/Dockerfile . --no-cache

push: build
	@docker push hub.playgroundvina.com/pg/$(NAME):$(ENV)

pull: load-env
	@echo "docker pull hub.playgroundvina.com/pg/$(NAME):$(ENV)"
	@docker pull hub.playgroundvina.com/pg/$(NAME):$(ENV)

clean: load-env
	@docker rmi hub.playgroundvina.com/pg/$(NAME):$(ENV) || true

# Run
stop: load-env
	@cp -f .env docker/$(ENV)/.env
	@docker compose -f docker/$(ENV)/docker-compose.yml -p $(NAME)-$(ENV) down

start: stop
	@docker compose -f docker/$(ENV)/docker-compose.yml -p $(NAME)-$(ENV) up -d

deploy: pull start


# Telegram Notify
notify_start:
	@curl -X POST -H 'Content-Type: application/json' -d '{"chat_id": "$(CHAT_ID)", "text": "$(JOB_NAME): #$(BUILD_NUMBER)\n=====\nStarted!", "disable_notification": false}' "https://api.telegram.org/bot$(TOKEN)/sendMessage"

notify_success:
	@curl -X POST -H 'Content-Type: application/json' -d '{"chat_id": "$(CHAT_ID)", "text": "$(JOB_NAME): #$(BUILD_NUMBER)\n=====\n✅ Deploy succeeded!", "disable_notification": false}' "https://api.telegram.org/bot$(TOKEN)/sendMessage"

notify_failure:
	@curl -X POST -H 'Content-Type: application/json' -d '{"chat_id": "$(CHAT_ID)", "text": "$(JOB_NAME): #$(BUILD_NUMBER)\n=====\n❌ Deploy failure!", "disable_notification": false}' "https://api.telegram.org/bot$(TOKEN)/sendMessage"

notify_aborted:
	@curl -X POST -H 'Content-Type: application/json' -d '{"chat_id": "$(CHAT_ID)", "text": "$(JOB_NAME): #$(BUILD_NUMBER)\n=====\n❌ Deploy aborted!", "disable_notification": false}' "https://api.telegram.org/bot$(TOKEN)/sendMessage"
