import React from 'react';
import { Text, View, SafeAreaView, TextInput, Image, Pressable, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles.js';
import fetchHistory from './FetchHistory';

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
    const currentShutout = await AsyncStorage.getItem('totalShutout');

    // Convert the retrieved value to an integer (default to 0 if it doesn't exist)
    const parsedCurrentTotalGoals = currentTotalGoals ? parseInt(currentTotalGoals, 10) : 0;
    const parsedCurrentTotalShots = currentTotalShots ? parseInt(currentTotalShots, 10) : 0;
    const parsedCurrentTotalWins = currentTotalWins ? parseInt(currentTotalWins, 10) : 0;
    const parsedCurrentTotalLose = currentTotalLose ? parseInt(currentTotalLose, 10) : 0;
    let parsedCurrentShutout = currentShutout ? parseInt(currentShutout, 10) : 0;

    // Add the new stats to the existing total
    const updatedTotalGoals = parsedCurrentTotalGoals + goalsToAdd;
    const updatedTotalShots = parsedCurrentTotalShots + shotsToAdd;
    const updatedTotalWins = parsedCurrentTotalWins + winsToAdd;
    const updatedTotalLose = parsedCurrentTotalLose + loseToAdd;
    // if 0 goals scores, count game as a shutout
    if (goalsToAdd === 0) {
      parsedCurrentShutout = parsedCurrentShutout + 1;
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

// App.js:122 Uncaught TypeError: submitCheck is not a function at App.js:122:1


const fetchStats = async() => {
    // Retrieve the current stat value
    const currentTotalGoals = await AsyncStorage.getItem('totalGoals');
    const currentTotalShots = await AsyncStorage.getItem('totalShots');
    const currentTotalWins = await AsyncStorage.getItem('totalWins');
    const currentTotalLose = await AsyncStorage.getItem('totalLose');
    const currentShutout = await AsyncStorage.getItem('totalShutout')
    // Convert the retrieved value to an integer (default to 0 if it doesn't exist)
    const parsedCurrentTotalGoals = currentTotalGoals ? parseInt(currentTotalGoals, 10) : 0;
    const parsedCurrentTotalShots = currentTotalShots ? parseInt(currentTotalShots, 10) : 0;
    const parsedCurrentTotalWins = currentTotalWins ? parseInt(currentTotalWins, 10) : 0;
    const parsedCurrentTotalLose = currentTotalLose ? parseInt(currentTotalLose, 10) : 0;
    const parsedCurrentShutout = currentShutout ? parseInt(currentShutout, 10) : 0;
    // return the stats
    return {
      totalGoals: parsedCurrentTotalGoals,
      totalShots: parsedCurrentTotalShots,
      totalWins: parsedCurrentTotalWins,
      totalLose: parsedCurrentTotalLose,
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
        <Pressable style={styles.Pbutton} onPress={() => navigation.navigate('Add Stats')} >
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
function AddScreen({ navigation }) {

  const [message, setMessage] = useState("");

  const [count, setCount] = useState(0);
  
  const [goals, setGoals] = useState(0);

  const [selectedOption, setSelectedOption] = useState(null);

  const [isMessageDone, setMessageDone] = useState(false);

  const [isWLDone, setWLDone] = useState(false);

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
  // textbox
  const handleTextChange = (text) => {
    setMessage(text);
    setMessageDone(true);
  };

  // submit button is pressed
  const handleSubmit = () => {
    if (isMessageDone == true && isWLDone == true) {
      if (selectedOption === 'win') {
        addTotalGoals(goals, count, 1, 0);
        addHistory(goals, count, 1, 0, message);
      } else if (selectedOption === 'lose') {
        addTotalGoals(goals, count, 0, 1);
        addHistory(goals, count, 0, 1, message);
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

      <Pressable style={[styles.WLbutton, { backgroundColor: selectedOption === 'lose' ? 'black' : 'gray', left: 5 }]} onPress={handleLosePress}>
        <Text style={[styles.textAdd, {color: 'white'}]}>Lose</Text>
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
    totalShutout: 0,
  });

  const [statsAgain, setStatsAgain] = useState([]);

  useEffect(() => {
    // Fetch the stats when the component mounts
    async function fetchData() {
      try {
        const fetchedStats = await fetchStats();
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
      { category: 'GAA', value: ((stats.totalGoals) / (stats.totalWins + stats.totalLose)).toFixed(2) },
      { category: 'SV%', value: ((stats.totalShots - stats.totalGoals) / stats.totalShots).toFixed(3) },
      { category: 'Shutouts', value: stats.totalShutout },
      { category: 'Wins', value: stats.totalWins },
      { category: 'Loses', value: stats.totalLose },
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
            <Text style={styles.userFollowers}>Record: {stats.totalWins} - {stats.totalLose}</Text>
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

  const handleClick = (teamHistory) => {
    const exactGame = teamHistory;
    console.log('exact game', exactGame);
    navigation.navigate('Game Stats', {exactGame});
  }

  // Assuming fetchedHistoryStats is [3, 8, 1, 0, 'fdkfmsf']
  let data = [];
  let goals, shots, wins, loss, teamName;
  for(var i = 0; i < fetchedHistoryStats.length; i++){
    console.log(fetchedHistoryStats[i]);
    [goals, shots, wins, loss, teamName] = fetchedHistoryStats[i];
    data[i] = {
      teamHistory: [teamName, shots, goals, wins, loss],
      descriptionHistory: `${teamName} - ${shots} shots, ${goals} goals`,
      winLoss: wins ? 'W' : 'L',
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
            <Pressable style={styles.notificationBoxHistory} onPress={() => handleClick(item.teamHistory)}>
              <Text style={styles.winLossText}>{item.winLoss}</Text>
              <Text style={styles.descriptionHistory}>{item.descriptionHistory}</Text>
            </Pressable>
          )
        }}
      />
    </View>
  )
}

// stats screen
function GameStat({ route }) {

    const [stats, setStats] = useState({
      totalGoals: 0,
      totalShots: 0,
      totalWins: 0,
      totalLose: 0,
    });
  
    const [statsAgain, setStatsAgain] = useState([]);
    const {exactGame} = route.params;
    const outcome = exactGame[3] === 1 ? 'Win' : exactGame[4] === 1 ? 'Loss' : '';
    console.log(outcome);

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


  console.log("in game stat function", exactGame);
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
            <Text style={styles.userName}>{exactGame[0]}</Text>
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
      </Stack.Navigator> 
    </NavigationContainer>
  );
}

export default App;