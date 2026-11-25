const db = require('../models');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = db.User;

async function register(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email dan password wajib diisi' 
            });
        }

        const existingUser = await User.findOne({ 
            where: { email } 
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: 'Email sudah terdaftar' 
            });
        }

        const hashedPassword = await bycrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword
        });

        return res.status(201).json({ 
            message: 'Registrasi berhasil.', 
            data: { 
                id: user.id, 
                email: user.email 
            } 
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}