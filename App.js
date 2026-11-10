import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

const COLORES = {
  vino: '#6B1230',
  vinoOscuro: '#4A0C20',
  vinoClaro: '#F3E3E8',
  crema: '#FBF6F2',
  blanco: '#FFFFFF',
  texto: '#2B1A1F',
  gris: '#8A7B80',
  exito: '#2E7D4F',
  exitoFondo: '#E6F4EA',
  error: '#B3261E',
  errorFondo: '#FDECEA',
};

const formatearPesos = (numero) =>
  '$' + String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export default function App() {
  // ----- Estados (useState) -----
  const [cliente, setCliente] = useState('');
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [mensaje, setMensaje] = useState(''); // texto del mensaje visible
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'exito' | 'error' | ''
  const [pedido, setPedido] = useState(null); // resumen del último pedido válido
  const [contador, setContador] = useState(0); // pedidos válidos de la sesión

  // ----- Evento: Registrar pedido -----
  const registrarPedido = () => {
    const errores = [];

    // 1) Validar nombre y producto (sin espacios sobrantes)
    const nombreLimpio = cliente.trim();
    const productoLimpio = producto.trim();
    if (nombreLimpio === '') errores.push('Debe ingresar el nombre del cliente');
    if (productoLimpio === '') errores.push('Debe ingresar un producto');

    // 2) Validar cantidad: solo dígitos, entero y mayor que cero
    const cantidadLimpia = cantidad.trim();
    const cantidadNumero = Number(cantidadLimpia);
    const cantidadValida =
      /^\d+$/.test(cantidadLimpia) && cantidadNumero > 0;
    if (!cantidadValida) errores.push('Ingrese una cantidad válida');

    // 3) Validar precio unitario: solo dígitos (pesos) y mayor que cero
    const precioLimpio = precio.trim();
    const precioNumero = Number(precioLimpio);
    const precioValido = /^\d+$/.test(precioLimpio) && precioNumero > 0;
    if (!precioValido) errores.push('Ingrese un precio unitario válido');

    // 4) Si hay errores: mostrarlos, NO sumar y NO confirmar
    if (errores.length > 0) {
      setMensaje(errores.join('\n'));
      setTipoMensaje('error');
      setPedido(null);
      return;
    }

    // 5) Pedido válido: calcular total, guardar resumen y sumar 1 al contador
    const total = cantidadNumero * precioNumero;
    setPedido({
      cliente: nombreLimpio,
      producto: productoLimpio,
      cantidad: cantidadNumero,
      precio: precioNumero,
      total: total,
    });
    setContador(contador + 1);
    setMensaje('Pedido registrado correctamente');
    setTipoMensaje('exito');
  };

  // ----- Evento: Limpiar formulario (el contador NO se reinicia) -----
  const limpiarFormulario = () => {
    setCliente('');
    setProducto('');
    setCantidad('');
    setPrecio('');
    setMensaje('');
    setTipoMensaje('');
    setPedido(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORES.vino} />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* RF-01: Encabezado con nombre de la empresa y bienvenida */}
        <View style={styles.header}>
          <Text style={styles.empresa}>AgroExito Mosquera</Text>
          <Text style={styles.bienvenida}>
            Bienvenido Registra aquí los pedidos de tus clientes.
          </Text>
        </View>

        {/* RF-08: Totalizador */}
        <View style={styles.contadorCaja}>
          <Text style={styles.contadorEtiqueta}>Pedidos registrados</Text>
          <Text style={styles.contadorNumero}>{contador}</Text>
        </View>

        {/* Formulario */}
        <View style={styles.tarjeta}>
          <Text style={styles.tituloTarjeta}>Nuevo pedido</Text>

          {/* RF-02 */}
          <Text style={styles.etiqueta}>Nombre del cliente</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: María Rodríguez"
            placeholderTextColor={COLORES.gris}
            value={cliente}
            onChangeText={setCliente}
          />

          {/* RF-03 */}
          <Text style={styles.etiqueta}>Producto solicitado</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Mesa para Jardín / Exterior "
            placeholderTextColor={COLORES.gris}
            value={producto}
            onChangeText={setProducto}
          />

          {/* RF-04 */}
          <Text style={styles.etiqueta}>Cantidad (unidades)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 5"
            placeholderTextColor={COLORES.gris}
            value={cantidad}
            onChangeText={setCantidad}
            keyboardType="numeric"
          />

          {/* HU-09: precio unitario */}
          <Text style={styles.etiqueta}>Precio unitario (COP)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 3000"
            placeholderTextColor={COLORES.gris}
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric"
          />

          {/* RF-05 y RF-09: botones */}
          <View style={styles.botonRegistrar}>
            <Button
              title="Registrar pedido"
              color={COLORES.vino}
              onPress={registrarPedido}
            />
          </View>
          <View style={styles.botonLimpiar}>
            <Button
              title="Limpiar"
              color={COLORES.gris}
              onPress={limpiarFormulario}
            />
          </View>
        </View>

        {/* RF-06 y RF-07: mensajes de error / confirmación */}
        {mensaje !== '' && (
          <View
            style={[
              styles.mensajeCaja,
              tipoMensaje === 'exito' ? styles.mensajeExito : styles.mensajeError,
            ]}
          >
            <Text
              style={[
                styles.mensajeTexto,
                tipoMensaje === 'exito'
                  ? styles.textoExito
                  : styles.textoError,
              ]}
            >
              {mensaje}
            </Text>

            {tipoMensaje === 'exito' && pedido !== null && (
              <View style={styles.resumen}>
                <Text style={styles.resumenLinea}>
                  Cliente: <Text style={styles.negrita}>{pedido.cliente}</Text>
                </Text>
                <Text style={styles.resumenLinea}>
                  Producto: <Text style={styles.negrita}>{pedido.producto}</Text>
                </Text>
                <Text style={styles.resumenLinea}>
                  Cantidad: <Text style={styles.negrita}>{pedido.cantidad}</Text>
                </Text>
                <Text style={styles.resumenLinea}>
                  Precio unitario:{' '}
                  <Text style={styles.negrita}>
                    {formatearPesos(pedido.precio)}
                  </Text>
                </Text>
                <Text style={styles.resumenTotal}>
                  Total: {formatearPesos(pedido.total)}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ----- Estilos (StyleSheet) -----
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORES.crema },
  scroll: { paddingBottom: 40 },

  header: {
    backgroundColor: COLORES.vino,
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  empresa: {
    color: COLORES.blanco,
    fontSize: 28,
    fontWeight: 'bold',
  },
  bienvenida: {
    color: COLORES.vinoClaro,
    fontSize: 15,
    marginTop: 8,
    lineHeight: 21,
  },

  contadorCaja: {
    backgroundColor: COLORES.blanco,
    marginHorizontal: 20,
    marginTop: -22,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 6,
    borderLeftColor: COLORES.vinoOscuro,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  contadorEtiqueta: { color: COLORES.texto, fontSize: 16, fontWeight: '600' },
  contadorNumero: { color: COLORES.vino, fontSize: 32, fontWeight: 'bold' },

  tarjeta: {
    backgroundColor: COLORES.blanco,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  tituloTarjeta: {
    color: COLORES.vino,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  etiqueta: {
    color: COLORES.texto,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORES.vinoClaro,
    backgroundColor: COLORES.crema,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORES.texto,
  },

  botonRegistrar: { marginTop: 24, borderRadius: 10, overflow: 'hidden' },
  botonLimpiar: { marginTop: 10, borderRadius: 10, overflow: 'hidden' },

  mensajeCaja: {
    marginHorizontal: 20,
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    borderLeftWidth: 6,
  },
  mensajeExito: {
    backgroundColor: COLORES.exitoFondo,
    borderLeftColor: COLORES.exito,
  },
  mensajeError: {
    backgroundColor: COLORES.errorFondo,
    borderLeftColor: COLORES.error,
  },
  mensajeTexto: { fontSize: 15, fontWeight: '700', lineHeight: 22 },
  textoExito: { color: COLORES.exito },
  textoError: { color: COLORES.error },

  resumen: { marginTop: 10 },
  resumenLinea: { color: COLORES.texto, fontSize: 15, marginTop: 3 },
  negrita: { fontWeight: 'bold' },
  resumenTotal: {
    color: COLORES.vino,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
