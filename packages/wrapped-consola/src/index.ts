import consola, { FancyReporter, JSONReporter, LogLevel } from 'consola'

const isTestingEnv =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'testing'
const isDevEnv = process.env.NODE_ENV === 'development'
const isDebug = process.env.DEBUG === 'true'

let level = parseInt(process.env.CONSOLA_LEVEL || '0', 10)

if (!level) {
  if (isTestingEnv) {
    level = LogLevel.Silent
  } else if (isDevEnv || isDebug) {
    level = LogLevel.Verbose
  } else {
    level = LogLevel.Info
  }
}

const defaultReporter =
  isDevEnv || isDebug ? new FancyReporter() : new JSONReporter()
const reporters = [defaultReporter]

const logger = consola.create({
  reporters,
  level,
})

export default logger
