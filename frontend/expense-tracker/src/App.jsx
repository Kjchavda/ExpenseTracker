import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense"
import UserProvider from './context/UserContext';

function App() {
  
  return (
    <>
      <UserProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Root />} />
            <Route path='/login' exact element={<Login />} />
            <Route path='/signup' exact element={<SignUp />} />
            <Route path='/dashboard' exact element={<Home />} />
            <Route path='/income' exact element={<Income />} />
            <Route path='/expense' exact element={<Expense />} />
          </Routes>
        </Router>
        <Toaster 
          toastOptions={{
            className: "",
            style: {
              fontSize:'13px'
            },
          }}
        />
      </UserProvider>
    </>
  )
}

export default App

const Root = () => {
  //check if token exists in localstorage
  const isAuthenticated = !!localStorage.getItem("token");

  //Redirect to dashboard if yes and login if no
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
