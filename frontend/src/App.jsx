import { useState } from "react"

const Padre = ({ children }) => {

  return (
    <div>
      <p>hola que tal</p>
      { children }
    </div>
  )
}


const App = () => {

  // const [tareas, setTareas] = useState([
  //   {
  //     id: 0,
  //     name: "asdf",
  //     type: "hola",
  //   },
  //   {
  //     id: 1,
  //     name: "que tal",
  //     type: "hola",
  //   },
  //   {
  //     id: 2,
  //     name: "como estas",
  //     type: "hola",
  //   },
  //   {
  //     id: 3,
  //     name: "yeyyy",
  //     type: "hola",
  //   }
  // ])

  // const handleChageInput = (e) => {
  //   setInput(e.target.value)
  //   console.log(input)
  // }

  // const handleDelete = (id) => {
  //   return setTareas(
  //     tareas.filter(tarea => tarea.id !== id)
  //   )
  // }

  return (
    <>
      {/* <h1>contador: {count}</h1>
      <button onClick={() => setCount((prev) => prev + 1)}>Añade</button>
      <input type="text" value={input} onChange={handleChageInput} />
      <h1>{input}</h1> */}

      {/* {tareas.map((tarea) => {
        return (
          <div key={tarea.id} onClick={() => handleDelete(tarea.id)}>
            <p>{tarea.name}</p>
            <p>{tarea.type}</p>

          </div>
        )
      })} */}

      <Padre>
        <p>Hijo 1</p>
      </Padre>

      <Padre>
        <p>Hijo 2</p>
      </Padre>

      <Padre>
        <p>asñlkdfj</p>
      </Padre>
    </>
  )
}

export default App
