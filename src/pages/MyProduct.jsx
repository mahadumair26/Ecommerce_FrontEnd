    import React, { useEffect, useState } from "react";
    import { Link } from "react-router-dom";
    import Skeleton from "react-loading-skeleton";
    import { Navbar, Footer } from "../components";
    import axios from "axios"; // Import axios

    const MyProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Retrieve user data from localStorage and extract user_id
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData ? userData.id : null; // Use user_id from localStorage if available

    useEffect(() => {
      const fetchProducts = async () => {
          if (userId) {  // Check if userId is available
              try {
                  // Fetch products for the user by userId
                  const response = await axios.get(`http://localhost:9091/product/get/user/${userId}`);
                  setProducts(response.data); // Set products data in the state
                  console.log(response.data); // Log the fetched products
                  setLoading(false); // Stop loading
              } catch (error) {
                  console.error("Error fetching products:", error);
                  alert("Failed to load products");
              }
          } else {
              alert("User not authenticated. Please log in.");
          }
      };
  
      fetchProducts(); // Call the fetch function to get products
  }, [userId]); // Run this effect when userId changes
  
    const Loading = () => (
        <div className="container my-5">
        <div className="row">
            {Array(4)
            .fill()
            .map((_, index) => (
                <div key={index} className="col-md-3 col-sm-6">
                <Skeleton height={300} />
                </div>
            ))}
        </div>
        </div>
    );

    const ShowProducts = () => (
        <div className="container my-5">
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-md-3 col-sm-6 mb-4">
                <div className="card h-100 text-center">
                  <img
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.name}
                    className="card-img-top p-3"
                    height="200"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">${product.price}</p>
                    <Link to={`/product/${product.id}`} className="btn btn-dark">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      

    return (
        <>
        <Navbar />
        <div className="container my-5">
            <h1 className="text-center mb-4">My Products</h1>
            {loading ? <Loading /> : <ShowProducts />}
        </div>
        <Footer />
        </>
    );
    };

    export default MyProduct;
