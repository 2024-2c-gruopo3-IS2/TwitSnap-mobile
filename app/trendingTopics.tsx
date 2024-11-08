// TrendingTopics.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getTrendingTopics } from '@/handlers/postHandler';

interface TrendingTopic {
    id: string;
    topic: string;
}

export default function TrendingTopics() {
    const router = useRouter();
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrendingTopics = async () => {
            try {
                const response = await getTrendingTopics();
                if (response.success && Array.isArray(response.topics)) {
                    const topics = response.topics.map((topic, index) => ({
                        id: index.toString(),
                        topic: topic,
                    }));
                    setTrendingTopics(topics);
                    setError(null);
                } else {
                    console.error('Error al obtener los temas del momento:', response.message);
                    setTrendingTopics([]);
                    setError(response.message || 'No se pudieron obtener los temas del momento.');
                }
            } catch (err) {
                console.error('Error al obtener los temas del momento:', err);
                setTrendingTopics([]);
                setError('Ocurrió un error al obtener los temas del momento.');
            } finally {
                setIsLoading(false);
            }
        };

        // Configurar intervalo de actualización cada 1 minuto (60000 ms)
        const intervalId = setInterval(fetchTrendingTopics, 60000); // 60 segundos

        // Llamar a la función inicialmente para cargar los datos
        fetchTrendingTopics();

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, []);

    // Función para manejar la selección de un tema
    const handleTopicPress = (topic: string) => {
        router.push({
            pathname: 'topicDetail',  // Navega a la pantalla de detalle de tema
            params: { topic },        // Pasar el tema como parámetro
        });
    };

    const renderItem = ({ item }: { item: TrendingTopic }) => (
        <TouchableOpacity style={styles.topicItem} onPress={() => handleTopicPress(item.topic)}>
            <Text style={styles.topicText}>{item.topic}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Text style={styles.loadingText}>Cargando temas...</Text>
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : trendingTopics.length === 0 ? (
                <Text style={styles.placeholderText}>Aún no hay tendencias.</Text>
            ) : (
                <FlatList
                    data={trendingTopics}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContent}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 10,
        justifyContent: 'center', // Centra verticalmente el contenido
    },
    topicItem: {
        paddingVertical: 15,
        borderBottomColor: '#333',
        borderBottomWidth: 1,
    },
    topicText: {
        color: '#1DA1F2',
        fontSize: 18,
    },
    loadingText: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    placeholderText: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        marginTop: -80,
    },
    errorText: {
        color: '#F44336', // Rojo para indicar error
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    flatListContent: {
        paddingBottom: 20, // Espacio al final de la lista
    },
      loaderContainer: {
        flex: 1,
        backgroundColor: '#000', // Fondo negro
        justifyContent: 'center',
        alignItems: 'center',
      },
});
