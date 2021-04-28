//Importamos React
import React, {useContext, useState, useEffect} from 'react';
import {NavigationContext, NavigationEvents} from 'react-navigation';
import {SwipeListView} from 'react-native-swipe-list-view';

//Importamos componentes necesarios
import {View, StyleSheet, ActivityIndicator} from 'react-native';

import Dialog from 'react-native-dialog';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import axios from 'axios';
import Interfaz from './Interfaz';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Series from './Series';
import * as service from '../services/asyncService';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppContext from './Context';

//Empieza la app
function ListadoSeries() {
  // Importamos componentes externos
  const context = useContext(AppContext);
  const navigation = useContext(NavigationContext);
  
  // Creamos variables
  const [listSeries, setlistSeries] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [IDSerie, setIDSerie] = useState(null);
  const [Spinner, setSpinner] = useState(false);

  //Realiza acciones antes de cargar la pantalla
  useEffect(() => {
    service
      .getDataFromAsyncStorage('infoUser')
      .then(res => {
        const infoUser = JSON.parse(res);
        setUserEmail(infoUser.user.email);
        getAxios(infoUser);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // Obtiene los datos de las series
  async function getAxios(infoUser) {
    axios
      .get(
        `http://thyra.aegcloud.pro/public/api/users/${infoUser.user.email}/series`,
      )
      .then(response => {
        console.log(infoUser.user.email)
        console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
        console.log(response.data)
        setlistSeries(response.data);
        setLoaded(true);
      })
      .catch(function(error) {
        console.warn(error);
      });
  }
  // Elimina una serie
  async function deleteItem(id) {
    axios
      .delete(
        `http://thyra.aegcloud.pro/public/api/users/${userEmail}/series/${id}`,
      )
      .then(res => {
        console.log('PACOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO')
        console.log(res)
        let result = listSeries.filter(item => item.id != id);
        setlistSeries(result);
        setSpinner(false);
        setIDSerie(null);
      })
      .catch(err => {
        alert(context.language.DeleteErr);
        console.log(err);
        setSpinner(false);
      });
  }

  //Abre pantalal de confirmacion para borrar una serie
  async function ddialogVisible(id) {
    setDialogVisible(true);
    setIDSerie(id);
  }

  // Renderiza datos
  function renderagain() {
    service
      .getDataFromAsyncStorage('infoUser')
      .then(res => {
        const infoUser = JSON.parse(res);
        getAxios(infoUser);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Si se recibieron los datos - muestra pantalla
  // Si no se recibieron - pantalla de carga
  if (loaded) {
    return (
      <>
        <View style={styles.Splash}>
          <View style={styles.Interfaz}>
            <Interfaz />
          </View>
          <NavigationEvents onDidFocus={payload => renderagain()} />
          <View style={styles.Lista}>
            {/* Muestra la lista de series */}
            <SwipeListView
              data={listSeries}
              renderItem={({item}) => (
                <Series
                  Id={item.id}
                  Titulo={item.title}
                  Descripcion={item.description}
                  Imagen={item.coverPage}
                />
              )}
              renderHiddenItem={({item}) => (
                <View style={styles.rowBack}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('EditSerie', {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        coverPage: item.coverPage,
                      })
                    }>
                    <SimpleLineIcons
                      name="pencil"
                      color="#000"
                      size={25}
                      style={{padding: 10, marginLeft: -8}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      ddialogVisible(item.id);
                    }}>
                    <SimpleLineIcons
                      name="trash"
                      color="#000"
                      size={25}
                      style={{padding: 10, marginLeft: 10}}
                    />
                  </TouchableOpacity>

                  {/* Pantalla de confirmacion - eliminar serie */}
                  <Dialog.Container visible={dialogVisible}>
                    <Dialog.Title>
                      {context.language.seriesListDelete}
                    </Dialog.Title>
                    <Dialog.Button
                      label={context.language.seriesListYes}
                      onPress={() => {
                        deleteItem(IDSerie);
                        setSpinner(true);
                        setDialogVisible(false);
                      }}
                    />
                    <Dialog.Button
                      label={context.language.seriesListNo}
                      onPress={() => {
                        setDialogVisible(false);
                      }}
                    />
                  </Dialog.Container>
                </View>
              )}
              leftOpenValue={100}
              disableLeftSwipe={true}
            />
          </View>

          <Dialog.Container visible={Spinner}>
            <ActivityIndicator size="large" color="#45454d" />
          </Dialog.Container>

          {/* Boton flotante - ir a Formulario crear serie */}
          <ActionButton
            buttonColor="#45454d"
            onPress={() => navigation.navigate('Formulario')}
            renderIcon={active =>
              active ? (
                <Icon name="add" size={25} style={{color: '#fff'}} />
              ) : (
                <Icon name="add" size={25} style={{color: '#fff'}} />
              )
            }
          />
        </View>
      </>
    );
  } else {
    return (
      <View style={styles.spinner}>
        <ActivityIndicator size="large" color="#45454d" />
      </View>
    );
  }
}

export default ListadoSeries;

const styles = StyleSheet.create({
  /* Splash */
  Splash: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: '#fff1e9',
  },
  Lista: {
    flex: 50,
    marginTop: 55,
  },
  Interfaz: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff1e9',
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
});
