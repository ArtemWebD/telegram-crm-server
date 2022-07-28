import { ChatEntity } from 'src/chat/entities/chat.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  mimetype: string;

  @Column({ array: true, type: 'int' })
  data: number[];

  @OneToOne(() => ChatEntity, (chat) => chat.photo, {
    nullable: true,
  })
  chat: ChatEntity;
}
