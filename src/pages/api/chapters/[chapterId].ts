import { PrismaClient, Prisma } from '@prisma/client';
import type { NextApiResponse } from 'next';

import { SessionChapterUser } from './login';
import { SessionAdminUser } from '../admin/login';

import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest } from '@/utils/session';
import { withAuthedRequestSession } from '@/utils/middlewares/auth';
import { validateChapterInput } from '@/utils/prisma-validation';

interface ChapterUpdateBody {
  updatedChapter: Prisma.ChapterCreateInput;
}

export type ChapterInfo = {
  email: string;
  contactName: string;
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse | ChapterInfo>,
) {
  const { chapterId } = req.query;

  const user = req.session.get('user') as SessionAdminUser & SessionChapterUser;

  // Verify the provided id is a valid chapter id
  if (Number.isNaN(chapterId)) {
    return res.status(400).json({
      message: 'Please provide a valid chapter id',
      error: true,
    });
  }

  const parsedChapterId = Number(chapterId);

  // Check if admin or if the current chapter user match the chapter they want to update
  const isUpdateAuthorized =
    user.admin !== undefined ||
    (user.chapterUser && user.chapterUser.chapterId === parsedChapterId);

  switch (req.method) {
    case 'PUT':
      if (!isUpdateAuthorized) {
        return res.status(401).json({
          message: 'Please login as an authorized user to access the resource',
          error: true,
        });
      }

      try {
        const prisma = new PrismaClient();
        const chapterToUpdate = await prisma.chapter.findUnique({
          where: {
            id: parsedChapterId,
          },
        });

        if (!chapterToUpdate) {
          return res.status(400).json({
            message: 'No valid chapter found for the given chapter id',
            error: true,
          });
        }

        const { updatedChapter } = req.body as ChapterUpdateBody;
        // Validate update parameters
        if (!updatedChapter) {
          return res.status(400).json({
            message: 'Please provide valid request body with chapter details',
            error: true,
          });
        }

        try {
          validateChapterInput(updatedChapter);
        } catch (e) {
          const { message } = e as Error;
          return res.status(400).json({
            message,
            error: true,
          });
        }

        const data = {
          ...updatedChapter,
        };

        await prisma.chapter.update({
          where: {
            id: parsedChapterId,
          },
          data,
        });

        return res.status(200).json({
          message: 'Successfully updated the chapter',
          error: false,
        });
      } catch (e) {
        // console.error(e);
        return serverErrorHandler(e, res);
      }
    case 'DELETE':
      if (!user.admin) {
        return res.status(401).json({
          message: 'Please login as an admin to access the resource',
          error: true,
        });
      }
      try {
        const prisma = new PrismaClient();

        const chapterToDelete = await prisma.chapter.findUnique({
          where: {
            id: parsedChapterId,
          },
          select: {
            id: true,
            chapterUser: true,
          },
        });

        if (!chapterToDelete) {
          return res.status(400).json({
            error: true,
            message: `No chapter found for id: ${chapterId}`,
          });
        }

        // We must delete the chapter User before deleting the chapter
        const transactionQueries = [];

        if (chapterToDelete.chapterUser) {
          const deleteChapterUser = prisma.chapterUser.delete({
            where: {
              id: chapterToDelete.chapterUser.id,
            },
          });
          transactionQueries.push(deleteChapterUser);

          const deleteUser = prisma.user.delete({
            where: {
              id: chapterToDelete.chapterUser.userId,
            },
          });
          transactionQueries.push(deleteUser);
        }

        const deleteChapter = prisma.chapter.delete({
          where: {
            id: chapterToDelete.id,
          },
        });
        transactionQueries.push(deleteChapter);

        // Make a single transaction to ensure all relations are deleted or none
        await prisma.$transaction(transactionQueries);

        return res.status(200).json({
          error: false,
          message: `Successfully deleted the chapter ${chapterId}`,
        });
      } catch (e) {
        return serverErrorHandler(e, res);
      }

    case 'GET':
      try {
        // Check if the provided chapter user exists
        const prisma = new PrismaClient();

        if (Number.isNaN(chapterId)) {
          return res.status(400).json({
            message: 'Please provide a valid chapter id',
            error: true,
          });
        }

        // checks the auth of the current user
        const currentUser = req.session.get('user') as SessionChapterUser;

        if (
          !currentUser ||
          !currentUser.isLoggedIn ||
          !currentUser.chapterUser
        ) {
          return res.status(401).json({
            error: true,
            message:
              'Please login as a chapter user to create a view chapter info',
          });
        }

        // checks to see if the user is part of the chapter
        const { chapterUser } = currentUser;

        if (chapterUser.chapterId !== Number(chapterId)) {
          return res.status(401).json({
            message: 'You are not part of the chapter you are trying to access',
            error: true,
          });
        }

        const existingChapter = await prisma.chapter.findUnique({
          where: {
            id: Number(chapterId),
          },
        });

        // check if chapter exists
        if (!existingChapter) {
          return res.status(400).json({
            message: 'A chapter with that id does not exist',
            error: true,
          });
        }

        // return information if they are
        const { contactName, email } = existingChapter;
        return res.status(200).json({
          contactName,
          email,
        });
      } catch (e) {
        return serverErrorHandler(e, res);
      }

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withAuthedRequestSession(handler);
