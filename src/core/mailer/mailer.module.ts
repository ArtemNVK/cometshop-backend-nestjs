import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Mailer } from './mailer.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [Mailer],
  exports: [Mailer],
})
export class MailerModule {}
