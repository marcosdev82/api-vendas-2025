import { inject, injectable } from 'tsyringe'
import { CartRepository } from '@/cart/domain/repositories/cart.repository'
import { CartItemModel } from '@/cart/domain/models/cart.model'

export namespace GetCartItemUseCase {
  export type Input = {
    id: string
  }

  export type Output = CartItemModel

  @injectable()
  export class UseCase {
    constructor(
      @inject('CartRepository')
      private cartRepository: CartRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      return this.cartRepository.findById(input.id)
    }
  }
}
