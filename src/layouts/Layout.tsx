import { Layout, LayoutProps, AppBar } from "react-admin";
import { Box } from "@mui/material";
import MainSidebar from "./MainSidebar";

const CustomLayout = (props: LayoutProps) => (
  <Layout {...props} appBar={CustomAppBar} sidebar={MainSidebar}>
    <Box display="flex" height="100vh">
      {/* Main Content */}
      <Box flex={1} sx={{ overflow: "auto" }}>
        {props.children}
      </Box>
    </Box>
  </Layout>
);

const CustomAppBar = (props: any) => <AppBar {...props} />;

export default CustomLayout;
