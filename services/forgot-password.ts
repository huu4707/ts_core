import { mustExist, makeSure } from '../utils/asserts';
import { ForgotPassword } from '../database/sequelize';
import generator from 'generate-password'
import md5 from 'md5';
import moment from 'moment';

export class ForgotPasswordService {
   public static async generateTokenResetPassword(customer: any) {
    var token = generator.generate({
        length: 10,
        numbers: true,
      });        
      token = md5(token)
      let expired = moment().add(5, 'm').toDate();// 5p
      return await ForgotPassword.create({token, expired, customerId : customer.id})
   }
}