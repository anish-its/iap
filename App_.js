import React,{useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { 
  initConnection, 
  endConnection,
  getProducts, 
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
} from 'react-native-iap';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const mainView = {
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    height:'100%',
  }

  useEffect(() => {
    const init = async () => {
      try {
        await initConnection();
        if (Platform.OS === 'android') {
          flushFailedPurchasesCachedAsPendingAndroid();
        }
      }
      catch (error) {
        console.error('Error occurred during initilization', error.message);
      }
    }
    init();
    return () => {
      endConnection();
    }
  }, [])  

  const itemSkus = Platform.select({
    ios: ['com.example.productid'],
    android: ['com.example.productid'],
  });

  const getPurchase = async () => {
      try {
          const result = await getAvailablePurchases();
          const hasPurchased = result.find((product) => product.productId === constants.productSkus[0]);
          setLoading(false);
          setPremiumUser(hasPurchased);
      }
      catch (error) {
          console.error('Error occurred while fetching purchases', error);
      }
  }

  function buybtn(e){
    getProducts(itemSkus).then((products) => {
      console.log('Products:', products);
    }).catch((error) => {
      console.log('Error fetching products:', error);
    });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={mainView}>
          <Button style={styles.button} onPress={buybtn} title="purchase" color="#841584"/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    flex:1,
    fontWeight: '700',
    alignItems: 'center',
  },
});

export default App;
