import type { NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest } from '@/utils/session';
import { getPasswordHash } from '@/utils/password';
import { validatePassword, validateUsername } from '@/utils/prisma-validation';
import { withAdminRequestSession } from '@/utils/middlewares/auth';

export type NewCredentialsInput = {
  newUsername: string;
  newPassword: string;
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse>,
) {
  switch (req.method) {
    case 'PUT':
      try {
        // Check if the provided chapter user exists
        const prisma = new PrismaClient();

        const { userId } = req.query;
        const existingChapterUser = await prisma.chapterUser.findUnique({
          where: {
            id: Number(userId),
          },
        });

        if (existingChapterUser) {
          // Check if the user inputs are valid
          const { newUsername, newPassword } = req.body as NewCredentialsInput;

          try {
            validateUsername(newUsername);
            validatePassword(newPassword);
          } catch (e) {
            const { message } = e as Error;
            return res.status(400).json({
              error: true,
              message,
            });
          }

          // Generate password hash
          const hash = await getPasswordHash(newPassword);

          // This will reject the update if the new username is not unique (except the same user)
          await prisma.user.update({
            where: {
              id: existingChapterUser.userId,
            },
            data: {
              username: newUsername,
              hash,
            },
          });

          return res.status(200).json({
            error: false,
            message: 'Successfully updated credentials for the chapter user',
          });
        }

        return res.status(400).json({
          error: true,
          message: `No chapter user found for id: ${userId}`,
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

export default withAdminRequestSession(handler);
