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

export type NewChapterInputBody = {
  chapter: Prisma.ChapterCreateInput;
  newUser: Prisma.ChapterUserCreateInput & Prisma.UserCreateInput;
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

        // Check if the user inputs are valid
        const { chapter, newUser } = req.body as NewChapterInputBody;

        try {
          validateChapterInput(chapter);
          validateNewChapterUserInput(newUser);
          validateNewUserInput(newUser);
        } catch (e) {
          const { message } = e as Error;
          return res.status(400).json({
            error: true,
            message,
          });
        }

        const { username, hash, name, email, phoneNumber } = newUser;

        const chapterUser = {
          name,
          email,
          phoneNumber,
        } as Prisma.ChapterUserCreateInput;

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
              ...chapterUser,
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

        return res.status(200).json({
          error: false,
          message: `Successfully created a chapter: ${createdChapter.id}`,
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
