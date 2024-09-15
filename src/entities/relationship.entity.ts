import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Relationship } from "../interface/relationship.interface";

@Entity("relationship_entity")
export class RelationshipEntity extends BaseEntity implements Relationship {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50 })
    user_id: string;

    @Column({ type: "varchar", length: 50 })
    friend_id: string;

    @Column({ type: "varchar", length: 50, default: "follower" })
    relationship_type: string;

    @Column({ type: "boolean", default: true })
    is_followed: boolean;

    @Column({ type: "int", default: 0 })
    follow_count: number;

    @CreateDateColumn()
    created_at: Date;

    @Index("relationship_entity_updated_at_index")
    @UpdateDateColumn()
    updated_at: Date;
}
