import './App.css'
import SignUpForm from './pages/signup';
import SignInForm from './pages/signin';
import ResetPasswordForm from './pages/reset';
import Dashboard from './pages/dashboard';
import ActivateAccount from './pages/accountActivation';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={ <SignUpForm />} />
          <Route path='/signin' element={ <SignInForm />} />
          <Route path='/reset-password' element={ <ResetPasswordForm />} />
          <Route path='/dashboard' element={ <Dashboard />} />

          <Route path='/activate-account' element={<ActivateAccount />} />
        </Routes>
      </Router>
      {/* <div class="bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
  <div>
    <span class="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg">
      <svg class="h-6 w-6 stroke-white">
      </svg>
    </span>
  </div>
  <h3 class="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight ">Writes upside-down</h3>
  <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm ">
    The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer space.
  </p>
</div> */}
    </>
  )
}

export default App
