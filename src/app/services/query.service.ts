import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter, map, Observable } from 'rxjs';
import { NodeQueryResult, QueryResponse } from '../types/dtos';
import { AuthService } from '../services/auth.service';

declare global {
    interface Window {
        ENVIRONMENT?: Record<string, string>;
    }
}

const FC_QUERY_PARAMS = '?withTotalCount=false';

@Injectable({
    providedIn: 'root',
})
export class QueryService {
    public readonly fcQueryUrl: string;

    constructor(private _httpClient: HttpClient, private auth: AuthService) {
        const baseUrl = window.ENVIRONMENT?.['FC_QUERY_URL'] || 'https://fc.gaiax4roms.hotsprings.io/query';
        this.fcQueryUrl = baseUrl + FC_QUERY_PARAMS;
        this.queryData = this.queryData.bind(this);
        this.allNodes = this.allNodes.bind(this);
        this.getById = this.getById.bind(this);
        this.getRelatedNodes = this.getRelatedNodes.bind(this);
    }

    private getAuthHeaders(): HttpHeaders {
        const accessToken = this.auth.accessToken;
        return new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${accessToken}`,
        });
    }

    public queryData<T>(statement: string, parameters: object = {}): Observable<QueryResponse<T>> {
        const body = {
            statement: statement,
            parameters,
        };
        const headers = this.getAuthHeaders();
        return this._httpClient.post<QueryResponse<T>>(`${this.fcQueryUrl}`, JSON.stringify(body), { headers });
    }

    public allNodes(label = 'Resource'): Observable<QueryResponse<NodeQueryResult>> {
        const params = {
            label,
        };
        const stmt = `
            MATCH (n)
            WHERE $label IN labels(n)
            RETURN id(n) AS id, n AS value, labels(n) AS labels
            ORDER BY id(n) DESC
        `;
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
