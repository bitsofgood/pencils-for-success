import { NextApiResponse } from 'next';
import { Recipient } from '@prisma/client';
import { NextIronRequest } from '@/utils/session';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { withAuthedRequestSession } from '@/utils/middlewares/auth';
import { SessionChapterUser } from '../chapters/login';
import { SessionRecipientUser } from './login';
import prisma from '@/prisma-client';

export interface GetRecipientResponse {
  recipient: Recipient & {
    username: string;
  };
}

async function getRecipientById(id: number) {
  return prisma.recipient.findUnique({
    where: {
      id,
    },
    include: {
      recipientUser: {
        include: {
          user: true,
        },
      },
    },
  });
}

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse | GetRecipientResponse>,
) {
  const { recId } = req.query;

  const user = req.session.get('user') as SessionChapterUser &
    SessionRecipientUser;

  if (!user || !user.isLoggedIn) {
    return res.status(401).json({
      error: true,
      message:
        'Please login as an authorized user to access /recipients endpoint',
    });
  }

  switch (req.method) {
    case 'DELETE':
      try {
        const parsedId = Number(recId);

        // get the recipient to be deleted
        const existRecipient = await getRecipientById(parsedId);

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
            message:
              'Please login as an authorized user to access /recipients endpoint',
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
            id: parsedId,
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

    case 'GET': {
      const parsedId = Number(recId);

      // Check if the provided recipient exists
      const existRecipient = await getRecipientById(parsedId);
      if (!existRecipient) {
        return res.status(401).json({
          error: true,
          message: `Recipient of id ${recId} does not exist`,
        });
      }

      // Check if the user is authorized to view the details
      const isAuthorizedChapterUser =
        user.chapterUser &&
        user.chapterUser.chapterId === existRecipient.chapterId;

      const isAuthorizedRecipient =
        user.recipient && user.recipient.recipientId === parsedId;

      const isAuthorizedUser = isAuthorizedChapterUser || isAuthorizedRecipient;

      if (!isAuthorizedUser) {
        return res.status(401).json({
          error: true,
          message:
            'Please login as an authorized user to access /recipients endpoint',
        });
      }

      const parsedRecipient = {
        ...existRecipient,
        username: existRecipient.recipientUser?.user?.username || '',
      };

      return res.status(200).json({
        recipient: parsedRecipient,
      });
    }

    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withAuthedRequestSession(handler);
