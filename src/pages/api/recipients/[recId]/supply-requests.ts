import type { NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { SessionChapterUser } from '../../chapter/login';
import { SessionRecipientUser } from '../../recipient/login';

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
            id: true,
            recipientUser: true,
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

        let access = false;

        const currentUser = req.session.get('user') as SessionChapterUser &
          SessionRecipientUser;
        if (currentUser.recipient) {
          const { recipient } = currentUser;
          if (recipient.recipientId === Number(recId)) {
            access = true;
          }
        } else if (currentUser.chapter) {
          const { chapter } = currentUser;
          if (chapter.chapterId === existRecipient.chapterId) {
            access = true;
          }
        } else {
          return res.status(400).json({
            error: true,
            message: `You don't have access to this resource`,
          });
        }
        if (access) {
          const supplyRequests = await prisma.supplyRequest.findMany({
            where: {
              recipientId: Number(recId),
            },
          });
          const supplyItems = [];

          for (let i = 0; i < supplyRequests.length; i += 1) {
            const current = {
              id: supplyRequests[i].id,
              quantity: supplyRequests[i].quantity,
              status: supplyRequests[i].status,
              lastUpdated: supplyRequests[i].lastUpdated,
              created: supplyRequests[i].created,
              note: supplyRequests[i].note,
            };
            supplyItems.push(current);
          }
          return res.status(200).json({
            items: supplyItems,
          });
        }
        return res.status(400).json({
          error: true,
          message: `You don't have access to this supply request`,
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
