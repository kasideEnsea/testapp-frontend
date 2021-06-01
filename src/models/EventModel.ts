export interface EventModel {
    id: number;
    userId: number;
    taskId: number;
    type: string;
    comment: string;
    taskName: string;
    newValue: string;
    deleted: boolean;
    created: Date;
    isChecklist: boolean
}
