import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

/** Anonymous client for server components (CMS reads). */
export function getServerApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri:
        process.env.ERXES_ENDPOINT ??
        process.env.NEXT_PUBLIC_ERXES_ENDPOINT ??
        "/graphql",
      headers: {
        "x-app-token": process.env.NEXT_PUBLIC_ERXES_CP_TOKEN ?? "",
        "erxes-pos-token": process.env.NEXT_PUBLIC_POS_TOKEN ?? "",
      },
    }),
    cache: new InMemoryCache(),
  });
}
