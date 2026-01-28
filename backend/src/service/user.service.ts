import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ResponseError from "@/error/index.js";
import User from "@/model/user.model.js";
import { AccessTokenResponse, RequestBodyUserLogin, RequestBodyUserRegist, ResponseBody, Roles } from "@/types/index.js";

export default class UserService {
    constructor() {}

    public static async userRegist(reqBody: RequestBodyUserRegist): Promise<ResponseBody<User>> {
        if (!reqBody.password || !reqBody.roles) throw new ResponseError(400, 'requirement fields');

        const hashPassword = await bcrypt.hash(reqBody.password, 10);

        const user = await User.create({
            password: hashPassword,
            roles: reqBody.roles
        })

        return {
            statusCode: 200,
            message: 'OK',
            data: user
        }
    }

    public static async userLogin(reqBody: RequestBodyUserLogin): Promise<ResponseBody<AccessTokenResponse>> {
        const user = await User.findOne({
            where: {
                roles: reqBody.roles
            },
        })

        if (!user) throw new ResponseError(404, 'user roles not found');

        const compare = await bcrypt.compare(reqBody.password, user.password);

        if (!compare) throw new ResponseError(401, 'Wrong password');

        const accessToken = jwt.sign({ roles: user.roles }, 'ov_25');
        
        return {
            statusCode: 200,
            message: 'OK',
            data: {
                roles: user.roles,
                accessToken,
            }
        }
    }

    public static userCheck(roles: Roles): ResponseBody<{loggedIn: boolean, roles: Roles}> {
        if (roles === null) return {
            message: 'Error',
            statusCode: 401,
            data: {
                loggedIn: false,
                roles
            }
        }
        return {
            message: 'OK',
            statusCode: 200,
            data: {
                loggedIn: true,
                roles
            }
        }
    }

}