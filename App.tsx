import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { Button, Card } from "@rneui/themed";
import axios from "axios";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";

type Agent = {
  uuid: string;
  displayName: string;
  displayIcon: string;
  fullPortrait?: string;
  role?: {
    displayName: string;
  } | null;
  description: string;
};

type RootStackParamList = {
  Agentes: undefined;
  Detalhes: { agent: Agent };
};

const Stack = createStackNavigator<RootStackParamList>();

const API_URL =
  "https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=pt-BR";

type AllAgentsNavigationProp = StackNavigationProp<RootStackParamList, "Agentes">;

type AllAgentsProps = {
  navigation: AllAgentsNavigationProp;
};

type DetailsRouteProp = RouteProp<RootStackParamList, "Detalhes">;

type AgentDetailsProps = {
  route: DetailsRouteProp;
};

const AgentCard = ({
  agent,
  navigation,
  index,
}: {
  agent: Agent;
  navigation: AllAgentsNavigationProp;
  index: number;
}) => {
  const enterAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 420,
      delay: Math.min(index * 70, 700),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enterAnim, index]);

  return (
    <Animated.View
      style={{
        opacity: enterAnim,
        transform: [
          {
            translateY: enterAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [24, 0],
            }),
          },
          {
            scale: enterAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.98, 1],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("Detalhes", { agent })}
      >
        <Card containerStyle={styles.card}>
          <ImageBackground source={{ uri: agent.displayIcon }} style={styles.cardImage} imageStyle={styles.cardImageInner}>
            <View style={styles.cardImageOverlay}>
              <Text style={styles.roleBadge}>{agent.role?.displayName ?? "Sem função"}</Text>
            </View>
          </ImageBackground>
          <Card.Title style={styles.cardTitle}>{agent.displayName}</Card.Title>
          <Button
            title="Ver Detalhes"
            onPress={() => navigation.navigate("Detalhes", { agent })}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
          />
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AllAgentsScreen = ({ navigation }: AllAgentsProps) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAgents = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(API_URL);
      setAgents(response.data.data);
    } catch {
      setError("Nao foi possivel carregar os agentes. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const subtitle = useMemo(
    () => `${agents.length} agentes disponiveis`,
    [agents.length]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111111" />
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>PROTOCOLO V</Text>
        <Text style={styles.title}>Agentes de Valorant</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {loading && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#ff4655" />
          <Text style={styles.stateText}>Carregando operativos...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Tentar Novamente" buttonStyle={styles.retryButton} onPress={loadAgents} />
        </View>
      )}

      {!loading && !error && (
      <FlatList
        data={agents}
        keyExtractor={(item) => item.uuid}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <AgentCard agent={item} navigation={navigation} index={index} />
        )}
      />
      )}
    </SafeAreaView>
  );
};

const AgentDetailsScreen = ({ route }: AgentDetailsProps) => {
  const { agent } = route.params;
  const detailsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(detailsAnim, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [detailsAnim]);

  return (
    <SafeAreaView style={styles.detailsContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <ScrollView contentContainerStyle={styles.detailsScrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: detailsAnim,
            transform: [
              {
                translateY: detailsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          }}
        >
          <Card containerStyle={styles.detailsCard}>
            <Text style={styles.detailsName}>{agent.displayName}</Text>
            <Text style={styles.detailsRole}>{agent.role?.displayName ?? "Funcao desconhecida"}</Text>
            <ImageBackground
              source={{ uri: agent.fullPortrait || agent.displayIcon }}
              style={styles.imageLarge}
              imageStyle={styles.detailsImageInner}
            />
            <Text style={styles.description}>{agent.description}</Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function Valorant2022() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Agentes"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#111111",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "800",
            letterSpacing: 0.4,
          },
          cardStyle: {
            backgroundColor: "#0b0d10",
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 300,
                easing: Easing.out(Easing.poly(4)),
              },
            },
            close: {
              animation: "timing",
              config: {
                duration: 230,
                easing: Easing.in(Easing.poly(4)),
              },
            },
          },
        }}
      >
        <Stack.Screen name="Agentes" component={AllAgentsScreen} options={{ title: "Agentes" }} />
        <Stack.Screen name="Detalhes" component={AgentDetailsScreen} options={{ title: "Ficha" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0d10",
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 14,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#171a21",
    borderWidth: 1,
    borderColor: "#2a2f3a",
  },
  eyebrow: {
    color: "#ff4655",
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: "800",
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#f8f8f8",
    marginBottom: 4,
  },
  subtitle: {
    color: "#9aa4b2",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 28,
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  stateText: {
    color: "#c4ccd6",
    marginTop: 12,
    fontWeight: "600",
  },
  errorText: {
    color: "#ffd1d6",
    textAlign: "center",
    marginBottom: 14,
    fontWeight: "600",
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#ff4655",
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  card: {
    borderRadius: 18,
    padding: 0,
    marginBottom: 16,
    marginHorizontal: 2,
    overflow: "hidden",
    backgroundColor: "#1a1f28",
    borderWidth: 1,
    borderColor: "#2b3341",
  },
  cardImage: {
    height: 170,
    justifyContent: "flex-end",
  },
  cardImageInner: {
    resizeMode: "cover",
  },
  cardImageOverlay: {
    padding: 12,
    backgroundColor: "rgba(13,13,13,0.42)",
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ff4655",
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 12,
    borderRadius: 99,
    overflow: "hidden",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 12,
    color: "#f6f8fb",
    letterSpacing: 0.3,
  },
  button: {
    backgroundColor: "#ff4655",
    borderRadius: 10,
    marginHorizontal: 14,
    marginBottom: 16,
    paddingVertical: 10,
  },
  buttonTitle: {
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#0b0d10",
  },
  detailsScrollContent: {
    padding: 12,
  },
  detailsCard: {
    borderRadius: 20,
    backgroundColor: "#171a21",
    borderWidth: 1,
    borderColor: "#2b3341",
    padding: 14,
  },
  detailsName: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 30,
    marginBottom: 4,
  },
  detailsRole: {
    color: "#ff8f98",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  imageLarge: {
    height: 350,
    borderRadius: 14,
    marginBottom: 15,
  },
  detailsImageInner: {
    borderRadius: 14,
    resizeMode: "cover",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#d9e0ea",
  },
});