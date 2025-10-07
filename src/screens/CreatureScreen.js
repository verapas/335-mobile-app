import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CreatureScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Home</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Creature</Text>
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

