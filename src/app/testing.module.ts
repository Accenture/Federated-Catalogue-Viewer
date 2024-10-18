import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [],
    providers: [provideHttpClient(), provideHttpClientTesting()],
})
export class TestingModule {}
