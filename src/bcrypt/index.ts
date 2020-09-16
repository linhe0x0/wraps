import bcrypt from 'bcryptjs'

export function hash(
  clearText: string,
  salt?: number | string
): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(clearText, salt || 10, (err: Error | null, result: string) => {
      if (err) {
        reject(err)
        return
      }

      resolve(result)
    })
  })
}

export function compare(
  clearText: string,
  hashString: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(
      clearText,
      hashString,
      (err: Error | null, result: boolean) => {
        if (err) {
          reject(err)
          return
        }

        resolve(result)
      }
    )
  })
}

export default {
  hash,
  compare,
}
