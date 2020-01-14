import { mustExist, makeSure,mustMatchReg } from '../utils/asserts';
import { Customer } from '../database/sequelize';
import { Op } from 'sequelize'
import { hash, compare } from 'bcryptjs';

export interface CustomerInput {
    name: string;
    email: string;
    sex: string;
    dob: string;
    phone: string;
}
export class CustomerService {
    static errors = {
        CUSTOMER_NOT_FOUND: 'Customer not found',
        CUSTOMER_MUST_BE_PROVIDED: 'Customer must be provided',
        NAME_MUST_BE_PROVIDED: 'Name must be provided',
        EMAIL_MUST_BE_PROVIDED: 'Email must be provided',
        PASSWORD_MUST_BE_PROVIDED: 'Password must be provided',
        SEX_MUST_BE_PROVIDED: 'Sex must be provided',
        PHONE_MUST_BE_PROVIDED: 'Phone must be provided',
        DOB_MUST_BE_PROVIDED: 'dob must be provided',
        EMAIL_IS_EXIST: 'Email is exist',
        PHONE_IS_EXIST: 'Phone is exist',
        INFO_INVALID: 'Info invalid',
        NEW_PASSWORD_MUST_BE_PROVIDED: 'New password must be provided',
        RETYPE_PASSWORD_INVALID: 'Retype password is not valid',
        EMAIL_NOT_FOUND: 'Email not found',
        GENERATE_TOKEN_FAILED: "Generate token failed",
        TOKEN_MUST_BE_PROVIDED: 'Token must be provided',
        TOKEN_IS_EXIST: 'token is exist',
        PASSWORD_INVALID: 'Password invalid'
    }
    public static async profile(id : string){
        mustExist(id, this.errors.CUSTOMER_MUST_BE_PROVIDED, 400);
        let customer = Customer.findOne({ where: { id: id }})
        makeSure(customer, this.errors.CUSTOMER_NOT_FOUND, 404);
        return customer;
    }

    public static async validateChangeInfo(id: string, customerInput: CustomerInput) {
        const customer = await Customer.findOne({where: {id }});
        makeSure(customer, this.errors.CUSTOMER_NOT_FOUND, 404);
        mustExist(customerInput.name, this.errors.NAME_MUST_BE_PROVIDED);
        mustExist(customerInput.email, this.errors.EMAIL_MUST_BE_PROVIDED);
        mustExist(customerInput.phone, this.errors.PHONE_MUST_BE_PROVIDED);
        mustExist(customerInput.sex, this.errors.SEX_MUST_BE_PROVIDED);
        mustExist(customerInput.dob, this.errors.DOB_MUST_BE_PROVIDED);
        const existEmail = await Customer.findOne({where: {email: customerInput.email, id: { [Op.ne]: id } } });
        mustExist(!existEmail, this.errors.EMAIL_IS_EXIST);
        const existPhone = await Customer.findOne({where: {phone: customerInput.phone, id: { [Op.ne]: id } }});
        mustExist(!existPhone, this.errors.PHONE_IS_EXIST);
    }

    public static async changeInfo(id: string,customerInput: CustomerInput ) {
        await this.validateChangeInfo(id, customerInput);
        return await Customer.update(customerInput,{ plain: true, where: { id: id } });
    }

    public static async validateChangePassword(id: string, newPassword: string, retypePassword: string) {
        const customer = await Customer.findOne({where: {id }});
        makeSure(customer, this.errors.CUSTOMER_NOT_FOUND, 404);
        mustExist(newPassword, this.errors.PASSWORD_MUST_BE_PROVIDED);
        mustMatchReg(newPassword, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, this.errors.PASSWORD_INVALID)
        mustExist(newPassword === retypePassword, 'Retype password is not valid');
    }

    public static async changePassword(id: string, body: any) {
        let { newPassword, retypePassword } = body;
        await this.validateChangePassword(id, newPassword, retypePassword);
        return await Customer.update({password: await hash(newPassword, 8)}, { where: { id: id}});
    }
}
