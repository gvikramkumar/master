import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as _ from 'lodash';
import {environment} from '../../../environments/environment';
import {FsFile} from '../../dfa-common/models/fsfile';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FsFileService {


  constructor(protected httpClient: HttpClient) {
  }

  getInfoMany(metadata): Observable<FsFile[]> {
    return this.httpClient.get<FsFile[]>(`${apiUrl}/api/file/info`, {params: metadata });
  }

  getInfoOne(id: number): Observable<FsFile> {
    return this.httpClient.get<FsFile>(`${apiUrl}/api/file/info/${id}`);
  }


  remove(id: number): Observable<FsFile> {
    return this.httpClient.delete<FsFile>(`${apiUrl}/api/file/${id}`);
  }

  upload(files, metadata = {}): Observable<FsFile> {
    const formData: FormData = new FormData();
    _.forEach(metadata, (val, key) => formData.append(key, val));
    _.forEach(files, file => formData.append('fileUploadField', file, file.name));
    const fdOptions = {headers: {Accept: 'application/json'}};
    return this.httpClient.post<FsFile>(`${apiUrl}/api/file`, formData, fdOptions);
  }



/*
// only need the one, just have them pass in an array

  uploadMany(files: FileList): Observable<FsFile> {
    if (!files || !directory) {
      console.error('files or directory missing');
      return Observable.throw('Files or directory missing');
    }
    const formData: FormData = new FormData();
    formData.append('fileUploadDirectory', directory);
    _.forEach(files, file => formData.append('fileUploadField', file, file.name))
    const fdOptions = {headers: {Accept: 'application/json'}};
    return this.httpClient.post<FsFile>(`${apiUrl}/api/file/multiple`, formData, fdOptions);
  }

  uploadOne(file: File): Observable<FsFile> {
    if (!file || !directory) {
      console.error('files or directory missing');
      return Observable.throw('Files or directory missing, or not a single file');
    }
    const formData: FormData = new FormData();
    formData.append('fileUploadDirectory', directory);
    formData.append('fileUploadField', file, file.name);
    const fdOptions = {headers: {Accept: 'application/json'}};
    return this.httpClient.post<FsFile>(`${apiUrl}/api/file/single`, formData, fdOptions);
  }
*/


}
