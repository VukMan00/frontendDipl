import './App.css';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import NavBar from "./components/NavBar";
import RequireAuth from './components.auth/RequireAuth';
import {Routes,Route} from "react-router-dom";
import { useState } from 'react';
import Login from './components.auth/Login';
import Register from './components.auth/Register';
import Layout from "./components/Layout";
import Unauthorized from './components.auth/Unauthorized';
import GetTests from './components.test/GetTests';
import SaveTest from './components.test/SaveTest';
import GetStudents from './components.students/GetStudents';
import Logout from './components.auth/Logout';
import PreRegister from './components.auth/PreRegister';

const ROLES={
  'User' : 'ROLE_USER',
  'Admin': 'ROLE_ADMIN'
}

function App() {

  const[member,setMember] = useState({
    'username':'',
    'firstname':'',
    'lastname':'',
    'index':'',
    'token':'',
    'role':''
  })

  const[email,setEmail] = useState({
    'recipient':'',
    'msgBody':'',
    'subject':'',
    'attachment':''
  })

  function addMember(loggedMember){
    setMember(loggedMember);
  }

  function addEmail(registrationEmail){
    setEmail(registrationEmail);
  }

  return (
    <>
    <NavBar member={member} />
    <Routes>
      <Route path="/" element={<Layout />}>
          {/* PUBLIC ROUTES */}
          <Route path={"login"} element={<Login addMember={addMember} />} />
          <Route path={"preRegister"} element={<PreRegister addEmail={addEmail}/>} />
          <Route path={"register"} element={<Register email={email}/>} />
          <Route path={"logout"} element={<Logout />}/>
          <Route path={"unauthorized"} element={<Unauthorized />}/>

          {/* PROTECTED ROUTES */}
          <Route element={<RequireAuth allowedRoles={[ROLES.User,ROLES.Admin]}/>}>
            <Route path={"/"} element={<MainPage />} />
            <Route path="/getTests" element={<GetTests />} />
            <Route path="/getStudents" element={<GetStudents />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
             {/* STAVLJAS RUTE KOJIM SAMO ADMIN MOZE DA PRISTUPI */}
             <Route path='/saveTest' element={<SaveTest />}/>
          </Route>


          {/* CATH ALL, WHEN REQUEST ROUTE DOESN'T EXIST */}

      </Route>
    </Routes>
    <Footer />
    </>
  );
}

export default App;
