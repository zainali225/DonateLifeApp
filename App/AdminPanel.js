import React from 'react'
import { StyleSheet, Picker, View, Alert, Text, ActivityIndicator, Platform, Linking, TouchableOpacity, Keyboard, TextInput, Modal, Dimensions } from 'react-native'
import * as firebase from 'firebase'
import 'firebase/firebase-firestore'
import { AntDesign, MaterialIcons, Octicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
console.disableYellowBox = true

class AdminPanel extends React.Component {

    state = {
        isLoading: false, blood: false, city: false, showRes: false, doners: [], bloodDate: false, name: '', userPhone: '',
        userSearchMood: false, newUserMood: false, deleteMood: false
    }

    findUser = () => {
        if (this.state.userPhone === "") { alert('Enter a Number') }
        firebase.firestore().collection('users').doc(this.state.userPhone)
            .get().then(ss => {

                this.setState({ name: ss.data().name })
                this.setState({ userPhone: ss.data().userPhone })
                this.setState({ blood: ss.data().blood })
                this.setState({ city: ss.data().city })
                this.setState({ bloodDate: ss.data().bloodDate })

            })

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
            firebase.firestore().collection('users').doc(this.state.userPhone).set({
                bloodDate: day,
            }, { merge: true })
            Alert.alert('Marked as Donor', 'Operation Successful. User is not Available for 90 days', [{ text: 'OK', onPress: () => this.setState({ userSearchMood: false }) }])

            //   this.findUser();
            this.setState({ userPhone: false, blood: '', city: '', name: '', bloodDate: '' })
        } catch (error) {
            alert(error.message)
        }

    }

    saveData = () => {
        Keyboard.dismiss();
        if (this.state.name === '' || this.state.userPhone === '' || this.state.blood === '' || this.state.city === '') {
            alert('All Fields are Required');
            this.setState({ loading: false })
            return;
        }
        let data = {
            name: this.state.name.trimRight(), uid: this.state.userPhone.trimRight(),
            city: this.state.city.trimRight(), blood: this.state.blood,
            userPhone: this.state.userPhone, bloodDate: 0,
            doner: true,
        };
        try {
            firebase.firestore().collection('users').doc(this.state.userPhone).set(data)
            Alert.alert('Donor', 'Donor added', [{ text: 'OK', onPress: () => this.setState({ newUserMood: false, userPhone: false, name: '', blood: '', bloodDate: '', city: '' }) }])

        } catch (error) {
            alert("An error Occurred")
        }

    }

    deleteDonor = () => {
        try {
            firebase.firestore().collection('users').doc(this.state.userPhone).delete();
            Alert.alert('Donor', 'Donor Deleted', [{ text: 'OK', onPress: () => this.setState({ deleteMood: false, userPhone: false, name: '', blood: '', bloodDate: '', city: '' }) }])
        } catch (error) {
            alert('An error occurred. Try again')
        }

    }

    render() {
        return (
            <View style={styles.find} >
                <LinearGradient style={styles.top} colors={['#344566', "#516593"]} >
                    <Text style={{ color: 'white', fontSize: 20 }}>Admin Panel</Text>
                </LinearGradient>
                <LinearGradient style={styles.bottom} colors={['#E6E6E6', "#E6E6E6"]}>

                    <TouchableOpacity style={styles.btn} onPress={() => this.setState({ newUserMood: true })}>
                        <Text>Add A new donor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => this.setState({ userSearchMood: true })} >
                        <Text>Mark as a donor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => this.setState({ deleteMood: true })} >
                        <Text>Delete a donor</Text>
                    </TouchableOpacity>


                    {/* new User mood Modal--------------------------- */}
                    <Modal onRequestClose={() => this.setState({ newUserMood: false })} visible={this.state.newUserMood} >

                        <LinearGradient style={styles.topModal} colors={['#344566', "#516593"]}>
                            <View style={{ flexDirection: 'row', width: '89%', justifyContent: 'space-between', marginTop: -20, marginLeft: -10 }} >
                                <TouchableOpacity onPress={() => this.setState({ newUserMood: false })} >
                                    <AntDesign name='arrowleft' size={24} color="white" />
                                </TouchableOpacity>
                                <Text style={{ color: 'white', fontSize: 20 }}>Add Donor</Text>
                                <Text></Text>
                            </View>
                        </LinearGradient>
                        <View style={{ alignItems: 'center' }}>

                            <TextInput style={styles.elements} placeholderTextColor={this.state.pColor} placeholder='Name' onChangeText={name => this.setState({ name })} />
                            <TextInput style={styles.elements} placeholderTextColor={this.state.pColor} placeholder='City' onChangeText={city => this.setState({ city })} />
                            <TextInput style={styles.elements} placeholderTextColor={this.state.pColor} placeholder='Your Number' keyboardType="number-pad" onChangeText={userPhone => this.setState({ userPhone })} />
                            <View style={styles.picker}>
                                <Picker style={{ width: '100%' }} selectedValue={this.state.blood} mode="dropdown" onValueChange={blood => this.setState({ blood })}>
                                    <Picker.Item label='Select' color="#7DC2ED" />
                                    <Picker.Item label='A+' value='A+' color="#7DC2ED" />
                                    <Picker.Item label='A-' value='A-' color="#7DC2ED" />
                                    <Picker.Item label='B+' value='B+' color="#7DC2ED" />
                                    <Picker.Item label='B-' value='B-' color="#7DC2ED" />
                                    <Picker.Item label='O+' value='O+' color="#7DC2ED" />
                                    <Picker.Item label='O-' value='O-' color="#7DC2ED" />
                                    <Picker.Item label='AB+' value='AB+' color="#7DC2ED" />
                                    <Picker.Item label='AB-' value='AB-' color="#7DC2ED" />
                                </Picker>
                            </View>

                            <TouchableOpacity onPress={() => this.saveData()}  >
                                <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} colors={['#344566', "#516593"]} style={styles.btn}>
                                    <Text style={{ color: 'white', textAlign: 'center' }}>Save Data</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            {
                                this.state.loading ? <ActivityIndicator size="large" /> : null
                            }
                        </View>
                    </Modal>

                    {/* mark donor Modal */}
                    <Modal onRequestClose={() => this.setState({ userSearchMood: false })} visible={this.state.userSearchMood} >

                    <LinearGradient style={styles.topModal} colors={['#344566', "#516593"]}>
                            <View style={{ flexDirection: 'row', width: '89%', justifyContent: 'space-between', marginTop: -20, marginLeft: -10 }} >
                                <TouchableOpacity onPress={() => this.setState({ userSearchMood: false })} >
                                    <AntDesign name='arrowleft' size={24} color="white" />
                                </TouchableOpacity>
                                <Text style={{ color: 'white', fontSize: 20 }}>Mark a Donor</Text>
                                <Text></Text>
                            </View>
                        </LinearGradient>

                        <View style={{ alignItems: 'center' }} >
                            <TextInput style={styles.city} placeholder="Enter Number" keyboardType="decimal-pad" onChangeText={userPhone => this.setState({ userPhone })} />
                            <TouchableOpacity style={styles.btn} onPress={() => this.findUser()} >
                                <Text>Find User</Text>
                            </TouchableOpacity>

                            <View style={styles.card}>
                                <View style={{ margin: 10 }}>
                                    <Text style={{ fontFamily: 'serif', fontSize: 20 }}>{this.state.name} </Text>
                                    <Text style={{ backgroundColor: '#F8ACAC', borderRadius: 5, textAlign: 'center', width: 30, marginTop: 5 }}>{this.state.blood}</Text>
                                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                        <Octicons name='location' size={18} color='green' />
                                        <Text > {this.state.city}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.btn} onPress={() => this.markDone()} >
                                        <Text>Mark as doner</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>
                    </Modal>

                    {/* delete a donor */}
                    <Modal onRequestClose={() => this.setState({ deleteMood: false })} visible={this.state.deleteMood} >

                    <LinearGradient style={styles.topModal} colors={['#344566', "#516593"]}>
                            <View style={{ flexDirection: 'row', width: '89%', justifyContent: 'space-between', marginTop: -20, marginLeft: -10 }} >
                                <TouchableOpacity onPress={() => this.setState({ deleteMood: false })} >
                                    <AntDesign name='arrowleft' size={24} color="white" />
                                </TouchableOpacity>
                                <Text style={{ color: 'white', fontSize: 20 }}>Delete Donor</Text>
                                <Text></Text>
                            </View>
                        </LinearGradient>

                        <View style={{ alignItems: 'center' }} >
                            <TextInput style={styles.city} placeholder="Enter Number" keyboardType="decimal-pad" onChangeText={userPhone => this.setState({ userPhone })} />
                            <TouchableOpacity style={styles.btn} onPress={() => this.findUser()} >
                                <Text>Find User</Text>
                            </TouchableOpacity>

                            <View style={styles.card}>
                                <View style={{ margin: 10 }}>
                                    <Text style={{ fontFamily: 'serif', fontSize: 20 }}>{this.state.name} </Text>
                                    <Text style={{ backgroundColor: '#F8ACAC', borderRadius: 5, textAlign: 'center', width: 30, marginTop: 5 }}>{this.state.blood}</Text>
                                    {/* <Text style={{ backgroundColor: '#F8ACAC', borderRadius: 5, textAlign: 'center', width: 30, marginTop: 5 }}>{this.state.bloodDate}</Text> */}
                                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                        <Octicons name='location' size={20} color='green' />
                                        <Text > {this.state.city}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.btn} onPress={() => this.deleteDonor()} >
                                        <Text>Delete User</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>
                    </Modal>
                </LinearGradient>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        height: 58, borderBottomColor: 'black', borderBottomWidth: 1,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 5, backgroundColor: 'white'
    },
    card: {
        margin: 12, width: '80%', justifyContent: "space-between", flexDirection: 'row', alignSelf: 'center',
        shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, shadowOpacity: 5,
        borderColor: 'black',
        borderWidth: 0.5,
        elevation: 2,
        borderRadius: 5, backgroundColor: '#FFFFFF'
    },
    elements: {
        width: 290, height: 50,
        borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, borderRadius: 30,
        marginVertical: 10, paddingHorizontal: 30, fontSize: 15,
    },
    btn: {
        width: 150, height: 40, marginTop: 5,  alignSelf: 'center',
        borderRadius: 30, backgroundColor: '#AEDCBB', justifyContent: 'center', alignItems: 'center',
    },
    btnIn: {
        width: 100, height: 40, marginTop: 5,
        borderRadius: 30, borderWidth: 1, backgroundColor: "#BDB7F2", borderColor: '#AEDCBB', justifyContent: 'center', alignItems: 'center',
    },
    picker: {
        justifyContent: 'center', alignSelf: 'center',
        borderRadius: 30, borderWidth: StyleSheet.hairlineWidth, borderColor: "black",
        width: '55%', height: 30, margin: 10,
    },
    city: { margin: 10, marginLeft: -8, borderRadius: 30, borderWidth: 1, borderColor: "tan", width: 150, height: 30, paddingHorizontal: 10 },
    top: {
        position: 'relative',
        width: "100%", height: '14%',
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topModal: {
        position: 'relative',
        width: "100%", height: Dimensions.get('screen').height * 11.5 / 100,
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottom: {
        marginTop: 10,
        position: 'relative',
        width: "100%", height: "86%",
        //  borderBottomLeftRadius:70,
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70,
        backgroundColor: '#E6E6E6',
        alignSelf: 'center',
    }
})
export default AdminPanel;