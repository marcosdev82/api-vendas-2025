import { z } from 'zod'
import { dataValidation } from '@/common/infrastructure/validation/zod'

type SortableField = readonly [string, ...string[]]

type ParsedListQuery = {
  page: number
  per_page: number
  sort: string | null
  sort_dir: 'asc' | 'desc' | null
  filter: string | null
}

export function parseListQuery(
  query: unknown,
  sortableFields: SortableField,
): ParsedListQuery {
  const schema = z
    .object({
      page: z.coerce.number().int().min(1).optional(),
      limit: z.coerce.number().int().min(1).max(100).optional(),
      per_page: z.coerce.number().int().min(1).max(100).optional(),
      search: z.string().trim().min(1).optional(),
      filter: z.string().trim().min(1).optional(),
      sortBy: z.enum(sortableFields).optional(),
      sort: z.enum(sortableFields).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      sort_dir: z.enum(['asc', 'desc']).optional(),
    })
    .transform((values) => ({
      page: values.page ?? 1,
      per_page: values.limit ?? values.per_page ?? 15,
      sort: values.sortBy ?? values.sort ?? null,
      sort_dir: values.sortOrder ?? values.sort_dir ?? null,
      filter: values.search ?? values.filter ?? null,
    }))

  return dataValidation(schema, query)
}
