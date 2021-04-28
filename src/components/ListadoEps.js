import React, {useContext, useState} from 'react';
import axios from 'axios';

// Importamos los componentes
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Dialog from 'react-native-dialog';
import AppContext from './Context';

function ListadoEps(props) {
  // importamos componentes externos
  const context = useContext(AppContext);
  const {title, id, vis, idSerie} = props;
  
  //creamos las variables
  const [NameEp, setNameEp] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [Episode, setepEdit] = useState({id: null, title: null});
  const [Confirmar, setConfirmar] = useState(false);

  // Peticion al servidor - Actualizar episodio
  function updateEpisodio() {
    axios
      .patch(
        `http://thyra.aegcloud.pro/public/api/serie/${idSerie}/episode/${id}`,
        {Episode},
      )
      .then(res => {
        console.log('RES POST');
        console.log(res);
      });
  }

  // Muestra el nombre del ep y las opciones para editar o eliminar
  return (
    <View style={styles.containerEpisodios}>
      <ScrollView horizontal={true} snapToAlignment="center">
        <Text style={{fontSize: 19, fontFamily: 'Merriweather-Bold'}}>
          {NameEp && NameEp.trim() != '' ? NameEp : title}
        </Text>
      </ScrollView>
      <View style={styles.opciones}>
        <View style={{height: 40, width: 40}}>        
          {/* Eliminar */}
          <TouchableOpacity onPress={() => vis(id)}>  
            <Icon name="delete" size={40} />
          </TouchableOpacity>
        </View>
        <View style={{flex: 0.049}} />
        <View style={{height: 40, width: 40}}>        
          {/* Editar */}
          <TouchableOpacity 
            onPress={() => {
              setDialogVisible(true);
            }}>                                     
            <Icon name="edit" size={40} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Ventana emergente - Editar datos del episodio */}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>{context.language.editDialogTitle}</Dialog.Title>
        <Dialog.Input
          onChangeText={NameEp => setNameEp(NameEp)}
          placeholder={title}></Dialog.Input>
        {NameEp && NameEp.trim() != '' && (
          <Dialog.Button
            label={context.language.editDialogSelec}
            onPress={() => {
              setDialogVisible(false);
              setepEdit({
                title: NameEp
              });
              setConfirmar(true);
            }}
          />
        )}

        <Dialog.Button
          label={context.language.editDialogCancel}
          onPress={() => {
            setDialogVisible(false);
            setNameEp(null);
            setConfirmar(false);
          }}
        />
      </Dialog.Container>

      {/* Ventana emergente - Confirmacion */}
      <Dialog.Container visible={Confirmar}>
        <Dialog.Title>
          {context.language.ListEpsConfirm} {title}?
        </Dialog.Title>
        <Dialog.Description>
          {context.language.ListEpsTitle} {NameEp}
        </Dialog.Description>
        <Dialog.Button
          label={context.language.editDialogSelec}
          onPress={() => {
            updateEpisodio();
            setConfirmar(false);
            alert(context.language.ListEpsUpdated);
          }}
        />
        <Dialog.Button
          label={context.language.editDialogCancel}
          onPress={() => {
            setDialogVisible(false);
            setNameEp(null);
            setConfirmar(false);
          }}
        />
      </Dialog.Container>
    </View>
  );
}

export default ListadoEps;

const styles = StyleSheet.create({
  containerEpisodios: {
    flexDirection: 'row',
    minWidth: '100%',
    marginTop: 20,
  },
  opciones: {
    marginTop: -10,
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row-reverse',
  },
});
