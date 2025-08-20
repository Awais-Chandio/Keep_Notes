import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Feather from 'react-native-vector-icons/Feather';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// 👇 DB imports
import { getDBConnection, createNotesTable, saveNote, updateNote } from '../database/db';

const AddNote = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation', 'Please enter both Title and Note');
      return;
    }

    try {
      const db = await getDBConnection();
      await createNotesTable(db); // ensure table exists
      await saveNote(db, title, content);

      Alert.alert('Success', 'Note saved successfully!');
      navigation.goBack();
    } catch (error) {
      console.log('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation', 'Please enter both Title and Note');
      return;
    }

    try {
      const db = await getDBConnection();
      await updateNote(db, route?.params?.id, title, content);

      Alert.alert('Success', 'Note updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.log('Error updating note:', error);
      Alert.alert('Error', 'Failed to update note');
    }
  };

  useEffect(() => {
    if (route?.params?.edit) {
      setTitle(route?.params?.title || '');
      setContent(route?.params?.content || '');
    }
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: theme.noteBackground}}>
      <KeyboardAvoidingView 
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[styles.container, { backgroundColor: theme.noteBackground }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather size={hp('3%')} color={theme.text} name="arrow-left" />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>
              {route?.params?.edit ? 'Note Details' : 'Add New Note'}
            </Text>
          </View>

          {/* Title Input */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Title</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.text + '50' }]}
              placeholder="Enter title here..."
              placeholderTextColor={theme.text + '80'}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Content Input */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Note</Text>
            <TextInput
              style={[
                styles.input, 
                styles.textarea, 
                { 
                  color: theme.text, 
                  borderColor: theme.text + '50',
                  minHeight: keyboardVisible ? hp('25%') : hp('35%')
                }
              ]}
              multiline
              textAlignVertical="top"
              placeholder="Enter your note here..."
              placeholderTextColor={theme.text + '80'}
              value={content}
              onChangeText={setContent}
            />
          </View>

          {/* Save/Update Button */}
          <View style={[styles.saveBtnContainer, { marginBottom: hp('2%') }]}>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.buttonBackground }]}
              onPress={() => {
                if (route?.params?.edit) {
                  handleUpdate();
                } else {
                  handleSave();
                }
              }}
            >
              <Text style={[styles.btnText, { color: '#fff' }]}>
                {route?.params?.edit ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('4%'),
  },
  fieldContainer: {
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: hp('2%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
  },
  input: {
    borderWidth: 1,
    borderRadius: hp('1%'),
    padding: hp('1.5%'),
    fontSize: hp('1.8%'),
  },
  header: {
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  title: {
    fontSize: hp('2.8%'),
    fontWeight: '700',
  },
  textarea: {
    textAlignVertical: 'top',
  },
  saveBtnContainer: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  saveBtn: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    borderRadius: hp('1%'),
  },
  btnText: {
    fontSize: hp('2%'),
    fontWeight: '600',
  },
});

export default AddNote;