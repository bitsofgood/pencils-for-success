import { Item, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';

export interface GetItemsResponse {
  items: Item[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | GetItemsResponse>,
) {
  switch (req.method) {
    case 'GET':
      try {
        const prisma = new PrismaClient();
        const items = await prisma.item.findMany();

        return res.status(200).json({ items });
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
