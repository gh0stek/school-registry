import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string()
          .optional()
          .default('mysql://root:localdb@localhost:3306/class_register'),
      }),
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
