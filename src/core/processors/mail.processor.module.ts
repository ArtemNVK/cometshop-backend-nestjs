import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { MailProcessor } from './mail.processor';
import { MAIL_QUEUE_NAME } from '../configs/constants.config';
import { MailerModule } from '../mailer/mailer.module';
import { getQueueConfig } from '../configs/queue.config';

@Module({
  imports: [
    MailerModule,
    BullModule.registerQueueAsync({
      name: MAIL_QUEUE_NAME,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getQueueConfig(MAIL_QUEUE_NAME),
    }),
  ],
  providers: [MailProcessor],
})
export class MailProcessorModule {}
