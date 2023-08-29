export interface QueryResponse<T> {
    totalCount: number;
    items: Array<T>;
}

export interface NodeQueryResult {
    id: number;
    value: object;
    labels: Array<string>;
}

export const EMPTY_RESULTS: QueryResponse<any> = {
    items: [],
    totalCount: 0,
};
