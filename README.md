# pencils-for-success

Multi-purpose web platform for managing supply requests and providing donors with information about needed supplies.

## Setup

1. Install dependencies: `npm install`
2. Sync development environment variables: `npm run secrets`

- You will be prompted for a password. Ask your EM to send it to you.
- **NOTE:** Windows users need to run `npm run secrets:login` and `npm run secrets:sync` instead

After this point, all dependencies and default environment variables will have been installed.

### Custom DB

The default environment variable `DATABASE_URL` points towards a cloud database with mock data. If you are working on Prisma schema changes, you will need to host your own Postgres instance to prevent database/client conflicts. [Postgres.app](https://postgresapp.com/downloads.html) is a convenient way to setup a local instance for MacOS.

1. After you start your instance, replace `DATABASE_URL` in `.env` with the database connection string `postgresql://YOUR_SYSTEM_USERNAME:PASSWORD@localhost` (replace `YOUR_SYSTEM_USERNAME` and `PASSWORD`)
2. Run `npm run seed:dev` to seed mock data into your database

## Development

Start development server with `npm run dev`

### NPM Scripts

- `lint`: Runs eslint on all source files
- `format`: Autoformats all sources files
- `db:generate`: Generates Prisma client assets based on `prisma/schema.prisma` ([more info here](https://www.prisma.io/docs/reference/api-reference/command-reference#generate))
- `db:push`: "Pushes" state of prisma schema to connected database, updating tables etc. ([more info here](https://www.prisma.io/docs/reference/api-reference/command-reference#db-push))
- `dev`: Starts NextJS development server
- `secrets`: Runs series of scripts to sync cloud environment variables to `.env`
