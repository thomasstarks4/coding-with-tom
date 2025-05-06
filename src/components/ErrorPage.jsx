import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Oops! Something went wrong.</h1>
      <p style={styles.message}>
        We couldn't find the page you're looking for.
      </p>
      <button style={styles.button}>
        <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
          Go Home
        </Link>
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "2rem",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
  },
  message: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "1.5rem",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ErrorPage;
