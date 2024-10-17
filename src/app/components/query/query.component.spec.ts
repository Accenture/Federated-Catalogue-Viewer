import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryComponent } from './query.component';
import {TestingModule} from "../../testing.module";
import {of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('QueryComponent', () => {
    let component: QueryComponent;
    let fixture: ComponentFixture<QueryComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestingModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, BrowserAnimationsModule
            ],
            declarations: [QueryComponent],
            providers: [
              {
                provide: ActivatedRoute,
                useValue: {
                  queryParams: of({ query: "test" }),
                },
              },
            ]
        });
        fixture = TestBed.createComponent(QueryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
