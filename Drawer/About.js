import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';


export default class About extends React.Component {
    render() {
        return (
            <View >
                <LinearGradient style={styles.top} colors={['#E86C63', "#E68B4B"]}>
                    <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center' }}>Why</Text>
                </LinearGradient>
                <LinearGradient colors={['white', '#FFFFFF']} style={styles.bottom} >
                    <Text></Text>
                    <Text style={styles.head}>Why should I donate blood</Text>
                    <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false} >
                        <Text style={styles.p}>         Safe blood saves lives and improves health. Blood transfusion is needed for:
                    </Text>
                        <Text style={styles.p}>         Women with complications of pregnancy, such as ectopic pregnancies and haemorrhage before, during or after childbirth;
                        children with severe anaemia often resulting from malaria or malnutrition;
                        people with severe trauma following man-made and natural disasters; and
                        many complex medical and surgical procedures and cancer patients.
                        It is also needed for regular transfusions for people with conditions such as thalassaemia and sickle cell disease and is used to make products such as clotting factors for people with haemophilia.
                    </Text>
                        <Text style={styles.p}>         There is a constant need for regular blood supply because blood can be stored for only a limited time before use. Regular blood donations by a sufficient number of healthy people are needed to ensure that safe blood will be available whenever and wherever it is needed.
                    </Text>
                        <Text style={styles.p}>         Blood is the most precious gift that anyone can give to another person — the gift of life. A decision to donate your blood can save a life, or even several if your blood is separated into its components — red cells, platelets and plasma — which can be used individually for patients with specific conditions.
                    </Text>
                        <Image style= {{ width: '100%', height: 280, alignSelf: 'center' }} source={require('../assets/why.jpeg')} />
                        <Text style={{ marginBottom: 50 }}></Text>
                    </ScrollView>
                </LinearGradient>

            </View>
        )
    }
}


const styles = StyleSheet.create({

    head: {
        fontSize: 24, textAlign: 'center', alignSelf: 'center', marginBottom: 10, width: '90%'
    },
    p: {
        fontSize: 12, width: '90%', alignSelf: 'center'
    },
    icon: { color: 'white' },
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
        //  borderBottomLeftRadius:70,white
        borderTopLeftRadius: 50, borderWidth: 1, borderColor: '#E6E6E6',
        borderTopRightRadius: 50,
        alignItems: 'center'
    }
})