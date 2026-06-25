import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SingleProductPage.css";
import cart from "../../assets/cart.png";
import errorcart from "../../assets/errorcart.png";
import { Link } from "react-router-dom";

function SingleProductPage({ cartItems, setCartItems }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fade, setFade] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const deliveryPrice = 5;
  const navigate = useNavigate();

  // Fetch product details when component mounts or id changes

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`, {
          headers: { accept: "application/json" },
        });

        const result = await res.json();

        const normalizedProduct = {
          ...result,
          name: result.title || result.name || "Unnamed Product",
          cover_image:
            result.thumbnail || result.images?.[0] || result.cover_image || "",
          images:
            Array.isArray(result.images) && result.images.length > 0
              ? result.images
              : [result.thumbnail].filter(Boolean),
          available_colors: result.available_colors || [],
          available_sizes: result.available_sizes || [],
          brand:
            typeof result.brand === "string"
              ? { name: result.brand, image: "" }
              : result.brand || { name: "Unknown brand", image: "" },
          description: result.description || "No description available.",
        };

        setProduct(normalizedProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  // Main img set

  useEffect(() => {
    if (product) {
      setSelectedImage(product.cover_image);
    }
  }, [product]);

  // Image fade effect

  const changeImage = (img) => {
    if (img === selectedImage) return;
    setFade(true);
    setTimeout(() => {
      setSelectedImage(img);
      setFade(false);
    }, 200);
  };

  // Cart functionality

  const addToCart = () => {
    if (!product) return;

    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item === existing
            ? { ...item, quantity: selectedQuantity || 1 }
            : item,
        ),
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: selectedImage,
          quantity: selectedQuantity || 1,
        },
      ]);
    }

    setShowSidebar(true);
  };

  const updateQuantity = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const total = subtotal + deliveryPrice;

  // save cart in localStorage

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details-container">
      <p className="para">Listing / Product</p>
      <div className="product-detail-wrapper">
        <div className="all-products-photos">
          {product && product.images && product.images.length > 0 ? (
            product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index + 1}`}
                className="single-photo"
                onClick={() => changeImage(image)}
              />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>
        <div className="main-photo">
          <img
            src={selectedImage}
            alt={product.name}
            className={fade ? "fade-out" : "fade-in"}
          />
        </div>
        <div className="product-detail-content">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">$ {product.price}</p>
          <p className="quantity-name">Quantity</p>
          <select
            className="quantity-select"
            value={selectedQuantity || 1}
            onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <br />
          <button className="add-to-cart-btn" onClick={addToCart}>
            <img src={cart} alt="" /> Add to cart
          </button>
          <hr className="hor-line" />
          <div className="product-description-container">
            <div className="details-header">
              <h2>Details</h2>
              {product.brand?.image ? (
                <img src={product.brand.image} alt={product.brand.name} />
              ) : null}
            </div>
            <p className="product-brand">
              Brand: {product.brand?.name || "Unknown brand"}
            </p>
            <p className="product-description">{product.description}</p>
          </div>
        </div>
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
                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.id, -1)}>
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}>
                            +
                          </button>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
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
    </div>
  );
}

export default SingleProductPage;
