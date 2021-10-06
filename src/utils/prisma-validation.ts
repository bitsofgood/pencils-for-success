import { Prisma } from '@prisma/client';

export function validateEmail(email: string | undefined) {
  if (!email || email.trim().length === 0) {
    throw Error('Please provide a valid email');
  }
}

/**
 * Checks if the provided chapter input is valid before storing in the database
 * @param chapter User input
 */
export function validateChapterInput(
  chapter: Prisma.ChapterCreateInput | undefined,
) {
  const { contactName, email } = chapter || {};

  if (!contactName || contactName.trim().length === 0) {
    throw Error('Please provide a valid contact name');
  }

  validateEmail(email);
}

/**
 * Checks if the provided chapter user input is valid before storing in the database
 * @param chapter User input
 */
export function validateNewChapterUserInput(
  chapterUser: Prisma.ChapterUserCreateInput | undefined,
) {
  const { name, email } = chapterUser || {};

  if (!name || name.trim().length === 0) {
    throw Error('Please provide a valid name for the chapter user');
  }

  validateEmail(email);
}

/**
 * Checks if the provided user input is valid before storing in the database
 * @param chapter User input
 */
export function validateNewUserInput(user: Prisma.UserCreateInput | undefined) {
  const { username, hash } = user || {};

  if (!username || username.trim().length === 0) {
    throw Error('Please provide a valid username for the user');
  }

  if (!hash || hash.trim().length === 0) {
    throw Error('Please provide a valid password for the user');
  }
}
