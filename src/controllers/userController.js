const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResponseAPI = require('../utils/response');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const env = require('../config/env');
const { imageUpload } = require('../utils/imageUtil');
const models = require('../models');


const generateToken = (user) => {
    const jwtPayload = {
        id: user._id,
        name: user.name,
        email: user.email
    }

    return jwt.sign(jwtPayload, jwtSecret, { expiresIn: jwtExpiresIn });
};

const userController = {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return ResponseAPI.error(res, 'Invalid email or password', 401);
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return ResponseAPI.error(res, 'Invalid email or password', 401);
            }

            const token = generateToken(user);

            ResponseAPI.success(res, {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    photo_url: user.photo_url,
                    role: user.role,
                    id_number: user.id_number,
                    registration_status: user.registration_status
                }
            });
        } catch (error) {
            next(error)
        }
    },

    async getProfile(req, res, next) {
        try {
            const user = await User.findById(req.user._id).select('-password');
            ResponseAPI.success(res, user);
        } catch (error) {
            next(error)
        }
    },

    async getAll(req, res, next) {
        try {
            const user = await User.find();
            ResponseAPI.success(res, user);
        } catch (error) {
            next(error)
        }
    },



    async updateProfile(req, res, next) {
        try {
            const { name, email, password, id_number } = req.body;

            const user = await User.findById(req.user._id)

            // Handle image upload if file exists
            if (req.file) {
                const urlUploadResult = await imageUpload(req.file)

                user.photo_url = urlUploadResult
            }

            // Update other fields if provided
            if (password) {
                user.password = password;
            }
            if (name) {
                user.name = name;
            }
            if (email) {
                user.email = email;
            }

            if (id_number) {
                user.id_number = id_number;
            }

            await user.save();

            ResponseAPI.success(res, null);
        } catch (error) {
            // Clean up uploaded file if exists
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            next(error);
        }
    },

    async register(req, res, next) {
        try {

            const user = await User.create(
                {
                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email,
                    id_number: req.body.id_number
                }
            );

            await models.notifications.create({
                title: 'Akun Officer Baru',
                content: 'Akun Officer telah dibuat dan menunggu approval',
                user_id: user._id,
                role_type: 'MANAGER',
                is_read: false,
                qc_report_id: null,
                notification_type: 'REGISTRATION'
              });

            ResponseAPI.success(res, user);
        } catch (error) {
            next(error)
        }
    },

    async updateApprovalStatus(req, res, next) {
        try {
            const { userId } = req.params;
            const { status } = req.body;

            // Validate status
            if (!['APPROVED', 'REJECTED'].includes(status)) {
                return ResponseAPI.error(res, 'Invalid approval status', 400);
            }

            const user = await User.findById(userId);
            if (!user) {
                return ResponseAPI.error(res, 'User not found', 404);
            }

            user.registration_status = status;
            await user.save();

            ResponseAPI.success(res, {
                message: `User ${status} successfully`,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    registration_status: user.registration_status
                }
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = userController;