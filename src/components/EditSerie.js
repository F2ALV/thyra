//Importamos React
import React, {useContext, useState, useEffect} from 'react';
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
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import Interfaz from './Interfaz';

import Dialog from 'react-native-dialog';
import AppContext from './Context';
import ListadoEps from './ListadoEps';

function EditSerie() {
  // importa componentes externos
  const navigation = useContext(NavigationContext);
  const context = useContext(AppContext);
  const id = navigation.getParam('id', 'id');
  const title = navigation.getParam('title', 'title');
  const description = navigation.getParam('description', 'description');
  const coverPage = navigation.getParam('coverPage', 'coverPage');

  // Crea las variables
  const [Episodios, setEpisodios] = useState(null);
  const [Portada, setPortada] = useState(null);
  const [NameSerie, setName] = useState(null);
  const [DescSerie, setDesc] = useState(null);
  const [Subido, setSubido] = useState(false);
  const [Confirmar, setConfirmar] = useState(false);
  const [ddialogVisible, setDdialogVisible] = useState(false);
  const [idEp, setidEp] = useState(false);
  const [userInfo, setInfo] = useState(null);
  const [Spinner, setSpinner] = useState(false);

  // realiza las acciones antes de que la pantalla cargue
  useEffect(() => {
    axios
      .get(`http://thyra.aegcloud.pro/public/api/serie/${id}/episode`)
      .then(response => {
        setEpisodios(response.data);
      })
      .catch(function(error) {
        console.warn(error);
      });

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

  // Envia una peticion al servidor para borrar un episodio
  async function deleteItem(idEp) {
    axios
      .delete(
        `http://thyra.aegcloud.pro/public/api/serie/${id}/episode/${idEp}`,
      )
      .then(res => {
        let result = Episodios.filter(item => item.id != idEp);
        setEpisodios(result);
        setidEp(null);
        setSpinner(false);
        alert('Episodio borrado correctamente');
      });
  }

  // Pasa componentes al componente hijo
  async function dddialogVisible(id) {
    setDdialogVisible(true);
    setidEp(id);
  }

  // Elige una foto y la prepata para subir
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

  //sube la imagen
  async function imageUp(path) {
    await uploadImage(path)
      .then(res => {
        updateSerie({
          title:
            NameSerie == null || NameSerie.trim() == '' ? title : NameSerie,
          description:
            DescSerie == null || DescSerie.trim() == ''
              ? description
              : DescSerie,
          coverPage: res,
          id: id,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  //envia una peticion al servidor para actualizar la serie
  function updateSerie(Serie) {
    console.log(Serie.id);
    console.log(Serie);
    axios
      .patch(
        `http://thyra.aegcloud.pro/public/api/users/${userInfo.user.email}/series/${Serie.id}`,
        Serie,
      )
      .then(res => {
        console.log(res);
        setSubido(true);
        setSpinner(false);
        alert(context.language.editDialogUploaded);
      });
  }

  return (
    <View style={styles.Splash}>
      <View style={styles.Interfaz}>
        <Interfaz />
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          {/* Contenedor para escribir el nombre de la serie */}
          <View style={styles.nameContainer}>
            <Text style={styles.Textos}>{context.language.editName}</Text>
            <TextInput
              style={{height: 50, textAlign: 'center', fontSize: 16}}
              placeholder={title}
              multiline={true}
              maxLength={100}
              textAlignVertical="top"
              onChangeText={NameValue => setName(NameValue)}
            />
          </View>

          {/* Contenedor para escribir la descripcion de la serie */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.Textos}>{context.language.editDesc}</Text>
            <TextInput
              style={{textAlign: 'center', fontSize: 16}}
              placeholder={description}
              multiline={true}
              maxLength={1280}
              numberOfLines={4}
              textAlignVertical="top"
              onChangeText={DescValue => setDesc(DescValue)}
            />
          </View>

          {/* Contenedor de la foto */}
          <View style={styles.imageContainer}>
            <Text style={styles.Textos}>{context.language.editCoverPage}</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{marginRight: 30, marginTop: 40}}>
                {/* Boton para elegir la foto */}
                <Button
                  color="#707070"
                  title={context.language.editPhoto}
                  onPress={() => handleChoosePhoto()}
                />
              </View>
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                {/* Muestra la imagen elegida para subir, si no hay, muestra la imagen de portada normal */}
                <Image
                  style={styles.portada}
                  source={
                    Portada != null ? {uri: Portada.uri} : {uri: coverPage}
                  }
                />
              </View>
            </View>
          </View>

          {/*Lista los episodios*/}
          <View>
            <Text style={styles.Textos}>{context.language.editEpisode}</Text>
            <View style={{flex: 0.65, width: '100%'}}>
              <FlatList
                data={Episodios}
                renderItem={({item}) => (
                  <ListadoEps
                    id={item.id}
                    idSerie={id}
                    title={item.title}
                    del={deleteItem.bind(this)}
                    vis={dddialogVisible.bind()}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/*Si no se ha subido: boton para subir las actualizaciones   */}
        {/*Si se ha subido: saca al usuario de la pantalla            */}
        {Subido ? (
          navigation.navigate('Series')
        ) : (
          <Button
            title={context.language.editButton}
            color="#707070"
            onPress={() => {
              setConfirmar(true);
            }}
          />
        )}
      </View>

      {/*Pantalla de confirmacion para borrar episodio*/}
      <Dialog.Container visible={ddialogVisible}>
        <Dialog.Title>{context.language.ListEpsDelete}</Dialog.Title>
        <Dialog.Button
          label={context.language.formYes}
          onPress={() => {
            deleteItem(idEp);
            setSpinner(true);
            setDdialogVisible(false);
          }}
        />
        <Dialog.Button
          label={context.language.formNo}
          onPress={() => {
            setDdialogVisible(false);
          }}
        />
      </Dialog.Container>

      {/*Pantalla de confimacion para actualizar episodios*/}
      <Dialog.Container visible={Confirmar}>
        <Dialog.Title>{context.language.editDialogTitle}</Dialog.Title>
        <Dialog.Description>
          {context.language.editDialogTitles}{' '}
          {NameSerie == null || NameSerie.trim() == '' ? title : NameSerie}
        </Dialog.Description>
        <Dialog.Description>
          {context.language.editDialogDesc}{' '}
          {DescSerie == null || DescSerie.trim() == ''
            ? description
            : DescSerie}
        </Dialog.Description>

        <Dialog.Button
          label={context.language.editDialogSelec}
          onPress={() => {
            setConfirmar(false);
            Portada != null
              ? imageUp(Portada.path)
              : (updateSerie({
                  title:
                    NameSerie == null || NameSerie.trim() == ''
                      ? title
                      : NameSerie,
                  description:
                    DescSerie == null || DescSerie.trim() == ''
                      ? description
                      : DescSerie,
                  coverPage: coverPage,
                  id: id,
                }),
                setSpinner(true)
                );
          }}
        />
        <Dialog.Button
          label={context.language.editDialogCancel}
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
export default EditSerie;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%',
    width: '100%',
    padding: 10,
    marginTop: 115,
  },

  mainContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    marginTop: -20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  Textos: {
    fontSize: 23,
    fontFamily: 'sans-serif-light',
    textDecorationLine: 'underline',
    textShadowColor: 'grey',
    textAlign: 'center',
  },
  portada: {
    height: 100,
    width: 200,
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
