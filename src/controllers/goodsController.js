const models = require('../models');
const ResponseAPI = require('../utils/response');
const { imageUpload } = require('../utils/imageUtil');
const fs = require('fs');

const goodsController = {
  async createGoods(req, res, next) {
    try {
      const { sku_code, name, description } = req.body;
      
      let photo_url = null;
      if (req.file) {
        photo_url = await imageUpload(req.file);
      }

      const goods = await models.goods.create({
        sku_code,
        name,
        description,
        photo_url
      });

      ResponseAPI.success(res, goods, 201);
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  async getAllGoods(req, res, next) {
    try {
      const goods = await models.goods.find();
      ResponseAPI.success(res, goods);
    } catch (error) {
      next(error);
    }
  },

  async getGoodsById(req, res, next) {
    try {
      const goods = await models.goods.findById(req.params.id);
      
      if (!goods) {
        return ResponseAPI.error(res, 'Goods not found', 404);
      }

      ResponseAPI.success(res, goods);
    } catch (error) {
      next(error);
    }
  },

  async updateGoods(req, res, next) {
    try {
      const { sku_code, name, description } = req.body;
      const goods = await models.goods.findById(req.params.id);

      if (!goods) {
        return ResponseAPI.error(res, 'Goods not found', 404);
      }

      if (req.file) {
        const photo_url = await imageUpload(req.file);
        goods.photo_url = photo_url;
      }

      goods.sku_code = sku_code || goods.sku_code;
      goods.name = name || goods.name;
      goods.description = description || goods.description;

      await goods.save();

      ResponseAPI.success(res, goods);
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  async deleteGoods(req, res, next) {
    try {
      const goods = await models.goods.findById(req.params.id);

      if (!goods) {
        return ResponseAPI.error(res, 'Goods not found', 404);
      }

      await goods.deleteOne();

      ResponseAPI.success(res, null, 200, 'Goods deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = goodsController;