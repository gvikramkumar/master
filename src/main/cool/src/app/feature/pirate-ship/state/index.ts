import * as fromRoot from '@app/state/app.state';
import * as fromPirateShip from './pirate-ship.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
    products: fromPirateShip.PirateShipState;
}

const getPirateShipState = createFeatureSelector<fromPirateShip.PirateShipState>('pirateShip');

export const getSelectedPirateShipInfo = createSelector(
    getPirateShipState,
    state => state.pirateShip
);

// export const getError = createSelector(
//     getPirateShipState,
//     state => state.error
// );
