import withRouter from "../../common/with-router";
import { logout } from "../../services/auth.service";

import "./navbarTop.css"
import "../../static/buttons.css"
import { useEffect, useState } from "react";
import { getHeaderModuleDetailList, getHeaderModuleList } from "../../services/admin.serive";

const Navbar = (props) => {

  const [headerModuleList, setHeaderModuleList] = useState([]);
  const [headerModuleDetailList, setHeaderModuleDetailList] = useState([]);

  useEffect(() => {
    try {
      console.log('----nav--header----')
      const imsFormRoleId = 2;
      fetchHeaderModuleList(imsFormRoleId);
      fetchHeaderModuleDetailList(imsFormRoleId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    logout('L');
    props.router.navigate("/login");
  };

  const fetchHeaderModuleList = async (imsFormRoleId) => {
    try {
      const moduleListResponse = await getHeaderModuleList(imsFormRoleId);
      console.log('moduleListResponse--', moduleListResponse)
      setHeaderModuleList(moduleListResponse);
    } catch (error) {
      console.error('Error fetching Header Module list:', error);
    }
  };

  const fetchHeaderModuleDetailList = async (imsFormRoleId) => {
    try {
      const moduleDetailListResponse = await getHeaderModuleDetailList(imsFormRoleId);
      console.log('moduleDetailListResponse--', moduleDetailListResponse)
      setHeaderModuleDetailList(moduleDetailListResponse);
    } catch (error) {
      console.error('Error fetching Header Module Detail list:', error);
    }
  };

  return (

    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark bg-gradient">
      <div className="container d-flex">
        {/* Left-aligned IMS item */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="/dashboard" className="nav-link">
              <h3>IMS</h3>
            </a>
          </li>
        </ul>

        {/* Right-aligned navigation items */}
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a href="/dashboard" className="nav-link">
              <i className="material-icons" style={{ fontSize: '20px' }}>home</i> Home
            </a>
          </li>
          {headerModuleList.map((module, index) => (
          <li key={index} className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="material-icons" style={{ fontSize: '20px' }}>{module.moduleIcon}</i> {module.formModuleName}
            </a>
              {headerModuleDetailList
                .filter(detail => detail.formModuleId === module.formModuleId)
                .map((detail, idx) => (
                  <ul key={index} className="dropdown-menu">
                    <li><a className="dropdown-item" href={`/${detail.formUrl}`}>{detail.formName}</a></li>
                  </ul>
                ))}
          </li>
          ))}
          {/* <li className="nav-item dropdown">
            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="material-icons" style={{ fontSize: '20px' }}>checklist_rtl</i> Audit
            </a>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="/audit-list">Audit list</a></li>
            </ul>
          </li> */}
          {/* <li className="nav-item">
      <a href="/audit-list" className="nav-link">
        <i className="material-icons" style={{ fontSize: '20px' }}>checklist_rtl</i> Audit
      </a>
    </li> */}
          <li className="nav-item">
            <a href="#" onClick={handleLogout} className="nav-link">
              <i className="material-icons" style={{ fontSize: '20px' }}>logout</i> Logout
            </a>
          </li>
        </ul>
      </div>

    </nav>

  )
}

export default withRouter(Navbar);