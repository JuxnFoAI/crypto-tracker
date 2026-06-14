import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'coin/:id',
    loadComponent: () =>
      import('./pages/coin-detail/coin-detail.component').then(
        (m) => m.CoinDetailComponent,
      ),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites.component').then((m) => m.FavoritesComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
