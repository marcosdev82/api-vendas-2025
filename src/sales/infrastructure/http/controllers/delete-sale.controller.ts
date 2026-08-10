import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { DeleteSaleUseCase } from '@/sales/aplication/usecases/delete-sale.usecase'

export async function deleteSaleController(request: Request, response: Response) {
  const deleteSaleParamSchema = z.object({ id: z.string().uuid() })
  const { id } = dataValidation(deleteSaleParamSchema, request.params)

  const useCase: DeleteSaleUseCase.UseCase = container.resolve('DeleteSaleUseCase')
  await useCase.execute({ id })

  return response.status(204).send()
}
