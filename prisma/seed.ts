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

  // Chapter only
  await prisma.chapter.upsert({
    where: { email: 'texas@pfs.org' },
    update: {},
    create: {
      contactName: 'Texas',
      email: 'texas@pfs.org',
    },
  });

  // Chapter with a chapter user
  await prisma.chapter.upsert({
    where: { email: 'georgia@pfs.org' },
    update: {},
    create: {
      contactName: 'Georgia',
      email: 'georgia@pfs.org',
      ChapterUser: {
        create: {
          name: 'Georgia Chapter User',
          email: 'georgia_user@pfs.org',
          phoneNumber: '4041110000',
          user: {
            create: {
              username: 'georgia_chapter',
              hash: passwordHash,
            },
          },
        },
      },
    },
  });

  // Recipient only
  await prisma.recipient.upsert({
    where: { name: 'Recipient Only' },
    update: {},
    create: {
      name: 'Recipient Only',
      email: 'recipient_only@pfs.org',
      phoneNumber: '5555555555',
      location: 'Atlanta',
    },
  });

  // Recipient User with Recipient
  await prisma.user.upsert({
    where: { username: 'recipient_user' },
    update: {},
    create: {
      username: 'recipient_user',
      hash: passwordHash,
      recipient: {
        create: {
          recipient: {
            create: {
              name: 'Recipient User',
              email: 'recipient_user@pfs.org',
              phoneNumber: '4444444444',
              location: 'Savannah',
            },
          },
        },
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
