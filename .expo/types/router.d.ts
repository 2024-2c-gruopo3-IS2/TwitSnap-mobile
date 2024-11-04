/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/confirmPin` | `/favouriteSnapsView` | `/feed` | `/followers` | `/following` | `/forgotPassword` | `/interests` | `/location` | `/login` | `/notifications` | `/profileEdit` | `/profileView` | `/search` | `/setProfileImagePage` | `/signup` | `/tabs` | `/topicDetail` | `/trendingTopics` | `/userRegisterData`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
