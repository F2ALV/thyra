import React, {useContext} from 'react';
import {NavigationContext} from 'react-navigation';

//Importa los componentes
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

function Series(props) {
  //importa compnentes externos
  const {Titulo, Descripcion, Imagen, Id} = props;
  const navigation = useContext(NavigationContext);

  return (
    <TouchableWithoutFeedback
      activeOpacity="100"
      onPress={() =>
        navigation.navigate('DescSerie', {
          Titulo: Titulo,
          Descripcion: Descripcion,
          Imagen: Imagen,
          Id: Id,
        })
      }>
        {/* vuelve todo un boton para ir a la desc de la serie */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'stretch',
          padding: 10,
        }}>
        {/* Esqueleto de la burbuja de Serie */}
        <View style={styles.burbujaSeries}>
          <ImageBackground
            source={{uri: Imagen}}
            style={{borderRadius: 10, width: '100%', height: '100%'}}>
            <View style={styles.emptyBox}></View>
            <View style={styles.tittle}>
              <Text style={styles.textTittle}>{Titulo}</Text>
            </View>
            <View style={styles.description}>
              <Text style={styles.textDescription}>{Descripcion}</Text>
            </View>
          </ImageBackground>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Series;

const styles = StyleSheet.create({
  /* Estilos de la burbuja de series */
  burbujaSeries: {
    flex: 1,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'stretch',
    alignContent: 'center',
    padding: 5,
    maxHeight: 125,
    backgroundColor: '#363b4e',
  },
  emptyBox: {
    flex: 2,
    flexDirection: 'column',
  },
  tittle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  description: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  textTittle: {
    fontSize: 25,
    fontFamily: 'Merriweather-BoldItalic',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: {width: -1, height: -1},
    textShadowRadius: 5,
  },
  textDescription: {
    fontSize: 10,
    fontFamily: 'Merriweather-LightItalic',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 15,
  },
});
