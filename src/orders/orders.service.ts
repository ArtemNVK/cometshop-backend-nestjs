import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createorder.dto';
import { PaymentResultDto } from './dto/paymentresult.dto';
import { Errors } from 'src/common/errors/errors.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  findOne(id: number): Promise<Order> {
    const product = this.ordersRepository.findOne({ where: { id: id } });

    return product;
  }

  create(orderData: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create(orderData);

    return this.ordersRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    await this.ordersRepository.delete(id);
  }

  async getUserOrders(userId: number, page = 1, limit = 20) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const [orders, count] = await this.ordersRepository.findAndCount({
      where: { userId: userId },
      take: limit,
      skip: startIndex,
    });

    const response = {
      results: orders,
      allOrdersNum: count,
      pageNumbers: [],
      next: {},
      previous: {},
    };

    if (endIndex < count) {
      response.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      response.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    for (let i = 1; i <= Math.ceil(count / limit); i++) {
      response.pageNumbers.push(i);
    }

    return response;
  }

  async payOrder(orderId: string, paymentResult: PaymentResultDto) {
    const order = await this.ordersRepository.findOne({
      where: { id: Number(orderId) },
    });
    if (!order) {
      throw new NotFoundException(Errors.ORDER_NOT_FOUND);
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = paymentResult;

    const updatedOrder = await this.ordersRepository.save(order);
    return { message: 'Order Paid', order: updatedOrder };
  }
}
