import type { NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest } from '@/utils/session';
import {
  withAdminRequestSession,
  withAuthedRequestSession,
} from '@/utils/middlewares/auth';
import { SessionAdminUser } from '../admin/login';

interface ChapterUpdateBody {
  updatedChapter: Prisma.ChapterCreateInput;
}

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse>,
) {
  const { chapterId } = req.query;

  const user = req.session.get('user') as SessionAdminUser;

  // Verify the provided id is a valid chapter id
  if (Number.isNaN(chapterId)) {
    return res.status(400).json({
      message: 'Please provide a valid chapter id',
      error: true,
    });
  }

  switch (req.method) {
    case 'PUT':
      // TODO - determine if the user is Chapter User
      if (!user.admin || false) {
        return res.status(400).json({
          message: 'Please login as an authorized user to access the resource',
          error: true,
        });
      }
      try {
        const prisma = new PrismaClient();
        const chapterToUpdate = await prisma.chapter.findUnique({
          where: {
            id: Number(chapterId),
          },
        });

        if (!chapterToUpdate) {
          return res.status(400).json({
            message: 'No valid chapter found for the given chapter id',
            error: true,
          });
        }

        const { updatedChapter } = req.body as ChapterUpdateBody;
        if (!updatedChapter) {
          return res.status(400).json({
            message: 'Please provide valid request body with chapter details',
            error: true,
          });
        }

        const data = {
          ...chapterToUpdate,
          ...updatedChapter,
        };

        await prisma.chapter.update({
          where: {
            id: Number(chapterId),
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
        return res.status(400).json({
          message: 'Please login as an admin to access the resource',
          error: true,
        });
      }
      try {
        const prisma = new PrismaClient();

        const chapterToDelete = await prisma.chapter.findUnique({
          where: {
            id: Number(chapterId),
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

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withAuthedRequestSession(handler);
