//Importamos React
import React, {useContext, useState, useEffect} from 'react';
import {NavigationContext} from 'react-navigation';

//Importamos componentes necesarios
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import AppContext from './Context';
import Interfaz from './Interfaz';
import {uploadVideo} from '../services/uploadVideo';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Dialog from 'react-native-dialog';
import ImagePicker from 'react-native-image-picker';
import Orientation from 'react-native-orientation';
import axios from 'axios';

// la pantalla se guarda en una variable
function DescSerie(props) {
  //importamos parametros y funciones externas
  const context = useContext(AppContext);
  const navigation = useContext(NavigationContext);
  const {
    titulo = navigation.getParam('Titulo', 'Titulo'),
    Descripcion = navigation.getParam('Descripcion', 'Descripcion'),
    Imagen = navigation.getParam('Imagen', 'Imagen'),
    Id = navigation.getParam('Id', 'Id'),
  } = props;

  //creamos las variables
  const [Video, setVideo] = useState(null);
  const [Episode, setEpisode] = useState({});
  const [Episodios, setEpisodios] = useState(null);
  const [addEp, setAddEp] = useState(false);
  const [upload, setupload] = useState(false);
  const [epName, setEpName] = useState(null);
  const [url, setUrl] = useState(null);

  //Inicia los componentes antes de que inicie la pantalla
  useEffect(() => {
    Orientation.lockToPortrait();
    axios
      .get(`http://thyra.aegcloud.pro/public/api/serie/${Id}/episode`)
      .then(response => {
        setEpisodios(response.data);
      })
      .catch(function(error) {
        console.warn(error);
      });
  }, []);

  //Elige un video y la guarda en una variable
  function handleChooseVideo() {
    const options = {
      noData: true,
      mediaType: 'video',
      videoQuality: 'low',
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('response', response);
      if (response.uri) {
        setVideo(response);
      }
    });
  }

  //peticion al server: crear un episodio
  function crearEpisodio() {
    axios
      .post(
        `http://thyra.aegcloud.pro/public/api/serie/${Episode.fk_series}/episode`,
        {Episode},
      )
      .then(res => {
        axios
          .get(`http://thyra.aegcloud.pro/public/api/serie/${Id}/episode`)
          .then(response => {
            setEpisodios(response.data);
          })
          .catch(function(error) {
            console.warn(error);
          });
      });
  }

  async function video_Upload(Video_uri) {
    await uploadVideo(Video_uri)
      .then(res => {
        setEpisode({
          title: epName,
          uri: res,
          fk_series: Id,
        }),
          setUrl('hay algo');
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View style={styles.Splash}>
      {/*Interfaz de la pantalla*/}
      <View style={styles.Interfaz}>
        <Interfaz />
      </View>
      <View style={styles.PantallaDescSeries}>
        {/*Coloca la portada en la pantalla*/}
        <View style={styles.SeccImagenPortada}>
          <ImageBackground
            style={styles.ImagenPortada}
            source={{uri: Imagen}}></ImageBackground>
        </View>
        <View style={styles.Textos}>
          <View style={{flex: 1.2, width: '100%', alignItems: 'center'}}>
            {/*Titulo de la serie*/}
            <ScrollView horizontal={true}>
              <Text style={styles.titulo}>{titulo}</Text>
            </ScrollView>
          </View>
          <View style={{flex: 2.8, width: '100%', alignItems: 'center'}}>
            {/*Descripcion de la serie*/}
            <ScrollView>
              <Text style={styles.descripcion}> {Descripcion}</Text>
            </ScrollView>
          </View>
        </View>
        {/*Lista los episodios*/}
        <View style={styles.listaEpisodios}>
          <Text style={styles.TextoEpisodios}>{context.language.descEp}</Text>
          <FlatList
            data={Episodios}
            renderItem={({item}) => (
              <ScrollView horizontal={true} snapToAlignment="center">
                <View style={styles.episodios}>
                  {/*Te manda al reproductor*/}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Reproductor', {
                        ep: item.title,
                        uri: item.uri,
                      })
                    }>
                    <Text style={styles.TextoEp} maxLength={8}>
                      {' '}
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                  <Icon
                    name="play-arrow"
                    size={35}
                    style={{width: '100%', marginTop: -5, color: 'black'}}
                    onPress={() =>
                      navigation.navigate('Reproductor', {
                        ep: item.title,
                        uri: item.uri,
                      })
                    }
                  />
                </View>
              </ScrollView>
            )}
          />
        </View>
      </View>

      {/*boton para subir un video*/}
      <ActionButton
        buttonColor="#707070"
        onPress={() => {
          setAddEp(true);
          setupload(true);
          setEpisode({});
          setEpName(null);
          setVideo(null);
          setUrl(null);
        }}
        renderIcon={active =>
          active ? (
            <Icon name="add" size={25} style={{color: '#fff'}} />
          ) : (
            <Icon name="add" size={25} style={{color: '#fff'}} />
          )
        }
      />

      <Dialog.Container visible={addEp}>
        <Dialog.Title>{context.language.descDialogTitle}</Dialog.Title>

        {/* Permite preparar un video para subir en el caso de que no se este subiendo uno */}
        {upload && (
          <Dialog.Button
            label={context.language.descDialogSelec}
            onPress={() => handleChooseVideo()}
          />
        )}

        {/*Si hay un video preparado para subir y no se esta subiendo, deja al usuario colocar el nombre del episodio*/}
        {upload && Video != null && (
          <Dialog.Input
            placeholder={context.language.descDialogInsertName}
            onChangeText={NombreEp => setEpName(NombreEp)}
          />
        )}

        {/*Si el video no se esta subiendo y el usuario coloco un nombre para el episodio, sube el video*/}
        {upload && epName != null && epName.trim() != '' && (
          <Dialog.Button
            label={context.language.descButton}
            onPress={() => {
              video_Upload(Video.uri);
              setupload(false);
            }}
          />
        )}

        {/*Si el video se esta siendo subido y no se recibio respuesta de que el proceso de subida, muestra un mensaje de carga*/}
        {upload == false && url == null && (
          <Dialog.Description>{context.language.descDialogLoading}</Dialog.Description>
        )}

        {/*si ya se recibio respuesta de que se subio el video, sube los datos a la base de datos*/}
        {upload == false && url != null && (
          <Dialog.Button
            label={context.language.descDialogAccept}
            onPress={() => {
              crearEpisodio();
              setAddEp(false);
            }}
          />
        )}

        {/*manda mensaje de que el episodio se subio*/}
        {upload == false && url != null && (
          <Dialog.Description>
            {context.language.descDialogUploaded}
          </Dialog.Description>
        )}

        {/*si no se ha subido el episodio, permite cancelar el proceso*/}
        {upload && (
          <Dialog.Button
            label={context.language.descDialogCancel}
            onPress={() => {
              setAddEp(false);
            }}
          />
        )}
      </Dialog.Container>
    </View>
  );
}
export default DescSerie;

const styles = StyleSheet.create({
  /* Pantalla Descripcion Series */
  PantallaDescSeries: {
    flex: 1,
    borderRadius: 10,
    height: '100%',
    width: '100%',
    alignItems: 'flex-start',
  },
  SeccImagenPortada: {
    flex: 2,
    width: '100%',
  },
  ImagenPortada: {
    width: '100%',
    height: '100%',
  },
  Textos: {
    flex: 1,
    overflow: 'scroll',
    width: '100%',
  },
  TextoEpisodios: {
    fontSize: 20,
    textAlign: 'center',
  },
  titulo: {
    fontSize: 25,
    fontFamily: 'Merriweather-Bold',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 16,
    fontFamily: 'Merriweather-LightItalic',
  },
  listaEpisodios: {
    flex: 1.4,
    width: '100%',
    justifyContent: 'flex-start',
  },
  /* Lista de episodios */
  episodios: {
    width: '100%',
    height: 35,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TextoEp: {
    fontFamily: 'Merriweather-Bold',
    fontSize: 18,
  },
  /* Splash */
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
