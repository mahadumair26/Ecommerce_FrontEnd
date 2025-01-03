import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    price: 0,
    description: '',
    weight: 0,
    dimension: 0,
    quantity: 0,
    status: 'active',
    category_id: '', // Removed static user_id
  });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null); // State to handle image file

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:9091/category/get");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected file in state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve user_id from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    const user_id = userData ? userData.id : null;

    if (!user_id) {
      alert("User not authenticated. Please log in.");
      return;
    }

    // Add user_id to product data before sending the request
    const dataToSend = {
      ...productData,
      user_id, // Dynamically add user_id from localStorage
      category_id: parseInt(productData.category_id, 10), // Ensure category_id is an integer
    };

    try {
      console.log("Sending data to backend:", dataToSend);

      // Step 1: Send product data to the backend
      const productResponse = await axios.post("http://localhost:9091/product/add", dataToSend, {
        headers: {
          "Content-Type": "application/json", // Ensure the header is set for JSON
        },
      });
      console.log(productResponse.data.id);
      
      const product_id = productResponse.data.id; // Extract the product_id from the response

      // Step 2: Create FormData and append the product_id and image
      if (image) {
        const formData = new FormData();
        console.log(product_id);
        console.log(image);
        formData.append("product_id", product_id);
        formData.append("image", image);

        // Step 3: Send FormData to the backend for the image
        await axios.post("http://localhost:9091/product-image/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set header for FormData
          },
        });

        alert("Product and Image Added Successfully");
        navigate("/my-product");
      } else {
        alert("Product added, but no image was uploaded");
      }

      // Reset the form after successful submission
      setProductData({
        name: '',
        price: '',
        description: '',
        weight: '',
        dimension: '',
        quantity: '',
        status: 'available',
        category_id: '', // Reset category_id
      });
      setImage(null); // Clear the image
    } catch (error) {
      alert("Error adding product or uploading image");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Product</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                placeholder="Enter product price"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="3"
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="weight" className="form-label">Weight</label>
              <input
                type="text"
                className="form-control"
                id="weight"
                name="weight"
                value={productData.weight}
                onChange={handleInputChange}
                placeholder="Enter product weight"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dimension" className="form-label">Dimension</label>
              <input
                type="text"
                className="form-control"
                id="dimension"
                name="dimension"
                value={productData.dimension}
                onChange={handleInputChange}
                placeholder="Enter product dimensions"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category_id" className="form-label">Category</label>
              <select
                className="form-select"
                id="category_id"
                name="category_id"
                value={productData.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                name="quantity"
                value={productData.quantity}
                onChange={handleInputChange}
                placeholder="Enter product quantity"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={productData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Product Image</label>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                onChange={handleImageChange}
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary px-5">
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
