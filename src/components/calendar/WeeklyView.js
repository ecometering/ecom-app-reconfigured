import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import Typography from '../../theme/typography';

// Helper function to convert time to string format
const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const Schedule = () => {
  const [items, setItems] = useState({}); // Using useState hook for state management

  // Function to load items for the calendar
  const loadItems = (day) => {
    setTimeout(() => {
      const newItems = { ...items }; // Creating a shallow copy to avoid direct state mutation
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!newItems[strTime]) {
          newItems[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            newItems[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
            });
          }
        }
      }
      setItems(newItems); // Updating the state with new items
    }, 1000);
  };

  // Function to render each item in the calendar
  const renderItem = (item) => {
    return (
      <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Typography>{item.name}</Typography>
              <Avatar.Text label="J" />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  // Rendering the Agenda component from react-native-calendars
  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={'2017-05-16'}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Schedule;
