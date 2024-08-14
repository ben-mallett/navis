# Pontus

This is an application designed to record, aggregrate, visualize, and monitor various sensor datastreams. `Pontus` is built using `Next.js`, `React`, `TypeScript`, `PostgreSQL`, `Prisma`, `Balena`, and `GCP`.

## Local Development

To develop this application locally, pull the environment secrets from 1Pass and place them at the root level of this directory. From there simply run the docker containers (you can use `script.buildAndRunPontus.sh` to orchestrate the database and frontend. 

### Running the Application

To run this application locally we rely on `docker compose`. To get started, run `script.buildAndRunPontus.sh`, which will farm out to `docker compose`. This will start up a `PostgreSQL` server on port `5432` and start the web application on `localhost:3000`.

### Testing the Application

Unit tests for this application are located in the `__tests__` directory. To run these tests outside of Docker, run `pnpm test`. To run these tests inside of Docker, run `script.runTestsThroughDocker.sh`.

### Worfklows

There are currently workflows in this repo for running tests on pull request, merge, and on demand through GitHub actions. You can run these actions by going to the `Actions` pane, and selected the workflow from the menu on the left.

### Cloud

To apply our cloud infrastructure navigate to the terraform directory and run `terraform apply`. Our code is automatically deployed via `Cloud Build` on merge to main. This build process is found at `cloudbuild.yml`

### Presentation Slides

Presentation slides can be found [here](https://docs.google.com/presentation/d/1f-b5YRDK0J7HvuaiPMK4AUEybNYE-ts4Kkkcs8euVdA/edit?usp=sharing)

### Daemon 

The code for embedded devices can be found [here](https://github.com/ben-mallett/pontus-daemon) (in progress)
