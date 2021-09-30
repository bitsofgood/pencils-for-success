import type { NextApiRequest, NextApiResponse } from 'next';
import { Chapter, PrismaClient } from '@prisma/client';
import { ErrorResponse } from '@/utils/types';

type DataResponse = {
  chapters: Chapter[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataResponse | ErrorResponse>,
) {
  switch (req.method) {
    case 'GET':
      try {
        const prisma = new PrismaClient();
        const chapters = await prisma.chapter.findMany();

        return res.status(200).json({ chapters });
      } catch (e) {
        return res
          .status(500)
          .json({ error: true, message: (e as Error).message });
      }

      break;
    default:
      res.setHeader('Allow', ['GET']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}
