import React, { useState, Component } from 'react'
import { View, StyleSheet, Image, Text, Button, Modal, ActivityIndicator, ImageBackground } from 'react-native';
import Login from './Login';
import * as firebase from 'firebase'
import { LinearGradient } from 'expo-linear-gradient';

class Splash extends React.Component {
    state = {
        addData: false, drawer: false, mood: false, authMood: false
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
                    .get().then(ss => {
                        if (!(ss.exists)) {
                            this.props.navigation.navigate('ad');
                        }
                        else {
                            this.props.navigation.navigate('main');
                        }
                    })
            }
            else {

                this.props.navigation.navigate("Auth");
            }
        });

        // if (user) {
        //    alert(user)
        // } else {

        // }
        // try {
        //     firebase.firestore().collection('users').doc(firebase.auth())
        //         .get().then(ss => {
        //             if (!(ss.exists)) {
        //                 //  this.props.navigation.navigate('ad');
        //                 this.setState({ addData: true })
        //             }
        //             else {
        //                 this.setState({ addData: false })
        //             }
        //         })

        // } catch (error) {
        //     alert(error.message);

        // }
        // firebase.auth().onAuthStateChanged(user => {
        //     this.props.navigation.navigate(user ? this.state.addData?'ad':'main' : "Auth")
        // })
    }

    render() {
        return (

            <ImageBackground style={styles.splash} source={require('../assets/splash.png')}>

                {/* <Image style={styles.logo} source={require('../assets/logo.png')} ></Image> */}


                <ActivityIndicator style={{ marginTop: 250, }} size="large" color='#DB7649' />
            </ImageBackground>
        )
    }
}

export default Splash;
const styles = StyleSheet.create({
    splash: {

        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red'
    },
    logo: {
        width: 200,
        height: 200,
    }

})