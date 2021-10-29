import type { NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { SessionChapterUser } from '@/pages/api/chapters/login';
import { SessionRecipientUser } from '../login';

export type SupplyResponse = {
  items: any[];
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse | SupplyResponse>,
) {
  const { recId } = req.query;
  switch (req.method) {
    case 'GET':
      try {
        const prisma = new PrismaClient();

        // gets existing recipient user
        const existRecipient = await prisma.recipient.findUnique({
          where: {
            id: Number(recId),
          },
          select: {
            chapterId: true,
          },
        });
        // check to see if recipient exists
        if (!existRecipient) {
          return res.status(400).json({
            error: true,
            message: `No recipient found for id: ${recId}`,
          });
        }

        const currentUser = req.session.get('user') as SessionChapterUser &
          SessionRecipientUser;

        const isValidRecipient =
          currentUser.recipient &&
          currentUser.recipient.recipientId === Number(recId);
        const isValidChapter =
          currentUser.chapterUser &&
          currentUser.chapterUser.chapterId === existRecipient.chapterId;

        if (isValidRecipient || isValidChapter) {
          const supplyRequests = await prisma.supplyRequest.findMany({
            where: {
              recipientId: Number(recId),
            },
            select: {
              id: true,
              quantity: true,
              status: true,
              lastUpdated: true,
              created: true,
              note: true,
            },
          });

          return res.status(200).json({
            items: supplyRequests,
          });
        }
        return res.status(400).json({
          error: true,
          message: `You don't have access to this resource`,
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

export default withSession(handler);
