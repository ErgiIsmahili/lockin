import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getUserGroups } from '../../(services)/api/api';

interface Group {
  _id: string;
  name: string;
  frequency: string;
  streak: number;
  image: string;
}

const GroupsScreen: React.FC = () => {
    const router = useRouter();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['userGroups'],
        queryFn: getUserGroups,
    });

    if (isLoading) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    if (isError) {
        return <View style={styles.container}><Text>Error: {(error as Error).message}</Text></View>;
    }

    const groups = data?.groups || [];

    const handleGroupPress = (group: Group) => {
        router.push({
            pathname: '/(tabs)/groups/[id]',
            params: { id: group._id }
        } as never);
    };

    const renderGroupItem = ({ item }: { item: Group }) => (
        <TouchableOpacity style={styles.groupItem} onPress={() => handleGroupPress(item)}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text>Frequency: {item.frequency}</Text>
            <Text>Streak: {item.streak}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Groups</Text>
            {groups.length > 0 ? (
                <FlatList
                    data={groups}
                    renderItem={renderGroupItem}
                    keyExtractor={(item) => item._id}
                />
            ) : (
                <Text>You haven't joined any groups yet.</Text>
            )}
            <Button
                title="Create New Group"
                onPress={() => router.push('/(tabs)/groups/createGroup')}
            />
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
    groupItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    groupName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

export default GroupsScreen;