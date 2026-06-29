import "./App.css";
import { Route, Routes } from "react-router";
import Login from "./LoginRegistration/Login/Login.jsx";
import Registration from "./LoginRegistration/Registration/Registration.jsx";
import Header from "./Components/Header/Header.jsx";
import ProductPage from "./Pages/ProductPage/ProductPage.jsx";
import SingleProductPage from "./Pages/SingleProductPage/SingleProductPage.jsx";
import Checkout from "./Pages/Checkout/Checkout.jsx";
import { useState, useEffect } from "react";
import Congrats from "./Pages/Congrats/Congrats.jsx";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  const handleLogout = () => {
    setLoggedInUser(null);
    setCartItems([]);
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  }, [loggedInUser]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <>
      <Header
        user={loggedInUser}
        onLogout={handleLogout}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
      <Routes>
        <Route path="/" element={<Login onLogin={setLoggedInUser} />} />
        <Route
          path="/Registration"
          element={<Registration onRegister={setLoggedInUser} />}
        />
        <Route path="/ProductPage" element={<ProductPage />} />
        <Route
          path="/ProductPage/:id"
          element={
            <SingleProductPage
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          }
        />
        <Route
          path="/Checkout"
          element={
            <Checkout cartItems={cartItems} setCartItems={setCartItems} />
          }
        ></Route>
        <Route path="/Congrats" element={<Congrats />}></Route>
      </Routes>
    </>
  );
}

export default App;
