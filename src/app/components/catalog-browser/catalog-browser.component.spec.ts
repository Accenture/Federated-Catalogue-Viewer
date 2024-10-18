import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogBrowserComponent } from './catalog-browser.component';
import { TestingModule } from '../../testing.module';
import { MatCardModule } from '@angular/material/card';

describe('CatalogBrowserComponent', () => {
    let component: CatalogBrowserComponent;
    let fixture: ComponentFixture<CatalogBrowserComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestingModule, MatCardModule],
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
