import { Prisma } from '@prisma/client';

export function validateEmail(email: string | undefined) {
  if (!email || email.trim().length === 0) {
    throw Error('Please provide an email address');
  }

  // Credits - https://www.regular-expressions.info/email.html
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  if (!emailRegex.test(email)) {
    throw Error('Please provided a valid email address');
  }
}

export function validateUsername(username: string | undefined) {
  // TODO: Add constraints to username as required
  if (!username || username.trim().length === 0) {
    throw Error('Please provide a valid username');
  }
}

export function validatePassword(password: string | undefined) {
  // TODO: Add constraints to password as required
  if (!password || password.trim().length === 0) {
    throw Error('Please provide a valid password');
  }
}

/**
 * Checks if the provided chapter input is valid before storing in the database
 * @param chapter User input
 */
export function validateChapterInput(
  chapter: Prisma.ChapterCreateInput | undefined,
) {
  if (chapter) {
    const { contactName, email } = chapter;

    if (!contactName || contactName.trim().length === 0) {
      throw Error('Please provide a valid contact name');
    }

    validateEmail(email);
  } else {
    throw Error('Please provide a valid chapter');
  }
}

/**
 * Checks if the provided chapter user input is valid before storing in the database
 * @param chapter User input
 */
export function validateNewChapterUserInput(
  chapterUser: Prisma.ChapterUserCreateInput | undefined,
) {
  if (chapterUser) {
    const { name, email } = chapterUser;

    if (!name || name.trim().length === 0) {
      throw Error('Please provide a valid name for the chapter user');
    }

    validateEmail(email);
  } else {
    throw Error('Please provide a valid chapter user');
  }
}

/**
 * Checks if the provided user input is valid before storing in the database
 * @param chapter User input
 */
export function validateNewUserInput(user: Prisma.UserCreateInput | undefined) {
  if (user) {
    const { username, hash } = user;

    validateUsername(username);
    validatePassword(hash);
  } else {
    throw Error('Please provide a valid chapter user');
  }
}
