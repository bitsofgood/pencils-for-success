import type { NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { withIronSession } from 'next-iron-session';
import { PrismaClient } from '@prisma/client';
import { NextIronRequest } from '../../../utils/session';

type Data = {
  isLoggedIn: boolean;
  name: string;
};

async function handler(req: NextIronRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const prisma = new PrismaClient();
    try {
      const fetchedObject = await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          hash: true,
        },
        rejectOnNotFound: true,
      });
      const fetchedPassword = fetchedObject.hash;
      const result = bcrypt.compareSync(password, fetchedPassword);
      if (result) {
        const user_info = { isLoggedIn: true, name: username };
        req.session.set('user', user_info);
        res.status(200).json(user_info);
      } else {
        res.status(401).end();
      }
    } catch (error) {
      res.status(401).end();
    }
  } else {
    res.status(405).end();
  }
}

export default withIronSession(handler, {
  password: process.env.SECRET_COOKIE_PASSWORD ?? 'secure_cookie_password',
  cookieName: 'pfs-cookie',
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
