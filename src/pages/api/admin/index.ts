import type { NextApiResponse } from 'next';
import { NextIronRequest } from '@/utils/session';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import prisma from '@/prisma-client';
import { SessionAdminUser } from './login';
import { validatePassword, validateUsername } from '@/utils/prisma-validation';
import { getPasswordHash } from '@/utils/password';
import { withAuthedRequestSession } from '@/utils/middlewares/auth';

export type GetAdminInfoResponse = {
  username: string;
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<GetAdminInfoResponse | ErrorResponse>,
) {
  const currentUser = req.session.get('user') as SessionAdminUser;

  // Check if requesting user is logged in and is an admin
  if (!currentUser || !currentUser.isLoggedIn || !currentUser.admin) {
    return res.status(401).json({
      error: true,
      message: 'Please login as an admin user to access this endpoint',
    });
  }

  switch (req.method) {
    case 'GET':
      try {
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
    case 'PUT':
      try {
        const { newUsername, newPassword } = req.body;

        validateUsername(newUsername);
        validatePassword(newPassword);

        const hash = await getPasswordHash(newPassword);

        const adminuser = await prisma.adminUser.findFirst();

        await prisma.user.update({
          where: {
            id: adminuser?.id,
          },
          data: {
            username: newUsername,
            hash,
          },
        });
        return res.status(200).json({
          error: false,
          message: `Successfully updated admin info`,
        });
      } catch (e) {
        return serverErrorHandler(e, res);
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withAuthedRequestSession(handler);
