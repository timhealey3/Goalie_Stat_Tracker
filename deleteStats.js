import AsyncStorage from '@react-native-async-storage/async-storage';

// shots, goals, win, lose
const deleteStats = async (shotsToAdd, goalsToAdd, winsToAdd, loseToAdd) => {
    try {
      // Retrieve the current stats value
      const currentTotalShots = await AsyncStorage.getItem('totalShots');
      const currentTotalGoals = await AsyncStorage.getItem('totalGoals');
      const currentTotalWins = await AsyncStorage.getItem('totalWins');
      const currentTotalLose = await AsyncStorage.getItem('totalLose');
      const currentShutout = await AsyncStorage.getItem('totalShutout');
  
      // Convert the retrieved value to an integer (default to 0 if it doesn't exist)
      const parsedCurrentTotalGoals = currentTotalGoals ? parseInt(currentTotalGoals, 10) : 0;
      const parsedCurrentTotalShots = currentTotalShots ? parseInt(currentTotalShots, 10) : 0;
      const parsedCurrentTotalWins = currentTotalWins ? parseInt(currentTotalWins, 10) : 0;
      const parsedCurrentTotalLose = currentTotalLose ? parseInt(currentTotalLose, 10) : 0;
      let parsedCurrentShutout = currentShutout ? parseInt(currentShutout, 10) : 0;
  
      // Add the new stats to the existing total
      const updatedTotalGoals = parsedCurrentTotalGoals - goalsToAdd;
      const updatedTotalShots = parsedCurrentTotalShots - shotsToAdd;
      const updatedTotalWins = parsedCurrentTotalWins - winsToAdd;
      const updatedTotalLose = parsedCurrentTotalLose - loseToAdd;
      // if 0 goals scores, count game as a shutout
      if (goalsToAdd === 0) {
        parsedCurrentShutout = parsedCurrentShutout - 1;
      }
  
      // Save the updated values
      await AsyncStorage.setItem('totalGoals', updatedTotalGoals.toString());
      await AsyncStorage.setItem('totalShots', updatedTotalShots.toString());
      await AsyncStorage.setItem('totalWins', updatedTotalWins.toString());
      await AsyncStorage.setItem('totalLose', updatedTotalLose.toString());
      await AsyncStorage.setItem('totalShutout', parsedCurrentShutout.toString());
    } 
    catch (error) {
      console.error('Error updating:', error);
    }
  };

  export default deleteStats;
