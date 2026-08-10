import { ProductModel } from '@/products/domain/models/products.model';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product implements ProductModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  sku: string;

  @Column('varchar')
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', {
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column('decimal', {
    name: 'cost_price',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  cost_price: number;

  @Column('int')
  quantity: number;

  @Column('varchar')
  category: string;

  @Column('boolean', { name: 'is_active', default: true })
  is_active: boolean;

  @Column('varchar', { name: 'image_url', nullable: true })
  image_url?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
