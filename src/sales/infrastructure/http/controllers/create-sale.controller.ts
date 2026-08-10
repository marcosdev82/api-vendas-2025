import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateSaleUseCase } from '@/sales/aplication/usecases/create-sale.usecase'

export async function createSaleController(request: Request, response: Response) {
  const createSaleBodySchema = z.object({
    customer_name: z.string().min(1),
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    status: z.string().default('PENDING'),
  })

  const { customer_name, product_id, quantity, status } = dataValidation(createSaleBodySchema, request.body)

  const createSaleUseCase: CreateSaleUseCase.UseCase = container.resolve('CreateSaleUseCase')
  const sale = await createSaleUseCase.execute({ customer_name, product_id, quantity, status })

  return response.status(201).json(sale)
}
