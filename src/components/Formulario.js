//Importamos React
import React, {useContext, useState, useEffect, useCallback} from 'react';
import AppContext from './Context';
import {NavigationContext} from 'react-navigation';
import {uploadImage} from '../services/uploadImage';
import * as service from '../services/asyncService';

//Importamos componentes necesarios
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Interfaz from './Interfaz';
import axios from 'axios';
import Dialog from 'react-native-dialog';

function Formulario() {
  //importamos componentes externos
  const context = useContext(AppContext);
  const navigation = useContext(NavigationContext);

  //creamos las variables
  const [Portada, setPortada] = useState(null);
  const [Loaded, Loading] = useState(false);
  const [NameSerie, setName] = useState(null);
  const [DescSerie, setDesc] = useState(null);
  const [userInfo, setInfo] = useState(null);
  const [Subido, setSubido] = useState(false);
  const [Confirmar, setConfirmar] = useState(false);
  const [Spinner, setSpinner] = useState(false);

  useEffect(() => {
    service
      .getDataFromAsyncStorage('infoUser')
      .then(res => {
        const infoUser = JSON.parse(res);
        setInfo(infoUser);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  //Elige una foto y la guarda en una variable
  function handleChoosePhoto() {
    const options = {
      noData: true,
      mediaType: 'photo',
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.uri) {
        setPortada(response);
      }
    });
  }

  async function imageUp(path) {
    await uploadImage(path)
      .then(res => {
        crearSerie({
          title: NameSerie,
          description: DescSerie,
          coverPage: res,
          fk_users: userInfo.user.email,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  function crearSerie(Serie) {
    axios
      .post(
        `http://thyra.aegcloud.pro/public/api/users/${Serie.fk_users}/series`,
        {Serie},
      )
      .then(res => {
        console.log('RES POST');
        console.log(res);
        setSpinner(false);
        setSubido(true);
        alert(context.language.formUploaded);
        navigation.navigate('Series');
      });
  }

  return (
    <View style={styles.Splash}>
      <View style={styles.Interfaz}>
        <Interfaz />
      </View>
      <View style={styles.mainContainer}>
        <ScrollView>
          <View style={styles.contentContainer}>
            {/*El usuario escribe el nombre del episodio*/}
            <View style={styles.NameContainer}>
              <Text style={styles.Textos}>{context.language.formName}</Text>
              <ScrollView>
                <TextInput
                  style={{height: 50}}
                  placeholder={context.language.formName}
                  multiline={true}
                  maxLength={100}
                  textAlignVertical="top"
                  onChangeText={NameValue => setName(NameValue)}
                />
              </ScrollView>
            </View>
            {/*El usuario escribe la descripcion del episodio*/}
            <View style={styles.DescContainer}>
              <Text style={styles.Textos}>{context.language.formDesc}</Text>
              <ScrollView>
                <TextInput
                  style={{height: 150}}
                  placeholder="Inserte aqui la descripcion de la serie"
                  multiline={true}
                  maxLength={1180}
                  numberOfLines={4}
                  textAlignVertical="top"
                  onChangeText={DescValue => setDesc(DescValue)}
                />
              </ScrollView>
            </View>
            {/*El usuario elige una imagen para que sirva de portada*/}
            <View style={styles.imageContainer}>
              <View style={{flex: 1, marginTop: 10}}>
                <Text style={styles.Textos}>
                  {context.language.formCoverPage}
                </Text>
                <Text />
                <View>
                  <Button
                    color="#707070"
                    title={context.language.formPhoto}
                    onPress={() => 
                      handleChoosePhoto()
                    }
                  />
                </View>
              </View>
              {/* Una vez elegida la imagen, muestra la imagen que eligio */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'black',
                  marginTop: 10,
                  height: 200,
                }}>
                {Portada && (
                  <Image
                    style={{width: '100%', height: '100%'}}
                    source={{uri: Portada.uri}}
                  />
                )}
                {Loaded && <ActivityIndicator size="large" color="#45454d" />}
              </View>
            </View>
            {/* Si ya se pusieron todos los datos, sube la serie */}
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: '100%',
                height: '90%',
                padding: 20,
              }}>
              {NameSerie != null &&
                NameSerie.trim() != '' &&
                DescSerie != null &&
                DescSerie.trim() != '' &&
                Portada != null && (Subido ? (
                  navigation.navigate('Series')
                ) : (
                  <Button
                    title={context.language.formButton}
                    color="#707070"
                    onPress={() => {
                      setConfirmar(true);
                    }}
                  />
                ))}
            </View>
          </View>
        </ScrollView>
      </View>

     
      {/* Pantalla de confirmacion pa subir la serie */}
      <Dialog.Container visible={Confirmar}>
        <Dialog.Title>{context.language.formConfirm}</Dialog.Title>
        <Dialog.Description>
          {context.language.formTitle} {NameSerie}
        </Dialog.Description>
        <Dialog.Description>
          {context.language.formDesc}{' '}
          {DescSerie ? DescSerie : 'No hay descripcion'}
        </Dialog.Description>

        <Dialog.Button
          label={context.language.formYes}
          onPress={() => {
            setConfirmar(false);
            setSpinner(true);
            imageUp(Portada.path);
          }}
        />
        <Dialog.Button
          label={context.language.formNo}
          onPress={() => {
            setConfirmar(false);
          }}
        />
      </Dialog.Container>

      <Dialog.Container visible={Spinner}>
          <ActivityIndicator size="large" color="#45454d" />
      </Dialog.Container>
    </View>
  );
}

export default Formulario;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  NameContainer: {
    flex: 1,
    height: 100,
    width: '100%',
  },
  DescContainer: {
    flex: 1,
    height: 150,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    height: '90%',
    width: '100%',
    padding: 10,
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'column',
    height: '55%',
    width: '97%',
    backgroundColor: '#fff',
  },
  Textos: {
    fontSize: 23,
    fontFamily: 'sans-serif-light',
    textDecorationLine: 'underline',
    textShadowColor: 'grey',
    textAlign: 'center',
  },
  Splash: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  Interfaz: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxHeight: 55,
  },
});
