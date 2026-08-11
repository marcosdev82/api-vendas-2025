import { faker } from '@faker-js/faker'
import { ProductModel } from '@/products/domain/models/products.model'

export function ProductDataBuilder(props: Partial<ProductModel>): ProductModel {
  const fallbackCostPrice = Number(faker.commerce.price({ min: 50, max: 1000, dec: 2 }))
  const costPrice = props.cost_price ?? (props.price !== undefined ? Number(Math.max(props.price - 10, 0).toFixed(2)) : fallbackCostPrice)
  const defaultPrice = Number((costPrice + 10).toFixed(2))

  return ProductModel.create({
    id: props.id,
    sku: props.sku ?? faker.string.alphanumeric(8).toUpperCase(),
    name: props.name ?? faker.commerce.productName(),
    description: props.description ?? faker.commerce.productDescription(),
    price: props.price ?? defaultPrice,
    cost_price: costPrice,
    quantity: props.quantity ?? 10,
    category: props.category ?? faker.commerce.department(),
    is_active: props.is_active ?? true,
    image_url: props.image_url ?? null,
    created_at: props.created_at,
    updated_at: props.updated_at,
  })
}

export const ProductsDataBuilder = ProductDataBuilder
