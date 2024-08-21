import { Component, OnInit } from '@angular/core';
import { NodeQueryResult, QueryResponse } from '../../types/dtos';
import { QueryService } from '../../services/query.service';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, forkJoin } from 'rxjs';

@Component({
    selector: 'app-catalog-browser',
    templateUrl: './catalog-browser.component.html',
    styleUrls: ['./catalog-browser.component.scss'],
})
export class CatalogBrowserComponent implements OnInit {
    data: Record<string, QueryResponse<NodeQueryResult> | undefined> = {};
    label?: Observable<string>;
    selectedTab = 0;

    constructor(private _queryService: QueryService, private _activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.label = this._activatedRoute.queryParams.pipe(map((params) => params['label']));

        forkJoin({
            LegalParticipant: this._queryService.allNodes('LegalParticipant'),
            ServiceOffering: this._queryService.allNodes('ServiceOffering'),
            Resource: this._queryService.allNodes('Resource'),
        }).subscribe((results) => {
            this.data['LegalParticipant'] = results.LegalParticipant;
            this.data['ServiceOffering'] = results.ServiceOffering;
            this.data['Resource'] = results.Resource;
        });
    }

    onTabChange(index: number): void {
        this.selectedTab = index;
    }

    getTabKey(): string {
        return ['LegalParticipant', 'ServiceOffering', 'Resource'][this.selectedTab];
    }
}
