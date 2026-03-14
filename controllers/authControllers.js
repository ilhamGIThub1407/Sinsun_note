const authModel = require('../models/authModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class authController {
    login = async (req, res) => {
        const { email, password } = req.body

        if (!email) {
            return res.status(404).json({ message: 'Please provide your email' })
        }
        if (!password) {
            return res.status(404).json({ message: 'Please provide your password' })
        }

        try {
            const user = await authModel.findOne({ email }).select('+password')
            if (user) {
                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    const obj = {
                        id: user.id,
                        name: user.name,
                        category: user.category,
                        role: user.role
                    }
                    const token = await jwt.sign(obj, process.env.secret, {
                        expiresIn: process.env.exp_time
                    })
                    return res.status(200).json({ message: 'login success', token })
                } else {
                    return res.status(404).json({ message: 'invalid password' })
                }
            } else {
                return res.status(404).json({ message: 'user not found' })
            }
        } catch (error) {
            console.log(error)
        }

    }

    add_writer = async (req, res) => {

        const { email, name, password, category } = req.body

        if (!name) {
            return res.status(404).json({ message: 'please provide name' })
        }
        if (!password) {
            return res.status(404).json({ message: 'please provide password' })
        }
        if (!category) {
            return res.status(404).json({ message: 'please provide category' })
        }
        if (!email) {
            return res.status(404).json({ message: 'please provide email' })
        }
        if (email && !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            return res.status(404).json({ message: 'please provide valid email' })
        }
        try {
            const writer = await authModel.findOne({ email: email.trim() })
            if (writer) {
                return res.status(404).json({ message: 'User already exists' })
            } else {
                const new_writer = await authModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password.trim(), 10),
                    plainPassword: password.trim(),
                    category: category.trim(),
                    role: 'writer'
                })
                return res.status(201).json({ message: 'writer add success', writer: new_writer })
            }
        } catch (error) {
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    get_writers = async (req, res) => {
        try {
            const writers = await authModel.find({ role: "writer" }).sort({ createdAt: -1 })
            return res.status(200).json({ writers })
        } catch (error) {
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    get_single_writer = async (req, res) => {
        try {
            const { writer_id } = req.params
            const writer = await authModel.findById(writer_id).select('+password +plainPassword')
            if (!writer) {
                return res.status(404).json({ message: 'Writer not found' })
            }
            return res.status(200).json({ writer })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'internal server error' })
        }
    }

    delete_writer = async (req, res) => {
        try {
            const { role } = req.userInfo
            const { writer_id } = req.params

            // Check if user is admin
            if (role !== 'admin') {
                return res.status(403).json({ message: 'You cannot access this api' })
            }

            const writer = await authModel.findById(writer_id)
            if (!writer) {
                return res.status(404).json({ message: 'Writer not found' })
            }

            // Delete writer from database
            await authModel.findByIdAndDelete(writer_id)
            
            return res.status(200).json({ message: 'Writer deleted successfully' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'internal server error' })
        }
    }
}

module.exports = new authController()