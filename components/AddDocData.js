import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, Picker, ToastAndroid, ActivityIndicator, Keyboard, CheckBox, Modal, TouchableOpacity, Linking } from 'react-native'
import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient'
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as lib_location from 'expo-location'


class AddDocData extends React.Component {
    state = {
        city: '', speciality: '', qualify: '', experi: '', haveClinic: false, clinicPhone: '', cFee: '', clinicAddress: '', doner: false,
        err: '', loading: false, clinic: false, clinicdays: "", cFrom: 'From', cTo: 'To',
        cmon: false, ctue: false, cwed: false, cthu: false, cfri: false, csat: false, csun: false,
        medmon: false, medtue: false, medwed: false, medthu: false, medfri: false, medsat: false, medsun: false,
        getTime: "", toMood: false, fromMood: false, show: false, from: 'From', to: 'To',
        medName: '', medFee: '', medAddress: 'fsd', medTo: 'To', medFrom: 'From', medDays: '', clinicMood: false, fromMood: false,
        showMood: false, medFee: '', cFee: '', medPhone: false, pColor: '#A5D7E7', locationMood: false, cRegion: [], medRegion: [], region: [],
    }

    onTime = (event, value) => {

        this.setState({ getTime: value, showMood: false })
        let time = this.state.getTime.toTimeString();
        let mint = time[3] + time[4];
        let hour = time[0] + time[1];
        let gotHour = parseInt(hour);
        if (gotHour > 12 || gotHour === 0) {
            if (gotHour === 0) {
                let pm = 12 + ":" + mint + " AM";
                this.setState({ getTime: pm })
            }
            else {
                let correct = gotHour - 12;
                let pm = correct + ":" + mint + " PM"
                this.setState({ getTime: pm })
            }
        }
        else {
            if (gotHour === 12) {
                let pm = time[0] + time[1] + ":" + mint + " PM";
                this.setState({ getTime: pm });
            } else {
                let am = time[0] + time[1] + ":" + mint + " AM";
                this.setState({ getTime: am })
            }
        }
        if (this.state.clinicMood === true) {
            if (this.state.fromMood === true) {
                this.setState({ cFrom: this.state.getTime })
            }
            else {
                this.setState({ cTo: this.state.getTime })
            }
        }
        else {
            if (this.state.fromMood === true) {
                this.setState({ medFrom: this.state.getTime })
            }
            else {
                this.setState({ medTo: this.state.getTime })
            }
        }
        this.clinicDays();
        this.medDays();


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

    componentDidMount() {
        if (firebase.auth().currentUser.photoURL !== null) {
            ToastAndroid.show('You already Rregister as Doctor', ToastAndroid.LONG);
            console.log(firebase.auth().currentUser.phoneNumber)
            this.props.navigation.navigate('Index')
        }
        this.getLocation();
    }

    medDays = () => {
        let work = ""

        if (this.state.medmon === true) {
            work = work + 'Mon, '
        }
        if (this.state.medtue === true) {
            work = work + 'Tue, '
        }
        if (this.state.medwed === true) {
            work = work + 'Wed, '
        }
        if (this.state.medthu === true) {
            work = work + 'Thu, '
        }
        if (this.state.medfri === true) {
            work = work + 'Fri, '
        }
        if (this.state.medsat === true) {
            work = work + 'Sat, '
        }
        if (this.state.medsun === true) {
            work = work + 'Sun, '
        }
        this.setState({ medDays: work })
    }
    clinicDays = () => {
        let work = ""
        if (this.state.cmon === true) {
            work = work + 'Mon, '
        }
        if (this.state.ctue === true) {
            work = work + 'Tue, '
        }
        if (this.state.cwed === true) {
            work = work + 'Wed, '
        }
        if (this.state.cthu === true) {
            work = work + 'Thu, '
        }
        if (this.state.cfri === true) {
            work = work + 'Fri, '
        }
        if (this.state.csat === true) {
            work = work + 'Sat, '
        }
        if (this.state.csun === true) {
            work = work + 'Sun, '
        }
        this.setState({ clinicdays: work })

    }
    getMarker = (region) => {
        let a = [];
        a[0] = region.latitude;
        a[1] = region.longitude;
        this.setState({ region: a })
    }
    getPoint = (name, region) => {
        let a = [];
        a[0] = region.latitude;
        a[1] = region.longitude;
        a[2] = name;
        this.setState({ region: a })
    }
    setLocaion = () => {
        this.setState({ locationMood: false });
        let a=[];
        a[0]=this.state.region[0].toFixed(6);
        a[1]=this.state.region[1].toFixed(6);
        a[2]=this.state.region[2];
        if (this.state.clinicMood === false) {
            this.setState({ medRegion: a })
        }
        else {
            this.setState({ cRegion: a })
        }
    }
    saveData = () => {
        this.clinicDays();
        this.medDays();
        Keyboard.dismiss();
        this.setState({ loading: true })
        if (this.state.speciality === "" || this.state.experi === '' || this.state.qualify === '' || this.state.city === '' ||
            this.state.medName === '' || this.state.medAddress === '' || this.state.medDays === '' || this.state.medFrom === 'From' ||
            this.state.medTo === 'To' || this.state.medFee === '') {
            alert('All Fields are Required');
            this.setState({ loading: false })
            return;
        }
        if (this.state.clinicMood === true) {
            if (this.state.clinicPhone === '' || this.state.clinicdays === '' || this.state.clinicAddress === ''
                || this.state.cFrom === 'From' || this.state.cTo === 'To' || this.state.cFee === ''
            ) {
                alert('All Fields are Required from Clinic');
                this.setState({ loading: false })
                return;
            }
        }
        let uid = firebase.auth().currentUser.uid;
        let data = {
            doner: this.state.doner,
            city: this.state.city.trimRight(),
            qualifications: this.state.qualify.trimRight(),
            experience: this.state.experi.trimRight(),
            speciality: this.state.speciality.trimRight(),
            medName: this.state.medName.trimRight(),
            medAddress: this.state.medAddress.trimRight(),
            medDays: this.state.medDays,
            medFrom: this.state.medFrom,
            medTo: this.state.medTo,
            medFee: this.state.medFee,
            medPhone: this.state.medPhone,
            cMood: false, medRegion: this.state.medRegion,
            url: 'avatar/' + uid
        }
        let cData = {
            cAddress: this.state.clinicAddress.trimRight(),
            cPhone: this.state.clinicPhone.trimRight(),
            cDays: this.state.clinicdays,
            cFrom: this.state.cFrom,
            cTo: this.state.cTo,
            cFee: this.state.cFee,
            cMood: true, cRegion: this.state.cRegion,
        }
        try {
            firebase.firestore().collection('users').doc(uid).set(data, { merge: true }).then(firebase.auth().currentUser.updateProfile({ photoURL: 'avatar/' + uid }))

            if (this.state.clinicMood === true) {
                firebase.firestore().collection('users').doc(uid).set(cData, { merge: true });
            }
            ToastAndroid.show('Data Saved', 2000);
            this.props.navigation.navigate('Index');
        } catch (error) {
            alert('An error occrred try again')
            this.setState({ loading: false })
        }


    }
    finshing = () => {
        ToastAndroid.show("Data Saved", ToastAndroid.SHORT)
        firebase.auth().currentUser.updateProfile({ photoURL: 'avatar' });
        this.props.navigation.navigate('Index')
    }

    render() {
        return (
            <View>
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Add Your Details</Text>
                </LinearGradient>
                <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>
                    <Text style={{ marginTop: 5 }} />

                    <ScrollView showsVerticalScrollIndicator={false} style={{ width: 280 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }} >
                            <CheckBox value={this.state.doner} onChange={() => this.setState({ doner: !this.state.doner })} ></CheckBox>
                            <Text style={{ alignSelf: 'center' }}>Remain Doner</Text>
                        </View>
                        <View style={styles.picker}>
                            <Picker style={{ width: 240 }} selectedValue={this.state.speciality} mode="dropdown" onValueChange={speciality => this.setState({ speciality })}>
                                <Picker.Item label='Pick Specialist' />
                                <Picker.Item label='Allergy Specialist' value='Allergy Specialist' />
                                <Picker.Item label='Audiologist Specialist' value='Audiologist Specialist' />
                                <Picker.Item label='Cancer Specialist' value='Cancer Specialist' />
                                <Picker.Item label='Cardiologist' value='Cardiologist' />
                                <Picker.Item label='Counselor' value='Counselor' />
                                <Picker.Item label='Dentist' value='Dentist' />
                                <Picker.Item label='Dermatologist' value='Dermatologist' />
                                <Picker.Item label='Diabetologist' value='Diabetologist' />
                                <Picker.Item label='Dietition/Nutritionist' value='Dietition/Nutritionist' />
                                <Picker.Item label='Ent Specialist' value='Ent Specialist' />
                                <Picker.Item label='Eye Specialist' value='Eye Specialist' />
                                <Picker.Item label='Gastroenterologist' value='Gastroenterologist' />
                                <Picker.Item label='Genecologist' value='Genecologist' />
                                <Picker.Item label='Hepatologist' value='Hepatologist' />
                                <Picker.Item label='Homeopath' value='Homeopath' />
                                <Picker.Item label='Liver Specialist' value='Liver Specialist' />
                                <Picker.Item label='Neurologist' value='Neurologist' />
                                <Picker.Item label='Pain Specialist' value='Pain Specialist' />
                                <Picker.Item label='Pathologist' value='Pathologist' />
                                <Picker.Item label='Pediatrician' value='Pediatrician' />
                                <Picker.Item label='Physiotherapist' value='Physiotherapist' />
                                <Picker.Item label='Psychiatrist' value='Psychiatrist' />
                                <Picker.Item label='Psychologist' value='Psychologist' />
                                <Picker.Item label='Lung Specialist' value='Lung Specialist' />
                                <Picker.Item label='Radiologist' value='Radiologist' />
                                <Picker.Item label='Rheumatologist' value='Rheumatologist' />
                                <Picker.Item label='Sexologist' value='Sexologist' />
                                <Picker.Item label='Other' value='Other' />

                            </Picker>
                        </View>
                        <TextInput style={styles.elements} placeholder="City" placeholderTextColor={this.state.pColor} onChangeText={city => this.setState({ city })} />
                        <TextInput style={styles.elements} placeholder="Qualification" placeholderTextColor={this.state.pColor} onChangeText={qualify => this.setState({ qualify })} />
                        <TextInput style={styles.elements} placeholder="Experience" placeholderTextColor={this.state.pColor} onChangeText={experi => this.setState({ experi })} />

                        <View >

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10 }}>
                                <Text style={{ fontSize: 20, color: '#2CA2C7' }}>Hospital Details</Text>
                            </View>
                            <TextInput style={styles.elements} placeholderTextColor={this.state.pColor} placeholder="Hospital Name" onChangeText={medName => this.setState({ medName })} />
                            <TextInput style={styles.elements} placeholderTextColor={this.state.pColor} placeholder="Hospital Address" onChangeText={medAddress => this.setState({ medAddress })} />
                            <TextInput style={styles.elements} placeholderTextColor={this.state.pColor} placeholder="Hospital Phone {Optional}" onChangeText={medPhone => this.setState({ medPhone })} />
                            <View style={styles.element1}>
                                <TouchableOpacity style={styles.btnViewLocation} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + this.state.medRegion[0] + ',' + this.state.medRegion[1])} >
                                    <Text style={{ paddingHorizontal: 10, fontSize: 15, color: '#E68B4B' }}>{this.state.medRegion[2] ? this.state.medRegion[2].substr(0, 20).replace(/(\r\n|\n|\r)/gm, " ") : 'View location'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ locationMood: true, clinicMood: false })} style={styles.btnSetLocation} ><Text style={{ color: 'white', fontSize: 15 }}>Set location</Text></TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                <CheckBox value={this.state.medmon} onChange={() => this.setState({ medmon: !this.state.medmon })} /><Text style={styles.cBox}>Mon</Text>
                                <CheckBox value={this.state.medtue} onChange={() => this.setState({ medtue: !this.state.medtue })} /><Text style={styles.cBox}>Tue</Text>
                                <CheckBox value={this.state.medwed} onChange={() => this.setState({ medwed: !this.state.medwed })} /><Text style={styles.cBox}>Wed</Text>
                                <CheckBox value={this.state.medthu} onChange={() => this.setState({ medthu: !this.state.medthu })} /><Text style={styles.cBox} >Thu</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                <CheckBox value={this.state.medfri} onChange={() => this.setState({ medfri: !this.state.medfri })} /><Text style={styles.cBox}>Fri </Text>
                                <CheckBox value={this.state.medsat} onChange={() => this.setState({ medsat: !this.state.medsat })} /><Text style={styles.cBox}>Sat</Text>
                                <CheckBox value={this.state.medsun} onChange={() => this.setState({ medsun: !this.state.medsun })} /><Text style={styles.cBox}>Sun</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 8, marginLeft: 8 }}>
                                <Text style={{ fontSize: 20 }}>Fee:</Text>
                                <TextInput style={{ paddingHorizontal: 10, fontSize: 18, borderBottomColor: '#A5D7E7', borderBottomWidth: 1, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }} placeholderTextColor={this.state.pColor} placeholder="Enter Fee" keyboardType="number-pad" onChangeText={medFee => this.setState({ medFee })} />
                            </View>
                            <Text style={{ marginBottom: 10, marginLeft: 20, marginTop: 20 }} >Select Hospital Hours</Text>
                            <View style={styles.clinic} >
                                <TouchableOpacity style={styles.timer} onPress={() => this.setState({ showMood: true, clinicMood: false, fromMood: true })} >
                                    <Text style={{ fontSize: 20, color: '#2CA2C7' }} >{this.state.medFrom ? this.state.medFrom.toString() : 'From'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.timer} onPress={() => this.setState({ showMood: true, clinicMood: false, fromMood: false })}>
                                    <Text style={{ fontSize: 20, color: '#2CA2C7' }} >{this.state.medTo ? this.state.medTo.toString() : 'To'}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                        {/* clinic settings */}
                        {this.state.haveClinic ?
                            <View style={styles.card}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
                                    <Text style={styles.label}>Clinic Details</Text>
                                    <AntDesign color='red' name='close' size={25} onPress={() => this.setState({ haveClinic: false })} />
                                </View>
                                <TextInput style={styles.elements} placeholderTextColor={this.state.pColor} placeholder='Enter Clinic Phone' onChangeText={clinicPhone => this.setState({ clinicPhone })} />
                                <TextInput style={styles.elements} placeholderTextColor={this.state.pColor} placeholder="Enter Clinic Address" onChangeText={clinicAddress => this.setState({ clinicAddress })} />
                                <View style={styles.element1}>
                                    <TouchableOpacity style={styles.btnViewLocation} onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + this.state.medRegion[0] + ',' + this.state.medRegion[1])} >
                                        <Text style={{ paddingHorizontal: 10, fontSize: 15, color: '#E68B4B' }}>{this.state.cRegion[2] ? this.state.cRegion[2].substr(0, 20).replace(/(\r\n|\n|\r)/gm, " ") : 'View location'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.setState({ locationMood: true, clinicMood: true })} style={styles.btnSetLocation} ><Text style={{ color: 'white', fontSize: 15 }}>Set location</Text></TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                    <CheckBox value={this.state.cmon} onChange={() => this.setState({ cmon: !this.state.cmon })} /><Text style={styles.cBox}>Mon</Text>
                                    <CheckBox value={this.state.ctue} onChange={() => this.setState({ ctue: !this.state.ctue })} /><Text style={styles.cBox}>Tue</Text>
                                    <CheckBox value={this.state.cwed} onChange={() => this.setState({ cwed: !this.state.cwed })} /><Text style={styles.cBox}>Wed</Text>
                                    <CheckBox value={this.state.cthu} onChange={() => this.setState({ cthu: !this.state.cthu })} /><Text style={styles.cBox}>Thu</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                    <CheckBox value={this.state.cfri} onChange={() => this.setState({ cfri: !this.state.cfri })} /><Text style={styles.cBox}>Fri </Text>
                                    <CheckBox value={this.state.csat} onChange={() => this.setState({ csat: !this.state.csat })} /><Text style={styles.cBox}>Sat</Text>
                                    <CheckBox value={this.state.csun} onChange={() => this.setState({ csun: !this.state.csun })} /><Text style={styles.cBox}>Sun</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 8, marginLeft: 8 }}>
                                    <Text style={{ fontSize: 20 }}>Fee:</Text>
                                    <TextInput style={{ paddingHorizontal: 10, fontSize: 18, borderBottomColor: '#A5D7E7', borderBottomWidth: 1, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }} placeholderTextColor={this.state.pColor} placeholder="Enter Fee" keyboardType="number-pad" onChangeText={cFee => this.setState({ cFee })} />
                                </View>
                                <Text style={{ marginBottom: 10, marginLeft: 20, marginTop: 20 }} >Select Clinic Hours</Text>
                                <View style={styles.clinic} >
                                    <TouchableOpacity style={styles.timer} onPress={() => this.setState({ showMood: true, clinicMood: true, fromMood: true })} >
                                        <Text style={{ fontSize: 20, color: '#2CA2C7' }}>{this.state.cFrom ? this.state.cFrom.toString() : 'From'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.timer} onPress={() => this.setState({ showMood: true, clinicMood: true, fromMood: false })}>
                                        <Text style={{ fontSize: 20, color: '#2CA2C7' }} >{this.state.cTo ? this.state.cTo.toString() : 'To'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : <TouchableOpacity style={styles.haveClinic} onPress={() => this.setState({ haveClinic: true })}><Text style={{ textAlign: 'center', color: 'black' }}>Add Clinic</Text></TouchableOpacity>
                        }

                        {
                            this.state.showMood ?
                                <DateTimePicker value={new Date()} mode={"time"} display="spinner"
                                    onChange={(a, value1) => this.onTime(a, value1)} />
                                : null
                        }

                        {
                            this.state.loading ? <ActivityIndicator size="large" /> :
                                <TouchableOpacity onPress={() => this.saveData()}>
                                    <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.btn}>
                                        <Text style={{ color: 'white', textAlign: 'center' }}>Regitser As a Docotor</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                        }
                        <Text style={{ marginBottom: 60 }} />

                    </ScrollView>
                </LinearGradient>

                {/*Modal     locationMood  */}
                <Modal onRequestClose={() => this.setState({ locationMood: false })} visible={this.state.locationMood} >
                    <LinearGradient style={styles.topModal} colors={['#E86C63', "#E68B4B"]}>
                        <View style={{ flexDirection: 'row', width: '89%', justifyContent: 'space-between', marginTop: -20, marginLeft: -10 }} >
                            <TouchableOpacity onPress={() => this.setState({ showModal: false })} >
                                <AntDesign name='arrowleft' size={24} color="white" />
                            </TouchableOpacity>
                            <Text style={{ color: 'white', fontSize: 20 }}>Set Location</Text>
                            <Text></Text>
                        </View>
                    </LinearGradient>
                    <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>
                        <MapView
                            initialRegion={{ latitude: this.state.region[0], longitude: this.state.region[1], latitudeDelta: 0.01, longitudeDelta: 0.01, }}
                            onPress={(cord) => this.getMarker(cord.nativeEvent.coordinate)} onMarkerSelect={() => alert('marked')}
                            onPoiClick={(cord) => this.getPoint(cord.nativeEvent.name, cord.nativeEvent.coordinate)}
                            style={{ width: '100%', height: '80%', borderTopRightRadius: 50 }} >
                            <Marker
                                coordinate={{ latitude: this.state.region[0] ? this.state.region[0] : 31.4504, longitude: this.state.region[1] ? this.state.region[1] : 73.1350 }}
                                title="Select this?"
                                description={this.state.region[2]}
                            />
                        </MapView>
                        {/* <View style={{}}>
                            <Text>{this.state.medRegion[0]}</Text>
                            <Text>{this.state.medRegion[1]}</Text>
                        </View> */}
                        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => this.setLocaion()} >
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.btn}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>Select this location</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>
                </Modal>
            </View >
        )
    }
}
export default AddDocData;

const styles = StyleSheet.create({
    addData: {
        alignItems: 'center',
        flex: 1,
    },
    elements: {
        width: 280, height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        marginVertical: 8,
        fontSize: 17,
        borderRadius: 30,
        paddingHorizontal: 10,
        borderColor: "#2CA2C7", backgroundColor: '#F2F2F2'
    },
    element1: {
        width: 280, height: 50, flexDirection: 'row', justifyContent: 'space-between',
        borderWidth: StyleSheet.hairlineWidth,
        marginVertical: 8,
        borderRadius: 30,
        borderColor: "#2CA2C7",
    },
    btnViewLocation: {
        height: 49, width: 175, justifyContent: 'center', alignItems: 'center',
        borderTopLeftRadius: 30, borderBottomLeftRadius: 30, backgroundColor: '#F2F2F2',
    },
    btnSetLocation: {
        height: 49, width: 105, justifyContent: 'center', alignItems: 'center',
        borderTopRightRadius: 30, borderBottomRightRadius: 30, backgroundColor: '#E68B4B'
    },
    btn: {
        width: 200, height: 37,
        borderColor: 'black', borderWidth: StyleSheet.hairlineWidth, borderRadius: 30,
        margin: 15,
        overflow: 'hidden', justifyContent: 'center',
        alignSelf: 'center'
    },
    picker: {
        borderRadius: 30, borderWidth: StyleSheet.hairlineWidth, borderColor: "#2CA2C7",
        justifyContent: 'center', alignSelf: 'center',
        width: 250, height: 37, margin: 10,
        paddingRight: 110, backgroundColor: '#F2F2F2'
    },
    clinic: {
        alignContent: 'center',
        marginHorizontal: 10,
        marginBottom: -10,
        justifyContent: 'space-between',
        width: 250,
        height: 60,
        borderColor: 'black',
        overflow: 'hidden',
        flexDirection: 'row'
    },

    label: {
        fontSize: 20,
        color: '#2CA2C7',
        margin: 10,
    },
    top: {
        position: 'relative',
        width: "100%", height: 92,
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottom: {
        marginTop: 10, alignItems: 'center',
        position: 'relative',
        width: "100%", height: "90%",
        //  borderBottomLeftRadius:70,
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70,
        backgroundColor: '#E6E6E6'
    },
    cBox: {
        width: 35,
        color: "#2CA2C7"
    },
    topModal: {
        position: 'relative',
        width: "100%", height: '11.8%',
        borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
        alignItems: 'center', justifyContent: 'center'
    },
    timer: { alignItems: "center", width: 100, borderRadius: 30, borderColor: '#2CA2C7', borderWidth: StyleSheet.hairlineWidth, height: 30, backgroundColor: '#F2F2F2' },
    haveClinic: { backgroundColor: "#A5D7E7", borderRadius: 5, height: 35, width: 130, marginTop: -5, alignSelf: 'center', justifyContent: 'center' },
})
