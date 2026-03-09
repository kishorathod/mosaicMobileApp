import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';

const App = () => {
    return (
        <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SafeAreaProvider>
                    <PaperProvider>
                        <AppNavigator />
                    </PaperProvider>
                </SafeAreaProvider>
            </PersistGate>
        </ReduxProvider>
    );
};

export default App;
