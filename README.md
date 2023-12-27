### Initial setup

- Install Docker: **Mac** `brew install docker --cask`, **Windows** [read more here](https://docs.docker.com/desktop/install/windows-install/)
- Install Docker Compose: **Mac** `brew install docker-compose`, **Windows** it shall be shipped with Docker now.
- Run Docker app to complete the installation process.
- Startup docker compose: `docker-compose up -d`


## Installation

Tested with node v20.10.0

```bash
# install yarn
npm install -g yarn

# install dependencies
$ yarn

# migrate database
$ yarn workspace api prisma migrate dev

# generate prisma client
$ yarn workspace api prisma generate

# build dtos
$ yarn workspace dtos build

```

## Running the app

```bash
# api
$ yarn workspace api start:dev

# frontend
$ yarn workspace front serve
```
