import React, { useState, useEffect ,useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";  // Import axios
import { useLocation } from "react-router-dom";

const Products = ({ products }) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const componentMounted = useRef(true);
 
  const location = useLocation();
  const path = location.pathname; 

  let heading = "Latest Products"; 
  if (path === "/product") {
    heading = "Products";
  }

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };


  useEffect(() => {
    if (products && products.length > 0) {
      setData(products);
      setFilter(products);
    } else {
      getProducts(); 
    }

    return () => {
      componentMounted.current = false;
    };
  }, [products]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:9091/product/get");
        setData(response.data);
        setFilter(response.data);
        setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
          >
            <Skeleton height={592} />
          </div>
        ))}
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

 
const ShowProducts = () => {
  const [currentPage, setCurrentPage] = useState(1); 
  const [productsPerPage] = useState(6); 
  const [filter, setFilter] = useState(data); 

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filter.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="buttons text-center py-5">
        <button
          className="btn btn-outline-dark btn-sm m-2"
          onClick={() => setFilter(data)}
        >
          All
        </button>
        <button
          className="btn btn-outline-dark btn-sm m-2"
          onClick={() => filterProduct("men's clothing")}
        >
          Men's Clothing
        </button>
        <button
          className="btn btn-outline-dark btn-sm m-2"
          onClick={() => filterProduct("women's clothing")}
        >
          Women's Clothing
        </button>
        <button
          className="btn btn-outline-dark btn-sm m-2"
          onClick={() => filterProduct("jewelery")}
        >
          Jewelery
        </button>
        <button
          className="btn btn-outline-dark btn-sm m-2"
          onClick={() => filterProduct("electronics")}
        >
          Electronics
        </button>
      </div>

      <div className="row">
        {currentProducts.map((product) => {
          // Use the first image from the productImages array if available, otherwise use a placeholder
          const productImage =
            product.productImages && product.productImages.length > 0
              ? `data:image/png;base64,${product.productImages[0].image}`
              : "https://via.placeholder.com/300";

          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div className="card text-center h-100">
                <img
                  className="card-img-top p-3"
                  src={productImage}
                  alt={product.name || "Product"}
                  height={300}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {product.name ? product.name.substring(0, 12) : "No Title"}...
                  </h5>
                  <p className="card-text">
                    {product.description
                      ? product.description.substring(0, 90)
                      : "No Description"}...
                  </p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">${product.price}</li>
                </ul>
                <div className="card-body">
                  <Link
                    to={`/product/${product.id}`}
                    className="btn btn-dark m-1"
                  >
                    Buy Now
                  </Link>
                  <button
                    className="btn btn-dark m-1"
                    onClick={() => {
                      toast.success("Added to cart");
                      addProduct(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination d-flex justify-content-center my-4">
        <button
          className="btn btn-outline-dark btn-sm mx-2"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-outline-dark btn-sm mx-2"
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastProduct >= filter.length}
        >
          Next
        </button>
      </div>
    </>
  );
};

  return (
    <div className="container my-3 py-3">
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center">{heading}</h2>
          <hr />
        </div>
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

export default Products;
