import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Apollo} from 'apollo-angular';
import {AllocationRule} from '../../../pft/store/models/allocation-rule';
import gql from 'graphql-tag';
import * as _ from 'lodash';

@Injectable()
export class RuleService {

  constructor(private apollo: Apollo) {
    this.apollo = apollo;
  }

  ruleFragment = gql`
    fragment RuleFragment on Rule {
      id
      name
      period
      driverName
      salesMatch
      productMatch
      scmsMatch
      legalEntityMatch
      beMatch
      sl1Select
      scmsSelect
      beSelect
      createdBy
      createdDate
      updatedBy
      updatedDate
  }
  `;

  getMany(): Observable<AllocationRule[]> {

    const query = gql`
         query getRules {
          getRules {
            ...RuleFragment
          }             
         }  
         ${this.ruleFragment}
      `;

    return this.apollo.query<any>({query})
      .map(result => result.data.getRules);
  }

  getOne(id: number): Observable<AllocationRule> {

    const query = gql`
      query getRule($id: ID!) {
        getRule(id: $id) {
          ...RuleFragment
        }             
      }  
      ${this.ruleFragment}
    `;

    return this.apollo.query<any>({query, variables: {id}})
      .map(result => _.cloneDeep(result.data.getRule));
  }

  add(rule) {
    const mutation = gql`
      mutation addRule($data: RuleInput!) {
        addRule(data: $data) {
          ...RuleFragment
        }
      }
      ${this.ruleFragment}
    `;

    return this.apollo.mutate({mutation, variables: {data: rule}})
      .map(result => result.data.addRule);
  }

  update(rule): Observable<AllocationRule> {
    const mutation = gql`
          mutation updateRule($id: ID!, $data: RuleInput) {
            updateRule(id: $id, data: $data) {
          ...RuleFragment
        }
      }
      ${this.ruleFragment}
    `;
    const id = rule.id;
    delete rule.id; // RuleInput has no id property
    return this.apollo.mutate({
      mutation,
      variables: {id: rule.id, updatedDate: rule.updatedDate, data: rule}})
      .map(result => result.data.updateRule);
  }

  remove(id: number): Observable<AllocationRule> {
    const mutation = gql`
      mutation removeRule($id: ID!) {
          removeRule(id: $id) {
            ...RuleFragment
          }
      }
      ${this.ruleFragment}
    `;
    return this.apollo.mutate({mutation, variables: {id}})
      .map(result => result.data.removeRule);

  }
}
