import { Container, Box, Grid, colors, ToggleButton, ToggleButtonGroup, Backdrop, CircularProgress, Typography, useTheme, IconButton, InputBase, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Header, HeaderSmaller } from "../Components/Header";
import { tokens } from "../theme";
import StatBox from "../Components/StatBox";
import HistoryIcon from '@mui/icons-material/History';
import TimelineIcon from '@mui/icons-material/Timeline';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CodeIcon from '@mui/icons-material/Code';
import CopyrightIcon from '@mui/icons-material/Copyright';
import { getHistoryBanList, getUsers } from "../utils";
import { DataGrid } from "@mui/x-data-grid";

function WelcomePage({onBanHistoryClick}) {
    const colors = tokens('dark');
    const [historyBanList, setHistoryBanList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const usersWithId = searchResult.map((result, index) => ({ ...result, id: index + 1 }));
    const handleOptionChange = (event, newOption) => {
      setSelectedOption(newOption);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const banHistoryList = await getHistoryBanList();
            setHistoryBanList(banHistoryList);
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania listy banów:', error);
        } finally {
            setLoading(false);
        }

        setLoading(true);
        try {
            const userList = await getUsers(); // Zakładam, że masz funkcję getBanList do pobierania listy banów
            const transformedUsers = userList.map((user, index) => ({
                id: index + 1,
                name: user.name || 'Nieznane',
                access: user.roles && user.roles.length > 0 ? user.roles[0].name : 'Brak Roli',
                discordId: user.discord_id
            }));
            setUsers(transformedUsers);
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania listy banów:', error);
        } finally {
            setLoading(false); // Ustaw flagę ładowania na false po zakończeniu ładowania danych (zarówno w przypadku sukcesu, jak i błędu)
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const results = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.discordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.access.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResult(results);
    }, [searchTerm, users]);


    const columns = [
        { field: "id", headerName: "Id", width: 10,cellClassName: "name-column--cell" },
        {
        field: "name",
        headerName: "Nazwa",
        flex: 1,
        cellClassName: "name-column--cell",
        },
        { field: "discordId", headerName: "Discord ID", flex: 1,cellClassName: "name-column--cell",},
        {
        field: "access",
        headerName: "Rola",
        flex: 1,
        cellClassName: "name-column--cell",
        renderCell: ({ row: { access } }) => {
            return (
            <Box
                width="100%"
                display="flex"
                justifyContent="center"
                sx = {{
                    width:"100%",
                    mt:1,
                    p:"5px",
                    bgcolor: access === "admin" ? colors.blueAccent[700] :
                        access === "dev" ? colors.primary[400] :
                        access === "owner" ? colors.primary[800] :
                        colors.blueAccent[500],
                    borderRadius:"4px"
                }}
            >
                {access === "owner" && <CopyrightIcon  sx={{ color: "#CACDCF" }}/>}
                {access === "dev" && <CodeIcon  sx={{ color: "#CACDCF" }} />}
                {access === "admin" && <AdminPanelSettingsOutlinedIcon  sx={{ color: "#CACDCF" }} />}
                {access === "support" && <SecurityOutlinedIcon sx={{ color: "white" }} />}
                <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                {access}
                </Typography>
            </Box>
            );
        },
        },
    ];
    return (
        <div>
            <Backdrop
                sx={{ color: colors.blueAccent[50], zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading} // Widoczność Backdrop jest sterowana przez flagę ładowania
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box m = "20px">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="DASHBOARD" subtitle="MAJORKA ROLEPLAY" />
                </Box>
            </Box>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} sm={12} md={12} lg={5} xl={5}>
                    <Container fixed className="container">
                        <Box sx = {{ml:5}}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <HeaderSmaller title="HISTORIA BANÓW" icon= {<TimelineIcon/>}/>
                            </Box>
                        </Box>
                    </Container>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={5} xl={5}>
                    <Container fixed className="container">
                        <Box sx = {{ml:15}}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <HeaderSmaller title="ADMINISTRATORZY STRONY" icon= {<AdminPanelSettingsOutlinedIcon/>}/>
                            </Box>
                        </Box>
                    </Container>
                </Grid>
            </Grid>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12} sm={12} md={12} lg={5} xl={5}>
                    {historyBanList.slice(0, 3).map((historyItem, index) => (
                        <Grid key = {index} sx = {{pr:5, pl:5 , pt:2}}>
                            <Box
                                width="100%"
                                display="flex"
                                sx = {{backgroundColor: '#2e2d2d'}}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <StatBox
                                reason={historyItem.reason}
                                admin={historyItem.sourceplayername}
                                player={historyItem.targetplayername}
                                timeat= {historyItem.created_at}
                                expired= {historyItem.expiration}
                                icon={
                                    <HistoryIcon
                                    sx={{ color: colors.blueAccent[50], fontSize: "26px" }}
                                    />
                                }
                                />
                            </Box>
                        </Grid>
                    ))}
                    <Container fixed className="container" sx= {{pb:5}}>
                        <Box sx = {{ml:10, mt:2}}>
                            <ToggleButtonGroup
                                color="primary"
                                value={"banHistoryList"}
                                exclusive
                                aria-label="Platform"
                                onChange={handleOptionChange}
                                >
                                <ToggleButton value="banHistoryList" onClick={onBanHistoryClick}>
                                    <TimelineIcon /> <b className="text white"> PRZEJDŹ DO PEŁNEJ HISTORII BANÓW</b>
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>
                    </Container>
                </Grid>
                <Grid item xs={0} sm={0} md={0} lg={1} xl={1}>

                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                    <Grid sx = {{pr:5, pb:5, pl:5}}>
                    <Paper
                    component="form"
                        sx={{ p: '2px 4px', mb:1, display: 'flex', alignItems: 'center'}}
                        >
                        <IconButton sx={{ p: '10px' }} aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Wyszukaj Użytkownika"
                            inputProps={{ 'aria-label': 'Wyszukaj Użytkownika' }}
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
                                    backgroundColor: colors.primary[50],
                                    border: "none",
                                },
                                "& .MuiDataGrid-cell": {
                                    color: colors.grey[50],
                                },
                                "& .name-column--cell": {
                                    border: "none",
                                    color: "white",
                                    fontWeight : "bolder",
                                },
                                "& .MuiDataGrid-columnHeader": {
                                    borderBottom: "none",
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                    backgroundColor: colors.grey[50],
                                    minHeight:100,
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    borderTop: "none",
                                    borderBottomLeftRadius: 5,
                                    borderBottomRightRadius: 5,
                                },
                                "& .MuiCheckbox-root": {
                                    backgroundColor: colors.blueAccent[50],
                                    color: `'white' !important`,
                                },

                            }}
                        >
                        <DataGrid
                            rows={usersWithId}
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
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default WelcomePage;
