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
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false); // Modal para perfil

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

  const toggleProfileModal = () => {
    setIsProfileModalVisible(!isProfileModalVisible);
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

          {/* Botão para alternar entre visualização horizontal e vertical */}
          <TouchableOpacity style={styles.toggleViewButton} onPress={toggleViewMode}>
            <MaterialIcons
              name={isListView ? "view-stream" : "view-column"}
              size={24}
              color="#007bff"
            />
          </TouchableOpacity>

          {/* Ícone de perfil */}
          <TouchableOpacity style={styles.profileButton} onPress={toggleProfileModal}>
            <MaterialIcons name="account-circle" size={24} color="#007bff" />
          </TouchableOpacity>

          {/* Modal para gerenciar perfil */}
          <Modal visible={isProfileModalVisible} animationType="slide" transparent={true}>
            <View style={styles.profileModalContainer}>
              <View style={styles.profileModal}>
                <Text style={styles.profileModalTitle}>Gerenciar Conta</Text>
                <TouchableOpacity style={styles.profileOption}>
                  <Text style={styles.profileOptionText}>Minha Conta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileOption}>
                  <Text style={styles.profileOptionText}>Adicionar Outra Conta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeProfileModalButton} onPress={toggleProfileModal}>
                  <Text style={styles.closeProfileModalButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>

      {showLinks && (
        <View style={styles.linksContainer}>
          <Text style={styles.linkText}>Link 1</Text>
          <Text style={styles.linkText}>Link 2</Text>
          <Text style={styles.linkText}>Link 3</Text>        </View>
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
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Cor da Nota:</Text>
              <Picker
                selectedValue={noteColor}
                style={styles.modalPicker}
                onValueChange={handleNoteColorChange}
              >
                <Picker.Item label="Branco" value="#ffffff" />
                <Picker.Item label="Amarelo" value="#ffeb3b" />
                <Picker.Item label="Azul" value="#2196f3" />
                <Picker.Item label="Verde" value="#4caf50" />
                <Picker.Item label="Vermelho" value="#f44336" />
              </Picker>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Fixar Nota:</Text>
              <TouchableOpacity onPress={handlePinToggle}>
                <MaterialIcons
                  name={isPinned ? "push-pin" : "push-pin-outlined"}
                  size={24}
                  color={isPinned ? "#007bff" : "#ccc"}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={selectedNoteIndex !== null ? saveEditedNote : addNote}
            >
              <Text style={styles.modalButtonText}>
                {selectedNoteIndex !== null ? 'Salvar Alterações' : 'Adicionar Nota'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButtonClose} onPress={closeEditModal}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <MaterialIcons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.themeButton} onPress={trocaTema}>
        <MaterialIcons name="brightness-6" size={24} color="#007bff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  menuButton: {
    marginRight: 10,
  },
  toggleViewButton: {
    marginRight: 16,
  },
  profileButton: {
    marginLeft: 16,
  },
  profileModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  profileModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '100%',
  },
  profileOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  closeProfileModalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  closeProfileModalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  notesContainer: {
    flex: 1,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  noteContainer: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginRight: 10,
    width: 130,
    height: 80,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
  },
  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  pinButton: {
    marginRight: 10,
  },
  deleteButton: {
    padding: 3,
    borderRadius: "30px",
    marginBottom: 15,
    backgroundColor: '#ff5252',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 10,
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
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalPicker: {
    width: '50%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonClose: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#007bff',
  },
});

export default App;
