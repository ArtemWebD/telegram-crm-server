import { ChatEntity } from 'src/chat/entities/chat.entity';
import { MessageEntity } from 'src/message/entities/message.entity';
import {
  Column,
  Entity,
  JoinColumn,
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

  @Column({ nullable: true })
  data: string;

  @OneToOne(() => ChatEntity, (chat) => chat.photo, {
    nullable: true,
  })
  chat: ChatEntity;

  @OneToOne(() => MessageEntity, (message) => message.file, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  message?: MessageEntity;
}
