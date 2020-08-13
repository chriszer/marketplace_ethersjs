import React, { Component } from 'react';
import {ethers} from 'ethers'

class Main extends Component {

  render() {


    return (
        <div id="content">
            <h1>Add Product</h1>
                <form onSubmit = {(event)=>{
                   
                    event.preventDefault()
                    const name  = this.productName.value
                    // insert ether amount
                    const price = ethers.utils.parseEther(this.productPrice.value).toString(10);
                   
                    this.props.createProduct(name , price)
                }}>
                    <div className="form-group mr-sm-2">
                        <input
                        id="productName"
                        type="text"
                        ref={(input) => {this.productName = input}}
                        className="form-control"
                        placeholder="Product Name"
                        required/>       
                    </div>

                    <div className="form-group mr-sm-2">
                        <input
                        id="productPrice"
                        type="text"
                        ref={(input) => {this.productPrice = input}}
                        className="form-control"
                        placeholder="Product Price"
                        required/>       
                    </div>


                    <button type="submit" className="btn btn-primary">Add Product</button>
                </form>
                    <p>&nbsp;</p>
                    <h2>Buy Product</h2>
            <table className = "table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Owner</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                <tbody id="productList">
                    {this.props.products.map((product,key) => {
                       return(
                        <tr key={key}>
                            <th scope="row">{product.id.toString()}</th>
                            <td>{product.name}</td>
                            {/* <td>{window.web3.utils.fromWei(product.price.toString(),'Ether')} Eth</td> */}
                            <td>{ethers.utils.formatEther(String(product.price))} Eth</td>
                            
                            <td>{product.owner}</td>
                            <td>
                             { !product.purchased
                               ? 
                                 <button
                                 name={product.id}
                                 value={product.price}
                                 
                                 onClick={async (event) => {
                                    
                                    let the_price = ethers.utils.formatEther(event.target.value)
    
                                    let parsed_price = ethers.utils.parseEther(the_price.toString())
           
                                    this.props.purchaseProduct(event.target.name, parsed_price)
                                   
                                 }} 
                                 >
                                     Buy
                                </button>
                                : null
                                }
                            </td>
                        </tr>
                       )
                    })}

                </tbody>
            </table>
        </div>
    );
  }
}

export default Main;
