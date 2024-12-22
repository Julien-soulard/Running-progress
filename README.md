# Running Progress

Une application web pour visualiser et analyser vos performances de course à pied.

## Fonctionnalités

- Visualisation des distances et allures par séance
- Regroupement par jour, semaine ou mois
- Ligne de tendance pour suivre votre progression
- Statistiques clés (distance totale, meilleures performances, etc.)

## Mise à jour des données

Les données sont stockées dans le fichier `public/running_data.csv`. Pour ajouter une nouvelle séance :

1. Ouvrez le fichier CSV
2. Ajoutez une nouvelle ligne au format :
   ```
   Date	Distance (km)	Temps	Allure (min/km)
   21/12/2024	6,45	00:48:10	00:07:28
   ```
   - Date : format JJ/MM/AAAA
   - Distance : en km, avec virgule pour les décimales
   - Temps : format HH:MM:SS
   - Allure : format MM:SS

3. Sauvegardez le fichier et commitez les changements

## Installation locale

```bash
# Cloner le projet
git clone https://github.com/votre-username/Running-progress.git

# Installer les dépendances
cd Running-progress
npm install

# Lancer en mode développement
npm run dev

# Construire pour la production
npm run build
```