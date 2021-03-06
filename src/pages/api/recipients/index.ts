import type { NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import { ErrorResponse, serverErrorHandler } from '@/utils/error';
import { NextIronRequest, withSession } from '@/utils/session';
import { getPasswordHash } from '@/utils/password';
import {
  validateNewUserInput,
  validateRecipientInput,
} from '@/utils/prisma-validation';
import { SessionChapterUser } from '../chapters/login';
import { DetailedRecipient } from '../chapters/[chapterId]/recipients';
import prisma from '@/prisma-client';

export type NewRecipientInputBody = {
  recipient: Prisma.RecipientCreateInput;
  newUser: Prisma.RecipientUserCreateInput & Prisma.UserCreateInput;
};

export type PostRecipientResponse = {
  recipient: DetailedRecipient;
};

async function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse | PostRecipientResponse>,
) {
  switch (req.method) {
    case 'POST':
      try {
        const currentUser = req.session.get('user') as SessionChapterUser;

        // Check if requesting user is logged in
        if (
          !currentUser ||
          !currentUser.isLoggedIn ||
          !currentUser.chapterUser
        ) {
          return res.status(401).json({
            error: true,
            message: 'Please login as a chapter user to create a new recipient',
          });
        }

        // Check if the user inputs are valid
        const { recipient, newUser } = req.body as NewRecipientInputBody;

        try {
          validateRecipientInput(recipient);
          validateNewUserInput(newUser);
        } catch (e) {
          const { message } = e as Error;
          return res.status(400).json({
            error: true,
            message,
          });
        }

        const { username, hash } = newUser;

        const user = {
          username,
          hash,
        } as Prisma.UserCreateInput;

        const passwordHash = await getPasswordHash(hash);

        // Add Prisma records
        const data = {
          ...recipient,
          chapter: {
            connect: {
              id: currentUser.chapterUser.chapterId,
            },
          },
          recipientUser: {
            create: {
              user: {
                create: {
                  ...user,
                  hash: passwordHash,
                },
              },
            },
          },
        };

        const createdRecipient = await prisma.recipient.create({
          data,
        });

        const detailedRecipient = (await prisma.recipient.findUnique({
          where: {
            id: createdRecipient.id,
          },
          include: {
            recipientUser: {
              include: {
                user: true,
              },
            },
            supplyRequests: {
              include: {
                item: true,
              },
            },
          },
        })) as DetailedRecipient;

        return res.status(200).json({
          recipient: detailedRecipient,
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
