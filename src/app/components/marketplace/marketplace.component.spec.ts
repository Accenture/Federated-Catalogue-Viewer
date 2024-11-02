import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../testing.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MarketplaceComponent } from './marketplace.component';

describe('MarketplaceComponent', () => {
    let component: MarketplaceComponent;
    let fixture: ComponentFixture<MarketplaceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestingModule, MarketplaceComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ participant: 'test-participant' }),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MarketplaceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
