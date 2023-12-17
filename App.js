import React from 'react';
import { Text, View, SafeAreaView, TextInput, Image, Pressable, TouchableOpacity, FlatList, CommonActions } from 'react-native';
import { useState, useEffect } from "react";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles.js';
import fetchHistory from './FetchHistory';
import deleteStats from './deleteStats.js';
import { Alert } from 'react-native';

// global var for checking if addStats submitted
let submitCheck = false;  

// add game to async storage
const addHistory = async (goalsToAdd, shotsToAdd, winsToAdd, loseToAdd, teamName) => {
  try{
    let currentList = await AsyncStorage.getItem('totalList');
    // Initialize currentList as an empty array if it's null
    currentList = currentList ? JSON.parse(currentList) : [];
    const newList = [goalsToAdd, shotsToAdd, winsToAdd, loseToAdd, teamName];
    currentList.push(newList);
    await AsyncStorage.setItem('totalList', JSON.stringify(currentList));
  }
  catch (error) {
    console.error('Error updating:', error);
  }
};

// add all stats to async storage
const addTotalGoals = async (goalsToAdd, shotsToAdd, winsToAdd, loseToAdd) => {
  try {
    // Retrieve the current stats value
    const currentTotalGoals = await AsyncStorage.getItem('totalGoals');
    const currentTotalShots = await AsyncStorage.getItem('totalShots');
    const currentTotalWins = await AsyncStorage.getItem('totalWins');
    const currentTotalLose = await AsyncStorage.getItem('totalLose');
    const currentTotalTie = await AsyncStorage.getItem('totalTie');
    const currentShutout = await AsyncStorage.getItem('totalShutout');

    // Convert the retrieved value to an integer (default to 0 if it doesn't exist)
    const parsedCurrentTotalGoals = currentTotalGoals ? parseInt(currentTotalGoals, 10) : 0;
    const parsedCurrentTotalShots = currentTotalShots ? parseInt(currentTotalShots, 10) : 0;
    const parsedCurrentTotalWins = currentTotalWins ? parseInt(currentTotalWins, 10) : 0;
    let parsedCurrentTotalLose = currentTotalLose ? parseInt(currentTotalLose, 10) : 0;
    let parsedCurrentTotalTie = currentTotalTie ? parseInt(currentTotalTie, 10) : 0; 
    let parsedCurrentShutout = currentShutout ? parseInt(currentShutout, 10) : 0;

    // Add the new stats to the existing total
    const updatedTotalGoals = parsedCurrentTotalGoals + goalsToAdd;
    const updatedTotalShots = parsedCurrentTotalShots + shotsToAdd;
    const updatedTotalWins = parsedCurrentTotalWins + winsToAdd;
    if (loseToAdd === 1){
      parsedCurrentTotalLose = parsedCurrentTotalLose + loseToAdd;
    }
    if (loseToAdd === 2){
      parsedCurrentTotalTie = parsedCurrentTotalTie + 1;
    }
    // if 0 goals scores, count game as a shutout
    if (goalsToAdd === 0) {
      parsedCurrentShutout = parsedCurrentShutout + 1;
    }

    // Save the updated values
    await AsyncStorage.setItem('totalGoals', updatedTotalGoals.toString());
    await AsyncStorage.setItem('totalShots', updatedTotalShots.toString());
    await AsyncStorage.setItem('totalWins', updatedTotalWins.toString());
    await AsyncStorage.setItem('totalLose', parsedCurrentTotalLose.toString());
    await AsyncStorage.setItem('totalTie', parsedCurrentTotalTie.toString());
    await AsyncStorage.setItem('totalShutout', parsedCurrentShutout.toString());
  } 
  catch (error) {
    console.error('Error updating:', error);
  }
};

// App.js:122 Uncaught TypeError: submitCheck is not a function at App.js:122:1


const fetchStats = async() => {
    // Retrieve the current stat value
    const currentTotalGoals = await AsyncStorage.getItem('totalGoals');
    const currentTotalShots = await AsyncStorage.getItem('totalShots');
    const currentTotalWins = await AsyncStorage.getItem('totalWins');
    const currentTotalLose = await AsyncStorage.getItem('totalLose');
    const currentTotalTie = await AsyncStorage.getItem('totalTie');
    const currentShutout = await AsyncStorage.getItem('totalShutout')
    // Convert the retrieved value to an integer (default to 0 if it doesn't exist)
    const parsedCurrentTotalGoals = currentTotalGoals ? parseInt(currentTotalGoals, 10) : 0;
    const parsedCurrentTotalShots = currentTotalShots ? parseInt(currentTotalShots, 10) : 0;
    const parsedCurrentTotalWins = currentTotalWins ? parseInt(currentTotalWins, 10) : 0;
    const parsedCurrentTotalLose = currentTotalLose ? parseInt(currentTotalLose, 10) : 0;
    const parsedCurrentTotalTie = currentTotalTie ? parseInt(currentTotalTie, 10) : 0;
    const parsedCurrentShutout = currentShutout ? parseInt(currentShutout, 10) : 0;
    // return the stats
    return {
      totalGoals: parsedCurrentTotalGoals,
      totalShots: parsedCurrentTotalShots,
      totalWins: parsedCurrentTotalWins,
      totalLose: parsedCurrentTotalLose,
      totalTie: parsedCurrentTotalTie,
      totalShutout: parsedCurrentShutout,
    };
};

function SubmitCheck(){
  submitCheck = true;
}
function IsSubmitCheckTrue() {
  return submitCheck;
}

// Home Screen
function HomeScreen({ navigation }){

  const [isSaved, setIsSaved] = useState(IsSubmitCheckTrue());
  // timer for data saved display, 5 seconds
  useEffect(() => {
    let timer;
    if (isSaved) {
      timer = setTimeout(() => {
        setIsSaved(false);
      }, 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isSaved]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('./assets/hockey-mask.png')}
        style={{ width: 150, height: 150 }}
      />
      <Text style={styles.title}>Goalie Stat Tracker</Text>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.Pbutton} onPress={() => navigation.navigate('Add Stats', {teamInit: null, shotInit: 0, goalInit: 0, winInit: 0, loseInit: 0})} >
            <Text style={styles.text}>Add Stats</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.Pbutton} onPress={() => navigation.navigate('All Stats')} >
          <Text style={styles.text}>Stats</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.Pbutton} onPress={() => navigation.navigate('Game History')} >
          <Text style={styles.text}>History</Text>
        </Pressable>
      </View>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      {isSaved ? (
        <View style={{ backgroundColor: '#007AFF', padding: 20, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{ fontSize: 15, color: 'white' }}>Game Data Saved</Text>
        </View>
      ) : null}
    </View>

    </SafeAreaView>
  );
}

// add stats screen
function AddScreen({ route }) {

  const navigation = useNavigation();

  const { teamInit, shotInit, goalInit, winInit, loseInit } = route.params;

  const [message, setMessage] = useState("");

  const [count, setCount] = useState(shotInit);
  
  const [goals, setGoals] = useState(goalInit);

  const [isMessageDone, setMessageDone] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);
  const [isWLDone, setWLDone] = useState(false);

  useEffect(() => {
    if (teamInit != null) {
      setMessage(teamInit);
      setMessageDone(true);
    }
    if (winInit === 1) {
      handleWinPress();
    } 
    else if (loseInit === 1) {
      handleLosePress();
    }
  }, [teamInit]);

  // decrement and increment shots
  function decrementCount(){
    if (count > 0) {
      setCount(prevCount => prevCount - 1);
    }
  }
  function incrementCount(){
    setCount(prevCount => prevCount + 1)
  }
  // decrement and increment goals
  function decrementGoals(){
    if (goals > 0){
      setGoals(prevGoals => prevGoals - 1);
    }
  }
  function incrementGoals(){
    setGoals(prevGoals => prevGoals + 1)
  }
  // win or loss buttons
  const handleWinPress = () => {
    setSelectedOption('win');
    setWLDone(true);
  };

  const handleLosePress = () => {
    setSelectedOption('lose');
    setWLDone(true);
  };

  const handleTiePress = () => {
    setSelectedOption('tie');
    setWLDone(true);
  };
  // textbox
  const handleTextChange = (text) => {
    setMessage(text);
    setMessageDone(true);
  };

  // submit button is pressed
  const handleSubmit = () => {
    if (isMessageDone == true && isWLDone == true) {
      if (selectedOption === 'win') {
        // addTotalGoals() somehow?
        addTotalGoals(goals, count, 1, 0);
        // TODO: change specific array in full array
        // save new array as the old array
        addHistory(goals, count, 1, 0, message);
      } else if (selectedOption === 'lose') {
        addTotalGoals(goals, count, 0, 1);
        addHistory(goals, count, 0, 1, message);
      } else if (selectedOption === 'tie') {
        addTotalGoals(goals, count, 0, 2);
        addHistory(goals, count, 0, 2, message);
      }
      setGoals(0);
      setCount(0);
      setSelectedOption(null);
      setMessage("");
      setWLDone(false);
      setMessageDone(false);
      SubmitCheck();
      navigation.push('Home');
    }
  }

  return (

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.textAdd}>Enter Opponent Here:</Text>
        <TextInput
          placeholder="Opposing team"
          value={message}
          onChangeText={handleTextChange}
          style={[styles.input, { marginBottom: 20 }]}
      />
      <Text style={styles.textAdd}>Shots:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>

      <View style={styles.container}>
	      <TouchableOpacity 
	            style={[styles.floatingButton, {right: 20}]}
	            onPress={decrementCount}>
		    <Icon name="minus" size={40} color="black" />
	      </TouchableOpacity>
      </View>

      <Text style={[styles.textCounter, { fontSize: 30 }]}>{count}</Text>
        
        <View style={styles.container}>
	      <TouchableOpacity 
            style={[styles.floatingButton, { left: 20 }]}
            onPress={incrementCount}>
		    <Icon name="plus" size={40} color="black" />
	      </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.textAdd}>Goals:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      <View style={styles.container}>
	      <TouchableOpacity 
	            style={[styles.floatingButton, {right: 20}]}
	            onPress={decrementGoals}>
		    <Icon name="minus" size={40} color="black" />
	      </TouchableOpacity>
      </View>

      <Text style={[styles.textCounter, { fontSize: 30 }]}>{goals}</Text>
      
      <View style={styles.container}>
	      <TouchableOpacity 
	            style={[styles.floatingButton, {left: 20}]}
	            onPress={incrementGoals}>
		    <Icon name="plus" size={40} color="black" />
	      </TouchableOpacity>
      </View>
    </View>

      <View style={styles.winLose}>
    
      <Pressable style={[styles.WLbutton, { backgroundColor: selectedOption === 'win' ? 'black' : 'gray', right: 5 }]} onPress={handleWinPress}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Win</Text>  
      </Pressable>  

      <Pressable style={[styles.WLbutton, { backgroundColor: selectedOption === 'lose' ? 'black' : 'gray'}]} onPress={handleLosePress}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Lose</Text>
      </Pressable>

      <Pressable style={[styles.WLbutton, { backgroundColor: selectedOption === 'tie' ? 'black' : 'gray', left: 5 }]} onPress={handleTiePress}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Tie</Text>
      </Pressable>

    </View>

    <View style={styles.winLose}>
      <Pressable style={[styles.PbuttonAdd, {backgroundColor: isMessageDone == true && isWLDone == true ? 'black' : 'gray'}]} 
      onPress={() => { handleSubmit();}}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Submit</Text>
      </Pressable>
    </View>

    </View>
  );
}

// stats screen
function Stats({ navigation }) {
  const [stats, setStats] = useState({
    totalGoals: 0,
    totalShots: 0,
    totalWins: 0,
    totalLose: 0,
    totalTie: 0,
    totalShutout: 0,
  });

  const [statsAgain, setStatsAgain] = useState([]);

  useEffect(() => {
    // Fetch the stats when the component mounts
    async function fetchData() {
      try {
        const fetchedStats = await fetchStats();
        console.log(fetchedStats);
        setStats(fetchedStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Update statsAgain whenever stats changes
    setStatsAgain([
      { category: 'Shots', value: stats.totalShots },
      { category: 'Saves', value: stats.totalShots - stats.totalGoals },
      { category: 'Goals', value: stats.totalGoals },
      { category: 'GAA', value: ((stats.totalGoals) / (stats.totalWins + stats.totalLose + stats.totalTie)).toFixed(2) },
      { category: 'SV%', value: ((stats.totalShots - stats.totalGoals) / stats.totalShots).toFixed(3) },
      { category: 'Shutouts', value: stats.totalShutout },
      { category: 'Wins', value: stats.totalWins },
      { category: 'Loses', value: stats.totalLose },
      { category: 'Ties', value: stats.totalTie},
    ]);
  }, [stats]);

  const renderStatItem = ({ item }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{isNaN(item.value) ? '0' : item.value}</Text>
      <Text style={styles.statsCategory}>{item.category}</Text>
    </View>
  );


    return (
      <View style={styles.containerStats}>
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>My Goalie</Text>
            <Text style={styles.userFollowers}>Record: {stats.totalWins} - {stats.totalLose} - {stats.totalTie}</Text>
          </View>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Seasons Stats</Text>
          <FlatList
            data={statsAgain}
            renderItem={renderStatItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        </View>
      </View>
    );
  }; 


// history screen
function History({ navigation }) {

  const [fetchedHistoryStats, setFetchedHistoryStats] = useState([]); // Initialize as an empty array

  useEffect(() => {
    // Fetch the stats when the component mounts
    async function fetchDataHistory() {
      try {
        const historyStats = await fetchHistory();
        setFetchedHistoryStats(historyStats.totalList); // Set the value in component state
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    fetchDataHistory();
  }, []);

  const handleClick = (teamHistory, fetchedHistoryStats, listIndices) => {
    const exactGame = teamHistory;
    const totalHistory = fetchedHistoryStats;
    const teamIndices = listIndices;
    navigation.navigate('Game Stats', {exactGame, totalHistory, teamIndices});
  }

  // Assuming fetchedHistoryStats is [3, 8, 1, 0, 'fdkfmsf']
  let data = [];
  let goals, shots, wins, loss, teamName;
  for(var i = 0; i < fetchedHistoryStats.length; i++){
    [goals, shots, wins, loss, teamName] = fetchedHistoryStats[i];
    data[i] = {
      teamHistory: [teamName, shots, goals, wins, loss],
      listIndices: i,
      descriptionHistory: `${teamName} - ${shots} shots, ${goals} goals`,
      winLoss: loss === 2 ? 'T' : loss ? 'L' : 'W',

    };
  }  

  return (
    <View style={styles.containerHistory}>

      <FlatList
        style={styles.notificationListHistory}
        enableEmptySections={true}
        data={data.reverse()}
        renderItem={({ item }) => {
          return (
            <Pressable style={styles.notificationBoxHistory} onPress={() => handleClick(item.teamHistory, fetchedHistoryStats, item.listIndices)}>
              <Text style={styles.winLossText}>{item.winLoss}</Text>
              <Text style={styles.descriptionHistory}>{item.descriptionHistory}</Text>
            </Pressable>
          )
        }}
      />
    </View>
  )
}

const deleteHistory = async (newList) => {
  try{
    // Initialize currentList as an empty array if it's null
    const currentList = newList;
    await AsyncStorage.setItem('totalList', JSON.stringify(currentList));
  }
  catch (error) {
    console.error('Error updating:', error);
  }
};

// stats screen
function GameStat({ route }) {

  const navigation = useNavigation();

  const [stats, setStats] = useState({
      totalGoals: 0,
      totalShots: 0,
      totalWins: 0,
      totalLose: 0,
    });
  
    const [statsAgain, setStatsAgain] = useState([]);
    const {exactGame, totalHistory, teamIndices} = route.params;
    const outcome = exactGame[3] === 1 ? 'Win' : exactGame[4] === 1 ? 'Loss' : exactGame[4] === 2 ? 'Tie' : '';

    useEffect(() => {
      // Update statsAgain whenever stats changes
      setStatsAgain([
        { category: 'Shots', value:  exactGame[1]},
        { category: 'Saves', value: exactGame[1] - exactGame[2] },
        { category: 'Goals', value: exactGame[2] },
        { category: 'GAA', value: ((exactGame[2]) / (1)).toFixed(2) },
        { category: 'SV%', value: ((exactGame[1] - exactGame[2]) / exactGame[1]).toFixed(3) },
        { category: 'Outcome', value: outcome},
      ]);
    }, [stats]);

    const showDeleteConfirmation = () => {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this game? This can not be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              deleteGame(teamIndices, totalHistory);
            },
          },
        ],
        { cancelable: true }
      );
    };
    

    const deleteGame = (teamIndices, totalHistory) =>{
      // delete game in array
      totalHistory.splice(teamIndices, 1);
      deleteHistory(totalHistory);
      // shots, goals, win, lose
      deleteStats(exactGame[1], exactGame[2], exactGame[3], exactGame[4]);
      SubmitCheck();
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    };

  // Assuming fetchedHistoryStats is [3, 8, 1, 0, 'fdkfmsf']
  const renderGameItem = ({ item }) => (
    <View style={styles.statItem}>
    <Text style={styles.statValue}>{typeof item.value === 'number' ? item.value : String(item.value)}</Text>
      <Text style={styles.statsCategory}>{item.category}</Text>
    </View>
  );

    return (
      <View style={styles.containerStats}>
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>{exactGame[0]}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>

              <Pressable onPress={() => showDeleteConfirmation()} style={{ marginRight: 20 }}>
                <Icon style={styles.editB} size={30} name="trash" />
              </Pressable>
              
              <Pressable onPress={() => navigation.navigate('Edit Stats', {teamInit: exactGame[0], shotInit: exactGame[1], goalInit: exactGame[2], winInit: exactGame[3], loseInit: exactGame[4], totalList: totalHistory, teamIndices: teamIndices})}>
                <Icon style={styles.editB} size={30} name="edit" />
              </Pressable>
              
            </View>

          </View>
            <Text style={styles.userFollowers}></Text>
          </View>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Game Stats</Text>
          <FlatList
            data={statsAgain}
            renderItem={renderGameItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        </View>
      </View>
    );
  };

  
// add stats screen
function EditStat({ route }) {

  const navigation = useNavigation();

  const { teamInit, shotInit, goalInit, winInit, loseInit, totalList, teamIndices } = route.params;
  // indices of exact game in list of lists, allGames[indicesArray] = change this
  const [indicesArray, setIndicesArray] = useState(teamIndices);
  // list of list of all games
  const [allGames, setAllGames] = useState(totalList);

  const [message, setMessage] = useState("");

  const [count, setCount] = useState(shotInit);
  const [beforeCount, setBeforeCount] = useState(shotInit);

  const [goals, setGoals] = useState(goalInit);
  const [beforeGoal, setBeforeGoal] = useState(goalInit);

  const [isMessageDone, setMessageDone] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedBefore, setSelectedBefore] = useState(null);
  
  const [isWLDone, setWLDone] = useState(false);

  useEffect(() => {
    if (teamInit != null) {
      setMessage(teamInit);
      setMessageDone(true);
    }
    if (winInit === 1) {
      setSelectedBefore('win');
      handleWinPress();
    } 
    else if (loseInit === 1) {
      setSelectedBefore('lose');
      handleLosePress();
    }
    else if (loseInit == 2){
      setSelectedBefore('tie');
      handleTiePress();
    }
  }, [teamInit]);

  // decrement and increment shots
  function decrementCount(){
    if (count > 0) {
      setCount(prevCount => prevCount - 1);
    }
  }
  function incrementCount(){
    setCount(prevCount => prevCount + 1)
  }
  // decrement and increment goals
  function decrementGoals(){
    if (goals > 0){
      setGoals(prevGoals => prevGoals - 1);
    }
  }
  function incrementGoals(){
    setGoals(prevGoals => prevGoals + 1)
  }
  // win or loss buttons
  const handleWinPress = () => {
    setSelectedOption('win');
    setWLDone(true);
  };

  const handleLosePress = () => {
    setSelectedOption('lose');
    setWLDone(true);
  };

  const handleTiePress = () => {
    setSelectedOption('tie');
    setWLDone(true);
  }
  // textbox
  const handleTextChange = (text) => {
    setMessage(text);
    setMessageDone(true);
  };
  const handleStat = () => {
    const newCount = count - beforeCount;
    const newGoal = goals - beforeGoal;
    if (selectedBefore == 'win' && selectedOption == 'win'){
      editStats(newCount, newGoal, goals, 0, 0, 0);
    }
    else if (selectedBefore == 'win' && selectedOption == 'lose'){
      editStats(newCount, newGoal, goals, -1, 1, 0);
    }
    else if (selectedBefore == 'win' && selectedOption == 'tie'){
      editStats(newCount, newGoal, goals, -1, 0, 1);
    }
    else if (selectedBefore == 'lose' && selectedOption == 'lose'){
      editStats(newCount, newGoal, goals, 0, 0, 0);
    }
    else if (selectedBefore == 'lose' && selectedOption == 'win'){
      editStats(newCount, newGoal, goals, 1, -1, 0);
    }
    else if (selectedBefore == 'lose' && selectedOption == 'tie'){
      editStats(newCount, newGoal, goals, 0, -1, 1);
    }
    else if (selectedBefore == 'tie' && selectedOption == 'tie'){
      editStats(newCount, newGoal, goals, 0, 0, 0)
    }
    else if (selectedBefore == 'tie' && selectedOption == 'win'){
      editStats(newCount, newGoal, goals, 1, 0, -1) 
    }
    else if (selectedBefore == 'tie' && selectedOption == 'lose'){
      editStats(newCount, newGoal, goals, 0, 1, -1) 
    }
  };
  // submit button is pressed
  const handleSubmit = () => {
    if (isMessageDone == true && isWLDone == true) {
      if (selectedOption === 'win') {
        // edit history
        editHistory(goals, count, 1, 0, message, indicesArray);
        handleStat();
      } else if (selectedOption === 'lose') {
        //addTotalGoals(goals, count, 0, 1);
        editHistory(goals, count, 0, 1, message, indicesArray);
        handleStat();
      } else if (selectedOption === 'tie') {
        editHistory(goals, count, 0, 2, message, indicesArray);
        handleStat();  
      }
      setGoals(0);
      setCount(0);
      setSelectedOption(null);
      setMessage("");
      setWLDone(false);
      setMessageDone(false);
      SubmitCheck();
      // reset navigation stack to reset history
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  }

  return (

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.textAdd}>Enter Opponent Here:</Text>
        <TextInput
          placeholder="Opposing team"
          value={message}
          onChangeText={handleTextChange}
          style={[styles.input, { marginBottom: 20 }]}
      />
      <Text style={styles.textAdd}>Shots:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }}>

      <View style={styles.container}>
          <TouchableOpacity 
                style={[styles.floatingButton, {right: 20}]}
                onPress={decrementCount}>
            <Icon name="minus" size={40} color="black" />
          </TouchableOpacity>
      </View>

      <Text style={[styles.textCounter, { fontSize: 30 }]}>{count}</Text>
        
        <View style={styles.container}>
          <TouchableOpacity 
            style={[styles.floatingButton, { left: 20 }]}
            onPress={incrementCount}>
            <Icon name="plus" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.textAdd}>Goals:</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      <View style={styles.container}>
          <TouchableOpacity 
                style={[styles.floatingButton, {right: 20}]}
                onPress={decrementGoals}>
            <Icon name="minus" size={40} color="black" />
          </TouchableOpacity>
      </View>

      <Text style={[styles.textCounter, { fontSize: 30 }]}>{goals}</Text>
      
      <View style={styles.container}>
          <TouchableOpacity 
                style={[styles.floatingButton, {left: 20}]}
                onPress={incrementGoals}>
            <Icon name="plus" size={40} color="black" />
          </TouchableOpacity>
      </View>
    </View>

      <View style={styles.winLose}>
    
      <Pressable style={[styles.WLbutton, { backgroundColor: selectedOption === 'win' ? 'black' : 'gray', right: 5 }]} onPress={handleWinPress}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Win</Text>  
      </Pressable>  

      <Pressable style={[styles.WLbutton, { backgroundColor: selectedOption === 'lose' ? 'black' : 'gray'}]} onPress={handleLosePress}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Lose</Text>
      </Pressable>

      <Pressable style={[styles.WLbutton, { backgroundColor: selectedOption === 'tie' ? 'black' : 'gray', left: 5 }]} onPress={handleTiePress}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Tie</Text>
      </Pressable>

    </View>

    <View style={styles.winLose}>
      <Pressable style={[styles.PbuttonAdd, {backgroundColor: isMessageDone == true && isWLDone == true ? 'black' : 'gray'}]} 
      onPress={() => { handleSubmit();}}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Submit</Text>
      </Pressable>
    </View>

    </View>
  );
}

const editHistory = async (goalsToAdd, shotsToAdd, winsToAdd, loseToAdd, teamName, indicesArray) => {
  try{
    let currentList = await AsyncStorage.getItem('totalList');
    // Initialize currentList as an empty array if it's null
    currentList = currentList ? JSON.parse(currentList) : [];
    currentList[indicesArray] = [goalsToAdd, shotsToAdd, winsToAdd, loseToAdd, teamName];
    await AsyncStorage.setItem('totalList', JSON.stringify(currentList));
  }
  catch (error) {
    console.error('Error updating:', error);
  }
};

// editStats(newCount, newGoal, goals, 1, -1);
const editStats = async (shotsToAdd, goalsToAdd, initGoal, winsToAdd, loseToAdd, tieToAdd) => {
  try {
    // Retrieve the current stats value
    const currentTotalShots = await AsyncStorage.getItem('totalShots');
    const currentTotalGoals = await AsyncStorage.getItem('totalGoals');
    const currentTotalWins = await AsyncStorage.getItem('totalWins');
    const currentTotalLose = await AsyncStorage.getItem('totalLose');
    const currentTotalTie = await AsyncStorage.getItem('totalTie');
    const currentShutout = await AsyncStorage.getItem('totalShutout');

    // Convert the retrieved value to an integer (default to 0 if it doesn't exist)
    const parsedCurrentTotalGoals = currentTotalGoals ? parseInt(currentTotalGoals, 10) : 0;
    const parsedCurrentTotalShots = currentTotalShots ? parseInt(currentTotalShots, 10) : 0;
    const parsedCurrentTotalWins = currentTotalWins ? parseInt(currentTotalWins, 10) : 0;
    const parsedCurrentTotalLose = currentTotalLose ? parseInt(currentTotalLose, 10) : 0;
    const parsedCurrentTotalTie = currentTotalTie ? parseInt(currentTotalTie, 10) : 0;
    let parsedCurrentShutout = currentShutout ? parseInt(currentShutout, 10) : 0;

    // Add the new stats to the existing total
    const updatedTotalGoals = parsedCurrentTotalGoals + goalsToAdd;
    const updatedTotalShots = parsedCurrentTotalShots + shotsToAdd;
    const updatedTotalWins = parsedCurrentTotalWins + winsToAdd;
    const updatedTotalLose = parsedCurrentTotalLose + loseToAdd;
    const updatedTotalTie = parsedCurrentTotalTie + tieToAdd;
    // if 0 goals scores, count game as a shutout
    if (initGoal === 0) {
      parsedCurrentShutout = parsedCurrentShutout + 1;
    }

    // Save the updated values
    await AsyncStorage.setItem('totalGoals', updatedTotalGoals.toString());
    await AsyncStorage.setItem('totalShots', updatedTotalShots.toString());
    await AsyncStorage.setItem('totalWins', updatedTotalWins.toString());
    await AsyncStorage.setItem('totalLose', updatedTotalLose.toString());
    await AsyncStorage.setItem('totalTie', updatedTotalTie.toString());
    await AsyncStorage.setItem('totalShutout', parsedCurrentShutout.toString());
  } 
  catch (error) {
    console.error('Error updating:', error);
  }
};

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Add Stats" component={AddScreen} />
        <Stack.Screen name="All Stats" component={Stats} />
        <Stack.Screen name="Game History" component={History} />
        <Stack.Screen name="Game Stats" component={GameStat} />
        <Stack.Screen name="Edit Stats" component={EditStat} />
      </Stack.Navigator> 
    </NavigationContainer>
  );
}

export default App;
