import type { NextApiResponse } from 'next';
import { Chapter, PrismaClient, Prisma } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { SessionAdminUser } from '../admin/login';

type DataResponse = {
  chapters: Chapter[];
};

/**
 * Checks if the provided chapter input is valid before storing in the database
 * @param chapter User input
 */
function validateChapterInput(chapter: Prisma.ChapterCreateInput) {
  const { contactName, email } = chapter || {};

  if (!contactName || contactName.trim().length === 0) {
    throw Error('Please provide a valid contact name');
  }

  if (!email || email.trim().length === 0) {
    throw Error('Please provide a valid email');
  }
}

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<DataResponse | ErrorResponse>,
) {
  switch (req.method) {
    case 'GET':
      try {
        const prisma = new PrismaClient();
        const chapters = await prisma.chapter.findMany();

        return res.status(200).json({ chapters });
      } catch (e) {
        return serverErrorHandler(e, res);
      }

    case 'POST':
      try {
        const user = req.session.get('user') as SessionAdminUser;

        // Check if requesting user is logged in and is an admin
        if (!user || !user.isLoggedIn || !user.admin) {
          return res.status(401).json({
            error: true,
            message: 'Please login as an admin to create a new chapter',
          });
        }

        // Validate user input
        const chapter = req.body.chapter as Prisma.ChapterCreateInput;
        validateChapterInput(chapter);

        const prisma = new PrismaClient();
        await prisma.chapter.create({
          data: chapter,
        });

        return res
          .status(200)
          .json({ error: false, message: 'Successfully created a chapter' });
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
