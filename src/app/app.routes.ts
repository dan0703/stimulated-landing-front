
import { Routes } from '@angular/router';
import { WorkInProgressPageComponent } from './features/work-in-progress-page/work-in-progress-page.component';
import { SamplePacksStoreComponent } from './features/sample-packs-store/sample-packs-store.component';
import { PortfolioComponent } from './features/portfolio/portfolio.component';

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
		path: ':lang/portafolio',
		component: PortfolioComponent
	},
	{
		path: ':lang/portafolio/:videoId',
		component: PortfolioComponent
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
