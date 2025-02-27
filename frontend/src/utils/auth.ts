export interface AuthResponse {
    token: string;
  }
  
  export async function signupUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthResponse> {
    const response = await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, display_name: displayName }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  
    return response.json();
  }
  
  export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  
    return response.json();
  }
  