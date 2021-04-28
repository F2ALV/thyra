//Importamos React y las rutas para el funcionamiento
import React, { useState } from "react";
import Routes from "./Routes";
console.disableYellowBox = true

//Importamos contexto y los ficheros de traducción
import AppContext from './src/components/Context';
import esp from './src/languajes/esp';
import eng from './src/languajes/eng';
import eus from './src/languajes/eus';

//Componente App
function App () {
    //Variable que indica en que idioma se renderizará la app (irá variando)
    let appTranslation = esp;

    let globalName = null;
    let globalImage = null;
    
    const [language, setLanguage] = useState(appTranslation)
    const languageHandler = (language) => {
        setLanguage(language);
    }

    const [gImage, gImageSet] = useState(globalImage)
    const gImageHandler = (gImage) => {
        gImageSet(gImage);
    }

    const [gName, gNameSet] = useState(globalName)
    const gNameHandler = (gName) => {
        gNameSet(gName);
    }
    
    return (
        <AppContext.Provider value={{ language, languageHandler, gImage, gImageHandler, gName, gNameHandler}}>
            <Routes/>
        </AppContext.Provider>
    );    
}

export default App;