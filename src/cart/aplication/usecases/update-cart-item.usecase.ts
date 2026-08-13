import { inject, injectable } from 'tsyringe'
import { CartRepository } from '@/cart/domain/repositories/cart.repository'
import { CartItemModel } from '@/cart/domain/models/cart.model'

export namespace UpdateCartItemUseCase {
  export type Input = {
    id: string
    quantity?: number
  }

  export type Output = CartItemModel

  @injectable()
  export class UseCase {
    constructor(
      @inject('CartRepository')
      private cartRepository: CartRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const item = await this.cartRepository.findById(input.id)

      if (input.quantity !== undefined) {
        item.setQuantity(input.quantity)
      }

      return this.cartRepository.update(item)
    }
  }
}
