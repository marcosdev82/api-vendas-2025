import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { parseListQuery } from '@/common/infrastructure/http/list-query'
import { SearchProductUseCase } from '@/products/aplication/usecases/search-product.usecase'

export async function listProductController(request: Request, response: Response) {
  const useCase: SearchProductUseCase.UseCase = container.resolve('SearchProductUseCase')
  const query = parseListQuery(request.query, ['name', 'price', 'created_at'])
  const products = await useCase.execute(query)

  return response.status(200).json(products)
}