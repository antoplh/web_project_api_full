const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

// Obtener todos los usuarios
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Crear un nuevo usuario
const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    // Verificar si el email ya está en uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Evitar devolver la contraseña en la respuesta
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
    };

    res.status(201).json(userResponse);
  } catch (err) {
    next(err);
  }
};

// Iniciar sesión de usuario
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario y traer explícitamente el campo de contraseña
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar la contraseña proporcionada con la almacenada en la BD
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT con la clave secreta
    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

// Actualizar el perfil del usuario
const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id; // ID del usuario autenticado

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Actualizar el avatar del usuario
const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id; // ID del usuario autenticado

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
};
