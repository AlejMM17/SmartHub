import Cookies from "js-cookie"

// Funcion para guardar en las cookies nuestro user por 7 dias
export const setAuthCookie = (user) => {
    Cookies.set('user', JSON.stringify(user), { expires: 7 })
}
