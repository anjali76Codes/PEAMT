import User from '../models/user.model.js';
import Admin from '../models/admin.model.js';
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
};

const authenticateUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (user && bcryptjs.compareSync(password, user.password)) {
        return { user, isAdmin: false };
    }

    const admin = await Admin.findOne({ email });
    if (admin && bcryptjs.compareSync(password, admin.password)) {
        return { user: admin, isAdmin: true };
    }

    return null;
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const authResult = await authenticateUser(email, password);
        if (!authResult) return next(errorHandler(401, 'Wrong credentials'));

        const { user, isAdmin } = authResult;
        const token = jwt.sign({ id: user._id, isAdmin }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = user._doc;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour

        res
            .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json({ ...rest, isAdmin });
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: hashedPassword, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour
            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    expires: expiryDate,
                })
                .status(200)
                .json(rest);
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                    req.body.name.split(' ').join('').toLowerCase() +
                    Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: hashedPassword2, ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour
            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    expires: expiryDate,
                })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};


export const signout = (req, res) => {
    res.clearCookie('access_token').status(200).json({ message: " Signed out successfully" })

}

export const getUserIdByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ userId: user._id });
    } catch (error) {
        next(error);
    }
};