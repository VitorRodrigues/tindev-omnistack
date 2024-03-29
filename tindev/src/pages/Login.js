import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    KeyboardAvoidingView,
    Text,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Platform
 } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';

export default function Login({ navigation }) {
    const [user, setUser] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                navigation.navigate('Main', { user })
            }
        })
    }, []) /* Deixa o array vazio para executar apenas no load da tela */

    async function handleLogin() {
        const response = await api.post('/devs', { username: user })
        const { _id } = response.data;

        console.log(_id)

        await AsyncStorage.setItem('user', _id);

        navigation.navigate('Main', { user: _id });
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior='padding'
            enabled={Platform.OS === 'ios'}
        >
            <Image source={logo} />
            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                value={user}
                onChangeText={setUser}
                placeholder="Digite seu usuário do Github"
             />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5' ,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30
    },
  
    input: {
      height: 48,
      alignSelf: 'stretch',
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      marginTop: 20,
      paddingHorizontal: 15
    },

    button: {
        height: 48,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
  });
  