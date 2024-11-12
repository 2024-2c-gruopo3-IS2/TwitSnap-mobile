/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/..\functions\markMessagesAsRead` | `/_sitemap` | `/chat` | `/chatItem` | `/chatItemSearch` | `/chatMessage` | `/chats` | `/confirmPin` | `/customTextInput` | `/favouriteSnapsView` | `/feed` | `/followers` | `/following` | `/forgotPassword` | `/interests` | `/location` | `/login` | `/newChat` | `/notifications` | `/profileEdit` | `/profileView` | `/search` | `/searchBar` | `/setProfileImagePage` | `/signup` | `/specificChat` | `/tabs` | `/topicDetail` | `/trendingTopics` | `/userRegisterData`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
