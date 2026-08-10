import { container } from 'tsyringe'
import { CreateCustomerUseCase } from '@/customers/aplication/usecases/create-customer.usecase'
import { GetCustomerUseCase } from '@/customers/aplication/usecases/get-customer.usecase'
import { ListCustomerUseCase } from '@/customers/aplication/usecases/list-customer.usecase'
import { Customer } from '@/customers/infrastructure/typeorm/entities/customers.entity'
import { CustomersTypeormRepository } from '@/customers/infrastructure/typeorm/repositories/customers-typeorm.repository'
import { dataSource } from '@/common/infrastructure/typeorm'

container.registerSingleton('CustomerRepository', CustomersTypeormRepository)
container.registerSingleton('CreateCustomerUseCase', CreateCustomerUseCase.UseCase)
container.registerSingleton('GetCustomerUseCase', GetCustomerUseCase.UseCase)
container.registerSingleton('ListCustomerUseCase', ListCustomerUseCase.UseCase)
container.registerInstance('CustomersDefaultTypeormRepository', dataSource.getRepository(Customer))
