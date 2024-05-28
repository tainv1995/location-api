import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  building: string;

  @Column()
  name: string;

  @Column()
  number: string;

  @Column('float')
  area: number;

  @Column({ nullable: true })
  parentId: number;
}
