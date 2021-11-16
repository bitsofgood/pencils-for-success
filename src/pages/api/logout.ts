import { NextApiResponse } from 'next';
import { NextIronRequest, withSession } from '@/utils/session';
import { ErrorResponse } from '@/utils/error';

interface LogoutResponse {
  message: string;
}

function handler(
  req: NextIronRequest,
  res: NextApiResponse<ErrorResponse | LogoutResponse>,
) {
  switch (req.method) {
    case 'POST':
      req.session.destroy();
      return res.json({
        message: 'Successfully logged out',
      });
    default:
      res.setHeader('Allow', ['POST']);
      return res
        .status(405)
        .json({ error: true, message: `Method ${req.method} Not Allowed` });
  }
}

export default withSession(handler);
