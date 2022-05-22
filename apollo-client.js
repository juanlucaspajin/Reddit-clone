import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://localhost:5001/api/solid-pronghorn",
    headers: {
      Authorization: `Apikey ${process.env.STEPZEN_APIKEY}`
    },
    cache: new InMemoryCache(),
});

export default client;