import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', array: true })
  data: number[];

  @Column({ nullable: true })
  filename: string;

  @Column()
  mimetype: string;
}
