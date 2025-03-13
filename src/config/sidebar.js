module.exports = [
  {
    title: 'Imports',
    icon: `<i class="ki-duotone ki-cloud-download">
             <span class="path1"></span>
             <span class="path2"></span>
           </i>`,
    children: [
      {
        title: 'Brand Import',
        requiredRights: '',
        path: '/brand/import',
      },
      {
        title: 'Non-EV Model (Launched) Import',
        requiredRights: 'create_model',
        path: '/car-model/import/non-ev/launched',
      },
      {
        title: 'Non-EV Model (Upcoming) Import',
        requiredRights: 'create_model',
        path: '/car-model/import/non-ev/upcoming',
      },
      {
        title: 'EV Model (Launched) Import',
        requiredRights: 'create_model',
        path: '/car-model/import/ev/launched',
      },
      {
        title: 'EV Model (Upcoming) Import',
        requiredRights: 'create_model',
        path: '/car-model/import/ev/upcoming',
      },
      {
        title: 'Variant Import',
        requiredRights: 'create_variant',
        path: '/variant/import',
      },
      {
        title: 'Variant Color Import',
        requiredRights: 'create_variant',
        path: '/variant/import/color',
      },
      {
        title: 'Car Graphics (Images) Import',
        requiredRights: 'create_car_graphic',
        path: '/car-graphics/import/image',
      },
      {
        title: 'Car Grapics (Images Alt Tag Update) Import',
        requiredRights: 'create_car_graphic',
        path: '/car-graphics-alt-tag-update-import/create',
      },
      {
        title: 'Car Graphics (Videos) Import',
        requiredRights: 'create_car_graphic',
        path: '/car-graphics-video-import/create',
      },
      {
        title: 'Price Entry Import',
        requiredRights: 'create_price_entry',
        path: '/price-entry/import/create',
      },
      {
        title: 'Feature Value Import',
        requiredRights: 'create_feature_value',
        path: '/feature-value/import',
      },
      {
        title: 'Key Highlights Import',
        requiredRights: 'create_key_highlights',
        path: '/feature-value/import/key-highlight',
      },
      {
        title: 'Additional Features Import',
        requiredRights: 'create_additional_features',
        path: '/additional-features-import/create',
      },
      {
        title: 'Launch Date Import',
        requiredRights: 'create_launch_date',
        path: '/launch-date-import/create',
      },
      {
        title: 'Fuel Station Import',
        requiredRights: 'create_fuel_station',
        path: '/fuel-station/import',
      },
      {
        title: 'EV Station Import',
        requiredRights: 'create_ev_station',
        path: '/ev-station/import',
      },
      {
        title: 'Service Station Import',
        requiredRights: 'create_service_station',
        path: '/service-station/import',
      },
      {
        title: 'Dealership Import',
        requiredRights: 'create_dealership',
        path: '/dealership/import',
      },
      {
        title: 'Review Import',
        requiredRights: 'create_review',
        path: '/review/import',
      },
      {
        title: 'SEO Import',
        requiredRights: 'create_seo',
        path: '/seo-import/create',
      },
    ],
  },
  {
    title: 'Brand',
    path: '/brand',
    requiredRights: 'view_brand',
    icon: `<i class="ki-duotone ki-car-2">
             <span class="path1"></span>
             <span class="path2"></span>
             <span class="path3"></span>
             <span class="path4"></span>
             <span class="path5"></span>
             <span class="path6"></span>
           </i> `,
    children: [],
  },
  {
    title: 'Model',
    path: '/car-model',
    requiredRights: 'view_model',
    icon: `<i class="ki-duotone ki-car-3">
             <span class="path1"></span>
             <span class="path2"></span>
             <span class="path3"></span>
           </i> `,
    children: [],
  },
  {
    title: 'Variant',
    requiredRights: 'view_variant',
    path: '/variant',
    icon: `<i class="ki-duotone ki-color-swatch">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
                <span class="path6"></span>
                <span class="path7"></span>
                <span class="path8"></span>
                <span class="path9"></span>
                <span class="path10"></span>
             <span class="path11"></span>
             <span class="path12"></span>
             <span class="path13"></span>
             <span class="path14"></span>
             <span class="path15"></span>
             <span class="path16"></span>
             <span class="path17"></span>
             <span class="path18"></span>
             <span class="path19"></span>
             <span class="path20"></span>
             <span class="path21"></span>
           </i>`,
    children: [],
  },
  {
    title: 'Banner',
    path: '/banner',
    requiredRights: 'view_banner',
    icon: `<i class="ki-duotone ki-message-text-2">
             <span class="path1"></span>
             <span class="path2"></span>
             <span class="path3"></span>
           </i> `,
    children: [],
  },
  {
    title: 'Car Graphic',
    path: '/car-graphics',
    requiredRights: 'view_car_graphic',
    icon: `<i class="ki-duotone ki-dots-square">
             <span class="path1"></span>
             <span class="path2"></span>
             <span class="path3"></span>
             <span class="path4"></span>
           </i> `,
    children: [],
  },
  {
    title: 'Price Entry',
    path: '/price-entry',
    requiredRights: 'view_price_entry',
    icon: `<i class="ki-duotone ki-price-tag">
             <span class="path1"></span>
             <span class="path2"></span>
             <span class="path3"></span>
           </i>`,
    children: [],
  },
  {
    title: 'Car Listing Data',
    path: '/car-listing-data',
    requiredRights: 'view_car_listing_data',
    icon: `<i class="ki-duotone ki-burger-menu-4">
             <span class="path1"></span>
             <span class="path2"></span>
             <span class="path3"></span>
           </i>`,
    children: [],
  },
  {
    title: 'Page Content',
    path: '/page-content',
    requiredRights: 'view_page_content',
    icon: `<i class="ki-duotone ki-burger-menu-6">
             <span class="path1"></span>
             <span class="path2"></span>
           </i>`,
    children: [],
  },
  {
    title: 'Car Warning Light',
    path: '/warning-light',
    requiredRights: 'view_car_warning_light',
    icon: `<i class="ki-duotone ki-information">
             <span class="path1"></span>
             <span class="path2"></span>
             <span class="path3"></span>
           </i>`,
    children: [],
  },
  {
    title: 'Spec & Features',
    icon: `<i class="ki-duotone ki-flag">
             <span class="path1"></span>
             <span class="path2"></span>
           </i>`,
    children: [
      {
        title: 'Specification',
        requiredRights: 'create_specification',
        path: '/spec',
      },
      {
        title: 'Feature',
        requiredRights: 'create_feature',
        path: '/feature',
      },
      {
        title: 'Feature Value',
        requiredRights: 'create_feature_value',
        path: '/feature-value/create',
      },
      {
        title: 'Additional Features',
        requiredRights: 'create_additional_features',
        path: '/additional-features-import/create',
      },
    ],
  },
  {
    title: 'Location',
    icon: `<i class="ki-duotone ki-flag">
             <span class="path1"></span>
             <span class="path2"></span>
           </i>`,
    children: [
      {
        title: 'Country',
        requiredRights: 'create_country',
        path: '/country-import/create',
      },
      {
        title: 'State',
        requiredRights: 'create_state',
        path: '/state-import/create',
      },
      {
        title: 'City',
        requiredRights: 'create_city',
        path: '/city-import/create',
      },
    ],
  },
  {
    title: 'Station',
    icon: `<i class="ki-duotone ki-wrench">
             <span class="path1"></span>
             <span class="path2"></span>
           </i>`,
    children: [
      {
        title: 'EV Station',
        requiredRights: 'create_ev_station',
        path: '/ev-station',
      },
      {
        title: 'Service Station',
        requiredRights: 'create_service_station',
        path: '/service-station',
      },
      {
        title: 'Fuel Station',
        requiredRights: 'create_fuel_station',
        path: '/fuel-station',
      },
      {
        title: 'Dealerships',
        requiredRights: 'view_dealership',
        path: '/dealership',
      },
    ],
  },
  {
    title: 'Master',
    icon: `<i class="ki-duotone ki-wrench">
             <span class="path1"></span>
             <span class="path2"></span>
           </i>`,
    children: [
      {
        title: 'Car Stage',
        requiredRights: 'create_car_stage',
        path: '/car-stage-import/create',
      },
      {
        title: 'Car Type',
        requiredRights: 'create_car_type',
        path: '/car-type-import/create',
      },
      {
        title: 'Specification Category',
        requiredRights: 'create_specification_category',
        path: '/specification-category-import/create',
      },
      {
        title: 'Feature Option',
        requiredRights: 'create_feature_option',
        path: '/feature-option-import/create',
      },
      {
        title: 'Car Listing',
        requiredRights: 'create_car_listing',
        path: '/car-listing-import/create',
      },
      {
        title: 'All Tax',
        requiredRights: 'view_all_tax',
        path: '/all-tax',
      },
      {
        title: 'Banner Category',
        requiredRights: 'create_banner_category',
        path: '/banner-category-import/create',
      },
      {
        title: 'Car Graphic Type',
        requiredRights: 'create_car_graphic_type',
        path: '/car-graphic-type-import/create',
      },
      {
        title: 'Standard Unit',
        requiredRights: 'create_standard_unit',
        path: '/standard-unit-import/create',
      },
      {
        title: 'Icons',
        requiredRights: 'create_icon',
        path: '/icons-import/create',
      },
      {
        title: 'RTO',
        requiredRights: 'view_rto',
        path: '/master/rto',
      },
    ],
  },
  {
    title: 'Customer Data',
    icon: `<i class="ki-duotone ki-flag">
             <span class="path1"></span>
             <span class="path2"></span>
           </i>`,
    children: [
      {
        title: 'Website Customers',
        requiredRights: 'view_website_customer',
        path: '/website-customer',
      },
      {
        title: 'Book Test Drive',
        requiredRights: 'view_book_test_drive',
        path: '/book-test-drive',
      },
      {
        title: 'Buy Now',
        requiredRights: 'create_buy_now',
        path: '/buy-now-import/create',
      },
      {
        title: 'Subscribe',
        requiredRights: 'view_subscribe',
        path: '/subscribe',
      },
      {
        title: 'Review',
        requiredRights: 'create_review',
        path: '/review',
      },
      {
        title: 'Wishlist View',
        requiredRights: 'view_wishlist',
        path: '/wishlist',
      },
      {
        title: 'B2B Inquiry',
        requiredRights: 'view_b2b_inquiry',
        path: '/b2b-inquiry',
      },
      {
        title: 'Services(INS/Loan)',
        requiredRights: 'view_services',
        path: '/services-lead',
      },
    ],
  },
  {
    title: 'Users',
    path: '/user',
    requiredRights: 'view_user',
    icon: `<i class="ki-duotone ki-user-edit">
             <span class="path1"></span>
             <span class="path2"></span>
             <span class="path3"></span>
           </i> `,
    children: [],
  },
  {
    title: 'Roles',
    path: '/role',
    requiredRights: 'view_role',
    icon: `<i class="ki-duotone ki-people">
             <span class="path1"></span>
             <span class="path2"></span>
             <span class="path3"></span>
             <span class="path4"></span>
             <span class="path5"></span>
           </i> `,
    children: [],
  },
  {
    title: 'Export',
    icon: `<i class="ki-duotone ki-cloud-download">
             <span class="path1"></span>
             <span class="path2"></span>
           </i>`,
    children: [
      {
        title: 'Variants Export',
        requiredRights: 'create_variants',
        path: '/variants-export/create',
      },
      {
        title: 'Price Export',
        requiredRights: 'create_price_entry',
        path: '/price-export/create',
      },
      {
        title: 'Feature Value Export',
        requiredRights: 'create_feature_value',
        path: '/feature-value-export/create',
      },
      {
        title: 'Model Image Export',
        requiredRights: 'create_model_image',
        path: '/model-image-export/create',
      },
      {
        title: 'Graphic Image Export',
        requiredRights: 'create_graphic_image',
        path: '/graphic-image-export/create',
      },
      {
        title: 'Book Test Drive Export',
        requiredRights: 'create_book_test_drive',
        path: '/book-test-drive-export/create',
      },
    ],
  },
  {
    title: 'SEO',
    icon: `<i class="ki-duotone ki-search-list">
             <span class="path1"></span>
             <span class="path2"></span>
                <span class="path3"></span>
           </i>`,
    children: [
      {
        title: 'SEO',
        requiredRights: 'create_seo',
        path: '/seo',
      },
      {
        title: 'META TAGS',
        requiredRights: 'create_meta_tags',
        path: '/meta-tags',
      },
      {
        title: 'PAGES',
        requiredRights: 'create_pages',
        path: '/pages',
      },
    ],
  },
  {
    title: 'Unused Table',
    icon: `<i class="ki-duotone ki-flag">
             <span class="path1"></span>
             <span class="path2"></span>
           </i>`,
    children: [
      {
        title: 'Testimonial',
        requiredRights: 'create_testimonial',
        path: '/testimonial-export/create',
      },
      {
        title: 'Post Category Type',
        requiredRights: 'create_post_category_type',
        path: '/post-category-type-export/create',
      },
      {
        title: 'Post',
        requiredRights: 'create_post',
        path: '/post-export/create',
      },
      {
        title: 'Manager Language',
        requiredRights: 'create_manager_language',
        path: '/manager-language-export/create',
      },
      {
        title: 'Price Update',
        requiredRights: 'create_price_update',
        path: '/price-update-export/create',
      },
      {
        title: 'Log View',
        requiredRights: 'create_log_view',
        path: '/log-view-export/create',
      },
      {
        title: 'Managers',
        requiredRights: 'create_managers',
        path: '/managers-export/create',
      },
      {
        title: 'User Visit',
        requiredRights: 'create_user_visit',
        path: '/user-visit-export/create',
      },
      {
        title: 'Setting',
        requiredRights: 'create_setting',
        path: '/settings-export/create',
      },
    ],
  },
];
