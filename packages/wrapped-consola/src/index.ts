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

const logger = consola.create({
  level,
})

const reporter = isDevEnv || isDebug ? new FancyReporter() : new JSONReporter()

logger.setReporters([reporter])

export default logger
