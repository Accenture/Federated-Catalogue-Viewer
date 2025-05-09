import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeLabelsComponent } from './node-labels.component';

describe('NodeLabelsComponent', () => {
    let component: NodeLabelsComponent;
    let fixture: ComponentFixture<NodeLabelsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NodeLabelsComponent],
        });
        fixture = TestBed.createComponent(NodeLabelsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
