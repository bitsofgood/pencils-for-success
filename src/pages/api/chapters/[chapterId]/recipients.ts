import type { NextApiResponse } from 'next';
import { Recipient, RecipientUser, User } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { SessionChapterUser } from '../login';
import { DetailedSupplyRequest } from '@/pages/api/recipients/[recId]/supply-requests';
import prisma from '@/prisma-client';

export type DetailedRecipient = Recipient & {
  supplyRequests: DetailedSupplyRequest[] | null | undefined;
  recipientUser:
    | (RecipientUser & {
        user: User;
      })
    | null
    | undefined;
};

type DataResponse = {
  recipients: DetailedRecipient[];
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<DataResponse | ErrorResponse>,
) {
  switch (req.method) {
    case 'GET':
      try {
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

        if (currentUser.chapterUser.chapterId !== Number(chapterId)) {
          return res.status(401).json({
            error: true,
            message: `Must be logged in as a user for this chapter`,
          });
        }

        const recipients = await prisma.recipient.findMany({
          where: {
            chapterId: Number(chapterId),
          },
          include: {
            recipientUser: {
              include: {
                user: true,
              },
            },
            supplyRequests: {
              include: {
                item: true,
              },
            },
          },
        });

        return res.status(200).json({ recipients });
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
