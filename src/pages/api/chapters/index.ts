import type { NextApiResponse } from 'next';
import { Chapter, PrismaClient, Prisma } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { SessionAdminUser } from '../admin/login';
import { getPasswordHash } from '@/utils/password';
import {
  validateChapterInput,
  validateNewChapterUserInput,
  validateNewUserInput,
} from '@/utils/prisma-validation';

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
