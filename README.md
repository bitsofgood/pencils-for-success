# pencils-for-success

Multi-purpose web platform for managing supply requests and providing donors with information about needed supplies.

## Running

### Development

1. Install dependencies: `npm install`
2. Sync development environment variables: `npm run secrets`

- You will be prompted for a password. Ask your EM to send it to you.
- **NOTE:** Windows users need to run `npm run secrets:login` and `npm run secrets:sync` instead

3. Start development server: `npm run dev`

**IMPORTANT:** If you are working on Prisma schema changes, you will need to host your own Postgres instance to prevent database/client conflicts. [Postgres.app](https://postgresapp.com/downloads.html) is a convenient way to setup a local instance for MacOS. After you start your instance, replace `DATABASE_URL` in `.env` with the database connection string `postgresql://YOUR_SYSTEM_USERNAME:PASSWORD@localhost` (replace `YOUR_SYSTEM_USERNAME` and `PASSWORD`)
