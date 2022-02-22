import type { NextApiResponse } from 'next';
import { withSession, NextIronRequest } from '@/utils/session';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import prisma from '@/prisma-client';
import { SessionAdminUser } from './login';

export type GetAdminInfoResponse = {
  username: string;
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<GetAdminInfoResponse | ErrorResponse>,
) {
  switch (req.method) {
    case 'GET':
      try {
        const currentUser = req.session.get('user') as SessionAdminUser;

        // Check if requesting user is logged in and is an admin
        if (!currentUser || !currentUser.isLoggedIn || !currentUser.admin) {
          return res.status(401).json({
            error: true,
            message: 'Please login as an admin to access this endpoint',
          });
        }

        const userData = await prisma.user.findUnique({
          where: {
            id: currentUser.admin.userId,
          },
        });

        if (!userData) {
          return res.status(401).json({
            error: true,
            message: 'This user does not exist',
          });
        }

        return res.status(200).json({
          username: userData.username,
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
