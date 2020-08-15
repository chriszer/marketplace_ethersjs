import React, { Component } from 'react';
import {ethers} from 'ethers'
import './App.css';
import Marketplace from '../abis/Marketplace.json';
import Navbar from './Navbar';
import Main from './Main';

class App extends Component {
  
  async componentWillMount(){
    await this.loadBlockchainData()
  }
  
  
  async loadBlockchainData() {
    // const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545")
    const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
 
   //Load account
   const accounts = await provider.listAccounts()       //web3.eth.getAccounts()
   this.setState({ account: accounts[0] })

  //  const networkId = await web3.eth.net.getId()
   const networkData = await (await provider.getNetwork()).chainId
   console.log(networkData)

   if(networkData){
    
    //declare and fetch the signer
    let signer = provider.getSigner(0)

    //declare and fetch the deployed contract address
    let address = Marketplace.networks[networkData].address

    //declare and fetch the abi
    let abi = Marketplace.abi
    
    //because we include a signer we have now Read and Write Access to the Contract
    const marketplace = new ethers.Contract(address,abi,signer)
    
    //set the marketplace state 
    //if the name of the variable and the state are the same this would also work
    this.setState({ marketplace })

    //in web3:
    //const productCount = await marketplace.methods.productCount().call()
    // while on ethersjs this is the equivalent, noticed that its shorter and better.
    const productCount = await marketplace.productCount()

    //set the state of productCount
    this.setState({ productCount })

    //Load products
    for(var i = 1; i <= productCount; i++){
      const product = await marketplace.products(i)
      this.setState({
         products: [...this.state.products,product]
      })
    } 

    this.setState({ loading: false })

   } else {
     window.alert('Market contract not deployed to detected network.')
   }


  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }

    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)

  }

  createProduct(name, price) {

    this.setState({ loading: true})

    this.state.marketplace.createProduct(name, price)
    .then('receipt',(tx)=>{
      this.setState({loading: false})
    })
  }

  
  purchaseProduct(id, price) {

    this.setState({ loading: true})

    this.state.marketplace.purchaseProduct(id,{value: price })
    .then('receipt',(tx) => {
      this.setState({loading: false})
      console.log(tx)
    })
  }

  


  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
         <div className="container-fluid mt-5">
           <div className="row">
             <main role="main" className="col-lg-12 d-flex">
               {this.state.loading 
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
                : <Main 
                products={this.state.products}
                createProduct={this.createProduct}
                purchaseProduct={this.purchaseProduct}
                /> 
       

               } 
             </main>
           </div>
         </div>
      </div>
    );
  }
}

export default App;
