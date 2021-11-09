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

        // get the recipient to be deleted
        const existRecipient = await prisma.recipient.findUnique({
          where: {
            id: Number(recId),
          },
          select: {
            chapterId: true,
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
          user.chapterUser.chapterId === existRecipient?.chapterId;

        const isAuthorizedRecipientUser =
          user.recipient && user.recipient.recipientId === Number(recId);

        if (!isAuthorizedChapterUser && !isAuthorizedRecipientUser) {
          return res.status(401).json({
            error: true,
            message: "You don't have access to this chapter resource",
          });
        }

        const existUsers = await prisma.recipientUser.findFirst({
          where: {
            recipientId: Number(recId),
          },
        });
        const transactionQueries = [];

        if (existUsers) {
          const deleteRecipientUser = prisma.recipientUser.delete({
            where: {
              id: existUsers.recipientId,
            },
          });
          const deleteUser = prisma.user.delete({
            where: {
              id: existUsers.id,
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
