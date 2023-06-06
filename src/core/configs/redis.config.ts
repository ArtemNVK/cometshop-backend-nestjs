import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';
config();

export const redisConfig = registerAs('redis', (): RedisModuleOptions => {
  return {
    config: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  };
});
