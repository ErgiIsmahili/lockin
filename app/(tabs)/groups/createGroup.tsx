import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { createGroup } from '../../(services)/api/api';
import axios from 'axios';
import { useRouter } from 'expo-router';

const CreateGroupScreen: React.FC = () => {
    const router = useRouter();
    
    const [groupName, setGroupName] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [howManyDaysPerWeek, setHowManyDaysPerWeek] = useState<string>('');
    const [howManyWeeksPerMonth, setWeeksPerMonth] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const frequencyOptions = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
    ];

    const handleCreateGroup = async () => {
        if (groupName.trim() === '') {
            Alert.alert('Validation Error', 'Group name cannot be empty.');
            return;
        }

        if (!frequency) {
            Alert.alert('Validation Error', 'Frequency is required.');
            return;
        }

        const daysPerWeek = Number(howManyDaysPerWeek);
        const weeksPerMonth = Number(howManyWeeksPerMonth);

        if ((frequency === 'weekly' && isNaN(daysPerWeek)) ||
            (frequency === 'monthly' && isNaN(weeksPerMonth))) {
            Alert.alert('Validation Error', 'Please enter valid numbers for selected frequency.');
            return;
        }

        setLoading(true);

        try {
            const response = await createGroup({
                name: groupName,
                image,
                frequency,
                howManyDaysPerWeek: frequency === 'weekly' ? daysPerWeek : undefined,
                weeksPerMonth: frequency === 'monthly' ? weeksPerMonth : undefined,
            });
            Alert.alert('Success', `Group created with ID: ${response._id}`);
            setGroupName('');
            setImage('');
            setFrequency('daily');
            setHowManyDaysPerWeek('');
            setWeeksPerMonth('');
            router.replace('/(tabs)/groups/groupsScreen');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
                Alert.alert('Error', 'Group creation failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Back" onPress={() => router.back()} />

            <Text style={styles.label}>Group Name:</Text>
            <TextInput
                style={styles.input}
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Enter group name"
            />
            
            <Text style={styles.label}>Image URL:</Text>
            <TextInput
                style={styles.input}
                value={image}
                onChangeText={setImage}
                placeholder="Enter image URL"
            />

            <Text style={styles.label}>Frequency:</Text>
            <RNPickerSelect
                onValueChange={(value) => setFrequency(value as 'daily' | 'weekly' | 'monthly')}
                items={frequencyOptions}
                style={pickerStyles}
                value={frequency}
            />

            {frequency === 'weekly' && (
                <>
                    <Text style={styles.label}>How Many Days Per Week:</Text>
                    <TextInput
                        style={styles.input}
                        value={howManyDaysPerWeek}
                        onChangeText={setHowManyDaysPerWeek}
                        placeholder="Enter number of days"
                        keyboardType="numeric"
                    />
                </>
            )}

            {frequency === 'monthly' && (
                <>
                    <Text style={styles.label}>Weeks Per Month:</Text>
                    <TextInput
                        style={styles.input}
                        value={howManyWeeksPerMonth}
                        onChangeText={setWeeksPerMonth}
                        placeholder="Enter number of weeks"
                        keyboardType="numeric"
                    />
                </>
            )}

            <Button
                title={loading ? 'Creating...' : 'Create Group'}
                onPress={handleCreateGroup}
                disabled={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
    },
});

const pickerStyles = StyleSheet.create({
    inputIOS: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
    },
    inputAndroid: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
    },
});

export default CreateGroupScreen;
