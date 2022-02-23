import { NextApiResponse } from 'next';
import { PrismaClient, Recipient, Prisma, SupplyRequest } from '@prisma/client';
import { NextIronRequest } from '@/utils/session';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { withAuthedRequestSession } from '@/utils/middlewares/auth';
import { SessionChapterUser } from '@/pages/api/chapters/login';
import { SessionRecipientUser } from '../../login';
import { validateUpdatedSupplyRequest } from '@/utils/prisma-validation';

export interface UpdateSupplyRequestResponse {
  supplyRequest: SupplyRequest;
}

export type UpdatedSupplyRequestBody = {
  updatedSupplyRequest: Prisma.SupplyRequestUpdateInput;
};

async function getRecipientById(prisma: PrismaClient, id: number) {
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
  res: NextApiResponse<ErrorResponse | UpdateSupplyRequestResponse>,
) {
  const { recId, supplyRequestId } = req.query;

  const currentUser = req.session.get('user') as SessionChapterUser &
    SessionRecipientUser;

  const isValidRecipient =
    currentUser.recipient &&
    currentUser.recipient.recipientId === Number(recId);

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

  const prisma = new PrismaClient();

  const recipient = await getRecipientById(prisma, Number(recId));

  if (
    currentUser.chapterUser.chapterId !== recipient?.chapterId &&
    currentUser.recipient.id !== recipient?.id
  ) {
    return res.status(403).json({
      error: true,
      message: "You don't have access to this endpoint.",
    });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { updatedSupplyRequest } = req.body;

        try {
          validateUpdatedSupplyRequest(updatedSupplyRequest);
        } catch (e) {
          const { message } = e as Error;
          return res.status(400).json({
            error: true,
            message,
          });
        }

        const prismaSupplyRequest = await prisma.supplyRequest.update({
          where: {
            id: Number(supplyRequestId),
          },
          data: updatedSupplyRequest,
        });

        return res.status(200).json({
          supplyRequest: prismaSupplyRequest,
        });
      } catch (e) {
        return serverErrorHandler(e, res);
      }
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
            id: Number(supplyRequestId),
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
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withAuthedRequestSession(handler);
