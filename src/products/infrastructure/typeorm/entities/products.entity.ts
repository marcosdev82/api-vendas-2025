import { ProductModel } from '@/products/domain/models/products.model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product implements ProductModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @Column({name: 'created_at'})
  created_at: Date;

  @Column({name: 'updated_at'})
  updated_at: Date;
}
