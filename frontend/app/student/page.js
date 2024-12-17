"use client"

import { useUser } from "../../context/UserContext"

export default function Page() {

    // Asi es como se obtiene el user de nuestro context
    const { user } = useUser()

  return (
    <>
        <h1>Students Page</h1>
        <div>
            {/* El user?.name es para comprobar que exista el user o que no sea null para que no pete la app */}
            <p>{ user?.name }</p>
        </div>
    </>
  )
}
