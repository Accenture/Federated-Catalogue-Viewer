import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthenticationComponent } from './authentication.component';
import { AuthService } from '../../services/auth.service';

describe('AuthenticationComponent', () => {
    let component: AuthenticationComponent;
    let fixture: ComponentFixture<AuthenticationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AuthenticationComponent],

            providers: [{ provide: AuthService, useValue: { isLoggedIn$: of(true) } }],
        }).compileComponents();

        fixture = TestBed.createComponent(AuthenticationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
