import { NextApiResponse } from 'next';
import { Handler } from 'next-iron-session';
import { SessionAdminUser } from '@/pages/api/admin/login';
import { NextIronRequest, withSession } from '../session';

/**
 * Helper function for protecting Admin only API routes.
 * Returns 401 response if unauthenticated or unauthorized.
 */
export function withAdminRequestSession(
  handler: Handler<NextIronRequest, NextApiResponse>,
) {
  return withSession(async (req, res) => {
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
