import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { parseListQuery } from '@/common/infrastructure/http/list-query'
import { SearchProductCategoryUseCase } from '@/products/aplication/usecases/search-product-category.usecase'

export async function listProductCategoryController(request: Request, response: Response) {
  const useCase: SearchProductCategoryUseCase.UseCase = container.resolve('SearchProductCategoryUseCase')
  const query = parseListQuery(request.query, ['name', 'created_at'])
  const categories = await useCase.execute(query)

  return response.status(200).json(categories)
}