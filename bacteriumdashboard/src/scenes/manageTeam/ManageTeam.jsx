import {Box, Typography, useTheme} from "@mui/material";
import Headers from "../../Components/Headers";
import {tokens} from "../../theme";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
//import {mockData} from '../../Components/Assets/data/mockData'; for testing use
import {DataGrid} from "@mui/x-data-grid";


const ManageTeam = () => {

    return (
       <Box margin={"20px"}>


        <Headers title={"Manage Team"}/>


       </Box>
    )
}

export default ManageTeam;