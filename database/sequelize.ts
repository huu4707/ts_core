import { Sequelize } from 'sequelize'
import { CustomerModel } from '../models/customer'
import { ForgotPasswordModel } from '../models/forgot_password'
import { HOST_DB, NAME_DB, USER_DB, PASSWORD_DB} from '../setting'


const sequelize = new Sequelize(NAME_DB, USER_DB, PASSWORD_DB, {
  host: HOST_DB,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const Customer = CustomerModel(sequelize, Sequelize)
const ForgotPassword = ForgotPasswordModel(sequelize, Sequelize)
ForgotPassword.belongsTo(Customer); 

sequelize.sync({ force: false })
  .then(async () => {
    console.log(`Database & tables created!`)
  })


export {
  Customer,
  ForgotPassword,
}