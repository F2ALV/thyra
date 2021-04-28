//Importamos React con sus componentes y la navegación + servicio
import React, {useContext, useState, useEffect} from 'react';
import {NavigationContext} from 'react-navigation';
import * as service from '../services/asyncService';
import axios from 'axios';

//Importamos componentes de React
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Picker,
} from 'react-native';

//Importamos componentes externos
import Entypo from 'react-native-vector-icons/Entypo'; //Iconos
import Icon from 'react-native-vector-icons/MaterialIcons'; //Iconos
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'; //Iconos
import AppContext from './Context'; //Contexto
import Dialog from 'react-native-dialog'; //Dialogs

//Importamos idiomas
import esp from '../languajes/esp';
import eus from '../languajes/eus';
import eng from '../languajes/eng';

//Importamos funcionalidades de Google & AsyncStorage
import {GoogleSignin} from 'react-native-google-signin';
import AsyncStorage from '@react-native-community/async-storage';

//Funciones y renderización de componente
function Drawer() {
  //Importa componentes externos
  const context = useContext(AppContext);
  const navigation = useContext(NavigationContext);

  //Crea los estados necesarios
  const [userInfo, setInfo] = useState(null);
  const [salPls, setsalPls] = useState(false);
  const [changeLang, setLang] = useState(false);
  const [Spinner, setSpinner] = useState(false);

  //Recuperar información de usuario
  useEffect(
    () => {
      service
        .getDataFromAsyncStorage('infoUser')
        .then(res => {
          const infoUserr = JSON.parse(res);
          setInfo({
            name: null,
            email: null,
            photo: infoUserr.user.photo,
            bio: null,
          });
          getAxios(infoUserr);
        })
        .catch(err => {
          console.log(err);
        });
    },[]);

  //Recuperar series de un usuario determinado
  async function getAxios(infoUserr) {
    axios
      .get(
        `http://thyra.aegcloud.pro/public/api/users/${infoUserr.user.email}`,
      )
      .then(response => {
        setInfo({
          name: response.data.name,
          photo: response.data.photo
        });
      })
      .catch(function(error) {
        console.warn(error);
      });
  }

  //Función cerrar sesión y vuelta al Login
  async function signOut() {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setInfo(null);
      context.gImageHandler(null);
      clearData();
      setSpinner(false);
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  }

  //Función borrar asyncStorage
  async function clearData() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error(error);
    }
  }

  //Renderizacion del componente si hay información del usuario
  if (userInfo != null) {
    return (
      <>
        <View style={styles.mainContainer}>
          {/*Apartado de avatar*/}
          <View style={styles.photoContainer}>
            <Image style={styles.avatar} source={context.gImage == null ? {uri : userInfo.photo} : {uri : context.gImage} } />
          </View>

          {/*Apartado de nombre*/}
          <View style={styles.nameContainer}>
            <Text style={styles.username}> {context.gName == null ? userInfo.name : context.gName } </Text>
          </View>

          {/*Apartados de navegación en Drawer*/}
          <View style={styles.contentContainer}>
            <View style={styles.home}>
              <TouchableOpacity onPress={() => navigation.navigate('Series')}>
                <Icon
                  name="home"
                  color="#fff"
                  size={27}
                  style={{padding: 10, marginLeft: 15}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Series')}>
                <Text style={styles.text}> {context.language.drawerHome} </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.home}>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Icon
                  name="person"
                  color="#fff"
                  size={27}
                  style={{padding: 10, marginLeft: 15}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.text}>
                  {context.language.drawerProfile}
                </Text>
              </TouchableOpacity>
            </View>

            {/*Cambios de idioma*/}
            <View style={styles.home}>
              <TouchableOpacity
                onPress={() => {
                  setLang(true);
                }}>
                <Entypo
                  name="language"
                  color="#fff"
                  size={25}
                  style={{padding: 10, marginLeft: 17}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setLang(true);
                }}>
                <Text style={styles.text}>
                  {' '}
                  {context.language.drawerChangeLang}{' '}
                </Text>
              </TouchableOpacity>
            </View>

            {/*Apartado de cerrar sesión*/}
            <View style={[styles.home, {marginTop: 320}]}>
              <TouchableOpacity onPress={() => setsalPls(true)}>
                <SimpleLineIcons
                  name="logout"
                  color="#fff"
                  size={25}
                  style={{padding: 10, marginLeft: 15}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setsalPls(true)}>
                <Text style={styles.text}>
                  {' '}
                  {context.language.drawerPogOut}{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/*Dialogo de cambio de idioma*/}
          <Dialog.Container visible={changeLang}>
            <Dialog.Title>{context.language.drawerSelectLang}</Dialog.Title>

            {/*Seleccionar idioma*/}
            <Picker
              selectedValue={context.language}
              style={{height: 50, width: 200}}
              onValueChange={(itemValue, itemIndex) =>
                context.languageHandler(itemValue)
              }>
              <Picker.Item label="English" value={eng} />
              <Picker.Item label="Español" value={esp} />
              <Picker.Item label="Euskera" value={eus} />
            </Picker>

            <Dialog.Button
              label={context.language.drawerAccept}
              onPress={() => {
                setLang(false);
              }}
            />
            <Dialog.Button
              label={context.language.drawerCancel}
              onPress={() => {
                setLang(false);
              }}
            />
          </Dialog.Container>

          <Dialog.Container visible={Spinner}>
            <ActivityIndicator size="large" color="#45454d" />
          </Dialog.Container>

          <Dialog.Container visible={salPls}>
            <Dialog.Title>{context.language.sureLogOut}</Dialog.Title>

            <Dialog.Button
              label={context.language.seriesListYes}
              onPress={() => {
                signOut();
                setsalPls(false);
                setSpinner(true);
              }}
            />
            <Dialog.Button
              label={context.language.seriesListNo}
              onPress={() => {
                setsalPls(false);
              }}
            />
          </Dialog.Container>
        </View>
      </>
    );
  } else {
    //Si no ha recuperado información, aparece spinner
    return (
      <>
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="#45454d" />
        </View>
      </>
    );
  }
}

//Exporta componente
export default Drawer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#707070',
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  photoContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  home: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 17,
    marginTop: 12,
    fontFamily: 'sans-serif-light',
    color: '#fff',
  },
  username: {
    fontSize: 20,
    marginBottom: -30,
    fontFamily: 'sans-serif-light',
    textDecorationLine: 'underline',
    textShadowColor: 'grey',
    letterSpacing: 1,
    color: '#fff',
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  spinner2: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
});
