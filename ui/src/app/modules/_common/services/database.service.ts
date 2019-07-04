import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {SyncMap} from '../../../../../../shared/models/sync-map';

const apiUrl = environment.apiUrl;
const endpointUrl = `${apiUrl}/api/database`;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private httpClient: HttpClient) {
  }

  mongoToPgSync(syncMap) {
    return this.httpClient.post<SyncMap>(`${apiUrl}/api/run-job/databaseSync`, syncMap);
  }

  pgToMongoSync() {
    return this.httpClient.get<any>(`${endpointUrl}/pgToMongoSync`);
  }


}
