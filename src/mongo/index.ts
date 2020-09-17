import consola, { LogLevel } from 'consola'
import _ from 'lodash'
import { Connection, Mongoose } from 'mongoose'

const logger = consola.create({
  level: LogLevel.Warn,
})

export interface MongodbConfig {
  host: string
  port: number
  database: string
  user?: string
  pass?: string
}

interface MongoOptions {
  debug: boolean
  reuseConnection: boolean
}

export interface Mongo {
  mongoose?: Mongoose
  config: MongodbConfig
  options: MongoOptions
  connection?: Connection
  validate: () => void
  connect: (reconnect?: boolean) => Promise<Mongo>
  reconnect: () => Promise<Mongo>
}

const mongo: Mongo = {
  mongoose: undefined,
  config: {
    host: '',
    port: 27017,
    database: '',
  },
  options: {
    debug: false,
    reuseConnection: true,
  },
  validate() {
    if (!this.config) {
      throw new Error('Config missed.')
    }

    if (!this.config.host) {
      throw new Error('host missed.')
    }

    if (!this.config.port) {
      throw new Error('port missed.')
    }

    if (!this.config.database) {
      throw new Error('database missed.')
    }
  },
  connect(reconnect?: boolean): Promise<Mongo> {
    const { mongoose } = this

    if (!mongoose) {
      throw new Error('Mongoose instance missed.')
    }

    this.validate()

    return new Promise((resolve, reject) => {
      let mongodbURI = 'mongodb://'

      if (this.config.user) {
        mongodbURI += `${this.config.user}:${this.config.pass}@`
      }

      mongodbURI += `${this.config.host}:${this.config.port}/${this.config.database}`

      logger.debug('')
      logger.debug('Connecting to the mongodb with url:', mongodbURI)

      if (
        mongoose.connection.readyState === 1 ||
        mongoose.connection.readyState === 2
      ) {
        if (reconnect || !this.options.reuseConnection) {
          mongoose.connection.close()
        } else {
          mongoose.connection.deleteModel(/.+/)

          logger.info(
            'Reuse previous connection. If you need to reconnect, please restart the server manual.'
          )
          logger.debug('')
          resolve(this)
          return
        }
      }

      mongoose
        .connect(mongodbURI, {
          // Fix deprecation warnings.
          // More details are https://mongoosejs.com/docs/deprecations.html
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true,
          useUnifiedTopology: true,
        })
        .catch((err) => {
          logger.error(`Failed to connect to ${mongodbURI}.`, err.message)
          process.exit(1)
        })

      mongoose.connection.on('error', (err) => {
        logger.error('Error from mongodb connection:', err.message)
        reject(err)
      })

      mongoose.connection.once('open', () => {
        logger.success(`Connect to mongodb with ${mongodbURI} successfully.`)
        logger.debug('')

        this.connection = mongoose.connection

        resolve(this)
      })
    })
  },
  reconnect() {
    return this.connect(true)
  },
}

export default function main(
  mongoose: Mongoose,
  config?: MongodbConfig,
  options?: Partial<MongoOptions>
): Mongo {
  const opts: MongoOptions = _.defaults(_.assign({}, mongo.options, options), {
    debug: false,
    reuseConnection: true,
  })

  if (config) {
    mongo.config = config
  }

  mongo.mongoose = mongoose
  mongo.options = opts

  logger.level = opts.debug ? LogLevel.Verbose : LogLevel.Warn

  return mongo
}
