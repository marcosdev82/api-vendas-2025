import { container } from 'tsyringe'
import { CreateUserUseCase } from '@/users/aplication/usecases/create-user.usecase'
import { GetUserUseCase } from '@/users/aplication/usecases/get-user.usecase'
import { ListUserUseCase } from '@/users/aplication/usecases/list-user.usecase'
import { User } from '@/users/infrastructure/typeorm/entities/users.entity'
import { UsersTypeormRepository } from '@/users/infrastructure/typeorm/repositories/users-typeorm.repository'
import { dataSource } from '@/common/infrastructure/typeorm'

container.registerSingleton('UserRepository', UsersTypeormRepository)
container.registerSingleton('CreateUserUseCase', CreateUserUseCase.UseCase)
container.registerSingleton('GetUserUseCase', GetUserUseCase.UseCase)
container.registerSingleton('ListUserUseCase', ListUserUseCase.UseCase)
container.registerInstance('UsersDefaultTypeormRepository', dataSource.getRepository(User))
