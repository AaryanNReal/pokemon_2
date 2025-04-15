import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import axios from 'axios';

export default function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState('');

  // Fetch all Pokémon names
  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
        setAllPokemon(res.data.results.map(p => p.name));
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllPokemon();
  }, []);

  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
    } else {
      const filtered = allPokemon
        .filter(name => name.includes(query.toLowerCase()))
        .slice(0, 3);
      setSuggestions(filtered);
    }
  }, [query]);

  const fetchPokemon = async (name = query) => {
    if (!name) return;
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      setPokemon(res.data);
      setSuggestions([]);
      setError('');
    } catch (err) {
      setPokemon(null);
      setError('Pokémon not found!');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔍 Pokédex</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a Pokémon name..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => fetchPokemon()}
        />
        {suggestions.map((name, index) => (
          <TouchableOpacity key={index} onPress={() => { setQuery(name); fetchPokemon(name); }}>
            <Text style={styles.suggestion}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {pokemon && (
        <View style={styles.card}>
          <Text style={styles.pokemonName}>{pokemon.name}</Text>
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={styles.image}
          />
          <Text style={styles.subtitle}>Types</Text>
          <View style={styles.typeContainer}>
            {pokemon.types.map((t, idx) => (
              <Text key={idx} style={styles.type}>{t.type.name}</Text>
            ))}
          </View>
          <Text style={styles.subtitle}>Stats</Text>
          {pokemon.stats.map((stat, idx) => (
            <View key={idx} style={styles.statRow}>
              <Text style={styles.statName}>{stat.stat.name}</Text>
              <Text>{stat.base_stat}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    padding: 20,
    backgroundColor: '#f0f9ff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 20,
  },
  input: {
    padding: 12,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#e0f2fe',
    marginTop: 2,
    borderRadius: 6,
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
    elevation: 3,
  },
  pokemonName: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
    color: '#334155',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  type: {
    backgroundColor: '#bae6fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
    color: '#0c4a6e',
    fontWeight: '500',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  statName: {
    textTransform: 'capitalize',
  },
  error: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});
