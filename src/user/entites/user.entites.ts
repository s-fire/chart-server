import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  // 主键
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  nickname: string;
  @Column()
  repassword: string;
  @Column()
  mobile: string;
  @Column({default:0})
  role: string
}