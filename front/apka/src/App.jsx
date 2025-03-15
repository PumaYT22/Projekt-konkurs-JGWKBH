import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import SingUp from './pages/SignUp/SingUp'
import Bartek from './pages/Bartek/Bartek'
import Rozmowa from './pages/Rozmowa/Rozmowa'
import NoteDetail from './pages/NoteDetail/NoteDetail'

const routes=(
  <Router>
    <Routes>
      <Route path="/" exact element={<Home />}></Route>
      <Route path="/dashboard" exact element={<Home />}></Route>
      <Route path="/login" exact element={<Login />}></Route>
      <Route path="/signUp" exact element={<SingUp />}></Route>
      <Route path="/bartek" exact element={<Bartek />}></Route>
      <Route path="/rozmowa" exact element={<Rozmowa />}></Route>

      <Route path="/note/:id" element={<NoteDetail />} />
    </Routes>
  </Router>
)

const App = () => {
  return (
    <div>
      {routes}

    </div>
  )
}

export default App