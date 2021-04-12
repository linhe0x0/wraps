process.env.SUPPRESS_NO_CONFIG_WARNING = 'y'

import config from 'config'
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'
import _ from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TokenPayload = Record<string, any>

interface TokenPayloadResult<T> {
  payload?: T
}

const appName = config.has('app.name') ? config.get('app.name') : undefined
const defaultSecret = config.has('keys') ? config.get('keys')[0] : 'a'

export function signToken(
  payload: TokenPayload,
  secret?: string,
  issuer?: string,
  options?: SignOptions
): Promise<string> {
  const opts = _.assign(
    {
      expiresIn: '30d',
      issuer: issuer || appName || undefined,
    },
    options
  )

  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        payload,
      },
      secret || defaultSecret,
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
  secret?: string,
  issuer?: string,
  options?: VerifyOptions
): Promise<T> {
  const opts = _.assign(
    {
      issuer: issuer || appName || undefined,
    },
    options
  )

  return new Promise<T>((resolve, reject) => {
    jwt.verify(
      token,
      secret || defaultSecret,
      opts,
      (err: Error | null, result: TokenPayloadResult<T> | undefined) => {
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
  secret?: string,
  issuer?: string,
  options?: VerifyOptions
): Promise<void> {
  const opts = _.assign(
    {
      issuer: issuer || appName || undefined,
    },
    options
  )

  return new Promise<void>((resolve, reject) => {
    jwt.verify(token, secret || defaultSecret, opts, (err: Error | null) => {
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
