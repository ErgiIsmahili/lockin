import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
    return (
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="groupsScreen" />
            <Stack.Screen name="createGroup" />
        </Stack>
    )
}