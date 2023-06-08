
const {getAllMobileMenu, getMobileMenuDetail} = require('../service/mobileMenuService')
const {data} = require('dummy_data')

// Mock the models and dependencies
jest.mock('../models', () => ({
    MainCategory: {
      findAll: jest.fn(() => Promise.resolve([]))
    },
    MainMenu: {
      findOne: jest.fn(() => Promise.resolve(null))
    },
    OptionCategory: {
      findOne: jest.fn(() => Promise.resolve(null))
    },
    OptionMenu: {
      findAll: jest.fn(() => Promise.resolve([]))
    }
}));


describe('getAllMobileMenu', () => {
    test('should return the formatted menu', async () => {
      // Mock the MainCategory.findAll function
      const mockMainCategories = [
        { name: 'Category 1', MainMenus: [{ id: 1, name: 'Menu 1', price: 10 }] },
        { name: 'Category 2', MainMenus: [{ id: 2, name: 'Menu 2', price: 20 }] }
      ];
      jest.spyOn(MainCategory, 'findAll').mockResolvedValue(mockMainCategories);

      const restaurant_id = 1;
      const branch_id = 2;
      const table_number = 3;

      const result = await getAllMobileMenu(restaurant_id, branch_id, table_number);

      expect(MainCategory.findAll).toHaveBeenCalledTimes(1);
      expect(MainCategory.findAll).toHaveBeenCalledWith({
        where: { restaurant_id },
        include: [
          {
            model: MainMenu,
            include: [
              {
                model: BranchMenuStatus,
                where: { branch_id }
              }
            ]
          }
        ]
      });

      expect(result).toEqual({
        menu: [
          {
            category_name: 'Category 1',
            main_menus: [
              {
                id: 1,
                name: 'Menu 1',
                price: 10,
                description: undefined,
                image_url: undefined
              }
            ]
          },
          {
            category_name: 'Category 2',
            main_menus: [
              {
                id: 2,
                name: 'Menu 2',
                price: 20,
                description: undefined,
                image_url: undefined
              }
            ]
          }
        ]
      });
    });
  });