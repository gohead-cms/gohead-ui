import {
  Admin,
  Resource,
  EditGuesser,
} from "react-admin";
import dataProvider from "./dataProviders/dataProvider";
import { authProvider } from "./authProvider";
import CustomLayout from "./layouts/Layout";
import { CollectionList} from "./collections/CollectionsList";
import Dashboard from "./dashboard/Dashboard";

export const App = () => (
  <Admin 
    dataProvider={dataProvider}
    authProvider={authProvider}
    layout={CustomLayout}
    dashboard={Dashboard}
  >
    <Resource name="collections" list={CollectionList} edit={EditGuesser} show={CollectionList} />
  </Admin>
);

export default App;
