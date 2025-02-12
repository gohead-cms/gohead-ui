import { DashboardMenuItem, Menu } from "react-admin";
import { Box } from "@mui/material";
import BookIcon from "@mui/icons-material/LibraryBooks";

const MainSidebar = () => (
  <Menu color="textSecondary">
    <DashboardMenuItem />
    <Box>
      <Menu.Item to="/collections" primaryText="Collections" leftIcon={<BookIcon />} />
    </Box>
  </Menu>
);

export default MainSidebar;
