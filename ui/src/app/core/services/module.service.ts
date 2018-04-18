import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs/Observable';
import {Store} from '../../store/store';

@Injectable()
export class ModuleService {

  constructor(private store: Store, private apollo: Apollo) {
  }

  moduleFragment = gql`
    fragment ModuleFragment on Module {
      id
      name
  }
  `;

  getModules = gql`
         query GetModules {
          modules {
            ...ModuleFragment
          }             
         }  
         ${this.moduleFragment}
      `;

  getAll(): Observable<any[]> {

    return this.apollo.query<any>({query: this.getModules})
      .map(result => {
        this.store.modules = result.data.modules;
        return result.data.modules;
      })
  }

}
