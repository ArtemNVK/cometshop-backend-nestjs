import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseError } from 'src/common/errors/base.error';
import { Errors } from 'src/common/errors/errors.enum';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/createproduct.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findOne(id: number): Promise<Product> {
    const product = this.productsRepository.findOne({ where: { id: id } });

    return product;
  }

  async getProductCategories(): Promise<string[]> {
    const categories = await this.productsRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .getRawMany();

    return categories.map((category) => category.category);
  }

  create(productData: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(productData);

    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async update(
    id: number,
    updateProductDto: Partial<CreateProductDto>,
  ): Promise<Product> {
    const product = await this.productsRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) {
      throw new BaseError(Errors.USER_NOT_FOUND);
    }

    return this.productsRepository.save(product);
  }
}
