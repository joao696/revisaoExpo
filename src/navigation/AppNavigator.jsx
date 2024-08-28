import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NotesScreen from "../screens/NotesScreen"
import LoginScreen from "../screens/LoginScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    
    <NavigationContainer>
      <Stack.Navigator>


        
<Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "Inserir Login",
            headerShown: false,
          }}
        />
        

        <Stack.Screen
          name="Notes"
          component={NotesScreen}
          options={{
            title: "Inserir Nota",
            headerShown: false,
          }}
        />

      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
