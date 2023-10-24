import './App.css';
import Home from './Home';
import InputPage from './InputPage';
import ReactionsPage from './ReactionsPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const serverUrl = 'https://haptic-xcel.onrender.com';

const App = () => {
  return (
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
  );
};

export default App;
