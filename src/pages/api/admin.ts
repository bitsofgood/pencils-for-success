import { NextApiResponse } from 'next';
import { NextIronRequest } from '@/utils/session';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { withAuthedRequestSession } from '@/utils/middlewares/auth';
import prisma from '@/prisma-client';
import { SessionAdminUser } from './admin/login';
import { getPasswordHash } from '@/utils/password';
import { validatePassword, validateUsername } from '@/utils/prisma-validation';

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse>,
) {
  const currentUser = req.session.get('user') as SessionAdminUser;

  if (!currentUser.admin || !currentUser.isLoggedIn) {
    return res.status(401).json({
      error: true,
      message: 'Please login as an admin user to access the admin endpoint',
    });
  }

  switch (req.method) {
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
      res.setHeader('Allow', ['PUT']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withAuthedRequestSession(handler);
