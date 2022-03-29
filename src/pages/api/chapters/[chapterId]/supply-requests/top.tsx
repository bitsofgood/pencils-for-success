import type { NextApiResponse } from 'next';
import { Item, SupplyRequest, SupplyRequestStatus } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import prisma from '@/prisma-client';

export type DataResponse = {
  topSupplyRequests: string[];
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
          .filter(
            (supplyRequest) =>
              supplyRequest.status === SupplyRequestStatus.PENDING,
          );

        const topItemQuantities: Record<string, number> = {};

        supplyRequests.forEach((supplyRequest) => {
          if (supplyRequest.item.name in topItemQuantities) {
            topItemQuantities[supplyRequest.item.name] +=
              supplyRequest.quantity;
          } else {
            topItemQuantities[supplyRequest.item.name] = supplyRequest.quantity;
          }
        });

        const topItemsArray: any[] = [];
        Object.entries(topItemQuantities).forEach((topItem) => {
          topItemsArray.push([topItem[0], topItem[1]]);
        });

        topItemsArray.sort((a: any, b: any) => b[1] - a[1]);

        const topSupplyRequests: string[] = topItemsArray
          .map((item: any) => item[0])
          .slice(0, parseInt(String(limit), 10) || 10);

        return res.status(200).json({
          topSupplyRequests,
        });
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
