import { inject, injectable } from 'tsyringe'
import { CartRepository } from '@/cart/domain/repositories/cart.repository'

export namespace DeleteCartItemUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  @injectable()
  export class UseCase {
    constructor(
      @inject('CartRepository')
      private cartRepository: CartRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.cartRepository.delete(input.id)
    }
  }
}
