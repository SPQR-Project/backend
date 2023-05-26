const { Restaurant, Branch, MainCategory, MainMenu, OptionCategory, OptionMenu} = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

console.log('test');

module.exports = {
    /* Get all menu */
    getAllMobileMenu: async (restaurant_id, branch_id, table_number) => {
        try {

            const restaurant = await Restaurant.findOne({
                where: {
                    id: restaurant_id
                },
                attributes: ['id', 'name']
            });

            return restaurant;
        } catch (error) {
            throw error;
        }
    },
}