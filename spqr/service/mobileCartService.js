const { Restaurant, MainCategory, Order, OrderItem, SubOrder, MainMenu, OptionCategory, OptionMenu} = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
    /* Get past orders */
    getPastOrder: async (restaurant_id, branch_id, table_number) => {
        try {
          const pastOrders = await Order.findAll({
            where: {
              restaurant_id: restaurant_id,
              branch_id: branch_id,
              table_number: table_number,
            order_status: 1, // 'active' = 1 indicates that the suborder/past order exists
            },
            include: {
              model: SubOrder,
              include: [
                {
                  model: OrderItem,
                  include: [
                    {
                      model: MainMenu,
                      include: [
                        {
                            model: OptionCategory,
                            include: {
                              model: OptionMenu,
                            },
                          },
                      ]
                    },
                  ],
                },
              ],
            },
          });
          
          const formattedOrders = pastOrders.map((order) => {
            const subOrders = order.SubOrders.map((subOrder) => {
              return {
                sub_order_id: subOrder.id,
                main_menus: subOrder.OrderItems.map((item) => {
                  return {
                    name: item.MainMenu.name,
                    price: item.MainMenu.price,
                    option_menus: item.MainMenu.OptionCategories.map((category) => {
                      return {
                        option_category_name: category.name,
                        option_menus: category.OptionMenus.map((option) => {
                          return {
                            id: option.id,
                            name: option.name,
                            price: option.price,
                            description: option.description,
                          };
                        }),
                      };
                    }),
                  };
                }),
              };
            });
      
            return subOrders;
          });
          
      
        return {'past_orders' : formattedOrders};
        } catch (error) {
            throw error;
        }
}
}