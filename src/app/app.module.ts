import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { QueryComponent } from './components/query/query.component';
import { HttpClientModule } from '@angular/common/http';
import { JsonStringifyPipe } from './util/json-stringify.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { CatalogBrowserComponent } from './components/catalog-browser/catalog-browser.component';
import { NodeTableComponent } from './components/node-table/node-table.component';
import { MatChipsModule } from '@angular/material/chips';
import { NodeDetailsComponent } from './components/node-details/node-details.component';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { NodeLabelsComponent } from './components/node-labels/node-labels.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        AppComponent,
        QueryComponent,
        JsonStringifyPipe,
        CatalogBrowserComponent,
        NodeTableComponent,
        NodeDetailsComponent,
        NodeLabelsComponent,
        AuthenticationComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        HttpClientModule,
        MatTableModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatTabsModule,
        MatChipsModule,
        MatListModule,
        MatSelectModule,
        FormsModule,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
