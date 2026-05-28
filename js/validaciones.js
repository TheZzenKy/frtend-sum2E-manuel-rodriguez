document.addEventListener('DOMContentLoaded', () => {
    // Objeto de medicos por especialidad (keys en formato como en select)
    const medicosPorEspecialidad = {
      "Clínica General": ["Dr. Gomez, Carlos", "Dra. Lopez, Maria"],
      "Cardiología": ["Dr. Perez, Juan", "Dra. Torres, Ana"],
      "Pediatría": ["Dra. Diaz, Laura", "Dr. Soto, Pablo"],
      "Ginecología": ["Dra. Romero, Valeria", "Dra. Castro, Elena"],
      "Traumatología": ["Dr. Ramos, Sergio", "Dr. Herrera, Diego"],
      "Neurología": ["Dr. Molina, Andres", "Dra. Vargas, Cecilia"]
    };
  
    const form = document.getElementById('turnoForm');
  
    // Inputs / selects
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const dni = document.getElementById('dni');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    const nacimiento = document.getElementById('nacimiento');
    const genero = document.getElementById('genero');
  
    const especialidad = document.getElementById('especialidad');
    const medico = document.getElementById('medico');
    const tipo_consulta = document.getElementById('tipo_consulta');
    const fecha_turno = document.getElementById('fecha_turno');
    const hora_turno = document.getElementById('hora_turno');
    const modalidad = document.getElementById('modalidad');
    const plataformaWrap = document.getElementById('plataforma_wrap');
    const plataforma = document.getElementById('plataforma');
  
    const cobertura = document.getElementById('cobertura');
    const credWrap = document.getElementById('credencial_wrap');
    const planWrap = document.getElementById('plan_wrap');
    const num_credencial = document.getElementById('num_credencial');
    const plan = document.getElementById('plan');
  
    const primera_visita = document.getElementById('primera_visita');
    const como_wrap = document.getElementById('como_wrap');
    const como = document.getElementById('como');
  
    const estudios_previos = document.getElementById('estudios_previos');
    const desc_estudios_wrap = document.getElementById('desc_estudios_wrap');
    const desc_estudios = document.getElementById('desc_estudios');
  
    // Helpers para mostrar/ocultar condicionales
    function setConditional(wrapper, field, visible) {
      wrapper.classList.toggle('hidden', !visible);
      wrapper.setAttribute('aria-hidden', String(!visible));
      if (field) field.disabled = !visible;
      if (!visible) {
        if (field) field.value = '';
        // limpiar estilos de validación
        if (field) applyFieldStatus(field, null);
      }
    }
  
    // Rellenar medicos al cambiar especialidad
    especialidad.addEventListener('change', () => {
      const esp = especialidad.value;
      medico.innerHTML = '';
      if (!esp || !medicosPorEspecialidad[esp]) {
        medico.disabled = true;
        medico.appendChild(new Option('Seleccione especialidad primero', ''));
      } else {
        medico.disabled = false;
        medico.appendChild(new Option('-- Seleccione médico --', ''));
        medicosPorEspecialidad[esp].forEach(m => medico.appendChild(new Option(m, m)));
      }
      // actualiza estado visual
      applyFieldStatus(especialidad, null);
      applyFieldStatus(medico, null);
    });
  
    // Modalidad -> plataforma
    modalidad.addEventListener('change', () => {
      const isVideo = modalidad.value === 'Videoconsulta';
      setConditional(plataformaWrap, plataforma, isVideo);
      applyFieldStatus(modalidad, null);
      applyFieldStatus(plataforma, null);
    });
  
    // Cobertura -> credencial y plan
    cobertura.addEventListener('change', () => {
      const isPart = cobertura.value === 'Particular';
      setConditional(credWrap, num_credencial, !isPart);
      setConditional(planWrap, plan, !isPart);
      applyFieldStatus(cobertura, null);
    });
  
    // Primera visita -> como nos conocio
    primera_visita.addEventListener('change', () => {
      setConditional(como_wrap, como, primera_visita.checked);
      applyFieldStatus(primera_visita, null);
    });
  
    estudios_previos.addEventListener('change', () => {
      setConditional(desc_estudios_wrap, desc_estudios, estudios_previos.checked);
      applyFieldStatus(estudios_previos, null);
    });
  
    // util: crear/mostrar mensaje de error debajo del campo
    function setErrorMessage(field, message) {
      // buscar elemento existente
      let msg = field.parentElement.querySelector('.mensaje-error');
      if (!message) {
        if (msg) msg.remove();
        return;
      }
      if (!msg) {
        msg = document.createElement('div');
        msg.className = 'mensaje-error';
        field.parentElement.appendChild(msg);
      }
      msg.textContent = message;
    }
  
    // aplicar clases campo-error / campo-ok o limpiar si status === null
    function applyFieldStatus(field, valid, message) {
      if (!field) return;
      field.classList.remove('campo-error', 'campo-ok');
      setErrorMessage(field, null);
      if (valid === true) {
        field.classList.add('campo-ok');
      } else if (valid === false) {
        field.classList.add('campo-error');
        if (message) setErrorMessage(field, message);
      }
    }
  
    // Validaciones por campo (devuelve {ok: boolean, msg: string|null})
    function validarNombre(valor) {
      if (!valor || !valor.trim()) return { ok: false, msg: 'Nombre obligatorio' };
      const re = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
      if (!re.test(valor.trim())) return { ok: false, msg: 'Solo letras y espacios' };
      return { ok: true, msg: null };
    }
    function validarApellido(valor) { return validarNombre(valor); }
    function validarDNI(valor) {
      if (!valor || !valor.trim()) return { ok: false, msg: 'DNI obligatorio' };
      const re = /^\d{7,8}$/;
      if (!re.test(valor.trim())) return { ok: false, msg: 'DNI debe tener 7 u 8 dígitos' };
      return { ok: true, msg: null };
    }
    function validarEmail(valor) {
      if (!valor || !valor.trim()) return { ok: false, msg: 'Email obligatorio' };
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(valor.trim())) return { ok: false, msg: 'Email con formato inválido' };
      return { ok: true, msg: null };
    }
    function validarTelefono(valor) {
      if (!valor || !valor.trim()) return { ok: false, msg: 'Teléfono obligatorio' };
      const digits = (valor.match(/\d/g) || []).length;
      if (digits < 8) return { ok: false, msg: 'Teléfono: mínimo 8 dígitos' };
      const re = /^[\d+\-\s()]+$/;
      if (!re.test(valor.trim())) return { ok: false, msg: 'Teléfono contiene caracteres inválidos' };
      return { ok: true, msg: null };
    }
    function validarNacimiento(valor) {
      if (!valor) return { ok: false, msg: 'Fecha de nacimiento obligatoria' };
      const fecha = new Date(valor);
      const hoy = new Date();
      if (fecha > hoy) return { ok: false, msg: 'Fecha no puede ser futura' };
      const age = Math.floor((hoy - fecha) / (365.25 * 24 * 3600 * 1000));
      if (age < 0 || age > 120) return { ok: false, msg: 'Edad inválida' };
      return { ok: true, msg: null };
    }
  
    function validarEspecialidad(valor) {
      if (!valor) return { ok: false, msg: 'Seleccione una especialidad' };
      return { ok: true, msg: null };
    }
    function validarMedico(valor) {
      if (!valor) return { ok: false, msg: 'Seleccione un médico' };
      return { ok: true, msg: null };
    }
    function validarTipoConsulta(valor) {
      if (!valor) return { ok: false, msg: 'Seleccione tipo de consulta' };
      return { ok: true, msg: null };
    }
  
    function validarFechaTurno(fechaVal, horaVal) {
      if (!fechaVal) return { ok: false, msg: 'Fecha del turno obligatoria' };
      if (!horaVal) return { ok: false, msg: 'Hora del turno obligatoria' };
      const [h, m] = horaVal.split(':').map(Number);
      const turnDate = new Date(fechaVal);
      turnDate.setHours(h, m, 0, 0);
      const now = new Date();
      const diffMs = turnDate - now;
      if (diffMs < 24 * 3600 * 1000) return { ok: false, msg: 'El turno debe solicitarse con al menos 24 horas de anticipación' };
      const day = turnDate.getDay(); // 0 domingo, 6 sabado
      if (day === 0 || day === 6) return { ok: false, msg: 'El turno debe ser día hábil (Lun-Vie)' };
      return { ok: true, msg: null };
    }
    function validarHoraTurno(horaVal) {
      if (!horaVal) return { ok: false, msg: 'Hora del turno obligatoria' };
      const [h, m] = horaVal.split(':').map(Number);
      if (h < 8 || (h > 20) || (h === 20 && m > 0)) return { ok: false, msg: 'Horario disponible: 08:00 - 20:00' };
      return { ok: true, msg: null };
    }
    function validarModalidad(valor) {
      if (!valor) return { ok: false, msg: 'Seleccione modalidad' };
      return { ok: true, msg: null };
    }
    function validarPlataforma(valor) {
      if (!valor) return { ok: false, msg: 'Seleccione plataforma' };
      return { ok: true, msg: null };
    }
  
    function validarCobertura(valor) {
      if (!valor) return { ok: false, msg: 'Seleccione cobertura' };
      return { ok: true, msg: null };
    }
    function validarNumCredencial(valor) {
      if (!valor || !valor.trim()) return { ok: false, msg: 'Número de credencial obligatorio' };
      if (valor.trim().length < 5) return { ok: false, msg: 'Mínimo 5 caracteres' };
      return { ok: true, msg: null };
    }
    function validarPlan(valor) {
      if (!valor || !valor.trim()) return { ok: false, msg: 'Plan obligatorio' };
      return { ok: true, msg: null };
    }
  
    function validarComo(valor) {
      if (!valor) return { ok: false, msg: 'Seleccione cómo nos conoció' };
      return { ok: true, msg: null };
    }
    function validarMotivo(valor) {
      if (!valor || valor.trim().length < 20) return { ok: false, msg: 'Motivo mínimo 20 caracteres' };
      return { ok: true, msg: null };
    }
    function validarDescEstudios(valor) {
      if (!valor || valor.trim().length < 20) return { ok: false, msg: 'Descripción mínima 20 caracteres' };
      return { ok: true, msg: null };
    }
  
    // Validar todos los campos aplicando clases y mensajes
    function validarTodos() {
      const errores = [];
  
      // Seccion 1
      const rNombre = validarNombre(nombre.value);
      applyFieldStatus(nombre, rNombre.ok, rNombre.msg);
      if (!rNombre.ok) errores.push(nombre);
  
      const rApellido = validarApellido(apellido.value);
      applyFieldStatus(apellido, rApellido.ok, rApellido.msg);
      if (!rApellido.ok) errores.push(apellido);
  
      const rDni = validarDNI(dni.value);
      applyFieldStatus(dni, rDni.ok, rDni.msg);
      if (!rDni.ok) errores.push(dni);
  
      const rEmail = validarEmail(email.value);
      applyFieldStatus(email, rEmail.ok, rEmail.msg);
      if (!rEmail.ok) errores.push(email);
  
      const rTel = validarTelefono(telefono.value);
      applyFieldStatus(telefono, rTel.ok, rTel.msg);
      if (!rTel.ok) errores.push(telefono);
  
      const rNac = validarNacimiento(nacimiento.value);
      applyFieldStatus(nacimiento, rNac.ok, rNac.msg);
      if (!rNac.ok) errores.push(nacimiento);
  
      // Seccion 2
      const rEsp = validarEspecialidad(especialidad.value);
      applyFieldStatus(especialidad, rEsp.ok, rEsp.msg);
      if (!rEsp.ok) errores.push(especialidad);
  
      // Medico solo si habilitado (visible)
      if (!medico.disabled) {
        const rMed = validarMedico(medico.value);
        applyFieldStatus(medico, rMed.ok, rMed.msg);
        if (!rMed.ok) errores.push(medico);
      }
  
      const rTipo = validarTipoConsulta(tipo_consulta.value);
      applyFieldStatus(tipo_consulta, rTipo.ok, rTipo.msg);
      if (!rTipo.ok) errores.push(tipo_consulta);
  
      const rFecha = validarFechaTurno(fecha_turno.value, hora_turno.value);
      applyFieldStatus(fecha_turno, rFecha.ok, rFecha.msg);
      if (!rFecha.ok) errores.push(fecha_turno);
  
      const rHora = validarHoraTurno(hora_turno.value);
      applyFieldStatus(hora_turno, rHora.ok, rHora.msg);
      if (!rHora.ok) errores.push(hora_turno);
  
      const rModal = validarModalidad(modalidad.value);
      applyFieldStatus(modalidad, rModal.ok, rModal.msg);
      if (!rModal.ok) errores.push(modalidad);
  
      if (!plataforma.disabled && !plataformaWrap.classList.contains('hidden')) {
        const rPlat = validarPlataforma(plataforma.value);
        applyFieldStatus(plataforma, rPlat.ok, rPlat.msg);
        if (!rPlat.ok) errores.push(plataforma);
      }
  
      // Seccion 3
      const rCob = validarCobertura(cobertura.value);
      applyFieldStatus(cobertura, rCob.ok, rCob.msg);
      if (!rCob.ok) errores.push(cobertura);
  
      if (!num_credencial.disabled && !credWrap.classList.contains('hidden')) {
        const rCred = validarNumCredencial(num_credencial.value);
        applyFieldStatus(num_credencial, rCred.ok, rCred.msg);
        if (!rCred.ok) errores.push(num_credencial);
      }
  
      if (!plan.disabled && !planWrap.classList.contains('hidden')) {
        const rPlan = validarPlan(plan.value);
        applyFieldStatus(plan, rPlan.ok, rPlan.msg);
        if (!rPlan.ok) errores.push(plan);
      }
  
      // Seccion 4
      if (!como.disabled && !como_wrap.classList.contains('hidden')) {
        const rComo = validarComo(como.value);
        applyFieldStatus(como, rComo.ok, rComo.msg);
        if (!rComo.ok) errores.push(como);
      }
  
      const rMot = validarMotivo(document.getElementById('motivo').value);
      applyFieldStatus(document.getElementById('motivo'), rMot.ok, rMot.msg);
      if (!rMot.ok) errores.push(document.getElementById('motivo'));
  
      if (!desc_estudios.disabled && !desc_estudios_wrap.classList.contains('hidden')) {
        const rDesc = validarDescEstudios(desc_estudios.value);
        applyFieldStatus(desc_estudios, rDesc.ok, rDesc.msg);
        if (!rDesc.ok) errores.push(desc_estudios);
      }
  
      return errores;
    }
  
    // submit handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errores = validarTodos();
      if (errores.length > 0) {
        // focus / scroll to first invalid
        const first = errores[0];
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        first.focus();
        return;
      }
  
      // todos validos -> generar confirmacion
      const num = 'TURN-' + Math.floor(10000 + Math.random() * 90000);
      const nombrePaciente = nombre.value.trim() + ' ' + apellido.value.trim();
      const esp = especialidad.value;
      const fecha = fecha_turno.value;
      const hora = hora_turno.value;
  
      // crear mensaje de confirmacion en pantalla (simple)
      const mensaje = document.createElement('div');
      mensaje.style.position = 'fixed';
      mensaje.style.left = '50%';
      mensaje.style.top = '8%';
      mensaje.style.transform = 'translateX(-50%)';
      mensaje.style.zIndex = 9999;
      mensaje.style.background = '#fff';
      mensaje.style.border = '1px solid #e6e9ee';
      mensaje.style.padding = '16px 20px';
      mensaje.style.borderRadius = '10px';
      mensaje.style.boxShadow = '0 12px 40px rgba(2,6,23,0.12)';
      mensaje.innerHTML = `
        <strong>Turno confirmado</strong>
        <p>${nombrePaciente} — ${esp}</p>
        <p>Fecha: ${fecha} — Hora: ${hora}</p>
        <p>Número de turno: <strong>${num}</strong></p>
        <div style="text-align:right;margin-top:8px;">
          <button id="closeConfirm" style="padding:8px 12px;border-radius:8px;border:none;background:#0ea5e9;color:#fff;cursor:pointer">Cerrar</button>
        </div>
      `;
      document.body.appendChild(mensaje);
      document.getElementById('closeConfirm').addEventListener('click', () => mensaje.remove());
  
      // opcional: limpiar formulario
      // form.reset();
    });
  
    // Validaciones en blur para feedback en vivo
    [['blur', nombre, () => validarNombre(nombre.value)],
     ['blur', apellido, () => validarApellido(apellido.value)],
     ['blur', dni, () => validarDNI(dni.value)],
     ['blur', email, () => validarEmail(email.value)],
     ['blur', telefono, () => validarTelefono(telefono.value)],
     ['change', nacimiento, () => validarNacimiento(nacimiento.value)],
     ['change', especialidad, () => validarEspecialidad(especialidad.value)],
     ['change', medico, () => validarMedico(medico.value)],
     ['change', tipo_consulta, () => validarTipoConsulta(tipo_consulta.value)],
     ['change', fecha_turno, () => validarFechaTurno(fecha_turno.value, hora_turno.value)],
     ['change', hora_turno, () => validarHoraTurno(hora_turno.value)],
     ['change', modalidad, () => validarModalidad(modalidad.value)],
     ['change', plataforma, () => validarPlataforma(plataforma.value)],
     ['change', cobertura, () => validarCobertura(cobertura.value)],
     ['blur', num_credencial, () => validarNumCredencial(num_credencial.value)],
     ['blur', plan, () => validarPlan(plan.value)],
     ['change', como, () => validarComo(como.value)],
     ['blur', document.getElementById('motivo'), () => validarMotivo(document.getElementById('motivo').value)],
     ['blur', desc_estudios, () => validarDescEstudios(desc_estudios.value)]
    ].forEach(([evt, field, fn]) => {
      if (!field) return;
      field.addEventListener(evt, () => {
        const res = fn();
        applyFieldStatus(field, res.ok, res.msg);
      });
    });
  
  });