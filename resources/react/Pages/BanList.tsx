
import { Alert, Backdrop, Box, Button, CircularProgress, IconButton, InputBase, Paper, Tooltip} from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { unBanPlayer, getBanList, hasPermission } from '../utils';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import { Header } from "../Components/Header";
import DeleteIcon from '@mui/icons-material/Delete';
import { tokens } from "../theme";
import { MDBBadge } from "mdb-react-ui-kit";
import { GiPalmTree } from "react-icons/gi";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { UserContext } from '../UserProvider';
const colors = tokens('dark');


function BanList() {
    const [bans, setBans] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [successUnBan, setSuccessUnBan] = useState(false);
    const [unBanField, SetUnBanField] = useState('');
    const resultsWithIds = searchResult.map((result, index) => ({ ...result, id: index + 1 }));
    const [loading, setLoading] = useState(false);
    const userAuthData = useContext(UserContext);

    const canDeleteBan = hasPermission(userAuthData, "ban-delete");

    const fetchBanList = async () => {
        setLoading(true);
        try {
            const banList = await getBanList(); // Zakładam, że masz funkcję getBanList do pobierania listy banów
            const transformedBans = banList.map((ban, index) => ({
                id: index + 1,
                steamHex: ban.identifier || 'Nieznane',
                name: ban.targetplayername || 'Nieznane',
                reason: ban.reason || 'Nieznane',
                byWho: ban.sourceplayername || 'Nieznane',
                givenWhen: ban.created_at || 'Nieznane',
                givenTo: ban.expiration || 'Nieznane',
                remove: 'Zdejmij',
            }));
            setBans(transformedBans);
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania listy banów:', error);
        } finally {
            setLoading(false); // Ustaw flagę ładowania na false po zakończeniu ładowania danych (zarówno w przypadku sukcesu, jak i błędu)
        }
    };

    useEffect(() => {
        fetchBanList();
    }, []);

    useEffect(() => {
        const results = bans.filter(ban =>
            ban.steamHex.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ban.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ban.byWho.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ban.reason.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResult(results);
    }, [searchTerm, bans]);


    const deletePlayerBan = async (identifier) => {
        if (canDeleteBan){
            try {
                await unBanPlayer(identifier, userAuthData); // Wywołaj funkcję unBanPlayer z utils
                const updatedBanList = await getBanList();
                const transformedBans = updatedBanList.map((ban,index) => ({
                    id: index + 1,
                    steamHex: ban.identifier || 'Nieznane',
                    name: ban.targetplayername || 'Nieznane',
                    reason: ban.reason || 'Nieznane',
                    byWho: ban.sourceplayername || 'Nieznane',
                    givenWhen: ban.created_at || 'Nieznane',
                    givenTo: ban.expiration || 'Nieznane',
                    remove: 'Zdejmij', // Tutaj możesz ustawić odpowiedni tekst dla opcji zdejmowania bana
                }));
                setBans(transformedBans);
                setSuccessUnBan(true);
                SetUnBanField(identifier);
            } catch (error) {
                setSuccessUnBan(false);
                console.log("Wystąpił błąd podczas odbanowywania gracza:", error);
            }
        }
    }

    // Definiujesz funkcję do kopiowania wartości do schowka
    const copyValueToClipboard = (value) => {
        const tempInput = document.createElement("input");
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    };

    // Definiujesz funkcję renderującą komórkę z przyciskiem kopiowania
    const columns=[
        { field: 'id', headerName: 'ID', width: 10 },
        {
          field: 'steamHex',
          headerName: 'Steam:HEX',
          width: 225,

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
          width: 150,
          sortable: true,
        },
        {
          field: 'reason',
          headerName: 'Powód',
          width: 350,
          renderCell: ({ row}) => {
            const reason = row.reason;
            return (
            <Box>
                <IconButton size="small" onClick={() => copyValueToClipboard(reason)} aria-label="Kopiuj do schowka">
                <Tooltip title="Skopiuj">
                    <IconButton>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                </IconButton>
                {reason}
            </Box>
            );
          },
          sortable: true,
        },
        {
          field: 'byWho',
          headerName: 'Nadany przez',
          renderCell: ({ row}) => {
            const byWho = row.byWho;
            return (
            <Box>
                <IconButton size="small" onClick={() => copyValueToClipboard(byWho)} aria-label="Kopiuj do schowka">
                <Tooltip title="Skopiuj">
                    <IconButton>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                </IconButton>
                {byWho}
            </Box>
            );
          },
          width: 200,
          sortable: true,
        },
        {
          field: 'givenWhen',
          headerName: 'Nadany kiedy',
          renderCell: ({ row }) => {
            const givenWhen = row.givenWhen;
            return (
            <MDBBadge color='secondary'>
               {givenWhen}
            </MDBBadge>
            );
            },
          width: 160,
          sortable: true,
        },
        {
          field: 'givenTo',
          headerName: 'Nadany do',
          renderCell: ({ row }) => {
            const givenTo = row.givenTo;
            return (
            <MDBBadge color='danger'>
               {givenTo}
            </MDBBadge>
            );
            },
          width: 160,
          sortable: true,
        },
        {
          field: 'remove',
          headerName: 'Usuń',
          renderCell: ({ row }) => {
            const steamHex = row.steamHex;
            return (
                <Button disabled = {canDeleteBan ? false : true}size = "small" color="primary" onClick={() => deletePlayerBan(steamHex)} variant="contained">
                    {<DeleteIcon />}
                </Button>
            );
        },
          width: 110,
        },
      ];

    const updateBanList = (updatedBanList) => {
        setBans(updatedBanList)
    }

    return (
        <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="BANROOM" subtitle="Bany nadane przez administratorów" />
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
                    placeholder="Wyszukaj Bana"
                    inputProps={{ 'aria-label': 'Wyszukaj Bana' }}
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
                {successUnBan && (
                        <Alert variant="outlined" severity="success" sx = {{mt:2}}>
                            Gracz o identifykatorze: <MDBBadge color = 'success'>{unBanField}</MDBBadge> został odbanowany!
                        </Alert>
                    )}
                </Box>
        </Box>
    );
}

export default BanList;
