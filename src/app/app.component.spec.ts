import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TestingModule } from './testing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppModule } from './app.module';

describe('AppComponent', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [TestingModule, MatToolbarModule, AppModule],
            declarations: [AppComponent],
        }),
    );

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
