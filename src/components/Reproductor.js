import React, { useContext, useState, useEffect } from 'react';
import { NavigationContext } from 'react-navigation';
 
// Importamos componentes
import {
    View,
    StyleSheet,
    BackHandler
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation';
 
function Reproductor() {
    //Importa variables ecternas
    const navigation = useContext(NavigationContext);
    const titulo = navigation.getParam('ep', 'ep');
    const episode = navigation.getParam('uri', 'uri');    
 
    //Realiza acciones antes de cargar la pantalla
    useEffect(() => {
        Orientation.lockToLandscape();
        backHandler = BackHandler.addEventListener('hardwareBackPress', () => _back());
        //Realiza acciones despues de cargar la pantalla
        return () => {
            backHandler.remove()
        }
    }, [])
 
    // Da funcion al boton de regresar del reproductor
    function _back() {
        Orientation.lockToPortrait()
        navigation.goBack()
        return true
    }
 
 
    return (
        <View style={styles.MainContainer}>
            {/* Reproductor de video */}
            <VideoPlayer
                source={{ uri: episode }}
                title={titulo}
                onBack={() => _back()}
            />
        </View>
    )
 
}
 
export default Reproductor;
 
const styles = StyleSheet.create({
    MainContainer: {
        flex: 1
    },
 
});
 

