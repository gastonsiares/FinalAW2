import { Router } from "express"
import { readFile, writeFile } from 'fs/promises' 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url'

const router = Router()
const SECRET = "CWBj4eQ9HnI59YttGKMhXJOZByri63tMZf2jLXKmIFi6IoPShLcB7WyyVfkaoOEL"

// para resolver __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const filePath = path.resolve(__dirname, '../data/users.json')

//LOGIN
router.post('/login', async (req, res) => {
    const { userName, pass } = req.body
    const raw = await readFile(filePath, 'utf-8')
    const users = JSON.parse(raw)

    const user = users.find(u => u.username === userName)
    if (!user) return res.status(404).json({ status: false, msg: 'Usuario no encontrado' })

    const ok = bcrypt.compareSync(pass, user.pass)
    if (!ok) return res.status(401).json({ status: false, msg: 'Contraseña incorrecta' })

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '24h' })
    res.status(200).json({ token, status: true })
})

//REGISTRO
router.post('/register', async (req, res) => {
    try {
        const { name, lastname, username, pass } = req.body
        const raw = await readFile(filePath, 'utf-8')
        const users = JSON.parse(raw)

        // evitar duplicados
        if (users.find(u => u.username === username)) {
            return res.status(409).json({ status: false, msg: 'El usuario ya existe' })
        }

        const hashedPass = bcrypt.hashSync(pass, 8)
        const id = users.length > 0 ? users[users.length - 1].id + 1 : 1
        const nuevo = { name, lastname, username, pass: hashedPass, id }

        users.push(nuevo)
        await writeFile(filePath, JSON.stringify(users, null, 2))

        res.status(201).json({ status: true, msg: 'Usuario registrado' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ status: false, msg: 'Error al registrar usuario' })
    }
})
router.post('/decodeToken', (req, res) => {
    const { token } = req.body
    try {
        const decoded = jwt.verify(token, SECRET)
        res.status(200).json(decoded)
    } catch (err) {
        res.status(401).json({ status: false, msg: 'Token inválido' })
    }
})


export default router
