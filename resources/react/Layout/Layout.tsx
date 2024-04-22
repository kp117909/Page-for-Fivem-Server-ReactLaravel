import React, { useState } from 'react';
import Players from '../Pages/Players';
import WelcomePage from '../Pages/WelcomePage';
import PlayerDetalis from '../Pages/PlayerDetails';
import BanList from '../Pages/BanList';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import BlockIcon from '@mui/icons-material/Block';
import { Paper } from '@mui/material';
import BanHistoryList from '../Pages/BanHistoryList';
import CurrentPlayerCars from '../Pages/CurrentPlayerCars';
function Layout() {

    const [selectedOption, setSelectedOption] = useState('home');
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handlePlayerSelect =  async(player) => {
        setSelectedPlayer(player);
        setSelectedOption('playerDetails');
    };

    const handleChange = (event, newValue) => {
        setSelectedOption(newValue);
    };

  return (
    <>
    <Box sx = {{pb: 5}}>
      <div>
        {selectedOption === 'home' && <WelcomePage onBanHistoryClick={() => handleChange('change', 'banHistoryList')}/>}
        {selectedOption === 'players' && <Players onSelectPlayer={handlePlayerSelect} />}
        {selectedOption === 'playerDetails' && selectedPlayer && (<PlayerDetalis playerData={selectedPlayer} onPlayerCarsClick = {()=>handleChange('change', 'currentPlayerCars')} />)}
        {selectedOption === 'banHistoryList' && <BanHistoryList/>}
        {selectedOption === 'currentPlayerCars' && <CurrentPlayerCars playerData={selectedPlayer}/>}
        {selectedOption === 'bans' && <BanList/>}
      </div>
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        sx = {{ backgroundColor:"#2b2a2a"}}
        showLabels
        value={selectedOption}
        onChange={handleChange}
        className="fixed bottom-0 left-0 w-full"
        >
        <BottomNavigationAction label="Gracze" icon={<PeopleIcon sx={{ color: "#CACDCF"  }} />} value="players" />
        <BottomNavigationAction label="Strona główna" icon={<HomeIcon sx={{ color: "#CACDCF" }} />} value="home" />
        <BottomNavigationAction label="Bany" icon={<BlockIcon sx={{ color: "#CACDCF" }} />} value="bans" />
      </BottomNavigation>
    </Paper>
    </Box>
    </>
  );
}

export default Layout;
