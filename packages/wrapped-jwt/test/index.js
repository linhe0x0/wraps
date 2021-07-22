const test = require('ava')
const jwt = require('jsonwebtoken')
const { endOfDay, addDays } = require('date-fns')

const { signToken } = require('../dist/index')
const config = require('../config/test.js')

const defaultSecret = config.app.keys.join('')

test('should sign payload with default options', async (t) => {
  const result = await signToken({
    a: 1,
  })

  const exp = Math.floor(addDays(endOfDay(new Date()), 30) / 1000)

  jwt.verify(result, defaultSecret, (err, decoded) => {
    t.is(err, null)
    t.is(decoded.sub, 'default')
    t.is(decoded.iss, 'jwt')
    t.is(decoded.exp, exp)
    t.is(decoded.payload.a, 1)
  })
})

test('should sign payload with special subject', async (t) => {
  const result = await signToken(
    {
      a: 1,
    },
    'identity_authentication'
  )

  jwt.verify(result, defaultSecret, (err, decoded) => {
    t.is(err, null)
    t.is(decoded.sub, 'identity_authentication')
    t.is(decoded.iss, 'jwt')
    t.is(decoded.payload.a, 1)
  })
})

test('should sign payload with special issuer', async (t) => {
  const result = await signToken(
    {
      a: 1,
    },
    'identity_authentication',
    {
      issuer: 'jwt-app',
    }
  )

  jwt.verify(result, defaultSecret, (err, decoded) => {
    t.is(err, null)
    t.is(decoded.sub, 'identity_authentication')
    t.is(decoded.iss, 'jwt-app')
    t.is(decoded.payload.a, 1)
  })
})

test('should sign payload with special secret', async (t) => {
  const result = await signToken(
    {
      a: 1,
    },
    '',
    {
      secret: 'jwt-secret',
    }
  )

  jwt.verify(result, 'jwt-secret', (err, decoded) => {
    t.is(err, null)
    t.is(decoded.payload.a, 1)
  })
})

test('should sign payload with special expiresIn', async (t) => {
  const result = await signToken(
    {
      a: 1,
    },
    '',
    {
      expiresInDays: 18,
    }
  )

  const exp = Math.floor(addDays(endOfDay(new Date()), 18) / 1000)

  jwt.verify(result, defaultSecret, (err, decoded) => {
    t.is(err, null)
    t.is(decoded.exp, exp)
    t.is(decoded.payload.a, 1)
  })
})
