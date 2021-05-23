import Header from './Components/Header/Header';
import Routes from './Routes';
import './App.css';

const App = props => {
  return (
    <div className="App">
      <Header />
      {Routes}
    </div >
  );
}



export default App;
