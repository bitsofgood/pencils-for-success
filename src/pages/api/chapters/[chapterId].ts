import type { NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest } from '@/utils/session';
import { withAdminRequestSession } from '@/utils/middlewares/auth';
import { SessionAdminUser } from '../admin/login';

export type ChapterInfo = {
  email: string;
  contactName: string;
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse | ChapterInfo>,
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
      case 'GET':
        try {
          // Check if the provided chapter user exists
          const prisma = new PrismaClient();
  
          const { chapterId } = req.query;
          const existingChapter = await prisma.chapter.findUnique({
            where: {
              id: Number(chapterId),
            },
          });
  
          if (existingChapter) {
            // Check if the user inputs are valid
            const chapterUsers = await prisma.chapterUser.findMany({
              where: {
                chapterId: Number(chapterId),
              },
            });
            // checks the auth of the current user
            const currentUser = req.session.get('user') as SessionAdminUser;
            if (!currentUser || !currentUser.isLoggedIn) {
              return res.status(401).json({
                error: true,
                message: 'Please login as an admin to create a view chapter info',
              });
            }
            // checks to see if the user is part of the chapter
            const { name } = currentUser;
            let inChapter = false;
            for (let i = 0; i < chapterUsers.length; i += 1) {
              if (chapterUsers[i].name === name) {
                inChapter = true;
              }
            }
            // return information if they are
            if (inChapter) {
              const { contactName, email } = existingChapter;
              return res.status(200).json({
                contactName,
                email,
              });
            }
  
            return res.status(401).json({
              error: true,
              message: 'You are not a member of the requested chapter',
            });
          }
  
          return res.status(400).json({
            error: true,
            message: `No chapter found for id: ${chapterId}`,
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
