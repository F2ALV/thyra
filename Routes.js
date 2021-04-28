import {createDrawerNavigator} from 'react-navigation-drawer';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Series from './src/components/ListadoSeries';
import Login from './src/components/Login';
import DescSerie from './src/components/DescSerie';
import Formulario from './src/components/Formulario';
import Profile from './src/components/Profile';
import CustomDrawerComponent from './src/components/Drawer';
import EditSerie from './src/components/EditSerie';
import Reproductor from './src/components/Reproductor';

const AppNavigator = createStackNavigator(
  {
    Series: {
      screen: Series,
    },
    DescSerie: {
      screen: DescSerie,
    },
    Profile: {
      screen: Profile,
    },
    Formulario: {
      screen: Formulario,
    },
    EditSerie: {
      screen: EditSerie,
    },
    Reproductor: {
      screen: Reproductor,
    },
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

//Creación del Drawer (esqueleto)
const Project = createDrawerNavigator(
  {
    Home: AppNavigator,
  },
  {
    initialRouteName: 'Home',
    contentComponent: CustomDrawerComponent,
    drawerPosition: 'right',
  },
);

const Projecto = createSwitchNavigator(
  {
    Login: Login,
    Drawer: Project,
  },
  {
    initialRouteName: 'Login',
  },
);

export default createAppContainer(Projecto);
