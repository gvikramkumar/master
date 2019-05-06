import { OfferSetupComponent } from './offer-setup.component';
import { pirateShipRoutesNames } from './pirate-ship.routes.names';
import { OfferOverViewResolver } from '@app/services/offer-overview-resolver.service';

export const PIRATE_SHIP_ROUTES = [
    {
        path: '',
        component: OfferSetupComponent,
    },
    {
        path: pirateShipRoutesNames.ITEM_CREATION + '/:selectedAto',
        loadChildren: './modules/item-creation/item-creation.module#ItemCreationModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: pirateShipRoutesNames.MODELLING_DESIGN + '/:selectedAto',
        loadChildren: './modules/modelling-design/modelling-design.module#ModellingDesignModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: pirateShipRoutesNames.SERVICE_ANNUITY_PRICING + '/:selectedAto',
        loadChildren: './modules/service-annuity-pricing/service-annuity-pricing.module#ServiceAnnuityPricingModule',
        resolve: { offerData: OfferOverViewResolver }
    }
]
