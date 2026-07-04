import "./Checkout.css";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

function Checkout({ cartItems = [], setCartItems }) {
  const navigate = useNavigate();
  const deliveryPrice = 5;

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      address: "",
      zip: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Minimum 2 characters")
        .required("Name is required"),

      surname: Yup.string()
        .min(2, "Minimum 2 characters")
        .required("Surname is required"),

      email: Yup.string().email("Invalid email").required("Email is required"),

      address: Yup.string().required("Address is required"),

      zip: Yup.string()
        .matches(/^[0-9]+$/, "Only numbers")
        .min(4, "Minimum 4 digits")
        .required("Zip Code is required"),
    }),
    onSubmit: () => {
      navigate("/congrats");
    },
  });

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-content">
        <div className="checkout-form">
          <h2 className="order-detail">Order details</h2>

          <form className="form-container" onSubmit={formik.handleSubmit}>
            <div className="form-names">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <small>{formik.errors.name}</small>
                )}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="surname"
                  placeholder="Surname"
                  value={formik.values.surname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.surname && formik.errors.surname && (
                  <small>{formik.errors.surname}</small>
                )}
              </div>
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="email-form"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <small>{formik.errors.email}</small>
              )}
            </div>

            <div className="form-address">
              <div className="form-group">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.address && formik.errors.address && (
                  <small>{formik.errors.address}</small>
                )}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="zip"
                  placeholder="Zip Code"
                  value={formik.values.zip}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.zip && formik.errors.zip && (
                  <small>{formik.errors.zip}</small>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="checkout-items">
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.name} />

                  <div className="item-info">
                    <div className="item-header">
                      <p>{item.name}</p>
                      <p>${item.price}</p>
                    </div>

                    <div className="items-control">
                      <div className="quantity-control">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
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

                <button
                  type="button"
                  className="checkout-pay"
                  onClick={formik.submitForm}
                >
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