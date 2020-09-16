import config from 'config'
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'
import _ from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TokenPayload = Record<string, any>

interface TokenPayloadResult {
  payload: TokenPayload
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
      issuer: issuer || appName || 'jwt',
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

        resolve(token)
      }
    )
  })
}

export function parseToken(
  token: string,
  secret?: string,
  issuer?: string,
  options?: VerifyOptions
): Promise<TokenPayload> {
  const opts = _.assign(
    {
      issuer: issuer || appName || 'jwt',
    },
    options
  )

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      secret || defaultSecret,
      opts,
      (err: Error | null, result: Partial<TokenPayloadResult> | undefined) => {
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

export default {
  sign: signToken,
  parse: parseToken,
}
