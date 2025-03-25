import {Box, Button, Typography, useTheme} from "@mui/material";
import Headers from "../../Components/Headers";
import {tokens} from "../../theme";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import { mockDataTeam } from "../../data/mockData";
import {DataGrid} from "@mui/x-data-grid";


const ManageTeam = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        {
            field: "id", headerName:"ID",
        },
        {
            field: "fullName", 
            headerName: "FullName",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "role",
            headerName: "Role",
            flex: 1,
            // renderCell: ({row: {access}}) => {
            //     return (<Box>
            //         <Button>

            //         </Button>
            //     </Box>);
            // }
        },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            renderCell: ({row: {action}}) => {
                return (<Box>
                    <Button color="secondary">
                        Remove User
                    </Button>
                </Box>);
            }
        }
    ];

    return (
        <Box margin={"20px"}>
            <Headers title={"Manage Team"}/>
            <Box m="40px 0 0 0"
            height={"75vh"}
            sx={
                {
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }
            }
            >
                <DataGrid checkboxSelection rows={mockDataTeam} columns={columns}/>
            </Box>
       </Box>
    );
}

export default ManageTeam;