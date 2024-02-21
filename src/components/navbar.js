import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomNavigationBar = ({ totalPages, currentPage, onPageChange }) => {
  
  const changePage = (pageNumber) => {
    onPageChange(pageNumber);
  };

  
  const renderNavigationButtons = () => {
    const buttons = [];

    
    for (let i = 1; i <= totalPages; i++) {
     
      const isDisabled = i > currentPage;

      buttons.push(
        <TouchableOpacity
          key={i}
          style={[styles.button, isDisabled && styles.disabledButton]}
          onPress={() => changePage(i)}
          disabled={isDisabled}>
          <Text style={styles.buttonText}>{`Page ${i}`}</Text>
        </TouchableOpacity>
      );
    }

    return buttons;
  };

  return (
    <View style={styles.container}>
      {renderNavigationButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomNavigationBar;
