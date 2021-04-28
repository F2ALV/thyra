//Componentes react
import {useState, useCallback} from 'react';

//Funcion CallBack
export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return update;
}
