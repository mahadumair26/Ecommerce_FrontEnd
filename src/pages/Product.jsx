import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import { Footer } from "../components";


const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [formData, setFormData] = useState({}); // Store form data
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData ? userData.id : null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:9091/product/get/${id}`);
        setProduct(response.data);
console.log(product);

        setFormData(response.data); // Initialize form with product data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        alert("Failed to load product details.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:9091/product/delete/${id}`);
        alert("Product deleted successfully.");
        // Redirect user after deletion
        window.location.href = "/my-product";
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      console.log("Updated product data:", formData);
      alert("Changes saved! Sending data to the backend...");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes.");
    }
  };

  const Loading = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 py-3">
          <Skeleton height={400} width={400} />
        </div>
        <div className="col-md-6 py-5">
          <Skeleton height={30} width={250} />
          <Skeleton height={90} />
          <Skeleton height={40} width={70} />
          <Skeleton height={50} width={110} />
          <Skeleton height={120} />
          <Skeleton height={40} width={110} inline={true} />
        </div>
      </div>
    </div>
  );

  const ShowProduct = () => (
    <div className="container my-5 py-2">
      {isEditing ? (
        <div className="row">
          <div className="col-md-12 col-sm-12 py-5">
            <form>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={handleSave}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleEditToggle}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6 col-sm-12 py-3">
            <img
              className="img-fluid"
              src={
                product?.productImages &&
                product?.productImages.length > 0 &&
                product.productImages[0].image
                  ? `data:image/png;base64,${product.productImages[0].image}`
                  : "https://via.placeholder.com/400"
              }
              alt={product?.name || "Product"}
              width="400px"
              height="400px"
            />
          </div>
          <div className="col-md-6 col-sm-12 py-5">
            <h4 className="text-uppercase text-muted">
              Category ID: {product.category_id}
            </h4>
            <h1 className="display-5">{product.name}</h1>
            <h3 className="display-6 my-4">${product.price}</h3>
            <p className="lead">{product.description}</p>
            <p>
              <strong>Weight:</strong> {product.weight}g
            </p>
            <p>
              <strong>Dimension:</strong> {product.dimension}mm
            </p>
            <p>
              <strong>Quantity:</strong> {product.quantity}
            </p>

            {product.user_id === userId && (
              <div className="mt-4">
                {product?.showDeleteProductButton && (
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Delete Product
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <searchbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
