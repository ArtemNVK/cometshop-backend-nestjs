import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User]), ConfigModule],
  controllers: [ProductsController],
  providers: [ProductsService, CryptoService],
})
export class ProductsModule {}
