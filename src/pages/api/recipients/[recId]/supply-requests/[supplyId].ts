import { NextApiResponse } from 'next';
import { Recipient } from '@prisma/client';
import { NextIronRequest } from '@/utils/session';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { withAuthedRequestSession } from '@/utils/middlewares/auth';
import { SessionChapterUser } from '../../../chapters/login';
import { SessionRecipientUser } from '../../login';
import prisma from '@/prisma-client';

export interface GetRecipientResponse {
  recipient: Recipient & {
    username: string;
  };
}
async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse | GetRecipientResponse>,
) {
  const { recId, supplyId } = req.query;

  const currentUser = req.session.get('user') as SessionChapterUser &
    SessionRecipientUser;

  const isValidRecipient =
    currentUser.recipient &&
    currentUser.recipient.recipientId === Number(recId);

  if (!currentUser || !currentUser.isLoggedIn) {
    return res.status(401).json({
      error: true,
      message:
        'Please login as an authorized user to access supply-request endpoint',
    });
  }

  switch (req.method) {
    case 'DELETE':
      try {
        // gets existing recipient user
        const existRecipient = await prisma.recipient.findUnique({
          where: {
            id: Number(recId),
          },
          select: {
            chapterId: true,
          },
        });

        const existSupplyRequest = await prisma.supplyRequest.findUnique({
          where: {
            id: Number(supplyId),
          },
        });

        // check to see if recipient exists
        if (!existRecipient) {
          return res.status(400).json({
            error: true,
            message: `No recipient found for id: ${recId}`,
          });
        }

        const isValidChapter =
          currentUser.chapterUser &&
          currentUser.chapterUser.chapterId === existRecipient.chapterId;

        const isValidSupplyRequest =
          existSupplyRequest?.recipientId === Number(recId);

        if (!isValidChapter && !isValidRecipient) {
          return res.status(400).json({
            error: true,
            message: `Please login as an authorized user to access this resource`,
          });
        }

        if (!isValidSupplyRequest) {
          return res.status(400).json({
            error: true,
            message: `The provided supply-request does not match with the provided recipient`,
          });
        }
        await prisma.supplyRequest.delete({
          where: {
            id: existSupplyRequest.id,
          },
        });

        return res.status(200).json({
          error: false,
          message: `Successfully deleted supply request`,
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
