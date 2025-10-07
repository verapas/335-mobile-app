import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerBtn}>
                        <Text style={styles.headerBtnText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerBtn}>
                        <Text style={styles.headerBtnText}>Zurück</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Settings</Text>

                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => navigation.navigate('CreatureLibrary')}
                >
                    <Text style={styles.primaryBtnText}>Creature auswählen</Text>
                </TouchableOpacity>

                <Text style={styles.subtext}>weitere settings folgen...</Text>
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
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerBtn: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    headerBtnText: {
        color: '#111',
        fontWeight: '600',
        fontSize: 18,
        textAlign: 'center',
    },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 24 },
    primaryBtn: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 0,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
        alignSelf: 'flex-start',
    },
    primaryBtnText: {
        color: '#111',
        fontWeight: '600',
        fontSize: 18,
        textAlign: 'center',
    },
    subtext: { marginTop: 28, color: '#666' },
});
