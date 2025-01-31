import { Routes } from '@angular/router';
import { QueryComponent } from './components/query/query.component';
import { CatalogBrowserComponent } from './components/catalog-browser/catalog-browser.component';
import { NodeDetailsComponent } from './components/node-details/node-details.component';

export const routes: Routes = [
    { path: 'nodes', component: CatalogBrowserComponent },
    { path: 'query', component: QueryComponent },
    { path: 'nodes/:id', component: NodeDetailsComponent },
    { path: '', redirectTo: 'nodes', pathMatch: 'full' },
];
