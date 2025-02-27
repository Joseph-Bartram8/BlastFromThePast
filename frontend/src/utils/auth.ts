export async function signupUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  displayName: string
): Promise<void> {
  const response = await fetch("http://localhost:8080/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      display_name: displayName,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
}

export async function loginUser(email: string, password: string): Promise<void> {
  const response = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
}

export async function logoutUser(): Promise<void> {
  await fetch("http://localhost:8080/logout", {
    method: "POST",
    credentials: "include",
  });

  localStorage.removeItem("auth_user"); // Optional: Remove any stored user data
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.reload();
}
