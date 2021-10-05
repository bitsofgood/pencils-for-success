import type { NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withSession, NextIronRequest } from '@/utils/session';
import { ErrorResponse } from '@/utils/types';
import { isMatchingHash } from '@/utils/password';

type DataResponse = {
  isLoggedIn: boolean;
  name: string;
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<DataResponse | ErrorResponse>,
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
            admin: true,
          },
        });
        if (fetchedUser == null || fetchedUser.admin == null) {
          return res.status(401).json({
            error: true,
            message: 'Invalid credentials',
          });
        }
        const hashesMatch = await isMatchingHash(password, fetchedUser.hash);
        if (hashesMatch) {
          const userInfo = { isLoggedIn: true, name: username };
          req.session.set('user', userInfo);
          return res.status(200).json(userInfo);
        }
        return res.status(401).json({
          error: true,
          message: 'Invalid credentials',
        });
      } catch (e) {
        const { message } = e as Error;
        return res.status(500).json({
          error: true,
          message,
        });
      }
    default:
      res.setHeader('Allow', ['POST']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withSession(handler);
