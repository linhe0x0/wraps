import consola from 'consola/src/node'

const isTestingEnv =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'testing'
const isDevEnv = process.env.NODE_ENV === 'development'
const isDebug = process.env.DEBUG === 'true'

let level = process.env.CONSOLA_LEVEL

if (!level) {
  if (isTestingEnv) {
    level = consola.LogLevel.Silent
  } else if (isDevEnv || isDebug) {
    level = consola.LogLevel.Verbose
  } else {
    level = consola.LogLevel.Info
  }
}

const logger = consola.create({
  level,
})

if (isDevEnv || isDebug) {
  logger.setReporters(new consola.FancyReporter())
} else {
  logger.setReporters(new consola.JSONReporter())
}

export default logger
