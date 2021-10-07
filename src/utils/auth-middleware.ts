import { SessionAdminUser } from '@/pages/api/admin/login';
import {
  NextIronContextHandler,
  NextIronServerSideContext,
  withSession,
} from './session';

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
