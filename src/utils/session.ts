// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { withIronSession, Handler, Session } from 'next-iron-session';
import { NextApiRequest, NextApiResponse } from 'next';

export type NextIronRequest = NextApiRequest & { session: Session };

// Wrapper around 'getServerSideProps' or API routes to expose req.session.* methods
export default function withSession(
  handler: Handler<NextIronRequest, NextApiResponse>,
) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD ?? 'secure_cookie_password',
    cookieName: 'pfs-cookie',
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === 'production',
    },
  });
}

// Helper function for protecting API routes, returns 401 response if not authed
export function withAuthedSession(
  handler: Handler<NextIronRequest, NextApiResponse>,
) {
  return withSession((req, res) => {
    const user = req.session.get('user');
    if (user) {
      handler(req, res);
    } else {
      res.status(401).json({
        isLoggedIn: false,
        message: 'Not Authenticated',
      });
    }
  });
}
