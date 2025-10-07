import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeTextGemini } from '../services/api/googleClient';

export default function CreatureScreen({ navigation }) {
    const [text, onChangeText] = useState('');

    const handleSend = async () => {
        if (text.trim()) {
            console.log('Gesendet:', text);
            try {
                const result = await analyzeTextGemini(text);
                console.log('Antwort von Gemini:', result);
            } catch (error) {
                console.error('Gemini error:', error);
                try {
                    if (error && (error.raw || error.text)) {
                        console.log('Gemini raw response:', error.raw);
                        console.log('Gemini response text:', error.text);
                    }
                } catch {}
            }
            onChangeText('');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerBtn}>
                        <Text style={styles.headerBtnText}>Home</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <Text style={styles.title}>Hier kommen die Creatures...</Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        value={text}
                        placeholder="Gib etwas ein..."
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSend}
                    >
                        <Text style={styles.sendButtonText}>➤</Text>
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
    },
    content: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    header: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
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
    title: { fontSize: 28, fontWeight: '600', marginTop: 40 },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginRight: 8,
    },
    sendButton: {
        width: 40,
        height: 40,
        backgroundColor: 'grey',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
