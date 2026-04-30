import { GetLaguageMap } from "@Language/languageUtils";
import { GetNavBarHeight, UpdateTabBarLaguage } from "@Lib/utils";

const allProducts = [
  { id: 101, categoryId: 3, title: '羽毛球包', stock: 1, unit: '个', percent: 50, price: '52连周', image: '/static/icons/shop/bag1.png' },
  { id: 102, categoryId: 3, title: '羽毛球包', stock: 1, unit: '个', percent: 50, price: '52连周', image: '/static/icons/shop/bag2.png' },
];

Page({
  data: {
    // Static
    _lang: GetLaguageMap().activityList,
    navBarHeight: GetNavBarHeight() + 10,

    activeId: 1,
    categories: [
      { id: 1, name: '【全部】', icon: '/static/icons/shop/all.png' },
      { id: 2, name: '【商品】', icon: '/static/icons/adventure.png' },
      { id: 3, name: '【成就】', icon: '/static/icons/spartan-helmet.png' },
      { id: 4, name: '【积分】', icon: '/static/icons/apple-arcade.png' },
    ],
    products: allProducts
  },

  switchCategory(e: any) {
    const id = e.currentTarget.dataset.id;

    this.setData({
      activeId: id,
      products: allProducts.filter(p => p.categoryId === id || id === 1)
    });
  },

  async onLoad() {
    UpdateTabBarLaguage();
  }
})