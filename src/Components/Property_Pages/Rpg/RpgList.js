import React, { useContext, useEffect, useState } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
import propertyContext from '../../../context/PropertyContext'
import Alert from '../../Alert'
import Footer from '../../Footer/Footer'
import Navbar from '../../Header/Navbar'
import Rpg from './Rpg'
import RpgFilter from './RpgFilter'
import Loader from '../../loader'

const RpgList = () => {
  let history = useNavigate();
  const mylocation = useLocation()
  const context = useContext(propertyContext);
  const { host } = context;
  const [showLoader,setShowLoader] = useState(false)
  const [RpgData, setData] = useState([]);
  const [rpg, setrpg] = useState([])
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // const getCurrentPageData = () => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   const paginatedData = RpgData.slice(startIndex, endIndex);
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
  useEffect(() => {
    setShowLoader(true)
    async function listrrsprop() {
      const responce = await fetch(`${host}/property/getrpg`, {
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
        setrpg(newData)
        setShowLoader(false)
      }else{
        setData(resdata);
        setrpg(resdata)
        setShowLoader(false)
      }
    }
    listrrsprop()
  }, []);

  function handleFilter(value) {
    console.log(value);
    if (
      value.sex.length === 0 &&
      value.room.length === 0 &&
      value.guestType.length === 0 &&
      value.park.length === 0 &&
      value.price === 2500
    ) {
      setData(rpg);
    } else {
            const filterData = rpg.filter((property) => {
        if(value.price === 2500){
        console.log("Price isn't Change");
        return (
          value.sex.includes(property.rpg_detail_availablefor) ||
          value.room.includes(property.rpg_detail_room_occupany) ||
          value.guestType.includes(property.rpg_detail_pref_guest) ||
          value.park.includes(property.rpg_detail_parking) 
        );}
        else if(value.price !== 2500 && value.room.length === 0 && value.sex.length === 0 && value.guestType.length === 0 && value.park.length === 0){
         {console.log("Only Price Change")
           return( parseInt(property.rpg_detail_room_rent) < value.price)}
        }
        else{
          console.log('Price and Other Change') 
          return (
            (value.sex.includes(property.rpg_detail_availablefor) ||
            value.room.includes(property.rpg_detail_room_occupany) ||
            value.guestType.includes(property.rpg_detail_pref_guest) ||
            value.park.includes(property.rpg_detail_parking) ) &&
            (parseInt(property.rpg_detail_room_rent) < value.price)
          )}
        
      });
      setData(filterData);

      console.log(filterData);
    }
  }

  return (
    <div id="main-wrapper">
    {showAlert && <Alert msg="Please Login Before!!"/> }
    {showLoader && <Loader/>}
      <Navbar />
      {/* End Navigation */}
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
                    <li className="list-inline-item"><a><span className="ti-map-lt" />Residential PG </a></li>
                  </ul>
                </div>
                <div className="col-lg-9 col-md-12 col-sm-12 order-lg-2 order-md-3 elco_bor col-sm-12">
                  <div className="shorting_pagination">
                    <div className="shorting_pagination_laft">
                    {/* <h5>Showing {startIndex+1}-{endIndex > RpgData.length ? RpgData.length : endIndex} of {RpgData.length} results</h5> */}
                    </div>
                    <div className="shorting_pagination_right">
                    {/* <ul style={{cursor:"pointer"}}>
                      {Array(Math.ceil(RpgData.length / itemsPerPage)).fill().map((_, i) => (
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
            <RpgFilter handleFilter={handleFilter}/>
            <div className="col-lg-8 col-md-12 col-sm-12" style={{height:'60rem',overflowY:'auto', WebkitOverflowScrolling: 'touch', '-ms-overflow-style': 'none', scrollbarWidth: 'none'}}>{
            RpgData.map((property) => {
              return (
                <Rpg property={property} key={property._id} onAlert={handleAlert} />
              )
            })
            }</div>


          </div> */}
          <div className="row">
      <RpgFilter handleFilter={handleFilter} />
      <div
        className="col-lg-8 col-md-12 col-sm-12"
   >
        {
          RpgData.map((property) => {
            return <Rpg property={property} key={property._id} onAlert={handleAlert} />;
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
                    <div className="shorting_pagination_right">
                    {/* <ul style={{cursor:"pointer"}}>
                      {Array(Math.ceil(RpgData.length / itemsPerPage)).fill().map((_, i) => (
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
      </section>
      <Footer />
    </div>

  )
}

export default RpgList