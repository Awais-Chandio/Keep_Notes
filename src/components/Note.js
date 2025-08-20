import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useTheme } from '../theme/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const Note = ({ title, content,id,handleDelete }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.note, { backgroundColor: theme.noteBackground,paddingTop: hp('4%') }]}>
      <TouchableOpacity onPress={()=>{Alert.alert('Confirm', 'Delete this note?', [ { text: 'Cancel' }, { text: 'Delete', onPress: () => handleDelete(id) }, ])}} style={styles.binButton}>
        <MaterialIcons size={hp('2.5%')} color={'#0A84FF'} name="delete" />
      </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.content, { color: theme.text }]}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  note: {
    flex: 1,
    paddingBottom: hp('2%'),
    paddingLeft: hp('1.5%'),
    paddingRight: hp('1.5%'),
    height: hp('20%'),
    width: wp('45%'),
    borderRadius: hp('1%'),
  },
  title: {
    fontSize: hp('2.2%'),
    fontWeight: '600',
  },
  content: {
    paddingTop: hp('3%'),
    fontSize: hp('1.5%'),
    fontWeight: '600',
  },
  binButton:{
    alignSelf:'flex-end'
  }
});

export default Note;
