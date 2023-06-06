import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderItem {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  qty: number;

  @IsNotEmpty()
  @ApiProperty()
  image: string;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @ApiProperty()
  productId: number;
}

export class ShippingAddress {
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsNotEmpty()
  @ApiProperty()
  postalCode: string;

  @IsNotEmpty()
  @ApiProperty()
  country: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @ApiProperty({ type: [OrderItem] })
  orderItems: OrderItem[];

  @IsNotEmpty()
  @ApiProperty()
  shippingAddress: ShippingAddress;

  @IsNotEmpty()
  @ApiProperty()
  paymentMethod: string;

  @IsNumber()
  @ApiProperty()
  itemsPrice: number;

  @IsNumber()
  @ApiProperty()
  shippingPrice: number;

  @IsNumber()
  @ApiProperty()
  totalPrice: number;

  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
