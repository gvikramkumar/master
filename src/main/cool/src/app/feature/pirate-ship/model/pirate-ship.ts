import { PirateShipModule } from './pirate-ship-module';


export interface PirateShip {

    listATOs: Array<string>;
    listStatus: Array<string>;
    listSetupDetails: Array<PirateShipModule>;

}
