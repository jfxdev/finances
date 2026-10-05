.DEFAULT_GOAL := dev

PNPM = npx --yes $(shell node -p "require('./package.json').packageManager")

.PHONY: dev dev-env dev-deps dev-db dev-generate dev-migrate dev-stop

dev: dev-db dev-deps
	$(PNPM) dev

dev-env:
	node scripts/setup-env.mjs --dev

dev-deps:
	$(PNPM) install --frozen-lockfile

dev-db: dev-env
	docker compose -f compose.dev.yaml up -d --wait db

dev-migrate: dev-db dev-deps
	$(PNPM) db:migrate

dev-generate: dev-deps
	$(PNPM) db:generate

dev-stop:
	docker compose -f compose.dev.yaml stop db
