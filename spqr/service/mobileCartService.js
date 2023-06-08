const { Restaurant, MainCategory, OrderItemOption, Order, OrderItem, SubOrder, MainMenu, OptionCategory, OptionMenu} = require('../models');
const sequelize = require('sequelize');
const restaurants = require('../models/restaurants');
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
                     
                    },
                    {
                      model: OrderItemOption,
                      include: [
                        {
                          model: OptionMenu,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          });
          
          const mappedOrders = pastOrders.map((order) => {
            const subOrders = order.SubOrders.map((subOrder) => {
              return {
                sub_order_id: subOrder.id,
                order_status: subOrder.order_status,
                main_menus: subOrder.OrderItems.map((item) => {
                  const optionMenus = item.OrderItemOptions.map((option) => {
                    return {
                      name: option.OptionMenu.name,
                      price: option.OptionMenu.price,
                    };
                  });
      
                  return {
                    name: item.MainMenu.name,
                    price: item.MainMenu.price,
                    option_menus: optionMenus,
                  };
                }),
              };
            });
      
            return subOrders;
          });
          
      
        return {'past_orders' : mappedOrders};
        } catch (error) {
            throw error;
        }
    },

    /* Post current order */
    postCurrentOrder: async (restaurant_id, branch_id, table_number, current_order) => {

      const curr_order = current_order.current_order[0].main_menus

      console.log(curr_order)
      // Check if past orders exist or if the order is active
      const pastOrders = await Order.findAll({
        where: {
          restaurant_id,
          branch_id,
          table_number,
          order_status: 1
        }
      })

      console.log(pastOrders)

      let oderId;

      if (pastOrders.length === 0 || pastOrders.every(order => order.order_status === 0)) {
        // If no past order exists, create a new order
        console.log('no past order')
        const newOrder = await Order.create({
          restaurant_id,
          branch_id,
          table_number,
          order_status: 1,
          total_price: 0,
        });

        orderId = newOrder.order_id;
      } else {
        // If past order exists, get the order ID of the past order
        console.log('past order exists, get the id')
        const activeOrder = pastOrders.find(order => order.order_status === 1);
        orderId = activeOrder.order_id;
      }

      console.log(orderId)

      }

    }
