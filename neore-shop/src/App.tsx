import './App.css';
import HomePage from './pages/Homepage/HomePage';
import NavBar from './components/Navbar/NavBar';

function App() {
  return (
    <>
      <div className="container">
        <NavBar />
        <HomePage />
      </div>
    </>
  );
}

export default App;
