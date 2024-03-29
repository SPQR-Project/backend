const webMenuService = require("../service/webMenuService");
const webOrderService = require("../service/webOrderService");
const ut = require("../modules/util");
const rm = require("../modules/responseMessage");
const sc = require("../modules/statusCode");

module.exports = {
  /* GET: [ /:restaurant_id/:branch_id/] */
  getAllOrders: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    try {
      const allOrders = await webOrderService.getWebOrders(
        restaurant_id,
        branch_id
      );
      if (!allOrders) {
        console.log(
          "No orders currently open for the provided restaurant_id, branch_id."
        );
        return res
          .status(sc.INTERNAL_SERVER_ERROR)
          .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
      }
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, "Get all orders for web Success", allOrders));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  /* PUT: [ order_w/:restaurant_id/:branch_id/] */
  putOrderStatus: async (req, res) => {
    try {
      const currentRequest = req.body;
      const [orderType, orderId] = await webOrderService.putWebOrderStatus(
        currentRequest
      );
      let message;
      if (orderType === "order") {
        message = `Order successfully closed for order id ${orderId}`;
      } else if (orderType === "sub-order") {
        message = `Sub-order successfully updated for sub-order id ${orderId}`;
      } else {
        message = "Invalid Request";
      }
      return res.status(sc.OK).send(ut.success(sc.OK, message));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  /* PUT: [ menu_w/:restaurant_id/:branch_id] */
  putMenuStatus: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    const curr_request = req.body;

    try {
      const menu = await webMenuService.putMenuStatus(
        restaurant_id,
        branch_id,
        curr_request
      );
      const menu_id = curr_request.menu_status_change.menu_id
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, `Menu active status successfully updated for res_id: ${restaurant_id}, branch_id: ${branch_id}, and menu_id: ${menu_id}`));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  /* DELETE: [/menu_w/:restaurant_id/:branch_id/request_type/:request_id] */
  deleteMenuCategory: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    const request_type = req.params.request_type;
    const request_id = req.params.request_id;
    try {
      const params = await webMenuService.deleteMenuCategory(
        restaurant_id,
        branch_id,
        request_type,
        request_id
      );
      let message;
      if (request_type == 1) {
        message = `Menu category successfully deleted for menu category id ${request_id}`;
      } else {
        message = `Menu successfully deleted for menu id ${request_id}`;
      }
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, message));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  /* POST: [/menu_w/:restaurant_id/:branch_id/category] */
  createMenuCategory: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    const newCategory = req.body
    try {
      const params = await webMenuService.createMenuCategory(
        restaurant_id,
        branch_id,
        newCategory
      );
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, `Menu category successfully created: menu category id ${params}`));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  /* PUT: [/menu_w/:restaurant_id/:branch_id/display_order] */
  putDisplayOrder: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    const newOrder = req.body
    try {
      const params = await webMenuService.putDisplayOrder(
        restaurant_id,
        branch_id,
        newOrder
      );
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, `Display order successfully updated for category id: ${params[0]} and menu id: ${params[1]}`));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
  },

  /* POST: [/menu_w/:restaurant_id/:branch_id/create] */
  createMenu: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    let imageFile = ''; // Initialize imageFile as an empty string

    // Check if req.file exists and assign the location to imageFile
    if (req.file) {
      imageFile = req.file.location;
      console.log(imageFile);
    }

    try {
      const affectedMenuId = await webMenuService.createMenu(
        restaurant_id,
        branch_id,
        imageFile,
        req.body
      );
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, `Menu successfully created: menu id ${affectedMenuId}`));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

  },

  /* PUT: [/menu_w/:restaurant_id/:branch_id/:menu_id/edit] */
  updateMenu: async (req, res) => {
    const restaurant_id = req.params.restaurant_id;
    const branch_id = req.params.branch_id;
    const menu_id = req.params.menu_id;
    let imageFile = ''; // Initialize imageFile as an empty string

    // Check if req.file exists and assign the location to imageFile
    if (req.file) {
      imageFile = req.file.location;
      console.log(imageFile);
    }

    try {
      const affectedMenuId = await webMenuService.updateMenu(
        restaurant_id,
        branch_id,
        menu_id,
        imageFile,
        req.body
      );
      return res
        .status(sc.OK)
        .send(ut.success(sc.OK, `Menu successfully updated: menu id ${affectedMenuId}`));
    } catch (error) {
      console.error(error);
      return res
        .status(sc.INTERNAL_SERVER_ERROR)
        .send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }

  },




};


