import { Provider } from "react-redux";
import store from "./store/store";
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
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/search/:restaurantId", element: <SearchPage />},
      { path: "/dish-details/:productId", element: <DishDetails /> },
      {path: "/orderdetails/:id", element: <OrderDetials />},
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
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
