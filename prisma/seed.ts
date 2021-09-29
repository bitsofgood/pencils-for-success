import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const password = 'bitsofgood';
  // TODO - Use bcrypt to generate a hash here
  const passwordHash = password;

  // Basic User
  await prisma.user.upsert({
    where: { username: 'panda' },
    update: {},
    create: {
      username: 'panda',
      hash: passwordHash,
    },
  });

  // Admin User only
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      hash: passwordHash,
      admin: {
        create: {},
      },
    },
  });

  // Chapter User only
  await prisma.user.upsert({
    where: { username: 'chapter' },
    update: {},
    create: {
      username: 'chapter',
      hash: passwordHash,
      chapter: {
        create: {
          name: 'Chapter Test User',
          email: 'chapteruser@pfs.org',
          phoneNumber: '4040000000',
        },
      },
    },
  });

  // Recipient User only
  await prisma.user.upsert({
    where: { username: 'recipient' },
    update: {},
    create: {
      username: 'recipient',
      hash: passwordHash,
      recipient: {
        create: {},
      },
    },
  });
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
