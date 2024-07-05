export interface QueryResponse<T> {
    totalCount: number;
    items: T[];
}

export interface NodeQueryResult {
    id: number;
    value: Record<string, unknown>;
    labels: string[];
}

export const EMPTY_RESULTS: QueryResponse<NodeQueryResult> = {
    items: [],
    totalCount: 0,
};
