   import React, { useState } from 'react';
  import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
  import { RotateInDownLeft } from 'react-native-reanimated';
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
  
  const App = () => {
    const [noteText, setNoteText] = useState('');
    const [notes, setNotes] = useState([]);
    const [showLinks, setShowLinks] = useState(false);
  
    const handleNoteChange = (text) => {
      setNoteText(text);
    };
  
    const addNote = () => {
      if (noteText.trim() !== '') {
        setNotes([...notes, noteText]);
        setNoteText('');
      }
    };
  
    const handleSubmit = () => {
      addNote();
    };
  
    const deleteNote = (index) => {
      const newNotes = [...notes];
      newNotes.splice(index, 1);
      setNotes(newNotes);
    };
  
    const toggleLinks = () => {
      setShowLinks(!showLinks);
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Text style={styles.headerText}>Notas</Text>
            <TouchableOpacity style={styles.menuButton} onPress={toggleLinks}>
              <MaterialIcons name="menu" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>
          {showLinks && (
            <View style={styles.linksContainer}>
              <TouchableOpacity style={styles.link}>
                <MaterialIcons name="link" size={24} color="#007bff" />
                <Text style={styles.linkText}>Link 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link}>
                <MaterialIcons name="link" size={24} color="#007bff" />
                <Text style={styles.linkText}>Link 2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link}>
                <MaterialIcons name="link" size={24} color="#007bff" />
                <Text style={styles.linkText}>Link 3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link}>
                <MaterialIcons name="link" size={24} color="#007bff" />
                <Text style={styles.linkText}>Link 4</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link}>
                <MaterialIcons name="link" size={24} color="#007bff" />
                <Text style={styles.linkText}>Link 5</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
  
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Criar uma nota..."
            value={noteText}
            onChangeText={handleNoteChange}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={addNote}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notesContainer}>
          <FlatList
            data={notes}
            renderItem={({ item, index }) => (
              <View style={styles.noteContainer}>
                <Text style={styles.note}>{item}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNote(index)}>
                  <Text style={styles.deleteButtonText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 0.95,
      backgroundColor: '#fff',
    },
    header: {
      backgroundColor: '#f0f0f0',
      padding: 15,
      width: '300px',
    },
    headerInner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    menuButton: {
      marginRight: 10,
    },
    linksContainer: {
      flexDirection: 'column',
      marginRight: '80%',
      padding: 0,
    },
    link: {
      marginRight: 10,
    },
    linkText: {
      fontSize: 16,
      color: '#007bff',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      width: '40%',
      marginLeft: '28%',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginRight: 10,
    },
    addButton: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
    },
    addButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    notesContainer: {
      padding: 15,
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    noteContainer: {
      backgroundColor: '#f0f0f0',
      padding: 10,
      marginRight: 10,
      borderRadius: 5,
    },
    note: {
      fontSize: 16,
    },
    deleteButton: {
      backgroundColor: '#ff0000',
      padding: 5,
      borderRadius: 5,
    },
    deleteButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  
  export default App;