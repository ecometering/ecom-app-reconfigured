import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingComponent = ({ loadingText = 'Loading...' }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
            <Text>{loadingText}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingComponent;
