import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import ToggleSwitch from 'toggle-switch-react-native';
import { saveTheme, getTheme, createThemeTable, getDBConnection } from '../database/db';

const Settings = ({navigation}) => {
  const { theme, toggleTheme } = useTheme();
  const [toggle, setToggle] = useState(false);
  const [db, setDb] = useState(null);

  // Initial load: get DB + saved theme
  useEffect(() => {
    (async () => {
      const connection = await getDBConnection();
      setDb(connection);
      await createThemeTable(connection);
      const saved = await getTheme(connection);
      if (saved !== null) setToggle(saved);  // saved already boolean
    })();
  }, []);

  const handleToggle = async () => {
    const newToggle = !toggle;
    setToggle(newToggle);
    toggleTheme();
    if (db) {
      await saveTheme(db, newToggle);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
         <TouchableOpacity onPress={()=>{navigation.goBack()}}>
          <Feather size={hp('2.5%')} color={theme.text} name='arrow-left' />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>

      <View style={styles.darkMode}>
        <Text style={[styles.darkModeSetting,{color:theme.text}]}>Dark Mode</Text>
        <ToggleSwitch
            isOn={toggle}
            onColor="#4fbe79"
            offColor="#d3d3d3"
            size="medium"
            onToggle={handleToggle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: hp('1%'),
  },
  header: {
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
    flexDirection:'row',
    gap:wp('1%'),
    alignItems:'center'
  },
  title: {
    fontSize: hp('3%'),
    fontWeight: '600',
  },
  darkMode:{
    paddingTop:hp('2%'),
    paddingBottom:hp('2%'),
    flexDirection:'row',
    justifyContent:'space-between'
  },
  darkModeSetting:{
    fontSize:hp('2%'),
    fontWeight:'600',
  }
});

export default Settings;
