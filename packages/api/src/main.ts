import { config } from 'dotenv'
config()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WinstonModule } from 'nest-winston'
import { getLoggingOptions } from 'src/logging'

const port = process.env.PORT ?? 3000

async function bootstrap() {
  const logger = WinstonModule.createLogger(getLoggingOptions('Main'))

  const app = await NestFactory.create(AppModule, {
    logger,
  })

  await app.startAllMicroservices()
  app.enableShutdownHooks()
  const corsDomains: string | string[] = process.env.CORS_DOMAINS
    ? process.env.CORS_DOMAINS!.split(',')
    : '*'
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    exposedHeaders: [
      'Content-Type',
      'ETag',
      'Content-Length',
      'Access-Control-Allow-Origin',
    ],
    origin: corsDomains,
  })
  await app.listen(port, () => logger.log(`App listening on the port ${port}`))
}
bootstrap()
