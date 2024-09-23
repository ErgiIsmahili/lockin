import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="list"
          options={{
            title: 'List',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'list-sharp' : 'list-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: 'Add',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="groups"
          options={{
            title: 'Friends',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person-circle' : 'person-circle-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
