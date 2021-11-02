import type { NextApiResponse } from 'next';
import { Chapter, PrismaClient, Prisma } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { SessionAdminUser } from '../admin/login';
import { getPasswordHash } from '@/utils/password';
import {
  validateChapterInput,
  validateNewUserInput,
} from '@/utils/prisma-validation';
import { ChapterDetails } from './[chapterId]';

export type GetChapterResponse = {
  chapters: Chapter[];
};

export type PostChapterResponse = {
  chapter: ChapterDetails | null;
};

export type NewChapterInputBody = {
  chapter: Prisma.ChapterCreateInput;
  newUser: Prisma.ChapterUserCreateInput & Prisma.UserCreateInput;
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<
    GetChapterResponse | PostChapterResponse | ErrorResponse
  >,
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

        // Check if the user inputs are valid
        const { chapter, newUser } = req.body as NewChapterInputBody;

        try {
          validateChapterInput(chapter);
          validateNewUserInput(newUser);
        } catch (e) {
          const { message } = e as Error;
          return res.status(400).json({
            error: true,
            message,
          });
        }

        const { username, hash } = newUser;

        const user = {
          username,
          hash,
        } as Prisma.UserCreateInput;

        const passwordHash = await getPasswordHash(hash);

        // Add Prisma records
        const prisma = new PrismaClient();

        const data = {
          ...chapter,
          chapterUser: {
            create: {
              user: {
                create: {
                  ...user,
                  hash: passwordHash,
                },
              },
            },
          },
        };

        const createdChapter = await prisma.chapter.create({
          data,
        });

        // We cannot retrieve newly created records - https://github.com/prisma/prisma/discussions/2367#discussioncomment-9059
        // As a workaround, query the details for newly created chapter to get information for chapter user and user
        const chapterWithUser = await prisma.chapter.findUnique({
          where: {
            id: createdChapter.id,
          },
          include: {
            chapterUser: {
              include: {
                user: true,
              },
            },
          },
        });

        return res.status(200).json({
          chapter: chapterWithUser,
        });
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
