import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Orders from './pages/Dashboard/Orders';
import List from './pages/Dashboard/List';
import AddProduct from './pages/Dashboard/AddProduct';
import Login from './pages/Auth/Login';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Dashboard/Home';
import SignUp from './pages/Auth/SignUp';
import UserProvider from './context/UserContext';
import Customer from './pages/Dashboard/Customer';
import Reviews from './pages/Dashboard/Reviews';

function App() {
  return (
    <div>
      <UserProvider>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path='/' element={<Root />} />
            <Route path='/login' exact element={<Login />} />
            <Route path='/signup' exact element={<SignUp />} />
            <Route path='/dashboard' element={<Home />} />
            <Route path='/add-product' element={<AddProduct />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/list' element={<List />} />
            <Route path='/customers' element={<Customer />} />
            <Route path='/reviews' element={<Reviews />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;

// Root Component for Protected Routes
const Root = () => {
  //check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? (
    <Navigate to='/dashboard' />
  ) : (
    <Navigate to='/login' />
  );
};
