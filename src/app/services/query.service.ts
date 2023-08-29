import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter, map, Observable } from 'rxjs';
import { NodeQueryResult, QueryResponse } from '../types/dtos';

@Injectable({
    providedIn: 'root',
})
export class QueryService {
    constructor(private _httpClient: HttpClient) {
        this.queryData = this.queryData.bind(this);
        this.allNodes = this.allNodes.bind(this);
        this.getById = this.getById.bind(this);
        this.getRelatedNodes = this.getRelatedNodes.bind(this);
    }

    public queryData<T>(statement: string, parameters: Object = {}): Observable<QueryResponse<T>> {
        const body = {
            statement: statement,
            parameters,
        };
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this._httpClient.post<QueryResponse<T>>(
            'https://fc.gaiax4roms.hotsprings.io/query',
            JSON.stringify(body),
            { headers },
        );
    }

    public allNodes(label = 'Resource'): Observable<QueryResponse<NodeQueryResult>> {
        const params = {
            label,
        };
        const stmt = 'Match (n) Where $label in labels(n)  Return id(n) as id, n as value, labels(n) as labels';
        return this.queryData(stmt, params);
    }

    public getById(id: number): Observable<NodeQueryResult> {
        const params = {
            id,
        };
        const stmt = 'Match (n:Resource) Where id(n)=$id Return id(n) as id, n as value, labels(n) as labels';
        return this.queryData<NodeQueryResult>(stmt, params).pipe(
            map((value) => value.items),
            filter((items) => items.length > 0),
            map((items) => items[0]),
        );
    }

    public getRelatedNodes(id: number): Observable<QueryResponse<NodeQueryResult>> {
        const params = {
            id,
        };
        const stmt = 'Match (n)--(m) Where id(n)=$id Return id(m) as id, m as value, labels(m) as labels';

        return this.queryData<NodeQueryResult>(stmt, params);
    }
}
