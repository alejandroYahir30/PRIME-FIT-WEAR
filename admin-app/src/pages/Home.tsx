
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  gridOutline,
  cubeOutline,
  cartOutline,
  statsChartOutline,
  settingsOutline,
  logOutOutline,
  searchOutline,
  notificationsOutline,
  chevronForwardOutline,
  checkmarkCircleOutline,
  addOutline,
  timeOutline,
  storefrontOutline,
  personCircleOutline,
  arrowUpOutline,
} from 'ionicons/icons';

import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const irA = (ruta: string) => navigate(ruta);

  const cerrarSesion = () => {
    localStorage.removeItem('administrador');
    navigate('/login');
  };

  return (
    <IonPage className="home-page">
      <IonContent fullscreen className="home-content">
        <div className="admin-layout">
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-mark">P</div>

              <div className="brand-copy">
                <span className="brand-name">PRIME FIT</span>
                <span className="brand-subtitle">WEAR · ADMIN</span>
              </div>
            </div>

            <div className="sidebar-section-label">
              MENÚ PRINCIPAL
            </div>

            <nav className="sidebar-nav">
              <button
                type="button"
                className="nav-item active"
                onClick={() => irA('/home')}
              >
                <IonIcon icon={gridOutline} />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                className="nav-item"
                onClick={() => irA('/productos')}
              >
                <IonIcon icon={cubeOutline} />
                <span>Productos</span>
              </button>

              <button
                type="button"
                className="nav-item"
                onClick={() => irA('/pedidos')}
              >
                <IonIcon icon={cartOutline} />
                <span>Pedidos</span>
              </button>

              <button
                type="button"
                className="nav-item"
                onClick={() => irA('/ventas')}
              >
                <IonIcon icon={statsChartOutline} />
                <span>Ventas</span>
              </button>
            </nav>

            <div className="sidebar-section-label secondary-label">
              CONFIGURACIÓN
            </div>

            <nav className="sidebar-nav">
              <button
                type="button"
                className="nav-item"
                onClick={() => irA('/configuracion')}
              >
                <IonIcon icon={settingsOutline} />
                <span>Configuración</span>
              </button>
            </nav>

            <div className="sidebar-bottom">
              <div className="store-status">
                <span className="status-dot" />
                <div>
                  <strong>Tienda disponible</strong>
                  <span>Panel administrativo</span>
                </div>
              </div>

              <button
                type="button"
                className="logout-button"
                onClick={cerrarSesion}
              >
                <IonIcon icon={logOutOutline} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </aside>

          <main className="main-area">
            <header className="topbar">
              <div className="breadcrumb">
                <span>Administración</span>
                <IonIcon icon={chevronForwardOutline} />
                <strong>Dashboard</strong>
              </div>

              <div className="topbar-actions">

                <div className="topbar-search">
                  <IonIcon icon={searchOutline} />
                  <input
                    type="search"
                    placeholder="Buscar productos, pedidos..."
                    aria-label="Buscar"
                  />
                </div>


                <button
                  type="button"
                  className="icon-button notification-button"
                  aria-label="Notificaciones"
                >
                  <IonIcon icon={notificationsOutline} />
                  <span />
                </button>

                <div className="profile-divider" />

                <div className="profile">
                  <div className="profile-avatar">
                    <IonIcon icon={personCircleOutline} />
                  </div>

                  <div className="profile-info">
                    <strong>Administrador</strong>
                    <span>Panel de control</span>
                  </div>
                </div>
              </div>
            </header>

            <div className="dashboard-content">
              <section className="welcome-row">
                <div>
                  <span className="eyebrow">PANEL DE CONTROL</span>
                  <h1>Tu tienda, bajo control.</h1>
                  <p>
                    Bienvenido de nuevo. Aquí tienes el resumen de PRIME FIT
                    WEAR.
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => irA('/productos')}
                >
                  <IonIcon icon={addOutline} />
                  Ver productos
                </button>
              </section>

              <section className="overview-banner">
                <div className="banner-content">
                  <span className="banner-label">PRIME FIT WEAR</span>

                  <h2>Supera tus propios límites.</h2>

                  <p>
                    Administra tu catálogo y mantén tu tienda en movimiento
                    desde un solo lugar.
                  </p>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => irA('/productos')}
                  >
                    Explorar productos
                    <IonIcon icon={chevronForwardOutline} />
                  </button>
                </div>

                <div className="banner-decoration" aria-hidden="true">
                  <div className="banner-ring ring-one" />
                  <div className="banner-ring ring-two" />
                  <div className="banner-monogram">PF</div>
                </div>
              </section>

              <section className="section-heading">
                <div>
                  <h2>Resumen general</h2>
                  <p>Una vista rápida de la actividad de tu tienda.</p>
                </div>

                <span className="period-label">
                  <IonIcon icon={timeOutline} />
                  Vista general
                </span>
              </section>

              <section className="stats-grid">
                <article className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon blue-icon">
                      <IonIcon icon={cubeOutline} />
                    </div>

                    <button
                      type="button"
                      className="more-button"
                      aria-label="Ver productos"
                      onClick={() => irA('/productos')}
                    >
                      <IonIcon icon={chevronForwardOutline} />
                    </button>
                  </div>

                  <span className="stat-label">
                    Productos registrados
                  </span>

                  <div className="stat-value-row">
                    <strong>—</strong>
                    <span className="stat-indicator neutral">Catálogo</span>
                  </div>

                  <span className="stat-footnote">
                    Productos de tu tienda
                  </span>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon violet-icon">
                      <IonIcon icon={cartOutline} />
                    </div>

                    <button
                      type="button"
                      className="more-button"
                      aria-label="Ver pedidos"
                      onClick={() => irA('/pedidos')}
                    >
                      <IonIcon icon={chevronForwardOutline} />
                    </button>
                  </div>

                  <span className="stat-label">Pedidos recibidos</span>

                  <div className="stat-value-row">
                    <strong>—</strong>
                    <span className="stat-indicator neutral">Pedidos</span>
                  </div>

                  <span className="stat-footnote">
                    Pedidos registrados en el sistema
                  </span>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon green-icon">
                      <IonIcon icon={statsChartOutline} />
                    </div>

                    <button
                      type="button"
                      className="more-button"
                      aria-label="Ver ventas"
                      onClick={() => irA('/ventas')}
                    >
                      <IonIcon icon={chevronForwardOutline} />
                    </button>
                  </div>

                  <span className="stat-label">Ventas registradas</span>

                  <div className="stat-value-row">
                    <strong>—</strong>
                    <span className="stat-indicator neutral">Ventas</span>
                  </div>

                  <span className="stat-footnote">
                    Consulta tus movimientos
                  </span>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon orange-icon">
                      <IonIcon icon={storefrontOutline} />
                    </div>

                    <span className="status-dot" />
                  </div>

                  <span className="stat-label">Estado del sistema</span>

                  <div className="stat-value-row">
                    <strong style={{ fontSize: '20px' }}>
                      Disponible
                    </strong>
                  </div>

                  <span className="stat-footnote">
                    Interfaz administrativa activa
                  </span>
                </article>
              </section>

              <section className="lower-grid">
                <article className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Accesos rápidos</h2>
                      <p>Continúa trabajando en tu tienda.</p>
                    </div>

                    <IonIcon icon={arrowUpOutline} />
                  </div>

                  <button
                    type="button"
                    className="quick-action"
                    onClick={() => irA('/productos')}
                  >
                    <div className="quick-action-icon">
                      <IonIcon icon={cubeOutline} />
                    </div>

                    <div className="quick-action-copy">
                      <strong>Administrar productos</strong>
                      <span>Consulta y gestiona tu catálogo</span>
                    </div>

                    <IonIcon
                      className="quick-arrow"
                      icon={chevronForwardOutline}
                    />
                  </button>

                  <button
                    type="button"
                    className="quick-action"
                    onClick={() => irA('/pedidos')}
                  >
                    <div className="quick-action-icon">
                      <IonIcon icon={cartOutline} />
                    </div>

                    <div className="quick-action-copy">
                      <strong>Revisar pedidos</strong>
                      <span>Consulta los pedidos recibidos</span>
                    </div>

                    <IonIcon
                      className="quick-arrow"
                      icon={chevronForwardOutline}
                    />
                  </button>

                  <button
                    type="button"
                    className="quick-action"
                    onClick={() => irA('/ventas')}
                  >
                    <div className="quick-action-icon">
                      <IonIcon icon={statsChartOutline} />
                    </div>

                    <div className="quick-action-copy">
                      <strong>Consultar ventas</strong>
                      <span>Revisa los movimientos registrados</span>
                    </div>

                    <IonIcon
                      className="quick-arrow"
                      icon={chevronForwardOutline}
                    />
                  </button>
                </article>

                <article className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Estado del sistema</h2>
                      <p>Información general del panel.</p>
                    </div>

                    <span className="system-badge">INTERFAZ ACTIVA</span>
                  </div>

                  <div className="system-row">
                    <div className="system-check">
                      <IonIcon icon={checkmarkCircleOutline} />
                    </div>

                    <div className="system-copy">
                      <strong>Panel administrativo</strong>
                      <span>
                        La interfaz se ha cargado correctamente.
                      </span>
                    </div>

                    <span className="system-tag">Activo</span>
                  </div>

                  <div className="system-row">
                    <div className="system-check">
                      <IonIcon icon={checkmarkCircleOutline} />
                    </div>

                    <div className="system-copy">
                      <strong>Catálogo de productos</strong>
                      <span>
                        Disponible para consultar y administrar.
                      </span>
                    </div>

                    <span className="system-tag">Disponible</span>
                  </div>

                  <div className="system-row">
                    <div className="system-check pending">
                      <IonIcon icon={timeOutline} />
                    </div>

                    <div className="system-copy">
                      <strong>Estadísticas reales</strong>
                      <span>
                        Pendiente de conectar los datos del backend.
                      </span>
                    </div>

                    <span className="system-tag pending-tag">
                      Pendiente
                    </span>
                  </div>
                </article>
              </section>

              <footer className="dashboard-footer">
                <span>PRIME FIT WEAR</span>
                <span>Panel de administración</span>
              </footer>
            </div>
          </main>

          <nav className="mobile-bottom-nav">
            <button
              type="button"
              className="mobile-nav-item active"
              onClick={() => irA('/home')}
            >
              <IonIcon icon={gridOutline} />
              <span>Inicio</span>
            </button>

            <button
              type="button"
              className="mobile-nav-item"
              onClick={() => irA('/productos')}
            >
              <IonIcon icon={cubeOutline} />
              <span>Productos</span>
            </button>

            <button
              type="button"
              className="mobile-nav-item"
              onClick={() => irA('/pedidos')}
            >
              <IonIcon icon={cartOutline} />
              <span>Pedidos</span>
            </button>

            <button
              type="button"
              className="mobile-nav-item"
              onClick={() => irA('/ventas')}
            >
              <IonIcon icon={statsChartOutline} />
              <span>Ventas</span>
            </button>
          </nav>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
