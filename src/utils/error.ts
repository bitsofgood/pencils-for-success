import { Prisma } from '@prisma/client';
import { NextApiResponse } from 'next';

export interface ErrorResponse {
  error: boolean;
  message: string;
}

/**
 * This is a default handler for errors that occur on the server side
 * @param e Error
 * @param res Next Response
 * @returns Next Response with error message
 */
export function serverErrorHandler(
  e: any,
  res: NextApiResponse<ErrorResponse>,
) {
  // Error logging
  // console.error(e);

  let { message = 'Server Error' } = e as Error;

  if (e instanceof Prisma.PrismaClientInitializationError) {
    message = 'Failed to connect to the database';
  }

  if (e instanceof Prisma.PrismaClientValidationError) {
    message = 'Please provide valid arguments for database query';
  }

  res.status(500).json({ error: true, message });
  return res;
}
