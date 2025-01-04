import { useEffect, useState } from "react";
import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { data } from "@/data/todos"
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter"
import Animated, { LinearTransition } from 'react-native-reanimated'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router";

export default function Index() {

  const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView

  const [todoData, setTodoData] = useState(data);

  const [inputValue, setInputValue] = useState();

  const router = useRouter()

  const handleAdd = () => setTodoData([
    {
      "id": todoData?.length > 0 ? todoData[0]?.id + 1 : 1,
      "title": inputValue,
      "completed": false
    }, ...todoData])

  const handleRemoveTask = (taskId) => setTodoData(todoData.filter((x) => x.id !== taskId))

  const handleToggleComplete = (taskId) => {
    setTodoData(todoData.map((task) =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const handlePress = (id) => router.push(`/todos/${id}`)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

        if (storageTodos && storageTodos.length) {
          setTodoData(storageTodos.sort((a, b) => b.id - a.id))
        } else {
          setTodoData(data?.sort((a, b) => b.id - a.id))
        }
      } catch (e) {
        console.log(e)
      }
    }

    fetchData()
  }, [data])

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todoData);
        await AsyncStorage.setItem("TodoApp", jsonValue)
      } catch (e) {
        console.error(e)
      }
    }

    storeData()
  }, [todoData])

  const [loaded, error] = useFonts({
    Inter_500Medium,
  })

  if (!loaded && !error) {
    return null;
  }

  return (
    <Container style={styles.container}>
      <View style={styles.inputTop}>
        <TextInput onChangeText={(e) => setInputValue(e)} style={styles.inputTodo} placeholder="Input Your Today Task" />
        <Text style={styles.button} onPress={() => handleAdd()}>Add</Text>
      </View>
      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={<Text>No Task Today</Text>}
        data={todoData}
        keyExtractor={(item) => item?.id?.toString()}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
        renderItem={(x) => (
          <View style={styles?.todoRow}>
            <Pressable onLongPress={() => handlePress(x?.item?.id)}>
              <Text onPress={() => handleToggleComplete(x?.item?.id)} style={x.item.completed ? styles.completedTask : styles.text}>{x?.item?.title}</Text>
            </Pressable>
            <View>
              <Text onPress={() => handleRemoveTask(x?.item?.id)}>Remove</Text>
            </View>
          </View>
        )}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  completedTask: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontSize: 16
  },
  text: {
    fontSize: 16
  },
  button: {
    backgroundColor: 'black',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    width: '20%',
    textAlign: 'center'
  },
  inputTodo: {
    fontFamily: 'Inter_500Medium',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    padding: 12,
    width: '80%'
  },
  inputTop: {
    gap: 8,
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  todoRow: {
    fontFamily: 'Inter_500Medium',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12
  }
});
