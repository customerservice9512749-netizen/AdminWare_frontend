import logoAdminware from '../../../assets/logoAdminware.png';
import AuthBackground from '../components/AuthBackground';
import LoginForm from '../components/LoginForm';
import useLoginForm from '../hooks/useLoginForm';

export default function LoginPage({ onLoginSuccess }) {
  const loginForm = useLoginForm(onLoginSuccess);
 
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans">
      <AuthBackground />

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="w-full max-w-md my-auto relative z-10 flex flex-col items-center">
        
        {/* Header con el Logo Real de AdminWare */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-28 h-28 mb-3 flex items-center justify-center">
            <img 
              src={logoAdminware} 
              alt="AdminWare Logo" 
              className="w-full h-full object-contain drop-shadow-lg transition-transform hover:scale-105"
            />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            ADMINWARE
          </h1>
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mt-1">
            SISTEMA DE GESTIÓN DE PRODUCTOS
          </p>
          <p className="text-sm text-slate-600 mt-4">
            Bienvenido de vuelta. Gestiona y optimiza tu negocio en un solo lugar.
          </p>
        </div>

        {/* Tarjeta de Formulario estilo Enterprise Clean */}
        <div className="w-full bg-white/85 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-slate-200/80 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-500/40 hover:shadow-emerald-500/10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Iniciar Sesión</h2>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          <LoginForm
            credentials={loginForm.credentials}
            showPassword={loginForm.showPassword}
            remember={loginForm.remember}
            onCredentialsChange={loginForm.handleCredentialsChange}
            onTogglePassword={loginForm.handleTogglePassword}
            onRememberChange={loginForm.handleRememberChange}
            onSubmit={loginForm.handleSubmit}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 relative z-10 my-2">
        © 2026 AdminWare Corp. Todos los derechos reservados. | Soporte | Términos de servicio
      </div>
    </div>
  );
}