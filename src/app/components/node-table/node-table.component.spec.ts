import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeTableComponent } from './node-table.component';
import {TestingModule} from "../../testing.module";
import {MatTableModule} from "@angular/material/table";

describe('NodeTableComponent', () => {
    let component: NodeTableComponent;
    let fixture: ComponentFixture<NodeTableComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestingModule, MatTableModule],
            declarations: [NodeTableComponent],
        });
        fixture = TestBed.createComponent(NodeTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
