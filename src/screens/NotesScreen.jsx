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
        <TouchableOpacity style={styles.menuButton} onPress={toggleLinks}>
          <MaterialIcons name="menu" size={24} color="#007bff" />
        </TouchableOpacity>

        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar notas..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
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

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
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

      {/* Modal for Adding/Editing Note */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedNoteIndex !== null ? 'Editar Nota' : 'Adicionar Nota'}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome da nota..."
              value={noteName}
              onChangeText={handleNoteNameChange}
            />
            <TextInput
              style={[styles.modalInput, { height: 100 }]}
              placeholder="Digite sua anotação..."
              multiline={true}
              value={noteText}
              onChangeText={handleNoteChange}
            />
            <View style={styles.colorPickerContainer}>
              <Text style={styles.colorPickerLabel}>Escolha a cor:</Text>
              <Picker
                selectedValue={noteColor}
                style={styles.colorPicker}
                onValueChange={(itemValue) => handleNoteColorChange(itemValue)}
              >
                <Picker.Item label="Branco" value="#ffffff" />
                <Picker.Item label="Amarelo" value="#ffff99" />
                <Picker.Item label="Verde" value="#ccffcc" />
                <Picker.Item label="Azul" value="#cce5ff" />
                <Picker.Item label="Rosa" value="#f5c6cb" />
              </Picker>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={closeEditModal}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={saveEditedNote}>
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuButton: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  notesContainer: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  noteContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  note: {
    marginTop: 5,
    fontSize: 16,
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  pinButton: {
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    padding: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  colorPickerContainer: {
    marginBottom: 10,
  },
  colorPickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  colorPicker: {
    height: 50,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    position: 'absolute',
    top: 60,
    left: 0, // Alinhado à esquerda
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    zIndex: 1,
    width: 200,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  linkText: {
    fontSize: 16,
  },
});

export default App;
