import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Modal, Picker } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [noteText, setNoteText] = useState('');
  const [noteName, setNoteName] = useState('');
  const [noteColor, setNoteColor] = useState('#ffffff');
  const [isPinned, setIsPinned] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showLinks, setShowLinks] = useState(false);
  const [tema, setTrocaTema] = useState('#ffffff');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [isListView, setIsListView] = useState(false); // false para visualização em linha, true para visualização em coluna


  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notesData = await AsyncStorage.getItem('notes');
        if (notesData) {
          setNotes(JSON.parse(notesData));
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };

    loadNotes();
  }, []);

  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    };

    saveNotes();
  }, [notes]);

  const trocaTema = () => {
    const temas = ['#696969', '#ffffff'];
    const indice = Math.floor(Math.random() * temas.length);
    setTrocaTema(temas[indice]);
  };

  const handleNoteChange = (text) => {
    setNoteText(text);
  };

  const handleNoteNameChange = (text) => {
    setNoteName(text);
  };

  const handleNoteColorChange = (color) => {
    setNoteColor(color);
  };

  const handlePinToggle = () => {
    setIsPinned(!isPinned);
  };

  const addNote = () => {
    if (noteText.trim() !== '' && noteName.trim() !== '') {
      setNotes([...notes, { name: noteName, text: noteText, color: noteColor, isPinned }]);
      setNoteText('');
      setNoteName('');
      setNoteColor('#ffffff'); // Reset color to default
      setIsPinned(false); // Reset pin status
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

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const filteredNotes = notes
    .filter(note =>
      note.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.isPinned - a.isPinned); // Sort notes with pinned notes on top

  const openEditModal = (index) => {
    setSelectedNoteIndex(index);
    setNoteName(notes[index].name);
    setNoteText(notes[index].text);
    setNoteColor(notes[index].color);
    setIsPinned(notes[index].isPinned);
    setIsModalVisible(true);
  };

  const closeEditModal = () => {
    setIsModalVisible(false);
    setSelectedNoteIndex(null);
    setNoteText('');
    setNoteName('');
    setNoteColor('#ffffff'); // Reset color to default
    setIsPinned(false); // Reset pin status
  };

  const saveEditedNote = () => {
    const updatedNotes = [...notes];
    updatedNotes[selectedNoteIndex] = { name: noteName, text: noteText, color: noteColor, isPinned };
    setNotes(updatedNotes);
    closeEditModal();
  };


  const toggleViewMode = () => {
    setIsListView(!isListView);
  };
  



  return (
    <View style={[styles.container, { backgroundColor: tema }]}>
      <View style={styles.header}>
      <View style={styles.headerInner}>
  <View style={styles.titleContainer}>
    <MaterialIcons name="lightbulb" size={28} color="#007bff" />
    <Text style={styles.headerText}>Notas</Text>
  </View>
  <TouchableOpacity style={styles.menuButton} onPress={toggleLinks}>
    <MaterialIcons name="menu" size={24} color="#007bff" />
  </TouchableOpacity>
</View>

      </View>

      {showLinks && (
        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons style={styles.icon} name="checklist" size={24} color="#007bff" />
            <Text style={styles.linkText}>Link 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons style={styles.icon} name="event" size={24} color="#007bff" />
            <Text style={styles.linkText}>Link 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons style={styles.icon} name="send" size={24} color="#007bff" />
            <Text style={styles.linkText}>Link 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons style={styles.icon} name="delete" size={24} color="#007bff" />
            <Text style={styles.linkText}>Link 4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <MaterialIcons style={styles.icon} name="settings" size={24} color="#007bff" />
            <Text style={styles.linkText}>Link 5</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar notas..."
        value={searchQuery}
        onChangeText={handleSearchChange}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome da nota..."
          value={noteName}
          onChangeText={handleNoteNameChange}
        />
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
  {filteredNotes.length === 0 ? (
    <View style={styles.emptyStateContainer}>
      <MaterialIcons name="lightbulb" size={60} color="#888" />
      <Text style={styles.emptyStateText}>As suas notas são exibidas aqui.</Text>
    </View>
  ) : (
    <FlatList
    data={filteredNotes}
    renderItem={({ item, index }) => (
      <View style={[styles.noteContainer, { backgroundColor: item.color }]}>
        <TouchableOpacity onPress={() => openEditModal(index)} style={styles.noteContent}>
          <Text style={styles.noteTitle}>{item.name}</Text>
          <Text style={styles.note}>{item.text}</Text>
        </TouchableOpacity>
        <View style={styles.noteActions}>
          <TouchableOpacity
            style={[styles.pinButton, { marginRight: 10 }]}
            onPress={() => {
              const updatedNotes = [...notes];
              updatedNotes[index].isPinned = !updatedNotes[index].isPinned;
              setNotes(updatedNotes);
            }}
          >
            <MaterialIcons
              name={item.isPinned ? "push-pin" : "push-pin-outlined"}
              size={24}
              color={item.isPinned ? "#007bff" : "#ccc"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNote(index)}
          >
            <Text style={styles.deleteButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
    keyExtractor={(item, index) => index.toString()}
    horizontal={!isListView} // Se não for visualização em lista, exibe horizontalmente
    showsHorizontalScrollIndicator={false}
  />
  
  )}
</View>

      {/* Modal for Editing Note */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Nota</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome da nota..."
              value={noteName}
              onChangeText={handleNoteNameChange}
            />
            <TextInput
              style={[styles.modalInput, { height: 100 }]}
              placeholder="Editar texto da nota..."
              value={noteText}
              onChangeText={handleNoteChange}
              multiline={true}
            />
            <View style={styles.colorPickerContainer}>
              <Text style={styles.colorPickerLabel}>Escolha a cor:</Text>
              <Picker
                selectedValue={noteColor}
                style={styles.colorPicker}
                onValueChange={(itemValue) => handleNoteColorChange(itemValue)}
              >
                <Picker.Item label="Branco" value="#ffffff" />
                <Picker.Item label="Amarelo Claro" value="#ffffe0" />
                <Picker.Item label="Rosa Claro" value="#ffb6c1" />
                <Picker.Item label="Verde Claro" value="#d3ffd3" />
                <Picker.Item label="Azul Claro" value="#add8e6" />
              </Picker>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={saveEditedNote}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.themeButton} onPress={trocaTema}>
        <MaterialIcons name="contrast" size={24} color="#007bff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewToggleButton} onPress={toggleViewMode}>
  <MaterialIcons name={isListView ? "view-cozy" : "view-stream"} size={24} color="#007bff" />
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  icon: {
    color: '#000000',
  },
  header: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    width: '100%',
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row', // Alinha o ícone e o texto em linha
    alignItems: 'center', // Garante que o ícone e o texto fiquem centralizados verticalmente
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10, // Adiciona espaço entre o ícone e o texto
  },  
  menuButton: {
    marginRight: 1750,
  },
  linksContainer: {
    position: 'absolute', // Position the links absolute
    top: 60, // Adjust this to place the links below the header
    left: 15, // Adjust this to align the links properly
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    zIndex: 1, // Make sure the links are on top of other elements
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  linkText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 15,
    borderRadius: 5,
    marginHorizontal: '28%',
    width: '40%',
    marginLeft: '30%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    width: '40%',
    marginLeft: '30%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  themeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
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
    marginLeft: 300,
    marginTop: 100,
  },
  noteContainer: {
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteContent: {
    flex: 1,
  },
  note: {
    fontSize: 16,
    marginTop: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '30%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  colorPickerContainer: {
    marginBottom: 15,
  },
  colorPicker: {
    width: '100%',
    height: 50,
  },
  colorPickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 300,
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 30,
    color: '#888',
    marginTop: 10, // Espaçamento entre o ícone e o texto
  },
  viewToggleButton: {
    position: 'absolute',
    top: 15,
    right: 50, // Ajuste conforme a necessidade para ficar ao lado do botão de troca de cor
  },
  
});

export default App;
