
import { PirateShip } from '../model/pirate-ship';
import { PirateShipActionTypes, PirateShipActions } from './pirate-ship.action';


export interface PirateShipState {
    pirateShip: PirateShip;
    error: string;
}

const initialState: PirateShipState = {
    pirateShip: null,
    error: ''
};

export function reducer(state = initialState, action: PirateShipActions): PirateShipState {

    switch (action.type) {

        case PirateShipActionTypes.InitializePirateShip:
            return {
                ...state,
                pirateShip: null
            };

        case PirateShipActionTypes.LoadPirateShipSuccess:
            return {
                ...state,
                pirateShip: action.payload,
                error: ''
            };

        case PirateShipActionTypes.LoadPirateShipFail:
            return {
                ...state,
                pirateShip: null,
                error: action.payload
            };

        default:
            return state;
    }
}
