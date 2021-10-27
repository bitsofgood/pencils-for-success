// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { withIronSession, Handler, Session } from 'next-iron-session';
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export type NextIronRequest = NextApiRequest & { session: Session };

export type NextIronServerSideContext = GetServerSidePropsContext & {
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
    session: Session;
  };
  session: Session;
};

export type NextIronHandler = Handler<NextIronRequest, NextApiResponse>;
export type NextIronContextHandler = Handler<NextIronServerSideContext, null>;

// Wrapper around 'getServerSideProps' or API routes to expose req.session.* methods
export function withSession(handler: NextIronHandler | NextIronContextHandler) {
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
