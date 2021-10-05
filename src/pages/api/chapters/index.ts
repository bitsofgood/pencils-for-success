import type { NextApiResponse } from 'next';
import { Chapter, PrismaClient, Prisma } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { SessionAdminUser } from '../admin/login';
import { getPasswordHash } from '@/utils/password';

type DataResponse = {
  chapters: Chapter[];
};

export type ChapterInputBody = {
  chapter: Prisma.ChapterCreateInput;
  newUser?: {
    chapterUser: Prisma.ChapterUserCreateInput;
    user: Prisma.UserCreateInput;
  };
};

/**
 * Checks if the provided chapter input is valid before storing in the database
 * @param chapter User input
 */
function validateChapterInput(chapter: Prisma.ChapterCreateInput) {
  const { contactName, email } = chapter || {};

  if (!contactName || contactName.trim().length === 0) {
    throw Error('Please provide a valid contact name');
  }

  if (!email || email.trim().length === 0) {
    throw Error('Please provide a valid email');
  }
}

/**
 * Checks if the provided chapter user input is valid before storing in the database
 * @param chapter User input
 */
function validateNewChapterUserInput(
  chapterUser: Prisma.ChapterUserCreateInput | undefined,
) {
  const { name, email } = chapterUser || {};

  if (!name || name.trim().length === 0) {
    throw Error('Please provide a valid name for the chapter user');
  }

  if (!email || email.trim().length === 0) {
    throw Error('Please provide a valid email for the chapter user');
  }
}

/**
 * Checks if the provided user input is valid before storing in the database
 * @param chapter User input
 */
function validateNewUserInput(user: Prisma.UserCreateInput | undefined) {
  const { username, hash } = user || {};

  if (!username || username.trim().length === 0) {
    throw Error('Please provide a valid username for the user');
  }

  if (!hash || hash.trim().length === 0) {
    throw Error('Please provide a valid password for the user');
  }
}

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<DataResponse | ErrorResponse>,
) {
  switch (req.method) {
    case 'GET':
      try {
        const prisma = new PrismaClient();
        const chapters = await prisma.chapter.findMany();

        return res.status(200).json({ chapters });
      } catch (e) {
        return serverErrorHandler(e, res);
      }

    case 'POST':
      try {
        const currentUser = req.session.get('user') as SessionAdminUser;

        // Check if requesting user is logged in and is an admin
        if (!currentUser || !currentUser.isLoggedIn || !currentUser.admin) {
          return res.status(401).json({
            error: true,
            message: 'Please login as an admin to create a new chapter',
          });
        }

        const prisma = new PrismaClient();

        // Validate user inputs
        const { chapter, newUser } = req.body as ChapterInputBody;
        const { chapterUser, user } = newUser || {};

        validateChapterInput(chapter);

        if (newUser) {
          validateNewChapterUserInput(chapterUser);
          validateNewUserInput(user);
        }

        // Add Prisma records
        const data = chapter;

        if (chapterUser && user) {
          const passwordHash = await getPasswordHash(user.hash);

          data.chapterUser = {
            create: {
              ...chapterUser,
              user: {
                create: {
                  username: user.username,
                  hash: passwordHash,
                },
              },
            },
          };
        }

        await prisma.chapter.create({
          data,
        });

        return res
          .status(200)
          .json({ error: false, message: 'Successfully created a chapter' });
      } catch (e) {
        return serverErrorHandler(e, res);
      }

    default:
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withSession(handler);
