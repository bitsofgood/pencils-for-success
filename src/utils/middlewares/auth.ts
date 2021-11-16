import { NextApiResponse } from 'next';
import { Handler } from 'next-iron-session';
import { SessionChapterUser } from '@/pages/api/chapters/login';
import { SessionAdminUser } from '@/pages/api/admin/login';
import {
  NextIronContextHandler,
  NextIronRequest,
  NextIronServerSideContext,
  withSession,
} from '../session';
import { SessionRecipientUser } from '@/pages/api/recipients/login';

// Helper function for protecting API routes, returns 401 response if not authed
export function withAuthedRequestSession(
  handler: Handler<NextIronRequest, NextApiResponse>,
) {
  return withSession((req: NextIronRequest, res: NextApiResponse) => {
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

/**
 * Helper function for protecting Admin only API routes.
 * Returns 401 response if unauthenticated or unauthorized.
 */
export function withAdminRequestSession(
  handler: Handler<NextIronRequest, NextApiResponse>,
) {
  return withSession(async (req: NextIronRequest, res: NextApiResponse) => {
    const user = req.session.get('user') as SessionAdminUser;
    if (user && user.isLoggedIn && user.admin) {
      await handler(req, res);
    } else {
      res.status(401).json({
        isLoggedIn: false,
        message: 'Please login as an admin to access the resource',
      });
    }
  });
}

export function withAdminAuthPage(handler: NextIronContextHandler) {
  return withSession((ctx: NextIronServerSideContext) => {
    const { req, res } = ctx;
    const user = req.session.get('user') as SessionAdminUser;

    if (!user || !user.isLoggedIn || !user.admin) {
      res.setHeader('location', '/admin/login');
      res.statusCode = 302;
      res.end();
      // Even if redirecting to a different location, getServerSideProps expects valid return
      return {
        props: {},
      };
    }

    return handler(ctx, null);
  });
}

export function withChapterAuthPage(handler: NextIronContextHandler) {
  return withSession((ctx: NextIronServerSideContext) => {
    const { req, res } = ctx;
    const user = req.session.get('user') as SessionChapterUser;

    if (!user || !user.isLoggedIn || !user.chapterUser) {
      res.setHeader('location', '/chapter/login');
      res.statusCode = 302;
      res.end();
      // Even if redirecting to a different location, getServerSideProps expects valid return
      return {
        props: {},
      };
    }

    return handler(ctx, null);
  });
}

export function withRecipientAuthPage(handler: NextIronContextHandler) {
  return withSession((ctx: NextIronServerSideContext) => {
    const { req, res } = ctx;
    const user = req.session.get('user') as SessionRecipientUser;

    if (!user || !user.isLoggedIn || !user.recipient) {
      res.setHeader('location', '/recipient/login');
      res.statusCode = 302;
      res.end();
      // Even if redirecting to a different location, getServerSideProps expects valid return
      return {
        props: {},
      };
    }

    return handler(ctx, null);
  });
}
