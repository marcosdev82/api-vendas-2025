import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UpdateSaleUseCase } from '@/sales/aplication/usecases/update-sale.usecase'

export async function updateSaleController(request: Request, response: Response) {
  const updateSaleBodySchema = z.object({
    customer_name: z.string().min(1).optional(),
    quantity: z.number().int().positive().optional(),
    status: z.string().optional(),
  })

  const { customer_name, quantity, status } = dataValidation(updateSaleBodySchema, request.body)

  const updateSaleParamSchema = z.object({ id: z.string().uuid() })
  const { id } = dataValidation(updateSaleParamSchema, request.params)

  const useCase: UpdateSaleUseCase.UseCase = container.resolve('UpdateSaleUseCase')
  const sale = await useCase.execute({ id, customer_name, quantity, status })

  return response.status(200).json(sale)
}
