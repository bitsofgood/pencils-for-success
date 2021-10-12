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
  res: NextApiResponse<ChapterInfo | ErrorResponse>,
) {
  switch (req.method) {
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
          if (!currentUser || !currentUser.isLoggedIn || !currentUser.admin) {
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
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withAdminRequestSession(handler);
