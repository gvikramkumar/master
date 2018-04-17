import {Injectable} from '@angular/core';
import {GetPostsQuery} from './graphql/queries';
import {Observable} from 'rxjs/Observable';
//import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import {Apollo} from 'apollo-angular';
import {DeletePostInterface, RulesInterface} from './graphql/schema';
import {RemoveRuleMutation} from './graphql/mutations';

@Injectable()
export class RulesService {
    //private posts: ApolloQueryObservable<PostsInterface>;
    //private posts: QueryRef<RulesInterface>;
    private posts: Observable<any[]>;
    private apollo: Apollo;

    constructor(apollo: Apollo) {
        this.apollo = apollo;
    }

    //get(): ApolloQueryObservable<PostsInterface> {
    //get(): QueryRef<RulesInterface> {
    get(): Observable<any[]> {
        // Query posts data with observable variables
        this.posts = this.apollo.watchQuery<RulesInterface>({
            query: GetPostsQuery,
        })
            // Return only posts, not the whole ApolloQueryResult
            //.map(result => result.data.posts) as any;
            .valueChanges.map(result => result.data.rules) as any;
        return this.posts;
    }
    delete(id: string): Promise<any> {
        // Call the mutation called deletePost
        return new Promise((resolve, reject) => {
            this.apollo.mutate<DeletePostInterface>({
                mutation: RemoveRuleMutation,
                variables: {
                    "id": id
                },
            })
                .take(1)
                .subscribe({
                    next: ({ data }) => {
                        console.log('delete post', data.removePost);
                        // update data
                        resolve({
                            success: true,
                            message: `Post #${id} deleted successfully  `
                        });
                    },
                    error: (errors) => {
                        console.log('there was an error sending the query', errors);
                        reject({
                            success: false,
                            message: errors
                        })
                    }
                });
        });
    }


}
