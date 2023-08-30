import { Component, OnInit } from '@angular/core';
import { NodeQueryResult, QueryResponse } from '../../types/dtos';
import { QueryService } from '../../services/query.service';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';

@Component({
    selector: 'app-catalog-browser',
    templateUrl: './catalog-browser.component.html',
    styleUrls: ['./catalog-browser.component.scss'],
})
export class CatalogBrowserComponent implements OnInit {
    data?: QueryResponse<NodeQueryResult>;
    label?: Observable<string>;

    constructor(private _queryService: QueryService, private _activatedRoute: ActivatedRoute) {}
    ngOnInit(): void {
        this.label = this._activatedRoute.queryParams.pipe(map((params) => params['label']));

        this.label.pipe(switchMap(this._queryService.allNodes)).subscribe((values) => (this.data = values));
    }
}
