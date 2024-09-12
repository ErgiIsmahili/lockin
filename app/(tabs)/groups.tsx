import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { createGroup } from '../(services)/api/api';
import axios from 'axios';

const CreateGroupScreen: React.FC = () => {
    const [groupName, setGroupName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateGroup = async () => {
        if (groupName.trim() === '') {
            Alert.alert('Validation Error', 'Group name cannot be empty.');
            return;
        }

        setLoading(true);

        try {
            const response = await createGroup({ name: groupName });
            Alert.alert('Success', `Group created with ID: ${response.id}`);
            setGroupName('');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message);
        }
    }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Group Name:</Text>
            <TextInput
                style={styles.input}
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Enter group name"
            />
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

export default CreateGroupScreen;
