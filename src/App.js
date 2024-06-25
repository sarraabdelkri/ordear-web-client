import { Provider } from "react-redux";
import React, { useEffect, useState } from "react";
import store from "./store/store";
import { Toaster } from 'react-hot-toast';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Root from "./pages/Root";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ActivatePage from "./pages/ActivatePage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import MenuPage from "./pages/MenuPage";
import PaymentPage from "./pages/PaymentPage";
import "bootstrap/dist/css/bootstrap.min.css";
import ClaimsPage from "./pages/ClaimsPage";
import Cart from "./components/Menu/Cart";
import MenuRestPage from "./pages/MenuRestPage";
import SearchResultsPage from "./components/Navs/search-results";
import Orders from "./components/Home/orders";
import Saveurs from "./components/Home/Saveurs";
import BestOfBest from "./components/Home/BestOfBest";
import CoupCoeur from "./components/Home/CoupCoeur";
import AboutUs from "./components/Home/AboutUs";
import WhyChooseUs from "./components/Home/whychooseUs";
import SearchPage from "./components/Menu/SearchPage";
import Carts from "./components/Menu/search/Carts";
import DishDetails from "./components/Menu/search/DishDetails";
import Allergy from "./components/Menu/Allergy";
import OrderDetials from "./components/Home/orderDetails";
import WishlistPage from "./components/Menu/search/WishlistPage";
import Notifications from "./components/Menu/search/Notifications";
import ReclamationForm from "./components/Menu/search/ReclamationForm";
import ReclamationList from "./components/Menu/search/ReclamationList";
import Chat from "./components/Menu/search/Chat";
import './index.css'; 
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/search/:restaurantId", element: <SearchPage />},
      { path: "/dish-details/:productId", element: <DishDetails /> },
      {path: "/orderdetails/:userId/:orderId", element: <OrderDetials />},
      { path: "/", element: <Navigate to="/home" /> },
      { path: "/home", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      //{ path : '/activate', element : <ActivatePage />},
      { path: "/activate", element: <ActivatePage /> },
      { path: "/forget", element: <ForgetPasswordPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/menu", element: <MenuPage /> },
      { path: "/cart", element: <Cart /> },
      { path: "/payment", element: <PaymentPage /> },
      { path: "/claims", element: <ClaimsPage /> },
      { path: "*", element: <HomePage /> },
      { path: "/menurest/:restaurantId", element: <MenuRestPage /> },
      { path: "/search-results", element: <SearchResultsPage /> },
      { path: "/orders", element: <Orders /> },
      { path: "/saveurs", element: <Saveurs /> },
      { path: "/bestofbest", element: <BestOfBest /> },
      { path: "/coupcoeur", element: <CoupCoeur /> },
      { path: "/aboutus", element: <AboutUs /> },
      { path: "/whychooseus", element: <WhyChooseUs /> },
      {path: "/cart", element: <Carts />},
      {path:"/Allergy", element: <Allergy/>},
      {path:"/wishlist", element: <WishlistPage/>},
      {path:"/notifications", element: <Notifications/>},
      {path:"/reclamation", element: <ReclamationForm/>},
      {path:"/reclamationlist", element: <ReclamationList/>},
      {path:"/chat", element: <Chat/>},
    ],
  },
]);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Spinner shows for 3 seconds
  }, []);
  if (loading) {
    return (
      <div className="spinner-container">
        <img src="%PUBLIC_URL%/logo1.png" alt="Loading..." className="spinner-logo"/>
      </div>
    );
  }
  return (
    <>
          <Toaster />

    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    </>
  );
}

export default App;
