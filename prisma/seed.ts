import { PrismaClient } from '@prisma/client';
import { getPasswordHash } from '../src/utils/password';

const prisma = new PrismaClient();

// List of passwords for initial User accounts
const PASSWORDS = {
  basicUser: 'bitsofgood',
  adminUser: 'bog_admin',
  chapterUser: 'bog_chapter',
  recipientUser: 'bog_recipient',
};

// Create basic models and relations
async function main() {
  // Basic User
  const basicUserPassword = await getPasswordHash(PASSWORDS.basicUser);
  await prisma.user.upsert({
    where: { username: 'panda' },
    update: {},
    create: {
      username: 'panda',
      hash: basicUserPassword,
    },
  });

  // Admin User only
  const adminUserPassword = await getPasswordHash(PASSWORDS.adminUser);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      hash: adminUserPassword,
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
      chapterName: 'Texas',
      email: 'texas@pfs.org',
    },
  });

  // Chapter with a chapter user
  const chapterUserPassword = await getPasswordHash(PASSWORDS.chapterUser);
  const chapter = await prisma.chapter.upsert({
    where: { email: 'georgia@pfs.org' },
    update: {},
    create: {
      chapterName: 'Georgia',
      email: 'georgia@pfs.org',
      chapterUser: {
        create: {
          name: 'Georgia Chapter User',
          email: 'georgia_user@pfs.org',
          phoneNumber: '4041110000',
          user: {
            create: {
              username: 'georgia_chapter',
              hash: chapterUserPassword,
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
      chapter: {
        connect: {
          id: chapter.id,
        },
      },
    },
  });

  // Recipient User with Recipient
  const recipientUserPassword = await getPasswordHash(PASSWORDS.recipientUser);
  await prisma.user.upsert({
    where: { username: 'recipient_user' },
    update: {},
    create: {
      username: 'recipient_user',
      hash: recipientUserPassword,
      recipient: {
        create: {
          recipient: {
            create: {
              name: 'Recipient User',
              email: 'recipient_user@pfs.org',
              phoneNumber: '4444444444',
              location: 'Savannah',
              chapter: {
                connect: {
                  id: chapter.id,
                },
              },
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
