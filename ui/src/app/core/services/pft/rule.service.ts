import {Injectable} from '@angular/core';
import {GetPostsQuery} from '../../../pft/rule-management/graphql/queries';
import {Observable} from 'rxjs/Observable';
//import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import {Apollo} from 'apollo-angular';
import {DeletePostInterface, RulesInterface} from '../../../pft/rule-management/graphql/schema';
import {AddRuleMutation, RemoveRuleMutation, UpdateRuleMutation} from '../../../pft/rule-management/graphql/mutations';
import {AllocationRule} from '../../../pft/store/models/allocation-rule';
import gql from 'graphql-tag';
import {All} from 'tslint/lib/rules/completedDocsRule';

@Injectable()
export class RuleService {

  constructor(private apollo: Apollo) {
    this.apollo = apollo;
  }

  ruleFragment = gql`
    fragment RuleFragment on User {
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

  getAll(): Observable<AllocationRule[]> {

    const query = gql`
         query getRules {
          getRules {
            ...RuleFragment
          }             
         }  
         ${this.ruleFragment}
      `;

    return this.apollo.query<any>({query})
      .map(result => result.data.rules);
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
      .map(result => result.data.rule);
  }

  addOne(rule) {
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

  updateOne(rule): Observable<AllocationRule> {
    const mutation = gql`
          mutation updateRule($id: ID!, $data: RuleInput) {
            updateRule(id: $id, data: $data) {
          ...RuleFragment
        }
      }
      ${this.ruleFragment}
    `;

    return this.apollo.mutate({mutation, variables: {id: rule.id, data: rule}})
      .map(result => result.data.updateRule);
  }

  deleteOne(id: number): Observable<AllocationRule> {
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
