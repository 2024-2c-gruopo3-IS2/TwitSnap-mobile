/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/..\components\snapItem` | `/_sitemap` | `/accountStatistics` | `/chat` | `/chatItem` | `/chatItemSearch` | `/chatMessage` | `/chats` | `/confirmPin` | `/customTextInput` | `/favouriteSnapsView` | `/feed` | `/followers` | `/following` | `/forgotPassword` | `/interests` | `/location` | `/login` | `/newChat` | `/notifications` | `/profileCertificationRequest` | `/profileEdit` | `/profileView` | `/search` | `/searchBar` | `/setProfileImagePage` | `/signup` | `/specificChat` | `/tabs` | `/topicDetail` | `/trendingTopics` | `/twitSnapsStatistics` | `/userRegisterData`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
