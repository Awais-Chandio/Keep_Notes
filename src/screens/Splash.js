import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { BarIndicator } from 'react-native-indicators';
import { useTheme } from '../theme/ThemeContext';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const Splash = ({ navigation }) => {
  const [load, setLoad] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      navigation.navigate('Notes');
      setLoad(false);
    }, 3000);
  }, []);
  return (
    <SafeAreaView style={[styles.container,{backgroundColor:theme.background}]}>
      <Animatable.View animation={'bounceIn'}>
        <Image source={require('../../src/assets/images/logo.png')}></Image>
      </Animatable.View>
      {load ? (
        <View style={{height:hp('5%')}}>
          <BarIndicator count={4} color={theme.text}></BarIndicator>
        </View>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Splash;
