import { container } from 'tsyringe';
import { CreateProductUseCase } from '@/products/aplication/usecases/create-product.usecase';
import { Product } from '@/products/infrastructure/typeorm/entities/products.entity';
import { ProductsTypeormRepository } from '@/products/infrastructure/typeorm/respositories/products-typeorm.repository';
import { dataSource } from '@/common/infrastructure/typeorm';

container.registerSingleton('ProductRepository', ProductsTypeormRepository);
container.registerSingleton('CreateProductUseCase', CreateProductUseCase.UseCase);

container.registerInstance(
  'ProductsDefaultTypeormRepository',
  dataSource.getRepository(Product)
) 
