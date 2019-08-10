import React, { useState , useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, SafeAreaView, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';


import api from '../services/api';

import logo from '../assets/logo.png';
import likeImage from '../assets/like.png';
import dislikeImage from '../assets/dislike.png';

export default function Main({ navigation }) {
    const id = navigation.getParam('user')

    const [users, setUsers] = useState([]); 

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id
                }
            })

            setUsers(response.data);
        }

        loadUsers();
    }, [id]);

    async function handleLike() {
        const [user, ... rest ] = users;
        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id }
        })

        setUsers(rest);
    }

    async function handleDislike() {
        const [user, ... rest ] = users;
        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id }
        })

        setUsers(rest);
    }

    async function handleLogout() {
        await AsyncStorage.clear();
        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image source={logo} style={ styles.logo } />
            </TouchableOpacity>
            <View style={styles.cardsContainer}>
                { users.length == 0 ? 
                 <Text style={styles.empty}>Acabou :(</Text>
                : (
                    users.map((user, index) => (
                        <View key={user._id} style={[styles.card, {zIndex: users.length - index }]}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                        ))
                )
                }
                
            </View>

            {/* Like/Dislike buttons */}
            { users.length > 0 && (
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleDislike}>
                    <Image source={dislikeImage} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLike}>
                    <Image source={likeImage} />
                </TouchableOpacity>
            </View> 
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    logo: {
        marginTop: 30
    },
    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500
    },

    avatar: {
        flex: 1,
        height: 300
    },

    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 16,
        overflow: 'hidden',
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },

    footer:  {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15
    },

    name: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333'
    },

    bio: {
        fontSize: 14,
        color: '#999',
        lineHeight: 18
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },

    button: {
        height: 50,
        width:50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        // Sombra em Android
        elevation: 2,
        // Sombra em iOS
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    }
})

