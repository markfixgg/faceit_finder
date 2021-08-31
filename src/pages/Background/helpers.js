import { sendBackgroundMessage } from '../Content/modules/backgroundMessages';

export async function promiseRequest (url, {method, headers, body, auth}) {
  // Ассинхронная обертка для fetch, которая возвращает json
  let params = {
    method,
    headers: {
      ...headers,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36"
    },
    credentials: "include"
  }

  if(body) params.body = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    fetch(url, params)
      .then(response => response.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  })
}

export async function getCurrentTabUrl () {
  return new Promise((resolve, reject) => chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => resolve(tabs[0].url) ) )
}

export async function fetchUserData (url) {
  if(!url.includes('profiles/') && !url.includes('id/')) throw Error(`Open steam profile page.`);

  let result = {};
  let steamidRequest = await sendBackgroundMessage({type: "GET_STEAMID", body: {url}});
  if(steamidRequest.error) throw Error(steamidRequest.error);
  result = { ...result, steamid: steamidRequest.steamid}

  let profiles = await sendBackgroundMessage({type: "FACEIT_GET_PROFILES", body: {...steamidRequest}})
  if(profiles.error) throw Error(profiles.error);

  let players = await sendBackgroundMessage({type: "FACEIT_GET_PROFILES_INFO", body: {...profiles}})
  if(players.error) throw Error(players.error)
  result = {...result, players}

  return result
}

export function getFirstGroup(regexp, str) {
  // Получить первую группу из регулярки
  const array = [...str.matchAll(regexp)];
  return array.map(m => m[1]);
}

export function getElementByXpath(path) {
  // Достать елемент со страницы
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}