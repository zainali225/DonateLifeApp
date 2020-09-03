import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, ActivityIndicator, Image, Keyboard, Animated, ToastAndroid } from 'react-native'
import firebase, { auth } from 'firebase';
import * as Google from 'expo-google-app-auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather } from '@expo/vector-icons';


class Register extends React.Component {
    state = {
        name: '', email: '', pass: '',
        err: '', loading: false,
        secureText: true, pHolderEmail: 'Email', pHolderPass: 'Password',
        pColor: '#A5D7E7', fadeEmail: new Animated.Value(0), showEmail: false,
        fadePass: new Animated.Value(0), showPass: false
    }


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
            return { error: true };
        }
    }
    signUp = () => {
        Keyboard.dismiss();
        if (this.state.email === '') {
            alert('Please enter Email'); return;
        }
        if (this.state.pass === '') {
            alert('Please enter Password'); return;
        }
        if (this.state.pass.length < 6) {
            alert('Weak Password'); return;
        }

        this.setState({ loading: true })
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass)
            .catch(error => this.setState({ err: error.message, loading: false }))

    }

    render() {

        return (
            <LinearGradient colors={["#E6E6E6", "white",]} >
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center' }}>Sign up</Text>
                </LinearGradient>
                <LinearGradient colors={['#E6E6E6', '#E6E6E6']} style={styles.bottom} >
                    <Text style={{ marginTop: 10 }} />
                    <View >


                        <TextInput placeholder={this.state.pHolderEmail} placeholderTextColor={this.state.pColor} onChangeText={email => this.setState({ email })}
                            keyboardType="email-address" autoCapitalize='none' returnKeyType="next" onSubmitEditing={() => this.passTextInput.focus()} style={styles.elements}></TextInput>


                        <View style={styles.elements} >
                            <TextInput style={{ width: '90%' }} placeholderTextColor={this.state.pColor} placeholder={this.state.pHolderPass} onChangeText={pass => this.setState({ pass })}
                                secureTextEntry={this.state.secureText} ref={(pass) => { this.passTextInput = pass; }} autoCapitalize='none'  ></TextInput>
                            <TouchableOpacity style={{ justifyContent: 'center', height: '100%' }} onPress={() => this.setState({ secureText: !this.state.secureText })} >
                                <Feather name={this.state.secureText ? 'eye-off' : 'eye'} color="#516593" size={24} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => this.signUp()} >
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.btn}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>Sign up</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('login')} style={{ marginVertical: 15, }}>
                        <Text style={{ color: '#516593', }} >Already have an account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.googleSign()} style={styles.google}>
                        <Image resizeMode='contain' style={{ width: '12%', marginRight: 10 }} source={require('../assets/google.png')} />
                        <Text style={{ color: "#516593" }} >Sign up with google</Text>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('phoneAuth')} style={styles.google}>
                        <View style={{ width: '12%', marginRight: 10 }} >
                            <Feather name="smartphone" size={25} color="red" />
                        </View>
                        <Text style={{ color: "#516593" }} >Sign up with phone</Text>

                    </TouchableOpacity>
                    <View style={{ alignContent: "center", margin: 10 }} >
                        {
                            this.state.loading ? <ActivityIndicator size="large" /> : <Text style={{ color: 'red', textAlign: 'center' }} >{this.state.err}</Text>
                        }
                    </View>
                </LinearGradient >
            </LinearGradient >
        )
    }
}

export default Register;


const styles = StyleSheet.create({
    label: {
        fontSize: 12, paddingHorizontal: 30, color: '#2CA2C7',
        marginBottom: -13
    },
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
        width: 280, height: 50, flexDirection: 'row',
        borderWidth: StyleSheet.hairlineWidth,
        margin: 15,
        borderRadius: 30,
        paddingHorizontal: 10,
        borderColor: "#2CA2C7", backgroundColor: '#F2F2F2',
    },
    btn: {
        alignContent: 'center',
        justifyContent: 'center',
        width: 160,
        height: 37,
        borderColor: 'black',
        borderWidth: StyleSheet.hairlineWidth,
        margin: 15,
        alignSelf: 'center',
        borderRadius: 30,
        overflow: 'hidden',
    },
    google: {
        alignContent: 'center', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center',
        width: 220, height: 50,
        borderColor: "#516593", borderWidth: 1,
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
    }

})