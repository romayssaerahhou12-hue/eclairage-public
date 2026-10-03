import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Récupération dyal les interventions
  const interventions = route.params?.interventions || [];

  // Filtrage dyal les interventions
  const filteredInterventions = interventions.filter((item) => {
    // 1. Filtrage par texte (désignation / destination)
    const query = searchQuery.toLowerCase();
    const matchesText =
      item.designation.toLowerCase().includes(query) ||
      item.destination.toLowerCase().includes(query);

    // 2. Filtrage par date
    let matchesDate = true;

    if (startDate && !endDate) {
      // Choix 1: Ila ktb date ghir f "Du", kay-jbed ghir dak nhar b-dabt
      matchesDate = item.date === startDate;
    } else if (!startDate && endDate) {
      // Ila ktb date ghir f "Au", kay-jbed les travaux m-9bl aw f dak nhar
      matchesDate = item.date <= endDate;
    } else if (startDate && endDate) {
      // Choix 2: Ila ktb "Du" w "Au" b-jouj, kay-jbed la période mbinat'hom
      matchesDate = item.date >= startDate && item.date <= endDate;
    }

    return matchesText && matchesDate;
  });

  // Fonction bch n-mshou le filtre dyal les dates
  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <View style={styles.container}>
      {/* Barre de recherche par texte */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par matériel ou destination..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Block dyal le filtre par Date */}
      <View style={styles.dateFilterContainer}>
        <TextInput
          style={[styles.searchInput, styles.dateInput]}
          placeholder="Du (AAAA-MM-JJ)"
          value={startDate}
          onChangeText={setStartDate}
        />
        <TextInput
          style={[styles.searchInput, styles.dateInput]}
          placeholder="Au (AAAA-MM-JJ)"
          value={endDate}
          onChangeText={setEndDate}
        />
      </View>

      {(startDate !== '' || endDate !== '') && (
        <TouchableOpacity onPress={clearDateFilter} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Effacer le filtre de date</Text>
        </TouchableOpacity>
      )}

      {/* Liste des résultats */}
      {filteredInterventions.length === 0 ? (
        <Text style={styles.emptyText}>
          {interventions.length === 0
            ? "Aucune intervention enregistrée.\nAjoutez-en une depuis l'onglet 'Ajouter'."
            : "Aucun résultat trouvé pour cette recherche."}
        </Text>
      ) : (
        <FlatList
          data={filteredInterventions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.designation}</Text>
              <Text>Quantité: {item.quantite}</Text>
              <Text>État: {item.etat}</Text>
              <Text>Destination: {item.destination}</Text>
              <Text style={styles.date}>Date: {item.date}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 0.48,
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  clearButtonText: {
    color: '#dc3545',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  date: { color: '#666', marginTop: 5, fontSize: 12 },
});