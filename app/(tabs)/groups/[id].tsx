import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGroupById, checkIn } from '../../(services)/api/api';

interface Group {
  _id: string;
  name: string;
  frequency: string;
  streak: number;
  image: string;
  isCheckedInToday: boolean;
}

const GroupDetailsScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['group', id],
        queryFn: () => getGroupById(id),
        enabled: !!id,
    });
    console.log(data)
    const mutation = useMutation({
        mutationFn: () => checkIn(id),
        onSuccess: () => {
            refetch(); 
            Alert.alert('Success', 'You have successfully checked in!');
        },
        onError: (err: Error) => {
            Alert.alert('Error', err.message);
        },
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
            <Button
                title="Back"
                onPress={() => router.replace('/(tabs)/groups/groupsScreen')}
            />
            <Text style={styles.checkInStatus}>
                Check-in Status: {group.isCheckedInToday ? 'Checked In' : 'Not Checked In'}
            </Text>
            <Button
                title="Check In"
                onPress={() => mutation.mutate()}
                disabled={group.isCheckedInToday || mutation.status === 'pending'}
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
    checkInStatus: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: 'blue',
    },
});

export default GroupDetailsScreen;