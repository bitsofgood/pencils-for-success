import type { NextApiResponse } from 'next';
import { Item, SupplyRequest } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import prisma from '@/prisma-client';

type DataResponse = {
  supplyRequests: (SupplyRequest & {
    item: Item;
  })[];
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<DataResponse | ErrorResponse>,
) {
  const { limit } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const { chapterId } = req.query;

        const recipients = await prisma.recipient.findMany({
          where: {
            chapterId: Number(chapterId),
          },
          include: {
            supplyRequests: {
              include: {
                item: true,
              },
            },
          },
        });

        const supplyRequests = recipients
          .flatMap((recipient) => recipient.supplyRequests)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, parseInt(String(limit), 10) || 10);

        return res.status(200).json({ supplyRequests });
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
