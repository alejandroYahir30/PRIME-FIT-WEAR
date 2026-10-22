
import { useEffect, useState, type FormEvent } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonList,
  IonChip,
  IonSpinner,
  IonToast,
  IonIcon,
} from '@ionic/react';

import {
  arrowBackOutline,
  cubeOutline,
  addOutline,
  cloudUploadOutline,
  refreshOutline,
  searchOutline,
  shirtOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  imageOutline,
  pricetagOutline,
  layersOutline,
} from 'ionicons/icons';

import {
  obtenerProductos,
  crearProducto,
  publicarProducto,
  subirImagenProducto,
  type Producto,
} from '../services/api';

import './Products.css';

const API_ORIGIN = `http://${window.location.hostname || 'localhost'}:3000`;

const tallasIniciales = () => [
  { talla: 'S', stock: 0 },
  { talla: 'M', stock: 0 },
  { talla: 'L', stock: 0 },
  { talla: 'XL', stock: 0 },
];

const Products: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState<'hombre' | 'mujer' | 'unisex'>('hombre');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tallas, setTallas] = useState(tallasIniciales);
  const [imagen, setImagen] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [toast, setToast] = useState('');
  const [errorToast, setErrorToast] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  async function cargarProductos() {
    setCargando(true);

    try {
      const lista = await obtenerProductos();
      setProductos(lista);
    } catch (error) {
      setErrorToast(true);
      setToast(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los productos.'
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargarProductos();
  }, []);

  function cambiarStock(
    talla: string,
    valor: string | number | null | undefined
  ) {
    const stock = Math.max(0, Math.floor(Number(valor) || 0));

    setTallas((actuales) =>
      actuales.map((item) =>
        item.talla === talla ? { ...item, stock } : item
      )
    );
  }

  async function guardarProducto(evento: FormEvent) {
    evento.preventDefault();

    if (!nombre.trim()) {
      setErrorToast(true);
      setToast('Escribe el nombre de la prenda.');
      return;
    }

    if (
      !precio.trim() ||
      !Number.isFinite(Number(precio)) ||
      Number(precio) < 0
    ) {
      setErrorToast(true);
      setToast('Escribe un precio válido.');
      return;
    }

    if (!tallas.some((item) => item.stock > 0)) {
      setErrorToast(true);
      setToast('Agrega existencia en al menos una talla.');
      return;
    }

    setGuardando(true);

    try {
      const datos = {
        nombre: nombre.trim(),
        categoria,
        precio: Number(precio),
        descripcion: descripcion.trim(),
        tallas,
      };

      const creado = await crearProducto(datos);
      const id = Number(creado.producto.id);

      if (imagen) {
        await subirImagenProducto(id, imagen);
      }

      await publicarProducto(id, datos);

      setNombre('');
      setCategoria('hombre');
      setPrecio('');
      setDescripcion('');
      setImagen(null);
      setTallas(tallasIniciales());

      const selector = document.getElementById(
        'product-image'
      ) as HTMLInputElement | null;

      if (selector) selector.value = '';

      setErrorToast(false);
      setToast('Producto publicado correctamente.');
      await cargarProductos();
    } catch (error) {
      setErrorToast(true);
      setToast(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el producto.'
      );
    } finally {
      setGuardando(false);
    }
  }

  function urlImagen(url: string) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.replace('http://localhost:3000', API_ORIGIN);
    }

    return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  const productosFiltrados = productos.filter((producto) =>
    `${producto.nombre} ${producto.categoria}`
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase())
  );

  const totalUnidades = productos.reduce(
    (total, producto) =>
      total +
      (producto.tallas?.reduce(
        (suma, talla) => suma + Number(talla.stock || 0),
        0
      ) ?? 0),
    0
  );

  const publicados = productos.filter(
    (producto) => producto.publicado && producto.activo
  ).length;

  return (
    <IonPage className="products-page">
      <IonContent fullscreen className="products-content">
        <main className="products-container">
          <header className="products-topbar">
            <button
              type="button"
              className="products-back-button"
              onClick={() => window.location.assign('/home')}
            >
              <IonIcon icon={arrowBackOutline} />
              <span>Dashboard</span>
            </button>

            <div className="products-topbar-brand">
              <span className="products-brand-mark">P</span>
              <span>PRIME FIT <strong>WEAR</strong></span>
            </div>
          </header>

          <section className="products-heading">
            <div>
              <span className="products-eyebrow">
                ADMINISTRACIÓN / CATÁLOGO
              </span>
              <h1>Gestión de productos</h1>
              <p>
                Administra tus prendas, controla las existencias y publica
                productos en tu tienda.
              </p>
            </div>

            <button
              type="button"
              className="products-refresh-button"
              onClick={() => void cargarProductos()}
              disabled={cargando}
            >
              <IonIcon icon={refreshOutline} />
              Actualizar
            </button>
          </section>

          <section className="products-summary">
            <article className="products-summary-card">
              <div className="products-summary-icon blue">
                <IonIcon icon={cubeOutline} />
              </div>
              <div>
                <span>Productos registrados</span>
                <strong>{productos.length}</strong>
              </div>
            </article>

            <article className="products-summary-card">
              <div className="products-summary-icon green">
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
              <div>
                <span>Productos publicados</span>
                <strong>{publicados}</strong>
              </div>
            </article>

            <article className="products-summary-card">
              <div className="products-summary-icon violet">
                <IonIcon icon={layersOutline} />
              </div>
              <div>
                <span>Unidades en inventario</span>
                <strong>{totalUnidades.toLocaleString('es-MX')}</strong>
              </div>
            </article>
          </section>

          <div className="products-main-grid">
            <section className="products-form-card">
              <div className="products-section-heading">
                <div className="products-heading-icon">
                  <IonIcon icon={addOutline} />
                </div>
                <div>
                  <span className="products-eyebrow">NUEVO REGISTRO</span>
                  <h2>Agregar prenda</h2>
                  <p>Completa la información del producto.</p>
                </div>
              </div>

              <form onSubmit={guardarProducto}>
                <div className="products-form-group">
                  <label htmlFor="product-name">Nombre de la prenda</label>
                  <IonItem lines="none" className="products-input">
                    <IonInput
                      id="product-name"
                      value={nombre}
                      placeholder="Ej. Playera deportiva Pro"
                      maxlength={150}
                      onIonInput={(e) =>
                        setNombre(String(e.detail.value ?? ''))
                      }
                      required
                    />
                  </IonItem>
                </div>

                <div className="products-fields-row">
                  <div className="products-form-group">
                    <label htmlFor="product-category">Categoría</label>
                    <IonItem lines="none" className="products-input">
                      <IonSelect
                        id="product-category"
                        value={categoria}
                        onIonChange={(e) => setCategoria(e.detail.value)}
                        interface="popover"
                        aria-label="Categoría"
                      >
                        <IonSelectOption value="hombre">Hombre</IonSelectOption>
                        <IonSelectOption value="mujer">Mujer</IonSelectOption>
                        <IonSelectOption value="unisex">Unisex</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </div>

                  <div className="products-form-group">
                    <label htmlFor="product-price">Precio en MXN</label>
                    <IonItem lines="none" className="products-input">
                      <IonInput
                        id="product-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={precio}
                        placeholder="599.00"
                        onIonInput={(e) =>
                          setPrecio(String(e.detail.value ?? ''))
                        }
                        required
                      />
                    </IonItem>
                  </div>
                </div>

                <div className="products-form-group">
                  <label htmlFor="product-description">Descripción</label>
                  <IonItem lines="none" className="products-input products-textarea">
                    <IonTextarea
                      id="product-description"
                      value={descripcion}
                      placeholder="Material, ajuste y características de la prenda..."
                      autoGrow
                      maxlength={10000}
                      onIonInput={(e) =>
                        setDescripcion(String(e.detail.value ?? ''))
                      }
                    />
                  </IonItem>
                </div>

                <div className="products-stock-heading">
                  <div>
                    <h3>Existencias por talla</h3>
                    <p>Indica cuántas unidades tienes disponibles.</p>
                  </div>
                  <IonIcon icon={shirtOutline} />
                </div>

                <div className="products-sizes-grid">
                  {tallas.map((item) => (
                    <div className="products-size-field" key={item.talla}>
                      <label htmlFor={`stock-${item.talla}`}>
                        {item.talla}
                      </label>
                      <input
                        id={`stock-${item.talla}`}
                        type="number"
                        min="0"
                        step="1"
                        value={item.stock}
                        onChange={(e) =>
                          cambiarStock(item.talla, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="products-image-field">
                  <label htmlFor="product-image">Imagen del producto</label>

                  <label
                    className="products-upload-zone"
                    htmlFor="product-image"
                  >
                    <span className="products-upload-icon">
                      <IonIcon icon={cloudUploadOutline} />
                    </span>
                    <strong>
                      {imagen ? 'Imagen seleccionada' : 'Selecciona una imagen'}
                    </strong>
                    <span>
                      {imagen
                        ? imagen.name
                        : 'JPG, PNG o WEBP · Máximo 5 MB'}
                    </span>
                    <IonIcon icon={imageOutline} />
                  </label>

                  <input
                    id="product-image"
                    className="products-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      setImagen(e.target.files?.[0] ?? null)
                    }
                  />
                </div>

                <IonButton
                  className="products-submit"
                  expand="block"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando ? (
                    <>
                      <IonSpinner name="crescent" />
                      <span>Guardando producto...</span>
                    </>
                  ) : (
                    <>
                      <IonIcon slot="start" icon={addOutline} />
                      Guardar y publicar producto
                    </>
                  )}
                </IonButton>
              </form>
            </section>

            <section className="products-list-section">
              <div className="products-list-header">
                <div>
                  <span className="products-eyebrow">TU CATÁLOGO</span>
                  <h2>Productos registrados</h2>
                  <p>
                    {productos.length} producto
                    {productos.length === 1 ? '' : 's'} en total
                  </p>
                </div>
                <div className="products-list-header-icon">
                  <IonIcon icon={pricetagOutline} />
                </div>
              </div>

              <label className="products-search">
                <IonIcon icon={searchOutline} />
                <input
                  type="search"
                  placeholder="Buscar por nombre o categoría..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar productos"
                />
              </label>

              {cargando ? (
                <div className="products-loading">
                  <IonSpinner name="crescent" />
                  <span>Cargando productos...</span>
                </div>
              ) : productosFiltrados.length === 0 ? (
                <div className="products-empty">
                  <div className="products-empty-icon">
                    <IonIcon icon={alertCircleOutline} />
                  </div>
                  <h3>
                    {busqueda
                      ? 'No encontramos resultados'
                      : 'Tu catálogo está vacío'}
                  </h3>
                  <p>
                    {busqueda
                      ? 'Prueba con otro nombre o categoría.'
                      : 'Agrega tu primera prenda usando el formulario.'}
                  </p>
                </div>
              ) : (
                <IonList className="products-list">
                  {productosFiltrados.map((producto) => {
                    const principal =
                      producto.imagenes?.find(
                        (item) => item.imagen_principal
                      ) ?? producto.imagenes?.[0];

                    const existencia =
                      producto.tallas?.reduce(
                        (total, item) =>
                          total + Number(item.stock || 0),
                        0
                      ) ?? 0;

                    const publicado = Boolean(
                      producto.publicado && producto.activo
                    );

                    return (
                      <IonItem
                        key={producto.id}
                        lines="none"
                        className="products-list-item"
                      >
                        <div className="products-product-thumbnail">
                          {principal ? (
                            <img
                              src={urlImagen(principal.url)}
                              alt={producto.nombre}
                            />
                          ) : (
                            <IonIcon icon={shirtOutline} />
                          )}
                        </div>

                        <IonLabel>
                          <h2>{producto.nombre}</h2>
                          <p className="products-product-category">
                            {producto.categoria}
                          </p>
                          <p className="products-product-stock">
                            {existencia} unidades
                          </p>
                        </IonLabel>

                        <div className="products-product-meta">
                          <strong>
                            $
                            {Number(producto.precio).toLocaleString('es-MX', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </strong>
                          <IonChip
                            className="products-status-chip"
                            color={publicado ? 'success' : 'warning'}
                          >
                            {publicado ? 'Publicado' : 'Borrador'}
                          </IonChip>
                        </div>
                      </IonItem>
                    );
                  })}
                </IonList>
              )}
            </section>
          </div>

          <footer className="products-footer">
            <span>PRIME FIT WEAR</span>
            <span>Panel de administración</span>
          </footer>
        </main>

        <IonToast
          isOpen={Boolean(toast)}
          message={toast}
          duration={3000}
          color={errorToast ? 'danger' : 'success'}
          onDidDismiss={() => setToast('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default Products;
