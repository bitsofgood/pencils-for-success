import type { NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import { NextIronRequest } from '../../../utils/session';

type Data = {
  isLoggedIn: boolean;
  name: string;
};

export default function handler(
  req: NextIronRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'POST') {
    const { username } = req.body;
    const { password } = req.body;
    const prisma = new PrismaClient();
    const promise = prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        hash: true,
      },
      rejectOnNotFound: true,
    });
    let fetched_password = '';
    promise.then((response) => {
      fetched_password = response.hash;
    });
    const result = bcrypt.compareSync(password, fetched_password);
    if (result) {
      const user_info = { isLoggedIn: true, name: username };
      req.session.set('user', user_info);
      res.status(200).json(user_info);
    } else {
      res.status(401);
    }
  }
}
