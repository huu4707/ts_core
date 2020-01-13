import { mustExist, makeSure } from '../utils/asserts';
import { Customer } from '../database/sequelize';


export class CustomerService {
    static errors = {
        CUSTOMER_NOT_FOUND: 'Customer not found',
        CUSTOMER_MUST_BE_PROVIDED: 'Customer must be provided',
    }
    public static async profile(id : string){
        mustExist(id, this.errors.CUSTOMER_MUST_BE_PROVIDED, 400);
        let customer = Customer.findOne({ where: { id: id }})
        makeSure(customer, this.errors.CUSTOMER_NOT_FOUND, 404);
        return customer;
    }
}