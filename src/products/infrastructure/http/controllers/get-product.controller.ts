import { AppError } from "@/common/domain/errors/app-error";
import { Request, Response } from "express";
import { z } from "zod";
import { container } from "tsyringe";
import { getProductUseCase } from "@/products/aplication/usecases/get-product.usecase";

export async function getProductController(
  request: Request,
  response: Response,
) {
  const getProductParamSchema = z.object({
    id: z.string().uuid(),
  })

  const validatedData = getProductParamSchema.safeParse(request.params)

  if (validatedData.success === false) {
    console.error('Invalid params', validatedData.error.format())
    throw new AppError(
      `${validatedData.error.errors.map(err => {
        return `${err.path} -> ${err.message}`
      })}`,
    )
  }

  const { id } = validatedData.data

  const getProductUseCase: getProductUseCase.UseCase = container.resolve('getProductUseCase')

  const product = await getProductUseCase.execute({ id })

  return response.status(200).json(product)
}
