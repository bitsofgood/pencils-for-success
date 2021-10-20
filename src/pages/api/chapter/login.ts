import type { NextApiResponse } from 'next';
import { ChapterUser, PrismaClient } from '@prisma/client';
import { withSession, NextIronRequest } from '@/utils/session';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { isMatchingHash } from '@/utils/password';

export type SessionChapterUser = {
  isLoggedIn: boolean;
  name: string;
  chapter: ChapterUser;
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<SessionChapterUser | ErrorResponse>,
) {
  switch (req.method) {
    case 'POST':
      try {
        const { username, password } = req.body;
        const prisma = new PrismaClient();

        if (username == null || password == null) {
          return res.status(400).json({
            error: true,
            message: 'Username and password are required',
          });
        }

        const fetchedUser = await prisma.user.findUnique({
          where: {
            username,
          },
          select: {
            hash: true,
            chapter: true,
          },
        });

        if (fetchedUser == null || fetchedUser.chapter == null) {
          return res.status(401).json({
            error: true,
            message: 'Invalid credentials',
          });
        }

        const hashesMatch = await isMatchingHash(password, fetchedUser.hash);
        if (hashesMatch) {
          const userInfo = {
            isLoggedIn: true,
            name: username,
            chapter: fetchedUser.chapter,
          };

          req.session.set('user', userInfo);
          await req.session.save();

          return res.status(200).json(userInfo);
        }
        return res.status(401).json({
          error: true,
          message: 'Invalid credentials',
        });
      } catch (e) {
        return serverErrorHandler(e, res);
      }
    default:
      res.setHeader('Allow', ['POST']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withSession(handler);
