import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeDetailsComponent } from './node-details.component';
import { TestingModule } from '../../testing.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('NodeDetailsComponent', () => {
    let component: NodeDetailsComponent;
    let fixture: ComponentFixture<NodeDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestingModule],
            declarations: [NodeDetailsComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ id: 123 }),
                    },
                },
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
