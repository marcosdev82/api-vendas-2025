import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UploadProductImageUseCase } from '@/products/aplication/usecases/upload-product-image.usecase'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { invalidateCacheForResource } from '@/common/infrastructure/cache/cache-invalidation'

export async function uploadProductImageController(request: Request, response: Response) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(paramsSchema, request.params)

  if (!request.file?.filename) {
    throw new BadRequestError('Product image file is required')
  }

  const useCase: UploadProductImageUseCase.UseCase = container.resolve('UploadProductImageUseCase')
  const product = await useCase.execute({ id, fileName: request.file.filename })

  await invalidateCacheForResource('products')

  return response.status(200).json(product)
}