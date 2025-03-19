"use strict";
const { Model } = require("sequelize");
const { slugifyModel } = require("sequelize-slugify");

module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "createdBy",
      });
      Brand.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  Brand.init(
    {
      brand_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      brand_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      brand_logo: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: ''
      },
      brand_banner: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: ''
      },
      brand_description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      slug: {
        type: DataTypes.STRING,
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
      },
    },
    {
      sequelize,
      modelName: "Brand",
      timestamps: true,
      underscored: true,
      tableName: "cop_brands_ms",
    }
  );

  // Slugify brand name
  slugifyModel(Brand, {
    source: ["brand_name"],
    slugField: "slug",
  });

  Brand.addHook("afterCreate", async (brand, options) => {
    try {
      const { Seo } = sequelize.models;

      // Generate SEO content
      const seoContent = generateSeoContent(brand.brand_name, "2024");

      const metaTagMapping = {
        1: "title",
        2: "description",
        9: "og_title",
        10: "og_description",
      };

      for (let metaTagId in metaTagMapping) {
        const content = seoContent[metaTagMapping[metaTagId]];

        // Create SEO entries for the brand
        await Seo.create({
          brand_id: brand.brand_id,
          page_id: 5,
          meta_tag_id: metaTagId,
          tag_content: content,
          status: 1,
          seo_type: 1,
        });
      }
    } catch (error) {
      console.error("Error during afterCreate hook:", error); // Enhanced logging
      throw new Error("Error creating SEO data");
    }
  });

  // After brand update, update SEO content
  Brand.addHook("afterUpdate", async (brand, options) => {
    try {
      const { Seo } = sequelize.models;
      // Generate SEO content for updated brand
      const seoContent = generateSeoContent(brand.brand_name, "2024");

      const metaTagMapping = {
        1: "title",
        2: "description",
        9: "og_title",
        10: "og_description",
      };

      // Iterate over SEO entries and update them
      for (let metaTagId in metaTagMapping) {
        const content = seoContent[metaTagMapping[metaTagId]];

        // Find existing SEO entry for the brand
        const existingSeo = await Seo.findOne({
          where: {
            brand_id: brand.brand_id,
            meta_tag_id: metaTagId,
            page_id: 5,
          },
        });

        if (existingSeo) {
          // Update existing SEO entry
          existingSeo.tag_content = content;
          await existingSeo.save();
        } else {
          // If no existing SEO entry, create a new one
          await Seo.create({
            brand_id: brand.brand_id,
            page_id: 5,
            meta_tag_id: metaTagId,
            tag_content: content,
            status: 1,
            seo_type: 1,
          });
        }
      }
    } catch (error) {
      console.error("Error updating SEO data:", error);
      throw new Error("Error updating SEO data");
    }
  });

  // Brand.addHook("beforeDestroy", async (brand, options) => {
  //   try {
  //     const { Seo } = sequelize.models;

  //     // Delete all SEO entries associated with the brand
  //     const deletedSeoCount = await Seo.destroy({
  //       where: {
  //         brand_id: brand.brand_id, // Deleting SEO entries related to this brand
  //       },
  //     });

  //     if (deletedSeoCount > 0) {
  //       console.log(
  //         `Deleted ${deletedSeoCount} SEO entries for Brand ID ${brand.brand_id}`
  //       );
  //     } else {
  //       console.log(`No SEO entries found for Brand ID ${brand.brand_id}`);
  //     }
  //   } catch (error) {
  //     console.error("Error during beforeDestroy hook:", error);
  //     throw new Error("Error cleaning up SEO data before deleting brand");
  //   }
  // });

  return Brand;
};

// SEO content generation function (same as before)
const generateSeoContent = (brandName, year) => {
  return {
    title: `${brandName} Cars Price ${year} - Car Models, Specs & Features`,
    description: `Check the latest ${year} ${brandName} Prices in India. Your best guide to cars, Explore New ${brandName} Car Models with Full Specs, images, review, dealers and Features at CarOnPhone.`,
    og_title: `${brandName} Cars Price ${year} - Car Models, Specs & Features`,
    og_description: `Check the latest ${year} ${brandName} Prices in India. Your best guide to cars, Explore New ${brandName} Car Models with Full Specs, images, review, dealers and Features at CarOnPhone.`,
  };
};
