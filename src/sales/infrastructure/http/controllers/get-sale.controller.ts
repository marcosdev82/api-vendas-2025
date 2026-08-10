import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { getSaleUseCase } from '@/sales/aplication/usecases/get-sale.usecase'

export async function getSaleController(request: Request, response: Response) {
  const getSaleParamSchema = z.object({ id: z.string().uuid() })
  const { id } = dataValidation(getSaleParamSchema, request.params)

  const useCase: getSaleUseCase.UseCase = container.resolve('getSaleUseCase')
  const sale = await useCase.execute({ id })

  return response.status(200).json(sale)
}
