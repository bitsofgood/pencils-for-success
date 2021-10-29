import type { NextApiResponse } from 'next';
import { PrismaClient, Recipient } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { SessionChapterUser } from '../login';

type DataResponse = {
  recipients: Recipient[];
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<DataResponse | ErrorResponse>,
) {
  switch (req.method) {
    case 'GET':
      try {
        const prisma = new PrismaClient();

        const currentUser = req.session.get('user') as SessionChapterUser;

        // Check if requesting user is logged in and is an chapter
        if (
          !currentUser ||
          !currentUser.isLoggedIn ||
          !currentUser.chapterUser
        ) {
          return res.status(401).json({
            error: true,
            message: 'Please login as a chapter to use this endpoint',
          });
        }

        const { chapterId } = req.query;
        const chapter = await prisma.chapter.findUnique({
          where: {
            id: Number(chapterId),
          },
          include: {
            chapterUser: true,
            recipients: true,
          },
        });

        if (!chapter) {
          return res.status(400).json({
            error: true,
            message: `No chapter found for id: ${chapterId}`,
          });
        }

        if (chapter.chapterUser?.id !== currentUser.chapterUser.id) {
          return res.status(401).json({
            error: true,
            message: `Must be logged in as a user for this chapter`,
          });
        }

        return res.status(200).json({ recipients: chapter.recipients });
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
