import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

interface CarouselIndexes {
    dataResourceIndex: number;
    serviceAccessPointIndex: number;
    physicalResourceIndex: number;
}

enum IndexType {
    DataResource = 'dataResourceIndex',
    ServiceAccessPoint = 'serviceAccessPointIndex',
    PhysicalResource = 'physicalResourceIndex',
}

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

    public IndexType = IndexType;
    public serviceIndexes: Map<number, CarouselIndexes> = new Map<number, CarouselIndexes>();

    constructor(
        private marketplaceService: MarketplaceService,
        private router: Router,
        private route: ActivatedRoute,
        public formatter: DataFormattingService,
        private queryService: QueryService,
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.legalName = params['participant'] || null;
            this.fetchData();
        });

        this.legalNames$ = this.marketplaceService.fetchLegalNames().pipe(
            catchError((error: HttpErrorResponse) => {
                this.error = error;
                return EMPTY;
            }),
        );
    }

    fetchData(): void {
        this.services$ = this.marketplaceService.fetchServiceData(this.legalName).pipe(
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

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { participant: this.legalName || null },
            queryParamsHandling: 'merge',
        });

        this.fetchData();
    }

    private getCarouselIndexes(serviceId: number): CarouselIndexes {
        if (!this.serviceIndexes.has(serviceId)) {
            this.serviceIndexes.set(serviceId, {
                dataResourceIndex: 0,
                serviceAccessPointIndex: 0,
                physicalResourceIndex: 0,
            });
        }
        return this.serviceIndexes.get(serviceId) as CarouselIndexes;
    }

    updateIndex(serviceId: number, indexType: IndexType, resources: unknown[], direction: 'next' | 'previous'): void {
        const indexes = this.getCarouselIndexes(serviceId);
        const currentIndex = indexes[indexType];
        const maxIndex = resources.length - 1;

        if (direction === 'next') {
            indexes[indexType] = currentIndex < maxIndex ? currentIndex + 1 : 0;
        } else {
            indexes[indexType] = currentIndex > 0 ? currentIndex - 1 : maxIndex;
        }
    }
}
