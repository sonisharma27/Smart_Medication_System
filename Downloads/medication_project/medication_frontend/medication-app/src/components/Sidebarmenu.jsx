import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';

function Sidebarmenu({ children }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Container fluid>
    <div className="container-fluid d-flex p-0">
      {/* Sidebar */}
      <div
        className="bg-dark text-white d-flex flex-column justify-content-between"
        style={{ width: '18%', minHeight: '100vh' }}
      >
        <div>
          {/* Logo Section */}
          {/* <div className="d-flex align-items-center ms-3 mt-3">
            <i className="bi bi-cash-stack fs-3 text-success"></i>
            <span className="ms-2 fs-4 fw-bold">BudgetWise</span>
          </div> */}

          <hr className="text-secondary" />

          {/* Sidebar Links */}
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item my-1">
              <button
                className="nav-link text-white text-start fs-6 w-100"
                onClick={() => navigate('/')}
              >
                <i className="bi bi-speedometer2 me-2"></i> {t("sidebar.dashboard")}
              </button>
            </li>

            <li className="nav-item my-1">
              <button
                className="nav-link text-white text-start fs-6 w-100"
                onClick={() => navigate('/medication')}
              >
                <i className="bi bi-capsule me-2"></i> {t("sidebar.medications")}
              </button>
            </li>

            <li className="nav-item my-1">
              <button
                className="nav-link text-white text-start fs-6 w-100"
                onClick={() => navigate('/profile')}
              >
                <i className="bi bi-person-circle me-2"></i> {t("sidebar.profile")}
              </button>
            </li>

            <li className="nav-item my-1">
              <button
                className="nav-link text-white text-start fs-6 w-100"
                onClick={() => navigate('/scanned')}
              >
                <i className="bi bi-camera me-2"></i> {t("sidebar.scanned")}
              </button>
            </li>
            <li className="nav-item my-1">
              <button
                className="nav-link text-white text-start fs-6 w-100"
                onClick={() => navigate('/report')}
              >
                <i className="bi bi-file-earmark-text me-2"></i> {t("sidebar.report")}
              </button>
            </li>
             <li className="nav-item my-1">
              <button
                className="nav-link text-white text-start fs-6 w-100"
                onClick={() => navigate('/ai')}
              >
                <i className="bi bi-robot me-2"></i> {t("sidebar.ai")}
              </button>
            </li>

            {/* <li className="nav-item my-1">
              <button
                className="nav-link text-white text-start fs-6 w-100"
                onClick={() => navigate('/settings')}
              >
                <i className="bi bi-gear me-2"></i> Settings
              </button>
            </li> */}
          </ul>
        </div>

        {/* Logout Section */}
        <div className="p-3">
          <button
            className="btn btn-outline-danger w-100"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('email');
              navigate('/');
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i> {t("navbar.logout")}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>
        {children}
      </main>
    </div>
    </Container>
  );
}

export default Sidebarmenu;
