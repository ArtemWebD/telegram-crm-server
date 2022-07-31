import { ChatEntity } from 'src/chat/entities/chat.entity';
import { MessageEntity } from 'src/message/entities/message.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToOne(() => MessageEntity, (message) => message.file, {
    nullable: true,
  })
  @JoinColumn()
  message?: MessageEntity;
}
