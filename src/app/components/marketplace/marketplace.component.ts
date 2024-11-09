import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, EMPTY, catchError } from 'rxjs';
import { DataResource, PhysicalResource, ServiceAccessPoint, ServiceCard } from '../../types/dtos';
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

    dataResourceIndex = 0;
    serviceAccessPointIndex = 0;
    physicalResourceIndex = 0;

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

    previousDataResource(dataResources: DataResource[]): void {
        this.dataResourceIndex = this.dataResourceIndex > 0 ? this.dataResourceIndex - 1 : dataResources.length - 1;
    }

    nextDataResource(dataResources: DataResource[]): void {
        this.dataResourceIndex = this.dataResourceIndex < dataResources.length - 1 ? this.dataResourceIndex + 1 : 0;
    }

    previousServiceAccessPoint(serviceAccessPoints: ServiceAccessPoint[]): void {
        this.serviceAccessPointIndex =
            this.serviceAccessPointIndex > 0 ? this.serviceAccessPointIndex - 1 : serviceAccessPoints.length - 1;
    }

    nextServiceAccessPoint(serviceAccessPoints: ServiceAccessPoint[]): void {
        this.serviceAccessPointIndex =
            this.serviceAccessPointIndex < serviceAccessPoints.length - 1 ? this.serviceAccessPointIndex + 1 : 0;
    }

    previousPhysicalResource(physicalResources: PhysicalResource[]): void {
        this.physicalResourceIndex =
            this.physicalResourceIndex > 0 ? this.physicalResourceIndex - 1 : physicalResources.length - 1;
    }

    nextPhysicalResource(physicalResources: PhysicalResource[]): void {
        this.physicalResourceIndex =
            this.physicalResourceIndex < physicalResources.length - 1 ? this.physicalResourceIndex + 1 : 0;
    }
}
