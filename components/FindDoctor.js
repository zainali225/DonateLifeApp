import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Modal, BackHandler, Image, Linking, TouchableOpacity, YellowBox, ToastAndroid, ActivityIndicator } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons'
import * as firebase from 'firebase'
import DateTimePicker from '@react-native-community/datetimepicker'
import { RELATIONSHIPS } from 'expo-contacts';

YellowBox.ignoreWarnings(['Setting a timer']);

class FindDoctor extends React.Component {

    state = {
        special: ['Allergy Specialist', 'Audiologist Specialist', 'Cancer Specialist', 'Cardiologist', 'Counselor', 'Dentist',
            'Dermatologist', 'Diabetologist', 'Dietition/Nutritionist', 'Ent Specialist', 'Eye Specialist', 'Gastroenterologist',
            'Genecologist', 'Hepatologist', 'Homeopath', 'Liver Specialist', 'Neurologist', 'Pain Specialist', 'Pathologist', 'Pediatrician',
            'Physiotherapist', 'Psychiatrist', 'Psychologist', 'Lung Specialist', 'Radiologist', 'Rheumatologist', 'Sexologist'],
        doctors: [], pArr: [], dArr: [], userPhone: '',
        showModal: false, docProfile: [false], cPhone: '', cDays: '', cAddress: '', cFrom: '', cTo: '', cFee: '', dAppointment: [], pAppointment: [],
        nextuid: [], loading: false, pPhone: '', docDays: '', docName: '', docTime: '', docUid: '', apDate: 'Pick Date', apTime: 'Pick Time',
        medDays: '', medFee: '', medTo: '', medFrom: '', medAddress: '', medName: '', medPhone: false,medRegion:[],cRegion:[],
        showMood: false, profileMood: false, appointMood: false, timeMood: false, cMood: false, cAppoint: false,docRegion:[],
    }
    index = 0; Innindex = 0; docLength = 0

    showResults = (searchKey) => {
        this.setState({ showModal: true, doctors: [], nextuid: [] })
        this.Innindex = 0; this.index = 0;
        firebase.firestore().collection('users').where('speciality', '==', searchKey).get().then((ss) => {
            this.docLength = ss.size;
            ss.forEach(doc => {

                this.setState({
                    doctors: [...this.state.doctors, {
                        uid: doc.data().uid, name: doc.data().name, speciality: doc.data().speciality,
                        city: doc.data().city, qualifications: doc.data().qualifications,
                        experience: doc.data().experience, index: this.Innindex, phone: doc.data().medPhone,
                    }]
                })
                this.Innindex = this.Innindex + 1;
            })
        })
    }

    ima = (uid, i) => {

        if (this.state.nextuid.length >= this.docLength) { return; }
        else {
            var storageRef = firebase.storage().ref('avatar/' + uid);

            storageRef.getDownloadURL().then((url) => {
                if (this.state.nextuid.indexOf(url) !== -1) { return; }
                let a = this.state.nextuid;
                a[i] = url;
                this.setState({ nextuid: a });
            })
            this.index = this.index + 1;
        }
    }
    showProfile = (searchUid, i) => {
        this.setState({ profileMood: true, docProfile: [] })
        this.setState({ cMood: false, cPhone: '', cAddress: '', cDays: '', cFee: '', cFrom: '', cTo: '' })

        firebase.firestore().collection('users').doc(searchUid).get().then(doc => {
            this.setState({
                docProfile: [...this.state.docProfile, {
                    uid: doc.data().uid, name: doc.data().name, speciality: doc.data().speciality, about: doc.data().about,
                    city: doc.data().city, qualifications: doc.data().qualifications, experience: doc.data().experience,
                    index: i,
                }]
                , medDays: doc.data().medDays, medTo: doc.data().medTo, medFrom: doc.data().medFrom, medFee: doc.data().medFee, medAddress: doc.data().medAddress,
                docName: doc.data().name, medName: doc.data().medName, docUid: doc.data().uid, medPhone: doc.data().medPhone, dAppointment: doc.data().appointment,
                userPhone: doc.data().userPhone,medRegion:doc.data().medRegion,
            }

            )
            if (doc.data().cMood === true) {
                this.setState({ cMood: true, cAddress: doc.data().cAddress, cPhone: doc.data().cPhone, cFrom: doc.data().cFrom })
                this.setState({ cTo: doc.data().cTo, cDays: doc.data().cDays, cFee: doc.data().cFee ,cRegion:doc.data().cRegion})
            }
        })
    }

    callMaker = (phoneNumber) => {
        if (Platform.OS === 'android') {
            Linking.openURL('tel:' + phoneNumber)
        }
        else {
            Linking.openURL('telprompt:' + phoneNumber)
        }
    }

    onTime = (event, value) => {

        this.setState({ showMood: false })
        if (this.state.timeMood === true) {
            let getTime = value;
            let time = getTime.toTimeString();
            let mint = time[3] + time[4];
            let hour = time[0] + time[1];
            let gotHour = parseInt(hour);
            if (gotHour > 12 || gotHour === 0) {
                if (gotHour === 0) {
                    let pm = 12 + ":" + mint + " AM";
                    getTime = pm;
                }
                else {
                    let correct = gotHour - 12;
                    let pm = correct + ":" + mint + " PM"
                    getTime = pm;
                }
            }
            else {
                if (gotHour === 12) {
                    let pm = time[0] + time[1] + ":" + mint + " PM";
                    getTime = pm; this.setState({ apTime: getTime }); return;
                }
                let am = time[0] + time[1] + ":" + mint + " AM";
                getTime = am
            }
            this.setState({ apTime: getTime })
        }
        else {
            this.setState({ apDate: value.toDateString() })
        }

    }

    onModalShow = (mood) => {

        this.setState({ appointMood: true, cAppoint: mood })
        try {
            firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
                .get().then(ss => {
                    this.setState({ pAppointment: ss.data().appointment, pPhone: ss.data().userPhone })
                   if(this.state.cAppoint===false){
                       this.setState({docRegion:this.state.medRegion})
                    }
                    else{
                        this.setState({docRegion:this.state.cRegion})                      
                   }
                })
        } catch (error) {
            alert(error.message)
        }
       
    }

    checkAppoint = async () => {
        if (this.state.apTime==='Pick Time'||this.state.apDate==='Pick Date') { alert('Please Pick Date & Time'); this.setState({loading:false}); return; }

        this.setState({ loading: true })
        let docUid = this.state.docUid;
        let pUid = firebase.auth().currentUser.uid
        this.setAppointment();
        await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
            .get().then(ss => {
                this.state.pArr = ss.data().appointment;
            })

        await firebase.firestore().collection('users').doc(this.state.docUid)
            .get().then(ss => {
                this.state.dArr = ss.data().appointment;
            })

        let pIndex = this.state.pArr.findIndex(function (todo) {
            return todo.docUid === docUid
        })
        let dIndex = this.state.dArr.findIndex(function (todo) {
            return todo.pUid === pUid
        })
        if (dIndex === -1) {
            this.dappoint(docUid)
        }
        if (pIndex === -1) {
            this.pappoint(pUid)
        }

        if (dIndex !== -1 && pIndex !== -1) {
            alert('You Already Booked this Doctor');
            this.setState({ appointMood: false, profileMood: false, loading: false })

            return;
        }
        else {
            ToastAndroid.show('Your Appointment is Done', ToastAndroid.LONG);
            this.setState({ loading: false })
            this.props.navigation.navigate('Index');
        }



    }
    setAppointment = () => {
        
        this.setState({
            dAppointment: [...this.state.dAppointment, {
                pName: firebase.auth().currentUser.displayName, pPhone: this.state.pPhone, apDate: this.state.apDate, apTime: this.state.apTime,
                pUid: firebase.auth().currentUser.uid, pending: true, cAppoint: this.state.cAppoint
            }]
        })

        if (this.state.cAppoint === true) {

            this.setState({
                pAppointment: [...this.state.pAppointment, {
                    docName: this.state.docName, docAddress: this.state.cAddress, docPhone: this.state.cPhone, docFee: this.state.cFee, apDate: this.state.apDate,
                    apTime: this.state.apTime, docUid: this.state.docUid, pending: true, docRegion:this.state.docRegion
                }]
            })
        }

        else {
            let phone = this.state.medPhone;
            if (phone === undefined) { phone = false }
            this.setState({
                pAppointment: [...this.state.pAppointment, {
                    docName: this.state.docName, docAddress: this.state.medAddress, docPhone: phone, docFee: this.state.medFee,
                    apDate: this.state.apDate, apTime: this.state.apTime, docUid: this.state.docUid, pending: true,docRegion:this.state.docRegion
                }]
            })
        }
    }
    dappoint = (uid) => {
        firebase.firestore().collection('users').doc(uid).set({
            appointment: this.state.dAppointment,
        }, { merge: true })
    }
    pappoint = (uid) => {
        //firebase.auth().currentUser.uid
        firebase.firestore().collection('users').doc(uid).set({
            appointment: this.state.pAppointment,
        }, { merge: true });

    }

    render() {
        return (
            <LinearGradient colors={['white', "white",]} style={styles.findDoctor}>
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Choose Speciality</Text>
                </LinearGradient>
                <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>
                    <Text style={{ marginTop: 20 }} />

                    <ScrollView showsVerticalScrollIndicator={false} >
                        {
                            this.state.special.map((data) =>
                                <TouchableOpacity onPress={() => this.showResults(data)} style={styles.items}>

                                    <Text style={{ color: 'white', fontSize: 17, paddingHorizontal: 10 }}>{data}</Text>
                                    <AntDesign name='right' size={30} />
                                </TouchableOpacity>
                            )

                        }
                        <Text style={{ marginBottom: 50 }} />
                    </ScrollView>
                </LinearGradient>


                {/* Modal Choose Doctor */}
                <Modal  onRequestClose={() => this.setState({ showModal: false })} visible={this.state.showModal} >
                    <LinearGradient style={styles.topModal} colors={['#E86C63', "#E68B4B"]}>
                        <View style={{ flexDirection: 'row', width: '89%', justifyContent: 'space-between', marginTop: -20, marginLeft: -10 }} >
                            <TouchableOpacity onPress={() => this.setState({ showModal: false })} >
                                <AntDesign name='arrowleft' size={24} color="white" />
                            </TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 20 }}>Choose Doctor</Text>
                            <Text></Text>

                        </View>
                    </LinearGradient>
                    <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>
                        <Text style={{ marginTop: 20 }} />

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ alignItems: 'center' }}>

                                {

                                    this.state.doctors.map((doc) =>

                                        <View style={styles.card}>
                                            <View on style={{ flexDirection: 'row' }} >
                                                <Image onLoadEnd={() => this.ima(doc.uid, doc.index)} style={{ width: 80, height: 80, margin: 10 }} source={{ uri: this.state.nextuid[doc.index] }} />
                                                <View>
                                                    <Text style={{ fontSize: 18, margin: 10, fontWeight: 'bold', color: '#2CA2C7' }}>{doc.name}</Text>
                                                    <Text style={{ fontSize: 16, margin: 5, color: '#5F616D', paddingHorizontal: 5 }}>{doc.city}</Text>
                                                </View>
                                            </View>
                                            <Text style={{ paddingHorizontal: 20, marginTop: -5, color: "#5F616D" }}>{doc.speciality}</Text>
                                            <Text style={{ paddingHorizontal: 15, marginTop: 15, color: "#5F616D" }}>{doc.qualifications}</Text>
                                            <Text style={{ paddingHorizontal: 15, color: "#5F616D" }}>{doc.experience}</Text>
                                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                                <TouchableOpacity style={styles.btn} onPress={() => this.showProfile(doc.uid, doc.index)} >
                                                    <Text style={{ color: 'white' }} >View Profile</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={doc.phone ? () => this.callMaker(doc.phone) : () => this.showProfile(doc.uid, doc.index)} style={styles.btnRight} >
                                                    <Text style={{ color: '#4B94C7' }}>{doc.phone ? 'Call Now' : 'Book Appointment'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }
                            </View>
                            <Text style={{ marginBottom: 60 }} />
                        </ScrollView>
                    </LinearGradient>
                </Modal>

                {/* Modal Doctor Detail Profile */}
                <Modal onRequestClose={() => this.setState({ profileMood: false, docProfile: [] })} animationType='fade' visible={this.state.profileMood}>

                    <View>

                        <LinearGradient style={styles.topModal} colors={['#E86C63', "#E68B4B"]}>
                            <View style={{ flexDirection: 'row', width: '89%', justifyContent: 'space-between', marginTop: -20, marginLeft: -10 }} >
                                <TouchableOpacity onPress={() => this.setState({ profileMood: false })} >
                                    <AntDesign name='arrowleft' size={20} color="white" />
                                </TouchableOpacity>
                                <Text style={{ color: 'white', fontSize: 20 }}>Doctor Details</Text>
                                <Text></Text>
                            </View>
                        </LinearGradient>
                        <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>
                            <Text style={{ marginTop: 20 }} />

                            {
                                this.state.docProfile.map((doc) =>

                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <View style={{ flexDirection: 'row', margin: 10 }} >
                                            <Image style={{ width: 100, height: 100, margin: 10 }} source={{ uri: this.state.nextuid[doc.index] }} />
                                            <View>
                                                <Text style={{ fontSize: 18, margin: 10, fontWeight: 'bold', color: '#2CA2C7'}}>{doc.name}</Text>
                                                <Text style={{ fontSize: 16, margin: 10, color: '#5F616D' }}>{doc.city}</Text>
                                            </View>
                                        </View>
                                        <Text style={{ paddingHorizontal: 20, fontSize: 14, color: '#5F616D' }}>{doc.speciality}</Text>
                                        <Text style={{ paddingHorizontal: 20, fontSize: 14, color: '#5F616D' }}>{doc.qualifications}</Text>
                                        <Text style={{ paddingHorizontal: 20, fontSize: 14, color: '#5F616D' }}>{doc.experience}</Text>

                                        <View style={{ alignItems: 'flex-start', margin: 15, borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#2CA2C7' }} >
                                            <Text style={{ paddingHorizontal: 5, fontSize: 18, marginVertical: 4, color: '#784212' }}>{this.state.medName}</Text>
                                            <Text style={{ paddingHorizontal: 5, fontSize: 14, marginVertical: 2, color: '#5F616D' }}>{this.state.medAddress}</Text>
                                            <Text style={{ paddingHorizontal: 5, fontSize: 14, marginVertical: 2, marginLeft: 5, backgroundColor: '#AFD1E6', borderRadius: 5 }}>Rs. {this.state.medFee}</Text>
                                            <Text style={{ paddingHorizontal: 5, fontSize: 14, marginVertical: 2, color: '#5F616D' }}>{this.state.medDays}</Text>
                                            <Text style={{ paddingHorizontal: 5, fontSize: 14, marginVertical: 2, color: '#5F616D' }}>{this.state.medFrom} - {this.state.medTo}</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around',alignSelf:'center', }}>
                                                <TouchableOpacity onPress={() => this.onModalShow(false)} style={styles.btn} >
                                                    <Text style={{ alignSelf: 'center', color: 'white' }}>Book Appointment</Text>
                                                </TouchableOpacity>
                                                {this.state.medPhone ?
                                                    <TouchableOpacity onPress={() => this.callMaker(this.state.medPhone)} style={styles.btnRight} >
                                                        <Text style={{ color: '#4B94C7' }}>Call Now</Text>
                                                    </TouchableOpacity>
                                                    : null}
                                            </View>
                                        </View>
                                        <View >
                                            {
                                                // clinicMood
                                                this.state.cMood ?
                                                    <View style={{ marginTop: -10, alignItems: 'flex-start', margin: 15, borderTopWidth: StyleSheet.hairlineWidth, borderColor: 'black' }} >
                                                        <Text style={{ paddingHorizontal: 5, fontSize: 18, marginVertical: 4, color: '#262C6B' }}>{this.state.cFee ? 'Clinic Details' : null}</Text>
                                                        <Text style={{ paddingHorizontal: 5, fontSize: 14, marginVertical: 2, color: '#5F616D' }}>{this.state.cAddress}</Text>
                                                        {this.state.cFee ?
                                                            <Text style={{ paddingHorizontal: 5, fontSize: 14, marginVertical: 2, marginLeft: 5, backgroundColor: '#AFD1E6', borderRadius: 5 }}>Rs. {this.state.cFee}</Text>
                                                            : null}
                                                        <Text style={{ paddingHorizontal: 5, fontSize: 14, marginVertical: 2, color: '#5F616D' }}>{this.state.cDays}</Text>
                                                        <Text style={{ paddingHorizontal: 5, fontSize: 14, marginVertical: 2, color: '#5F616D' }}>{this.state.cFee ? this.state.cFrom + ' - ' + this.state.cTo : null}</Text>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around',alignSelf:'center' }}>
                                                            <TouchableOpacity onPress={() => this.onModalShow(true)} style={styles.btn} >
                                                                <Text style={{ alignSelf: 'center', color: 'white' }}>Book Appointment</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity onPress={() => this.callMaker(this.state.cPhone)} style={styles.btnRight} >
                                                                <Text style={{ color: '#4B94C7' }}>Call Now</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <Text style={{ marginBottom: 50 }} />
                                                    </View>
                                                    : null
                                            }
                                        </View>
                                    </ScrollView>
                                )
                            }
                        </LinearGradient>
                    </View>
                </Modal>

                {/* Modal Get Appointment */}
                <Modal onRequestClose={() => this.setState({ appointMood: false })} animationType='fade' animated={true} visible={this.state.appointMood}>
                    <LinearGradient style={styles.topModal} colors={['#E86C63', "#E68B4B"]}>
                        <View style={{ flexDirection: 'row', width: '89%', justifyContent: 'space-between', marginTop: -20, marginLeft: -10 }} >
                            <TouchableOpacity onPress={() => this.setState({ appointMood: false })} >
                                <AntDesign name='arrowleft' size={20} color="white" />
                            </TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 20 }}>Book Appointment</Text>
                            <Text></Text>
                        </View>
                    </LinearGradient>

                    <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>
                        <Text style={{ marginTop: 20 }} />

                        <View style={{width:'85%',alignSelf:'center'}} >
                          
                            <Text style={styles.label}>Patient</Text>
                            <Text style={styles.elements}>{firebase.auth().currentUser.displayName}</Text>
                            <Text style={styles.label}>Dr</Text>
                            <Text style={styles.elements}>{this.state.docName}</Text>

                            <View>
                                <Text style={styles.label}>{this.state.cAppoint ? 'Clinic Phone' : 'Hospital Name'}</Text>
                                <Text style={{ marginVertical: 15, fontSize: 15, marginBottom: 5, paddingHorizontal: 20, }}>{this.state.cAppoint ? this.state.cPhone : this.state.medName}</Text>
                                <Text style={styles.label}>Address</Text>
                                <Text style={{ marginVertical: 15, fontSize: 15, marginBottom: 5, paddingHorizontal: 20, }}>{this.state.cAppoint ? this.state.cAddress : this.state.medAddress}</Text>
                                <Text style={styles.label}>Doctor Fee</Text>
                                <Text style={{ marginVertical: 15, fontSize: 15, marginBottom: 5, paddingHorizontal: 20, }}>{this.state.cAppoint ? 'Rs. ' + this.state.cFee : 'Rs. ' + this.state.medFee}</Text>
                                <Text style={styles.label} >Doctor Hours</Text>
                                <Text style={{ marginVertical: 15, marginBottom: -10, fontSize: 15, paddingHorizontal: 20, }}>{this.state.cAppoint ? this.state.cDays : this.state.medDays}</Text>
                                <Text style={styles.elements}>{this.state.cAppoint ? this.state.cFrom + ' - ' + this.state.cTo : this.state.medFrom + ' - ' + this.state.medTo}</Text>
                            </View>


                            <View style={{ width: '100%',marginLeft:-5 ,height: 30 ,flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around'}}>
                                <TouchableOpacity onPress={() => this.setState({ showMood: true, timeMood: false })} style={{ justifyContent: 'center', height: 30, width: 120, borderRadius: 5, backgroundColor: '#A9CCE3', borderColor: 'tan', borderWidth: StyleSheet.hairlineWidth }} >
                                    <Text style={{ textAlign: 'center' }}>{this.state.apDate ? this.state.apDate.toString() : null}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ showMood: true, timeMood: true })} style={{ justifyContent: 'center', height: 30, width: 120, borderRadius: 5, backgroundColor: '#A9CCE3', borderColor: 'tan', borderWidth: StyleSheet.hairlineWidth }} >
                                    <Text style={{ textAlign: 'center' }}>{this.state.apTime ? this.state.apTime.toString() : null}</Text>
                                </TouchableOpacity>
                            </View>
                            {

                                this.state.showMood ?
                                    <DateTimePicker value={new Date()} mode={this.state.timeMood ? 'time' : 'date'} display={this.state.timeMood ? 'spinner' : 'calendar'}
                                        onChange={(a, value1) => this.onTime(a, value1)} />
                                    : null
                            }
                        </View>
                        <View >

                            {
                                this.state.loading ? <ActivityIndicator size='large' style={{marginTop:15}} /> :
                                    <TouchableOpacity onPress={() => this.checkAppoint()} style={styles.btn} >
                                        <Text style={{ color: 'white' }}>Book Appointment</Text>
                                    </TouchableOpacity>
                            }
                        </View>

                    </LinearGradient>
                </Modal>

            </LinearGradient >
        )
    }
}
export default FindDoctor;

const styles = StyleSheet.create({

    items: {
        marginVertical: 6, height: 40, justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', flexDirection: 'row',
        backgroundColor: '#4AB8DA', borderRadius: 30, width: '80%',
    },
    card: {
        margin: 15, width: "92%", marginBottom: -5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 5,
        //  borderColor: 'black',
        //  borderWidth: 0.5,
        elevation: 2,
        borderRadius: 10, backgroundColor: '#FFFFFF'
    },
    header: {
        flexDirection: 'row', alignItems: 'center',
        height: 58, borderBottomColor: 'black', borderBottomWidth: 1,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 5, backgroundColor: 'white'
    },
    elements: {
        width: 300,        height: 25,
        borderBottomColor: '#2CA2C7',        borderBottomWidth: StyleSheet.hairlineWidth,
        marginVertical: 10,
        fontSize: 15,
        borderRadius: 30,
        paddingHorizontal:20,
    },
    btn: {
        width: 130, height: 37, marginVertical: 10, fontSize: 15,
        borderRadius: 30, backgroundColor: '#2CA2C7',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
    },
    btnRight: {
        width: 130, height: 37, margin: 10, fontSize: 15,
        borderRadius: 30, borderColor: '#2CA2C7', borderWidth: 2,
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
    },
    label: {
        marginBottom: -12, paddingHorizontal: 10, fontSize: 12, color: '#2CA2C7'
    },
    top: {
        position: 'relative',
        width: "100%", height: '14%',
        borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
        alignItems: 'center', justifyContent: 'center'
    },
    bottom: {
        marginTop: 10,
        position: 'relative',
        width: "100%", height: "86%",
        borderTopLeftRadius: 50, borderTopRightRadius: 50,
        backgroundColor: '#E6E6E6',
    },
    topModal: {
        position: 'relative',
        width: "100%", height: '11.8%',
        borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
        alignItems: 'center', justifyContent: 'center'
    },

})