import { faker } from '@faker-js/faker'
import { ProductModel } from '@/products/domain/models/products.model'
import { randomUUID } from 'node:crypto'

export function ProductDataBuilder(props: Partial<ProductModel>): ProductModel {
  return {
    id: props.id ?? randomUUID(),
    sku: props.sku ?? faker.string.alphanumeric(8).toUpperCase(),
    name: props.name ?? faker.commerce.productName(),
    description: props.description ?? faker.commerce.productDescription(),
    price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
    cost_price: props.cost_price ?? Number(faker.commerce.price({ min: 50, max: 1000, dec: 2 })),
    quantity: props.quantity ?? 10,
    category: props.category ?? faker.commerce.department(),
    is_active: props.is_active ?? true,
    image_url: props.image_url ?? null,
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
  }
}
