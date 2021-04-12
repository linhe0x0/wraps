import bcrypt from 'bcryptjs'

export function hash(
  clearText: string,
  salt?: number | string
): Promise<string> {
  return bcrypt.hash(clearText, salt || 10)
}

export function compare(
  clearText: string,
  hashString: string
): Promise<boolean> {
  return bcrypt.compare(clearText, hashString)
}

export default {
  hash,
  compare,
}
