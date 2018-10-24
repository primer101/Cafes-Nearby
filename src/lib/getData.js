import QueryString from "query-string";

const CLIENT_ID = "";
const CLIENT_SECRET = "";
const VERSION = 20180323;

export function getData(endPoint, parameters) {
  const params = QueryString.stringify(parameters);
  return fetch(
    `${endPoint}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERSION}&${params}`
  ).then(response => response.json());
}
