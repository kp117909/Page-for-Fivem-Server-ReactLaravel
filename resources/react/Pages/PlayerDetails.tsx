import { Alert, Backdrop, Box, Button, CircularProgress, Container, Divider, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Skeleton, Stack, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { TiUserDelete } from "react-icons/ti";
import { banPlayer, clearInventory, deletePlayer, hasPermission } from "../utils";
import { Header, HeaderSmaller } from "../Components/Header";
import Fingerprint from "@mui/icons-material/Fingerprint";
import BadgeIcon from '@mui/icons-material/Badge';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import WorkIcon from '@mui/icons-material/Work';
import GradeIcon from '@mui/icons-material/Grade';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { GiPistolGun } from "react-icons/gi";
import { GiPoliceOfficerHead } from "react-icons/gi";
import { GiBangingGavel } from "react-icons/gi";
import DateRangeIcon from '@mui/icons-material/DateRange';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { UserContext } from '../UserProvider';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
function PlayerDetails({ playerData, onPlayerCarsClick }) {
    const [identifierValue, setIdentifierValue] = useState('');
    const [identifierValueClear, setIdentifierValueClear] = useState('');
    const [reasonValue, setReasonValue] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [clearError, setClearError] = useState('');
    const [banError, setBanError] = useState('');
    const [reasonError, setReasonError] = useState('');
    const [success, setSuccess] = useState(false);
    const [successBan, setSuccessBan] = useState(false);
    const [successClear, setSuccessClear] = useState(false);
    const [successBanMessage, setSuccessBanMessage] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(true);
    const [valueRadio, setValueRadio] = React.useState('day');
    const [requiredTime, setRequiredTime] = useState(true);
    const userAuthData = useContext(UserContext);

    const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValueRadio((event.target as HTMLInputElement).value);
      if (event.target.value === 'perm') {
        setRequiredTime(false);
        setBanError('');
      } else {
        setRequiredTime(true);
      }
    };

    useEffect(() => {
        if (playerData) {
            setLoading(false); // Ustawiamy stan na false gdy dane zostaną załadowane
        } 
    }, [playerData]);


    const canClearInventory = hasPermission(userAuthData, "clear-inventory");
    const canDeleteCharacter = hasPermission(userAuthData, "character-delete");
    const canBanPlayer = hasPermission(userAuthData, "ban-player");

    const handleChange = (event: SelectChangeEvent) => {
      setTime(event.target.value);
      setBanError('');
    };
    

    const handleDeleteCharacter = async () => {
        if (canDeleteCharacter){
            if (!identifierValue) {
                setDeleteError('To pole jest wymagane');
            } else if (identifierValue !== playerData.identifier) {
                setDeleteError('Wartość w polu tekstowym nie zgadza się z identyfikatorem gracza');
            } else {
                await deletePlayer(playerData.identifier, userAuthData)
                setSuccess(true);
                console.log("Postać została usunięta!");
            }
        }
    };

    const handleClearInventory = async () => {
        if (canClearInventory){
            if (!identifierValueClear) {
                setClearError('To pole jest wymagane');
            } else if (identifierValueClear !== playerData.identifier) {
                setClearError('Wartość w polu tekstowym nie zgadza się z identyfikatorem gracza');
            } else {
                try{
                    const clearData = await clearInventory(playerData.identifier, userAuthData)
                    setSuccessClear(true);
                    console.log("Ekwipunek został wyczyszony!");
                } catch (error){
                    setSuccessClear(false)
                }

            }
        }
    };

    const copyValueToClipboard = (value) => {
        const tempInput = document.createElement("input");
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    };

    const handleBanPlayer = async () => {
        if (canBanPlayer){
            if (!time && requiredTime) {
                setBanError('To pole jest wymagane');
            }
            else if(parseFloat(time) <= 0) {
                setBanError('Czas nie może być mniejszy od zera');
            }
            else if (reasonValue == '' || !reasonValue){
                setReasonError("To pole jest wymagane")
            }
            else {
                try{
                    const identifierWithoutPrefix = playerData.identifier.split(':')[1];
                    const newPrefix = `steam:${identifierWithoutPrefix}`
                    const responseData = await banPlayer(newPrefix, time, reasonValue, playerData.name, valueRadio)
                    playerData = responseData.player;
                    setSuccessBanMessage(responseData.message);
                    setSuccessBan(true);
                    console.log("Postać została zbanowana!");
                }catch(error){
                    setSuccessBan(false)
                    console.log("Wystapił problem podczas banowania", error);
                }

            }
        }
    }

    return (
        <div>
        {loading ? ( // Sprawdzamy czy dane są ładowane
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                onClick={() => {}} // Możesz dodać obsługę kliknięcia, jeśli potrzebujesz
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (playerData && (
                <Container fixed className="container" sx = {{pb:5}}>
                    <Box m = "20px">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Header title="SZCZEGÓŁOWE INFORMACJE" subtitle="" />
                        </Box>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm = {4} md = {4} className = "items">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <HeaderSmaller title="INFORMACJE O GRACZU" icon = {null} />
                        </Box>
                        <Divider sx={{
                            "&::before, &::after": {
                            borderColor: "white",
                            },
                        }}textAlign="center">
                         <span className="text">
                            {playerData.name}
                        {playerData.online === 1 && (
                            <Tooltip title="Online">
                            <OnlinePredictionIcon style={{ color: 'green' }} />
                            </Tooltip>
                        )}
                        {playerData.online === 0 && (
                            <Tooltip title="Offline">
                            <OnlinePredictionIcon style={{ color: 'red' }} />
                            </Tooltip>
                        )}
                        {playerData.online === null && (
                            <Tooltip title="Brak danych">
                            <OnlinePredictionIcon style={{ color: 'grey' }} />
                            </Tooltip>
                        )}
                        </span>
                        </Divider>
                        <p>
                            <Fingerprint/>Hex: <span  className="text">
                            {playerData.identifier}

                            <IconButton size="small" onClick={() => copyValueToClipboard(playerData.identifier)} aria-label="Kopiuj do schowka">
                            <Tooltip title="Skopiuj">
                                <IconButton>
                                    <FileCopyIcon sx={{ color: "#CACDCF"  }} />
                                </IconButton>
                            </Tooltip>
                            </IconButton>

                            </span >
                        </p>
                        <p>
                           <GradeIcon/> SID: <span  className="text">{playerData.special_id}</span>
                        </p>
                        <p>
                           <BadgeIcon/> Nazwa: <span  className="text">{playerData.name}</span>
                        </p>
                        <p>
                            <DriveFileRenameOutlineIcon/> Imię i nazwisko:  <span  className="text">{playerData.firstname} {playerData.lastname}</span>
                        </p>
                        <p><GiPoliceOfficerHead /> Frakcja:  <span  className="text">{playerData.job} </span>| Ranga: <span  className="text">{playerData.job_grade}</span></p>
                        <p><WorkIcon/> Praca:   <span  className="text">{playerData.job2} </span>| Ranga: <span  className="text">{playerData.job2_grade}</span></p>
                        <p><GiPistolGun /> Organizacja:   <span  className="text">{playerData.job3}</span> | Ranga: <span  className="text">{playerData.job3_grade}</span></p>
                        { playerData.isBanned ? (
                            <ToggleButtonGroup
                                color="primary"
                                value={'web'}
                                exclusive
                                aria-label="Platform"
                                >
                                <ToggleButton  value="web">
                                        <GiBangingGavel />  Zbanowany do: <span  className="text white"> {playerData.banExpiration === '1970-01-01 00:00:00' ? `PERMANENTNIE` : playerData.banExpiration }</span>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        ):
                        (
                            <ToggleButtonGroup
                            color="primary"
                            value={'web'}
                            exclusive
                            aria-label="Platform"
                            >
                            <ToggleButton value="web" fullWidth>
                                    <GiBangingGavel /><span  className="text white">Gracz niezbanowany</span>
                            </ToggleButton>
                        </ToggleButtonGroup>
                        )}
                        <Box sx = {{mt:2}}>
                            <ToggleButtonGroup
                                color="primary"
                                value={"currentPlayerCars"}
                                exclusive
                                aria-label="Platform"
                                >
                                <ToggleButton value="currentPlayerCars" onClick={onPlayerCarsClick} >
                                    <DirectionsCarIcon /> <b className="text white">PRZEJDŹ DO LISTY POJAZDÓW GRACZA</b>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                        </Grid>
                        <Grid item xs={0} sm = {1} md = {1}>

                        </Grid>
                        <Grid item xs={12} sm = {7} md = {7} className = "items">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <HeaderSmaller title="OPERACJE OFFLINE" icon = {null} />
                            </Box>
                            <Divider sx={{
                                "&::before, &::after": {
                                borderColor: "white",
                                },
                            }}textAlign="center">
                            <span  className="text">WYCZYŚĆ INVENTORY</span>
                            </Divider>
                            <Grid container>
                                <Grid item xs = {12}>
                                    <TextField
                                        required
                                        size="small"
                                        id="identifierClearInventory"
                                        variant="filled"
                                        fullWidth
                                        label="Przekopiuj Hex aby potwierdzić wyczyszczenie inventory"
                                        sx={{
                                            "& .MuiInputLabel-root": {
                                                color: "#e0e0e0 !important", // Kolor etykiety
                                            },
                                        }}
                                        InputProps={{
                                            style: { color: 'white' },
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <Fingerprint  color="primary"/>
                                              </InputAdornment>
                                            ),
                                          }}

                                        value={identifierValueClear}
                                        onChange={(e) => {
                                            setIdentifierValueClear(e.target.value);
                                            setClearError('');
                                        }}
                                        error={!!clearError}
                                        helperText={clearError}
                                    />

                                    <Button disabled = {canClearInventory ? false : true}fullWidth  sx = {{mt:2}}color="primary" id ="clearInventory" onClick={handleClearInventory} variant="outlined">{<TiUserDelete />} WYCZYŚĆ EKWIPUNEK</Button>
                                </Grid>
                            </Grid>
                            {successClear && (
                                <Alert variant="outlined" sx = {{mt:2}} severity="success">
                                    Ekwipunek został wyczyszczony!
                                </Alert>
                            )}
                            <Divider sx={{
                                "&::before, &::after": {
                                borderColor: "white",
                                },
                            }}textAlign="center">
                            <span  className="text">USUŃ POSTAĆ</span>
                            </Divider>
                            <Grid container>
                                <Grid item xs = {12}>
                                    <TextField
                                        required
                                        size="small"
                                        id="identifierDeleteCharacter"
                                        variant="filled"
                                        fullWidth
                                        label="Przekopiuj Hex aby potwierdzić usunięcie postaci"
                                        sx={{
                                            "& .MuiInputLabel-root": {
                                                color: "#e0e0e0 !important", // Kolor etykiety
                                            },
                                        }}
                                        InputProps={{
                                            style: { color: 'white' },
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <Fingerprint  color="primary"/>
                                              </InputAdornment>
                                            ),
                                          }}

                                        value={identifierValue}
                                        onChange={(e) => {
                                            setIdentifierValue(e.target.value);
                                            setDeleteError('');
                                        }}
                                        error={!!deleteError}
                                        helperText={deleteError}
                                    />

                                    <Button disabled = {canDeleteCharacter ? false : true} fullWidth sx = {{mt:2}} color="primary" id ="deleteCharacter" onClick={handleDeleteCharacter} variant="outlined">{<TiUserDelete />} USUŃ POSTAĆ</Button>
                                </Grid>
                            </Grid>
                            {success && (
                                <Alert variant="outlined" sx = {{mt:2}} severity="success">
                                    Postać została usunięta!
                                </Alert>
                            )}
                            <Divider sx={{
                                "&::before, &::after": {
                                borderColor: "white",
                                },
                            }}textAlign="center">
                                <span  className="text">ZBANUJ GRACZA</span>
                            </Divider>
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField
                                        id="time-field"
                                        required={requiredTime}
                                        label="Czas"
                                        sx={{
                                            "& .MuiInputLabel-root": {
                                                color: "#e0e0e0 !important", // Kolor etykiety
                                            },
                                        }}
                                        InputProps={{
                                            inputProps: { min: 1 },
                                            style: { color: 'white' },
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <DateRangeIcon color="primary" />
                                              </InputAdornment>
                                            ),
                                          }}
                                        variant="filled"
                                        type="number"
                                        fullWidth
                                        onChange={handleChange}
                                        error={!!banError} // Ustawienie błędu dla sekcji Select
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                    <RadioGroup
                                        row
                                        value={valueRadio}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        id = "radioTypeTimeBan"
                                        onChange={handleChangeRadio}
                                    >
                                        <FormControlLabel value="day"  control={<Radio />} label="Dni" />
                                        <FormControlLabel value="hour" control={<Radio />} label="Godziny" />
                                        <FormControlLabel value="perm" control={<Radio />} label="Permamentny" />
                                    </RadioGroup>


                                    <TextField
                                        required
                                        size="small"
                                        fullWidth
                                        id="textFieldBanReason"
                                        label="Powód bana"
                                        sx={{
                                            "& .MuiInputLabel-root": {
                                                color: "#e0e0e0 !important", // Kolor etykiety
                                            },
                                        }}
                                        InputProps={{
                                            style: { color: 'white' },
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <FormatIndentIncreaseIcon color="primary" />
                                              </InputAdornment>
                                            ),
                                          }}
                                        variant="filled"
                                        value={reasonValue}
                                        onChange={(e) => {
                                            setReasonValue(e.target.value);
                                            setReasonError('');
                                        }}
                                        error={!!reasonError}
                                        helperText={reasonError}
                                    />
                                    <Button disabled = {canBanPlayer ? false : true} fullWidth sx = {{mt:2}} color="primary" id ="banPlayer"onClick={handleBanPlayer} variant="outlined">{<GiBangingGavel />} ZBANUJ GRACZA</Button>
                                </Grid>
                            </Grid>
                            {successBan && (
                                <Alert sx = {{mt:2}} variant="outlined" severity="success">
                                   {successBanMessage}
                                </Alert>
                            )}
                        </Grid>
                    </Grid>
                </Container>
                )
            )}
        </div>
    );
}


export default PlayerDetails;
