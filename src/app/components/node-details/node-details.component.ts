import { Component, OnInit } from '@angular/core';
import { QueryService } from '../../services/query.service';
import { NodeQueryResult, QueryResponse } from '../../types/dtos';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-node-details',
    templateUrl: './node-details.component.html',
    styleUrls: ['./node-details.component.scss'],
})
export class NodeDetailsComponent implements OnInit {
    value?: Observable<NodeQueryResult>;
    childEntries?: Observable<QueryResponse<NodeQueryResult>>;
    constructor(private _queryService: QueryService, private _activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        const idObservable = this._activatedRoute.params.pipe(
            map((params) => params['id']),
            map(Number),
        );
        this.value = idObservable.pipe(switchMap(this._queryService.getById));

        this.childEntries = idObservable.pipe(switchMap(this._queryService.getRelatedNodes));
    }

    getKeys(value: Record<string, unknown>): string[] {
        return Object.keys(value);
    }

    getValue(value: Record<string, unknown>, key: string): unknown {
        return Object.prototype.hasOwnProperty.call(value, key) ? value[key] : '-';
    }
}
