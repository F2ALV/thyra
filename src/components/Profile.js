//React, Axios y contexto
import React, {useContext, useState, useEffect} from 'react';
import AppContext from './Context';
import axios from 'axios';
import Dialog from 'react-native-dialog';
import {uploadImage} from '../services/uploadImage';

//Componentes de react
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
} from 'react-native';

//Importamos interfaz y servicioAsincrono
import Interfaz from './Interfaz';
import * as service from '../services/asyncService';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';

//Creación de la función Profile
function Profile() {
  //Contexto para la traducción
  const context = useContext(AppContext);

  //Estados
  const [userInfo, setInfo] = useState();
  const [showButton, setShowButton] = useState(false);
  const [bio, setBio] = useState(null);
  const [name, setName] = useState(null);
  const [Spinner, setSpinner] = useState(false);
  const [UserPhoto, setUserPhoto] = useState(null);
  const [confirm, setConfirm] = useState(false);

  //Recuperar información de usuario
  useEffect(
    () => {
      service
        .getDataFromAsyncStorage('infoUser')
        .then(res => {
          const infoUserr = JSON.parse(res);
          setInfo({
            name: null,
            email: infoUserr.user.email,
            photo: null,
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
          email: infoUserr.user.email,
          photo: response.data.photo,
          bio: response.data.bio,
        });
      })
      .catch(function(error) {
        console.warn(error);
      });
  }

  async function imageUp(path) {
    await uploadImage(path)
      .then(res => {
        putInfo({
          name: (name != null && name.trim() != '')
          ? name
          : null,
          email: userInfo.email,
          photo: res,
          bio: (bio != null && bio.trim() != '')
          ? bio
          : null,
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
  //Subir foto de perfil
  function handleChoosePhoto() {
    const options = {
      noData: true,
      mediaType: 'photo',
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.uri) {
        setUserPhoto(response);
      }
    });
  }

  //Función actualizar información
  function putInfo(User) {
    axios
      .patch(
        `http://thyra.aegcloud.pro/public/api/users/${User.email}`, {User},
      )
      .then(res => {
        context.gImageHandler(User.photo);
        context.gNameHandler(User.name);
        console.log(res.data);
        alert(context.language.iAct);
        setSpinner(false);
      });
  }

  async function holiButton() {
    setShowButton(true);
  }

  async function byeButton() {
    setShowButton(false);
  }

  if (userInfo != null) {
    return (
      <>
        <View style={styles.mainContainer}>
          <View style={styles.Interfaz}>
            <Interfaz />
          </View>

          <View style={styles.contentContainer}>
            <TouchableOpacity style={styles.avatarContainer} 
              onPress={() =>
                handleChoosePhoto()
              }
            >
              <Image style={styles.avatar} source={UserPhoto != null ? {uri: UserPhoto.uri} :{uri: userInfo.photo}} />
            </TouchableOpacity>

            <View style={styles.nameContainer}>
              <TextInput
                style={styles.name}
                placeholder={userInfo.name}
                multiline={true}
                maxLength={100}
                numberOfLines={1}
                textAlignVertical="top"           //<Text style={styles.name}>{userInfo.name}</Text>
                onChangeText={TextInputValue =>
                  setName(TextInputValue)
                }
                onFocus={() => holiButton()}
              />
            </View>

            <View style={styles.emailContainer}>
              <Text style={styles.email}>{userInfo.email}</Text>
            </View>

            <View style={styles.descContainer}>
              <Text style={styles.desc}>{context.language.profileBio}</Text>
              <TextInput
                style={{height: 100}}
                placeholder={userInfo.bio}
                multiline={true}
                maxLength={100}
                numberOfLines={4}
                textAlignVertical="top"
                onChangeText={TextInputValue =>
                  setBio(TextInputValue)
                }
                onFocus={() => holiButton()}
              />
              {((bio != null && bio.trim() != '') ||
                (name != null && name.trim() != '') ||
                (UserPhoto != null)) && 
                <Button
                  title={context.language.profileUpdate}
                  color="#707070"
                  onPress={() => {
                    setConfirm(true)
                  }}
                />
              }
              
            </View>
          </View>
        </View>
        <Dialog.Container visible={Spinner}>
          <ActivityIndicator size="large" color="#45454d" />
        </Dialog.Container>
        
        <Dialog.Container visible={confirm}>
          <Dialog.Title>{context.language.actDatos}</Dialog.Title>

          {name != null &&
            <Dialog.Description>
              {context.language.newName}{name}
            </Dialog.Description>
          }
          {bio != null &&
            <Dialog.Description>
              {context.language.newBio}{bio}
            </Dialog.Description>
          }
          {UserPhoto != null &&
            <Dialog.Description>
              {context.language.newImage}
            </Dialog.Description>
          }
          <Dialog.Button
            label={context.language.seriesListYes}
            onPress={() => {
              UserPhoto 
              ? imageUp(UserPhoto.uri)
              : putInfo({
                  name: (name != null && name.trim() != '')
                  ? name
                  : null,
                  email: userInfo.email,
                  photo: null,
                  bio: (bio != null && bio.trim() != '')
                  ? bio
                  : null,
                }),
              setConfirm(false),
              setSpinner(true)
            }}
          />
          <Dialog.Button
            label={context.language.seriesListNo}
            onPress={() => {
              setConfirm(false)
            }}
          />
        </Dialog.Container>

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

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: '#fff1e9',
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  Interfaz: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  contentContainer: {
    marginTop: 55,
  },
  avatarContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    marginTop: 10,
  },
  descContainer: {
    marginTop: -10,
    padding: 30,
  },
  avatar: {
    height: 180,
    width: 180,
    borderRadius: 90,
  },
  name: {
    fontSize: 30,
    fontFamily: 'sans-serif-light',
    textDecorationLine: 'underline',
    textShadowColor: 'grey',
    textAlign: 'center',
  },
  email: {
    fontSize: 20,
    fontFamily: 'sans-serif-light',
    textShadowColor: 'grey',
    textAlign: 'center',
  },
  desc: {
    fontSize: 25,
    fontFamily: 'sans-serif-light',
    textShadowColor: 'grey',
    textAlign: 'center',
  },
});
