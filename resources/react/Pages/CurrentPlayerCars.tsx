
import {Alert, Backdrop, Box, Button, Checkbox, CircularProgress, Container, Divider, FormControlLabel, Grid, IconButton, InputAdornment, InputBase, Paper, TextField, Tooltip} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {deleteVehicle, getPlayerVehicles, hasPermission, storeVehicle } from '../utils';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from "../theme";
import { MDBBadge } from "mdb-react-ui-kit";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Header, HeaderSmaller } from "../Components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import { UserContext } from '../UserProvider';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddCommentIcon from '@mui/icons-material/AddComment';
const colors = tokens('dark');

function CurrentPlayerCars(playerData) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const resultsWithIds = searchResult.map((result, index) => ({ ...result, id: index + 1 }));
    const [plateError, setPlateError] = useState('');
    const [modelError, setModelError] = useState('');
    const [successStore, setSuccessStore] = useState({show:false, message: "none"});
    const [loading, setLoading] = useState(false);
    const [playerVehicles, setPlayerVehicles] = useState([]);
    const [succesDeleteVehicle, setSuccessDeleteVehicle] = useState({ type: false, plate: "none" });
    const [plateValue, setPlateValue] = useState('');
    const [isDonator, setIsDonator] = useState(false);
    const [modelValue, setModelValue] = useState('');
    const userAuthData = useContext(UserContext);
    const canDeleteVehicle = hasPermission(userAuthData, "vehicle-delete");
    const canStoreVehicle = hasPermission(userAuthData, "vehicle-store");
    const fetchVehicleList = async () => {
        setLoading(true);     
        try {
            const playerVehiclesData = await getPlayerVehicles(playerData);
            const transformedVehicles = playerVehiclesData.map((vehicle, index) => ({
                id: index + 1,
                model: vehicle.model || 'Nieznane',
                plate: vehicle.plate || 'Nieznane',
                stored: vehicle.stored.toString() || 'Nieznane',
                isdonator: vehicle.isdonator.toString() || 'Nieznane',
                shared: vehicle.shared || 'Brak współwaściciela',
                remove: 'Usuń samochód',
            }));
            setPlayerVehicles(transformedVehicles);
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania listy pojazdów:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteVehicleHandler = async (plate) =>{
        if (canDeleteVehicle){
            if (plate) {
                const deleteData = await deleteVehicle(plate, userAuthData)
                if (deleteData){
                    setSuccessDeleteVehicle({ type: true, plate: plate });
                    fetchVehicleList()
                    console.log("Samochód został usunięty!");
                }else{
                    console.log("Wystąpił błąd");
                }
            }
        }
    };

    useEffect(() => {
        fetchVehicleList();
    }, []);

    useEffect(() => {
        if (playerData) {
            setLoading(false);
        } 
    }, [playerData]);

    useEffect(() => {
        const results = playerVehicles.filter(vehicle =>
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.shared.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResult(results);
    }, [searchTerm, playerVehicles]);

    // Definiujesz funkcję do kopiowania wartości do schowka
    const copyValueToClipboard = (value) => {
        const tempInput = document.createElement("input");
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    };

    const handleStoreVehicle = async () => {
        if (canStoreVehicle){
            if (!modelValue) {
                setModelError('To pole jest wymagane');
            } else if (!plateValue) {
                setPlateError('To pole jest wymagane');
            } else {
                try{
                    const storeVehicleRequest = await storeVehicle(playerData.playerData.identifier, modelValue, plateValue, isDonator, userAuthData)
                    console.log(storeVehicleRequest)
                    setSuccessStore({show: true, message: storeVehicleRequest.message});
                    if(storeVehicleRequest.type){
                        fetchVehicleList()
                    }
                } catch (error){
                    setSuccessStore({show : true, message: error})
                }
            }
        }
    };

    // Definiujesz funkcję renderującą komórkę z przyciskiem kopiowania
    const columns=[
        { field: 'id', headerName: 'ID', width: 10 },
        {
          field: 'model',
          headerName: 'Model',
          flex: 1,

          renderCell: ({ row}) => {
            const model = row.model;
            return (
            <Box>
               <IconButton size="small" onClick={() => copyValueToClipboard(model)} aria-label="Kopiuj do schowka">
                <Tooltip title="Skopiuj">
                    <IconButton>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                </IconButton>
                <MDBBadge color='primary'>
                    {model}
                </MDBBadge>
            </Box>
            );
          },
          sortable: true,
        },
        {
          field: 'plate',
          headerName: 'Rejestracja',

          renderCell: ({ row}) => {
            const plate = row.plate;
            return (
            <Box>
                <IconButton size="small" onClick={() => copyValueToClipboard(plate)} aria-label="Kopiuj do schowka">
                <Tooltip title="Skopiuj">
                    <IconButton>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                </IconButton>
                {plate}
            </Box>
            );
          },
          flex: 1,
          sortable: true,
        },
        {
          field: 'isdonator',
          headerName: 'Donatorskie',
          flex: 1,
          renderCell: ({ row}) => {
            let donatorField = "";
            if(row.isdonator == "1"){
                donatorField = "Tak"
            }else{
                donatorField = "Nie"
            }
            return (
            <Box>
                {donatorField}
            </Box>
            );
          },
          sortable: true,
        },
        {
          field: 'stored',
          headerName: 'Miejsce Przechowania',
          flex: 1,
          renderCell: ({row}) => {
            let storedField = "";
            if (row.stored == "0"){
                storedField = "Odcholownik";
            }else if (row.stored == "1"){
                storedField = "Garaż";
            }else if(row.stored == "2"){
                storedField = "Parking Policyjny";
            }
            
            return (
            <Box>
                {storedField}
            </Box>
            );
          },
          width: 200,
          sortable: true,
        },
        {
          field: 'shared',
          headerName: 'Wspówłasciciel',
          renderCell: ({ row }) => {
            const shared = row.shared;
            return (
            <MDBBadge color='secondary'>
               {shared}
            </MDBBadge>
            );
            },
        flex: 1,
          sortable: true,
        },
        {
            field: 'remove',
            headerName: 'Usuń',
            renderCell: ({ row }) => {
              const plate = row.plate;
              return (
                  <Button disabled = {canDeleteVehicle ? false : true}size = "small" color="primary" onClick={() => deleteVehicleHandler(plate)} variant="contained">
                      {<DeleteIcon />}
                  </Button>
              );
          },
             flex: 1,
          },
      ];


    return (
            <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="POJAZDY GRACZA" subtitle="Lista pojazdów gracza" />
            </Box>
            <Grid container className = "carContainer">   
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <HeaderSmaller title="DODAJ SAMOCHÓD" icon = ""/>
                </Box>    
                <Grid item xs={12} sm = {12} md = {12} className = "items" container spacing={2}>
                    <Grid item xs={12} sm = {12} md = {4}>
                        <TextField
                            required
                            size="small"
                            id="identifierModel"
                            variant="filled"
                            fullWidth
                            value = {modelValue}
                            label="Model"
                            onChange={(e) => {
                                setModelValue(e.target.value);
                                setModelError('');
                            }}
                            error={!!modelError}
                            helperText={modelError}
                            sx={{
                                "& .MuiInputLabel-root": {
                                    color: "#e0e0e0 !important", // Kolor etykiety
                                },
                            }}
                            InputProps={{
                                style: { color: 'white' },
                                startAdornment: (
                                <InputAdornment position="start">
                                    <DirectionsCarIcon  color="primary"/>
                                </InputAdornment>
                                ),
                            }}

                        />
                    </Grid>
                    <Grid item xs={12} sm = {12} md = {4}>
                        <TextField
                            required
                            size="small"
                            id="identifierPlate"
                            variant="filled"
                            fullWidth
                            label="Rejestracja"
                            value={plateValue}
                            onChange={(e) => {
                                setPlateValue(e.target.value);
                                setPlateError('');
                            }}
                            error={!!plateError}
                            helperText={plateError}
                            sx={{
                                "& .MuiInputLabel-root": {
                                    color: "#e0e0e0 !important", // Kolor etykiety
                                },
                            }}
                            InputProps={{
                                style: { color: 'white' },
                                startAdornment: (
                                <InputAdornment position="start">
                                    <AddCommentIcon  color="primary"/>
                                </InputAdornment>
                                ),
                            }}

                        />
                    </Grid>
                    <Grid item xs={6} sm = {6} md = {1}>
                    <FormControlLabel
                        sx={{ mt: 1 }}
                        control={
                            <Checkbox
                                checked={isDonator}
                                onChange={(e) => {
                                    setIsDonator(e.target.checked);
                                }}
                            />
                        }
                        label="DONATOR"
                    />
                    </Grid>
                    <Grid item xs={6} sm = {6} md = {3}>
                        <Button disabled = {canStoreVehicle ? false : true} fullWidth sx={{mt:1}} onClick = {handleStoreVehicle} color="primary" id ="vehicleStore" variant="outlined">{<AddCircleIcon />}DODAJ SAMOCHÓD</Button>
                    </Grid>
                </Grid>
                {successStore.show && (
                    <Alert variant="outlined" sx = {{mt:2, ml:2}} severity = 'info' >
                       {successStore.message || "Wstąpił błąd!"}
                    </Alert>
                )}
            </Grid>
                 <Box display="flex" justifyContent="space-between" alignItems="center">
                    <HeaderSmaller title="LISTA POJAZDÓW" icon = ""/>
                </Box> 
                <Paper
                component="form"
                    sx={{ p: '2px 4px', mb:1, display: 'flex', alignItems: 'center'}}
                    >
                    <IconButton sx={{ p: '10px' }} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Wyszukaj Pojazd"
                        inputProps={{ 'aria-label': 'Wyszukaj Pojazd' }}
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

                        disableRowSelectionOnClick
                    />
                        {succesDeleteVehicle.type && (
                            <Alert variant="outlined" severity="success" sx = {{mt:2}}>
                                Pojazd o rejestracji: <MDBBadge color = 'success'>{succesDeleteVehicle.plate}</MDBBadge> został usuniety!
                            </Alert>
                        )}
                    </Box>
            </Box>
    );
}

export default CurrentPlayerCars;
