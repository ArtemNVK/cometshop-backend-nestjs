import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { CryptoModule } from 'src/common/crypto/crypto.module';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { MailerModule } from 'src/core/mailer/mailer.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { redisConfig } from 'src/core/configs/redis.config';
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE_NAME } from 'src/core/configs/constants.config';
import { getQueueConfig } from 'src/core/configs/queue.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    CryptoModule,
    MailerModule,
    RedisModule.forRootAsync(redisConfig.asProvider()),
    BullModule.registerQueueAsync({
      name: MAIL_QUEUE_NAME,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getQueueConfig(MAIL_QUEUE_NAME),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, CryptoService],
})
export class AuthModule {}
