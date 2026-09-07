import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";

const collectionDefs = [
  {
    title: "Ottoman Beds",
    handle: "ottoman-beds",
    description:
      "Upholstered ottoman beds raised on a gas-lift base, trading the usual valance for a full storage void beneath the mattress — a considerable convenience in a small room, or a welcome one in a large family.",
  },
  {
    title: "Traditional Oak",
    handle: "traditional-oak",
    description:
      "Solid oak frames built along traditional lines, with chamfered posts and a slatted base that give a little with use rather than against it. Oak is a wood that repays patience: the grain only deepens with age.",
  },
  {
    title: "Upholstered Sleigh Beds",
    handle: "upholstered-sleigh",
    description:
      "Sleigh-shaped frames with a curved head and footboard, upholstered in fabrics chosen as much for their stamina as their softness. A quietly formal shape for a bedroom that wants a little ceremony.",
  },
  {
    title: "Divan Beds",
    handle: "divan-beds",
    description:
      "The divan remains Britain's most dependable bed: a sprung or storage base beneath a matching headboard, built low, built simply, and built to outlast most fashions in the room around it.",
  },
  {
    title: "Metal Frame Beds",
    handle: "metal-frames",
    description:
      "Slimmer frames in finished steel, for bedrooms where a heavier silhouette would crowd the room. Less mass, the same rest.",
  },
];

const largeSizes = ["Double", "King", "Super King"];
const modestSizes = ["Single", "Small Double", "Double"];

const bedDefs = [
  { title: "Silver Ottoman", handle: "silver-ottoman", finish: "Silver woven upholstery", price: 499, collection: "ottoman-beds", sizes: largeSizes },
  { title: "Charcoal Ottoman", handle: "grey-ottoman", finish: "Charcoal woven upholstery", price: 529, collection: "ottoman-beds", sizes: largeSizes },
  { title: "Navy Ottoman", handle: "navy-ottoman", finish: "Navy woven upholstery", price: 549, collection: "ottoman-beds", sizes: largeSizes },
  { title: "Heritage Oak", handle: "oak-bed", finish: "Traditional oak", price: 649, collection: "traditional-oak", sizes: largeSizes },
  { title: "Dark Oak", handle: "oak-bed-dark", finish: "Dark oak stain", price: 679, collection: "traditional-oak", sizes: largeSizes },
  { title: "Oak Sleigh", handle: "oak-sleigh-bed", finish: "Oak sleigh frame", price: 729, collection: "traditional-oak", sizes: largeSizes },
  { title: "Blush Velvet Sleigh", handle: "blush-velvet-sleigh", finish: "Blush velvet upholstery", price: 579, collection: "upholstered-sleigh", sizes: largeSizes },
  { title: "Charcoal Linen Sleigh", handle: "charcoal-linen-sleigh", finish: "Charcoal linen upholstery", price: 599, collection: "upholstered-sleigh", sizes: largeSizes },
  { title: "Sage Bouclé Sleigh", handle: "sage-boucle-sleigh", finish: "Sage bouclé upholstery", price: 639, collection: "upholstered-sleigh", sizes: largeSizes },
  { title: "Classic Grey Divan", handle: "classic-grey-divan", finish: "Grey plain-weave fabric", price: 349, collection: "divan-beds", sizes: modestSizes },
  { title: "Oatmeal Storage Divan", handle: "oatmeal-divan-storage", finish: "Oatmeal fabric, two-drawer storage", price: 429, collection: "divan-beds", sizes: modestSizes },
  { title: "Black Metal Frame", handle: "black-metal-frame", finish: "Matt black powder coat", price: 279, collection: "metal-frames", sizes: modestSizes },
  { title: "Brushed Brass Frame", handle: "brushed-brass-frame", finish: "Brushed brass finish", price: 329, collection: "metal-frames", sizes: modestSizes },
];

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );

  const countries = ["gb"];

  const { data: existingStores } = await query.graph({
    entity: "store",
    fields: ["id", "default_sales_channel_id"],
    filters: { name: "Beds4u" },
  });

  let defaultSalesChannel: { id: string };
  let shippingProfile: { id: string };
  let stockLocation: { id: string };

  if (!existingStores.length) {
    logger.info("Seeding store data...");
    const {
      result: [salesChannel],
    } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
            description: "Created by Medusa",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannel;

    const {
      result: [publishableApiKey],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Default Publishable API Key",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [defaultSalesChannel.id],
      },
    });

    await createStoresWorkflow(container).run({
      input: {
        stores: [
          {
            name: "Beds4u",
            supported_currencies: [
              {
                currency_code: "gbp",
                is_default: true,
              },
            ],
            default_sales_channel_id: defaultSalesChannel.id,
          },
        ],
      },
    });

    logger.info("Seeding region data...");
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "United Kingdom",
            currency_code: "gbp",
            countries,
            payment_providers: process.env.STRIPE_API_KEY ? ["pp_stripe_stripe"] : (process.env.NODE_ENV === "production" ? [] : ["pp_system_default"]),
          },
        ],
      },
    });
    const region = regionResult[0];
    logger.info("Finished seeding regions.");

    logger.info("Seeding tax regions...");
    await createTaxRegionsWorkflow(container).run({
      input: countries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
    logger.info("Finished seeding tax regions.");

    logger.info("Seeding stock location data...");
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "Beds4u Factory",
            address: {
              city: "",
              country_code: "GB",
              address_1: "",
            },
          },
        ],
      },
    });
    stockLocation = stockLocationResult[0];

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });

    logger.info("Seeding fulfillment data...");
    // This is created by a migration script in core.
    const { data: shippingProfileResult } = await query.graph({
      entity: "shipping_profile",
      fields: ["id"],
    });
    shippingProfile = shippingProfileResult[0];

    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Beds4u delivery",
      type: "shipping",
      service_zones: [
        {
          name: "United Kingdom",
          geo_zones: [{ country_code: "gb", type: "country" }],
        },
      ],
    });

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    });

    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Scheduled bed delivery (sample rate)",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Delivery date arranged after manufacture; sample 15–25 working days.",
            code: "standard",
          },
          prices: [
            {
              currency_code: "gbp",
              amount: 49,
            },
            {
              region_id: region.id,
              amount: 49,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    });
    logger.info("Finished seeding fulfillment data.");

    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocation.id,
        add: [defaultSalesChannel.id],
      },
    });
    logger.info("Finished seeding stock location data.");
  } else {
    logger.info("Beds4u store infrastructure already seeded; checking catalogue for new items...");
    defaultSalesChannel = { id: existingStores[0].default_sales_channel_id as string };
    const { data: shippingProfileResult } = await query.graph({
      entity: "shipping_profile",
      fields: ["id"],
    });
    shippingProfile = shippingProfileResult[0];
    const { data: stockLocations } = await query.graph({
      entity: "stock_location",
      fields: ["id"],
      filters: { name: "Beds4u Factory" },
    });
    stockLocation = stockLocations[0];
  }

  const { data: existingCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "handle"],
    filters: { handle: collectionDefs.map((c) => c.handle) },
  });
  const collectionIdByHandle = new Map<string, string>(
    existingCollections.map((c) => [c.handle, c.id])
  );
  const missingCollections = collectionDefs.filter(
    (c) => !collectionIdByHandle.has(c.handle)
  );
  if (missingCollections.length) {
    const { result: createdCollections } = await createCollectionsWorkflow(container).run({
      input: { collections: missingCollections.map((c) => ({ title: c.title, handle: c.handle })) },
    });
    createdCollections.forEach((c) => collectionIdByHandle.set(c.handle, c.id));
  }

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: bedDefs.map((b) => b.handle) },
  });
  const existingHandles = new Set(existingProducts.map((p) => p.handle));
  const newBeds = bedDefs.filter((b) => !existingHandles.has(b.handle));

  if (!newBeds.length) {
    logger.info("Beds4u catalogue already up to date; no new products added.");
    return;
  }

  const imageBase = (process.env.MEDUSA_PUBLIC_URL || "http://localhost:9000") + "/static";
  await createProductsWorkflow(container).run({
    input: {
      products: newBeds.map((bed) => {
        const collectionDescription =
          collectionDefs.find((c) => c.handle === bed.collection)?.description ?? "";
        return {
          title: bed.title,
          handle: bed.handle,
          description: `${collectionDescription} Mattress sold separately. Photography shown for illustration; the piece pictured is drawn from the sample catalogue specification.`,
          status: ProductStatus.PUBLISHED,
          collection_id: collectionIdByHandle.get(bed.collection),
          shipping_profile_id: shippingProfile.id,
          thumbnail: imageBase + "/" + bed.handle + ".jpg",
          images: [{ url: imageBase + "/" + bed.handle + ".jpg" }],
          metadata: { lead_time_min_days: 15, lead_time_max_days: 25, lead_time_unit: "working days", configuration_version: 1, sample_catalogue: true },
          options: [{ title: "Size", values: bed.sizes }, { title: "Finish", values: [bed.finish] }],
          variants: bed.sizes.map((size, i) => ({
            title: size + " / " + bed.finish,
            sku: bed.handle.toUpperCase() + "-" + i,
            options: { Size: size, Finish: bed.finish },
            manage_inventory: true,
            prices: [{ currency_code: "gbp", amount: bed.price + i * 100 }],
          })),
          sales_channels: [{ id: defaultSalesChannel.id }],
        };
      }),
    },
  });

  const { data: inventoryItems } = await query.graph({ entity: "inventory_item", fields: ["id"] });
  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id"],
    filters: { location_id: stockLocation.id },
  });
  const stockedItemIds = new Set(existingLevels.map((l) => l.inventory_item_id));
  const unstockedItems = inventoryItems.filter((item) => !stockedItemIds.has(item.id));
  if (unstockedItems.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: unstockedItems.map((item) => ({
          location_id: stockLocation.id,
          stocked_quantity: 10,
          inventory_item_id: item.id,
        })),
      },
    });
  }

  logger.info(`Beds4u catalogue ready: added ${newBeds.length} product(s). Retrieve the publishable key in Admin > Settings > Publishable API Keys.`);
}
