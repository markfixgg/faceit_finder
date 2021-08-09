import React from 'react';
import './User.css';
import levels from '../../assets/levels/levels'

const User = ({avatar, nickname, skill_level, faceit_elo, matches, adr, headshots}) => {
  const openFaceIt = (e) => {
    e.preventDefault();
    chrome.tabs.create({url: `https://www.faceit.com/en/players/${nickname}`});
  }

  return (
    <div className={"user"}>
      <div className={"container"}>

        <div className={"image__container"}>
          <span className={"helper"}/>
          <img src={avatar} height={75}/>
        </div>

        <div className={"information"}>
          <div>
            <a onClick={openFaceIt}><h2>{nickname}</h2></a>
          </div>

          {/*

                */}

          <div style={{display: 'flex'}}>
            <div style={{display: 'block'}}>

              <div style={{display: 'flex', justifyContent: 'space-between'}}>

                <div style={{display: 'block'}} className={"firstrow"}>
                  <div className={"information__item"}>
                    <span style={{marginTop: '6px'}}>Level:  </span>
                    <img src={levels[skill_level-1]} height={28}/>
                  </div>

                  <div style={{marginTop: '5px'}} className={"information__item"}>
                    <span>Matches: {matches}</span>
                  </div>
                </div>

                <div style={{ marginLeft: '25px', display: 'block'}} className={"secondrow"}>
                  <div style={{paddingTop: '5px'}} className={"information__item"}>
                    <span>ELO: {faceit_elo}</span>
                  </div>
                  <div style={{paddingTop: '9px'}} className={"information__item"}>
                    <span>KD: {adr}</span>
                  </div>
                </div>

              </div>





            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default User