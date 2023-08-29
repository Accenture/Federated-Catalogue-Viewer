import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogBrowserComponent } from './catalog-browser.component';

describe('CatalogBrowserComponent', () => {
    let component: CatalogBrowserComponent;
    let fixture: ComponentFixture<CatalogBrowserComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CatalogBrowserComponent],
        });
        fixture = TestBed.createComponent(CatalogBrowserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
