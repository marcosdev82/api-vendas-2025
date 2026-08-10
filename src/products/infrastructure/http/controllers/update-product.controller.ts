import { Request, Response } from "express";
import { z } from "zod";

import { container } from "tsyringe";
import { dataValidation } from "@/common/infrastructure/validation/zod";
import { UpdateProductUseCase } from "@/products/aplication/usecases/update-product.usecase";

export async function updateProductController(
  request: Request,
  response: Response,
) {
  const createProductBodySchema = z.object({
    sku: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    cost_price: z.number().min(0).optional(),
    quantity: z.number().min(0).optional(),
    category: z.string().min(1).optional(),
    is_active: z.boolean().optional(),
    image_url: z.string().url().nullable().optional(),
  })
 
  const { sku, name, description, price, cost_price, quantity, category, is_active, image_url } = dataValidation(createProductBodySchema, request.body)

  const updateProductParamSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(updateProductParamSchema, request.params)

  const updateProductUseCase: UpdateProductUseCase.UseCase = container.resolve('UpdateProductUseCase')

  const product = await updateProductUseCase.execute({ id, sku, name, description, price, cost_price, quantity, category, is_active, image_url })

  return response.status(200).json(product)
}
