import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { analyzeTextGemini } from '../services/api/googleClient';
import { getSelectedCreatureId, getEffectiveProsody, setCurrentEmotion, getTtsLanguage } from '../services/creatureService';
import { getCreatureWithAnimations, getCreatures } from '../services/db';
import images from '../assets/registry/creatureImages';
import { speakText, isSpeaking, stop as stopTTS } from '../services/audio/tts';
import { startShakeDetection, triggerCreatureReaction } from '../services/sensors/shake';
import { generateText } from '../services/textGenerator';

export default function CreatureScreen({ navigation }) {
    const [text, onChangeText] = useState('');
    const [generated, setGenerated] = useState('');
    const [anim, setAnim] = useState(null);
    const [speaking, setSpeaking] = useState(false);
    const [mouthOpen, setMouthOpen] = useState(false);
    const [emotion, setEmotion] = useState('neutral');

    useFocusEffect(
        React.useCallback(() => {
            let active = true;
            (async () => {
                try {
                    let id = await getSelectedCreatureId();
                    if (!id) {
                        const list = await getCreatures();
                        id = list?.[0]?.id;
                    }
                    if (!id) { if (active) setAnim(null); return; }
                    const data = await getCreatureWithAnimations(id);
                    if (active) {
                        setAnim(data?.animations || null);
                        setEmotion('neutral');
                        setMouthOpen(false);
                    }
                } catch (e) {
                    console.warn('Load creature anim error:', e);
                }
            })();
            return () => { active = false; };
        }, [])
    );

    useEffect(() => {
        let mounted = true;
        const interval = setInterval(async () => {
            try {
                const sp = await isSpeaking();
                if (!mounted) return;
                setSpeaking(sp);
                if (sp) setMouthOpen((m) => !m); else setMouthOpen(false);
            } catch {}
        }, 350);
        return () => { mounted = false; clearInterval(interval); };
    }, []);

    useEffect(() => {
        const sub = startShakeDetection(() => {
            try { triggerCreatureReaction({ setEmotion }); } catch {}
        });
        return () => { try { sub && sub.stop && sub.stop(); } catch {} };
    }, []);

    const currentImage = useMemo(() => {
        if (!anim) return null;
        const pickKey = (key) => (key && images[key]) ? images[key] : null;
        if (!speaking) return pickKey(anim.neutral_mouth_closed);
        const emo = emotion;
        const openField = `${emo}_mouth_open`;
        const closedField = `${emo}_mouth_closed`;
        const openSrc = pickKey(anim[openField]) || pickKey(anim.neutral_mouth_open);
        const closeSrc = pickKey(anim[closedField]) || pickKey(anim.neutral_mouth_closed);
        return mouthOpen ? openSrc : closeSrc;
    }, [anim, speaking, mouthOpen, emotion]);


    // aktuell nur zum testen der ausgaben
    const handleSend = async () => {
        if (text.trim()) {
            console.log('Gesendet:', text);
            try {
                const result = await analyzeTextGemini(text);
                console.log('Antwort von Gemini:', result);

                let creatureId = await getSelectedCreatureId();
                if (!creatureId) {
                    creatureId = 1; // fallback: first creature
                }
                const out = await generateText({
                    creatureId,
                    emotion: result.emotion,
                    duration: result.duration,
                });
                setGenerated(out);
                console.log('Generated text:', out);

                try {
                    const { pitch, rate } = await getEffectiveProsody(creatureId, result.emotion);
                    const language = await getTtsLanguage(creatureId);
                    if (await isSpeaking()) {
                        stopTTS();
                    }
                    setEmotion(String(result.emotion || 'neutral').toLowerCase());
                    await setCurrentEmotion(result.emotion);
                    speakText({
                        text: out,
                        pitch,
                        rate,
                        language,
                        onStart: () => { setSpeaking(true); setMouthOpen(true); },
                        onDone: async () => {
                            try { await setCurrentEmotion(null); } catch {}
                            setSpeaking(false); setMouthOpen(false); setEmotion('neutral');
                        },
                        onStopped: async () => {
                            try { await setCurrentEmotion(null); } catch {}
                            setSpeaking(false); setMouthOpen(false); setEmotion('neutral');
                        }
                    });
                } catch (e2) {
                    console.warn('TTS error:', e2);
                }
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
            <KeyboardAvoidingView
                style={styles.container}
                behavior={'height'}
                keyboardVerticalOffset={0}
            >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerBtn}>
                        <Text style={styles.headerBtnText}>Home</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    {currentImage ? (
                        <Image source={currentImage} style={styles.creatureImage} resizeMode="contain" />
                    ) : null}
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
            </KeyboardAvoidingView>
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
        paddingTop: 16,
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
    creatureImage: { width: '80%', marginTop: -60, alignSelf: 'center' },
});
