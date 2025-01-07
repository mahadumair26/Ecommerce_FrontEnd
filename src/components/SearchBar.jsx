import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ setSearchResults, categories, setSelectedCategory }) => {
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setCategory] = useState("");

  const handleSearchNameChange = (e) => {
    const value = e.target?.value;
    setSearchName(value);
    if (value === '') {
      setSearchResults(null); 
    }
  };

  const handleSearch = () => {
    if (searchName) {
      let url = `http://localhost:9091/product/get/search/${searchName}`;
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }

      axios
        .get(url)
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    } else {
      setSearchResults(null);
    }
  };

  return (
    <div className="search-header bg-light py-4 shadow-sm rounded-3">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-8 col-lg-6 mb-3 mb-md-0">
            <div className="input-group">
              <input
                type="text"
                className="form-control rounded-pill py-3"
                placeholder="Search for products"
                value={searchName}
                onChange={handleSearchNameChange}
                aria-label="Search by product name"
              />
            </div>
          </div>
          <div className="col-md-3 d-flex justify-content-end">
            <button
              className="btn btn-primary btn-lg rounded-pill px-4 py-2 w-100"
              onClick={handleSearch}
            >
              <i className="fa fa-search me-2"></i> Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
