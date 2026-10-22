# foundation monorepo orchestration.
#
# The targets run the pnpm workspace scripts. Some targets act on the whole
# repo. These targets clean build output and the Nuxt caches, and run the
# aggregate checks for CI.

# The default target shows this help.
.DEFAULT_GOAL := help

.PHONY: help install stub build prepare dev typecheck test coverage lint format inspect clean check verify ci

help: ## List available targets
	@grep -hE '^[a-z-]+:.*?## ' $(MAKEFILE_LIST) \
		| sort \
		| awk 'BEGIN {FS = ":.*?## "} {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install workspace dependencies
	pnpm install

stub: ## Link the packages to their source for development
	pnpm stub

build: ## Build every package to its .dist
	pnpm build

prepare: ## Run the workspace prepare hooks. Run build first
	pnpm -r prepare

dev: ## Start the Nuxt dev server
	pnpm dev

typecheck: ## Check the types of every package
	pnpm typecheck

test: ## Run the test suite
	pnpm test

coverage: ## Run the test suite with an aggregated coverage report
	pnpm coverage

lint: ## Lint with oxlint
	pnpm lint

format: ## Format the repo with oxfmt
	pnpm format

inspect: ## Check the formatting with oxfmt
	pnpm inspect

clean: ## Remove the build output and the Nuxt caches
	rm -rf .coverage
	find packages integrations -maxdepth 2 \( -name .dist -o -name .coverage \) -type d -prune -exec rm -rf {} +
	find integrations -maxdepth 2 \( -name .nuxt -o -name .output \) -type d -prune -exec rm -rf {} +

check: lint typecheck test ## Run lint, typecheck, and test on the existing build output

verify: clean install build prepare typecheck test ## Clean, install, build, prepare, typecheck, and test

ci: build prepare typecheck test lint inspect ## Build, prepare, typecheck, test, lint, and inspect
