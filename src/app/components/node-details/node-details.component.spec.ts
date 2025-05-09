import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NodeDetailsComponent } from './node-details.component';
import { QueryService } from '../../services/query.service';

describe('NodeDetailsComponent', () => {
    let component: NodeDetailsComponent;
    let fixture: ComponentFixture<NodeDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NodeDetailsComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ id: 123 }),
                    },
                },
                { provide: QueryService, useValue: {} },
            ],
        });
        fixture = TestBed.createComponent(NodeDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
