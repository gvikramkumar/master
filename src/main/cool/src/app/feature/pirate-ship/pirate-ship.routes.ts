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
    },
    {
        path: pirateShipRoutesNames.SELF_SERVICE_ORDERABILITY + '/:selectedAto',
        loadChildren: './modules/self-service-orderability/self-service-orderability.module#SelfServiceOrderabilityModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: pirateShipRoutesNames.CSDL + '/:selectedAto',
        loadChildren: './modules/csdl/csdl.module#CsdlModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: pirateShipRoutesNames.TC_MAPPING + '/:selectedAto',
        loadChildren: './modules/tc-mapping/tc-mapping.module#TcMappingModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: pirateShipRoutesNames.CHANGE_STATUS + '/:selectedAto/:moduleName',
        loadChildren: './modules/changestatus/changestatus.module#ChangestatusModule'
    },
    {
        path: pirateShipRoutesNames.SERVICE_MAPPING + '/:selectedAto',
        loadChildren: './modules/service-mapping/service-mapping.module#ServiceMappingModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: pirateShipRoutesNames.SELF_SERVICE_ORDERABILITY + '/:selectedAto',
        loadChildren: './modules/self-service-orderability/self-service-orderability.module#SelfServiceOrderabilityModule',
        resolve: { offerData: OfferOverViewResolver }
    },
    {
        path: pirateShipRoutesNames.SALES_COMPENSATION + '/:selectedAto',
        loadChildren: './modules/sales-compensation/sales-compensation.module#SalesCompensationModule',
        resolve: { offerData: OfferOverViewResolver }
    }
]
