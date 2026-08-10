import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { SaleModel } from '@/sales/domain/models/sales.model'

@Entity('sales')
export class Sale implements SaleModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  customer_name: string

  @Column('uuid')
  product_id: string

  @Column('int')
  quantity: number

  @Column('decimal', {
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  total_price: number

  @Column('varchar')
  status: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
