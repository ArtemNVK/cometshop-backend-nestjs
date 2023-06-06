import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ConfigModule],
  controllers: [OrdersController],
  providers: [OrdersService, CryptoService],
})
export class OrdersModule {}
