import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function TrendingTopics() {
    const router = useRouter();

    const [trendingTopics, setTrendingTopics] = useState([
        { id: '1', topic: '#Tecnología' },
        { id: '2', topic: '#Ciencia' },
        { id: '3', topic: '#Deportes' },
        { id: '4', topic: '#Música' },
        { id: '5', topic: '#Cine' },
    ]);

    // Función para manejar la selección de un tema
    const handleTopicPress = (topic) => {
        router.push({
            pathname: 'topicDetail',  // Nombre del archivo al que deseas navegar
            params: { topic }         // Parámetro a pasar a topicDetail
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.topicItem} onPress={() => handleTopicPress(item.topic)}>
            <Text style={styles.topicText}>{item.topic}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={trendingTopics}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
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
});
