import { useState } from 'react';

export default function useLoginForm(onLoginSuccess) {
  const [credentials, setCredentials] = useState({ usuario: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleCredentialsChange = (field, value) => {
    setCredentials((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Iniciando sesión con:', credentials);
    onLoginSuccess?.();
  };

  return {
    credentials,
    showPassword,
    remember,
    handleCredentialsChange,
    handleTogglePassword: () => setShowPassword((current) => !current),
    handleRememberChange: setRemember,
    handleSubmit,
  };
}
