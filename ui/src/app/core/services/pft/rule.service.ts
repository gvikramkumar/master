import {Injectable} from '@angular/core';
import {GetPostsQuery} from '../../../pft/rule-management/graphql/queries';
import {Observable} from 'rxjs/Observable';
//import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import {Apollo} from 'apollo-angular';
import {DeletePostInterface, RulesInterface} from '../../../pft/rule-management/graphql/schema';
import {AddRuleMutation, RemoveRuleMutation, UpdateRuleMutation} from '../../../pft/rule-management/graphql/mutations';

@Injectable()
export class RuleService {
    //private posts: ApolloQueryObservable<PostsInterface>;
    //private posts: QueryRef<RulesInterface>;
    private posts: Observable<any[]>;
    private apollo: Apollo;

    constructor(apollo: Apollo) {
        this.apollo = apollo;
    }

    getAll(): Observable<any[]> {
        // Query posts data with observable variables
        return this.apollo.query<RulesInterface>({
            query: GetPostsQuery,
        })
          .map(result => result.data.rules) as any;
    }

  add(rule) {
    return this.apollo.mutate({
      mutation: AddRuleMutation,
      variables: {
        "data": rule,
      },
    })
      .map(result => result.data.addRule);
  }

  edit(rule) {
    return this.apollo.mutate({
      mutation: UpdateRuleMutation,
      variables: {
        "id": rule.id,
        "data": rule
      },
    })
      .map(result => result.data.updateRule);
  }

}
