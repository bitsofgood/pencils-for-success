import type { NextApiResponse } from 'next';
import { Recipient, RecipientUser, User } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { SessionChapterUser } from '../login';
import { DetailedSupplyRequest } from '@/pages/api/recipients/[recId]/supply-requests';
import prisma from '@/prisma-client';

export type DetailedRecipient = Recipient & {
  supplyRequests: DetailedSupplyRequest[];
  recipientUser:
    | (RecipientUser & {
        user: User;
      })
    | null
    | undefined;
};

type DataResponse = {
  recipients: (DetailedRecipient | Recipient)[];
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
        const { chapterId } = req.query;

        const isMatchingChapterUser =
          !!currentUser &&
          !!currentUser.isLoggedIn &&
          !!currentUser.chapterUser &&
          currentUser.chapterUser.chapterId === Number(chapterId);

        const recipients = await prisma.recipient.findMany({
          where: {
            chapterId: Number(chapterId),
          },
          include: isMatchingChapterUser
            ? {
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
              }
            : null,
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
