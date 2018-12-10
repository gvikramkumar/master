import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {AddEditCollaborator} from '../create-offer-cool/add-edit-collaborator';


@Injectable()
export class SearchCollaboratorService {
  baseUrl: string = environment.REST_API_URL;
  addEditCollaborator;
  constructor(private httpClient: HttpClient) {
    this.addEditCollaborator = {
      'name': null,
      'businessEntity': null,
      'functionName': null
    };
  }
  searchCollaborator(addEditCollaborator: AddEditCollaborator): Observable<any> {
    const data = {'name': addEditCollaborator.name,
      'businessEntity': addEditCollaborator.businessEntity,
      'functionName': addEditCollaborator.functionName};
    return this.httpClient.post(environment.REST_API_MM_STAKEHOLDERS_SEARCH_URL,data);
  }

  addCollaborators(saveCollaborator: any): Observable<any> {
    // debugger;
    console.log('in service');
    return this.httpClient.post(environment.REST_API_MM_STAKEHOLDERS_EDIT_ADD_URL, saveCollaborator);
  }
}
