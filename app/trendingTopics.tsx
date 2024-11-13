import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getTrendingTopics } from '@/handlers/postHandler';
import { sendTrendingNotification } from '@/handlers/notificationHandler';
import { AuthContext } from '@/context/authContext';

interface TrendingTopic {
    id: string;
    topic: string;
}

export default function TrendingTopics() {
    const router = useRouter();
    const { user } = useContext(AuthContext);

    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [previousTopics, setPreviousTopics] = useState<string[]>([]);
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

                    const newTopics = response.topics.filter(topic => !previousTopics.includes(topic));
                    if (newTopics.length > 0) {
                        sendNotificationsForTrendingTopics(newTopics);
                        setPreviousTopics(response.topics);
                    }
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

        const sendNotificationsForTrendingTopics = async (newTopics: string[]) => {
            if (!user.username) {
                console.log('Usuario no autenticado. No se enviarán notificaciones.');
                return;
            }

            try {
                newTopics.forEach(async (topic) => {
                    await sendTrendingNotification(user.username, null, topic);
                });
            } catch (error) {
                console.error('Error al enviar notificaciones de trending topics:', error);
            }
        };

        const intervalId = setInterval(fetchTrendingTopics, 60000);

        fetchTrendingTopics();

        return () => clearInterval(intervalId);
    }, [user, previousTopics]);

    const handleTopicPress = (topic: string) => {
        router.push({
            pathname: 'topicDetail',
            params: { topic },
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
                <Text style={styles.placeholderText}>No se encontraron temas del momento</Text>
            ) : (
                <FlatList
                    data={trendingTopics}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
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
        justifyContent: 'center',
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
        color: '#F44336',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    flatListContent: {
        paddingBottom: 20,
    },
});