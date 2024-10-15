import { Component, OnInit } from '@angular/core';
import { NodeQueryResult } from '../../types/dtos';
import { QueryService } from '../../services/query.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, scan, startWith, concatMap } from 'rxjs/operators';

@Component({
    selector: 'app-catalog-browser',
    templateUrl: './catalog-browser.component.html',
    styleUrls: ['./catalog-browser.component.scss'],
})
export class CatalogBrowserComponent implements OnInit {
    public readonly data$: Observable<{ totalCount: number; nodes: NodeQueryResult[] }>;
    public readonly selectedTab$ = new BehaviorSubject<number>(0);
    public readonly limit$ = new BehaviorSubject<number>(30);
    public readonly fetchMore$ = new Subject<void>();

    public readonly tabs = ['Legal Participant', 'Service Offering', 'Resource'];

    constructor(private _queryService: QueryService, private _activatedRoute: ActivatedRoute) {
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

    pageSizes = [30, 50, 100, 200];
    label?: Observable<string>;

    ngOnInit(): void {
        this.label = this._activatedRoute.queryParams.pipe(map((params) => params['label']));
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

    onPageSizeChange(newSize: number): void {
        this.limit$.next(newSize);
    }

    onTabChange(index: number): void {
        this.selectedTab$.next(index);
    }

    loadMore(): void {
        this.fetchMore$.next();
    }
}
