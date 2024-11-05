import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getTrendingTopics } from '@/handlers/postHandler';

export default function TrendingTopics() {
    const router = useRouter();
    const [trendingTopics, setTrendingTopics] = useState<{ id: string, topic: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrendingTopics = async () => {
            const response = await getTrendingTopics();
            if (response.success && response.topics) {
                const topics = response.topics.map((topic, index) => ({ id: index.toString(), topic })); // Formatear los temas con un id único
                setTrendingTopics(topics);
            } else {
                console.error('Error al obtener los temas del momento:', response.message);
            }
            setIsLoading(false);
        };

        // Configurar intervalo de actualización cada 1 segundo
        const intervalId = setInterval(fetchTrendingTopics, 1000);

        // Llamar a la función inicialmente para cargar los datos
        fetchTrendingTopics();

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, []);

    // Función para manejar la selección de un tema
    const handleTopicPress = (topic: string) => {
        router.push({
            pathname: 'topicDetail',  // Navega a la pantalla de detalle de tema
            params: { topic }         // Pasar el tema como parámetro
        });
    };

    const renderItem = ({ item }: { item: { id: string, topic: string } }) => (
        <TouchableOpacity style={styles.topicItem} onPress={() => handleTopicPress(item.topic)}>
            <Text style={styles.topicText}>{item.topic}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Text style={styles.loadingText}>Cargando temas...</Text>
            ) : trendingTopics.length === 0 ? (
                <Text style={styles.placeholderText}>Aún no hay tendencias.</Text>
            ) : (
                <FlatList
                    data={trendingTopics}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
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
});
