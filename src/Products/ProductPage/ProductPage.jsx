import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import arrow from "../../assets/arrow.png";
import PriceFilter from "../../assets/adjustments-horizontal.png";
import "./ProductPage.css";
import left from "../../assets/left.png";
import right from "../../assets/right.png";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeSort, setActiveSort] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const sortRef = useRef(null);
  const priceRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const GetAllProducts = async () => {
      try {
        let allProducts = [];
        let page = 1;
        let totalPages = 1;

        do {
          const res = await fetch(
            `https://api.redseam.redberryinternship.ge/api/products?page=${page}`,
            { headers: { accept: "application/json" } },
          );
          const result = await res.json();

          allProducts = [...allProducts, ...result.data];
          totalPages = result.meta.last_page;
          page++;
        } while (page <= totalPages);

        setProducts(allProducts);
        setOriginalProducts(allProducts);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    GetAllProducts();
  }, []);

  // Sorting
  const handleSort = (criteria) => {
    let sortedProducts = [...originalProducts];
    if (criteria === "newest") {
      sortedProducts.sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date),
      );
    } else if (criteria === "PriceLowToHigh") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (criteria === "PriceHighToLow") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setProducts(sortedProducts);
    setCurrentPage(1);
    setActiveSort(criteria);
    setOpen(false);
  };

  // Price filter
  const handlePriceFilter = () => {
    const min = from ? Number(from) : 0;
    const max = to ? Number(to) : Infinity;

    const filtered = originalProducts.filter((product) => {
      const price = Number(product.price);
      return price >= min && price <= max;
    });

    setProducts(filtered);
    setPriceOpen(false);
    setActiveFilter({ from: min, to: max === Infinity ? null : max });
    setCurrentPage(1);
  };

  // Close dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (priceRef.current && !priceRef.current.contains(e.target)) {
        setPriceOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pagination slice
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const pages = (() => {
    if (totalPages <= 1) return [1];

    const res = [];
    const last = totalPages;

    res.push(1);
    if (last >= 2) res.push(2);
    if (currentPage > 4) res.push("...");
    if (currentPage - 1 > 2 && currentPage - 1 < last - 1) {
      res.push(currentPage - 1);
    }
    if (currentPage > 2 && currentPage < last - 1) {
      res.push(currentPage);
    }
    if (currentPage + 1 < last && currentPage + 1 > 2) {
      res.push(currentPage + 1);
    }
    if (currentPage < last - 3) res.push("...");
    if (last - 1 > 2) res.push(last - 1);
    if (last > 2) res.push(last);
    return res.filter((item, idx) => item !== res[idx - 1]);
  })();

  return (
    <div className="product-page-container">
      <div className="filter">
        <h1 className="title">Products</h1>
        <div className="filter-options">
          <p className="showing-pages">
            Showing {indexOfFirst + 1}–{Math.min(indexOfLast, products.length)}{" "}
            of {products.length} results
          </p>
          <span className="hor-line"></span>
          <div className="price-filter" ref={priceRef}>
            <img
              src={PriceFilter}
              alt="Price filter logo"
              onClick={() => setPriceOpen((p) => !p)}
            />
            <p onClick={() => setPriceOpen((p) => !p)}>Filter</p>
            {priceOpen && (
              <div className="price-filter-popup">
                <p className="price-title">Select price</p>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="From *"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="To *"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
                <button className="apply-btn" onClick={handlePriceFilter}>
                  Apply
                </button>
              </div>
            )}
          </div>
          <div className="sort-dropdown" ref={sortRef}>
            <button className="sort-btn" onClick={() => setOpen((p) => !p)}>
              Sort by
              <img src={arrow} alt="arrow" />
            </button>
            {open && (
              <div className="sort-menu">
                <p className="sort-title">Sort by</p>
                <p className="sort-para" onClick={() => handleSort("newest")}>
                  New products first
                </p>
                <p
                  className="sort-para"
                  onClick={() => handleSort("PriceLowToHigh")}
                >
                  Price, low to high
                </p>
                <p
                  className="sort-para"
                  onClick={() => handleSort("PriceHighToLow")}
                >
                  Price, high to low
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="active-container">
        {activeFilter && (
          <div className="active-content">
            <div className="active-tag">
              Price: {activeFilter.from}–{activeFilter.to || "∞"}
              <span
                className="close-btn"
                onClick={() => {
                  setActiveFilter(null);
                  setFrom("");
                  setTo("");
                  setProducts(originalProducts);
                  setCurrentPage(1);
                }}
              >
                ×
              </span>
            </div>
          </div>
        )}

        {activeSort && (
          <div className="active-content">
            <div className="active-tag">
              Sort: {activeSort.replace(/([A-Z])/g, " $1").trim()}
              <span
                className="close-btn"
                onClick={() => {
                  setActiveSort(null);
                  setProducts(originalProducts);
                  setCurrentPage(1);
                }}
              >
                ×
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="product-list">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/ProductPage/${product.id}`)}
          >
            <img
              src={product.cover_image}
              alt={product.name}
              className="product-image"
            />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">${product.price}</p>
          </div>
        ))}
      </div>

      <div className="pagination-container">
        <img
          src={left}
          alt="left arrow"
          className="page-arrow"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        />

        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} className="dots">
              ...
            </span>
          ) : (
            <button
              key={`page-${p}`}
              className={`page-btn ${p === currentPage ? "active" : ""}`}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ),
        )}

        <img
          src={right}
          alt="right arrow"
          className="page-arrow"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() =>
            setCurrentPage((p) => Math.min(totalPages || 1, p + 1))
          }
        />
      </div>
    </div>
  );
}

export default ProductPage;
