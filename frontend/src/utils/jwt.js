export const getUsernameFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    // Decode base64 (JWT dùng base64url)
    const payloadJson = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
    );
    const payload = JSON.parse(payloadJson);

    return payload.sub || null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export const isGuest = () => {
  const username = getUsernameFromToken();
  if (!username) return false;

  return username.includes("guest_tenant");
};
