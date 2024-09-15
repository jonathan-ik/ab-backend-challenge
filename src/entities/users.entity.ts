import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, Unique, UpdateDateColumn,Index,OneToMany } from "typeorm";
import { User } from "../interface/users.interface";
// import { RelationshipEntity } from './relationship.entity'; // Import the relationship entity

@Entity({ name: 'user_entity' })
export class UserEntity extends BaseEntity implements User {
    @PrimaryColumn()
    user_id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    @Unique(["email"])
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    phone_number: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    avatar: string;

    // @Column({ type: "int", default: 0 })
    // delete_flag: number;

    @CreateDateColumn()
    created_at: Date;

    @Index('user_entity_updated_at_index')
    @UpdateDateColumn()
    updated_at: Date;
}
