import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function AddInterventionScreen({ navigation, interventions, setInterventions }) {
  const [designation, setDesignation] = useState('');
  const [quantite, setQuantite] = useState('');
  const [etat, setEtat] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleAddIntervention = () => {
    if (!designation || !quantite || !destination || !date) {
      Alert.alert("Attention", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const newIntervention = {
      designation,
      quantite,
      etat,
      destination,
      date,
    };

    // Mise à jour dyal la liste globale
    const updatedList = [...interventions, newIntervention];
    setInterventions(updatedList);

    // Mettre à jour les paramètres de navigation
    navigation.navigate('Accueil', { interventions: updatedList });
    navigation.navigate('Export', { interventions: updatedList });

    // Vider le formulaire
    setDesignation('');
    setQuantite('');
    setEtat('');
    setDestination('');
    setDate('');

    Alert.alert("Succès", "L'intervention a été ajoutée avec succès !");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouvelle Intervention</Text>

      <TextInput
        style={styles.input}
        placeholder="Désignation (ex: Lampadaire 100W)"
        value={designation}
        onChangeText={setDesignation}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantité"
        keyboardType="numeric"
        value={quantite}
        onChangeText={setQuantite}
      />
      <TextInput
        style={styles.input}
        placeholder="État (ex: En fonctionnement / En panne)"
        value={etat}
        onChangeText={setEtat}
      />
      <TextInput
        style={styles.input}
        placeholder="Destination / Quartier"
        value={destination}
        onChangeText={setDestination}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (AAAA-MM-JJ)"
        value={date}
        onChangeText={setDate}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddIntervention}>
        <Text style={styles.buttonText}>Enregistrer l'intervention</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#11CAA0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});