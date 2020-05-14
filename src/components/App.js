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
   const networkData = Marketplace.networks['5777']

   if(networkData){
    // const marketplace = web3.eth.Contract(Marketplace.abi,Marketplace.networks[networkId].address)
    let signer = provider.getSigner(0)
    let address = Marketplace.networks['5777'].address
    let abi = Marketplace.abi
    
    const marketplace = new ethers.Contract(address,abi,signer)
    this.setState({ marketplace })

    const productCount = await marketplace.productCount()

    this.setState({ productCount })
    //Load products
    for(var i = 1; i <= productCount; i++){
      const product = await marketplace.products(i)
      this.setState({
         products: [...this.state.products,product]
      })
    }
    
    this.setState({ loading: false })
    console.log(this.state.products)
    console.log(this.state.account)
    var a = 1
    let wei = ethers.utils.parseEther(a.toString()).toString();
     console.log(typeof wei);
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
                account = {this.state.account} /> 
       

               } 
             </main>
           </div>
         </div>
      </div>
    );
  }
}

export default App;
