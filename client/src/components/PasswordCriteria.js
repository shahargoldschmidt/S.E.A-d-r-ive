import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PASSWORD_RULES = [
    { key: 'length', label: 'At least 8 characters' },
    { key: 'upper', label: 'Uppercase Letter (A-Z)' },
    { key: 'lower', label: 'Lowercase Letter (a-z)' },
    { key: 'number', label: 'Number (0-9)' },
    { key: 'special', label: 'Special Character (!@#$)' }
];

const PasswordCriteria = ({ criteria }) => {
    return (
        <View style={styles.validationBox}>
            <Text style={styles.validationTitle}>Password Requirements:</Text>
            <View style={styles.grid}>
                {PASSWORD_RULES.map((rule) => {
                    const isValid = criteria[rule.key];
                    return (
                        <View key={rule.key} style={styles.validationItem}>
                            <View style={[styles.statusDot, { backgroundColor: isValid ? '#2ecc71' : '#e74c3c', opacity: isValid ? 1 : 0.6 }]} />
                            <Text style={[styles.label, { color: isValid ? '#2e7d32' : '#888', fontWeight: isValid ? 'bold' : 'normal' }]}>
                                {rule.label}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    validationBox: {
        width: '100%',
        marginTop: 5,
        marginBottom: 20,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 15,
    },
    validationTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 10, opacity: 0.8 },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    validationItem: { width: '50%', flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
    statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
    label: { fontSize: 11 }
});

export default PasswordCriteria;