import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {AddEditCollaborator} from '../create-offer-cool/add-edit-collaborator';
import { EnvironmentService } from '../../environments/environment.service';


@Injectable()
export class SearchCollaboratorService {
  baseUrl: string = this.environmentService.REST_API_LDAP_USER_DETAILS_URL;
  addEditCollaborator;
  constructor(private httpClient: HttpClient, private environmentService: EnvironmentService) {
    this.addEditCollaborator = {
      'name': null,
      'businessEntity': null,
      'functionName': null
    };
  }
  searchCollaborator(payLoad: any): Observable<any> {
    return this.httpClient.post(this.environmentService.REST_API_SEARCH_STAKEHOLDERS_URL,payLoad);
  }

  addCollaborators(saveCollaborator: any): Observable<any> {
    console.log('in service');
    return this.httpClient.post(this.environmentService.REST_API_UPDATE_OFFER, saveCollaborator);
  }
}
