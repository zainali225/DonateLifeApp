import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Button, ActivityIndicator, Image, ToastAndroid } from 'react-native'
import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";


export default () => {

    const recaptchaVerifier = React.useRef(null);
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [verificationId, setVerificationId] = React.useState();
    const [verificationCode, setVerificationCode] = React.useState();
    const [mail, setEmail] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [message, setMessage] = useState({ text: false });
    const [loading, setLoading] = React.useState(false);

    const confirmCode = async () => {
        setLoading(true)
        try {
            const credential = await firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
            await firebase.auth().signInWithCredential(credential)
                .catch((err) => setMessage({ text: "Code is Invalid" }))
        }
        catch (error) {
            setMessage({ text: `Error: ${err.message}`, color: "red" })
            setLoading(false)
        }
    }


    const sendCode = async () => {
        if (phoneNumber === ''||phoneNumber.length!==13) {
            alert('Invalid number'); return;
        }
        setLoading(true)
        try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            setMessage({ text: "Verification code has been sent to your phone." });
            setLoading(false)
        } catch (err) {
            setMessage({ text: `Error: ${err.message}`, color: "red" });
            setLoading(false);
        }

    }



    return (
        <LinearGradient colors={["#E6E6E6", "white",]} >
            <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center' }}>Phone Authentication</Text>
            </LinearGradient>
            <FirebaseRecaptchaVerifierModal cancelLabel="Move back" 
                firebaseConfig={firebase.app().options} ref={recaptchaVerifier} />
            <LinearGradient colors={['#E6E6E6', '#E6E6E6']} style={styles.bottom} >

                {loading ?
                    <View style={styles.card} >
                        <Text style={{ fontSize: 20, color: '#A5D7E7', alignItems: 'center' }}>Verification</Text>
                        <TextInput placeholderTextColor='#A5D7E7' keyboardType="decimal-pad" placeholder="Enter Verify Code" onChangeText={setVerificationCode}
                            autoCapitalize='none' style={styles.elements}></TextInput>
                        <TouchableOpacity onPress={confirmCode} >
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.btn}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>Verify your Number</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    :
                    //Create Account
                    <View style={styles.card}>

                        <TextInput placeholder="+921234567890" placeholderTextColor='#A5D7E7' onChangeText={phone => setPhoneNumber(phone)}
                            autoCapitalize='none' keyboardType="number-pad" style={styles.elements}></TextInput>
                        <TouchableOpacity onPress={sendCode} >
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.btn}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>Send Code</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                }
                <View style={{ alignContent: "center", margin: 10 }} >
                    {
                        loading ? <ActivityIndicator size="large" /> : <Text style={{ color: 'red' }} >{message.text}</Text>
                    }
                </View>
            </LinearGradient>
        </LinearGradient >
    )
}




const styles = StyleSheet.create({

    card: {
        alignContent: 'center', alignItems: 'center', margin: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.5,
        elevation: 2,
        borderRadius: 10,
        height: 200, backgroundColor: 'white'
    },
    elements: {
        width: 250, height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        margin: 15,
        fontSize: 20,
        borderRadius: 30,
        paddingHorizontal: 10,
        borderColor: "#A5D7E7",
    },
    btn: {
        alignContent: 'center',
        justifyContent: 'center',
        width: 160,
        height: 37,
        margin: 5,
        fontSize: 20,
        borderRadius: 30,
        overflow: 'hidden',
    },
    google: {
        alignContent: 'center', flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
        width: 200,
        height: 50,
        borderColor: 'black',
        borderWidth: 2,
        margin: 15,
        fontSize: 20,
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