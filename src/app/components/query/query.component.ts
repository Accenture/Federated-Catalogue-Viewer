import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { concatMap, map, tap } from 'rxjs';
import { QueryService } from '../../services/query.service';
import { EMPTY_RESULTS, NodeQueryResult, QueryResponse } from '../../types/dtos';
import { JsonStringifyPipe } from '../../util/json-stringify.pipe';

const DEFAULT_QUERY = 'Match (n)-[r]->(m)\nReturn n,r,m\nLIMIT 100';
@Component({
    selector: 'app-query',
    templateUrl: './query.component.html',
    styleUrls: ['./query.component.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        JsonStringifyPipe,
    ],
})
export class QueryComponent implements OnInit {
    data: QueryResponse<NodeQueryResult> = EMPTY_RESULTS;
    error: HttpErrorResponse | null = null;

    queryFormGroup = this._formBuilder.group({
        query: [DEFAULT_QUERY, Validators.required],
    });
    constructor(
        private _queryService: QueryService,
        private _formBuilder: FormBuilder,
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
    ) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams
            .pipe(
                map((params) => params['query'] ?? DEFAULT_QUERY),
                tap((q) => this.queryFormGroup.controls.query.setValue(q)),
                concatMap((q) => this._queryService.queryData<NodeQueryResult>(q)),
            )
            .subscribe({
                next: (value) => {
                    this.data = value;
                    this.error = null;
                },
                error: (error: HttpErrorResponse) => (this.error = error),
            });
    }

    queryData() {
        if (!this.queryFormGroup.value.query) {
            return;
        }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { query: this.queryFormGroup.value.query },
            queryParamsHandling: 'merge',
        });
    }

    getCols(): string[] {
        if (this.data.items.length > 0) {
            return Object.keys(this.data.items[0]);
        }
        return [];
    }

    getTotalItemCount(): number {
        return this.data.items.length;
    }
}
