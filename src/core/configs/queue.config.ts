import { ConfigService } from '@nestjs/config';

export const getQueueConfig =
  (queueName: string) => (configService: ConfigService) => ({
    name: queueName,
    redis: {
      host: configService.get<string>('REDIS_HOST'),
      port: Number(configService.get('REDIS_PORT')),
    },
  });
