import QueryString from "query-string";

const CLIENT_ID = "QG31EMCKZGDYWCLP4KRSO2H2H33HMTIZLOKM14INHODFYDAH";
const CLIENT_SECRET = "WDILMOL2YHU00BEUCBKFBRGIPUX5XMTNPUPTGDFVUMU502Z1";
const VERSION = 20180323;

export function getData(endPoint, parameters) {
  const params = QueryString.stringify(parameters);
  return fetch(
    `${endPoint}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${VERSION}&${params}`
  ).then(response => response.json());
}
