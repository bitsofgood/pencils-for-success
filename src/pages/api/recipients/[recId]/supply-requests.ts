import type { NextApiResponse } from 'next';
import { Prisma, PrismaClient, SupplyRequest } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { SessionChapterUser } from '@/pages/api/chapters/login';
import { SessionRecipientUser } from '../login';
import { validateNewSupplyRequest } from '@/utils/prisma-validation';

export type SupplyResponse = {
  items: Omit<SupplyRequest, 'recipientId'>[];
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse | SupplyResponse>,
) {
  const { recId } = req.query;

  const currentUser = req.session.get('user') as SessionChapterUser &
    SessionRecipientUser;

  if (!currentUser || !currentUser.isLoggedIn) {
    return res.status(401).json({
      error: true,
      message: 'Please login to fetch supply requests',
    });
  }

  // Verify the provided id is a valid chapter id
  if (Number.isNaN(recId)) {
    return res.status(400).json({
      message: 'Please provide a valid recipient id',
      error: true,
    });
  }

  const isValidRecipient =
    currentUser.recipient &&
    currentUser.recipient.recipientId === Number(recId);

  switch (req.method) {
    case 'GET':
      try {
        // gets existing recipient user
        const prisma = new PrismaClient();
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
        return res.status(401).json({
          error: true,
          message: `You don't have access to this resource`,
        });
      } catch (e) {
        return serverErrorHandler(e, res);
      }
    case 'POST':
      try {
        const prisma = new PrismaClient();
        const recipientAddSupply = await prisma.recipient.findUnique({
          where: {
            id: Number(recId),
          },
        });

        if (!recipientAddSupply) {
          return res.status(400).json({
            error: true,
            message: `No recipient found for id: ${recId}`,
          });
        }

        if (!isValidRecipient) {
          return res.status(400).json({
            error: true,
            message: `Please login as an authorized recipient user to access this resource`,
          });
        }
        const newSupplyRequest = req.body as Prisma.SupplyRequestCreateInput;
        const { items } = req.body;
        const itemsId = [];

        if (Array.isArray(items)) {
          for (let i = 0; i < items.length; i += 1) {
            itemsId.push({ id: Number(items[i]) });
          }
        }
        validateNewSupplyRequest(newSupplyRequest);

        try {
          await prisma.supplyRequest.create({
            data: {
              quantity: newSupplyRequest.quantity,
              status: newSupplyRequest.status,
              note: newSupplyRequest.note,
              items: { connect: itemsId },
              recipient: { connect: { id: Number(recId) } },
            },
          });
        } catch (e) {
          return serverErrorHandler(e, res);
        }

        return res.status(200).json({
          error: false,
          message: `Successfully created supply request`,
        });
      } catch (e) {
        return serverErrorHandler(e, res);
      }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withSession(handler);
