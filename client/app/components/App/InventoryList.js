import React, { Component } from 'react';
import 'whatwg-fetch';
import { withRouter, Link } from 'react-router-dom';

import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';

class InventoryList extends Component {
  constructor(props) {
    super(props);


    this.state = {
      isLoading: true,
      rows: [{ productName: "test", numberOfItems: 4}],
      productNameValue: '',
      noOfItemsValue: '',
      showConfirmation: false,
      readonly: true,
      showSaveOption: false,
      rowEditable: null,
      editedProdName: '',
      editedNoItems: 0
    };

  }

 
  componentWillMount()
  {
    fetch('http://localhost:8080/api/inventory/products')
    .then(res => res.json())
    .then(json => {
      if (json) {

        //console.log(json.data);
        this.setState({
          isLoading: false,
          rows: json.data,
        });
      } else {
        console.log("request failed");
        this.setState({
          isLoading: false,
        });
      }
    });
  }

  handleChange = idx => e => {
    const { name, value } = e.target;
    //console.log(name);
    //console.log(value);


    if(name == 'productName') {
      this.setState({
        editedProdName: value
      })
    }
    
    if(name == 'numberOfItems') {
      this.setState({
        editedNoItems: value
      })
      
    }

    const rows = [...this.state.rows];

    const rowValues = rows[idx];
    
    let newState = Object.assign({}, this.state);
    
    console.log("row values", rowValues);

    if(name == 'productName') {
      newState.rows[idx] = {
        [name]: value,
        numberOfItems: rowValues.numberOfItems,
        _id: rowValues._id
      };
    }

    if(name == 'numberOfItems') {
      newState.rows[idx] = {
        productName: rowValues.productName,
        [name]: value,
        _id: rowValues._id
      };
    }

    console.log("before setstate",rows);
    this.setState(newState);
    console.log(this.state.rows);
  };

  handleAddRow = ()  => {
    const item = {
      productName: "",
      numberOfItems: ""
    };
    console.log(this.state.rows.length);
    this.setState({
      rows: [...this.state.rows, item],
      rowEditable: this.state.rows.length
    });
   
  };
  handleRemoveRow = () => {

    this.setState({
      rows: this.state.rows.slice(0, -1),
      readonly: true,
      showSaveOption: false
    });
    this.closeConfirmation();
  };

  closeConfirmation = () => {
    this.setState({
      showConfirmation: false
    });
  }

  showConfirmation = () => {
    this.setState({
      showConfirmation: true
    });
  }

  onEdit = () => e =>  {
      const rowid = e.target.getAttribute('rowid');
      console.log('We need to get the details for ', rowid);
      this.setState({
        rowEditable: rowid
      });
  }

  onSave = () => e => {

    const recid = e.target.getAttribute('record');
     console.log(e.target);
    if(recid){

      
      fetch('http://127.0.0.1:8080/inventory/products/'+recid, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productName: e.target.getAttribute('productName'),
          numberOfItems: Number(e.target.getAttribute('numberOfItems')),
        }),
      }).then(res => res.json())
        .then(json => {
          console.log(json);
          window.location.reload();
        });
    }
    else {

        const rowid = e.target.getAttribute('rowid');
        console.log('add product', e.target);

        fetch('http://127.0.0.1:8080/api/inventory/addproduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productName: e.target.getAttribute('productName'),
            numberOfItems: Number(e.target.getAttribute('numberOfItems')),
          }),
        }).then(res => res.json())
          .then(json => {
            console.log(json);
            window.location.reload();
          });
    }
  }

  deleteProduct = () => e => {


    const recid = e.target.getAttribute('record');
    fetch('http://127.0.0.1:8080/inventory/products/'+recid, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productName: e.target.getAttribute('productName'),
          numberOfItems: Number(e.target.getAttribute('numberOfItems')),
        }),
      }).then(res => res.json())
        .then(json => {
          console.log(json);
          window.location.reload();
        });

  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row clearfix">
            <div className="col-md-12 column">
              <table
                className="table table-bordered table-hover"
                id="tab_logic"
              >
                <thead>
                  <tr>
                    <th className="text-center"> # </th>
                    <th className="text-center"> Products </th>
                    <th className="text-center"> No of Items </th>
                    <th className="text-center"> Actions </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td>{idx+1}</td>
                      <td>
                        <input
                          type="text"
                          name="productName"
                          value={this.state.rows[idx].productName}
                          onChange={this.handleChange(idx)}
                          className="form-control"
                          readOnly={(this.state.rowEditable == idx) || !this.state.readonly ? false : true }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="numberOfItems"
                          value={this.state.rows[idx].numberOfItems}
                          onChange={this.handleChange(idx)}
                          className="form-control"
                          readOnly={(this.state.rowEditable == idx) || !this.state.readonly ? false : true}
                        />
                      </td>
                      <td>
                      <button onClick={this.onEdit(idx)} rowid = {idx} prodid={this.state.rows[idx]._id}className="btn btn-primary">
                        Edit
                      </button>
                        {
                          this.state.showSaveOption || (this.state.rowEditable == idx)? (
                          <button onClick={this.onSave(idx)} 
                          rowid = {idx} 
                          record={this.state.rows[idx]._id} 
                          productName={this.state.rows[idx].productName}
                          numberOfItems={this.state.rows[idx].numberOfItems}
                          className="btn btn-success">Save</button>
                        ) : null
                        }
                        
                        <button onClick={this.deleteProduct(idx)} 
                        rowid = {idx} 
                        record={this.state.rows[idx]._id} 
                        className="btn btn-danger">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={this.handleAddRow} className="btn btn-primary">
                Add Row
              </button>
              
              
              <button
                onClick={this.handleRemoveRow}
                className="btn btn-danger float-right"
              >
                Delete Row
              </button>
              
              
            </div>
          </div>
          {this.state.showConfirmation ? (
                <div className="row justify-content-center">
                <div className="col-md-4 column">
                <div>Are you Sure?</div>
                <button onClick={this.deleteProduct} className="btn btn-success float-right">Yes</button>
                <button onClick={this.closeConfirmation} className="btn btn-danger float-right">No</button>
                </div>
                </div>
              ):null}
        </div>
      </div>
    );
  }
}

export default withRouter(InventoryList);