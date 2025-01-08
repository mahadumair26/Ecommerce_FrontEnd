import React from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components";
import { useLocation } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state; 
  
  const ThankYou = () => {
    const fullName = orderDetails.userDTO
      ? `${orderDetails.userDTO.firstName} ${orderDetails.userDTO.lastName}`
      : "";
  
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.header}>Thank You {fullName} for Your Order!</h1>
          <p style={styles.message}>
            Your order has been placed successfully. You will receive a confirmation email shortly with your order details.
          </p>
          <p style={styles.orderInfo}>
            Order Number: <strong>#{orderDetails?.orderId}</strong>
          </p>
          <h5 style={styles.subHeader}>Order Details</h5>
  
          <div style={styles.productContainer}>
            {orderDetails.products.map((product, index) => (
              <div key={index} style={styles.productRow}>
                <img
                  src={
                    product?.productImages?.[0]?.image
                      ? `data:image/png;base64,${product.productImages[0].image}`
                      : "https://via.placeholder.com/50" // Fallback image
                  }
                  alt={product?.name || "Product"}
                  style={styles.productImage}
                />
                <div style={styles.productInfo}>
                  <span style={styles.productName}>{product?.name}</span>
                  <span style={styles.productDetail}>
                    <strong>Price:</strong> ${product?.price.toFixed(2)}
                  </span>
                  <span style={styles.productDetail}>
                    <strong>Quantity:</strong> {product?.quantity}
                  </span>
                  <span style={styles.productDetail}>
                    <strong>Total:</strong> ${product?.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
  
          <div style={styles.actions}>
            <button style={styles.secondaryButton} onClick={handleGoHome}>
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  };
  

  const handleGoHome = () => {
    navigate("/"); 
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="container my-3 py-3">
        <h1 className="text-center">Order Confirmed</h1>
        <hr />
        { <ThankYou />}
      </div>
      <Footer />
    </>
  );
};

// Inline Styles for simplicity
const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f8f9fa",
      padding: "20px",
    },
    card: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      maxWidth: "800px",
      width: "100%",
      textAlign: "center",
    },
    header: {
      fontSize: "24px",
      marginBottom: "20px",
      color: "#343a40",
    },
    subHeader: {
      fontSize: "20px",
      marginTop: "30px",
      marginBottom: "20px",
      color: "#495057",
    },
    message: {
      fontSize: "16px",
      color: "#6c757d",
      marginBottom: "20px",
    },
    orderInfo: {
      fontSize: "18px",
      color: "#495057",
      marginBottom: "30px",
    },
    productContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    productRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px",
      border: "1px solid #dee2e6",
      borderRadius: "8px",
      backgroundColor: "#f8f9fa",
    },
    productImage: {
      width: "50px",
      height: "50px",
      borderRadius: "8px",
      objectFit: "cover",
      marginRight: "15px",
    },
    productInfo: {
      flex: 1,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    productName: {
      fontWeight: "bold",
      flex: 2,
      textAlign: "left",
    },
    productDetail: {
      flex: 1,
      textAlign: "right",
    },
    actions: {
      marginTop: "30px",
    },
    secondaryButton: {
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "#6c757d",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      textDecoration: "none",
    },
  };
  

export default ThankYouPage;
