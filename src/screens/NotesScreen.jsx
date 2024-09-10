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
      setIsModalVisible(false); // Fecha o modal ao adicionar a nota
    }
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
          <TouchableOpacity style={styles.menuButton} onPress={toggleLinks}>
            <MaterialIcons name="menu" size={24} color="#007bff" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar notas..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
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

      {/* Modal for Adding and Editing Note */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Nota</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome da nota..."
              value={noteName}
              onChangeText={handleNoteNameChange}
            />
            <TextInput
              style={[styles.modalInput, { height: 100 }]}
              placeholder="Texto da nota..."
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
              <TouchableOpacity style={styles.saveButton} onPress={addNote}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={closeEditModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Botão "+" no canto inferior direito */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingVertical: 10,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10, // Ajuste aqui para garantir espaço entre o botão e o campo de pesquisa
  },
  menuButton: {
    padding: 10,
  },
  linksContainer: {
    // Adicione estilos para links aqui
  },
  notesContainer: {
    flex: 1,
  },
  noteContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 16,
    marginTop: 5,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  pinButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: '#ff5c5c',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  colorPickerContainer: {
    marginBottom: 20,
  },
  colorPickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
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
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ff5c5c',
    padding: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Sombra para destacar o botão
  },
});

export default App;
