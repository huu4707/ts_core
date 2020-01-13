export function CustomerModel(sequelize: any, type: any) {
    return sequelize.define('customer', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: { type: type.STRING,  allowNull: false },
        email: { type: type.STRING,  allowNull: false },
        password: { type: type.STRING,  allowNull: false },
        sex: { type: type.STRING,  allowNull: false, comment: "NAM: nam, NU: nữ" },
        phone: { type: type.STRING,  allowNull: false },
        dob: { type: type.DATE,  allowNull: false },
    })
}

