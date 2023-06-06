import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/createorder.dto';
import { OrdersService } from './orders.service';
import { PaymentResultDto } from './dto/paymentresult.dto';
import { AuthGuard } from 'src/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  // get all
  @Get()
  @ApiOperation({ summary: 'Get all existing orders' })
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
  // get individual
  @Get(':id')
  @ApiOperation({ summary: 'Get an order by its ID' })
  findOne(@Param('id') id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  // create an order
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateOrderDto })
  @UseGuards(AuthGuard)
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  // delete order
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by its ID' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.ordersService.remove(id);
  }
  // get my (as a user) orders
  @Get('user/orders/:id')
  @ApiOperation({ summary: 'Get my orders (as a user) by my ID' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of items per page',
  })
  @UseGuards(AuthGuard)
  async getUserOrders(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.ordersService.getUserOrders(Number(id), page, limit);
  }

  // pay for order
  @Put('/:id/pay')
  @ApiOperation({
    summary: 'Change isPaid and paidAt properties of an order by its ID',
  })
  @ApiBody({ type: PaymentResultDto })
  async payOrder(
    @Param('id') orderId: string,
    @Body() paymentResult: PaymentResultDto,
  ) {
    return this.ordersService.payOrder(orderId, paymentResult);
  }
}
