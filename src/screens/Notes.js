import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Note from '../components/Note';
import Feather from 'react-native-vector-icons/Feather';

import {
  getDBConnection,
  createNotesTable,
  getAllNotes,
  deleteNote,
} from '../database/db';

const Notes = ({ navigation }) => {
  const { theme } = useTheme();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showButton, setShowButton] = useState(true);
  const scrollOffset = useRef(0);

  const loadNotes = async () => {
    try {
      const db = await getDBConnection();
      await createNotesTable(db);
      const storedNotes = await getAllNotes(db);
      setNotes(storedNotes);
      setFilteredNotes(storedNotes); // keep a copy for search
    } catch (error) {
      console.log('Error loading notes:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async id => {
    try {
      const db = await getDBConnection();
      await deleteNote(db, id);
      await loadNotes();
    } catch (error) {
      console.log('Error deleting note:', error);
    }
  };

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > scrollOffset.current ? 'down' : 'up';

    if (direction === 'down' && currentOffset > 0) {
      setShowButton(false);
    } else {
      setShowButton(true);
    }

    scrollOffset.current = currentOffset;
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(text.toLowerCase()) ||
        note.content.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Keep Note</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Feather size={hp('2.5%')} color={theme.text} name="settings" />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Search"
        placeholderTextColor={theme.textSecondary || '#888'}
        value={searchText}
        onChangeText={handleSearch}
        style={[
          styles.input,
          { backgroundColor: theme.inputBackground, color: theme.text },
        ]}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredNotes}
        keyExtractor={item => item.id.toString()}
        numColumns={filteredNotes.length > 1 ? 2 : 1}
        key={filteredNotes.length > 1 ? 'two-columns' : 'one-column'}
        columnWrapperStyle={filteredNotes.length > 1 ? { gap: hp('1.5%') } : null}
        contentContainerStyle={{
          gap: hp('1.5%'),
          padding: hp('1%'),
          marginTop: hp('5%'),
          flexGrow: 1,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddNote', {
                title: item.title,
                content: item.content,
                edit: true,
                id: item.id,
              });
            }}
          >
            <Note
              title={item.title}
              id={item.id}
              handleDelete={handleDelete}
              content={item.content}
            />
          </TouchableOpacity>
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {showButton && (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddNote')}
            style={{
              padding: hp('1%'),
              borderRadius: hp('10%'),
              backgroundColor: '#0A84FF',
            }}
          >
            <Feather name="plus" color={'#fff'} size={hp('4%')} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: hp('1%'),
  },
  addButtonContainer: {
    alignItems: 'center',
    position: 'absolute',
    right: wp('7%'),
    bottom: hp('5%'),
  },
  header: {
    paddingTop: hp('4%'),
    paddingBottom: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp('3%'),
    fontWeight: '600',
  },
  input: {
    padding: hp('1.2%'),
    width: '100%',
    borderWidth: hp('0.1%'),
    borderRadius: hp('0.5%'),
    fontSize: hp('2%'),
  },
});

export default Notes;
