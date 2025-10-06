import { container } from 'tsyringe';
import { CreateProductUseCase } from '@/products/aplication/usecases/create-product.usecase';
import { UpdateProductUseCase } from '@/products/aplication/usecases/update-product.usecase';
import { getProductUseCase } from '@/products/aplication/usecases/get-product.usecase';
import { Product } from '@/products/infrastructure/typeorm/entities/products.entity';
import { ProductsTypeormRepository } from '@/products/infrastructure/typeorm/respositories/products-typeorm.repository';
import { dataSource } from '@/common/infrastructure/typeorm';
import { DeleteProductUseCase } from '@/products/aplication/usecases/delete-product.usecase';

container.registerSingleton('ProductRepository', ProductsTypeormRepository);
container.registerSingleton('CreateProductUseCase', CreateProductUseCase.UseCase);

container.registerInstance(
'ProductsDefaultTypeormRepository',
  dataSource.getRepository(Product)
) 

container.registerSingleton('getProductUseCase', getProductUseCase.UseCase);

container.registerSingleton('updateProductUseCase', UpdateProductUseCase.UseCase);

container.registerSingleton('deleteProductUseCase', DeleteProductUseCase.UseCase);
