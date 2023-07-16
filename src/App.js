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
import ChangePassword from './components.auth/ChangePassword';
import OptionExam from './components.options/OptionExam';
import AddQuestionTest from './components.questiontest/AddQuestionTest';
import { useState } from 'react';
import CreateExam from './components.exams/CreateExam';
import UpdateExam from './components.exams/UpdateExam';
import DeleteExam from './components.exams/DeleteExam';
import OptionQuestion from './components.options/OptionQuestion';
import CreateQuestion from './components.questions/CreateQuestion';
import AddAnswer from './components.answers/AddAnswer';
import UpdateQuestion from './components.questions/UpdateQuestion';
import DeleteQuestion from './components.questions/DeleteQuestion';

const ROLES={
  'User' : 'ROLE_USER',
  'Admin': 'ROLE_ADMIN'
}

function App() {
  const[newQuestionsTest,setNewQuestionsTest]=useState([]);
  const[answers,setAnswers]=useState([]);

  function getQuestionsTest(questionsTest){
    setNewQuestionsTest(questionsTest);
  }

  function getAnswers(newAnswers){
    setAnswers(newAnswers);
  }

  function refreshAnswers(){
    setAnswers([]);
  }


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
          <Route path={"changePassword"} element={<ChangePassword />}/>

          {/* PROTECTED ROUTES */}
          <Route element={<RequireAuth allowedRoles={[ROLES.User,ROLES.Admin]}/>}>
            <Route path={"/"} element={<MainPage />} />
            <Route path={"tests"} element={<OptionTest />}>
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
                <Route path={"createTest"} element={<CreateTest />}>
                  <Route path={"addQuestionTest"} element={<AddQuestionTest />}/>
                </Route>
                <Route path={"updateTest"} element={<UpdateTest newQuestionsTest={newQuestionsTest}/>}>
                  <Route path={"addQuestionTest"} element={<AddQuestionTest getQuestionsTest={getQuestionsTest}/>}/>
                </Route>
                <Route path={"deleteTest"} element={<DeleteTest />} />
              </Route>
            </Route>
            <Route path={"exams"} element={<OptionExam />}>
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
                <Route path={'createExam'} element={<CreateExam />} />
                <Route path={'updateExam'} element={<UpdateExam />}/>
                <Route path={'deleteExam'} element={<DeleteExam />}/>
              </Route>
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
             <Route path={"students"} element={<OptionStudent />}>
                <Route path={"createStudent"} element={<CreateStudent />}/>
                <Route path={"updateStudent"} element={<UpdateStudent />}/>
                <Route path={"deleteStudent"} element={<DeleteStudent />} />
             </Route>
             <Route path={"questions"} element={<OptionQuestion refreshAnswers={refreshAnswers} />}>
                <Route path={"createQuestion"} element={<CreateQuestion newAnswers={answers}/>}>
                  <Route path={"addQuestionTest"} element={<AddQuestionTest />}/>
                  <Route path={"addAnswer"} element={<AddAnswer getAnswers={getAnswers}/>} />
                </Route>
                <Route path={"updateQuestion"} element={<UpdateQuestion newAnswers={answers} newQuestionsTest={newQuestionsTest} />}>
                  <Route path={"addQuestionTest"} element={<AddQuestionTest getQuestionsTest={getQuestionsTest} />}/>
                  <Route path={"addAnswer"} element={<AddAnswer getAnswers={getAnswers}/>} />
                </Route>
                <Route path={"deleteQuestion"} element={<DeleteQuestion />}/>
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
