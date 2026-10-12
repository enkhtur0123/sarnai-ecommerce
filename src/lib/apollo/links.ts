import { ApolloLink, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_ERXES_ENDPOINT ?? "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  return {
    headers: {
      ...headers,
      "client-auth-token": token ?? "",
      "x-app-token": process.env.NEXT_PUBLIC_ERXES_CP_TOKEN ?? "",
      "erxes-pos-token": process.env.NEXT_PUBLIC_POS_TOKEN ?? "",
    },
  };
});

// Injects clientPortalId into every cp* operation so callers don't pass it.
const cmsLink = new ApolloLink((operation, forward) => {
  const { operationName, variables } = operation;
  if (operationName?.startsWith("cp") && variables && !variables.clientPortalId) {
    operation.variables = {
      ...variables,
      clientPortalId: process.env.NEXT_PUBLIC_ERXES_CP_TOKEN ?? "",
    };
  }
  return forward(operation);
});

export const link = ApolloLink.from([authLink, cmsLink, httpLink]);
