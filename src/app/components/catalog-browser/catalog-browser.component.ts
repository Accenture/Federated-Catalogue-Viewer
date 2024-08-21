import { Component, OnInit } from '@angular/core';
import { NodeQueryResult } from '../../types/dtos';
import { QueryService } from '../../services/query.service';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
    selector: 'app-catalog-browser',
    templateUrl: './catalog-browser.component.html',
    styleUrls: ['./catalog-browser.component.scss'],
})
export class CatalogBrowserComponent implements OnInit {
    data: Record<string, NodeQueryResult[]> = {};
    totalCounts: Record<string, number> = {};
    label?: Observable<string>;
    selectedTab = 0;
    limit = 30;
    offsets: Record<string, number> = {
        LegalParticipant: 0,
        ServiceOffering: 0,
        Resource: 0,
    };

    constructor(private _queryService: QueryService, private _activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.label = this._activatedRoute.queryParams.pipe(map((params) => params['label']));
        this.onTabChange(this.selectedTab);
    }

    onTabChange(index: number): void {
        this.selectedTab = index;
        const tabKey = this.getTabKey();

        if (!this.totalCounts[tabKey]) {
            this._queryService.getTotalCount(tabKey).subscribe((totalCount) => {
                this.totalCounts[tabKey] = totalCount;
            });
        }

        if (!this.data[tabKey] || this.data[tabKey].length === 0) {
            this.loadDataForTab(tabKey);
        }
    }

    getTabKey(): string {
        return ['LegalParticipant', 'ServiceOffering', 'Resource'][this.selectedTab];
    }

    private loadDataForTab(tabKey: string): void {
        this._queryService.allNodes(tabKey, this.limit, this.offsets[tabKey]).subscribe((result) => {
            this.data[tabKey] = (this.data[tabKey] || []).concat(result.items);
            this.offsets[tabKey] += this.limit;
        });
    }

    loadMore(): void {
        const tabKey = this.getTabKey();
        this.loadDataForTab(tabKey);
    }

    canLoadMore(tabKey: string): boolean {
        const currentCount = this.data[tabKey]?.length || 0;
        const totalCount = this.totalCounts[tabKey] || 0;
        return currentCount < totalCount;
    }
}
