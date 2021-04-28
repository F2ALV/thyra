//Importamos componentes varios:
import React, {useContext, useState, useEffect} from 'react';                                   //React y funciones
import axios from 'axios';                                                                      //Axios
import {NavigationContext} from 'react-navigation';                                             //Navegación
import SplashScreen from 'react-native-splash-screen';                                          //Splash screen
import {StyleSheet, View, Image, ActivityIndicator} from 'react-native';                        //Componentes react
import {GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';      //Google stuff
import AsyncStorage from '@react-native-community/async-storage';                               //AsyncStorage

//Funcion Login
function Login() {
  //Constantes navegacion y estados
  const navigation = useContext(NavigationContext);
  const [gettingLoginStatus, setGettingLoginStatus] = useState(true);

  //Función inicial verificar log
  useEffect(() => {
    SplashScreen.hide();
    //initial configuration
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      // Repleace with your webClientId generated from Firebase console
      webClientId:
        '777759181465-8d11lrue68k72g188v659rm397stcfje.apps.googleusercontent.com',
    });
    //Check if user is already signed in
    _isSignedIn();
  }, []);

  //Ver si está logeado
  async function _isSignedIn() {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      navigation.navigate('Series');
    } else {
      await AsyncStorage.clear();
    }
    setGettingLoginStatus(false);
  }

  //Log in + pasar información
  async function _signIn() {
    //Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      await AsyncStorage.setItem('infoUser', JSON.stringify(userInfo));
      axios
        .post(
          'http://thyra.aegcloud.pro/public/api/users', userInfo
        )
        .then(res => {
          navigation.navigate('Series');
        });
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  }

  //returning Loader untill we check for the already signed in user
  if (gettingLoginStatus) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Image
          source={{
            uri:
              'https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2015/09/OGB-INSIDER-BLOGS-GoogleLogox2-Animated.gif',
          }}
          style={{width: 300, height: 300}}
        />
        <GoogleSigninButton
          style={{width: 312, height: 48, marginTop: 100}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={() => _signIn()}
        />
      </View>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 30,
  },
});
