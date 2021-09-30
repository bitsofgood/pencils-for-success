import type { NextApiRequest, NextApiResponse } from 'next';
import { ErrorResponse } from '@/utils/types';

type DataResponse = {
  chapters: string[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataResponse | ErrorResponse>,
) {
  switch (req.method) {
    case 'GET':
      try {
        // TODO - Use Prisma to find Chapters
        const chapters: string[] = ['Georgia'];

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
