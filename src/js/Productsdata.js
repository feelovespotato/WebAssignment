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
         images: [
            "../assets/images/2flavournescafe.webp",
            { src: "../assets/images/coffee.png", flavor: "Sweet Vanilla", cartImage: true },
            { src: "../assets/images/nescafecoffee2.webp", flavor: "Black", cartImage: true },
        ],
        sizes: [ "500ml"],
        defaultSize: "500ml",
        flavors: ["Sweet Vanilla", "Black"],
        defaultFlavor: "Sweet Vanilla",
        packs: ["Single", "Pack of 6"],
        defaultPack: "Single",
        
        variants: [
            { size: "500ml", pack: "Single",     price: "RM 21.00"  },
            { size: "500ml", pack: "Pack of 6",  price: "RM 116.00"  }
        ],

        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "coffee-whitecoffee-packet",
        category: "Coffee",
        categoryBg: "--coffeebg",
        name: "Nescafe White Coffee 3-in-1",
        price: "RM 16.90",
        
        description: "Rich and creamy white coffee inspired by the taste of traditional Malaysian kopitiams. A smooth blend of coffee, creamer, and sugar for a comforting cup anytime.",
       images: [
            { src: "../assets/images/nescafewhitecoffeepacket-front.webp", flavor: "original", cartImage: true },
            { src: "../assets/images/nescafewhitecoffeepacket-back.webp", flavor: "original" },
            { src: "../assets/images/nescafewhitecoffeepacket-singlefront.webp", flavor: "original" },
            { src: "../assets/images/nescafewhitecoffeepacket-singleback.webp", flavor: "original" },
            { src: "../assets/images/nescafewhitecoffeelesssugar-front.webp", flavor: "less sugar", cartImage: true },
            { src: "../assets/images/nescafewhitecoffeelesssugar-back.webp", flavor: "less sugar" },
            { src: "../assets/images/nescafewhitecoffeepacketlesssugar-front.webp", flavor: "less sugar" },
            { src: "../assets/images/nescafewhitecoffeepacketlesssugar-back.webp", flavor: "less sugar" },
        ],
        sizes: [ "15 sticks"],
        defaultSize: "15 sticks",
        flavors: ["original", "less sugar"],
        defaultFlavor: "Sweet Vanilla",
        packs: ["Single"],
        defaultPack: "Single",
        
        variants: [
            { size: "15 sticks", pack: "Single",     price: "RM 16.90"  },
            
        ],

        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "tea-greentea-nosugar",
        category: "Tea",
        categoryBg: "--teabg",
        name: "Green Tea (No Sugar)",
        price: "RM 4.99",
       
        description: "Refreshing green tea with a light, clean finish. Brewed for a naturally refreshing taste with none of the bitterness of stronger teas.",
        images: [
            {src: "../assets/images/jasminegreentea(no sugar 1500ml).webp",  size: "250ml"},
            {src: "../assets/images/greentea.webp", size: "500ml"}
        ],
        sizes: ["500ml", "1500ml"],
        defaultSize: "500ml",
        flavors: ["No sugar jasmine tea"],
        defaultFlavor: "No sugar jasmine tea",
        packs: ["Single", "Pack of 24"],
        defaultPack: "Single",
        
        variants: [
            { size: "500ml", pack: "Single",     price: "RM 4.99"  },
            { size: "500ml", pack: "Pack of 24",  price: "RM 56.50"  },
            { size: "1500ml", pack: "Single", price: "RM 6.90" },
            { size: "1500ml", pack: "Pack of 24",     price: "RM 160.60"  }
        ],
        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "tea-Oolongtea-nosugar",
        category: "Tea",
        categoryBg: "--teabg",
        name: "Oolong tea",
        price: "RM 2.50",
       
        description: "Smooth and aromatic oolong tea with a balanced taste and a clean finish. Naturally refreshing and enjoyable served chilled or at room temperature.",
        images: [
            { src: "../assets/images/pokka-Oolongtea250ml.webp", size: "250ml" },
            { src: "../assets/images/pokka-Oolongtea500ml.webp", size: "500ml" },
            { src: "../assets/images/pokka-Oolongtea1500ml.webp", size: "1500ml" },
        ],
        sizes: ["250ml","500ml", "1500ml"],
        defaultSize: "250ml",
        flavors: ["Original"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 24"],
        defaultPack: "Single",
        
        variants: [
            { size: "250ml", pack: "Single",     price: "RM 2.50"  },
            { size: "250ml", pack: "Pack of 24",  price: "RM 32.60"  },
            { size: "500ml", pack: "Single",     price: "RM 4.99"  },
            { size: "500ml", pack: "Pack of 24",  price: "RM 59.50"  },
            { size: "1500ml", pack: "Single", price: "RM 6.20" },
            { size: "1500ml", pack: "Pack of 24",     price: "RM 76.05"  }
        ],
        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "juice-orange",
        category: "Juice",
        categoryBg: "--juicebg",
        name: "Orange Juice",
        price: "RM 2.40",
        
        description: "Fruity and refreshing orange juice made from real fruit flavors, packed for a burst of citrus whenever you need it.",
        images: [
            {src: "../assets/images/minutemate-orangecan.webp", size: "Can"},
            {src: "../assets/images/minutemate-orangesmall.png", size: "300ml"},
            {src: "../assets/images/minutemate-orangelarge.png", size: "1L"}
        ],
        sizes: ["Can","300ml", "1L"],
        defaultSize: "Can",
        flavors: ["Original"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 6"],
        defaultPack: "Single",
       
        variants: [
            { size: "Can", pack: "Single",     price: "RM 2.40"  },
            { size: "Can", pack: "Pack of 6",  price: "RM 12.60"  },
            
            { size: "300ml", pack: "Single",     price: "RM 8.50"  },
            { size: "300ml", pack: "Pack of 6",  price: "RM 22.90" },
            
            { size: "1L", pack: "Single",     price: "RM 4.90"   },
            { size: "1L", pack: "Pack of 6",  price: "RM 50.99"  },
           
        ],
        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "juice-apple",
        category: "Juice",
        categoryBg: "--juicebg",
        name: "Apple Juice",
        price: "RM 2.80",
        
        description: "Made from delicious apples for a naturally sweet and refreshing taste. Perfect for enjoying at home, work, or on the go.",
        images: [
            { src: "../assets/images/minutemate-applecan.webp", size: "Can" },
            { src: "../assets/images/minutemate-applecarton.png", size: "Carton" }
        ],
        sizes: ["300ml"],
        defaultSize: "300ml",
        flavors: ["Original"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 12"],
        defaultPack: "Single",
       
        variants: [
            { size: "300ml", pack: "Single",     price: "RM 2.80"  },
            { size: "300ml", pack: "Pack of 6",  price: "RM 24.85" },
           
        ],
        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "soda-fantaorange",
        category: "Soda",
        categoryBg: "--sodabg",
        name: "Fanta",
        price: "RM 1.70",
      
        description: "Fizzy, flavorful orange soda perfect for a refreshing treat any time of day.",
        images: [
            { src: "../assets/images/fantaorange.png", flavor: "Original" },
            { src: "../assets/images/fantaorangezerosugar.png", flavor: "orange (zero sugar)" },
            { src: "../assets/images/fantastrawberry.png", flavor: "strawberry" },
            { src: "../assets/images/fantagrape.png", flavor: "grape" }
        ],
        sizes: ["320ml"],
        defaultSize: "320ml",
        flavors: ["Original", "orange (zero sugar)", "strawberry", "grape"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 6"],
        defaultPack: "Single",
        
        variants: [
            { size: "320ml", pack: "Single",     price: "RM 1.70"  },
            { size: "320ml", pack: "Pack of 6",  price: "RM 19.80" },
           
        ],

        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "functional-redbull",
        category: "Functional Beverage",
        categoryBg: "--functionalbg",
        name: "Red Bull",
        price: "RM 7.50",
       
        description: "Red Bull Energy Drink contains sugar, a fast-absorbing form of carbohydrate involved in a wide range of biological processes and an energy source for the brain and muscles.",
        images: [
            { src: "../assets/images/redbull.webp", pack: "Single" },
            { src: "../assets/images/redbullbox.png", pack: "Pack of 8" }
        ],
        sizes: ["250ml"],
        defaultSize: "250ml",
        flavors: ["Original"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 8"],
        defaultPack: "Single",
        
        variants: [
            { size: "250ml", pack: "Single",     price: "RM 7.50"  },
            { size: "250ml", pack: "Pack of 8",  price: "RM 54.20" },
           
        ],

        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "functional-100plus",
        category: "Functional Beverage",
        categoryBg: "--functionalbg",
        name: "100 plus",
        price: "RM 3.00",
       
        description: "An isotonic drink formulated to help replenish fluids and electrolytes lost through daily activities or exercise. Best enjoyed chilled for maximum refreshment.",
        images: [
            { src: "../assets/images/100plus-all.png", size: "Can" },
            { src: "../assets/images/100plus-Can.png", size: "Can" },
            { src: "../assets/images/100plus-medium.png", size: "500ml" },
            { src: "../assets/images/100plus-large.png", size: "1.5L" }
        ],
        sizes: ["Can","500ml","1.5L"],
        defaultSize: "Can",
        flavors: ["Original"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 24"],
        defaultPack: "Single",
        
        variants: [
            { size: "Can", pack: "Single",     price: "RM 3.00"  },
            { size: "Can", pack: "Pack of 24",  price: "RM 40.05" },
            
            { size: "500ml", pack: "Single",     price: "RM 5.50"  },
            { size: "500ml", pack: "Pack of 24",  price: "RM 72.20" },

            { size: "1.5L", pack: "Single",     price: "RM 7.50"  },
            { size: "1.5L", pack: "Pack of 24",  price: "RM 134.40" },
        ],

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
        images: [
            { src: "../assets/images/farmfresh-small.png", size: "200ml" },
            { src: "../assets/images/farmfresh.png", size: "1L" }
        ],
        sizes: ["200ml", "1L"],
        defaultSize: "200ml",
        flavors: ["Original"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 24"],
        defaultPack: "Single",
    
        variants: [
            { size: "200ml", pack: "Single",     price: "RM 3.50"  },
            { size: "200ml", pack: "Pack of 24",  price: "RM 52.25" },

            { size: "1L", pack: "Single",     price: "RM 8.40"  },
            { size: "1L", pack: "Pack of 24",  price: "RM 168.40" },
        ],

        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "dairy-Oatside-milk",
        category: "Dairy Beverages",
        categoryBg: "--dairybg",
        name: "Oatside Oat Milk",
        price: "RM 3.90",
       
        description: "Creamy enough for a rich mouthfeel, but allowing coffee/tea notes to shine through.",
        images: [
            { src: "../assets/images/Oatside-small.png", size: "180ml" },
            { src: "../assets/images/Oatside-large.webp", size: "1L" }
        ],
        sizes: ["180ml", "1L"],
        defaultSize: "180ml",
        flavors: ["Original"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 24"],
        defaultPack: "Single",
    
        variants: [
            { size: "180ml", pack: "Single",     price: "RM 3.90"  },
            { size: "180ml", pack: "Pack of 24",  price: "RM 55.20" },

            { size: "1L", pack: "Single",     price: "RM 10.40"  },
            { size: "1L", pack: "Pack of 24",  price: "RM 232.60" },
        ],

        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "local-krisantimum",
        category: "Local Beverages",
        categoryBg: "--localdrinkbg",
        name: "Chrysanthemum Tea",
        price: "RM 1.35",
        
        description: "Experience the taste of chrysanthemum tea, a classic local favorite known for its light, floral sweetness.",
        images: [
            { src: "../assets/images/Yeoschrysanthemum-small.png", size: "250ml" },
            { src: "../assets/images/krisantimum.png", size: "300ml" },
            { src: "../assets/images/Yeoschrysanthemum-large.png", size: "1.5L" }
        ],
        sizes: ["250ml","300ml","1.5L" ],
        defaultSize: "300ml",
        flavors: ["Original"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 6"],
        defaultPack: "Single",
       
        variants: [
            { size: "250ml", pack: "Single",     price: "RM 1.35"  },
            { size: "250ml", pack: "Pack of 6",  price: "RM 6.70" },

             { size: "300ml", pack: "Single",     price: "RM 3.30"  },
            { size: "300ml", pack: "Pack of 6",  price: "RM 18.80" },

            { size: "1.5L", pack: "Single",     price: "RM 4.60"  },
            { size: "1.5L", pack: "Pack of 6",  price: "RM 26.60" },
        ],

        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "local-Cincau",
        category: "Local Beverages",
        categoryBg: "--localdrinkbg",
        name: "Cincau",
        price: "RM 1.36",
        
        description: "A refreshing grass jelly drink with a light herbal sweetness. A classic local favorite that is delicious served cold on hot days.",
        images: [
            { src: "../assets/images/Seasonscincau-Can.png", pack: "Single" },
            { src: "../assets/images/Seasonscincau-carton.png", pack: "Pack of 24" }
        ],
        sizes: ["300ml"],
        defaultSize: "300ml",
        flavors: ["Original"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 24"],
        defaultPack: "Single",
       
        variants: [
            { size: "300ml", pack: "Single",     price: "RM 1.36"  },
            { size: "300ml", pack: "Pack of 24",  price: "RM 28.50" },
        ],

        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "alcoholic-changbeer",
        category: "Alcoholic Beverages",
        categoryBg: "--otherbg",
        name: "Chang Beer",
        price: "RM 8.90",
      
        description: "A smooth and crisp lager with a refreshing finish. Brewed for an easy-drinking experience that's perfect for relaxing or sharing with friends.",
        images: [
            { src: "../assets/images/changbeer-Can.webp", size: "320ml (Can)" },
            { src: "../assets/images/changbeer-medium.webp", size: "320ml (bottle)" },
            { src: "../assets/images/changbeer.webp", size: "320ml (bottle)" },
            { src: "../assets/images/changbeer-large.webp", size: "620ml" },
        ],
        sizes: ["320ml (Can)","320ml (bottle)" , "620ml"],
        defaultSize: "320ml (Can)",
        flavors: ["Cold Brew","Original"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 24"],
        defaultPack: "Single",
      
        variants: [
            { size: "320ml (Can)", pack: "Single",     price: "RM 8.90"  },
            { size: "320ml (Can)", pack: "Pack of 24",  price: "RM 145.00" },

            { size: "320ml (bottle)", pack: "Single",     price: "RM 12.20"  },
            { size: "320ml (bottle)", pack: "Pack of 24",  price: "RM 224.60" },

            { size: "620ml", pack: "Single",     price: "RM 15.20"  },
            { size: "620ml", pack: "Pack of 24",  price: "RM 320.80" },
        ],

        availability: "In Stock",
        delivery: "2–4 working days",
    },
    {
        id: "alcoholic-1664",
        category: "Alcoholic Beverages",
        categoryBg: "--otherbg",
        name: "1664 Blanc",
        price: "RM 8.90",
      
        description: "A premium French wheat beer with delicate citrus notes and a smooth, refreshing finish. Light, fruity, and easy to enjoy.",
        images: [
            { src: "../assets/images/1664-Can.png", size: "320ml (Can)" },
            { src: "../assets/images/1664-bottle.png", size: "320ml (bottle)" },
            { src: "../assets/images/1664-Canrose.png", flavor: "Rose" },
        ],
        sizes: ["320ml (Can)","320ml (bottle)"],
        defaultSize: "320ml (Can)",
        flavors: ["Original", "Rose"],
        defaultFlavor: "Original",
        packs: ["Single", "Pack of 24"],
        defaultPack: "Single",
      
        variants: [
            { size: "320ml (Can)", pack: "Single",     price: "RM 9.95"  },
            { size: "320ml (Can)", pack: "Pack of 24",  price: "RM 217.90" },

            { size: "320ml (bottle)", pack: "Single",     price: "RM 13.99"  },
            { size: "320ml (bottle)", pack: "Pack of 24",  price: "RM 289.90" },
        ],

        availability: "In Stock",
        delivery: "2–4 working days",
    },
];