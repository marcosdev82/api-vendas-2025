import { Request, Response } from "express";
import { z } from "zod";
import { DeleteProductUseCase } from "@/products/aplication/usecases/delete-product.usecase";
import { container } from "tsyringe";
import { dataValidation } from "@/common/infrastructure/validation/zod";

export async function deleteProductController(
  request: Request,
  response: Response,
) {
  const deleteProductBodySchema = z.object({
    id: z.string(),
  })
 
  const { id } = dataValidation(deleteProductBodySchema, request.params)

  const deleteProductUseCase: DeleteProductUseCase.UseCase = container.resolve('DeleteProductUseCase')

  const product = await deleteProductUseCase.execute({ id })

  return response.status(204).json(product)
}
