import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

const apiUrl = environment.apiUrl;
const endpointUrl = `${apiUrl}/api/database`;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private httpClient: HttpClient) {
  }

  mongoToPgSync() {
    return this.httpClient.post<any>(`${endpointUrl}/mongoToPgSync`, null);
  }

  pgToMongoSync() {
    return this.httpClient.post<any>(`${endpointUrl}/pgToMongoSync`, null);
  }


}
