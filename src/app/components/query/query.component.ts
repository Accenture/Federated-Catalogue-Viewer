import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

interface QueryResponse {
    totalCount: number;
    items: Array<Object>;
}

const DEFAULT_QUERY: string = 'Match (n)-[r]->(m)\nReturn n,r,m';

const EMPTY_RESULTS: QueryResponse = {
    items: [],
    totalCount: 0,
};

@Component({
    selector: 'app-query',
    templateUrl: './query.component.html',
    styleUrls: ['./query.component.scss'],
})
export class QueryComponent implements OnInit {
    data: QueryResponse = EMPTY_RESULTS;
    error: HttpErrorResponse | null = null;

    queryFormGroup = this._formBuilder.group({
        query: [DEFAULT_QUERY, Validators.required],
    });
    constructor(private _httpClient: HttpClient, private _formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.queryData();
    }

    queryData() {
        const body = {
            statement: this.queryFormGroup.value.query,
        };
        this._httpClient.post<QueryResponse>('https://fc.gaiax4roms.hotsprings.io/query', body).subscribe(
            (value) => {
                this.data = value;
                this.error = null;
            },
            (error: HttpErrorResponse) => (this.error = error),
        );
    }

    getCols(): Array<string> {
        if (this.data.items.length > 0) {
            return Object.keys(this.data.items[0]);
        }
        return [];
    }
}
