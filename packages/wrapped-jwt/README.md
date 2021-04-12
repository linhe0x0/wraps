# wrapped-jwt

## Install

```bash
npm install @sqrtthree/wrapped-jwt
```

## API

By Default, it will load `app.name` as default value of issuer, `app.keys` as default value of secret with [node-config](https://github.com/lorenwest/node-config).

### `signToken(payload: Record<string, any>, subject?: string, options?: SignTokenOptions): Promise<string>`

Sign a jwt token.

### `parseToken<T>(token: string, subject?: string, issuer?: string, options?: VerifyTokenOptions): Promise<T>`

Parse and verify jwt token.

### `parseTokenWithoutVerify<T>(token: string): T`

Parse jwt token without verify.

### `verifyToken(token: string, subject?: string, issuer?: string, options?: VerifyTokenOptions): Promise<void>`

Verify jwt token if is valid. it will throw an error if the token is invalid.
