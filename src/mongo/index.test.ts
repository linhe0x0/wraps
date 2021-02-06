import { makeConnectionURI } from './index'

describe('basic', () => {
  test('host + database', () => {
    expect(
      makeConnectionURI({
        host: 'localhost',
        database: 'testing',
      })
    ).toBe('mongodb://localhost/testing')
  })

  test('host + port + database', () => {
    expect(
      makeConnectionURI({
        host: 'localhost',
        port: 27017,
        database: 'testing',
      })
    ).toBe('mongodb://localhost:27017/testing')
  })
})

describe('with auth', () => {
  test('with password', () => {
    expect(
      makeConnectionURI({
        host: 'localhost',
        username: 'test-user',
        password: 'test-pass',
        database: 'testing',
      })
    ).toBe('mongodb://test-user:test-pass@localhost/testing')
  })

  test('without password', () => {
    expect(() => {
      makeConnectionURI({
        host: 'localhost',
        username: 'test-user',
        database: 'testing',
      })
    }).toThrow()
  })
})

describe('with extras', () => {
  test('with empty extras', () => {
    expect(
      makeConnectionURI({
        host: 'localhost',
        database: 'testing',
        extras: [],
      })
    ).toBe('mongodb://localhost/testing')
  })

  test('with 1 extras', () => {
    expect(
      makeConnectionURI({
        host: 'localhost',
        database: 'testing',
        extras: [
          {
            host: '127.0.0.2',
            port: 27018,
          },
        ],
      })
    ).toBe('mongodb://localhost,127.0.0.2:27018/testing')
  })

  test('with 2 extras', () => {
    expect(
      makeConnectionURI({
        host: 'localhost',
        database: 'testing',
        extras: [
          {
            host: '127.0.0.2',
            port: 27018,
          },
          {
            host: '127.0.0.3',
          },
        ],
      })
    ).toBe('mongodb://localhost,127.0.0.2:27018,127.0.0.3/testing')
  })
})

describe('with options', () => {
  test('with authSource', () => {
    expect(
      makeConnectionURI({
        host: 'localhost',
        username: 'test-user',
        password: 'test-pass',
        database: 'testing',
        options: {
          authSource: 'admin',
        },
      })
    ).toBe('mongodb://test-user:test-pass@localhost/testing?authSource=admin')
  })
})
