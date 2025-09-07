
import { Routes } from '@angular/router';
import { WorkInProgressPageComponent } from './features/work-in-progress-page/work-in-progress-page.component';
import { SamplePacksStoreComponent } from './features/sample-packs-store/sample-packs-store.component';

export const routes: Routes = [
	{
		path: '',
		component: WorkInProgressPageComponent
	},
	{
		path: ':lang',
		component: WorkInProgressPageComponent
	},
	{
		path: ':lang/photo',
		component: SamplePacksStoreComponent
	},
	{
		path: ':lang/store',
		component: SamplePacksStoreComponent
	},
	{
		path: '**',
		redirectTo: ''
	}
];
