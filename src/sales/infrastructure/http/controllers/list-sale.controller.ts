import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { parseListQuery } from '@/common/infrastructure/http/list-query'
import { SearchSaleUseCase } from '@/sales/aplication/usecases/search-sale.usecase'

export async function listSaleController(request: Request, response: Response) {
  const useCase: SearchSaleUseCase.UseCase = container.resolve('SearchSaleUseCase')
  const query = parseListQuery(request.query, ['created_at', 'status'])
  const sales = await useCase.execute(query)

  return response.status(200).json(sales)
}
