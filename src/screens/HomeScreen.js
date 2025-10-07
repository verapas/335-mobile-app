import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import buttonStyles from '../styles/buttons';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'top']}>
            <View style={styles.container}>
                <Text style={styles.title}>Willkommen Bei BlipBlop</Text>

                <View style={styles.bottomRow}>
                    <TouchableOpacity
                        style={[buttonStyles.button, buttonStyles.buttonFlex, buttonStyles.buttonLeft]}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Text style={buttonStyles.buttonText}>Settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[buttonStyles.button, buttonStyles.buttonFlex, buttonStyles.buttonRight]}
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
    bottomRow: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        flexDirection: 'row',
    },
});
