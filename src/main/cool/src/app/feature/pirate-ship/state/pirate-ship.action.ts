import { Action } from '@ngrx/store';
import { PirateShip } from '../model/pirate-ship';

export enum PirateShipActionTypes {

    InitializePirateShip = '[PirateShip] Initialize Pirate Ship',

    LoadPirateShip = '[PirateShip] Load Pirate Ship',
    LoadPirateShipFail = '[PirateShip] Load Pirate Ship Fail',
    LoadPirateShipSuccess = '[PirateShip] Load Pirate Ship Success',

}

// Action Creators

export class InitializePirateShip implements Action {
    readonly type = PirateShipActionTypes.InitializePirateShip;
}

export class LoadPirateShip implements Action {
    readonly type = PirateShipActionTypes.LoadPirateShip;
    constructor(public payload: { offerId: string, offerLevel: string, functionalRole: string }) { }
}

export class LoadPirateShipFail implements Action {
    readonly type = PirateShipActionTypes.LoadPirateShipFail;
    constructor(public payload: string) { }
}

export class LoadPirateShipSuccess implements Action {
    readonly type = PirateShipActionTypes.LoadPirateShipSuccess;
    constructor(public payload: PirateShip) { }
}



// Union the valid types
export type PirateShipActions = InitializePirateShip
    | LoadPirateShip
    | LoadPirateShipFail
    | LoadPirateShipSuccess;

