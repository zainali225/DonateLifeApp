import React, { useState, Component } from 'react'
import { ActivityIndicator, Button, Text, Image, TextInput, View, StyleSheet, Keyboard, Modal, TouchableOpacity } from 'react-native'
import * as firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient'
import { Feather, AntDesign } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';


class Login extends React.Component {
    state = {
        email: '', password: '', secureText: true, iconTitle: 'eye-off', pColor: '#A5D7E7', hint: '', compare: '',
        err: '', loading: false, forgetMood: false, emergency: '', newPass: false,
    }

    signIn = () => {
        if (this.state.email === '') {
            alert('Please enter Email'); return;
        }
        if (this.state.password === '') {
            alert('Please enter Password'); return;
        }
        if (this.state.password.length < 6) {
            alert('Weak Password'); return;
        }

        this.setState({ loading: true })
        Keyboard.dismiss();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch(error => this.setState({ err: error.message, loading: false }))
        //  .then(() => this.finishing());
    }
    // finishing = () => {
    //     firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    //         .get().then(ss => {
    //             if (ss.exists) {
    //                 this.props.navigation.navigate('main');
    //             }
    //             else {
    //                 this.props.navigation.navigate('ad');
    //             }
    //         })

    // }

    googleSign = async () => {
        this.setState({ loading: true });
        try {
            const result = await Google.logInAsync({
                androidClientId: '103533904717-e677un547vc3cm6qm57ntg8glioavbnp.apps.googleusercontent.com',
                iosClientId: '103533904717-r9jjknb5vgh9q1thssaqir4q1f23t0vf.apps.googleusercontent.com',
                scopes: ['email'],
            });

            if (result.type === 'success') {
                var cred = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
                firebase.auth().signInAndRetrieveDataWithCredential(cred)
                    .then(() => this.props.navigation.navigate('App'));
            } else {
                this.setState({ loading: false })
            }
        } catch (e) {
            alert('An Error Occurred')
        }
    }

    sendEmail = () => {
        try {
            firebase.auth().sendPasswordResetEmail(this.state.email).then(alert('Email is sent. Check to Verify Email'))
            this.setState({ forgetMood: false })
        } catch (error) {
            alert('Error occurred try again');
        }

    }

    render() {
        return (
            <LinearGradient colors={["#E6E6E6", "white",]} >
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Sign in</Text>
                </LinearGradient>

                {/* Login Mood */}
                <LinearGradient colors={['#E6E6E6', '#E6E6E6']} style={styles.bottom} >
                    <Text style={{ marginTop: 10 }} />

                    <TextInput placeholderTextColor={this.state.pColor} placeholder="Email" onChangeText={email => this.setState({ email })}
                        autoCapitalize='none' returnKeyType="next" onSubmitEditing={() => this.passTextInput.focus()} keyboardType='email-address' style={styles.elements}></TextInput>

                    <View style={styles.elements} >
                        <TextInput style={{ width: '90%' }} placeholderTextColor={this.state.pColor} placeholder="Password" onChangeText={password => this.setState({ password })}
                            secureTextEntry={this.state.secureText} autoCapitalize='none' ref={(pass) => { this.passTextInput = pass; }}  ></TextInput>
                        <TouchableOpacity style={{ justifyContent: 'center', height: '100%' }} onPress={() => this.setState({ secureText: !this.state.secureText })} >
                            <Feather name={this.state.secureText ? 'eye-off' : 'eye'} color="#516593" size={24} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => this.signIn()} >
                        <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.btn}>
                            <Text style={{ color: 'white', textAlign: 'center' }}>Sign in</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ forgetMood: true })} style={{ width: 250, height: 25 }}>
                        <Text style={{ alignSelf: 'flex-end', color: '#344566' }}>Forgot password?</Text>
                    </TouchableOpacity>

                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.googleSign()} style={[styles.google]}>
                            <Image resizeMode='contain' style={{ width: '12%', marginRight: 10 }} source={require('../assets/google.png')} />
                            <Text style={{ color: '#516593' }}  >Sign in with google</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('phoneAuth')} style={styles.google}>
                            <View style={{ width: '12%', marginRight: 10 }} >
                                <Feather name="smartphone" size={25} color="red" />
                            </View>
                            <Text style={{ color: '#516593' }}  >Sign in with phone</Text>

                        </TouchableOpacity>

                        {
                            this.state.loading ? <ActivityIndicator size="large" /> : <Text style={{ color: 'red', textAlign: 'center' }} >{this.state.err}</Text>
                        }
                    </View>
                </LinearGradient>

                {/* FogetMood */}
                <Modal onRequestClose={() => this.setState({ forgetMood: false })} visible={this.state.forgetMood} >
                    <LinearGradient style={styles.topModal} colors={['#E86C63', "#E68B4B"]}>
                        <View style={{ marginTop: -10, width: '91%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => this.setState({ forgetMood: false })} >
                                <AntDesign name='arrowleft' size={20} color="white" />
                            </TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 20 }}>Forgot password</Text>
                            <Text></Text>
                        </View>
                    </LinearGradient>
                    <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>


                        <TextInput style={styles.elements} keyboardType="email-address" autoCapitalize="none"
                            placeholder="Enter Email" onChangeText={(email) => this.setState({ email })}
                            value={this.state.email}
                        />
                        <TouchableOpacity onPress={() => this.sendEmail()} >
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.btn}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>Send Reset Email</Text>
                            </LinearGradient>
                        </TouchableOpacity>



                    </LinearGradient>
                </Modal>

            </LinearGradient >

        )
    }
}

export default Login;


const styles = StyleSheet.create({

    card: {
        alignContent: 'center', alignItems: 'center', margin: 30, backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.5,
        elevation: 2,
        borderRadius: 10,
    },
    elements: {
        width: 280, height: 50, flexDirection: 'row', justifyContent: 'space-between',
        borderWidth: StyleSheet.hairlineWidth,
        margin: 15,
        borderRadius: 30,
        paddingHorizontal: 10,
        borderColor: "#2CA2C7", backgroundColor: '#F2F2F2'
    },
    btn: {
        alignContent: 'center',
        justifyContent: 'center',
        width: 160,
        height: 37,
        marginVertical: 10,
        borderRadius: 30,
        overflow: 'hidden',
    },
    google: {
        alignContent: 'center', flexDirection: 'row',
        justifyContent: 'space-evenly', alignItems: 'center',
        width: 220,
        height: 50,
        borderColor: "#516593",
        borderWidth: 1,
        margin: 10,

        borderRadius: 30,
        overflow: 'hidden',
        flexDirection: 'row',
        paddingHorizontal: 15,

    },
    top: {
        position: 'relative', flexDirection: 'row',
        width: "100%", height: 91,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems: 'center', justifyContent: 'center'
    },
    bottom: {
        marginTop: 10, alignItems: 'center',
        position: 'relative',
        width: "100%", height: "86%",
        //  borderBottomLeftRadius:70,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    topModal: {
        position: 'relative', flexDirection: 'row',
        width: "100%", height: 73,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems: 'center', justifyContent: "center"
    },

})