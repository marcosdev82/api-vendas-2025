import { CreateProductUseCase } from '@/products/aplication/usecases/create-product.usecase';
import { ProductsTypeormRepository } from '@/products/infrastructure/typeorm/respositories/products-typeorm.repository';
import { container } from 'tsyringe';

container.registerSingleton('ProductRepository', ProductsTypeormRepository);
container.registerSingleton('CreateProductUseCase', CreateProductUseCase.UseCase);
