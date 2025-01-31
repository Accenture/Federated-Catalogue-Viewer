import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogBrowserComponent } from './catalog-browser.component';
import { QueryService } from '../../services/query.service';

describe('CatalogBrowserComponent', () => {
    let component: CatalogBrowserComponent;
    let fixture: ComponentFixture<CatalogBrowserComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CatalogBrowserComponent],
            providers: [{ provide: QueryService, useValue: {} }],
        });
        fixture = TestBed.createComponent(CatalogBrowserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
