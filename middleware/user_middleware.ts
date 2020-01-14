import { Request, NextFunction } from 'express';
import { verifyLogInToken } from "../utils/jwt";
import { mustExist } from "../utils/asserts";
import { ServerError } from "../utils/server-error";
import { Customer } from "../database/sequelize";

export async function mustBeCustomer(req: Request, res: any, next: NextFunction) {
    if(req.user) {
        next()
    } else{
        try {
            let token = req.headers['authorization'] as string;
            if(token) {
                if (token.startsWith('Bearer ')) {
                    token = token.slice(7, token.length).trimLeft();
                    const { id } = await verifyLogInToken(token);
                    const customer = await Customer.findOne({where : { id }});
                    mustExist(customer, 'Customer not found', 404);
                    req.query.idUser = id;
                    next();
                } else{
                   throw new ServerError('Token invalid', 400); 
                }
            } else{
                throw new ServerError('Token invalid', 400); 
            }
        }
        catch (error) {
            res.onError(error);
        }
    }
}