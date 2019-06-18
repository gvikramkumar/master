import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OfferPhaseService } from './offer-phase.service';

@Injectable()
export class OfferOverViewResolver implements Resolve<any> {

    offerId;
    offerOverviewDetailsList;

    constructor(private offerPhaseService: OfferPhaseService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        this.offerId = route.paramMap.get('offerId');
        return this.offerPhaseService.getOfferPhaseDetails(this.offerId, false);
    }
}
