import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/createproduct.dto';
import { AuthGuard } from 'src/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product by its ID' })
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by its ID' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit a product by its ID' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreateProductDto })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<CreateProductDto>,
  ) {
    return this.productsService.update(Number(id), updateProductDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all existing product categories' })
  getProductCategories() {
    return this.productsService.getProductCategories();
  }
}
