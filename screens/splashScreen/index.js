import { View, Text, StyleSheet } from "react-native"


export default function AppSplashScreen() {
    return (
        <View
            style={styles.container}>
            <Text style={{fontSize: 40,color: 'white'}}>Raasta App 👋</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container :{
        flex: 1,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center'
    }
})