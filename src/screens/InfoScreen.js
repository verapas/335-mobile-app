import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import buttonStyles from '../styles/buttons';

export default function InfoScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                        style={[buttonStyles.button, buttonStyles.buttonFlex, buttonStyles.buttonLeft]}
                    >
                        <Text style={buttonStyles.buttonText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Creature')}
                        style={[buttonStyles.button, buttonStyles.buttonFlex, buttonStyles.buttonRight]}
                    >
                        <Text style={buttonStyles.buttonText}>Start</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Was BlipBlop macht</Text>

                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.intro}>
                        BlipBlop spricht keine Wörter, sondern Gefühle. Du gibst einen Text ein, BlipBlop
                        fühlt die Stimmung und antwortet in seiner eigenen Klangsprache.
                    </Text>

                    <Text style={styles.section}>So funktioniert es</Text>
                    <Text style={styles.point}>• Wähle in der Library eine oder mehrere Figuren mit eigener „Sprache“.</Text>
                    <Text style={styles.point}>• Tippe deinen Text ein und schicke ihn ab.</Text>
                    <Text style={styles.point}>• Ein externes LLM erkennt die Emotion und die gewünschte Länge und liefert ein kurzes Ergebnis als JSON.</Text>
                    <Text style={styles.point}>• Ein Textgenerator baut daraus den eigentlichen Simlish Text. Jede Figur nutzt dafür ihre eigenen Wortlisten.</Text>
                    <Text style={styles.point}>• Die Text to Speech Ausgabe auf dem Gerät wandelt den Text in Sprache um und passt Tonhöhe und Tempo an.</Text>

                    <Text style={styles.section}>Interaktion</Text>
                    <Text style={styles.point}>• Schüttle das Gerät, die Figur reagiert spontan und gibt einen kurzen Laut von sich.</Text>
                    <Text style={styles.point}>• Wechsle die Figur, um eine andere Klangwelt zu hören, zum Beispiel fröhlich, grummelig oder verträumt.</Text>

                    <Text style={styles.section}>Hinweise</Text>
                    <Text style={styles.point}>• Stimme, Sprache und Stimmlage hängen von der gewählten Figur ab.</Text>
                    <Text style={styles.point}>• Für die Einschätzung der Emotion und der Länge wird eine API zu Google Gemini aufgerufen. Es wird nur dein Text übertragen, die Sprachausgabe passiert auf dem Gerät.</Text>
                </ScrollView>


            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, paddingTop: 16, paddingHorizontal: 16 },
    header: { flexDirection: 'row', marginBottom: 24 },
    title: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
    content: { paddingBottom: 24 },
    intro: { fontSize: 16, lineHeight: 22, color: '#222', marginBottom: 16 },
    section: { fontSize: 18, fontWeight: '600', marginTop: 8, marginBottom: 8, color: '#111' },
    point: { fontSize: 16, marginBottom: 8, color: '#222' },
});