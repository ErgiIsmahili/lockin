import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getGroupById } from '../../(services)/api/api';

interface Group {
  _id: string;
  name: string;
  frequency: string;
  streak: number;
  image: string;
}

const GroupDetailsScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['group', id],
        queryFn: () => getGroupById(id),
    });

    if (isLoading) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    if (isError) {
        return <View style={styles.container}><Text>Error: {(error as Error).message}</Text></View>;
    }

    const group = data as Group;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{group.name}</Text>
            <Text>Frequency: {group.frequency}</Text>
            <Text>Streak: {group.streak}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default GroupDetailsScreen;
