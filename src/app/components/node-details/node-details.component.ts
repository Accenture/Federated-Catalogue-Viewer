import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { map, Observable, switchMap } from 'rxjs';
import { QueryService } from '../../services/query.service';
import { NodeQueryResult, QueryResponse } from '../../types/dtos';
import { NodeTableComponent } from '../node-table/node-table.component';
import { NodeLabelsComponent } from '../node-labels/node-labels.component';

@Component({
    selector: 'app-node-details',
    templateUrl: './node-details.component.html',
    styleUrls: ['./node-details.component.scss'],
    imports: [CommonModule, RouterModule, MatCardModule, MatListModule, NodeLabelsComponent, NodeTableComponent],
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
