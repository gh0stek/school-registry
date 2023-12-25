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
  await app.listen(port, () => logger.log(`App listening on the port ${port}`))
}
bootstrap()
