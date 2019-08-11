import React, {Fragment} from 'react';
import Routes from './routes';
import { YellowBox } from 'react-native';
// defaut way of declaring the default app function
// const App = () => {
//   return (
//     <Text>Hello World!</Text>
//   );
// };

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket',
  'Remote debugger'
])

function App() {
  return (
    <Routes />
  );
}

export default App;
