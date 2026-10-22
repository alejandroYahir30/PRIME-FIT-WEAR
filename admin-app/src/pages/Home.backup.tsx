
import {
  IonContent,
  IonPage,
  IonIcon,
} from '@ionic/react';

import {
  gridOutline,
  shirtOutline,
  cubeOutline,
  imagesOutline,
  settingsOutline,
  logOutOutline,
  searchOutline,
  notificationsOutline,
  addOutline,
  arrowUpOutline,
  arrowDownOutline,
  ellipsisHorizontal,
  bagHandleOutline,
  cashOutline,
  trendingUpOutline,
  timeOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="admin-layout">

          <aside className="sidebar">
            <div className="brand">
              <div className="brand-mark">PF</div>
              <div className="brand-copy">
                <span className="brand-name">PRIME FIT</span>
                <span className="brand-subtitle">WEAR · ADMIN</span>
              </div>
            </div>

            <div className="sidebar-section-label">MENÚ PRINCIPAL</div>

            <nav className="sidebar-nav">
              <a className="nav-item active" href="/home">
                <IonIcon icon={gridOutline} />
                <span>Dashboard</span>
              </a>

              <a className="nav-item" href="#productos">
                <IonIcon icon={shirtOutline} />
                <span>Productos</span>
              </a>

              <a className="nav-item" href="#inventario">
                <IonIcon icon={cubeOutline} />
                <span>Inventario</span>
              </a>

              <a className="nav-item" href="#imagenes">
                <IonIcon icon={imagesOutline} />
                <span>Imágenes</span>
              </a>
            </nav>

            <div className="sidebar-section-label secondary-label">
              PREFERENCIAS
            </div>

            <nav className="sidebar-nav">
              <a className="nav-item" href="#configuracion">
                <IonIcon icon={settingsOutline} />
                <span>Configuración</span>
              </a>
            </nav>

            <div className="sidebar-bottom">
              <div className="store-status">
                <span className="status-dot" />
                <div>
                  <strong>Panel administrativo</strong>
                  <span>Conexión local</span>
                </div>
              </div>

              <button className="logout-button" type="button">
                <IonIcon icon={logOutOutline} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </aside>

          <main className="main-area">
            <header className="topbar">
              <div className="breadcrumb">
                <span>PRIME FIT WEAR</span>
                <IonIcon icon={chevronForwardOutline} />
                <strong>Dashboard</strong>
              </div>

              <div className="topbar-actions">
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Buscar"
                >
                  <IonIcon icon={searchOutline} />
                </button>

                <button
                  className="icon-button notification-button"
                  type="button"
                  aria-label="Notificaciones"
                >
                  <IonIcon icon={notificationsOutline} />
                  <span />
                </button>

                <div className="profile-divider" />

                <div className="profile">
                  <div className="profile-avatar">PF</div>
                  <div className="profile-info">
                    <strong>Administrador</strong>
                    <span>PRIME FIT WEAR</span>
                  </div>
                </div>
              </div>
            </header>

            <section className="dashboard-content">
              <div className="welcome-row">
                <div>
                  <span className="eyebrow">CENTRO DE CONTROL</span>
                  <h1>Dashboard</h1>
                  <p>
                    Administra tus productos y mantén tu inventario bajo control.
                  </p>
                </div>

                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    window.location.hash = 'productos';
                  }}
                >
                  <IonIcon icon={addOutline} />
                  <span>Nuevo producto</span>
                </button>
              </div>

              <div className="overview-banner">
                <div className="banner-content">
                  <span className="banner-label">PRIME FIT WEAR / OVERVIEW</span>
                  <h2>Tu tienda, bajo control.</h2>
                  <p>
                    Gestiona prendas, tallas, existencias e imágenes desde
                    un solo lugar.
                  </p>
                </div>

                <div className="banner-decoration">
                  <div className="banner-ring ring-one" />
                  <div className="banner-ring ring-two" />
                  <div className="banner-monogram">PF</div>
                </div>
              </div>

              <div className="section-heading">
                <div>
                  <h2>Resumen general</h2>
                  <p>Indicadores de tu catálogo</p>
                </div>
                <span className="period-label">
                  <IonIcon icon={timeOutline} />
                  Vista general
                </span>
              </div>

              <div className="stats-grid">
                <article className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon blue-icon">
                      <IonIcon icon={shirtOutline} />
                    </div>
                    <button
                      className="more-button"
                      type="button"
                      aria-label="Más opciones de productos"
                    >
                      <IonIcon icon={ellipsisHorizontal} />
                    </button>
                  </div>
                  <span className="stat-label">Productos registrados</span>
                  <div className="stat-value-row">
                    <strong>—</strong>
                    <span className="stat-indicator neutral">
                      <IonIcon icon={trendingUpOutline} />
                      Catálogo
                    </span>
                  </div>
                  <span className="stat-footnote">
                    Total de prendas en el sistema
                  </span>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon violet-icon">
                      <IonIcon icon={cubeOutline} />
                    </div>
                    <button
                      className="more-button"
                      type="button"
                      aria-label="Más opciones de inventario"
                    >
                      <IonIcon icon={ellipsisHorizontal} />
                    </button>
                  </div>
                  <span className="stat-label">Unidades en inventario</span>
                  <div className="stat-value-row">
                    <strong>—</strong>
                    <span className="stat-indicator neutral">
                      <IonIcon icon={cubeOutline} />
                      Stock
                    </span>
                  </div>
                  <span className="stat-footnote">
                    Existencias de todas las tallas
                  </span>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon green-icon">
                      <IonIcon icon={bagHandleOutline} />
                    </div>
                    <button
                      className="more-button"
                      type="button"
                      aria-label="Más opciones de publicaciones"
                    >
                      <IonIcon icon={ellipsisHorizontal} />
                    </button>
                  </div>
                  <span className="stat-label">Productos publicados</span>
                  <div className="stat-value-row">
                    <strong>—</strong>
                    <span className="stat-indicator neutral">
                      <IonIcon icon={arrowUpOutline} />
                      Tienda
                    </span>
                  </div>
                  <span className="stat-footnote">
                    Prendas visibles para los clientes
                  </span>
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <div className="stat-icon orange-icon">
                      <IonIcon icon={cashOutline} />
                    </div>
                    <button
                      className="more-button"
                      type="button"
                      aria-label="Más opciones de ventas"
                    >
                      <IonIcon icon={ellipsisHorizontal} />
                    </button>
                  </div>
                  <span className="stat-label">Valor del inventario</span>
                  <div className="stat-value-row">
                    <strong>—</strong>
                    <span className="stat-indicator neutral">
                      <IonIcon icon={arrowDownOutline} />
                      Estimado
                    </span>
                  </div>
                  <span className="stat-footnote">
                    Se calculará con los datos reales
                  </span>
                </article>
              </div>

              <div className="lower-grid">
                <section className="panel quick-actions-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Accesos rápidos</h2>
                      <p>Continúa con la administración de tu tienda</p>
                    </div>
                  </div>

                  <button
                    className="quick-action"
                    type="button"
                    onClick={() => {
                      window.location.hash = 'productos';
                    }}
                  >
                    <div className="quick-action-icon">
                      <IonIcon icon={addOutline} />
                    </div>
                    <div className="quick-action-copy">
                      <strong>Agregar producto</strong>
                      <span>Registra una nueva prenda y sus tallas</span>
                    </div>
                    <IonIcon
                      className="quick-arrow"
                      icon={chevronForwardOutline}
                    />
                  </button>

                  <button
                    className="quick-action"
                    type="button"
                    onClick={() => {
                      window.location.hash = 'inventario';
                    }}
                  >
                    <div className="quick-action-icon">
                      <IonIcon icon={cubeOutline} />
                    </div>
                    <div className="quick-action-copy">
                      <strong>Revisar inventario</strong>
                      <span>Consulta existencias y disponibilidad</span>
                    </div>
                    <IonIcon
                      className="quick-arrow"
                      icon={chevronForwardOutline}
                    />
                  </button>

                  <button
                    className="quick-action"
                    type="button"
                    onClick={() => {
                      window.location.hash = 'imagenes';
                    }}
                  >
                    <div className="quick-action-icon">
                      <IonIcon icon={imagesOutline} />
                    </div>
                    <div className="quick-action-copy">
                      <strong>Administrar imágenes</strong>
                      <span>Organiza las fotografías de tus prendas</span>
                    </div>
                    <IonIcon
                      className="quick-arrow"
                      icon={chevronForwardOutline}
                    />
                  </button>
                </section>

                <section className="panel status-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Estado del sistema</h2>
                      <p>Preparación de tu administrador</p>
                    </div>
                    <span className="system-badge">EN DESARROLLO</span>
                  </div>

                  <div className="system-row">
                    <div className="system-check">1</div>
                    <div className="system-copy">
                      <strong>Interfaz administrativa</strong>
                      <span>Panel visual en construcción</span>
                    </div>
                    <span className="system-tag">Actual</span>
                  </div>

                  <div className="system-row">
                    <div className="system-check pending">2</div>
                    <div className="system-copy">
                      <strong>Conexión con productos</strong>
                      <span>Leer el catálogo desde la API</span>
                    </div>
                    <span className="system-tag pending-tag">Pendiente</span>
                  </div>

                  <div className="system-row">
                    <div className="system-check pending">3</div>
                    <div className="system-copy">
                      <strong>Gestión de inventario</strong>
                      <span>Editar prendas, tallas y existencias</span>
                    </div>
                    <span className="system-tag pending-tag">Pendiente</span>
                  </div>
                </section>
              </div>

              <footer className="dashboard-footer">
                <span>PRIME FIT WEAR</span>
                <span>Panel administrativo · Versión inicial</span>
              </footer>
            </section>
          </main>
                    <nav className="mobile-bottom-nav" aria-label="Navegación móvil">
            <a className="mobile-nav-item active" href="/home">
              <IonIcon icon={gridOutline} />
              <span>Inicio</span>
            </a>

            <a className="mobile-nav-item" href="#productos">
              <IonIcon icon={shirtOutline} />
              <span>Productos</span>
            </a>

            <a className="mobile-nav-item" href="#inventario">
              <IonIcon icon={cubeOutline} />
              <span>Inventario</span>
            </a>

            <a className="mobile-nav-item" href="#imagenes">
              <IonIcon icon={imagesOutline} />
              <span>Imágenes</span>
            </a>
          </nav>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
