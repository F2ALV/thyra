//Importamos React
import React, {useContext, useState, useEffect} from 'react';
import {NavigationContext, NavigationEvents} from 'react-navigation';
import * as service from '../services/asyncService';
import axios from 'axios';

//Importamos desde react las Views, Texts y los estilos
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';

import AppContext from './Context'; //Contexto

function Interfaz() {
  // Importamos los componentes externos
  const context = useContext(AppContext);
  const navigation = useContext(NavigationContext);

  // Creamos las variables
  const [userInfo, setInfo] = useState(null);

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
          photo: response.data.photo
        });
      })
      .catch(function(error) {
        console.warn(error);
      });
  }

  // Si se detecta un log in - carga la interfaz
  // en caso contrario - pantalla de carga
  if (userInfo != null) {
    return (
      <>
        {/*Contenedor principal*/}
        <View style={styles.mainContainer}>
          {/*Cabecera*/}
          <View style={styles.headerContainer}>
            {/*Texto Thyra*/}
            <View style={styles.thyraText}>
              <Text style={styles.logo}>Thyra</Text>
            </View>
            <NavigationEvents onDidFocus={payload => renderagain()} />
            {/*Search y mas opciones*/}
            <View style={styles.rightHeaderContainer}>
              <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                <Image style={styles.avatar} source={context.gImage == null ? {uri : userInfo.photo} : {uri : context.gImage} } />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </>
    );
  } else {
    return (
      <View style={styles.spinner}>
        <ActivityIndicator size="small" color="#45454d" />
      </View>
    );
  }
}

export default Interfaz;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#707070',
    alignItems: 'center',
    width: 413,
    marginLeft: -206,
    position: 'absolute',
  },
  rightHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 55,
  },
  thyraText: {
    flexDirection: 'row',
    marginLeft: '38%',
  },
  logo: {
    color: '#fff',
    fontSize: 40,
    fontFamily: 'GretaGrotesk',
    marginLeft: 10,
  },
  avatar: {
    borderRadius: 30,
    width: 50,
    height: 50,
    marginRight: 8,
    marginBottom: 2.5,
  },
  spinner: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
  },
});
