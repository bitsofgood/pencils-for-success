import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Create a hash for a given password.
 *
 * @param password Password for which hash is to be generated
 * @returns Computed hash for provided password
 */
export async function getPasswordHash(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Given a password and a hash, check if they match.
 *
 * @param password Password to check
 * @param hash Hash to check
 * @returns Boolean indicating if the password matches the provided hash
 */
export async function isMatchingHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
