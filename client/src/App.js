// Allow front-end have route on its own - navigate to different pages
import { BrowserRouter as Router } from 'react-router-dom';
// web frameworks
import {
  Arwes,
  SoundsProvider,
  ThemeProvider,
  createSounds,
  createTheme,
} from 'arwes';

import AppLayout from './pages/AppLayout';

import { theme, resources, sounds } from './settings';

const App = () => {
  return (
    // user interface
    <ThemeProvider theme={createTheme(theme)}>
      <SoundsProvider sounds={createSounds(sounds)}>
        <Arwes
          animate
          background={resources.background.large}
          pattern={resources.pattern}
        >
          {anim => (
            // router component
            <Router>
              <AppLayout show={anim.entered} />
            </Router>
          )}
        </Arwes>
      </SoundsProvider>
    </ThemeProvider>
  );
};

export default App;
