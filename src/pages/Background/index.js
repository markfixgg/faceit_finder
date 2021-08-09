import { getFirstGroup, promiseRequest } from './helpers';
import { steamApiKey } from './secrets.steam';

const getSteamId = async ({ url }) => {
  if(!url) return {success: false, error: 'Url not passed!'}
  url += '/'

  if(!url.includes('profiles') && !url.includes('id')) return { success: false, error: 'Not valid url!' }

  // If link contains steamID
  if(url.includes('profiles')) {
    let steamid = getFirstGroup(/profiles\/(.*?)\//gm, url)[0];

    return { success: true, steamid }
  }

  // If custom steam link
  if (url.includes('id')) {
    let vanity = getFirstGroup(/id\/(.*?)\//gm, url)[0];

    let response = await promiseRequest(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamApiKey}&vanityurl=${vanity}`, {method: 'GET'})
    if(response.response.success) return { success: true, steamid: response.response.steamid }

    return { success: false, error: 'Steamid not found!' }
  }
}

const getSteamInfo = async ({ steamid }) => {
  if(!steamid) return{ success: false, error: 'Missing steamid.' }
  let response = await promiseRequest(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamid}`, {method: "GET"})

  if(response?.response?.players.length <= 0) return {success: false, error: "Profile in steam not found."}
  return response?.response?.players[0]
}

const getFaceItProfiles = async ({ steamid }) => {
  if(!steamid) return { success: false, error: 'SteamId not found in url.' }

  let response = await promiseRequest(`https://api.faceit.com/search/v1/?limit=3&query=${steamid}`, {method: "GET"});
  if(response?.payload?.players?.results.length <= 0) return { success: false, error: "Users not found!" }

  return { success: true, profiles: response.payload.players.results, steamid}
}

const getFaceItInfo = async ({nickname}) => {
  if(!nickname) return {success: false, error: "Username not provided!"}

  let response = await promiseRequest(`https://api.faceit.com/core/v1/nicknames/${nickname}`, {method: "GET", headers: {'faceit-referer': 'new-frontend', 'Referer': 'https://api.faceit.com/proxy.html'}})
  let {result, payload} = response;

  if(result !== 'ok') return {success: false, error: "User not found!"}
  if(!payload.games.csgo) return {success: false, error: "No csgo information!"}

  let csgoInfo = await promiseRequest(`https://api.faceit.com/stats/v1/stats/users/${payload.guid}/games/csgo`, {method: "GET", headers: {'faceit-referer': 'new-frontend', 'Referer': 'https://api.faceit.com/proxy.html'}})
  let csgo = {...payload.games.csgo, matches: csgoInfo.lifetime.rev, adr: csgoInfo.lifetime.k5, headshots: csgoInfo.lifetime.k8};

  return {success: true, csgo}
}

const getFaceItProfilesInfo = async ({ profiles, steamid }) => {
  if(!profiles) return {success: false, error: "Empty profiles list."};
  if(!steamid) return {success: false, error: "Missing user steamID."};

  let players = await Promise.all(
    profiles.map(async profile => {
      let {nickname} = profile;
      let faceitInfo = await getFaceItInfo({ nickname });
      let steamInfo = await getSteamInfo({ steamid });

      return {...faceitInfo, avatar: steamInfo.avatarfull, nickname}
    })
  )

  return players;
}



chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  switch (request.type) {
    case 'GET_STEAMID':
      getSteamId(request.body).then(response => sendResponse(response))
      break;

    case 'FACEIT_GET_PROFILES':
      getFaceItProfiles(request.body).then(response => sendResponse(response))
      break;

    case 'FACEIT_GET_PROFILES_INFO':
      getFaceItProfilesInfo(request.body).then(response => sendResponse(response))
      break;

    case 'GET_STEAM_INFO':
      getSteamInfo(request.body).then(response => sendResponse(response))
      break;
  }
  return true;
})