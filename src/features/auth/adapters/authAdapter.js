export function adaptAuthResponse(response) {
  const payload = response?.data ?? response ?? {};
  return {
    token: payload.token ?? payload.access_token ?? null,
    user: payload.user ?? payload.usuario ?? null,
    role: payload.role ?? payload.rol ?? null,
  };
}
