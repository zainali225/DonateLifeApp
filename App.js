import React, { useState } from 'react';
import Splash from './screens/Splash';
import { decode, encode } from 'base-64'
import Login from './screens/Login'
import Register from './screens/Register'
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import * as firebase from 'firebase'
import Main from './App/Main';
import AddData from './components/AddData'
import PhoneAuth from './screens/PhoneAuth'

const AppStack = createStackNavigator({
  main: { screen: Main, navigationOptions: { headerTransparent: 'true', headerTitle: '', headerLeft: null } },
  ad: { screen: AddData, navigationOptions: { headerLeft: null, headerTransparent: 'true', headerTitle: '' } },
})

const AuthStack = createStackNavigator({
  register: { screen: Register, navigationOptions: { headerTransparent: true, headerTitle: '', headerTintColor: 'white' } },
  login: { screen: Login, navigationOptions: { headerTransparent: true, headerTitle: '', headerTintColor: 'white' } },
  phoneAuth: { screen: PhoneAuth, navigationOptions: { headerTransparent: true, headerTitle: '', headerTintColor: 'white' } },

})

const Controller = createAppContainer(
  createSwitchNavigator({
    splash: Splash,
    App: AppStack,
    Auth: AuthStack,

  },
    {
      initialRouteName: "splash"
    }
  )
);
export default function App() {
  return (
    <Controller />
  )
}

var firebaseConfig = {
  apiKey: "AIzaSyDpKBKLc6ozahZnWNSnIxY7BWOaEcgc4wA",
  authDomain: "donatelifeapp-9fe2d.firebaseapp.com",
  databaseURL: "https://donatelifeapp-9fe2d.firebaseio.com",
  projectId: "donatelifeapp-9fe2d",
  storageBucket: "donatelifeapp-9fe2d.appspot.com",
  messagingSenderId: "103533904717",
  appId: "1:103533904717:web:3a4fcb2c3782737a34ed04",
  measurementId: "G-D1H36V337V"
};
firebase.initializeApp(firebaseConfig);



if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }