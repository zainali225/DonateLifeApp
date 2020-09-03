import React from 'react'
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native'
import * as firebase from 'firebase'
import 'firebase/firebase-firestore'
import { ScrollView } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@expo/vector-icons'

class Profile extends React.Component {
    state = {
        name: false, phone: '', email: '', blood: '', bloodDate: 0, qualify: '', experi: '', clinicMood: false, userPhone: '', region: [],
        cAddress: '', cPhone: '', cFrom: "", cDays: '', cTo: '', speciality: '', donor: true, avatar: false,
        medName: '', medAddress: '', medDays: '', medFrom: '', medTo: '', adminMood: false, medPhone: '',
        err: '', cRegion: [], medRegion: [], city: '',
    };

    componentDidMount() {
        this.startup()
    }

    startup = () => {
        let uid = firebase.auth().currentUser.uid
        var storageRef = firebase.storage().ref('avatar/' + uid);

        if (firebase.auth().currentUser.email === 'admin@donatelife.com') {
            this.setState({ adminMood: true });
        }
        storageRef.getDownloadURL().then((url) => {
            this.setState({ avatar: url })
        }).catch((error) => {

            alert('An error occurred');
            return;
        })

        try {
            firebase.firestore().collection('users').doc(uid)
                .get().then(ss => {

                    this.setState({ name: ss.data().name })
                    this.setState({ phone: ss.data().emergency })
                    this.setState({ blood: ss.data().blood })
                    this.setState({ bloodDate: ss.data().bloodDate })
                    this.setState({ region: ss.data().region })
                    this.setState({ userPhone: ss.data().userPhone })
                    if (firebase.auth().currentUser.photoURL !== null) {
                        this.setState({ donor: false })
                        this.setState({ medAddress: ss.data().medAddress })
                        this.setState({ medPhone: ss.data().medPhone })
                        this.setState({ medName: ss.data().medName })
                        this.setState({ medTo: ss.data().medTo })
                        this.setState({ medFrom: ss.data().medFrom })
                        this.setState({ medDays: ss.data().medDays })
                        this.setState({ speciality: ss.data().speciality })
                        this.setState({ experi: ss.data().experience })
                        this.setState({ qualify: ss.data().qualifications })
                        this.setState({ city: ss.data().city })
                        this.setState({ medRegion: ss.data().medRegion })

                        if (ss.data().cMood !== false) {
                            this.setState({ clinicMood: true })
                            this.setState({ cAddress: ss.data().cAddress })
                            this.setState({ cPhone: ss.data().cPhone })
                            this.setState({ cFrom: ss.data().cFrom })
                            this.setState({ cTo: ss.data().cTo })
                            this.setState({ cDays: ss.data().cDays })
                            this.setState({ cRegion: ss.data().cRegion })
                        }
                    }
                })

        } catch (error) {
            alert('Error occurred try again')
        }

        if (this.state.bloodDate === 0) {
            this.setState({ bloodDate: 'Never' })
        }
        else {
            let a = this.dayNumber();
            a = a - this.state.bloodDate;
            this.setState({ bloodDate: a + ' days ago' })
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
    markDone = () => {
        let day = this.dayNumber()
        try {
            firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
                bloodDate: day,
            }, { merge: true })
            //   Alert.alert('Mark Done', 'Operation successful', [{ text: 'OK', onPress: this.startup() }])

        } catch (error) {
            alert('An error occurred')
        }
    }

    render() {

        return (

            <LinearGradient colors={["white", "white",]} >
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <Text style={{ color: 'white', fontSize: 20, }}>Profile</Text>
                </LinearGradient>
                <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>
                    <Text style={{ marginTop: -10 }} />
                    {
                        this.state.name ?
                            <ScrollView contentContainerStyle={{ width: '80%', }} showsVerticalScrollIndicator={false} >
                                {
                                    this.state.adminMood ? <TouchableOpacity onPress={() => this.props.navigation.navigate('AdminPanel')} style={{ alignSelf: 'flex-end', borderColor: '#2CA2C7', borderWidth: 1, borderTopRightRadius: 20, borderBottomLeftRadius: 20, paddingHorizontal: 20 }}><Text>Admin Panel</Text></TouchableOpacity> : null
                                }
                                <Image style={{ marginTop: 10, width: 70, height: 70, borderRadius: 50, alignSelf: 'center' }} source={this.state.avatar ? { uri: this.state.avatar } : require('../assets/user.png')} />
                                <Text style={styles.label}>Name</Text>
                                <View style={styles.element} >
                                    <Text style={styles.text}>{this.state.name}</Text>
                                </View>
                                <Text style={styles.label}>Your Phone</Text>
                                <View style={styles.element} >
                                    <Text style={styles.text}>{this.state.userPhone}</Text>
                                </View>
                                <Text style={styles.label}>Emergency Phone</Text>
                                <View style={styles.element} >
                                    <Text style={styles.text}>{this.state.phone}</Text>
                                </View>
                                <Text style={styles.label}>Blood</Text>
                                <View style={styles.element} >
                                    <Text style={styles.text}>{this.state.blood}</Text>
                                </View>
                                <Text style={styles.label}>Last Blood Date</Text>

                                <View style={styles.element1}>
                                    <Text style={styles.text1}>{this.state.bloodDate}</Text>
                                    <TouchableOpacity onPress={() => this.markDone()} style={{ height: '100%', width: '30%', borderTopRightRadius: 30, borderBottomRightRadius: 30, backgroundColor: '#E68B4B', justifyContent: 'center', alignItems: 'center' }} ><Text style={{ color: 'white', fontSize: 16 }}>Set Today</Text></TouchableOpacity>
                                </View>

                                <Text style={styles.label}>Location</Text>
                                <View style={styles.element} >
                                    <TouchableOpacity onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + this.state.region[0] + ',' + this.state.region[1])}  >
                                        <Text style={styles.text}>{this.state.region[2] ? this.state.region[2].substr(0, 18).replace(/(\r\n|\n|\r)/gm, " ") : 'View location'}</Text>
                                    </TouchableOpacity>

                                </View>
                                <Text style={{marginBottom:5}} />
                                {
                                    //doctor mood
                                    this.state.donor ? <Text style={{ marginBottom: 30 }} ></Text>
                                        :
                                        <View>
                                            <Text style={styles.title}>Hospital details</Text>
                                            <Text style={styles.label}>Speciality</Text>
                                            <View style={styles.element} >
                                                <Text style={styles.text}>{this.state.speciality}</Text>
                                            </View>
                                            {/* <Text style={styles.label}>Bio</Text>
                                            <Text style={styles.element}>{this.state.about}</Text> */}
                                            <Text style={styles.label}>Experience</Text>
                                            <View style={styles.element} >
                                                <Text style={styles.text}>{this.state.experi}</Text>
                                            </View>
                                            <Text style={styles.label}>qualifications</Text>
                                            <View style={styles.element} >
                                                <Text style={styles.text}>{this.state.qualify}</Text>
                                            </View>
                                            <Text style={styles.label}>Hospital Name</Text>
                                            <View style={styles.element} >
                                                <Text style={styles.text}>{this.state.medName}</Text>
                                            </View>
                                            <Text style={styles.label}>Hospital Address</Text>
                                            <View style={styles.element1} >
                                                <Text style={styles.text}>{this.state.medAddress}</Text>
                                                <TouchableOpacity style={{ marginRight: 10,width:32 }} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + this.state.region[0] + ',' + this.state.region[1])}  >
                                                    <MaterialIcons name='directions' size={32} color='#E68B4B' />
                                                </TouchableOpacity>
                                            </View>

                                            <Text style={styles.label}>Hospital contact no</Text>
                                            <View style={styles.element} >
                                                <Text style={styles.text}>{this.state.medPhone}</Text>
                                            </View>
                                            <Text style={styles.label}>Working Days</Text>
                                            <View style={styles.element} >
                                                <Text style={styles.text}>{this.state.medDays}</Text>
                                            </View>
                                            <Text style={styles.label}>Working Hours</Text>
                                            <View style={styles.element} >
                                                <Text style={styles.text}>{this.state.medFrom} - {this.state.medTo}</Text>
                                            </View>
                                            <Text style={{ marginBottom: 5 }} ></Text>
                                        </View>

                                }
                                {
                                    //clinic mood
                                    this.state.clinicMood ?
                                        <View>
                                            <Text style={styles.title} >Clinic details</Text>
                                            <Text style={styles.label}>Clinic Phone</Text>
                                            <View style={styles.element} >
                                                <Text style={styles.text}>{this.state.cPhone}</Text>
                                            </View>
                                            <Text style={styles.label}>Clinic Address</Text>
                                            <View style={styles.element1} >
                                                <Text style={styles.text}>{this.state.cAddress}</Text>
                                                <TouchableOpacity style={{ marginRight: 10,width:32 }} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + this.state.region[0] + ',' + this.state.region[1])}  >
                                                    <MaterialIcons name='directions' size={32} color='#E68B4B' />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.label}>Clinic Days</Text>
                                            <View style={styles.element} >
                                                <Text style={styles.text}>{this.state.cDays}</Text>
                                            </View>
                                            <Text style={styles.label}>Clinic Hours</Text>

                                            <View style={styles.element} >
                                                <Text style={styles.text}>{this.state.cFrom} - {this.state.cTo}</Text>
                                            </View>
                                            <Text style={{ marginBottom: 30 }} />
                                        </View>
                                        : null
                                }

                            </ScrollView>
                            : <ActivityIndicator style={{ marginTop: '60%', justifyContent: 'center', alignContent: 'center' }} size='large' />
                    }
                </LinearGradient>
            </LinearGradient>
        )
    }
}
export default Profile;
const styles = StyleSheet.create({

    element: {
        width: 280, height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 30,
        paddingHorizontal: 10, marginBottom: 10,
        borderColor: '#2CA2C7',//"#D9ECF1",
        backgroundColor: '#F2F2F2', justifyContent: 'center',
    },
    element1: {
        width: 280, height: 50, flexDirection: 'row',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 30,
        marginBottom: 10,
        borderColor: '#2CA2C7',//"#D9ECF1",
        backgroundColor: '#F2F2F2', justifyContent: 'space-between', alignItems: 'center',
    },
    label: {
        fontSize: 10, paddingHorizontal: 20, color: '#2CA2C7'
    },
    text: {
        paddingHorizontal: 10, fontSize: 17,
    },
    text1: {
        paddingHorizontal: 20, fontSize: 17,
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
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: '#E6E6E6',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        color: '#2CA2C7', alignSelf: 'center', marginBottom: 5, marginTop: 5,
    }
});