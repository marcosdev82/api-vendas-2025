import { container } from 'tsyringe'
import { CreateCartItemUseCase } from '@/cart/aplication/usecases/create-cart-item.usecase'
import { GetCartItemUseCase } from '@/cart/aplication/usecases/get-cart-item.usecase'
import { ListCartUseCase } from '@/cart/aplication/usecases/list-cart.usecase'
import { UpdateCartItemUseCase } from '@/cart/aplication/usecases/update-cart-item.usecase'
import { DeleteCartItemUseCase } from '@/cart/aplication/usecases/delete-cart-item.usecase'
import { CartItem } from '@/cart/infrastructure/typeorm/entities/cart.entity'
import { CartTypeormRepository } from '@/cart/infrastructure/typeorm/repositories/cart-typeorm.repository'
import { dataSource } from '@/common/infrastructure/typeorm'

container.registerSingleton('CartRepository', CartTypeormRepository)
container.registerSingleton('CreateCartItemUseCase', CreateCartItemUseCase.UseCase)
container.registerSingleton('GetCartItemUseCase', GetCartItemUseCase.UseCase)
container.registerSingleton('ListCartUseCase', ListCartUseCase.UseCase)
container.registerSingleton('UpdateCartItemUseCase', UpdateCartItemUseCase.UseCase)
container.registerSingleton('DeleteCartItemUseCase', DeleteCartItemUseCase.UseCase)
container.registerInstance('CartDefaultTypeormRepository', dataSource.getRepository(CartItem))
