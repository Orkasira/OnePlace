import "./Checkout.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cartItems = [], setCartItems }) {
  const deliveryPrice = 5;
  const [subtotal, setSubtotal] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    address: "",
    zip: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cartItems]);

  const updateQuantity = (id, size, color, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id, size, color) => {
    setCartItems((items) =>
      items.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color)
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = () => {
    const allFilled = Object.values(formData).every((v) => v.trim() !== "");
    if (!allFilled) {
      alert("Please fill all fields before proceeding!");
      return;
    }
    navigate("/congrats"); // გადამისამართება Congrats გვერდზე
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-content">
        <div className="checkout-form">
          <h2 className="order-detail">Order details</h2>
          <form className="form-container" onSubmit={(e) => e.preventDefault()}>
            <div className="form-names">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="surname"
                placeholder="Surname"
                value={formData.surname}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="email-form"
              value={formData.email}
              onChange={handleInputChange}
            />
            <div className="form-address">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="zip"
                placeholder="Zip Code"
                value={formData.zip}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </div>
        <div className="checkout-items">
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div key={index} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <div className="item-header">
                      <p>{item.name}</p>
                      <p>${item.price}</p>
                    </div>

                    <p>{item.color}</p>
                    <p>{item.size}</p>
                    <div className="items-control">
                      <div className="quantity-control">
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
                        onClick={() =>
                          removeItem(item.id, item.size, item.color)
                        }
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="checkout-summary">
                <div className="summary-item">
                  <p>Items subtotal:</p>
                  <p>${subtotal}</p>
                </div>
                <div className="summary-item">
                  <p>Delivery:</p>
                  <p>${deliveryPrice}</p>
                </div>
                <div className="summary-item">
                  <p>Total:</p>
                  <p>${subtotal + deliveryPrice}</p>
                </div>
                <button className="checkout-pay" onClick={handlePay}>
                  Pay
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
