import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { QueryComponent } from './query.component';
import { QueryService } from '../../services/query.service';

describe('QueryComponent', () => {
    let component: QueryComponent;
    let fixture: ComponentFixture<QueryComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [QueryComponent],
            providers: [
                provideNoopAnimations(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ query: 'test' }),
                    },
                },
                {
                    provide: QueryService,
                    useValue: {
                        queryData: () => of({ totalCount: 0, items: [] }),
                    },
                },
            ],
        });
        fixture = TestBed.createComponent(QueryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
