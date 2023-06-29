import './App.css';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes,Route} from "react-router-dom";
import { useState } from 'react';
import Login from './components.auth/Login';
import Register from './components.auth/Register';

function App() {

  window.addEventListener("beforeunload", function(e) {
    window.location.href = "http://localhost:3000/";
    sessionStorage.clear();
  });

  const[member,setMember] = useState({
    'username':'',
    'firstname':'',
    'lastname':'',
    'index':'',
    'token':'',
    'role':''
  })

  function addMember(loggedMember){
    setMember(loggedMember);
  }

  return (
    <BrowserRouter className="App">
        <NavBar member={member} />
        <Routes>
          <Route path={"/"} element={<MainPage ></MainPage>}></Route>
          <Route path={"/login"} element={<Login addMember={addMember} />}></Route>
          <Route path={"/register"} element={<Register />}></Route>
        </Routes>
        <Footer /> 
    </BrowserRouter>
  );
}

export default App;
