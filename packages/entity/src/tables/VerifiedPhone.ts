import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity()
export class VerifiedPhone extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ unique: true })
  phone: number

  @Field()
  @Column({ default: false })
  isVerified: boolean

  @Field()
  @Column({ default: false })
  isRegistered: boolean
}
