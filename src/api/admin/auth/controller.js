import models from "../../../models/index.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../user/service.js";

/**
 * @method POST
 * @description Admin Login
 */
export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await models.User.findOne({
            where: { email: email, role: "admin" }
        });

        if (!user) {
            return res.send({ status: false, message: "Admin not found or unauthorized" });
        }

        const verifyPassword = await bcrypt.compare(password, user.password);

        if (!verifyPassword) {
            return res.send({ status: false, message: "Incorrect Password" });
        }

        const token = generateToken(user);

        return res.send({
            status: true,
            message: "Admin Login Successful",
            Jwt_token: token
        });

    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
};
