import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';

export default function ExportScreen({ route }) {
  // Récupération des interventions depuis la navigation
  const interventions = route.params?.interventions || [];

  // 1. Fonction pour générer et exporter le fichier PDF
  const handleExportPDF = async () => {
    if (interventions.length === 0) {
      Alert.alert("Attention", "Aucune donnée disponible à exporter en PDF.");
      return;
    }

    try {
      // Structure HTML du rapport PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
              h1 { text-align: center; color: #11CAA0; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            <h1>Rapport des Interventions</h1>
            <table>
              <thead>
                <tr>
                  <th>Désignation</th>
                  <th>Quantité</th>
                  <th>État</th>
                  <th>Destination</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${interventions
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.designation || '-'}</td>
                    <td>${item.quantite || '-'}</td>
                    <td>${item.etat || '-'}</td>
                    <td>${item.destination || '-'}</td>
                    <td>${item.date || '-'}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      // Génération du fichier PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Ouverture du menu de partage du téléphone
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
      });
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la génération du PDF.");
      console.error(error);
    }
  };

  // 2. Fonction pour générer et exporter le fichier Excel (.xlsx)
  const handleExportExcel = async () => {
    if (interventions.length === 0) {
      Alert.alert("Attention", "Aucune donnée disponible à exporter en Excel.");
      return;
    }

    try {
      // Préparation des données pour le fichier Excel
      const dataToExport = interventions.map((item) => ({
        Désignation: item.designation,
        Quantité: item.quantite,
        État: item.etat,
        Destination: item.destination,
        Date: item.date,
      }));

      // Création du classeur Excel
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Interventions");

      // Conversion en base64 et enregistrement temporaire
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const uri = FileSystem.cacheDirectory + 'Rapport_Interventions.xlsx';

      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Ouverture du menu de partage
      await Sharing.shareAsync(uri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Exporter le fichier Excel',
        UTI: 'com.microsoft.excel.xlsx',
      });
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la génération du fichier Excel.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Export & Impression du Rapport</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#dc3545' }]}
        onPress={handleExportPDF}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Exporter en PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#198754' }]}
        onPress={handleExportExcel}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Exporter en Excel (.xlsx)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});