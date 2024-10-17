import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeLabelsComponent } from './node-labels.component';
import {TestingModule} from "../../testing.module";
import {MatChipsModule} from "@angular/material/chips";

describe('NodeLabelsComponent', () => {
    let component: NodeLabelsComponent;
    let fixture: ComponentFixture<NodeLabelsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestingModule, MatChipsModule],
            declarations: [NodeLabelsComponent],
        });
        fixture = TestBed.createComponent(NodeLabelsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
