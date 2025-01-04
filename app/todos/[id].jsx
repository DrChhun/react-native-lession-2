import { useLocalSearchParams, useRouter } from "expo-router";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useState, useEffect, useContext } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { Octicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditScreen() {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const [todo, setTodo] = useState({})
    const Container = Platform.OS === 'web' ? ScrollView : SafeAreaView

    const [loaded, error] = useFonts({
        Inter_500Medium
    })

    useEffect(() => {
        const getDetail = async (id) => {
            const jsonValue = await AsyncStorage.getItem("TodoApp")
            const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

            if (storageTodos && storageTodos.length) {
                const myTodo = storageTodos.find(todo => todo.id.toString() === id)
                setTodo(myTodo)
            }
        }

        getDetail(id)
    }, [id])

    const handleSave = async () => {
        try {
            const savedTodo = { ...todo, title: todo.title }
            const jsonValue = await AsyncStorage.getItem('TodoApp')
            const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

            if (storageTodos && storageTodos.length) {
                const otherTodos = storageTodos.filter(todo => todo.id !== savedTodo.id)
                const allTodos = [...otherTodos, savedTodo]
                await AsyncStorage.setItem('TodoApp', JSON.stringify(allTodos))
            } else {
                await AsyncStorage.setItem('TodoApp', JSON.stringify([savedTodo]))
            }

            router.push('/')
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Container style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Edit todo"
                    placeholderTextColor={"gray"}
                    value={todo?.title || ''}
                    onChangeText={(text) => setTodo(prev => ({ ...prev, title: text }))}
            />
            </View>
            <View style={styles.inputContainer}>
                <Pressable
                    onPress={handleSave}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/')}
                    style={[styles.saveButton, { backgroundColor: 'red' }]}
                >
                    <Text style={[styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
                </Pressable>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 6,
        maxWidth: 1024,
        width: '100%',
        marginHorizontal: 'auto',
        pointerEvents: 'auto'
    },
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        fontSize: 18,
        fontFamily: 'Inter_500Medium',
        minWidth: 0,
        color: 'black'
    },
    saveButton: {
        backgroundColor: 'blue',
        borderRadius: 5, 
        padding: 10
    },
    saveButtonText: {
        fontSize: 18,
        color: 'white'
    }
})