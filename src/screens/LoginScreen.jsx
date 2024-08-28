// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [register, setRegister] = useState(false);



  const handleSubmit = () => {
    addNote();
  };





  const handleLogin = () => {
    // Verificar se o usuário e senha estão corretos
    if (username === 'admin' && password === '123') {
      // Navegar para a tela de notas
      navigation.navigate('Notes');
    } else {
      alert('Usuário ou senha incorretos');
    }
  };




  const handleRegister = () => {
    // Verificar se o cadastro foi realizado com sucesso
    if (username && email && password && confirmPassword) {
      if (password === confirmPassword) {
        // Cadastro realizado com sucesso, navegar para a tela de notas
        navigation.navigate('Notes');
      } else {
        alert('Senhas não conferem');
      }
    } else {
      alert('Preencha todos os campos');
    }
    setRegister(true);
  };




 

  if (register) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry={true}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleRegister} 
>
          <Text style={styles.buttonText} onSubmitEditing={handleSubmit}>Cadastrar</Text>
          
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderColor: '#007bff',
    borderWidth: 1,
  },
  registerButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default LoginScreen;