const API_BASE_URL = `http://${window.location.hostname}:3000/api`;

export interface Producto {
  id: number;
  nombre: string;
  categoria: 'hombre' | 'mujer' | 'unisex';
  precio: number;
  descripcion?: string;
  publicado: boolean;
  activo: boolean;
  imagenes?: {
    id: number;
    url: string;
    imagen_principal?: boolean;
  }[];
  tallas?: {
    talla: string;
    stock: number;
  }[];
}

export async function comprobarConexion() {
  const respuesta = await fetch(`${API_BASE_URL}/estado`);

  if (!respuesta.ok) {
    throw new Error('No se pudo conectar con el servidor.');
  }

  return respuesta.json();
}

export async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await fetch(`${API_BASE_URL}/productos/admin/todos`);

  if (!respuesta.ok) {
    throw new Error('No se pudieron consultar los productos.');
  }

  const datos = await respuesta.json();

  return datos.productos ?? [];
}

export async function crearProducto(datos: {
  nombre: string;
  categoria: 'hombre' | 'mujer' | 'unisex';
  precio: number;
  descripcion: string;
  tallas: { talla: string; stock: number }[];
}) {
  const respuesta = await fetch(`${API_BASE_URL}/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(resultado.mensaje || 'No se pudo crear el producto.');
  }

  return resultado;
}

export async function publicarProducto(
  id: number,
  datos: Record<string, unknown>,
) {
  const respuesta = await fetch(`${API_BASE_URL}/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...datos,
      publicado: true,
      activo: true,
    }),
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(resultado.mensaje || 'No se pudo publicar el producto.');
  }

  return resultado;
}

export async function subirImagenProducto(
  productoId: number,
  archivo: File
) {
  const formulario = new FormData();

  formulario.append('imagen', archivo);
  formulario.append('perfil', 'frente');
  formulario.append('orden', '0');
  formulario.append('imagen_principal', 'true');

  const respuesta = await fetch(
    `${API_BASE_URL}/imagenes/producto/${productoId}`,
    {
      method: 'POST',
      body: formulario,
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(
      resultado.mensaje || 'No se pudo subir la imagen.'
    );
  }

  return resultado;
}