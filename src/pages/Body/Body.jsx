import React, { useEffect, useState } from 'react';
import { sendBackgroundMessage } from '../Content/modules/backgroundMessages';
import './Body.css'
import { getCurrentTabUrl } from '../Background/helpers';
import User from '../User/User';

const fetchUserData = async (url) => {
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

const Body = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect( () => {
    const fetchData = async () => {
      try {
        let url = await getCurrentTabUrl();
        let userData = await fetchUserData(url);

        console.log(userData);
        setData(userData)
      } catch (e) {
        setError(e.message)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  if(loading) return <div style={{ display: 'block', marginTop: '30%' }}> <div className={"wrapper"}> <div className={'spinner'}/> </div> <h3 style={{ color: 'white', marginTop: '5px', marginLeft: '5px' }}>Loading...</h3> </div>

  return (
    <div className={"Body"}>
        <div>
          <h2 style={{color: 'orange'}}>{error ? `Notice: ${error}` : ''}</h2>
        </div>
        {data?.players && !error ? data.players.map(item => {
          let {avatar, nickname, csgo} = item;
          if(!csgo) return;
          let {faceit_elo, skill_level, matches, adr, headshots} = csgo;

          return <User avatar={avatar} nickname={nickname} faceit_elo={faceit_elo} skill_level={skill_level} matches={matches} adr={adr} headshots={headshots}/>
        }) : ""}
    </div>
  )
}

export default Body