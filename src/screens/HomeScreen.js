import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import buttonStyles from '../styles/buttons';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'top']}>
            <View style={styles.container}>
                <Text style={styles.title}>Willkommen Bei BlipBlop</Text>
                <Text style={styles.title2}>deinem kleinen Mood-Bot</Text>

                <View style={styles.imageWrapper}>
                    <Image
                        source={require('../assets/images/Home/Home-Bild.png')}
                        style={styles.image}
                    />
                </View>

                <View style={styles.bottomRow}>
                    <TouchableOpacity
                        style={[buttonStyles.button, buttonStyles.buttonFlex, styles.buttonLeft]}
                        onPress={() => navigation.navigate('Info')}
                    >
                        <Text style={buttonStyles.buttonText}>Info</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[buttonStyles.button, buttonStyles.buttonFlex, styles.buttonMiddle]}
                        onPress={() => navigation.navigate('CreatureLibrary')}
                    >
                        <Text style={buttonStyles.buttonText}>Library</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[buttonStyles.button, buttonStyles.buttonFlex, styles.buttonRight]}
                        onPress={() => navigation.navigate('Creature')}
                    >
                        <Text style={buttonStyles.buttonText}>Start</Text>
                    </TouchableOpacity>
                </View>

                
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 24,
    },
    title2: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 24,
    },
    bottomRow: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        flexDirection: 'row',
        zIndex: 10,
    },
    buttonLeft: { marginRight: 8 },
    buttonMiddle: { marginHorizontal: 8 },
    buttonRight: { marginLeft: 8 },
    imageWrapper: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '70%',
        resizeMode: 'contain',
        marginTop: -80
    },
    
});
