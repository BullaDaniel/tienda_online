import './styles/main.scss';
import {Routes, Route} from 'react-router-dom';
import Page_Card from './pages/Page_Card';
import Home from './pages/Home';
function App() {
  return (
    <Routes>
      <Route 
      path="/"
      element={<Home />} 
      />
      <Route 
      path="/producto/:id"
      element={<Page_Card />} 
      />
    </Routes>
  );
}

export default App;