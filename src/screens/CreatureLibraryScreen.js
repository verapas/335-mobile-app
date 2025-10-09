import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import buttonStyles from '../styles/buttons';
import { getCreatures } from '../services/db';
import { getCreatureNameAndNeutralClosed, getSelectedCreatureId, setSelectedCreatureId } from '../services/creatureService';

export default function CreatureLibraryScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const base = await getCreatures();
      const list = await Promise.all(
        base.map(async (c) => {
          const card = await getCreatureNameAndNeutralClosed(c.id);
          return { id: c.id, name: c.name, image: card?.image || null };
        })
      );
      const sel = await getSelectedCreatureId();
      setSelectedId(sel);
      setItems(list);
    } catch (e) {
      console.error('Load creatures error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSelect = async (id) => {
    try {
      await setSelectedCreatureId(id);
      setSelectedId(id);
    } catch (e) {
      console.error('Set selected error:', e);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id;
    return (
      <View style={[styles.card, styles.cardHalf]}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        {item.image ? (
          <Image source={item.image} style={[styles.cardImage, styles.cardImageHalf]} resizeMode="contain" />
        ) : (
          <View style={[styles.cardImage, styles.cardImageHalf, styles.cardImagePlaceholder]} />
        )}
        <TouchableOpacity
          style={[
            buttonStyles.button,
            styles.selectBtn,
            isSelected && styles.selectBtnSelected,
          ]}
          onPress={() => onSelect(item.id)}
        >
          <Text
            style={[
              buttonStyles.buttonText,
              isSelected && styles.selectBtnSelectedText,
            ]}
          >
            {isSelected ? 'Ausgewählt' : 'Auswählen'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
        <Text style={styles.title}>Creature Library</Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(it) => String(it.id)}
            numColumns={2}
            columnWrapperStyle={styles.row}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
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
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 12 },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  cardHalf: { flexBasis: '48%', maxWidth: '48%' },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  cardImage: {
    width: '100%',
    marginBottom: 12,
  },
  cardImageHalf: { height: 120 },
  cardImagePlaceholder: {
    backgroundColor: '#eee',
  },
  selectBtn: {
    alignSelf: 'stretch',
  },
  selectBtnSelected: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  selectBtnSelectedText: {
    color: '#fff',
  },
});
