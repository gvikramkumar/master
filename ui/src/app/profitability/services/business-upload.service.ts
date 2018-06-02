import { Injectable } from '@angular/core';
import {FsFile} from '../../store/models/fsfile';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import * as _ from 'lodash';
import {BusinessUploadFileType} from '../store/models/enums';

const apiUrl = environment.apiUrl;

const uploadTypeUrl = [
  {type: 'du', url: 'pft/dollar-upload'},
  {type: 'iaspu', url: ''},
  {type: 'slspu', url: ''},
  {type: 'mm', url: 'pft/mapping-upload'},
  {type: 'pcu', url: ''}
];

export interface BuUploadMetadata {
  directory: string,
  buFileType: string,
  buUploadType: string
}

@Injectable()
export class BusinessUploadService {

  constructor(private httpClient: HttpClient) { }

  upload(file, metadata: BuUploadMetadata): Observable<FsFile> {
    const formData: FormData = new FormData();
    _.forEach(metadata, (val, key) => formData.append(key, val));
    formData.append('fileUploadField', file, file.name);
    const options = {headers: {Accept: 'application/json'}};
    const url = _.find(uploadTypeUrl, {type: metadata.buUploadType}).url;
    return this.httpClient.post<FsFile>(`${apiUrl}/api/${url}/upload`, formData, options);
  }

}
