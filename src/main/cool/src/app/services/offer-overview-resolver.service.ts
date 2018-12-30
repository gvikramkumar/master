import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OfferPhaseService } from './offer-phase.service';

@Injectable()
export class OfferOverViewResolver implements Resolve<any> {
    offerOverviewDetailsList;
    caseId;

    constructor(private offerPhaseService: OfferPhaseService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        this.caseId = route.paramMap.get('id2');
        return this.offerPhaseService.getOfferPhaseDetails(this.caseId);
    }
}
