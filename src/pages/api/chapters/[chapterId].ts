import type { NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest } from '@/utils/session';
import { withAdminRequestSession } from '@/utils/middlewares/auth';

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse>,
) {
  const { chapterId } = req.query;

  switch (req.method) {
    case 'DELETE':
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
      res.setHeader('Allow', ['DELETE']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withAdminRequestSession(handler);
