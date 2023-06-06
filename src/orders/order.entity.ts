import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  orderItems: Array<{
    name: string;
    qty: number;
    image: string;
    price: number;
    productId: number;
  }>;

  @Column({ type: 'jsonb' })
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };

  @Column()
  paymentMethod: string;

  @Column({ type: 'jsonb', nullable: true })
  paymentResult: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };

  @Column()
  itemsPrice: number;

  @Column()
  shippingPrice: number;

  @Column()
  totalPrice: number;

  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true })
  paidAt: Date;
}
