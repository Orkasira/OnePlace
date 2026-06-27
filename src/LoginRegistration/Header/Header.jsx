import "./Header.css";
import OnePlace from "../../assets/OnePlace.png";
import defaultUser from "../../assets/defaultphoto.jpg";
import { Link, useNavigate } from "react-router-dom";
import arrow from "../../assets/arrow.png";
import react, { useState } from "react";
import shoppingcart from "../../assets/shoppingcart.png";
import errorcart from "../../assets/errorcart.png";

function Header({ user, onLogout, cartItems, setCartItems }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const displayName =
    user?.username || user?.name || user?.email?.split("@")[0] || "User";
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const deliveryPrice = 5;
  const total = subtotal + deliveryPrice;

  const updateQuantity = (id, size, color, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id, size, color) => {
    setCartItems((items) =>
      items.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color),
      ),
    );
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
  function CartSidebar({ cartItems, setCartItems }) {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const total = subtotal + deliveryPrice;

    const updateQuantity = (id, size, color, delta) => {
      setCartItems((items) =>
        items.map((item) =>
          item.id === id && item.size === size && item.color === color
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item,
        ),
      );
    };

    const removeItem = (id, size, color) => {
      setCartItems((items) =>
        items.filter(
          (item) =>
            !(item.id === id && item.size === size && item.color === color),
        ),
      );
    };

    // save cart in localStorage
    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);
  }
  return (
    <header>
      <Link to="/ProductPage" className="logo">
        <img src={OnePlace} alt="logo" className="OnePlace" />
      </Link>

      <div className="login">
        {user ? (
          <div className="user-container">
            <img
              src={shoppingcart}
              alt="cart"
              className="cart-icon"
              onClick={() => setShowSidebar(true)}
              style={{ cursor: "pointer", marginLeft: "10px" }}
            />
            <img
              src={
                user?.photo ||
                user?.profile_photo ||
                user?.avatar ||
                defaultUser
              }
              alt="user photo"
              className="user-photo"
            />
            <img
              src={arrow}
              alt="arrow"
              className="arrow-icon"
              onClick={toggleDropdown}
              style={{ cursor: "pointer" }}
            />
            {showDropdown && (
              <div className="dropdown">
                <p>{displayName}</p>
                <button onClick={handleLogout}>Log out</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/" className="login-link">
            <h2>Log in</h2>
          </Link>
        )}
      </div>
      {showSidebar && (
        <div className="overlay" onClick={() => setShowSidebar(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h3>Shopping cart ({cartItems.length})</h3>
              <button
                className="close-btn"
                onClick={() => setShowSidebar(false)}
              >
                ✕
              </button>
            </div>

            <div className="sidebar-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <img
                    src={errorcart}
                    alt="empty cart"
                    className="empty-icon"
                  />
                  <h4>Ooops!</h4>
                  <p>You’ve got nothing in your cart just yet…</p>
                  <button
                    className="shop-btn"
                    onClick={() => setShowSidebar(false)}
                  >
                    <Link to="/ProductPage" className="shop-btn-link">
                      Start shopping
                    </Link>
                  </button>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img"
                    />
                    <div className="cart-item-info">
                      <div className="item-header">
                        <p className="item-name">{item.name}</p>
                        <p className="item-price">$ {item.price}</p>
                      </div>
                      <p className="item-meta">{item.color}</p>
                      <p className="item-meta">{item.size}</p>
                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.color, -1)
                            }
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.color, 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() =>
                            removeItem(item.id, item.size, item.color)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="sidebar-footer">
                <div className="summary">
                  <div className="summary-row">
                    <span>Items subtotal</span>
                    <span>$ {subtotal}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery</span>
                    <span>$ {deliveryPrice}</span>
                  </div>
                  <div className="summary-row total">
                    <strong>Total</strong>
                    <strong>$ {total}</strong>
                  </div>
                </div>
                <button
                  className="checkout-btn"
                  onClick={() => {
                    navigate("/Checkout");
                  }}
                >
                  Go to checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
export default Header;
