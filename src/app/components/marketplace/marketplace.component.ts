import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { QueryService } from '../../services/query.service';
import { HttpErrorResponse } from '@angular/common/http';
import { QueryResponse, NodeQueryResult } from '../../types/dtos';
import { EMPTY_RESULTS } from '../../types/dtos';
import { catchError, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const OFFER_INFO_QUERY = `
MATCH (so)
WHERE 'ServiceOffering' IN labels(so)
  AND ($offer IS NULL OR $offer IN so.name)
CALL apoc.path.subgraphNodes(so, {maxLevel: 7})
YIELD node AS connected
RETURN DISTINCT id(connected) AS id, connected AS value, labels(connected) AS labels
ORDER BY labels(connected), id DESC
LIMIT 100
`;

const GET_OFFER_NAMES_QUERY = `
MATCH (lp)-[]-(connected)
WHERE 'LegalParticipant' IN labels(lp) 
  AND ($participant IS NULL OR $participant IN lp.legalName)
  AND 'ServiceOffering' IN labels(connected) 
  AND connected.name IS NOT NULL
RETURN DISTINCT connected.name AS serviceOfferingName
ORDER BY serviceOfferingName
`;

const GET_LEGAL_NAMES_QUERY = `
MATCH (lp)
WHERE 'LegalParticipant' IN labels(lp)
RETURN DISTINCT lp.legalName AS legalName
`;

@Component({
    selector: 'app-marketplace',
    standalone: true,
    imports: [CommonModule, MatGridListModule, MatCardModule, MatSelectModule],
    templateUrl: './marketplace.component.html',
    styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent implements OnInit {
    data: QueryResponse<NodeQueryResult> = EMPTY_RESULTS;
    error: HttpErrorResponse | null = null;
    legalName: string | null = null;
    legalNames: string[] = [];
    serviceOfferingNames: string[] = [];

    constructor(private _queryService: QueryService) {}

    ngOnInit(): void {
        this.fetchLegalNames();
    }

    fetchLegalNames(): void {
        this._queryService
            .queryData<{ legalName: string }>(GET_LEGAL_NAMES_QUERY)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.error = err;
                    console.error('Error occurred while fetching legal names:', err);
                    return of({ totalCount: 0, items: [] });
                }),
            )
            .subscribe((result) => {
                this.legalNames = result.items.map((item) => item.legalName);
            });
    }

    fetchData(legalName: string | null): void {
        this._queryService
            .queryData<{ serviceOfferingName: string }>(GET_OFFER_NAMES_QUERY, { participant: legalName })
            .pipe(
                switchMap((result) => {
                    this.serviceOfferingNames = result.items.map((item) => item.serviceOfferingName);

                    const offerInfoQueries = this.serviceOfferingNames.map((offer) => {
                        console.log(`Querying data for offer: ${offer}`);

                        return this._queryService
                            .queryData<NodeQueryResult>(OFFER_INFO_QUERY, { offer })
                            .pipe(
                                catchError((err) => {
                                    console.error(`Error fetching data for offer "${offer}":`, err);
                                    return of(EMPTY_RESULTS);
                                }),
                            );
                    });

                    return forkJoin(offerInfoQueries);
                }),
                catchError((err: HttpErrorResponse) => {
                    this.error = err;
                    console.error('Error occurred during query:', err);
                    return of([EMPTY_RESULTS]);
                }),
            )
            .subscribe((results) => {
                this.data = {
                    totalCount: results.reduce((acc, result) => acc + result.totalCount, 0),
                    items: [],
                };

                results.forEach((result, index) => {
                    const serviceOfferingName = this.serviceOfferingNames[index];
                    console.log(`Service Offering: ${serviceOfferingName}`);

                    result.items.forEach((item) => {
                        console.log(item);
                    });

                    this.data.items.push(...result.items);
                });
            });
    }

    onLegalNameChange(newLegalName: string | null): void {
        this.legalName = newLegalName;
        this.fetchData(this.legalName);
    }
}
