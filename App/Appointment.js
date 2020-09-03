import React from 'react'
import { View, StyleSheet, Text, Modal, Button, ScrollView, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native'
import * as firebase from 'firebase'
import { AntDesign, Octicons, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

class Appointment extends React.Component {
    state = {
        appoints: [], loading: false, visibleStat: false, docMood: false, docModal: false, existAppoints: true,
        docName: '', docPhone: false, docDate: '', docTime: '', docLoc: '', docStatus: false, docFee: '', docUid: '', docRegion: [],

    }
    componentDidMount() {
        this.startup();
    }

    startup = async () => {
        await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
            .get().then(ss => {
                this.setState({ appoints: ss.data().appointment })
            })
        if (firebase.auth().currentUser.photoURL !== null) {
            this.setState({ docMood: true })
        }
        if (this.state.appoints.length === 0) {
            this.setState({ existAppoints: false })
        }
    }

    indexFinder = (uid) => {
        if (this.state.docMood === false) {
            let a = this.state.appoints.findIndex(function (tod) { return tod.docUid === uid })
            return a;
        }
        else {
            let a = this.state.appoints.findIndex(function (tod) { return tod.pUid === uid })
            return a;
        }
    }

    showAppoint = (i) => {
        let userIndex = this.indexFinder(i);

        this.setState({
            docName: this.state.appoints[userIndex].docName, docPhone: this.state.appoints[userIndex].docPhone, docTime: this.state.appoints[userIndex].apTime
            , docDate: this.state.appoints[userIndex].apDate, docLoc: this.state.appoints[userIndex].docAddress, docStatus: this.state.appoints[userIndex].pending,
            docFee: this.state.appoints[userIndex].docFee, docUid: this.state.appoints[userIndex].docUid, docRegion: this.state.appoints[userIndex].docRegion,
        })
        this.setState({ visibleStat: true })


    }
    callMaker = (phoneNumber) => {
        if (Platform.OS === 'android') {
            Linking.openURL('tel:' + phoneNumber)
        }
        else {
            Linking.openURL('telprompt:' + phoneNumber)
        }
    }

    confirm = (uid) => {
        Alert.alert("Confirm Delete", 'Are you sure to delete this appointment', [{ text: 'Delete', onPress: this.state.docMood ? () => this.cancelAppointmentDoc(uid) : () => this.cancelAppointment(uid) }, { text: 'Cancel', onPress: () => { return; } }])
    }
    cancelAppointmentDoc = async (pUid) => {
        let dArr, pArr = [];
        dArr = this.state.appoints
        await firebase.firestore().collection('users').doc(pUid)
            .get().then(ss => {
                pArr = ss.data().appointment;
            })
        pArr = pArr.filter(function (g) { return g.docUid !== firebase.auth().currentUser.uid })
        dArr = dArr.filter(function (g) { return g.pUid !== pUid })
        try {
            await firebase.firestore().collection('users').doc(pUid).set({
                appointment: pArr,
            }, { merge: true })
            await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
                appointment: dArr,
            }, { merge: true })
            alert("Appointment deleted");
            this.setState({ appoints: dArr })
        } catch (error) {
            alert(error.message)
        }


    }

    cancelAppointment = async (docUid) => {
        this.setState({ loading: true });
        let pArr = this.state.appoints;
        let dArr = [];

        await firebase.firestore().collection('users').doc(docUid)
            .get().then(ss => {
                dArr = ss.data().appointment;
            })
        pArr = pArr.filter(function (g) { return g.docUid !== docUid })
        dArr = dArr.filter(function (g) { return g.pUid !== firebase.auth().currentUser.uid })

        try {
            await firebase.firestore().collection('users').doc(docUid).set({
                appointment: dArr,
            }, { merge: true })
            await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
                appointment: pArr,
            }, { merge: true })
            alert("Appointment deleted with " + this.state.docName);
            this.startup()
        } catch (error) {
            alert(error.message)
        }
        this.setState({ appoints: pArr, visibleStat: false, loading: false })
    }

    acceptAppoint = async (pUid) => {
        let dIndex = this.indexFinder(pUid)
        let dArr = this.state.appoints;
        dArr[dIndex].pending = false;
        let pArr = [];
        await firebase.firestore().collection('users').doc(pUid)
            .get().then(ss => {
                pArr = ss.data().appointment;
            })
        let pIndex = pArr.findIndex(function (tod) { return tod.docUid === firebase.auth().currentUser.uid })
        pArr[pIndex].pending = false;
        try {
            await firebase.firestore().collection('users').doc(pUid).set({
                appointment: pArr,
            }, { merge: true })
            await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
                appointment: dArr,
            }, { merge: true })
            alert('You Approved this Appointment');
            this.callFunction();
        } catch (error) {
            alert('An Error Occurred. Try Again')
        }
    }

    render() {
        return (
            <View style={styles.appoint}>
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Appointments</Text>
                </LinearGradient>
                <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>
                    <Text style={{ marginTop: 20 }} />

                    {
                        this.state.existAppoints ? null : <Text style={{ fontSize: 20, width: '80%', alignSelf: 'center' }}>Not appointments yet. Get appointments in 'Find Doctor' section.</Text>
                    }
                    <ScrollView >
                        {
                            this.state.appoints.map(e =>
                                <View>
                                    {
                                        //doctor Mood------------------------------------
                                        this.state.docMood ?
                                            <View style={styles.card}>
                                                <View style={{ margin: 10 }}>
                                                    <Text style={{ fontFamily: 'serif', fontSize: 20 }}>{e.pName} </Text>
                                                    <TouchableOpacity onPress={() => this.callMaker(e.pPhone)}>
                                                        <AntDesign name="phone" size={32} color="green" />
                                                    </TouchableOpacity>
                                                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                                        <Octicons name='location' size={20} color='green' />
                                                        <Text > {e.cAppoint ? "At Clinic" : "At Hospital"}</Text>
                                                    </View>
                                                    <View>
                                                        {e.pending ?
                                                            <TouchableOpacity style={styles.btn} onPress={() => this.acceptAppoint(e.pUid)}>
                                                                <Text>Accept</Text>
                                                            </TouchableOpacity>
                                                            : null
                                                        }
                                                    </View>
                                                </View>
                                                <View style={{ margin: 10 }}>
                                                    <View>
                                                        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: -8, marginRight: -8 }} onPress={() => this.confirm(e.pUid)}>
                                                            <AntDesign name="closesquare" size={32} color="red" />
                                                        </TouchableOpacity>
                                                        {e.pending ? <Text style={{ height: 20, alignSelf: 'flex-start', textAlign: 'center', color: 'white', marginVertical: 5, backgroundColor: '#6A6B6A', borderRadius: 30, width: 80 }}>Pending</Text>
                                                            : <Text style={{ height: 20, alignSelf: 'flex-start', textAlign: 'center', color: 'white', marginVertical: 5, backgroundColor: '#289EC2', borderRadius: 30, width: 80 }}>Approved</Text>

                                                        }
                                                    </View>
                                                    <Text >{e.apTime}</Text>
                                                    <Text >{e.apDate}</Text>


                                                </View>
                                            </View>

                                            //patient mood-------------------------------
                                            : <View style={styles.card}>
                                                <View style={{ margin: 10 }}>
                                                    <Text style={{ fontFamily: 'serif', fontSize: 20 }}>{firebase.auth().currentUser.displayName}</Text>
                                                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                                        <Octicons name='location' size={20} color='green' />
                                                        <Text > {e.docAddress}</Text>
                                                    </View>
                                                    <TouchableOpacity style={styles.btn} onPress={() => this.showAppoint(e.docUid)}>
                                                        <Text>View Appointment</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ margin: 10 }}>
                                                    <View>
                                                        {e.pending ? <Text style={{ height: 20, alignSelf: 'flex-start', textAlign: 'center', color: 'white', marginVertical: 5, backgroundColor: '#6A6B6A', borderRadius: 30, width: 80 }}>Pending</Text>
                                                            : <Text style={{ height: 20, alignSelf: 'flex-start', textAlign: 'center', color: 'white', marginVertical: 5, backgroundColor: '#289EC2', borderRadius: 30, width: 80 }}>Approved</Text>
                                                        }
                                                    </View>
                                                    <Text >{e.apTime}</Text>
                                                    <Text >{e.apDate}</Text>

                                                </View>
                                            </View>
                                    }
                                </View>
                            )
                        }
                    </ScrollView>
                </LinearGradient>

                {/* Modal Appointment detail patient */}
                <Modal onRequestClose={() => this.setState({ visibleStat: false })} animationType="fade" animated={true} visible={this.state.visibleStat} >
                    <View style={styles.header} >
                        <TouchableOpacity onPress={() => this.setState({ visibleStat: false })} style={{ height: 60, justifyContent: 'center' }}>
                            <AntDesign style={{ marginLeft: 15 }} name='arrowleft' size={20} />
                        </TouchableOpacity>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Your Appointment</Text>
                        <TouchableOpacity onLongPress={() => alert('Call Doctor')} style={{ marginRight: 10 }} onPress={() => this.callMaker(this.state.docPhone)} >
                            <AntDesign name="phone" size={26} color='green' />
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <View style={{ marginVertical: 12 }} >
                            <Text style={styles.label}>Patient</Text>
                            <Text style={styles.elements}>{firebase.auth().currentUser.displayName}</Text>
                        </View>
                        <View style={{ marginVertical: 12 }} >
                            <Text style={styles.label}>Doctor</Text>
                            <Text style={styles.elements}>{this.state.docName}</Text>
                        </View>
                        <View style={{ marginVertical: 12 }} >
                            <Text style={styles.label}>Time and Date</Text>
                            <Text style={styles.elements}>{this.state.docTime} & {this.state.docDate} </Text>
                        </View>
                        <View style={{ marginVertical: 12 }} >
                            <Text style={styles.label}>Doctor Fee</Text>
                            <Text style={styles.elements}>Rs. {this.state.docFee}  </Text>
                        </View>
                        <View style={{ marginVertical: 12 }} >
                            <Text style={styles.label}>Address</Text>
                            <View style={styles.element1} >
                                <Text style={{paddingHorizontal:20}} ><Octicons name='location' size={18} color='green' /> {this.state.docLoc}</Text>
                                <TouchableOpacity style={{ marginRight: 10, width: 32,marginTop:-10, }} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + this.state.docRegion[0] + ',' + this.state.docRegion[1])}  >
                                    <MaterialIcons name='directions' size={32} color='#E68B4B' />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            this.state.loading ? <ActivityIndicator size="large" /> :
                                <TouchableOpacity style={{ marginVertical: 12, height: 30, borderRadius: 35, width: 140, backgroundColor: '#CC4444', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.confirm(this.state.docUid)}>
                                    <Text style={{ color: 'white' }} >Cancel Appointment</Text>
                                </TouchableOpacity>
                        }

                    </View>

                </Modal>

            </View>
        )
    }
}

export default Appointment;

const styles = StyleSheet.create({
    appoint: {
        flex: 1,
    },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        height: 58, borderBottomColor: 'black', borderBottomWidth: 1,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 5, backgroundColor: 'white'
    },

    card: {
        marginVertical: 8, marginHorizontal: 21, width: '90%', flexDirection: 'row', justifyContent: "space-between",
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 5,
        elevation: 2,
        borderRadius: 15, backgroundColor: '#FFFFFF'
    },
    label: {
        marginBottom: -8, fontSize: 12, alignSelf: 'flex-start', color: '#2CA2C7', marginLeft: 10,
    },
    elements: {
        width: 290, height: 25,
        borderBottomColor: '#2CA2C7', borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: 10,
        fontSize: 15,
        borderRadius: 30,
        paddingHorizontal: 20,
    },
    element1: {
        width: 290, height: 25, flexDirection: 'row',justifyContent:'space-between',
        borderBottomColor: '#2CA2C7', borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: 10,
        borderRadius: 30,
       
    },
    btn: {
        width: 140,
        height: 30,
        marginTop: 5,
        fontSize: 15,
        borderRadius: 30,
        backgroundColor: '#AEDCBB',
        justifyContent: 'center', alignItems: 'center',
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
        backgroundColor: '#E6E6E6'
    }
})