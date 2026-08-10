import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { SearchSaleUseCase } from '@/sales/aplication/usecases/search-sale.usecase'

export async function listSaleController(request: Request, response: Response) {
  const listSaleQuerySchema = z.object({
    page: z.string().optional(),
    per_page: z.string().optional(),
    sort: z.string().optional(),
    sort_dir: z.string().optional(),
    filter: z.string().optional(),
  })

  const { page, per_page, sort, sort_dir, filter } = dataValidation(listSaleQuerySchema, request.query)

  const useCase: SearchSaleUseCase.UseCase = container.resolve('SearchSaleUseCase')
  const sales = await useCase.execute({
    page: Number(page ?? 1),
    per_page: Number(per_page ?? 15),
    sort: sort ?? null,
    sort_dir: sort_dir ?? null,
    filter: filter ?? null,
  })

  return response.status(200).json(sales)
}
