'use strict';
const { Model } = require('sequelize');
const { slugifyModel } = require('sequelize-slugify');

module.exports = (sequelize, DataTypes) => {
  class Variant extends Model {
    /**
     * Define associations here if any
     */
    static associate(models) {
      Variant.belongsTo(models.Brand, {
        foreignKey: 'brand_id',
        as: 'brand',
      });

      Variant.belongsTo(models.CarModel, {
        foreignKey: 'model_id',
        as: 'model',
      });

      Variant.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'createdBy',
      });
      Variant.belongsTo(models.User, {
        foreignKey: 'updated_by',
        as: 'updatedBy',
      });
      Variant.hasMany(models.Color, {
        foreignKey: 'variant_id',
        as: 'colors',
      });
    }
  }

  Variant.init(
    {
      variant_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      brand_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      model_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      variant_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      variant_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      variant_image_mob: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      variant_type: {
        type: DataTypes.ENUM('1', '2'),
        allowNull: true,
      },
      seating_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.TINYINT(4),
        allowNull: false,
        defaultValue: 1,
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      full_slug: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      updated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Variant',
      tableName: 'cop_variants',
      timestamps: true,
      underscored: true,
    }
  );

  slugifyModel(Variant, {
    source: ['variant_name'],
    slugField: 'slug',
  });

  const { Op } = require('sequelize'); // Ensure Op is imported from Sequelize

  // After Create Hook
  Variant.addHook('afterCreate', async (variant, options) => {
    try {
      const { Seo, SeoPage, Brand, CarModel } = sequelize.models;

      // Fetch the brand using the brand_id from the variant
      const brand = await Brand.findByPk(variant.brand_id);
      if (!brand) {
        return;
      }

      // Fetch the car model using the model_id from the variant
      const carModel = await CarModel.findByPk(variant.model_id);
      if (!carModel) {
        return;
      }

      // SEO content mapping for different meta tags
      const tagContentMapping = {
        1: `${brand.brand_name} ${carModel.model_name} ${variant.variant_name} Price - Images, Specs & Reviews`,
        2: `${brand.brand_name} ${carModel.model_name} ${variant.variant_name} online at best prices. Explore specifications, features, mileage, colours, images, FAQs, news, reviews, and videos. ✓Book a Test Drive ✓Car Insurance ✓EMI Calculator`,
        9: `${brand.brand_name} ${carModel.model_name} ${variant.variant_name} Price - Images, Specs & Reviews`,
        10: `${brand.brand_name} ${carModel.model_name} ${variant.variant_name} online at best prices. Explore specifications, features, mileage, colours, images, FAQs, news, reviews, and videos. ✓Book a Test Drive ✓Car Insurance ✓EMI Calculator`,
      };

      // Fetch the SEO page containing 'Car Module' in its page_name
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

      // Iterate through the tagContentMapping and create SEO entries if they don't exist
      for (const metaTagId in tagContentMapping) {
        const content = tagContentMapping[metaTagId];

        // Check if an SEO entry already exists for the given brand, model, variant, page, and meta tag
        const existingSeo = await Seo.findOne({
          where: {
            brand_id: brand.brand_id,
            model_id: carModel.model_id,
            variant_id: variant.variant_id,
            page_id: page.page_id,
            meta_tag_id: metaTagId,
          },
        });

        if (!existingSeo) {
          // Create a new SEO entry if one doesn't exist
          await Seo.create({
            brand_id: brand.brand_id,
            model_id: carModel.model_id,
            variant_id: variant.variant_id,
            page_id: page.page_id,
            meta_tag_id: metaTagId,
            tag_content: content,
            status: 1,
            seo_type: 3,
          });
        }
      }
    } catch (error) {
      console.error(
        'Error creating SEO content after Variant creation:',
        error
      );
    }
  });

  // After Update Hook
  Variant.addHook('afterUpdate', async (variant, options) => {
    try {
      const { Seo, SeoPage, Brand, CarModel } = sequelize.models;

      // Fetch the brand using the brand_id from the variant
      const brand = await Brand.findByPk(variant.brand_id);
      if (!brand) {
        return;
      }

      // Fetch the car model using the model_id from the variant
      const carModel = await CarModel.findByPk(variant.model_id);
      if (!carModel) {
        return;
      }

      // SEO content mapping for different meta tags
      const tagContentMapping = {
        1: `${brand.brand_name} ${carModel.model_name} ${variant.variant_name} Price - Images, Specs & Reviews`,
        2: `${brand.brand_name} ${carModel.model_name} ${variant.variant_name} online at best prices. Explore specifications, features, mileage, colours, images, FAQs, news, reviews, and videos. ✓Book a Test Drive ✓Car Insurance ✓EMI Calculator`,
        9: `${brand.brand_name} ${carModel.model_name} ${variant.variant_name} Price - Images, Specs & Reviews`,
        10: `${brand.brand_name} ${carModel.model_name} ${variant.variant_name} online at best prices. Explore specifications, features, mileage, colours, images, FAQs, news, reviews, and videos. ✓Book a Test Drive ✓Car Insurance ✓EMI Calculator`,
      };

      // Fetch the SEO page containing 'Car Module' in its page_name
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

      // Iterate through the tagContentMapping and update SEO entries
      for (const metaTagId in tagContentMapping) {
        const content = tagContentMapping[metaTagId];

        // Check if an SEO entry already exists for the given brand, model, variant, page, and meta tag
        const existingSeo = await Seo.findOne({
          where: {
            brand_id: brand.brand_id,
            model_id: carModel.model_id,
            variant_id: variant.variant_id,
            page_id: page.page_id,
            meta_tag_id: metaTagId,
          },
        });

        if (existingSeo) {
          // Update the existing SEO entry
          await existingSeo.update({
            tag_content: content,
          });
        }
      }
    } catch (error) {
      console.error('Error updating SEO content after Variant update:', error);
    }
  });

  // After Destroy Hook
  // Variant.addHook("afterDestroy", async (variant, options) => {

  //   try {
  //     const { Seo, SeoPage, Brand, CarModel } = sequelize.models;

  //     // Fetch the brand using the brand_id from the variant
  //     const brand = await Brand.findByPk(variant.brand_id);
  //     if (!brand) {
  //       return;
  //     }

  //     // Fetch the car model using the model_id from the variant
  //     const carModel = await CarModel.findByPk(variant.model_id);
  //     if (!carModel) {
  //       return;
  //     }

  //     // Fetch the SEO page containing 'Car Module' in its page_name
  //     const page = await SeoPage.findOne({
  //       where: {
  //         page_name: {
  //           [Op.like]: "%Car Module%",
  //         },
  //       },
  //     });

  //     if (!page) {
  //       return;
  //     }

  //     // Delete the SEO entries related to the deleted variant
  //     await Seo.destroy({
  //       where: {
  //         brand_id: brand.brand_id,
  //         model_id: carModel.model_id,
  //         variant_id: variant.variant_id,
  //         page_id: page.page_id,
  //       },
  //     });
  //   } catch (error) {
  //     console.error(
  //       "Error deleting SEO content after Variant destruction:",
  //       error
  //     );
  //   }
  // });

  return Variant;
};
