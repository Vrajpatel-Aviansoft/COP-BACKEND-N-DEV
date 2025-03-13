exports.variantFileTransformer = (files) =>
  files.reduce((acc, file) => {
    if (
      file.fieldname === "variant_image" ||
      file.fieldname === "variant_image_mob"
    ) {
      acc[file.fieldname] = file;
    } else if (file.fieldname.startsWith("kt_docs_repeater_basic")) {
      if (!acc.kt_docs_repeater_basic) acc.kt_docs_repeater_basic = {};

      const key = file.fieldname.includes("variant_color_image_mob")
        ? "variant_color_image_mob"
        : "variant_color_image";

      if (!acc.kt_docs_repeater_basic[key])
        acc.kt_docs_repeater_basic[key] = [];

      acc.kt_docs_repeater_basic[key].push(file);
    }
    return acc;
  }, {});
