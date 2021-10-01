import bcryptjs from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Create a hash for a given password.
 *
 * @param password Password for which hash is to be generated
 * @returns Computed hash for provided password
 */
export async function getPasswordHash(password: string) {
  const salt = await bcryptjs.genSalt(SALT_ROUNDS);
  return bcryptjs.hash(password, salt);
}

/**
 * Given a password and a hash, check if they match.
 *
 * @param password Password to check
 * @param hash Hash to check
 * @returns Boolean indicating if the password matches the provided hash
 */
export async function isMatchingHash(password: string, hash: string) {
  return bcryptjs.compare(password, hash);
}
