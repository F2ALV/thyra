import AsyncStorage from '@react-native-community/async-storage';

export const getDataFromAsyncStorage = key => {
  return new Promise((resolve, reject) => {
    return AsyncStorage.getItem(key)

      .then(value => {
        resolve(value);
      })

      .catch(error => {
        reject(error);
      });
  });
};
