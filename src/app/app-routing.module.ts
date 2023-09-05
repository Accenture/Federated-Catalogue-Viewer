import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryComponent } from './components/query/query.component';
import { CatalogBrowserComponent } from './components/catalog-browser/catalog-browser.component';
import { NodeDetailsComponent } from './components/node-details/node-details.component';

const routes: Routes = [
    { path: 'nodes', component: CatalogBrowserComponent },
    { path: 'query', component: QueryComponent },
    { path: 'nodes/:id', component: NodeDetailsComponent },
    { path: '', redirectTo: 'nodes', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
