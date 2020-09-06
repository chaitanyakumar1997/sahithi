import React, { Component, Fragment } from 'react';
import Product from './Product';
import axios from "axios";
const config = require('../config.json');

export default class ProductAdmin extends Component {

  state = {
    newproduct: { 
      "id": "",
      "productname": "",
    },
    products: []
  }

  handleAddProduct = async (id, event) => {
    event.preventDefault();
    // add call to AWS API Gateway add product endpoint here
    try {
      const params = {
        "id": id,
        "productname": this.state.newproduct.productname
      };
      await axios.post(`${config.api.invokeUrl}/products/${id}`, params);
      this.setState({ products: [...this.state.products, this.state.newproduct] });
      this.setState({ newproduct: { "id": " ", "productname": " "}});
    }catch (err) {
      console.log(`An error has occurred: ${err}`);
    }
  }

  handleUpdateProduct = async (id, name) => {
    // add call to AWS API Gateway update product endpoint here
    try {
      const params = {
        "id": id,
        "productname": name
      };
      await axios.patch(`${config.api.invokeUrl}/products/${id}`, params);
      const productToUpdate = [...this.state.products].find(product => product.id === id);
      const updatedProducts = [...this.state.products].filter(product => product.id !== id);
      productToUpdate.productname = name;
      updatedProducts.push(productToUpdate);
      this.setState({products: updatedProducts});
    }catch (err) {
      console.log(`Error updating product: ${err}`);
    }
  }

  handleDeleteProduct = async (id, event) => {
    event.preventDefault();
    // add call to AWS API Gateway delete product endpoint here
    try {
      await axios.delete(`${config.api.invokeUrl}/products/${id}`);
      const updatedProducts = [...this.state.products].filter(product => product.id !== id);
      this.setState({products: updatedProducts});
    }catch (err) {
      console.log(`Unable to delete product: ${err}`);
    }
  }

  fetchProducts = async () => {
    // add call to AWS API Gateway to fetch products here
    // then set them in state
    try {
      const res = await axios.get(`${config.api.invokeUrl}/products`);
      const products = res.data;
      this.setState({ products: products });
    } catch (err) {
      console.log(`An error has occurred: ${err}`);
    }
  }

  onAddProductIdChange = event => this.setState({ newproduct: { ...this.state.newproduct, "id": event.target.value } });
  onAddProductNameChange = event => this.setState({ newproduct: { ...this.state.newproduct, "productname": event.target.value } });
  setUser = user => this.setState({user : user});
  componentDidMount = () => {
    this.fetchProducts();
  }

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h1>Product Admin</h1>
            <p className="subtitle is-15">Add and remove products using the form below:</p>
            <br />
            <div className="columns">
              <div className="column is-one-third">
                <form onSubmit={event => this.handleAddProduct(this.state.newproduct.id, event)}>
                  <div className="field has-addons">
                    <div className="control">
                      <input 
                        className="input is-medium"
                        type="text" 
                        placeholder="Enter name"
                        value={this.state.newproduct.productname}
                        onChange={this.onAddProductNameChange}
                      />
                    </div>
                    <div className="control">
                      <input 
                        className="input is-medium"
                        type="(index box ) "
                        placeholder=  "Enter about Title is-150 "
                        value={this.state.newproduct.id}
                        onChange={this.onAddProductIdChange}
                      />
                    </div>
                    <div className="control">
                      <button type="submit" className="button is-primary is-,is-medium">
                        submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="column is-two-frou">
                <div className="tile is-ancestor">
                  <div className="tile is-50 is-parent  is-vertical">
                    { 
                      this.state.products.map((product, index) => 
                        <Product 
                          isAdmin={true}                                                  
                          handleUpdateProduct={this.handleUpdateProduct}
                          handleDeleteProduct={this.handleDeleteProduct}
                          name={product.productname}   
                          id={product.id}
                          key={product.id}
                        />)  
                    } 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    )
  }
}
