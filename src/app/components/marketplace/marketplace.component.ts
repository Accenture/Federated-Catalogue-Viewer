import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable, catchError, map, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { MarketplaceService } from '../../services/marketplace.service';
import { QueryService } from '../../services/query.service';
import { ServiceCard } from '../../types/dtos';

import { ServiceCardComponent } from '../service-card/service-card.component';

@Component({
    selector: 'app-marketplace',
    templateUrl: './marketplace.component.html',
    standalone: true,
    imports: [CommonModule, MatSelectModule, MatIconModule, ServiceCardComponent],
    styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent implements OnInit {
    legalNames$: Observable<string[]>;
    services$: Observable<ServiceCard[]> = EMPTY;
    legalName: string | null = null;
    error: HttpErrorResponse | null = null;

    private legalNameSubject = new BehaviorSubject<string | null>(null);
    private legalName$ = this.legalNameSubject.asObservable();

    constructor(
        private marketplaceService: MarketplaceService,
        private router: Router,
        private route: ActivatedRoute,
        private queryService: QueryService,
    ) {
        this.legalNames$ = this.marketplaceService.fetchLegalNames().pipe(
            catchError((error: HttpErrorResponse) => {
                this.error = error;
                return EMPTY;
            }),
        );
    }

    ngOnInit(): void {
        this.route.queryParams
            .pipe(
                map((params) => params['participant'] || null),
                tap((participant) => {
                    this.legalName = participant;
                    this.legalNameSubject.next(participant);
                }),
            )
            .subscribe();

        this.services$ = this.legalName$.pipe(
            switchMap((name) =>
                this.marketplaceService.fetchServiceData(name).pipe(
                    catchError((error: HttpErrorResponse) => {
                        this.error = error;
                        return EMPTY;
                    }),
                ),
            ),
        );
    }

    onLegalNameChange(event: MatSelectChange): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { participant: event.value || null },
            queryParamsHandling: 'merge',
        });
    }

    navigateToQuery(offerId: number): void {
        const query = this.queryService.buildOfferInfoQuery(offerId);
        this.router.navigate(['/query'], {
            queryParams: { query },
        });
    }
}
