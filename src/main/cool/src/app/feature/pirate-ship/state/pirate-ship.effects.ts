import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import {map, catchError, mergeMap, switchMap} from 'rxjs/operators';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as pirateShipActions from './pirate-ship.action';

import { PirateShip } from '../model/pirate-ship';
import { OfferSetupService } from '@app/services/offer-setup.service';


@Injectable()
export class PirateShipEffects {

  constructor(
    private actions$: Actions,
    private offerSetupService: OfferSetupService
  ) { }

  @Effect()
  loadPirateShip$: any = this.actions$.pipe(
    ofType(pirateShipActions.PirateShipActionTypes.LoadPirateShip),
    map((action: pirateShipActions.LoadPirateShip) => action.payload),
    mergeMap((pirateShip: any) =>
      this.offerSetupService.getPirateShipInfo(pirateShip.offerId, pirateShip.offerLevel, pirateShip.functionalRole)
        .pipe(
          switchMap((pirateShipInfo: PirateShip) => [
            new pirateShipActions.LoadPirateShipSuccess(pirateShipInfo),
          new pirateShipActions.ShowPirateshipLoader(false)
          ]),

          catchError(err => of(new pirateShipActions.LoadPirateShipFail(err)))
        )
    ));

}
