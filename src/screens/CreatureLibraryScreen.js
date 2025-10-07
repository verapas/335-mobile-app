import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CreatureLibraryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Zurück</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Creature Library</Text>
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
  title: { fontSize: 28, fontWeight: '600', marginTop: 40 },
});

