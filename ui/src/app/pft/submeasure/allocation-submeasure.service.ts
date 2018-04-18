import { Injectable } from '@angular/core';
import { IPost } from './allocation-submeasure.interface';
import { GetPostsQuery } from './graphql/queries';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
//import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { Apollo, QueryRef } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { DeletePostInterface, UpdatePostInterface, SubmeasureInterface } from './graphql/schema';
import { RemovePostMutation, UpdatePostMutation } from './graphql/mutations';

@Injectable()
export class SubmeasureService {
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
        this.posts = this.apollo.watchQuery<SubmeasureInterface>({
            query: GetPostsQuery,
        })
            // Return only posts, not the whole ApolloQueryResult
            //.map(result => result.data.posts) as any;
            .valueChanges.map(result => result.data.submeasures) as any;
        return this.posts;
    }
    delete(id: string): Promise<any> {
        // Call the mutation called deletePost
        return new Promise((resolve, reject) => {
            this.apollo.mutate<DeletePostInterface>({
                mutation: RemovePostMutation,
                variables: {
                    "id": id
                },
            })
                .take(1)
                .subscribe({
                    next: ({ data }) => {
                        resolve({
                            success: true,
                            message: `Post #${id} deleted successfully  `
                        });
                    },
                    error: (errors) => {
                        reject({
                            success: false,
                            message: errors
                        })
                    }
                });
        });
    }


}
