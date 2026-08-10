export type ProductOutput = {
  id: string
  sku: string
  name: string
  description: string
  price: number
  cost_price: number
  quantity: number
  category: string
  is_active: boolean
  image_url?: string | null
  created_at: Date
  updated_at: Date
}
