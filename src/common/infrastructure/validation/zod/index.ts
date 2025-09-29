import { AppError } from "@/common/domain/errors/app-error"
import { z } from "zod"

/**
 * @param schema objeto com schema de validação do zod
 * @param data objeto com os dados a serem validados
 * @returns dados validados ou lança um AppError em caso de falha
 */
export function dataValidation<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> {
  const validatedData = schema.safeParse(data)

  if (!validatedData.success) {
    console.error("Invalid data", validatedData.error.format())
    throw new AppError(
      `${validatedData.error.errors
        .map(err => `${err.path.join(".")} -> ${err.message}`)
        .join(", ")}`
    )
  }

  return validatedData.data
}
