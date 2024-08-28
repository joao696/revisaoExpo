import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Notes from "../screens/Notes"
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
          component={Notes}
          options={{
            title: "Inserir Nota",
            headerShown: false,
          }}
        />

        



    

      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
