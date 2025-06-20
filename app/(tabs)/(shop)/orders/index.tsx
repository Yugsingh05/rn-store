import { ORDERS } from '@/assets/orders';
import { Order, OrderStatus } from '@/assets/types/order';
import { Link, RelativePathString, Stack } from 'expo-router';
import React from 'react';
import { FlatList, ListRenderItem, Pressable, StyleSheet, Text, View } from 'react-native';

const statusDisplayText : Record<OrderStatus,string> = {
  Pending : 'Pending',
  Completed : 'Completed',
  Shipped : 'Shipped',
  InTransit : 'InTransit'
}

const renderItem: ListRenderItem<Order> = ({item}) => (
  <Link href={`/orders/${item.id}` as RelativePathString} asChild>
    <Pressable style={styles.orderContainer}>
      <View style={styles.orderContent}>
        <View style={styles.orderDetailsContainer}>
          <Text style={styles.orderItem}>{item.item}</Text>
          <Text style={styles.orderDetails}>{item.details}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, styles[`statusBadge_${item.status}`]]}>
          <Text style={styles.statusText}>
            {statusDisplayText[item.status]}
          </Text>
        </View>
      </View>
    </Pressable>
  </Link>
)

export default function order () {
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
          data={ORDERS}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </>
  )
}

const styles= StyleSheet.create({
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
