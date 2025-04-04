import React, { useContext, useEffect, useState } from 'react'
import { leadContext } from '../../../context/LeadContext';
import propertyContext from '../../../context/PropertyContext';
import LeadProfile from './LeadProfile';
import img from '../../images/p-1.png'
import { Link } from 'react-router-dom';
import Layout from '../Layout';
import Loader from '../../loader';

const ListCmr = () => {
  const context = useContext(propertyContext);
  const { dash, host } = context;
  const leadcontext = useContext(leadContext)
  const { ownerlead, ownerleaddata } = leadcontext
  const [model, setmodel] = useState(false);
  const [showLoader,setShowLoader] = useState(false)
 
  const [cmr, setcmr] = useState([])
  
 


  useEffect(() => {
    setShowLoader(true)
    async function MyCmr() {
      const responce = await fetch(`${host}/property/getcmr`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
      });
      const data = await responce.json();
      setcmr(data)
      setShowLoader(false)
    };  
    MyCmr()
    
   

  }, [])
  return (
    <Layout>
       {showLoader && <Loader/>}
    <div className="col-lg-12 col-md-12 col-sm-12">
 <div className="dashboard-body mb-3">
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="dashboard_property">
              <div className="table-responsive">
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Commercial Rent</th>
                      <th scope="col" className="m2_hide">Leads</th>
                      <th scope="col" className="m2_hide">Likes</th>
                      <th scope="col" className="m2_hide">Posted On</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cmr && cmr.map(item => {
                      return <>
                        <tr>
                          <td>
                            <div className="dash_prt_wrap">
                              <div className="dash_prt_thumb">
                              <img src={item.images && item.images.length===0 ?img:item.images[0]} className="img-fluid" alt="jfh" />
                              </div>
                              <div className="dash_prt_caption">
                                <Link to={`/cmr-detail/${item._id}`} style={{fontWeight:'bold'}}>{`${item.cr_detail_title && item.cr_detail_title.slice(0,40)}...`}</Link>
                                <div className="prt_dashb_lot">{`${item.cr_location_city && item.cr_location_city.slice(0,60)}....`}</div>
                                <div className="prt_dash_rate"><span>Rs.{item.cr_rental_detail_exp_deposit}</span></div>
                              </div>
                            </div>
                          </td>
                          {console.log(item)}
                          <td className="m2_hide">
                            <div className="prt_leads"><button onClick={() => { setmodel(true); ownerlead(item.userid,item._id,2) }} className='btn btn-success p-2'>{item.lead && item.lead.length} till now</button></div>
                            <div className="prt_leads_list">
                              <ul>

                              </ul>
                            </div>
                          </td>
                          <td className="m2_hide">
                            <div className="_leads_view"><h5 className="up">{item.like && item.like.length}</h5></div>
                            <div className="_leads_view_title"><span>Likes</span></div>
                          </td>
                          <td className="m2_hide">
                            <div className="_leads_posted"><h5>{item.date && item.date.slice(0, 10)}</h5></div>
                            <div className="_leads_view_title"><span>On Date</span></div>
                          </td>
                          <td>
                            <div className="_leads_status"><span className="active">Active</span></div>
                            {/* <div className="_leads_view_title"><span>Till 12 Oct</span></div> */}
                          </td>
                          <td>
                            <div className="_leads_action">
                            <Link to={`/edit-cmr/${item._id}`}><i className="fas fa-edit" /></Link>
                            {/* <a  onClick={()=>{deleteCmr(item._id)}}><i className="fas fa-trash" /></a> */}
                            </div>
                          </td>
                        </tr>
                      </>
                    })}



                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* row */}
      </div>

    
      
      <div className={model ? "modal fade show" : "modal fade"} tabIndex={-1} role="dialog" aria-labelledby="authomessage" style={{ display: model ? 'block' : 'none' }} >
  <div className="modal-dialog modal-dialog-centered login-pop-form" role="document">
    <div className="modal-content" id="authomessage">
      <span className="mod-close" data-dismiss="modal" onClick={() => { setmodel(false) }} aria-hidden="true"><i className="ti-close" /></span>
      <div className="modal-body" >
        <h4 className="modal-header-title">Total Leads</h4>
        <hr />
        <div className="login-form" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {ownerleaddata && ownerleaddata.map((lead) => {
            return (
              <div key={lead._id}>
                <LeadProfile lead={lead} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
</div>


    </div>
    </Layout>
  )
}

export default ListCmr