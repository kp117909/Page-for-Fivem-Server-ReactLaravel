import React, { useEffect, useState } from "react";
import { getPlayers, getPlayer } from '../utils';
import { MDBBadge } from 'mdb-react-ui-kit';
import { GiPalmTree } from "react-icons/gi";
import {Backdrop, Box, Button, CircularProgress, Divider, IconButton, InputBase, Paper, Tooltip, styled } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { tokens } from "../theme";
import { Header } from "../Components/Header";
import { DataGrid } from "@mui/x-data-grid";
const colors = tokens('dark');


const Players = ({ onSelectPlayer }) => {
    const [players, setPlayers] = useState([]); // Stan do przechowywania wszystkich danych graczy
    const [searchTerm, setSearchTerm] = useState(''); // Stan dla wprowadzonego terminu wyszukiwania
    const [searchResults, setSearchResults] = useState([]); // Stan do przechowywania wyników wyszukiwania
    const resultsWithIds = searchResults.map((result, index) => ({ ...result, id: index + 1 }));
    const [loading, setLoading] = useState(false);

    const handlePlayerClick = async (steamHex) => {
        setLoading(true)
        try {
            const currentPlayer = await getPlayer(steamHex)
            onSelectPlayer(currentPlayer);
        } catch (error){
            console.log("Wystąpił problem przy pobieraniu danych gracza", error)
        } finally {
            setLoading(false)
        }

    };

    const fetchPlayersList = async() => {
        setLoading(true)
        try {
           const playerList = await getPlayers();
           const transformedPlayers = playerList.map((player,index) => ({
            id: index + 1,
            steamHex: player.identifier || 'Nieznane',
            name: player.name || 'Nieznane',
            names: player.firstname +' '+ player.lastname  || 'Nieznane',
            remove: 'Profil',
          }));
          setPlayers(transformedPlayers);
        } catch (error){
            console.log("Wystąpił problem podczas pobierania listy graczy", error)
        } finally {
            setLoading(false)
        }
    };

    useEffect(()=>{
        fetchPlayersList();
    }, [])

    useEffect(() => {
        const results = players.filter(player =>
            player.steamHex.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.names.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
    }, [searchTerm, players]);


    const copyValueToClipboard = (value) => {
        const tempInput = document.createElement("input");
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    };


    const columns=[
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'steamHex',
          headerName: 'Steam:HEX',
          width: 350,

          renderCell: ({ row}) => {
            const steamHex = row.steamHex;
            return (
            <Box>
               <IconButton size="small" onClick={() => copyValueToClipboard(steamHex)} aria-label="Kopiuj do schowka">
                <Tooltip title="Skopiuj">
                    <IconButton>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                </IconButton>
                <MDBBadge color='primary'>
                    {steamHex}
                </MDBBadge>
            </Box>
            );
          },
          sortable: true,
        },
        {
          field: 'name',
          headerName: 'Nazwa',

          renderCell: ({ row}) => {
            const name = row.name;
            return (
            <Box>
                <IconButton size="small" onClick={() => copyValueToClipboard(name)} aria-label="Kopiuj do schowka">
                <Tooltip title="Skopiuj">
                    <IconButton>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                </IconButton>
                {name}
            </Box>
            );
          },
          width: 300,
          sortable: true,
        },
        {
          field: 'names',
          headerName: 'Imie Nazwisko',
          width: 400,
          renderCell: ({ row}) => {
            const names = row.names;
            return (
            <Box>
                <IconButton size="small" onClick={() => copyValueToClipboard(names)} aria-label="Kopiuj do schowka">
                <Tooltip title="Skopiuj">
                    <IconButton>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                </IconButton>
                {names}
            </Box>
            );
          },
          sortable: true,
        },
        {
            field: 'profil',
            headerName: 'Profil',
            renderCell: ({ row }) => {
              const steamHex = row.steamHex;
              return (
                  <Button size = "small" color="primary" onClick={() => handlePlayerClick(steamHex)} variant="contained" component="span">
                      {<AccountBoxIcon />}
                  </Button>
              );
          },
        }
      ];


    return (
        <Box m = "20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="LISTA GRACZY" subtitle="Spis graczy serwerowych" />
            </Box>
            <Paper
            component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'}}
                >
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Wyszukaj Gracza"
                    inputProps={{ 'aria-label': 'Wyszukaj Gracza' }}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>

            <Box
             m="8px 0 0 0"

                sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                    borderBottomWidth: 0,
                },
                "& .name-column--cell": {
                    color: colors.grey[100],
                },
                "& .MuiDataGrid-topContainer": {
                    backgroundColor: colors.blueAccent[50],
                    borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: colors.grey[100],
                    minHeight:100,
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.primary[50],
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                },
                "& .MuiCheckbox-root": {
                    color: `${colors.grey[500]} !important`,
                },
                }}>
                 <Backdrop
                    sx={{ color: colors.blueAccent[50], zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading} // Widoczność Backdrop jest sterowana przez flagę ładowania
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <DataGrid
                    rows={resultsWithIds}
                    getRowId={(row) => row.id}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 5,
                        },
                    },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
                </Box>
        </Box>

    );
}

export default Players

