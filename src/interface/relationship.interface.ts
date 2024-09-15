export interface Relationship {
    id: number;
    user_id: string;
    friend_id: string;
    relationship_type: string;
    is_followed: boolean;
    follow_count: number;
    created_at: Date;
    updated_at: Date;
}
