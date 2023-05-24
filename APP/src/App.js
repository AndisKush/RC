import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Main from "./pages/Main"
import Login from "./pages/Login"
import NavBar from './pages/NavBar';
import Produtos from './pages/Produtos';
import Clientes from './pages/Clientes';
import OS from './pages/OS';
import Financeiro from './pages/Financeiro';
import Compras from './pages/Compras'
import Relatorios from './pages/Relatorios'
import MenuEspecial from './pages/MenuEspecial';

function App() {
    
  return (
    <Router>
      <div style={{backgroundColor: 'black'}}>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        
        <Route exact path="/main">
          <NavBar />
          <Main />
        </Route>

        <Route exact path="/clientes">
          <NavBar />
          <Clientes />
        </Route>

        <Route exact path="/produtos">
          <NavBar />
          <Produtos />
        </Route>

        <Route exact path="/os">
          <NavBar />
          <OS />
        </Route>

        <Route exact path="/compras">
          <NavBar />
          <Compras />
        </Route>

        <Route exact path="/financeiro">
          <NavBar />
          <Financeiro />
        </Route>

        <Route exact path="/relatorios">
          <NavBar />
          <Relatorios />
        </Route>

        <Route exact path="/menuespecial">
          <NavBar />
          <MenuEspecial />
        </Route>


      </Switch>
      </div>
    </Router>
  );
}

export default App;
