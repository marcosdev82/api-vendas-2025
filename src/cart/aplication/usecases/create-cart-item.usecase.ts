import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { inject, injectable } from 'tsyringe'
import { CartRepository } from '@/cart/domain/repositories/cart.repository'

export namespace CreateCartItemUseCase {
  export type Input = {
    user_id: string
    product_id: string
    quantity: number
  }

  export type Output = {
    id: string
    user_id: string
    product_id: string
    quantity: number
    created_at: Date
    updated_at: Date
  }

  @injectable()
  export class UseCase {
    constructor(
      @inject('CartRepository')
      private cartRepository: CartRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.user_id || !input.product_id || input.quantity <= 0) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      const existing = await this.cartRepository.findByUserAndProduct(input.user_id, input.product_id)
      if (existing) {
        const updated = { ...existing, quantity: existing.quantity + input.quantity }
        return this.cartRepository.update(updated)
      }

      const item = this.cartRepository.create(input)
      return this.cartRepository.insert(item)
    }
  }
}
