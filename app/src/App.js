import './App.css';
import Home from './Home';
import InputPage from './InputPage';
import ReactionsPage from './ReactionsPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const serverUrl = 'https://haptic-xcel.onrender.com';

const App = () => {
  return (
    <div className="App">
      <Helmet>
        <title>Haptic-Xcel</title>
        <meta
          name="description"
          content="Real-time haptic feedback for instructors"
        />
      </Helmet>
      <Router>
        <Routes>
          <Route path="/" element={<InputPage serverurl={serverUrl} />} />
          <Route path="/:session_id" element={<Home serverurl={serverUrl} />} />
          <Route
            path="/:session_id/reactions"
            element={<ReactionsPage serverurl={serverUrl} />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
