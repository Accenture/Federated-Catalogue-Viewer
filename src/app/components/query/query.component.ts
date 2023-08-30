import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { QueryService } from '../../services/query.service';
import { EMPTY_RESULTS, QueryResponse } from '../../types/dtos';
import { query } from '@angular/animations';

const DEFAULT_QUERY: string = 'Match (n)-[r]->(m)\nReturn n,r,m';
@Component({
    selector: 'app-query',
    templateUrl: './query.component.html',
    styleUrls: ['./query.component.scss'],
})
export class QueryComponent implements OnInit {
    data: QueryResponse<any> = EMPTY_RESULTS;
    error: HttpErrorResponse | null = null;

    queryFormGroup = this._formBuilder.group({
        query: [DEFAULT_QUERY, Validators.required],
    });
    constructor(private _queryService: QueryService, private _formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.queryData();
    }
    public queryData() {
        if (!this.queryFormGroup.value.query) {
            return;
        }
        this._queryService.queryData(this.queryFormGroup.value.query).subscribe({
            next: (value) => {
                this.data = value;
                this.error = null;
            },
            error: (error: HttpErrorResponse) => (this.error = error),
        });
    }

    getCols(): Array<string> {
        if (this.data.items.length > 0) {
            return Object.keys(this.data.items[0]);
        }
        return [];
    }
}
