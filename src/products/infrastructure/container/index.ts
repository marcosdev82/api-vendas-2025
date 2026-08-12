import { container } from 'tsyringe';
import { CreateProductUseCase } from '@/products/aplication/usecases/create-product.usecase';
import { UpdateProductUseCase } from '@/products/aplication/usecases/update-product.usecase';
import { getProductUseCase } from '@/products/aplication/usecases/get-product.usecase';
import { Product } from '@/products/infrastructure/typeorm/entities/products.entity';
import { ProductsTypeormRepository } from '@/products/infrastructure/typeorm/respositories/products-typeorm.repository';
import { dataSource } from '@/common/infrastructure/typeorm';
import { DeleteProductUseCase } from '@/products/aplication/usecases/delete-product.usecase';
import { SearchProductUseCase } from '@/products/aplication/usecases/search-product.usecase';
import { ProductCategory } from '@/products/infrastructure/typeorm/entities/product-categories.entity';
import { ProductCategoriesTypeormRepository } from '@/products/infrastructure/typeorm/respositories/product-categories-typeorm.repository';
import { CreateProductCategoryUseCase } from '@/products/aplication/usecases/create-product-category.usecase';
import { GetProductCategoryUseCase } from '@/products/aplication/usecases/get-product-category.usecase';
import { SearchProductCategoryUseCase } from '@/products/aplication/usecases/search-product-category.usecase';
import { UpdateProductCategoryUseCase } from '@/products/aplication/usecases/update-product-category.usecase';
import { DeleteProductCategoryUseCase } from '@/products/aplication/usecases/delete-product-category.usecase';
import { UploadProductImageUseCase } from '@/products/aplication/usecases/upload-product-image.usecase';

container.registerSingleton('ProductRepository', ProductsTypeormRepository);
container.registerSingleton('CreateProductUseCase', CreateProductUseCase.UseCase);
container.registerSingleton('ProductCategoryRepository', ProductCategoriesTypeormRepository);
container.registerSingleton('CreateProductCategoryUseCase', CreateProductCategoryUseCase.UseCase);
container.registerSingleton('GetProductCategoryUseCase', GetProductCategoryUseCase.UseCase);
container.registerSingleton('SearchProductCategoryUseCase', SearchProductCategoryUseCase.UseCase);
container.registerSingleton('UpdateProductCategoryUseCase', UpdateProductCategoryUseCase.UseCase);
container.registerSingleton('DeleteProductCategoryUseCase', DeleteProductCategoryUseCase.UseCase);
container.registerSingleton('UploadProductImageUseCase', UploadProductImageUseCase.UseCase);

container.registerInstance(
'ProductsDefaultTypeormRepository',
  dataSource.getRepository(Product)
) 

container.registerInstance(
'ProductCategoriesDefaultTypeormRepository',
  dataSource.getRepository(ProductCategory)
) 

container.registerSingleton('getProductUseCase', getProductUseCase.UseCase);

container.registerSingleton('updateProductUseCase', UpdateProductUseCase.UseCase);

container.registerSingleton('deleteProductUseCase', DeleteProductUseCase.UseCase);
container.registerSingleton('SearchProductUseCase', SearchProductUseCase.UseCase);
