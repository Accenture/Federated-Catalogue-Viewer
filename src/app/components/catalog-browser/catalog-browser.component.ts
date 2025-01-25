import { Component } from '@angular/core';
import { NodeQueryResult } from '../../types/dtos';
import { QueryService } from '../../services/query.service';

import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, scan, startWith, concatMap } from 'rxjs/operators';

@Component({
    standalone: false,
    selector: 'app-catalog-browser',
    templateUrl: './catalog-browser.component.html',
    styleUrls: ['./catalog-browser.component.scss'],
})
export class CatalogBrowserComponent {
    public readonly data$: Observable<{ totalCount: number; nodes: NodeQueryResult[] }>;
    public readonly selectedTab$ = new BehaviorSubject<number>(0);
    public readonly limit$ = new BehaviorSubject<number>(30);
    public readonly fetchMore$ = new Subject<void>();

    public readonly tabs = ['Legal Participant', 'Service Offering', 'Resource'];

    constructor(private _queryService: QueryService) {
        const selectedKey$ = this.selectedTab$.pipe(
            map((selectedTab) => ['LegalParticipant', 'ServiceOffering', 'Resource'][selectedTab]),
        );

        const offset$ = combineLatest([this.selectedTab$, this.limit$]).pipe(
            switchMap(([, limit]) =>
                this.fetchMore$.pipe(
                    startWith(void 0),
                    scan((acc) => acc + limit, -limit),
                ),
            ),
        );

        this.data$ = combineLatest([selectedKey$, this.limit$]).pipe(
            switchMap(([selectedKey, limit]) =>
                offset$.pipe(
                    concatMap((offset) => this.fetchNodesAndCount(selectedKey, limit, offset)),
                    scan(
                        (acc, curr) => ({
                            totalCount: curr.totalCount ?? 0,
                            nodes: acc.nodes.concat(curr.nodes ?? []),
                        }),
                        { totalCount: 0, nodes: [] } as { totalCount: number; nodes: NodeQueryResult[] },
                    ),
                ),
            ),
        );
    }

    protected fetchNodesAndCount(
        key: string,
        limit: number,
        offset: number,
    ): Observable<{ totalCount: number; nodes: NodeQueryResult[] }> {
        return combineLatest([
            this._queryService.allNodes(key, limit, offset).pipe(map((response) => response.items)),
            this._queryService.getTotalCount(key),
        ]).pipe(map(([nodes, totalCount]) => ({ nodes, totalCount })));
    }

    onTabChange(index: number): void {
        this.selectedTab$.next(index);
    }

    loadMore(): void {
        this.fetchMore$.next();
    }
}
