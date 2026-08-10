import { container } from 'tsyringe'
import { dataSource } from '@/common/infrastructure/typeorm'
import { CreateSaleUseCase } from '@/sales/aplication/usecases/create-sale.usecase'
import { getSaleUseCase } from '@/sales/aplication/usecases/get-sale.usecase'
import { SearchSaleUseCase } from '@/sales/aplication/usecases/search-sale.usecase'
import { UpdateSaleUseCase } from '@/sales/aplication/usecases/update-sale.usecase'
import { DeleteSaleUseCase } from '@/sales/aplication/usecases/delete-sale.usecase'
import { Sale } from '@/sales/infrastructure/typeorm/entities/sales.entity'
import { SalesTypeormRepository } from '@/sales/infrastructure/typeorm/repositories/sales-typeorm.repository'

container.registerSingleton('SaleRepository', SalesTypeormRepository)
container.registerSingleton('CreateSaleUseCase', CreateSaleUseCase.UseCase)
container.registerInstance('SalesDefaultTypeormRepository', dataSource.getRepository(Sale))
container.registerSingleton('getSaleUseCase', getSaleUseCase.UseCase)
container.registerSingleton('SearchSaleUseCase', SearchSaleUseCase.UseCase)
container.registerSingleton('UpdateSaleUseCase', UpdateSaleUseCase.UseCase)
container.registerSingleton('DeleteSaleUseCase', DeleteSaleUseCase.UseCase)
