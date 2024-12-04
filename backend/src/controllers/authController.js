const User = require("../models/User")

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email: email })


            if (!user) {
                return res.status(404).json({
                    message: `No se ha encontrado el usuario con el email: ${email}`
                });
            }


            if (user.password !== password) {
                return res.status(401).json({
                    message: "La contraseña es incorrecta"
                });
            }

            // Obtener el usuario sin la password
            const { password: _, ...userWithoutPassword } = user.toObject();

            if (user.email === email && user.password === password) {
                res.status(200).json({
                    message: "Login correcto",
                    user: userWithoutPassword
                })
            }
        } catch(e) {
            res.status(500).json({
                message: "Ha ocurrido un error en el servidor"
            })
        }
    },
}

module.exports = authController