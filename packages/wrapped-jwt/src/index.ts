process.env.SUPPRESS_NO_CONFIG_WARNING = 'y'

import config from 'config'
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'
import _ from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TokenPayload = Record<string, any>

const appName = config.has('app.name') ? config.get('app.name') : 'jwt'
const defaultSecret = config.has('app.keys')
  ? _.join(config.get('app.keys'), '')
  : ''

interface SecretOptions {
  secret?: string
}

type SignTokenOptions = SignOptions &
  SecretOptions & {
    expiresInDays?: number | undefined
    offsetMinutes?: number | undefined
  }
type VerifyTokenOptions = VerifyOptions &
  SecretOptions & {
    ignoreSubject?: boolean | undefined
    ignoreIssuer?: boolean | undefined
  }

export function signToken(
  payload: TokenPayload,
  subject?: string,
  options?: SignTokenOptions
): Promise<string> {
  const expiresInDays =
    options && options.expiresInDays !== undefined ? options.expiresInDays : 30
  const offsetMinutes =
    options && options.offsetMinutes !== undefined ? options.offsetMinutes : 0

  const now = Date.now()
  const date = new Date()

  date.setDate(date.getDate() + expiresInDays)
  date.setHours(23, 59 + offsetMinutes, 59, 999)

  const expiresIn = Math.floor((date.getTime() - now) / 1000)

  const secret = options && options.secret ? options.secret : defaultSecret

  const opts = _.assign(
    {
      expiresIn,
      subject: subject || 'default',
      issuer: appName,
    },
    _.omit(options, ['secret', 'expiresInDays', 'offsetMinutes'])
  )

  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        payload,
      },
      secret,
      opts,
      (err: Error | null, token: string | undefined) => {
        if (err) {
          reject(err)
          return
        }

        resolve(token || '')
      }
    )
  })
}

export function parseToken<T>(
  token: string,
  subject?: string,
  issuer?: string,
  options?: VerifyTokenOptions
): Promise<T> {
  const opts = _.assign(
    {
      subject,
      issuer: issuer || appName,
    },
    _.omit(options, ['secret'])
  )

  const secret = options && options.secret ? options.secret : defaultSecret

  return new Promise<T>((resolve, reject) => {
    jwt.verify(
      token,
      secret,
      opts,
      (err: Error | null, result: jwt.JwtPayload | undefined) => {
        if (err) {
          reject(err)
          return
        }

        if (!result || !result.payload) {
          reject(new Error('Payload is missed in token.'))
          return
        }

        resolve(result.payload)
      }
    )
  })
}

export function verifyToken(
  token: string,
  subject?: string,
  issuer?: string,
  options?: VerifyTokenOptions
): Promise<void> {
  let opts = _.assign(
    {
      subject,
      issuer: issuer || appName,
    },
    _.omit(options, ['secret', 'ignoreSubject', 'ignoreIssuer'])
  )

  if (options) {
    if (options.ignoreSubject) {
      opts = _.omit(opts, ['subject'])
    }

    if (options.ignoreIssuer) {
      opts = _.omit(opts, ['issuer'])
    }
  }

  const secret = options && options.secret ? options.secret : defaultSecret

  return new Promise<void>((resolve, reject) => {
    jwt.verify(token, secret, opts, (err: Error | null) => {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })
}

export function parseTokenWithoutVerify<T>(token: string): T {
  const payload = _.split(token, '.')[1] || ''

  const value = Buffer.from(payload, 'base64').toString('utf8')

  try {
    return JSON.parse(value).payload
  } catch (err) {
    return {} as T
  }
}

export default {
  sign: signToken,
  parse: parseToken,
  verify: verifyToken,
  parseTokenWithoutVerify,
}
