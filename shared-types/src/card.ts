export type ICardMovedEvent = {
    entityId: string,
    entityType: string,
    action: string,
    oldValue?: string,
    newValue: string,
    details: string,
    boardId?: string,
    user: string,
    timestamp: Date,
}