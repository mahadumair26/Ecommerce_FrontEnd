import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Footer, Navbar, Product, SearchBar } from "../components";

const Products = () => {
  const [categories, setCategories] = useState([]); // State to store category options
  const [searchResults, setSearchResults] = useState([]); // State to store search results
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

  // Fetch categories when component mounts
  useEffect(() => {
    axios.get('http://localhost:9091/category/get')
      .then(response => {
        setCategories(response.data || []); // Ensure it falls back to an empty array
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);


  return (
    <>
      <SearchBar
        setSearchResults={setSearchResults}
        categories={categories}
        setSelectedCategory={setSelectedCategory}
      />
      <Product products={searchResults} />
      <Footer />
    </>
  );
};

export default Products;
