module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING(50),
            allowNull: false
        },
        password: {
            type: type.STRING(150),
            allowNull: false
        },
        'estado': {
            type: type.ENUM('Activo', 'Inactivo', 'Eliminado')
        },
        'hashId': {
            type: type.STRING()
        }
    },
        { timestamps: true }
    )
}