/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { PrismaClient, SupplyRequestStatus } from '@prisma/client';
import { generateChapterSlug } from '../src/utils/slug';
import { getPasswordHash } from '../src/utils/password';

const prisma = new PrismaClient();

const ADMIN_USER = {
  username: 'admin',
  password: 'admin_password',
};
const CHAPTERS = [
  {
    chapterName: 'Georgia Chapter',
    contactName: 'Michelle Smith',
    email: 'michelle.smith@gmail.com',
    phoneNumber: '980-456-4738',
    username: 'georgia_chapter',
    password: 'chapter_password',
  },
  {
    chapterName: 'Kansas Chapter',
    contactName: 'Michael Brown',
    email: 'michaelbrown2@gmail.com',
    phoneNumber: '316-453-6903',
    username: 'kansas_chapter',
    password: 'chapter_password',
  },
  {
    chapterName: 'Texas Chapter',
    contactName: 'Jordan Miller',
    email: 'jmiller6@gmail.com',
    phoneNumber: '817-392-9492',
    username: 'texas_chapter',
    password: 'chapter_password',
  },
];

const RECIPIENT_PASSWORD = 'recipient_password';
const RECIPIENTS = [
  // 8
  {
    name: 'Frank Seale Middle School',
    contactName: 'Kristopher Vernon ',
    email: 'kristopher.vernon@misd.gs',
    phoneNumber: '(469) 856-5600',
    primaryStreetAddress: '700 George Hopper Rd',
    secondaryStreetAddress: '',
    city: 'Midlothian',
    state: 'TX',
    country: 'USA',
    postalCode: '76065',
    username: 'frank_seale',
    password: RECIPIENT_PASSWORD,
    chapterId: 3,
  },
  {
    name: 'J.R. Irvin Elementary School',
    contactName: 'Khourie Jones',
    email: 'Khourie Jones',
    phoneNumber: '(469) 856-6000',
    primaryStreetAddress: '600 S 5th St',
    secondaryStreetAddress: '',
    city: 'Midlothian',
    state: 'TX',
    country: 'USA',
    postalCode: '76065',
    username: 'jr_irvin',
    password: RECIPIENT_PASSWORD,
    chapterId: 3,
  },
  {
    name: 'Spring Creek ISD',
    contactName: 'Danny Finch',
    email: 'danny.finch@region16.net',
    phoneNumber: '(806) 273-6791',
    primaryStreetAddress: '9849 FM 2171',
    secondaryStreetAddress: '',
    city: 'Skellytown',
    state: 'TX',
    country: 'USA',
    postalCode: '79080',
    username: 'spring_creek',
    password: RECIPIENT_PASSWORD,
    chapterId: 3,
  },
  {
    name: 'Hazel Grove Elementary School',
    contactName: 'Gina Glass',
    email: 'ginag@kscity.k12.ks.us',
    phoneNumber: '(918) 868-2427 ',
    primaryStreetAddress: '2401 N 67th St',
    secondaryStreetAddress: '',
    city: 'Kansas City',
    state: 'KS',
    country: 'USA',
    postalCode: '66104',
    username: 'hazel_grove',
    password: RECIPIENT_PASSWORD,
    chapterId: 2,
  },
  {
    name: 'Free State High School',
    contactName: 'Grace Lambert',
    email: 'gracel@law.k12.ks.us',
    phoneNumber: '(918) 393-2932',
    primaryStreetAddress: '4700 Overland Dr',
    secondaryStreetAddress: '',
    city: 'Lawrence',
    state: 'KS',
    country: 'USA',
    postalCode: '66049',
    username: 'free_state',
    password: RECIPIENT_PASSWORD,
    chapterId: 2,
  },
  {
    name: 'South Fulton Middle School',
    contactName: 'Laura Pitts',
    email: 'pittsl@ocboe.com',
    phoneNumber: '(731) 479-1441',
    primaryStreetAddress: '1700 N. Fifth St',
    secondaryStreetAddress: '',
    city: 'Union City',
    state: 'GA',
    country: 'USA',
    postalCode: '38261',
    username: 'south_fulton',
    password: RECIPIENT_PASSWORD,
    chapterId: 1,
  },
  {
    name: 'John F Kennedy Middle School',
    contactName: 'Diamond Ford',
    email: 'djack@atl.k12.ga.us',
    phoneNumber: '(404) 802-3600',
    primaryStreetAddress: '225 Griffin St NW',
    secondaryStreetAddress: '',
    city: 'Atlanta',
    state: 'GA',
    country: 'USA',
    postalCode: '30314',
    username: 'john_k',
    password: RECIPIENT_PASSWORD,
    chapterId: 1,
  },
  {
    name: 'Crawford W Long Middle School',
    contactName: 'Lisa Hill',
    email: 'mvjohnson@atlanta.k12.ga.us',
    phoneNumber: '(404) 802-4800',
    primaryStreetAddress: '3200 Latona Dr SW',
    secondaryStreetAddress: '',
    city: 'Atlanta',
    state: 'GA',
    country: 'USA',
    postalCode: '30354',
    username: 'crawford',
    password: RECIPIENT_PASSWORD,
    chapterId: 1,
  },
];
const ITEMS = [
  'AP prep books',
  'SAT prep books',
  'ACT prep books',
  'Computers',
  'Pencils',
  'Pens',
  'Erasers',
  'Markers',
  'Paper',
  'Binders',
  'Scissors',
  'Glue',
  'Colored pencils',
  'Construction paper',
  'Cackpacks',
  'Miscellaneous',
]; // 16

async function main() {
  // ITEMS
  await Promise.all(
    ITEMS.map(async (item) =>
      prisma.item.upsert({
        where: {
          name: item,
        },
        update: {},
        create: {
          name: item,
        },
      }),
    ),
  );
  // ADMIN USER
  const adminPassword = await getPasswordHash(ADMIN_USER.password);
  await prisma.user.upsert({
    where: { username: ADMIN_USER.username },
    update: {},
    create: {
      username: 'admin',
      hash: adminPassword,
      admin: {
        create: {},
      },
    },
  });

  // CHAPTERS AND CHAPTER USER

  for (const chapter of CHAPTERS) {
    const chapterPasswordHash = await getPasswordHash(chapter.password);
    await prisma.chapter.upsert({
      where: { chapterName: chapter.chapterName },
      update: {},
      create: {
        chapterName: chapter.chapterName,
        chapterSlug: generateChapterSlug(chapter.chapterName),
        email: chapter.email,
        contactName: chapter.contactName,
        phoneNumber: chapter.phoneNumber,
        chapterUser: {
          create: {
            user: {
              create: {
                username: chapter.username,
                hash: chapterPasswordHash,
              },
            },
          },
        },
      },
    });
  }

  // RECIPIENTS AND SUPPLY REQUESTS
  await Promise.all(
    RECIPIENTS.map(async (recipient) => {
      const recipientPasswordHash = await getPasswordHash(recipient.password);
      const createdRecipient = await prisma.recipient.upsert({
        where: {
          name: recipient.name,
        },
        update: {},
        create: {
          name: recipient.name,
          contactName: recipient.contactName,
          email: recipient.email,
          phoneNumber: recipient.phoneNumber,
          primaryStreetAddress: recipient.primaryStreetAddress,
          secondaryStreetAddress: recipient.secondaryStreetAddress,
          city: recipient.city,
          state: recipient.state,
          country: recipient.country,
          postalCode: recipient.postalCode,
          chapter: {
            connect: {
              id: recipient.chapterId,
            },
          },
          recipientUser: {
            create: {
              user: {
                create: {
                  username: recipient.username,
                  hash: recipientPasswordHash,
                },
              },
            },
          },
        },
      });

      await Promise.all(
        [...Array(15)].map(async () =>
          prisma.supplyRequest.create({
            data: {
              quantity: Math.round(Math.random() * 100),
              status:
                Math.random() > 0.7
                  ? SupplyRequestStatus.COMPLETE
                  : SupplyRequestStatus.PENDING,
              note:
                Math.random() > 0.7
                  ? 'extra details about the supply request'
                  : '',
              recipient: { connect: { id: createdRecipient.id } },
              item: {
                connect: {
                  id: Math.floor(Math.random() * 16) + 1,
                },
              },
            },
          }),
        ),
      );
    }),
  );
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
