import { GetMyorders } from '@/api/api';
import { Tables } from '@/types/database.types';
import { Link, RelativePathString, Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, Pressable, StyleSheet, Text, View } from 'react-native';

import {format} from 'date-fns'

const renderItem: ListRenderItem<Tables<'order'>> = ({item}) => (
  <Link href={`/orders/${item.id}` as RelativePathString} asChild>
    <Pressable style={styles.orderContainer}>
      <View style={styles.orderContent}>
        <View style={styles.orderDetailsContainer}>
          <Text style={styles.orderItem}>{item.slug}</Text>
          <Text style={styles.orderDetails}>{item.description}</Text>
          <Text style={styles.orderDate}>{format(new Date(item.created_at) , 'MMM dd, yyyy')}</Text>
        </View>
        <View style={[styles.statusBadge, styles[`statusBadge_${item.status}`]]}>
          <Text style={styles.statusText}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </Pressable>
  </Link>
)

export default function order () {

  const {data , error , isLoading} = GetMyorders()



  if(isLoading) return <ActivityIndicator/>

  if(error) return <Text>Error {error?.message || 'Failed to fetch data'}</Text>

  if(data?.length === 0) return <Text style={{
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'serif',
  }}>No orders found</Text>
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Orders',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </>
  )
}

const styles : {[key: string]: any}= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContent: {
    padding: 16,
  },
  orderContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetailsContainer: {
    flex: 1,
  },
  orderItem: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDetails: {
    fontSize: 14,
    color: '#555',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge_Pending: {
    backgroundColor: '#ffcc00',
  },
  statusBadge_Completed: {
    backgroundColor: '#4caf50',
  },
  statusBadge_Shipped: {
    backgroundColor: '#2196f3',
  },
  statusBadge_InTransit: {
    backgroundColor: '#ff9800',
  },
});
