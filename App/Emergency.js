import React from 'react'
import { View, StyleSheet, Text, Linking, Button, ActivityIndicator, TouchableOpacity, Animated, Alert } from 'react-native'
import * as lib_location from 'expo-location'
import * as SMS from 'expo-sms'
import { LinearGradient } from 'expo-linear-gradient';
import * as firebase from 'firebase';

class Emergency extends React.Component {
    state = {
        err: '',
        loc: {}, emergency: '',
        loading: false,
        fadeAnim: new Animated.Value(5),
    }
    componentDidMount() {
        try {
            let uid = firebase.auth().currentUser.uid;
            firebase.firestore().collection('users').doc(uid)
                .get().then(ss => {
                    this.setState({ emergency: ss.data().emergency })
                })
            this.fadeOut()
        } catch (error) {
            alert('An Error Occured While Loading, Try Again')
        }
    }


    getLocation = async () => {
        this.setState({ loading: true })
        let { status } = await lib_location.requestPermissionsAsync();
        if (status !== 'granted') {
            alert("You denied to share your Location")
        }

        let location = await lib_location.getCurrentPositionAsync({});
        this.setState({ loc: location })
        let result = SMS.sendSMSAsync(this.state.emergency, 'https://www.google.com/maps/search/?api=1&query=' + location.coords.latitude + ',' + location.coords.longitude);
        this.setState({ loading: false, fadeAnim: new Animated.Value(5) })
    }

    fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 1000
        }).start();
        setTimeout(() => {
            this.fadeOut()
        }, 2000);

    };

    fadeOut = () => {
        // Will change fadeAnim value to 0 in 5 seconds
        Animated.timing(this.state.fadeAnim, {
            toValue: 0,
            duration: 2000
        }).start();
        setTimeout(() => {
            this.fadeIn()
        }, 2000);

        // setTimeout(() => {
        //     this.getLocation()
        // }, 2000);

    };

    render() {
        return (
            <View style={styles.emergency} >
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Emergency</Text>
                </LinearGradient>
                <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>

                    {/* <Text>{JSON.stringify(this.state.loc)}</Text> */}
                    {
                        this.state.loading ? <ActivityIndicator size="large" />
                            :
                            <Animated.View style={[{ opacity: this.state.fadeAnim }]} >
                                <TouchableOpacity style={styles.item} onPress={() => { this.getLocation() }}>
                                    <LinearGradient colors={['#F37070', "#D74343"]} style={styles.gradient} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}  >
                                        <Text style={{ color: 'white' }}>Send Location</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                    }
                </LinearGradient>
            </View>
        )
    }
}

export default Emergency;

const styles = StyleSheet.create({
    gradient: { width: '100%', height: '100%', borderRadius: 80, justifyContent: 'center', alignItems: 'center' },

    item: {
        height: 160, width: 160, justifyContent: 'center', alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.5,
        elevation: 1,

    },
    top: {
        position: 'relative',
        width: "100%", height: '14%',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottom: {
        marginTop: 10,
        position: 'relative',
        width: "100%", height: "86%",
        //  borderBottomLeftRadius:70,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: '#E6E6E6',
        justifyContent: 'center', alignItems: 'center',

    }

})