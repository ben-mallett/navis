# Pontus

This is an application designed to record, aggregrate, visualize, and monitor various sensor datastreams. `Pontus` is built using `Next.js`, `Socket.IO`, `PostgreSQL`, `Prisma`, `Balena`, and `GCP`.

## Local Development

### Running the Application

To run this application locally we rely on `docker compose`. To get started, run `scripts/buildAndRunPontus.sh`, which will farm out to `docker compose`. This will start up a `PostgreSQL` server on port `5432` and start the web application on `localhost:3000`.

### Testing the Application

Unit tests for this application are located in the `__tests__` directory. To run these tests outside of Docker, run `pnpm test`. To run these tests inside of Docker, run `scripts/runTestsThroughDocker.sh`.

### Worfklows

There are currently workflows in this repo for running tests on pull request, merge, and on demand through GitHub actions. You can run these actions by going to the `Actions` pane, and selected the workflow from the menu on the left.
