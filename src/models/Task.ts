export interface Task {
    id?: number;
    description?: string;
    parentId?: number;
    userId?: number;
    done?: boolean;
    deadline?: Date;
    deleted?: boolean;
    tasks?: Task[];
    comment?: string;
    rate?: number;
}
