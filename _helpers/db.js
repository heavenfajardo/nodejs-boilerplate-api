const config = require('../config.json');
const mysql = require('mysql2/promise');
const { Sequelize, DataTypes } = require('sequelize');

const db = {};

initialize();

async function initialize() {
    const { host, port, user, password, database } = config.database;
    
    // Create the database if it doesn't exist
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // Connect to the database
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // Define models
    db.Account = require('../accounts/account.model')(sequelize, DataTypes);
    db.RefreshToken = require('../accounts/refresh-token.model')(sequelize, DataTypes);
    db.Order = require('../orders/order.model')(sequelize, DataTypes);
    db.Product = require('../orders/product.model')(sequelize, DataTypes);

    // Define relationships
    db.Order.belongsTo(db.Account, { foreignKey: 'userId' });
    db.Order.belongsToMany(db.Product, { through: 'OrderProducts', foreignKey: 'orderId' });
    db.Product.belongsToMany(db.Order, { through: 'OrderProducts', foreignKey: 'productId' });

    // Sync all models with the database
    await sequelize.sync();

    // Assign the sequelize instance to db object
    db.sequelize = sequelize;
}

module.exports = db;
