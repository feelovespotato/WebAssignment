/*=====================================================================*/
/* productsData.js                                                     */
/*                                                                      */
/* Single source of truth for every product across every category.     */
/* To add a new product: add one object here. No new HTML/CSS/JS       */
/* files needed — ProductDetailPage.html renders whichever id is in    */
/* the URL (?id=...) using this data.                                  */
/*=====================================================================*/

const productsData = [
    {
        id: "coffee",
        category: "Coffee",
        categoryBg: "--coffeebg",
        name: "Nescafe Espresso Concentrate Coffee",
        price: "RM 21.00",
        
        description: "Smooth, milky coffee brewed for an energizing yet balanced taste. Made with real coffee extract and fresh milk, it's the perfect pick-me-up for your everyday routine — no artificial aftertaste, just a clean and comforting sip every time.",
        images: ["../assets/images/2flavournescafe.webp"
            ,"../assets/images/coffee.png",
            "../assets/images/nescafecoffee2.webp"
        ],
        sizes: [ "500ml"],
        defaultSize: "500ml",
        flavors: ["Sweet Vanilla", "Black"],
        defaultFlavor: "Sweet Vanilla",
        packs: ["Single", "Pack of 6", "Pack of 12"],
        defaultPack: "Single",
        
        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "tea-greentea",
        category: "Tea",
        categoryBg: "--teabg",
        name: "Green Tea",
        price: "RM 2.50",
       
        description: "Refreshing green tea with a light, clean finish. Brewed for a naturally refreshing taste with none of the bitterness of stronger teas.",
        images: ["../assets/images/greentea.webp"],
        sizes: ["350ml", "500ml"],
        defaultSize: "350ml",
        packs: ["Single", "Pack of 6"],
        defaultPack: "Single",
        
        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "juice-orange",
        category: "Juice",
        categoryBg: "--juicebg",
        name: "Orange Juice",
        price: "RM 3.20",
        
        description: "Fruity and refreshing orange juice made from real fruit flavors, packed for a burst of citrus whenever you need it.",
        images: ["../assets/images/orangejuice.png"],
        sizes: ["250ml", "1L"],
        defaultSize: "250ml",
        packs: ["Single"],
        defaultPack: "Single",
       
        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "soda-fantaorange",
        category: "Soda",
        categoryBg: "--sodabg",
        name: "Fanta Orange",
        price: "RM 2.80",
      
        description: "Fizzy, flavorful orange soda perfect for a refreshing treat any time of day.",
        images: ["../assets/images/fantaorange.png"],
        sizes: ["320ml", "1.5L"],
        defaultSize: "320ml",
        packs: ["Single", "Pack of 6"],
        defaultPack: "Single",
       
        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "functional-redbull",
        category: "Functional Beverage",
        categoryBg: "--functionalbg",
        name: "Red Bull",
        price: "RM 4.50",
       
        description: "Enhance your daily routine with this functional energy drink, formulated to help keep you alert and focused.",
        images: ["../assets/images/redbull.webp"],
        sizes: ["250ml"],
        defaultSize: "250ml",
        packs: ["Single", "Pack of 4"],
        defaultPack: "Single",
     
        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "dairy-farmfresh-milk",
        category: "Dairy Beverages",
        categoryBg: "--dairybg",
        name: "Farm Fresh Milk",
        price: "RM 3.50",
       
        description: "Creamy, nutritious dairy beverage for every lifestyle. A wholesome everyday drink for the whole family.",
        images: ["../assets/images/farmfresh.png"],
        sizes: ["236ml", "1L"],
        defaultSize: "236ml",
        packs: ["Single", "Pack of 6"],
        defaultPack: "Single",
    
        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "local-krisantimum",
        category: "Local Beverages",
        categoryBg: "--localdrinkbg",
        name: "Krisantimum",
        price: "RM 2.60",
        
        description: "Experience the taste of chrysanthemum tea, a classic local favorite known for its light, floral sweetness.",
        images: ["../assets/images/krisantimum.png"],
        sizes: ["300ml"],
        defaultSize: "300ml",
        packs: ["Single", "Pack of 6"],
        defaultPack: "Single",
       
        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "alcoholic-changbeer",
        category: "Alcoholic Beverages",
        categoryBg: "--otherbg",
        name: "Chang Beer",
        price: "RM 8.90",
      
        description: "A selection of beer for adult consumers. Crisp and refreshing, best enjoyed responsibly.",
        images: ["../assets/images/changbeer.webp"],
        sizes: ["330ml"],
        defaultSize: "330ml",
        packs: ["Single", "Pack of 6"],
        defaultPack: "Single",
      
        availability: "In Stock",
        delivery: "2–4 working days",
    },
];