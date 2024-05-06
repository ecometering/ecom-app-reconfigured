import { StyleSheet, Text, View } from 'react-native';

const JobStatusLabel = ({ status }) => {
  const statusColor = {
    ['Planned']: 'blue',
    ['In Progress']: 'orange',
    ['Completed']: 'green',
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: statusColor[status],
      }}
    >
      <Text style={styles.statusLabel}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default JobStatusLabel;
