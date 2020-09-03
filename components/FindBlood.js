import React from 'react'
import { StyleSheet, Picker, View, Alert, Text, ActivityIndicator, Dimensions, Platform, Linking, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import * as firebase from 'firebase'
import 'firebase/firebase-firestore'
import { AntDesign, MaterialIcons, Octicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as lib_location from 'expo-location'


class FindBlood extends React.Component {

    state = {
        isLoading: false, blood: false, city: false, showRes: false, doners: [], bloodDate: false, region: [], region: []
    }
    componentDidMount() {
        this.getLocation()
    }

    getLocation = async () => {
        let { status } = await lib_location.requestPermissionsAsync();
        if (status !== 'granted') {
            alert("You denied to share your location");
            return;
        }
        let a = [];
        let location = await lib_location.getCurrentPositionAsync({});
        a[0] = location.coords.latitude;
        a[1] = location.coords.longitude;
        this.setState({ region: a })
    }

    findBlood = async () => {
        if (this.state.city === '') { this.setState({ city: false }) }
        this.setState({ doners: [], isLoading: true })

        let currentDay = this.dayNumber();
        let getDay = currentDay - 90;
        if (getDay <= 0) {
            let positiveDay = Math.abs(getDay);
            getDay = 360 - positiveDay;
        }

        this.setState({ bloodDate: getDay })
        if (this.state.blood === false) {
            alert('Please Select Blood');
            this.setState({ isLoading: false })
            return;
        }
        let a = this.state.region;

        try {
            await firebase.firestore().collection('users').where("blood", "==", this.state.blood).where('doner', '==', true).get().then((ss) => {
                ss.forEach(doc => {
                    if (doc.data().bloodDate <= getDay) {
                        if (doc.data().name !== firebase.auth().currentUser.displayName) {

                            this.setState({
                                doners: [...this.state.doners, {
                                    name: doc.data().name, phone: doc.data().userPhone, blood: doc.data().blood,
                                    uid: doc.data().uid, distance: distanceFinder(a[0], a[1], doc.data().region[0], doc.data().region[1])
                                }], isLoading: false, region: doc.data().region,
                            })
                        }
                    }
                })
            })
        } catch (err) {
            alert('An error occurred. Try again');
            this.setState({ isLoading: false })
        }
        function distanceFinder(x1, y1, x2, y2) {
            let x = Math.abs(x2 - x1)
            let y = Math.abs(y2 - y1)
            let ans = Math.sqrt(x * x + y * y) * 100;
            return ans.toFixed(2);
        }

        //sorting according to distance
        let srt = this.state.doners;
        srt = srt.sort(function (a, b) {
            return a.distance - b.distance;
        })


        this.setState({ isLoading: false, showRes: true, doners: srt })

    }

    doSMS = (donerPhone) => {
        Linking.openURL('sms:' + donerPhone)
    }
    doPhone = (donerPhone) => {
        if (Platform.OS === 'android') {
            Linking.openURL('tel:' + donerPhone)
        }
        else {
            Linking.openURL('telprompt:' + donerPhone)
        }
    }

    dayNumber = () => {
        let date = new Date();
        let month = date.getMonth();
        date = date.getDate();
        let dayNumber = month * 30 + date;
        if (month === 0) { dayNumber = date; }
        return dayNumber;
    }

    render() {
        return (
            <View style={styles.find} >
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Find Blood</Text>
                </LinearGradient>
                <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>

                    <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>

                        <View style={styles.picker} >
                            <Picker mode="dropdown" selectedValue={this.state.blood} onValueChange={blood => this.setState({ blood })}   >
                                <Picker.Item label='Blood' color="#2CA2C7" />
                                <Picker.Item label='A+' value='A+' color="#2CA2C7" />
                                <Picker.Item label='A-' value='A-' color="#2CA2C7" />
                                <Picker.Item label='B+' value='B+' color="#2CA2C7" />
                                <Picker.Item label='B-' value='B-' color="#2CA2C7" />
                                <Picker.Item label='O+' value='O+' color="#2CA2C7" />
                                <Picker.Item label='O-' value='O-' color="#2CA2C7" />
                                <Picker.Item label='AB+' value='AB+' color="#2CA2C7" />
                                <Picker.Item label='AB-' value='AB-' color="#2CA2C7" />
                            </Picker>

                            {/* <TextInput style={styles.city} placeholderTextColor="#A5D7E7" placeholder="Enter City" onChangeText={city => this.setState({ city })} /> */}
                        </View>
                        {
                            this.state.isLoading ? <ActivityIndicator size="large" /> :
                                <TouchableOpacity style={styles.btn} onPress={() => this.findBlood()}>
                                    <Text style={{ color: 'white' }}>Find</Text>
                                </TouchableOpacity>
                        }
                        {
                            this.state.showRes ?
                                this.state.doners.map((s) =>
                                    <View style={styles.card}>
                                        <View style={{ margin: 10 }}>
                                            <Text style={{ fontFamily: 'serif', fontSize: 20 }}>{s.name} </Text>
                                            <Text style={{ backgroundColor: '#F8ACAC', borderRadius: 5, textAlign: 'center', width: 30, marginTop: 5 }}>{s.blood}</Text>
                                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                                <Octicons name='location' size={20} color='green' />
                                                <Text > {s.distance}kms</Text>
                                            </View>
                                        </View>

                                        <View style={{ margin: 10, justifyContent: 'space-between' }}>
                                            <TouchableOpacity onPress={() => this.doPhone(s.phone)}>
                                                <AntDesign name="phone" size={34} color="#2CA2C7" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.btnViewLocation} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + this.state.region[0] + ',' + this.state.region[1])} >
                                            <Octicons name='location' size={20} color='green' />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.doSMS(s.phone)}>
                                                <MaterialIcons name="textsms" size={34} color="#2CA2C7" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                                : null
                        }
                        <Text style={{ marginBottom: 50 }} />
                    </ScrollView>
                </LinearGradient>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 12, width: '80%', justifyContent: "space-between", flexDirection: 'row',
        shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, shadowOpacity: 5, elevation: 2,
        borderRadius: 8, backgroundColor: '#FFFFFF'
    },

    btn: {
        width: "40%", height: 30, marginTop: 5, fontSize: 15, alignSelf: 'center',
        borderRadius: 30, backgroundColor: '#2CA2C7', justifyContent: 'center', alignItems: 'center',
    },

    picker: {
        justifyContent: 'center', alignSelf: 'center',
        borderRadius: 30, borderWidth: 1, borderColor: "#2CA2C7",
        width: '30%', height: 30, margin: 10,
    },
    city: {
        margin: 10, marginLeft: -8,
        borderRadius: 30, borderWidth: 1, borderColor: '#2CA2C7',
        width: 150, height: 30, paddingHorizontal: 10
    },
    top: {
        position: 'relative',
        width: "100%", height: Dimensions.get('window').height * 14 / 100,
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
        alignSelf: 'center', alignItems: 'center'

    }
})
export default FindBlood;