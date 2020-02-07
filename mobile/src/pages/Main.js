import React from 'react';
import {SafeAreaView, StyleSheet, Image, View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

import {TouchableOpacity} from 'react-native-gesture-handler';

export default function Main({route, navigation}) {
  const {user: id} = route.params;

  const [devs, setDevs] = React.useState([]);

  React.useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {user: id},
      });

      setDevs(response.data);
    }

    loadUsers();
  }, [id]);

  async function handleLike() {
    const [dev, ...rest] = devs;
    await api.post(`/devs/${dev._id}/likes`, null, {
      headers: {
        user: id,
      },
    });

    setDevs(rest);
  }

  async function handleDislike(id) {
    const [dev, ...rest] = devs;
    await api.post(`/devs/${dev._id}/dislikes`, null, {
      headers: {
        user: id,
      },
    });

    setDevs(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>

      {devs.length !== 0 ? (
        <>
          <View style={styles.cardsContainer}>
            {devs.map((dev, index) => (
              <View
                key={dev._id}
                style={[styles.cards, {zIndex: devs.length - index}]}>
                <Image style={styles.avatar} source={{uri: dev.avatar}} />
                <View style={styles.footer}>
                  <Text style={styles.name}>{dev.name}</Text>
                  <Text style={styles.bio} numberOfLines={4}>
                    {dev.bio}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleDislike}>
              <Image source={dislike} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLike}>
              <Image source={like} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View>
            <Text style={styles.empty}>Acabou =(</Text>
          </View>
          <View></View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    marginTop: 30,
  },
  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  },
  cards: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  avatar: {
    flex: 1,
    height: 300,
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 60,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
