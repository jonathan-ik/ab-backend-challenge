import { AppDataSource } from "../database";
import { RelationshipEntity } from "../entities/relationship.entity";
import { Repository } from "typeorm";
import { Relationship } from "../interface/relationship.interface";

export class RelationshipService extends Repository<RelationshipEntity> {
    public async followUser(user_id: string, friend_id: string): Promise<Relationship> {
        // Check if the user is already following the friend
        const existingRelationship = await AppDataSource.query(`SELECT * FROM relationship_entity WHERE user_id = $1 AND friend_id = $2`, [
            user_id,
            friend_id,
        ]);

        // If relationship exists, handle follow/unfollow logic
        if (existingRelationship.length) {
            const relationship = existingRelationship[0];

            // If relationship is currently inactive (unfollowed), reactivate it and increment follow count
            if (!relationship.is_followed) {
                const updatedRelationship = await AppDataSource.query(
                    `UPDATE relationship_entity SET is_followed = true, follow_count = follow_count + 1, updated_at = NOW() WHERE id = $1 RETURNING *`,
                    [relationship.id]
                );
                return updatedRelationship[0];
            }

            throw new Error("You are already following this user.");
        }

        // Otherwise, create a new follow relationship
        const newRelationship = await AppDataSource.query(
            `INSERT INTO relationship_entity (user_id, friend_id, relationship_type, follow_count) VALUES ($1, $2, 'follower', 1) RETURNING *`,
            [user_id, friend_id]
        );

        // Check for mutual following
        const reverseRelationship = await AppDataSource.query(
            `SELECT * FROM relationship_entity WHERE user_id = $1 AND friend_id = $2 AND is_followed = true`,
            [friend_id, user_id]
        );

        if (reverseRelationship.length) {
            // If mutual following, update both relationships to 'friend'
            await AppDataSource.query(
                `UPDATE relationship_entity SET relationship_type = 'friend' WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
                [user_id, friend_id]
            );
        }
        return newRelationship[0];
    }
    public async unfollowUser(user_id: string, friend_id: string): Promise<Relationship> {
        // Find the relationship to unfollow
        const existingRelationship = await AppDataSource.query(`SELECT * FROM relationship_entity WHERE user_id = $1 AND friend_id = $2`, [
            user_id,
            friend_id,
        ]);

        if (!existingRelationship.length) {
            throw new Error("No existing follow relationship found.");
        }
        // Set the relationship as inactive
        const unfollowedRelationship = await AppDataSource.query(
            `UPDATE relationship_entity SET is_followed = false, updated_at = NOW() WHERE id = $1 RETURNING *`,
            [existingRelationship[0].id]
        );

        return unfollowedRelationship[0];
    }
    public async getRelationships(userId: string, type: string): Promise<Relationship[]> {
        let query: string;
        // Determine the SQL query based on the type (followers, following, or friends)
        if (type === "followers") {
            query = `
            SELECT u.user_id, u.first_name, u.last_name, u.avatar
            FROM public.user_entity u
            JOIN public.relationship_entity r ON u.user_id = r.user_id
            WHERE r.friend_id = $1 AND r.is_followed = true
        `;
        } else if (type === "following") {
            query = `
            SELECT u.user_id, u.first_name, u.last_name, u.avatar
            FROM public.user_entity u
            JOIN public.relationship_entity r ON u.user_id = r.friend_id
            WHERE r.user_id = $1 AND r.is_followed = true
        `;
        } else if (type === "friends") {
            query = `
            SELECT u.user_id, u.first_name, u.last_name, u.avatar
            FROM public.user_entity u
            WHERE u.user_id IN (
                SELECT r1.friend_id
                FROM public.relationship_entity r1
                JOIN public.relationship_entity r2 ON r1.friend_id = r2.user_id
                WHERE r1.user_id = $1 AND r2.friend_id = $1 AND r1.is_followed = true AND r2.is_followed = true
            )
        `;
        } else {
            throw new Error('Invalid relationship type. Expected "followers", "following", or "friends".');
        }
        // Execute the query and return the relationships
        const relationships: Relationship[] = await AppDataSource.query(query, [userId]);
        return relationships;
    }
}
