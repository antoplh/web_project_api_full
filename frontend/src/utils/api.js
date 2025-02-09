import { BASE_URL } from "./variables.js";

class Api {
  constructor() {
    this._baseUrl = BASE_URL;
    this._headers = {};
  }

  // Método para establecer (o actualizar) el token
  setToken(token) {
    this._headers.authorization = `Bearer ${token}`;
  }

  _checkResponse(response) {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`Error: ${response.status}.`);
  }

  _request(endpoint, method, body = null) {
    const config = {
      method: method,
      headers: {
        // Se incluyen los headers almacenados (por ejemplo, authorization)
        ...this._headers,
        // Si hay body, se añade el Content-Type
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      // Si hay body, se lo convierte a JSON
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    return fetch(`${this._baseUrl}/${endpoint}`, config).then((res) =>
      this._checkResponse(res)
    );
  }

  // Funciones existentes
  changeLikeCardStatus(cardId, isLiked) {
    return this._request(`cards/${cardId}/likes`, isLiked ? "PUT" : "DELETE");
  }

  deleteCard(cardId) {
    return this._request(`cards/${cardId}`, "DELETE");
  }

  setUserInfo(data) {
    return this._request("users/me", "PATCH", data);
  }

  getUserInfo() {
    return this._request("users/me", "GET");
  }

  getCards() {
    return this._request("cards", "GET");
  }

  setUserAvatar(data) {
    return this._request("users/me/avatar", "PATCH", { avatar: data.avatar });
  }

  addCard(data) {
    return this._request("cards", "POST", data);
  }
}

const api = new Api();
export default api;
