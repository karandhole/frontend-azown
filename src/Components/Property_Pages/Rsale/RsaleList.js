import React, { useContext, useEffect, useState } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import propertyContext from '../../../context/PropertyContext'
import Alert from '../../Alert'
import Footer from '../../Footer/Footer'
import Navbar from '../../Header/Navbar'
import Rsale from './Rsale'
import RsaleFilter from './RsaleFilter'
import Loader from '../../loader'

const RsaleList = () => {
  let history = useNavigate();
  const mylocation = useLocation();
  const context = useContext(propertyContext);
  const { host } = context;
  const [showLoader,setShowLoader] = useState(false)
  const [RsaleData, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // const getCurrentPageData = () => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   const paginatedData = RsaleData.slice(startIndex, endIndex);
  //   return {
  //     data: paginatedData,
  //     startIndex,
  //     endIndex
  //   };
  // };
  // const { data, startIndex, endIndex } = getCurrentPageData();
  
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };
  
  const handleAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };
  const [rr, setrr] = useState([])
  useEffect(() => {
    setShowLoader(true)
    async function listrrprop() {
      const responce = await fetch(`${host}/property/getrrs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "auth-token": localStorage.getItem("token"),
        },
      });
      const resdata = await responce.json();
      
      if(localStorage.getItem("userDetail")){
        const userId = JSON.parse(localStorage.getItem('userDetail')).user._id;
        const newData = resdata.filter((curEle)=>{
          return curEle.userid !== userId
        })
       
        setData(newData);
        setrr(newData)
        setShowLoader(false)
      }else{
      setData(resdata);
      setrr(resdata)
      setShowLoader(false)
      }
    }
    listrrprop()
  }, []);
  
  function handleFilter(value) {
    console.log(value);
    if (
      value.prop.length === 0 &&
      value.bhk.length === 0 &&
      value.park.length === 0 &&
      value.furnish.length === 0 &&
      value.floorType.length === 0 &&
       value.range === 1000
    ) {
      setData(rr);
    } else {
      console.log(value.range);

      const filterData = rr.filter((property) => {
        if(value.range === 1000)
        return (
          value.bhk.includes(property.rrs_detail_bhk_type) ||
          value.prop.includes(property.rrs_detail_app_type) ||
          value.furnish.includes(property.rrs_detail_furnishing) ||
          value.park.includes(property.rrs_detail_parking) ||
          value.floor.includes(property.rrs_detail_floor) ||
          value.floorType.includes(property.rrs_detail_floor_type)
        );
        else if(value.range !== 1000 && value.prop.length === 0 && value.bhk.length === 0 && value.park.length === 0 && value.furnish.length === 0 && value.floor.length === 0 && value.floorType.length === 0 ){
          return( parseInt(property.rrs_resale_detail_maintenance) < value.range)
        }
        else 
          return (
            (value.bhk.includes(property.rrs_detail_bhk_type) ||
            value.prop.includes(property.rrs_detail_app_type) ||
            value.furnish.includes(property.rrs_detail_furnishing) ||
            value.park.includes(property.rrs_detail_parking) ||
            value.floor.includes(property.rrs_detail_floor) ||
            value.floorType.includes(property.rrs_detail_floor_type)) &&
            (parseInt(property.rrs_resale_detail_maintenance) < value.range)
          )
        
      });
      setData(filterData);

      console.log(filterData);
    }
  }
  return (
    <div id="main-wrapper">
      <Navbar />
      {showAlert && <Alert msg="Please Login Before!!" />}
      {showLoader && <Loader />}
      <div className="clearfix" />

      <section className="gray pt-4">
        <div className="container">
          <div className="row m-0">
            <div className="short_wraping mb-2">
              <div className="row align-items-center">
                <div className="col-lg-3 col-md-6 col-sm-12  col-sm-6">
                  <ul className="shorting_grid">
                    {/* <li className="list-inline-item"><a  className="active"><span className="ti-layout-grid2" />Grid</a></li>
                <li className="list-inline-item"><a ><span className="ti-view-list" />List</a></li> */}
                    <li className="list-inline-item"><a ><span className="ti-map-lt" />Residential Resale</a></li>
                  </ul>
                </div>
                <div className="col-lg-9 col-md-12 col-sm-12 order-lg-2 order-md-3 elco_bor col-sm-12">
                  <div className="shorting_pagination">
                    <div className="shorting_pagination_laft">
                    {/* <h5>Showing {startIndex+1}-{endIndex > RsaleData.length ? RsaleData.length : endIndex} of {RsaleData.length} results</h5> */}
                    </div>
                    <div className="shorting_pagination_right">
                    {/* <ul style={{cursor:"pointer"}}>
                      {Array(Math.ceil(RsaleData.length / itemsPerPage)).fill().map((_, i) => (
                        <li key={i}>
                          <a className={currentPage === i + 1 ? 'active' : ''} onClick={() => handlePageChange(i + 1)}>
                            {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row">
            <RsaleFilter handleFilter={handleFilter} />
            <div className="col-lg-8 col-md-12 col-sm-12" style={{height:'60rem',overflowY:'auto', WebkitOverflowScrolling: 'touch', '-ms-overflow-style': 'none', scrollbarWidth: 'none'}}>{
            RsaleData.map((property) => {
              return (
                <Rsale property={property} key={property._id} onAlert={handleAlert} />
              )
            })
            }</div>
          </div> */}
          <div className="row">
      <RsaleFilter handleFilter={handleFilter} />
      <div
        className="col-lg-8 col-md-12 col-sm-12"
      >
        {
          RsaleData.map((property) => {
            return <Rsale property={property} key={property._id} onAlert={handleAlert} />;
          })
}
      </div>
    </div>
          <div className="row align-items-center">
                <div className="col-lg-3 col-md-6 col-sm-12  col-sm-6">
                  <ul className="shorting_grid">
                  </ul>
                </div>
                <div className="col-lg-9 col-md-12 col-sm-12 order-lg-2 order-md-3 elco_bor col-sm-12">
                  <div className="shorting_pagination">
                    <div className="shorting_pagination_laft">
                    </div>
                
                  </div>
                </div>
              </div>
        </div>
      </section>
      {/* ============================ All Property ================================== */}
      {/* ============================ Call To Action ================================== */}

      <Footer />
    </div>

  )
}

export default RsaleList