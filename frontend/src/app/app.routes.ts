import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';

// Keeping routes in one array makes it easy to grow from one page into many pages later.
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];
