import { TokenEntity } from 'src/token/entities/token.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @OneToOne(() => TokenEntity, (token) => token.user, {
    cascade: true,
  })
  token: TokenEntity;
}
