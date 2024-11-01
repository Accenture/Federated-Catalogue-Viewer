import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { QueryService } from './query.service';
import { CardDataService } from './service-data.service';
import { EMPTY_RESULTS, NodeQueryResult, ServiceCard, ServiceOffering } from '../types/dtos';

@Injectable({
    providedIn: 'root',
})
export class MarketplaceService {
    constructor(private queryService: QueryService, private cardDataService: CardDataService) {}

    fetchLegalNames(): Observable<string[]> {
        return this.queryService
            .queryData<{ legalName: string }>('MATCH (lp:LegalParticipant) RETURN DISTINCT lp.legalName AS legalName')
            .pipe(
                map((result) => result.items.map((item) => item.legalName).sort((a, b) => a.localeCompare(b))),
                catchError((err) => {
                    console.error('Error occurred while fetching legal names:', err);
                    return of([]);
                }),
            );
    }

    fetchServiceData(legalName: string | null): Observable<ServiceCard[]> {
        return this.queryService
            .queryData<ServiceOffering>(
                `
          MATCH (lp)-[]-(connected)
          WHERE 'LegalParticipant' IN labels(lp)
            AND ($participant IS NULL OR $participant IN lp.legalName)
            AND 'ServiceOffering' IN labels(connected)
            AND connected.name IS NOT NULL
          RETURN DISTINCT id(connected) AS id, connected.name AS name
          ORDER BY id
        `,
                { participant: legalName },
            )
            .pipe(
                switchMap((result) => {
                    if (result.items.length === 0) {
                        return of([]);
                    }

                    const offerInfoQueries = result.items.map((offer) =>
                        this.queryService
                            .queryData<NodeQueryResult>(this.queryService.buildOfferInfoQuery(offer.id), {
                                offer: offer.id,
                            })
                            .pipe(catchError(() => of(EMPTY_RESULTS))),
                    );
                    return forkJoin(offerInfoQueries).pipe(
                        map((results) =>
                            results.map((data, index) =>
                                this.cardDataService.fillServiceCard(result.items[index], data.items),
                            ),
                        ),
                    );
                }),
                catchError((err) => {
                    console.error('Error occurred during service data fetch:', err);
                    return of([]);
                }),
            );
    }
}
