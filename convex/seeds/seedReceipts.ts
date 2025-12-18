import { mutation } from "../_generated/server";

function dollarsToCents(x: number | null | undefined) {
    if (x === null || x === undefined) {
        return undefined;
    }
    return Math.round(x * 100);
}

export const seedReceipt = mutation(async (ctx) => {
    // Receipt data
    const receiptId = await ctx.db.insert("receipts", {
        imageID: "seed-image-id",
        createdAt: Date.now(),
        totalCents: dollarsToCents(62.58),
        taxCents: dollarsToCents(3.75),
        tipCents: undefined,
        status: "parsed",
    });

    // Items and modifiers data
    const itemsData = [
        {
            item_name: "BOGO for $1",
            price: 1.0,
            quantity: 1,
            modifiers: [
                { modifier_name: "1 McChicken", price: 2.19 },
                { modifier_name: "1 McChicken", price: null },
            ],
        },
        {
            item_name: "BOGO for $1",
            price: 1.0,
            quantity: 1,
            modifiers: [
                { modifier_name: "1 McChicken", price: 2.19 },
                { modifier_name: "1 McChicken", price: null },
            ],
        },
        {
            item_name: "BOGO for $1",
            price: 1.0,
            quantity: 1,
            modifiers: [
                { modifier_name: "1 McChicken", price: 2.19 },
                { modifier_name: "1 McChicken", price: null },
            ],
        },
        {
            item_name: "Classic Big Mac Pack",
            price: 19.99,
            quantity: 1,
            modifiers: [
                { modifier_name: "1 Boxed Bundle", price: null },
                { modifier_name: "1 BBQ Sauce", price: null },
                { modifier_name: "2 S&S Sauce", price: null },
            ],
        },
        {
            item_name: "20 McNuggets",
            price: 7.29,
            quantity: 1,
            modifiers: [
                { modifier_name: "1 Creamy Ranch Cup", price: null },
                { modifier_name: "1 Spicy Buffalo Cup", price: null },
                { modifier_name: "1 Honey Must Cup", price: null },
            ],
        },
        {
            item_name: "20 McNuggets",
            price: 7.29,
            quantity: 1,
            modifiers: [
                { modifier_name: "1 Creamy Ranch Cup", price: null },
                { modifier_name: "2 Honey Must Cup", price: null },
            ],
        },
        {
            item_name: "Big Mac Ml-Lrg",
            price: 9.49,
            quantity: 1,
            modifiers: [
                { modifier_name: "L Dr Pepper", price: null },
            ],
        },
        {
            item_name: "L Coke",
            price: 3.58,
            quantity: 2,
            modifiers: null,
        },
        {
            item_name: "L Fanta Orange",
            price: 1.79,
            quantity: 1,
            modifiers: null,
        },
        {
            item_name: "L Dr Pepper",
            price: 1.79,
            quantity: 1,
            modifiers: null,
        },
        {
            item_name: "L Sweet Iced Tea",
            price: 1.79,
            quantity: 1,
            modifiers: null,
        },
    ];

    // Insert items and their modifiers
    for (const itemData of itemsData) {
        const itemId = await ctx.db.insert("receiptItems", {
            receiptId: receiptId as any,
            name: itemData.item_name,
            quantity: itemData.quantity,
            priceCents: dollarsToCents(itemData.price),
        });

        // Insert modifiers for this item
        if (itemData.modifiers && itemData.modifiers.length > 0) {
            for (const modifier of itemData.modifiers) {
                await ctx.db.insert("receiptModifiers", {
                    itemId,
                    name: modifier.modifier_name,
                    priceCents: dollarsToCents(modifier.price),
                });
            }
        }
    }

    return receiptId;
})