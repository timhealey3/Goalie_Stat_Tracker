import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput, Image, Pressable, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';


const addHistory = async (goalsToAdd, shotsToAdd, winsToAdd, loseToAdd, teamName) => {
  try{
    let currentList = await AsyncStorage.getItem('totalList');
    // Initialize currentList as an empty array if it's null
    currentList = currentList ? JSON.parse(currentList) : [];
    const newList = [goalsToAdd, shotsToAdd, winsToAdd, loseToAdd, teamName];
    currentList.push(newList); // Use push on currentList
    await AsyncStorage.setItem('totalList', JSON.stringify(currentList));
  }
  catch (error) {
    console.error('Error updating:', error);
  }
};

const fetchHistory = async() => {
  // Retrieve the current total_goals value
  let currentList = await AsyncStorage.getItem('totalList');
  // Convert the retrieved value to an integer (default to 0 if it doesn't exist)
  currentList = currentList ? JSON.parse(currentList) : [];
  return {
    totalList: currentList,
  };
};

const addTotalGoals = async (goalsToAdd, shotsToAdd, winsToAdd, loseToAdd) => {
  try {
    // Retrieve the current total_goals value
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

    // Add the new goalsToAdd to the existing total
    const updatedTotalGoals = parsedCurrentTotalGoals + goalsToAdd;
    const updatedTotalShots = parsedCurrentTotalShots + shotsToAdd;
    const updatedTotalWins = parsedCurrentTotalWins + winsToAdd;
    const updatedTotalLose = parsedCurrentTotalLose + loseToAdd;

    if (goalsToAdd === 0) {
      parsedCurrentShutout = parsedCurrentShutout + 1;
    }

    // Save the updated values
    await AsyncStorage.setItem('totalGoals', updatedTotalGoals.toString());
    await AsyncStorage.setItem('totalShots', updatedTotalShots.toString());
    await AsyncStorage.setItem('totalWins', updatedTotalWins.toString());
    await AsyncStorage.setItem('totalLose', updatedTotalLose.toString());
    await AsyncStorage.setItem('totalShutout', parsedCurrentShutout.toString());

    // log that check it works
    console.log(`Total Goals updated to: ${updatedTotalGoals}`);
    console.log(`Total Shots updated to: ${updatedTotalShots}`);
    console.log(`Total Wins updated to: ${updatedTotalWins}`);
    console.log(`Total Lose updated to: ${updatedTotalLose}`);
    console.log(`Total SO updated to: ${parsedCurrentShutout}`);
  } catch (error) {
    console.error('Error updating:', error);
  }
};


const fetchStats = async() => {
    // Retrieve the current total_goals value
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
    return {
      totalGoals: parsedCurrentTotalGoals,
      totalShots: parsedCurrentTotalShots,
      totalWins: parsedCurrentTotalWins,
      totalLose: parsedCurrentTotalLose,
      totalShutout: parsedCurrentShutout,
    };
};


// screen one
function HomeScreen({ navigation }){
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
    </SafeAreaView>
  );
}

function AddScreen({ navigation }) {

  const [message, setMessage] = useState("");

  const [count, setCount] = useState(0) 
  
  const [goals, setGoals] = useState(0)

  const [selectedOption, setSelectedOption] = useState(null)

  function decrementCount(){
    if (count > 0) {
      setCount(prevCount => prevCount - 1);
    }
  }
  function incrementCount(){
    setCount(prevCount => prevCount + 1)
  }

  function decrementGoals(){
    if (goals > 0){
      setGoals(prevGoals => prevGoals - 1);
    }
  }
  function incrementGoals(){
    setGoals(prevGoals => prevGoals + 1)
  }

  const handleWinPress = () => {
    setSelectedOption('win');
  };

  const handleLosePress = () => {
    setSelectedOption('lose');
  };

  const handleSubmit = () => {
    console.log("Goals:", goals);
    console.log("Shots:", count);
    console.log("Message:", message);
    
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
    
  }

  return (

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.textAdd}>Enter Opponent Here:</Text>
        <TextInput
          placeholder="Opposing team"
          value={message}
          onChangeText={(text) => setMessage(text)}
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
        <Text style={styles.textAdd}>Win</Text>  
      </Pressable>  

      <Pressable style={[styles.WLbutton, { backgroundColor: selectedOption === 'lose' ? 'black' : 'gray', left: 5 }]} onPress={handleLosePress}>
        <Text style={styles.textAdd}>Lose</Text>
      </Pressable>
    </View>

    <View style={styles.winLose}>
      <Pressable style={styles.PbuttonAdd} onPress={() => { handleSubmit(); navigation.push('Home'); }}>
        <Text style={styles.textAdd}>Submit</Text>
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
        console.log(historyStats.totalList);
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

const styles = StyleSheet.create({
  container: { // style for container
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: { // style for title
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: { // style for buttons
    width: 150,
    marginTop: 15,
  },
  input: { // style for inputs
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: "#fff",
    width: "55%",
    color: "#000",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 10,
  }, 
  button: { // more style for buttons
    marginLeft: 10,
    marginRight: 10,
  }, 
  winLose: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  Pbutton: { // style for pressable buttons
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    marginBottom: 10,
  },
  PbuttonAdd: { // style for pressable buttons
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  WLbutton: { // style for pressable buttons
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  text: {
    fontSize: 25,
    lineHeight: 25,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  textAdd:{
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  floatingButton:{
    borderWidth: 1,
	  borderColor: 'rgba(0,0,0,0.2)',
	  alignItems: 'center',
	  justifyContent: 'center',
	  position: 'absolute',
	  width: 60,
	  height: 60,
    marginTop: 20,
    marginBottom: 20,
	  backgroundColor: '#fff',
	  borderRadius: 100,
  },
  textCounter: {
    fontSize: 30,
  },
  statsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',  
  },
  statRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statContainer2: {
    alignItems: 'center',
  },
  leftSide: {
    textAlign: "left",
    fontSize: 24,
    fontWeight: 'bold',
  },
  rightSide: {
    textAlign: 'right',
    fontSize: 24,
    fontWeight: 'bold',
  },
  containerStats: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop:30,
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  userFollowers: {
    color: '#999',
  },
  editButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#008B8B',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
  },
  statsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  statItem: {
    marginTop:20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statsCategory: {
    color: '#999',
  },
  containerHistory: {
    flex: 1,
    backgroundColor: '#EBEBEB',
  },
  formContentHistory: {
    flexDirection: 'row',
    marginTop: 30,
  },
  inputContainerHistory: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    margin: 10,
  },
  iconHistory: {
    width: 30,
    height: 30,
  },
  iconBtnSearchHistory: {
    alignSelf: 'center',
  },
  inputsHistory: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIconHistory: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  saveButtonHistory: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 70,
    alignSelf: 'flex-end',
    backgroundColor: '#40E0D0',
    borderRadius: 30,
  },
  saveButtonTextHistory: {
    color: 'white',
  },
  notificationListHistory: {
    marginTop: 20,
    padding: 10,
  },
  notificationBoxHistory: {
    padding: 20,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
  },
  imageHistory: {
    width: 45,
    height: 45,
  },
  descriptionHistory: {
    fontSize: 25,
    color: 'black',
    marginLeft: 15,
  },
  winLossText:{
    fontSize: 50,
    width: 45,
    fontWeight: 'bold',
  },
});

