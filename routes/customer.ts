import { Router } from 'express';
import { CustomerService } from '../services/customer';
import { mustBeCustomer } from '../middleware/user_middleware';

export const customerRouter = Router();
customerRouter.use(mustBeCustomer);

customerRouter.get('/profile', (req, res: any) => {
    if(req.user) {
        res.send({ success: true, result: req.user })
    } else{
        let id = req.query.idUser;
        CustomerService.profile(id)
        .then(customer => {
            delete customer.dataValues.password;
            res.send({ success: true, result: customer })
        })
        .catch(res.onError);
    }
});

customerRouter.put('/change-info', (req, res: any) => {
    let id = req.query.idUser;
    CustomerService.changeInfo(id, req.body)
    .then(customer => { 
        res.send({ success: true, result: customer })
    })
    .catch(res.onError); 

});

customerRouter.put('/change-password',  (req, res: any) => {
    let id = req.query.idUser;
    CustomerService.changePassword(id, req.body)
    .then(customer => {
        res.send({ success: true, result: customer })
    })
    .catch(res.onError); 
})