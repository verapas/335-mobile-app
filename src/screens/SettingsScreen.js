import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  header: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2f80ed',
    borderRadius: 8,
  },
  headerBtnText: { color: '#fff', fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '600', marginTop: 40, marginBottom: 24 },
  primaryBtn: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  primaryBtnText: { color: '#fff', fontWeight: '600' },
  subtext: { marginTop: 16, color: '#666' },
});

