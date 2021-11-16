import type { NextApiResponse } from 'next';
import { PrismaClient, Item, SupplyRequest } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { SessionChapterUser } from '@/pages/api/chapters/login';
import { SessionRecipientUser } from '../login';
import { validateNewSupplyRequest } from '@/utils/prisma-validation';
import { NewSupplyRequestInputBody } from '@/utils/api';

export type DetailedSupplyRequest = SupplyRequest & {
  item: Item;
};

export interface GetSupplyRequestsResponse {
  items: DetailedSupplyRequest[];
}

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse | GetSupplyRequestsResponse>,
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
            include: {
              item: true,
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
        if (!isValidRecipient) {
          return res.status(401).json({
            error: true,
            message: `Please login as an authorized recipient user to access this resource`,
          });
        }
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

        const newSupplyRequest = req.body as NewSupplyRequestInputBody;

        validateNewSupplyRequest(newSupplyRequest);

        try {
          await prisma.supplyRequest.create({
            data: {
              quantity: newSupplyRequest.quantity,
              status: newSupplyRequest.status,
              note: newSupplyRequest.note,
              item: { connect: newSupplyRequest.item },
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
