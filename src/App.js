import './App.css';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import NavBar from "./components/NavBar";
import RequireAuth from './components.auth/RequireAuth';
import {Routes,Route} from "react-router-dom";
import Login from './components.auth/Login';
import Register from './components.auth/Register';
import Layout from "./components/Layout";
import Unauthorized from './components.auth/Unauthorized';
import PreRegister from './components.auth/PreRegister';
import OptionStudent from './components.options/OptionStudent';
import OptionTest from './components.options/OptionTest';
import CreateStudent from './components.students/CreateStudent';
import UpdateStudent from './components.students/UpdateStudent';
import DeleteStudent from './components.students/DeleteStudent';
import CreateTest from './components.test/CreateTest';
import UpdateTest from './components.test/UpdateTest';
import DeleteTest from './components.test/DeleteTest';
import Missing from './components.auth/Missing';

const ROLES={
  'User' : 'ROLE_USER',
  'Admin': 'ROLE_ADMIN'
}

function App() {

  return (
    <>
    <NavBar />
    <Routes>
      <Route path="/" element={<Layout />}>
          {/* PUBLIC ROUTES */}
          <Route path={"login"} element={<Login />} />
          <Route path={"preRegister"} element={<PreRegister />} />
          <Route path={"register"} element={<Register />} />
          <Route path={"unauthorized"} element={<Unauthorized />}/>

          {/* PROTECTED ROUTES */}
          <Route element={<RequireAuth allowedRoles={[ROLES.User,ROLES.Admin]}/>}>
            <Route path={"/"} element={<MainPage />} />
            <Route path={"tests"} element={<OptionTest />}>
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
                <Route path={"createTest"} element={<CreateTest />}/>
                <Route path={"updateTest"} element={<UpdateTest />}/>
                <Route path={"deleteTest"} element={<DeleteTest />} />
              </Route>
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
             {/* STAVLJAS RUTE KOJIM SAMO ADMIN MOZE DA PRISTUPI */}
             <Route path={"students"} element={<OptionStudent />}>
                <Route path={"createStudent"} element={<CreateStudent />}/>
                <Route path={"updateStudent"} element={<UpdateStudent />}/>
                <Route path={"deleteStudent"} element={<DeleteStudent />} />
             </Route>
          </Route>
          {/* CATH ALL, WHEN REQUEST ROUTE DOESN'T EXIST */}
          <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
    <Footer />
    </>
  );
}

export default App;
