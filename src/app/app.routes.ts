
import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'route1',
		loadChildren: () => import('./features/screen1/screen1.module').then(m => m.Screen1Module)
	},
	{
		path: 'route2',
		loadChildren: () => import('./features/screen2/screen2.module').then(m => m.Screen2Module)
	},
	{
		path: '',
		redirectTo: 'route1',
		pathMatch: 'full'
	},
	{
		path: '**',
		redirectTo: 'route1'
	}
];
