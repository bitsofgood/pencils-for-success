import { NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextIronRequest } from '@/utils/session';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { withAuthedRequestSession } from '@/utils/middlewares/auth';
import { SessionChapterUser } from '../chapters/login';
import { SessionRecipientUser } from './login';

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse>,
) {
  const { recId } = req.query;

  const user = req.session.get('user') as SessionChapterUser &
    SessionRecipientUser;

  switch (req.method) {
    case 'DELETE':
      try {
        const prisma = new PrismaClient();

        if (!user || !user.isLoggedIn) {
          return res.status(401).json({
            error: true,
            message: 'Please login as a chapter user to delete recipient',
          });
        }

        // get the recipient to be deleted
        const existRecipient = await prisma.recipient.findUnique({
          where: {
            id: Number(recId),
          },
          select: {
            chapterId: true,
            recipientUser: true,
          },
        });

        if (!existRecipient) {
          return res.status(401).json({
            error: true,
            message: `Recipient of id ${recId} does not exist`,
          });
        }

        const isAuthorizedChapterUser =
          user.chapterUser &&
          user.chapterUser.chapterId === existRecipient.chapterId;

        if (!isAuthorizedChapterUser) {
          return res.status(401).json({
            error: true,
            message: "You don't have access to this chapter resource",
          });
        }

        const transactionQueries = [];

        if (existRecipient.recipientUser) {
          const deleteRecipientUser = prisma.recipientUser.delete({
            where: {
              id: existRecipient.recipientUser.id,
            },
          });
          const deleteUser = prisma.user.delete({
            where: {
              id: existRecipient.recipientUser.userId,
            },
          });
          transactionQueries.push(deleteRecipientUser);
          transactionQueries.push(deleteUser);
        }

        const deleteRecipient = prisma.recipient.delete({
          where: {
            id: Number(recId),
          },
        });

        transactionQueries.push(deleteRecipient);

        await prisma.$transaction(transactionQueries);

        return res.status(200).json({
          error: true,
          message: 'Successfully deleted recipient',
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

export default withAuthedRequestSession(handler);
