DEV=docker-compose -f docker-compose.dev.yml
PROD=docker-compose -f docker-compose.prod.yml

build-prod:
	$(PROD) build
up-prod:
	$(PROD) up -d
down-prod:
	$(PROD) down


build-dev:
	$(DEV) build
build-up-dev:
	$(DEV) up --build
up-dev:
	$(DEV) up
down-dev:
	$(DEV) down


prune: down-dev
	docker image prune -f
