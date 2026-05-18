import React, { useState } from "react";
import { View, Image, ImageBackground, StyleSheet } from "react-native";
import { Button, Card, Input, Text, ThemeProvider } from "@rneui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const theme = {
  colors: {
    primary: '#3b4cca',
    secondary: '#ffcb05',
    background: '#f8f8f8'
  }
}

const Stack = createNativeStackNavigator();

//função pra buscar pokemon
const fetchPokemon = async (name, setPokemon, setErrorMessage) => {
  if (!name.trim()) {
    setErrorMessage("Digite o nome do Pokémon");
    setPokemon(null);
    return;
  }
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!response.ok) {
      throw new Error("Pokémon não encontrado");
    }
    const data = await response.json();
    setPokemon(data);
    setErrorMessage("");
  } catch (error) {
    setErrorMessage(error.message);
    setPokemon(null);
  }
}

const HomeScreen = ({ navigation }) => {
  const [pokemon, setPokemon] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");

  return (
    <ThemeProvider theme={theme}>
      <ImageBackground
        source={{
          uri: 'https://cdn.pixabay.com/photo/2016/08/15/00/50/pokeball-1594373_1280.png'
        }} style={styles.background}>
        <View style={styles.container}>
          <Text h2 style={styles.title}>Pokedex</Text>
          <Input placeholder="Digite o nome do Pokémon"
            value={search}
            onChangeText={setSearch}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />
          <Button title="Buscar" onPress={() => fetchPokemon(search, setPokemon, setErrorMessage)} />
          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
          {pokemon && (
            <PokemonCard pokemon={pokemon} onPress={() => navigation.navigate("Details", { pokemon })} />
          )}
        </View>
      </ImageBackground>
    </ThemeProvider>
  )
};

const DetailsScreen = ({ route }) => {
  const { pokemon } = route.params;
  
  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <PokemonCard pokemon={pokemon} />
        <Text style={styles.info}>Geração: {pokemon.game_indices[0]?.version.name || "Desconhecida"}</Text>
        <Text style={styles.info}>HP: {pokemon.stats[0]?.base_stat || "Desconhecido"}</Text>
        <Text style={styles.info}>Tipo 1: {pokemon.types[0]?.type.name || "Desconhecido"}</Text>
        <Text style={styles.info}>Tipo 2: {pokemon.types[1]?.type.name || "Nenhum"}</Text>
        <Text style={styles.info}>Lendário: {pokemon.is_legendary ? "Sim" : "Não"}</Text>
      </View>
    </ThemeProvider>
  )
};

const PokemonCard = ({ pokemon, onPress }) => (
  <Card containerStyle={styles.card} onPress={onPress}>
    <Card.Title>{pokemon.name.toUpperCase()}</Card.Title>
    <Card.Divider />
    <Card.Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
    {onPress && <Button title="Ver Detalhes" onPress={onPress} containerStyle={styles.buttonContainer} />}
  </Card>
);

export default function AppPokemon() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Detalhes do Pokémon" }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#3b4cca',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    color: '#333',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  card: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },
  info: {
    fontSize: 16,
    marginTop: 10,
  },
});