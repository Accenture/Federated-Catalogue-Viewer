import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, EMPTY, catchError } from 'rxjs';
import { ServiceCard } from '../../types/dtos';
import { MarketplaceService } from '../../services/marketplace.service';
import { DataFormattingService } from '../../services/data-formatting.service';
import { QueryService } from 'src/app/services/query.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-marketplace',
    templateUrl: './marketplace.component.html',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatGridListModule, MatSelectModule, MatDividerModule, MatIconModule],
    styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent implements OnInit {
    legalNames$: Observable<string[]> = EMPTY;
    services$: Observable<ServiceCard[]> = EMPTY;
    legalName: string | null = null;
    error: HttpErrorResponse | null = null;

    constructor(
        private marketplaceService: MarketplaceService,
        private router: Router,
        public formatter: DataFormattingService,
        private queryService: QueryService,
    ) {}

    ngOnInit(): void {
        this.legalNames$ = this.marketplaceService.fetchLegalNames().pipe(
            catchError((error: HttpErrorResponse) => {
                this.error = error;
                return EMPTY;
            }),
        );

        this.services$ = this.marketplaceService.fetchServiceData(null).pipe(
            catchError((error: HttpErrorResponse) => {
                this.error = error;
                return EMPTY;
            }),
        );
    }

    navigateToQuery(offerId: number): void {
        const query = this.queryService.buildOfferInfoQuery(offerId);
        this.router.navigate(['/query'], {
            queryParams: { query },
        });
    }

    onLegalNameChange(event: MatSelectChange): void {
        this.legalName = event.value;
        this.services$ = this.marketplaceService.fetchServiceData(this.legalName).pipe(
            catchError((error: HttpErrorResponse) => {
                this.error = error;
                return EMPTY;
            }),
        );
    }
}
