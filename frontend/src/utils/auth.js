import { BASE_URL } from "./variables.js";

export const signup = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          if (
            response.status === 400 &&
            data.error === "User with this email address already exists"
          ) {
            throw new Error("El correo ya está registrado.");
          } else if (response.status === 400) {
            throw new Error(
              data.error || "Uno de los campos se rellenó de forma incorrecta"
            );
          } else {
            throw new Error(
              data.error || "Uno de los campos se rellenó de forma incorrecta."
            );
          }
        });
      }
      return response.json();
    })

    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error durante el registro:", error.message);
      throw error;
    });
};

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  })
    .then((response) =>
      response.json().then((data) => {
        if (response.status === 400) {
          throw new Error(
            response.body.error || "No se ha proporcionado uno o más campos"
          );
        }
        if (response.status === 401) {
          throw new Error(
            response.body.error ||
              "No se encontró un usuario con este correo electrónico"
          );
        }
        if (data.token) {
          return data;
        } else {
          throw new Error("Token not found");
        }
      })
    )
    .catch((error) => {
      console.error("Error during login:", error.message);
      throw error;
    });
};

export const validateToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          if (response.status === 400) {
            throw new Error(
              "Token no proporcionado o proporcionado en el formato incorrecto"
            );
          } else if (response.status === 401) {
            throw new Error("El token provisto es inválido");
          } else {
            throw new Error(data.error);
          }
        });
      }
      return response.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Token validation failed:", error);
      throw error;
    });
};
