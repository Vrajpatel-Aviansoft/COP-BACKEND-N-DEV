'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Msd extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Msd.belongsTo(models.CarModel, {
        foreignKey: 'model_id',
        as: 'carModel',
      });
    }
  }
  Msd.init(
    {
      msd_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      model_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      model_engine: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      model_bhp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      model_transmission: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      model_mileage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      model_fuel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: 'MSD',
      timestamps: true,
      underscored: true,
      tableName: 'cop_msd',
    }
  );

  // SEO Content Creation on Create
  Msd.addHook('afterCreate', async (msd, options) => {
    try {
      const { Seo, SeoPage, Brand, CarModel, Op } = sequelize.models;

      const carModel = await CarModel.findByPk(msd.model_id, {
        include: [{ model: Brand, as: 'brand' }],
      });

      if (!carModel) {
        return;
      }

      const brand = carModel.brand;
      if (!brand) {
        return;
      }

      const tagContentMapping = {
        1: `${brand.brand_name} ${carModel.model_name} Models Price - Images, Specs & Reviews`,
        2: `${brand.brand_name} ${carModel.model_name} - buy wide range of ${brand.brand_name} ${carModel.model_name} Models online at best prices. Check specifications, features, mileage, colours, images, FAQs, news, reviews, and videos. ✓Book a Test Drive ✓Car Insurance ✓EMI Calculator`,
        9: `${brand.brand_name} ${carModel.model_name} Models Price - Images, Specs & Reviews`,
        10: `${brand.brand_name} ${carModel.model_name} - buy wide range of ${brand.brand_name} ${carModel.model_name} Models online at best prices. Check specifications, features, mileage, colours, images, FAQs, news, reviews, and videos. ✓Book a Test Drive ✓Car Insurance ✓EMI Calculator`,
      };

      const page = await SeoPage.findOne({
        where: {
          page_name: {
            [Op.like]: '%Car Module%',
          },
        },
      });

      if (!page) {
        return;
      }

      for (const metaTagId in tagContentMapping) {
        const content = tagContentMapping[metaTagId];

        const existingSeo = await Seo.findOne({
          where: {
            brand_id: carModel.brand_id,
            model_id: carModel.model_id,
            page_id: page.page_id,
            meta_tag_id: metaTagId,
          },
        });

        if (!existingSeo) {
          await Seo.create({
            brand_id: carModel.brand_id,
            model_id: carModel.model_id,
            page_id: page.page_id,
            meta_tag_id: metaTagId,
            tag_content: content,
            status: 1,
            seo_type: 2,
          });
        }
      }
    } catch (error) {
      console.error('Error creating SEO content after MSD creation:', error);
    }
  });

  // SEO Content Update on Update
  Msd.addHook('afterUpdate', async (msd, options) => {
    try {
      const { Seo, SeoPage, Brand, CarModel, Op } = sequelize.models;

      const carModel = await CarModel.findByPk(msd.model_id, {
        include: [{ model: Brand, as: 'brand' }],
      });

      if (!carModel) {
        return;
      }

      const brand = carModel.brand;
      if (!brand) {
        return;
      }

      const tagContentMapping = {
        1: `${brand.brand_name} ${carModel.model_name} Models Price - Images, Specs & Reviews`,
        2: `${brand.brand_name} ${carModel.model_name} - buy wide range of ${brand.brand_name} ${carModel.model_name} Models online at best prices. Check specifications, features, mileage, colours, images, FAQs, news, reviews, and videos. ✓Book a Test Drive ✓Car Insurance ✓EMI Calculator`,
        9: `${brand.brand_name} ${carModel.model_name} Models Price - Images, Specs & Reviews`,
        10: `${brand.brand_name} ${carModel.model_name} - buy wide range of ${brand.brand_name} ${carModel.model_name} Models online at best prices. Check specifications, features, mileage, colours, images, FAQs, news, reviews, and videos. ✓Book a Test Drive ✓Car Insurance ✓EMI Calculator`,
      };

      const page = await SeoPage.findOne({
        where: {
          page_name: {
            [Op.like]: '%Car Module%',
          },
        },
      });

      if (!page) {
        return;
      }

      // Update SEO entries for each metaTagId
      for (const metaTagId in tagContentMapping) {
        const content = tagContentMapping[metaTagId];

        const existingSeo = await Seo.findOne({
          where: {
            brand_id: carModel.brand_id,
            model_id: carModel.model_id,
            page_id: page.page_id,
            meta_tag_id: metaTagId,
          },
        });

        if (existingSeo) {
          // Update existing SEO content if found
          await existingSeo.update({ tag_content: content });
        }
      }
    } catch (error) {
      console.error('Error updating SEO content after MSD update:', error);
    }
  });

  // SEO Content Removal on Delete
  // Msd.addHook("afterDelete", async (msd, options) => {
  //   try {
  //     const { Seo, CarModel, Brand } = sequelize.models;

  //     const carModel = await CarModel.findByPk(msd.model_id, {
  //       include: [{ model: Brand, as: "brand" }],
  //     });

  //     if (!carModel) {
  //       return;
  //     }

  //     // Delete the SEO entries related to the MSD being deleted
  //     await Seo.destroy({
  //       where: {
  //         model_id: carModel.model_id,
  //         brand_id: carModel.brand_id,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error deleting SEO content after MSD deletion:", error);
  //   }
  // });

  return Msd;
};
