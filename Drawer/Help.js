import React from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, Linking } from 'react-native'
import { SimpleLineIcons, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


class Help extends React.Component {

    callMaker = () => {
        if (Platform.OS === 'android') {
            Linking.openURL('tel:03417971791')
        }
        else {
            Linking.openURL('telprompt:03417971791')
        }
    }

    mailSender = () => {
        Linking.openURL('mailto:dontelife_fsd528@gmail.com')
    }

    render() {
        return (
            <View >
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center' }}>Help</Text>
                </LinearGradient>
                <LinearGradient colors={['#E6E6E6', '#E6E6E6']} style={styles.bottom} >
                    <Text style={{ marginTop: 20 }}></Text>
                    <Text style={styles.head}>Contact us</Text>

                    <Text style={styles.body}>	Need Help?</Text>
                    <View style={{ width: '50%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around' }} >
                        <TouchableOpacity style={styles.btn} onPress={() => this.callMaker()}>
                            <SimpleLineIcons color="white" name="call-out" size={32} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={()=>this.mailSender()} >
                            <Entypo color="white" name="email" size={32} />
                        </TouchableOpacity>
                    </View>
                    {/* Contactdonatelife@gmail.com */}

                    <Text style={styles.head}>Get updates</Text>

                    <Text style={styles.body}>	For more updates Follow us on Facebook or visit our website.</Text>

                    <Text style={styles.body}><Entypo name="facebook" color="blue" size={24} />/technologyzer</Text>
                    <TouchableOpacity onPress={() => { Linking.openURL('http:\\www.technologyzer.com') }}>
                        <Text style={{ textAlign: 'center', alignSelf: 'center', marginVertical: 15, fontSize: 18, width: '56%', borderBottomWidth: 1, borderColor: '#2CA2C7', color: '#2CA2C7' }}>	www.technologyzer.com</Text>
                    </TouchableOpacity>
                </LinearGradient>

            </View>
        )
    }
}

export default Help;

const styles = StyleSheet.create({
    about: {
        flex: 1, alignItems: 'center', margin: 15, justifyContent: 'center'
    },
    menu: {
        marginTop: 25, flexDirection: 'row', width: '57%', justifyContent: "space-between",
    },
    head: {
        fontSize: 24, textAlign: 'center', alignSelf: 'center',

    },
    body: {
        textAlign: 'center', alignSelf: 'center', marginVertical: 15, fontSize: 18, width: '70%',
    },
    icon: { color: 'white' },

    btn: {
        width: 60, height: 60, fontSize: 15, flexDirection: 'row',
        borderRadius: 30, backgroundColor: '#4B94C7', marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // alignSelf: 'center',
    },
    top: {
        position: 'relative', flexDirection: 'row',
        width: "100%", height: '14%',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems: 'center', justifyContent: 'center'
    },
    bottom: {
        marginTop: 10,
        position: 'relative',
        width: "100%", height: "86%",
        //  borderBottomLeftRadius:70,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: '#E6E6E6',
    }
})