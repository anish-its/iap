import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  Alert,
} from 'react-native';
import {initConnection,endConnection,getProducts,buyProduct} from 'react-native-iap';

function App(){
  const [products, setProducts] = useState([]);

  const itemSkus = Platform.select({
    ios: ['com.example.productid'],
    android: ['com.example.productid'],
  });

  useEffect(() => {
    initConnection().then(async () => {
      try {
        const retrievedProducts = await getProducts(itemSkus);
        setProducts(retrievedProducts);
      } catch (error) {
        console.error(error);
      }
    });

    return () => {
      endConnection();
    };
  }, []);

  const handlePurchase = async (sku) => {
    try {
      const purchase = await buyProduct(sku);
      // Handle the successful purchase, unlock content, etc.
      Alert.alert('Purchase Successful', `You've purchased ${purchase.productId}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Purchase Failed', 'Something went wrong with your purchase.');
    }
  };

  return (
    <View>
      <Text style={{textAlign:'center'}}>In-App Purchase Example</Text>
      {products.map((product) => (
        <View key={product.productId}>
          <Text>{product.title} - {product.price}</Text>
          <Button title={`Buy ${product.title}`} onPress={() => handlePurchase(product.productId)}/>
        </View>
      ))}
    </View>
  );
};

export default App;
