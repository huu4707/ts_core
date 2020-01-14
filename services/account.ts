import { mustExist, makeSure, mustMatchReg } from '../utils/asserts';
import { Customer, ForgotPassword } from '../database/sequelize';
import { hash, compare } from 'bcryptjs';
import { createToken } from '../utils/jwt';
import { ForgotPasswordService } from '../services/forgot-password';
import { sendMailTokenResetPassword } from '../utils/emailHelper'
import moment from 'moment'

export interface AccountInput {
    name: string;
    email: string;
    password: string;
    sex: string;
    dob: string;
    phone: string;
}

export interface loginInput {
    email: string;
    password: string;
}

export interface ChangePasswordInput {
    token: string,
    newPassword: string;
    retypePassword: string;
}

export class AccountService {
    static errors = {
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
        TOKEN_IS_EXIST: 'Token is exist',
        PASSWORD_INVALID: 'Password invalid',
        SEX_INVALID:"Gender invalid"
    }
    public static async validate(accountInput: AccountInput) {
        mustExist(accountInput.name, this.errors.NAME_MUST_BE_PROVIDED);
        mustExist(accountInput.email, this.errors.EMAIL_MUST_BE_PROVIDED);
        mustExist(accountInput.password, this.errors.PASSWORD_MUST_BE_PROVIDED);
        mustExist(accountInput.phone, this.errors.PHONE_MUST_BE_PROVIDED);
        mustExist(accountInput.sex, this.errors.SEX_MUST_BE_PROVIDED);
        let listSex = ["NAM", "NU"];
        makeSure(listSex.includes(accountInput.sex), this.errors.SEX_INVALID);
        mustExist(accountInput.dob, this.errors.DOB_MUST_BE_PROVIDED);
        mustMatchReg(accountInput.password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, this.errors.PASSWORD_INVALID)
        const existEmail = await Customer.findOne({where: {email: accountInput.email} });
        mustExist(!existEmail, this.errors.EMAIL_IS_EXIST);
        const existPhone = await Customer.findOne({where: {phone: accountInput.phone }});
        mustExist(!existPhone, this.errors.PHONE_IS_EXIST);
    }
    public static async create(accountInput: AccountInput){
        await this.validate(accountInput);
        accountInput.password = await hash(accountInput.password, 8);
        return Customer.create(accountInput);
    }

    public static async validateLogin(loginInput: loginInput) {
        mustExist(loginInput.email, this.errors.EMAIL_MUST_BE_PROVIDED);
        mustExist(loginInput.password, this.errors.PASSWORD_MUST_BE_PROVIDED);
    }

    public static async login(loginInput: loginInput){
        await this.validateLogin(loginInput);
        const customer = await Customer.findOne({where: { email: loginInput.email}});
        mustExist(customer, this.errors.INFO_INVALID);
        const match = await compare(loginInput.password, customer.password);
        makeSure(match, this.errors.INFO_INVALID);
        const token = await createToken({ id: customer.id });
        customer.dataValues.token = token;
        return customer;
    }

    public static async forgotPassword(email: string) {
        mustExist(email, this.errors.EMAIL_MUST_BE_PROVIDED);
        let customer = await Customer.findOne({ where: { email }})
        makeSure(customer, this.errors.EMAIL_NOT_FOUND);
        let forgotPassword = await ForgotPasswordService.generateTokenResetPassword(customer);
        makeSure(forgotPassword, this.errors.GENERATE_TOKEN_FAILED);
        let token = forgotPassword.token
        let resultSendMail:any =  sendMailTokenResetPassword(email, customer.dataValues.name, token);
        return true
    }

    public static async validateChangePassword(changePasswordInput: ChangePasswordInput) {
        mustExist(changePasswordInput.token, this.errors.TOKEN_MUST_BE_PROVIDED);
        mustMatchReg(changePasswordInput.newPassword, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, this.errors.PASSWORD_INVALID)
        mustExist(changePasswordInput.newPassword, this.errors.NEW_PASSWORD_MUST_BE_PROVIDED);
        let check = changePasswordInput.newPassword === changePasswordInput.retypePassword;
        makeSure(check, this.errors.RETYPE_PASSWORD_INVALID);
    }
    public static async changePassword(changePasswordInput: ChangePasswordInput) {
        await this.validateChangePassword(changePasswordInput)
        let info = await ForgotPassword.findOne({
            where: { token: changePasswordInput.token },
            include: [{
                model: Customer,
            }]
        })
        makeSure(info, this.errors.TOKEN_IS_EXIST);
        makeSure((moment(info.expired).valueOf() > moment().valueOf()), 'Generate password is expired! Please try click forgot password again');
        let customer = info.customer;
        return await Customer.update({password: await hash(changePasswordInput.newPassword, 8)}, { where: { id: customer.id}});
    }
}