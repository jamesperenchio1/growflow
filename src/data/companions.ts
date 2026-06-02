import { CompanionRelation } from '@/types';

export const companionRelations: CompanionRelation[] = [
  // Tomato
  { plantA: 'Tomato', plantB: 'Basil', relationship: 'beneficial', reason: 'Basil repels whiteflies and aphids; may improve tomato flavor.' },
  { plantA: 'Tomato', plantB: 'Marigold', relationship: 'beneficial', reason: 'Marigold roots exude compounds toxic to root-knot nematodes.' },
  { plantA: 'Tomato', plantB: 'Carrot', relationship: 'beneficial', reason: 'Carrots loosen soil around tomato roots; tomatoes provide shade.' },
  { plantA: 'Tomato', plantB: 'Onion', relationship: 'beneficial', reason: 'Onions repel pests with strong sulfur compounds.' },
  { plantA: 'Tomato', plantB: 'Parsley', relationship: 'beneficial', reason: 'Parsley attracts predatory wasps and hoverflies.' },
  { plantA: 'Tomato', plantB: 'Nasturtium', relationship: 'beneficial', reason: 'Nasturtiums trap aphids away from tomatoes.' },
  { plantA: 'Tomato', plantB: 'Asparagus', relationship: 'beneficial', reason: 'Tomatoes repel asparagus beetles.' },
  { plantA: 'Tomato', plantB: 'Chives', relationship: 'beneficial', reason: 'Chives repel aphids and improve growth.' },
  { plantA: 'Tomato', plantB: 'Fennel', relationship: 'harmful', reason: 'Fennel secretes allelopathic compounds that inhibit tomato growth.' },
  { plantA: 'Tomato', plantB: 'Corn', relationship: 'harmful', reason: 'Corn earworm attacks both crops; corn blocks tomato sunlight.' },
  { plantA: 'Tomato', plantB: 'Potato', relationship: 'harmful', reason: 'Both are Solanaceae and susceptible to early/late blight.' },
  { plantA: 'Tomato', plantB: 'Dill', relationship: 'harmful', reason: 'Mature dill inhibits tomato growth.' },

  // Basil / Thai Basil
  { plantA: 'Thai Basil', plantB: 'Tomato', relationship: 'beneficial', reason: 'Basil repels flies and mosquitoes, improves tomato flavor.' },
  { plantA: 'Thai Basil', plantB: 'Bell Pepper', relationship: 'beneficial', reason: 'Basil repels aphids, spider mites, and flies.' },
  { plantA: 'Thai Basil', plantB: 'Eggplant', relationship: 'beneficial', reason: 'Basil deters flea beetles and aphids.' },
  { plantA: 'Thai Basil', plantB: 'Marigold', relationship: 'beneficial', reason: 'Combined pest deterrent effect.' },
  { plantA: 'Thai Basil', plantB: 'Rue', relationship: 'harmful', reason: 'Inhibits growth of both plants.' },
  { plantA: 'Thai Basil', plantB: 'Sage', relationship: 'harmful', reason: 'Competing aromatic oils inhibit growth.' },
  { plantA: 'Sweet Basil', plantB: 'Tomato', relationship: 'beneficial', reason: 'Repels flies and mosquitoes, improves flavor.' },
  { plantA: 'Sweet Basil', plantB: 'Asparagus', relationship: 'beneficial', reason: 'Repels asparagus beetles.' },
  { plantA: 'Holy Basil', plantB: 'Tomato', relationship: 'beneficial', reason: 'Repels pests and attracts pollinators.' },

  // Chili / Pepper
  { plantA: 'Bird Chili', plantB: 'Marigold', relationship: 'beneficial', reason: 'Marigold roots deter nematodes that attack chili roots.' },
  { plantA: 'Bird Chili', plantB: 'Basil', relationship: 'beneficial', reason: 'Basil repels aphids and whitefly from peppers.' },
  { plantA: 'Bird Chili', plantB: 'Onion', relationship: 'beneficial', reason: 'Onions repel aphids and thrips.' },
  { plantA: 'Bird Chili', plantB: 'Carrot', relationship: 'beneficial', reason: 'Carrots loosen soil around chili roots.' },
  { plantA: 'Bird Chili', plantB: 'Fennel', relationship: 'harmful', reason: 'Fennel inhibits growth of nearby plants.' },
  { plantA: 'Bird Chili', plantB: 'Beans', relationship: 'harmful', reason: 'Beans can spread bean rust to peppers.' },
  { plantA: 'Thai Chili', plantB: 'Basil', relationship: 'beneficial', reason: 'Basil repels aphids and whitefly.' },
  { plantA: 'Bell Pepper', plantB: 'Basil', relationship: 'beneficial', reason: 'Basil repels aphids and spider mites.' },
  { plantA: 'Bell Pepper', plantB: 'Onion', relationship: 'beneficial', reason: 'Onions repel aphids and thrips.' },
  { plantA: 'Bell Pepper', plantB: 'Carrot', relationship: 'beneficial', reason: 'Carrots loosen soil.' },
  { plantA: 'Bell Pepper', plantB: 'Fennel', relationship: 'harmful', reason: 'Fennel inhibits pepper growth.' },

  // Cucumber
  { plantA: 'Cucumber', plantB: 'Nasturtium', relationship: 'beneficial', reason: 'Nasturtiums trap cucumber beetles and aphids.' },
  { plantA: 'Cucumber', plantB: 'Corn', relationship: 'beneficial', reason: 'Corn provides partial shade and support.' },
  { plantA: 'Cucumber', plantB: 'Radish', relationship: 'beneficial', reason: 'Radishes deter cucumber beetles when interplanted.' },
  { plantA: 'Cucumber', plantB: 'Beans', relationship: 'beneficial', reason: 'Beans fix nitrogen for cucumbers.' },
  { plantA: 'Cucumber', plantB: 'Marigold', relationship: 'beneficial', reason: 'Marigold repels nematodes and beetles.' },
  { plantA: 'Cucumber', plantB: 'Potato', relationship: 'harmful', reason: 'Potatoes attract similar fungal diseases and pests.' },

  // Lettuce
  { plantA: 'Lettuce', plantB: 'Carrot', relationship: 'beneficial', reason: 'Carrots break up soil; lettuce provides living mulch.' },
  { plantA: 'Lettuce', plantB: 'Radish', relationship: 'beneficial', reason: 'Radishes mature quickly and mark lettuce rows.' },
  { plantA: 'Lettuce', plantB: 'Strawberry', relationship: 'beneficial', reason: 'Strawberries act as living mulch.' },
  { plantA: 'Lettuce', plantB: 'Cucumber', relationship: 'beneficial', reason: 'Cucumber shade keeps lettuce cool.' },
  { plantA: 'Lettuce', plantB: 'Celery', relationship: 'harmful', reason: 'Celery competes for similar nutrients.' },

  // Spinach
  { plantA: 'Spinach', plantB: 'Strawberry', relationship: 'beneficial', reason: 'Strawberries act as ground cover.' },
  { plantA: 'Spinach', plantB: 'Peas', relationship: 'beneficial', reason: 'Peas fix nitrogen in soil.' },
  { plantA: 'Spinach', plantB: 'Beans', relationship: 'beneficial', reason: 'Beans fix nitrogen in soil.' },
  { plantA: 'Spinach', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Cabbage shade extends spinach season.' },
  { plantA: 'Spinach', plantB: 'Potato', relationship: 'harmful', reason: 'Potatoes compete for nutrients.' },

  // Carrot
  { plantA: 'Carrot', plantB: 'Onion', relationship: 'beneficial', reason: 'Onions deter carrot fly with sulfur compounds.' },
  { plantA: 'Carrot', plantB: 'Leek', relationship: 'beneficial', reason: 'Leeks repel carrot fly.' },
  { plantA: 'Carrot', plantB: 'Lettuce', relationship: 'beneficial', reason: 'Lettuce loosens soil for carrots.' },
  { plantA: 'Carrot', plantB: 'Peas', relationship: 'beneficial', reason: 'Peas fix nitrogen.' },
  { plantA: 'Carrot', plantB: 'Tomato', relationship: 'beneficial', reason: 'Tomatoes produce solanine that repels pests.' },
  { plantA: 'Carrot', plantB: 'Dill', relationship: 'harmful', reason: 'Dill can stunt carrot growth.' },
  { plantA: 'Carrot', plantB: 'Parsnip', relationship: 'harmful', reason: 'Same pests and diseases.' },

  // Onion / Garlic / Leek
  { plantA: 'Onion', plantB: 'Broccoli', relationship: 'beneficial', reason: 'Onions deter cabbage pests with sulfur compounds.' },
  { plantA: 'Onion', plantB: 'Carrot', relationship: 'beneficial', reason: 'Onions repel carrot fly.' },
  { plantA: 'Onion', plantB: 'Lettuce', relationship: 'beneficial', reason: 'Onions deter lettuce pests.' },
  { plantA: 'Onion', plantB: 'Beetroot', relationship: 'beneficial', reason: 'Onions deter pests from beets.' },
  { plantA: 'Onion', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Onions repel cabbage worms.' },
  { plantA: 'Onion', plantB: 'Strawberry', relationship: 'beneficial', reason: 'Onions deter strawberry pests.' },
  { plantA: 'Onion', plantB: 'Beans', relationship: 'harmful', reason: 'Onions inhibit legume nitrogen fixation.' },
  { plantA: 'Onion', plantB: 'Peas', relationship: 'harmful', reason: 'Onions stunt pea growth.' },
  { plantA: 'Garlic', plantB: 'Tomato', relationship: 'beneficial', reason: 'Garlic repels red spider mites.' },
  { plantA: 'Garlic', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Garlic repels cabbage worms and aphids.' },
  { plantA: 'Garlic', plantB: 'Carrot', relationship: 'beneficial', reason: 'Garlic repels carrot fly.' },
  { plantA: 'Garlic', plantB: 'Rose', relationship: 'beneficial', reason: 'Garlic repels aphids and black spot.' },
  { plantA: 'Garlic', plantB: 'Raspberry', relationship: 'beneficial', reason: 'Garlic deters raspberry pests.' },
  { plantA: 'Garlic', plantB: 'Beans', relationship: 'harmful', reason: 'Garlic inhibits bean growth.' },
  { plantA: 'Garlic', plantB: 'Peas', relationship: 'harmful', reason: 'Garlic inhibits pea growth.' },
  { plantA: 'Leek', plantB: 'Carrot', relationship: 'beneficial', reason: 'Leeks repel carrot fly.' },
  { plantA: 'Leek', plantB: 'Celery', relationship: 'beneficial', reason: 'Leeks repel celery pests.' },
  { plantA: 'Shallot', plantB: 'Carrot', relationship: 'beneficial', reason: 'Shallots repel carrot fly.' },
  { plantA: 'Spring Onion', plantB: 'Carrot', relationship: 'beneficial', reason: 'Spring onions repel carrot fly.' },

  // Cabbage family
  { plantA: 'Cabbage', plantB: 'Dill', relationship: 'beneficial', reason: 'Dill attracts beneficial wasps.' },
  { plantA: 'Cabbage', plantB: 'Mint', relationship: 'beneficial', reason: 'Mint repels cabbage moths and ants.' },
  { plantA: 'Cabbage', plantB: 'Thyme', relationship: 'beneficial', reason: 'Thyme repels cabbage worms.' },
  { plantA: 'Cabbage', plantB: 'Sage', relationship: 'beneficial', reason: 'Sage repels cabbage moths and flea beetles.' },
  { plantA: 'Cabbage', plantB: 'Rosemary', relationship: 'beneficial', reason: 'Rosemary repels cabbage moths.' },
  { plantA: 'Cabbage', plantB: 'Nasturtium', relationship: 'beneficial', reason: 'Nasturtium traps aphids and cabbage worms.' },
  { plantA: 'Cabbage', plantB: 'Strawberry', relationship: 'harmful', reason: 'Strawberries attract slugs to cabbage.' },
  { plantA: 'Cabbage', plantB: 'Tomato', relationship: 'harmful', reason: 'Tomatoes inhibit cabbage growth.' },
  { plantA: 'Broccoli', plantB: 'Dill', relationship: 'beneficial', reason: 'Dill attracts beneficial wasps.' },
  { plantA: 'Broccoli', plantB: 'Celery', relationship: 'beneficial', reason: 'Celery repels cabbage white butterflies.' },
  { plantA: 'Broccoli', plantB: 'Chamomile', relationship: 'beneficial', reason: 'Improves flavor and attracts beneficials.' },
  { plantA: 'Cauliflower', plantB: 'Celery', relationship: 'beneficial', reason: 'Celery repels cabbage white butterflies.' },
  { plantA: 'Cauliflower', plantB: 'Sage', relationship: 'beneficial', reason: 'Sage repels cabbage moths.' },
  { plantA: 'Brussels Sprouts', plantB: 'Sage', relationship: 'beneficial', reason: 'Sage repels cabbage moths.' },
  { plantA: 'Kale', plantB: 'Beetroot', relationship: 'beneficial', reason: 'Beets improve kale growth.' },
  { plantA: 'Kale', plantB: 'Onion', relationship: 'beneficial', reason: 'Onions repel kale pests.' },
  { plantA: 'Kale', plantB: 'Strawberry', relationship: 'harmful', reason: 'Strawberries attract slugs.' },
  { plantA: 'Kale', plantB: 'Bean', relationship: 'harmful', reason: 'Beans stunt kale growth.' },
  { plantA: 'Bok Choy', plantB: 'Carrot', relationship: 'beneficial', reason: 'Carrots loosen soil.' },
  { plantA: 'Bok Choy', plantB: 'Onion', relationship: 'beneficial', reason: 'Onions repel bok choy pests.' },
  { plantA: 'Bok Choy', plantB: 'Strawberry', relationship: 'harmful', reason: 'Strawberries attract slugs.' },

  // Beans / Peas
  { plantA: 'Green Beans', plantB: 'Corn', relationship: 'beneficial', reason: 'Beans climb corn; corn provides support.' },
  { plantA: 'Green Beans', plantB: 'Cucumber', relationship: 'beneficial', reason: 'Mutual growth promotion.' },
  { plantA: 'Green Beans', plantB: 'Potato', relationship: 'beneficial', reason: 'Potatoes deter bean beetles.' },
  { plantA: 'Green Beans', plantB: 'Radish', relationship: 'beneficial', reason: 'Radishes deter bean beetles.' },
  { plantA: 'Green Beans', plantB: 'Sunflower', relationship: 'harmful', reason: 'Sunflowers inhibit bean growth.' },
  { plantA: 'Green Beans', plantB: 'Fennel', relationship: 'harmful', reason: 'Fennel inhibits bean growth.' },
  { plantA: 'Long Bean', plantB: 'Corn', relationship: 'beneficial', reason: 'Long beans climb corn stalks.' },
  { plantA: 'Long Bean', plantB: 'Okra', relationship: 'beneficial', reason: 'Okra provides light shade for bean roots.' },
  { plantA: 'Peas', plantB: 'Carrot', relationship: 'beneficial', reason: 'Carrots loosen soil.' },
  { plantA: 'Peas', plantB: 'Radish', relationship: 'beneficial', reason: 'Radishes deter pea pests.' },
  { plantA: 'Peas', plantB: 'Cucumber', relationship: 'beneficial', reason: 'Cucumbers provide shade.' },
  { plantA: 'Peas', plantB: 'Corn', relationship: 'beneficial', reason: 'Peas fix nitrogen for corn.' },
  { plantA: 'Snow Peas', plantB: 'Carrot', relationship: 'beneficial', reason: 'Carrots loosen soil.' },

  // Potato
  { plantA: 'Potato', plantB: 'Beans', relationship: 'beneficial', reason: 'Beans fix nitrogen that benefits potatoes.' },
  { plantA: 'Potato', plantB: 'Horseradish', relationship: 'beneficial', reason: 'Horseradish increases disease resistance.' },
  { plantA: 'Potato', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Cabbage deters potato pests.' },
  { plantA: 'Potato', plantB: 'Tomato', relationship: 'harmful', reason: 'Both susceptible to late blight.' },
  { plantA: 'Potato', plantB: 'Sunflower', relationship: 'harmful', reason: 'Sunflowers stunt potato growth.' },
  { plantA: 'Potato', plantB: 'Cucumber', relationship: 'harmful', reason: 'Cucumbers encourage potato blight.' },
  { plantA: 'Potato', plantB: 'Raspberry', relationship: 'harmful', reason: 'Shared pests and diseases.' },

  // Squash / Pumpkin / Zucchini
  { plantA: 'Zucchini', plantB: 'Nasturtium', relationship: 'beneficial', reason: 'Nasturtium traps squash bugs.' },
  { plantA: 'Zucchini', plantB: 'Marigold', relationship: 'beneficial', reason: 'Marigold repels nematodes and beetles.' },
  { plantA: 'Pumpkin', plantB: 'Nasturtium', relationship: 'beneficial', reason: 'Nasturtium traps squash bugs.' },
  { plantA: 'Pumpkin', plantB: 'Corn', relationship: 'beneficial', reason: 'Corn provides shade and windbreak.' },
  { plantA: 'Pumpkin', plantB: 'Beans', relationship: 'beneficial', reason: 'Beans fix nitrogen.' },
  { plantA: 'Zucchini', plantB: 'Potato', relationship: 'harmful', reason: 'Potatoes attract similar pests.' },
  { plantA: 'Sweet Potato', plantB: 'Squash', relationship: 'harmful', reason: 'Both are vines that compete aggressively.' },
  { plantA: 'Sweet Potato', plantB: 'Corn', relationship: 'beneficial', reason: 'Corn provides support.' },

  // Melon / Watermelon
  { plantA: 'Melon', plantB: 'Nasturtium', relationship: 'beneficial', reason: 'Nasturtium repels melon aphids.' },
  { plantA: 'Watermelon', plantB: 'Nasturtium', relationship: 'beneficial', reason: 'Nasturtium repels aphids and beetles.' },
  { plantA: 'Melon', plantB: 'Corn', relationship: 'beneficial', reason: 'Corn provides shade.' },

  // Herbs
  { plantA: 'Dill', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Dill attracts beneficial wasps.' },
  { plantA: 'Dill', plantB: 'Corn', relationship: 'beneficial', reason: 'Dill attracts beneficial insects.' },
  { plantA: 'Dill', plantB: 'Cucumber', relationship: 'beneficial', reason: 'Dill attracts cucumber pest predators.' },
  { plantA: 'Dill', plantB: 'Lettuce', relationship: 'beneficial', reason: 'Dill improves lettuce growth.' },
  { plantA: 'Dill', plantB: 'Carrot', relationship: 'harmful', reason: 'Dill can stunt carrot growth.' },
  { plantA: 'Dill', plantB: 'Tomato', relationship: 'harmful', reason: 'Mature dill inhibits tomato growth.' },
  { plantA: 'Parsley', plantB: 'Asparagus', relationship: 'beneficial', reason: 'Parsley deters asparagus beetles.' },
  { plantA: 'Parsley', plantB: 'Rose', relationship: 'beneficial', reason: 'Parsley improves rose health.' },
  { plantA: 'Parsley', plantB: 'Tomato', relationship: 'beneficial', reason: 'Parsley attracts beneficial insects.' },
  { plantA: 'Parsley', plantB: 'Mint', relationship: 'harmful', reason: 'Mint overgrows parsley.' },
  { plantA: 'Chives', plantB: 'Tomato', relationship: 'beneficial', reason: 'Chives repel aphids and improve growth.' },
  { plantA: 'Chives', plantB: 'Carrot', relationship: 'beneficial', reason: 'Chives improve carrot growth and flavor.' },
  { plantA: 'Chives', plantB: 'Rose', relationship: 'beneficial', reason: 'Chives deter rose pests and black spot.' },
  { plantA: 'Chives', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Chives repel cabbage pests.' },
  { plantA: 'Rosemary', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Rosemary repels cabbage moths.' },
  { plantA: 'Rosemary', plantB: 'Beans', relationship: 'beneficial', reason: 'Rosemary repels bean beetles.' },
  { plantA: 'Rosemary', plantB: 'Carrot', relationship: 'beneficial', reason: 'Rosemary repels carrot fly.' },
  { plantA: 'Rosemary', plantB: 'Sage', relationship: 'beneficial', reason: 'Similar growing conditions.' },
  { plantA: 'Thyme', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Thyme repels cabbage worms.' },
  { plantA: 'Thyme', plantB: 'Strawberry', relationship: 'beneficial', reason: 'Thyme deters worms and improves growth.' },
  { plantA: 'Thyme', plantB: 'Tomato', relationship: 'beneficial', reason: 'Thyme repels tomato hornworms.' },
  { plantA: 'Oregano', plantB: 'Tomato', relationship: 'beneficial', reason: 'Oregano repels aphids and spider mites.' },
  { plantA: 'Oregano', plantB: 'Pepper', relationship: 'beneficial', reason: 'Oregano repels pepper pests.' },
  { plantA: 'Sage', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Sage repels cabbage moths and flea beetles.' },
  { plantA: 'Sage', plantB: 'Carrot', relationship: 'beneficial', reason: 'Sage repels carrot fly.' },
  { plantA: 'Sage', plantB: 'Strawberry', relationship: 'beneficial', reason: 'Sage deters slugs.' },
  { plantA: 'Sage', plantB: 'Cucumber', relationship: 'harmful', reason: 'Sage inhibits cucumber growth.' },
  { plantA: 'Mint', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Mint repels cabbage moths and ants.' },
  { plantA: 'Mint', plantB: 'Tomato', relationship: 'beneficial', reason: 'Mint repels tomato hornworms.' },
  { plantA: 'Mint', plantB: 'Peas', relationship: 'beneficial', reason: 'Mint repels pea pests.' },
  { plantA: 'Mint', plantB: 'Parsley', relationship: 'harmful', reason: 'Mint overgrows parsley.' },
  { plantA: 'Lavender', plantB: 'Rose', relationship: 'beneficial', reason: 'Lavender deters aphids from roses.' },
  { plantA: 'Chamomile', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Chamomile improves cabbage flavor.' },
  { plantA: 'Marjoram', plantB: 'Tomato', relationship: 'beneficial', reason: 'Marjoram improves tomato flavor.' },
  { plantA: 'Lemon Balm', plantB: 'Tomato', relationship: 'beneficial', reason: 'Lemon balm attracts pollinators.' },
  { plantA: 'Coriander', plantB: 'Spinach', relationship: 'beneficial', reason: 'Coriander deters spinach pests.' },
  { plantA: 'Coriander', plantB: 'Anise', relationship: 'beneficial', reason: 'Anise improves coriander growth.' },
  { plantA: 'Coriander', plantB: 'Fennel', relationship: 'harmful', reason: 'Fennel inhibits coriander.' },
  { plantA: 'Lemongrass', plantB: 'Thai Eggplant', relationship: 'beneficial', reason: 'Lemongrass deters aphids and whitefly.' },
  { plantA: 'Turmeric', plantB: 'Banana', relationship: 'beneficial', reason: 'Turmeric grows well in banana shade.' },
  { plantA: 'Galangal', plantB: 'Turmeric', relationship: 'beneficial', reason: 'Both rhizome crops thrive in similar conditions.' },

  // Strawberry
  { plantA: 'Strawberry', plantB: 'Thyme', relationship: 'beneficial', reason: 'Thyme deters worms and improves growth.' },
  { plantA: 'Strawberry', plantB: 'Sage', relationship: 'beneficial', reason: 'Sage deters slugs and pests.' },
  { plantA: 'Strawberry', plantB: 'Borage', relationship: 'beneficial', reason: 'Borage attracts pollinators and deters pests.' },
  { plantA: 'Strawberry', plantB: 'Lettuce', relationship: 'beneficial', reason: 'Lettuce acts as living mulch.' },
  { plantA: 'Strawberry', plantB: 'Spinach', relationship: 'beneficial', reason: 'Spinach acts as ground cover.' },
  { plantA: 'Strawberry', plantB: 'Cabbage', relationship: 'harmful', reason: 'Cabbage inhibits strawberry growth.' },
  { plantA: 'Strawberry', plantB: 'Broccoli', relationship: 'harmful', reason: 'Broccoli inhibits strawberry growth.' },
  { plantA: 'Strawberry', plantB: 'Tomato', relationship: 'harmful', reason: 'Tomatoes inhibit strawberry growth.' },

  // Corn
  { plantA: 'Corn', plantB: 'Pumpkin', relationship: 'beneficial', reason: 'Pumpkin vines shade soil, suppressing weeds.' },
  { plantA: 'Corn', plantB: 'Squash', relationship: 'beneficial', reason: 'Squash suppresses weeds and retains moisture.' },
  { plantA: 'Corn', plantB: 'Melon', relationship: 'beneficial', reason: 'Melons use corn as trellis.' },
  { plantA: 'Corn', plantB: 'Celery', relationship: 'harmful', reason: 'Celery and corn compete for nutrients.' },

  // Eggplant / Okra
  { plantA: 'Eggplant', plantB: 'Thai Basil', relationship: 'beneficial', reason: 'Basil repels flea beetles and aphids.' },
  { plantA: 'Eggplant', plantB: 'Spinach', relationship: 'beneficial', reason: 'Spinach shades eggplant roots.' },
  { plantA: 'Okra', plantB: 'Pepper', relationship: 'beneficial', reason: 'Peppers deter pests from okra.' },
  { plantA: 'Okra', plantB: 'Basil', relationship: 'beneficial', reason: 'Basil repels pests.' },
  { plantA: 'Okra', plantB: 'Melon', relationship: 'beneficial', reason: 'Melons shade okra roots.' },

  // Asparagus
  { plantA: 'Asparagus', plantB: 'Tomato', relationship: 'beneficial', reason: 'Tomatoes repel asparagus beetles.' },
  { plantA: 'Asparagus', plantB: 'Parsley', relationship: 'beneficial', reason: 'Parsley deters asparagus beetles.' },
  { plantA: 'Asparagus', plantB: 'Basil', relationship: 'beneficial', reason: 'Basil repels asparagus beetles.' },

  // Radish / Beetroot / Turnip
  { plantA: 'Radish', plantB: 'Cucumber', relationship: 'beneficial', reason: 'Radishes deter cucumber beetles.' },
  { plantA: 'Radish', plantB: 'Lettuce', relationship: 'beneficial', reason: 'Radishes mark lettuce rows.' },
  { plantA: 'Radish', plantB: 'Peas', relationship: 'beneficial', reason: 'Peas fix nitrogen.' },
  { plantA: 'Beetroot', plantB: 'Kohlrabi', relationship: 'beneficial', reason: 'Complementary growth habits.' },
  { plantA: 'Beetroot', plantB: 'Lettuce', relationship: 'beneficial', reason: 'Lettuce provides shade for beet roots.' },
  { plantA: 'Beetroot', plantB: 'Pole Bean', relationship: 'harmful', reason: 'Beans stunt beet growth.' },
  { plantA: 'Turnip', plantB: 'Peas', relationship: 'beneficial', reason: 'Peas fix nitrogen.' },
  { plantA: 'Turnip', plantB: 'Potato', relationship: 'harmful', reason: 'Potatoes stunt turnip growth.' },

  // Celery
  { plantA: 'Celery', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Celery repels cabbage white butterflies.' },
  { plantA: 'Celery', plantB: 'Cauliflower', relationship: 'beneficial', reason: 'Celery repels cabbage white butterflies.' },
  { plantA: 'Celery', plantB: 'Leek', relationship: 'beneficial', reason: 'Leeks repel celery pests.' },
  { plantA: 'Celery', plantB: 'Tomato', relationship: 'beneficial', reason: 'Tomatoes repel celery pests.' },
  { plantA: 'Celery', plantB: 'Corn', relationship: 'harmful', reason: 'Compete for nutrients.' },
  { plantA: 'Celery', plantB: 'Potato', relationship: 'harmful', reason: 'Shared pests and diseases.' },

  // Swiss Chard
  { plantA: 'Swiss Chard', plantB: 'Onion', relationship: 'beneficial', reason: 'Onions repel chard pests.' },
  { plantA: 'Swiss Chard', plantB: 'Bean', relationship: 'beneficial', reason: 'Beans fix nitrogen.' },

  // Fennel
  { plantA: 'Fennel', plantB: 'Dill', relationship: 'beneficial', reason: 'Similar growing habits.' },
  { plantA: 'Fennel', plantB: 'Coriander', relationship: 'beneficial', reason: 'Similar growing habits.' },
  { plantA: 'Fennel', plantB: 'Tomato', relationship: 'harmful', reason: 'Fennel inhibits tomato growth.' },
  { plantA: 'Fennel', plantB: 'Beans', relationship: 'harmful', reason: 'Fennel inhibits bean growth.' },
  { plantA: 'Fennel', plantB: 'Pepper', relationship: 'harmful', reason: 'Fennel inhibits pepper growth.' },
  { plantA: 'Fennel', plantB: 'Cucumber', relationship: 'harmful', reason: 'Fennel inhibits cucumber growth.' },

  // Ginger
  { plantA: 'Ginger', plantB: 'Chili', relationship: 'beneficial', reason: 'Chili deters ginger pests.' },
  { plantA: 'Ginger', plantB: 'Eggplant', relationship: 'beneficial', reason: 'Eggplant shades ginger.' },

  // Morning Glory
  { plantA: 'Morning Glory', plantB: 'Long Bean', relationship: 'beneficial', reason: 'Different root zones reduce competition.' },
  { plantA: 'Morning Glory', plantB: 'Sweet Potato', relationship: 'harmful', reason: 'Both are Ipomoea species; compete for space.' },

  // Bitter Melon
  { plantA: 'Bitter Melon', plantB: 'Nasturtium', relationship: 'beneficial', reason: 'Nasturtium traps aphids away from melon vines.' },

  // Papaya / Banana / Mango
  { plantA: 'Papaya', plantB: 'Banana', relationship: 'beneficial', reason: 'Banana provides windbreak.' },
  { plantA: 'Papaya', plantB: 'Beans', relationship: 'beneficial', reason: 'Beans fix nitrogen.' },
  { plantA: 'Banana', plantB: 'Beans', relationship: 'beneficial', reason: 'Beans fix nitrogen.' },
  { plantA: 'Banana', plantB: 'Sweet Potato', relationship: 'beneficial', reason: 'Sweet potato suppresses weeds.' },
  { plantA: 'Mango', plantB: 'Papaya', relationship: 'beneficial', reason: 'Papaya provides early windbreak.' },
  { plantA: 'Mango', plantB: 'Beans', relationship: 'beneficial', reason: 'Beans fix nitrogen.' },

  // Lime / Citrus
  { plantA: 'Lime', plantB: 'Basil', relationship: 'beneficial', reason: 'Basil repels citrus pests.' },
  { plantA: 'Lime', plantB: 'Marigold', relationship: 'beneficial', reason: 'Marigold repels nematodes.' },

  // Fruit trees
  { plantA: 'Apple', plantB: 'Chives', relationship: 'beneficial', reason: 'Chives deter apple scab and aphids.' },
  { plantA: 'Apple', plantB: 'Nasturtium', relationship: 'beneficial', reason: 'Nasturtium traps apple pests.' },
  { plantA: 'Grape', plantB: 'Hyssop', relationship: 'beneficial', reason: 'Hyssop deters grape pests.' },
  { plantA: 'Grape', plantB: 'Beans', relationship: 'beneficial', reason: 'Beans fix nitrogen.' },
  { plantA: 'Grape', plantB: 'Cabbage', relationship: 'harmful', reason: 'Cabbage inhibits grape growth.' },
  { plantA: 'Blueberry', plantB: 'Strawberry', relationship: 'beneficial', reason: 'Strawberries act as ground cover.' },
  { plantA: 'Blueberry', plantB: 'Thyme', relationship: 'beneficial', reason: 'Thyme improves blueberry growth.' },
  { plantA: 'Blueberry', plantB: 'Tomato', relationship: 'harmful', reason: 'Tomatoes stunt blueberry growth.' },
  { plantA: 'Raspberry', plantB: 'Garlic', relationship: 'beneficial', reason: 'Garlic deters raspberry pests.' },
  { plantA: 'Blackberry', plantB: 'Garlic', relationship: 'beneficial', reason: 'Garlic deters blackberry pests.' },
  { plantA: 'Pineapple', plantB: 'Papaya', relationship: 'beneficial', reason: 'Papaya provides shade.' },
  { plantA: 'Avocado', plantB: 'Basil', relationship: 'beneficial', reason: 'Basil repels avocado pests.' },

  // Flowers
  { plantA: 'Marigold', plantB: 'Tomato', relationship: 'beneficial', reason: 'Marigold repels nematodes and whiteflies.' },
  { plantA: 'Marigold', plantB: 'Pepper', relationship: 'beneficial', reason: 'Marigold repels nematodes.' },
  { plantA: 'Marigold', plantB: 'Eggplant', relationship: 'beneficial', reason: 'Marigold repels nematodes.' },
  { plantA: 'Marigold', plantB: 'Cucumber', relationship: 'beneficial', reason: 'Marigold repels beetles.' },
  { plantA: 'Marigold', plantB: 'Bean', relationship: 'harmful', reason: 'Marigold can inhibit bean growth.' },
  { plantA: 'Nasturtium', plantB: 'Tomato', relationship: 'beneficial', reason: 'Nasturtium traps aphids.' },
  { plantA: 'Nasturtium', plantB: 'Cabbage', relationship: 'beneficial', reason: 'Nasturtium traps cabbage pests.' },
  { plantA: 'Nasturtium', plantB: 'Broccoli', relationship: 'beneficial', reason: 'Nasturtium traps aphids.' },
  { plantA: 'Nasturtium', plantB: 'Squash', relationship: 'beneficial', reason: 'Nasturtium traps squash bugs.' },
  { plantA: 'Nasturtium', plantB: 'Pumpkin', relationship: 'beneficial', reason: 'Nasturtium traps squash bugs.' },
  { plantA: 'Nasturtium', plantB: 'Melon', relationship: 'beneficial', reason: 'Nasturtium repels melon aphids.' },
  { plantA: 'Nasturtium', plantB: 'Fennel', relationship: 'harmful', reason: 'Fennel inhibits nasturtium.' },
  { plantA: 'Borage', plantB: 'Tomato', relationship: 'beneficial', reason: 'Borage deters tomato hornworms.' },
  { plantA: 'Borage', plantB: 'Strawberry', relationship: 'beneficial', reason: 'Borage improves strawberry flavor.' },
  { plantA: 'Sunflower', plantB: 'Corn', relationship: 'beneficial', reason: 'Sunflowers attract pollinators.' },
  { plantA: 'Sunflower', plantB: 'Potato', relationship: 'harmful', reason: 'Sunflowers stunt potato growth.' },
  { plantA: 'Sunflower', plantB: 'Pole Bean', relationship: 'harmful', reason: 'Sunflowers inhibit bean growth.' },
  { plantA: 'Calendula', plantB: 'Tomato', relationship: 'beneficial', reason: 'Calendula deters tomato pests.' },
  { plantA: 'Calendula', plantB: 'Asparagus', relationship: 'beneficial', reason: 'Calendula deters asparagus beetles.' },
  { plantA: 'Zinnia', plantB: 'Tomato', relationship: 'beneficial', reason: 'Zinnias attract pollinators.' },
  { plantA: 'Cosmos', plantB: 'Tomato', relationship: 'beneficial', reason: 'Cosmos attract pollinators.' },
  { plantA: 'Viola', plantB: 'Lettuce', relationship: 'beneficial', reason: 'Violas attract beneficial insects.' },
  { plantA: 'Snapdragon', plantB: 'Lettuce', relationship: 'beneficial', reason: 'Snapdragons attract beneficial insects.' },
  { plantA: 'Petunia', plantB: 'Tomato', relationship: 'beneficial', reason: 'Petunias repel tomato pests.' },
  { plantA: 'Pansy', plantB: 'Lettuce', relationship: 'beneficial', reason: 'Pansies attract beneficial insects.' },
];

export function getCompanionship(
  a: string,
  b: string
): 'beneficial' | 'harmful' | 'neutral' {
  const entry = companionRelations.find(
    (r) =>
      (r.plantA.toLowerCase() === a.toLowerCase() &&
        r.plantB.toLowerCase() === b.toLowerCase()) ||
      (r.plantA.toLowerCase() === b.toLowerCase() &&
        r.plantB.toLowerCase() === a.toLowerCase())
  );
  return entry?.relationship ?? 'neutral';
}

export function getCompanionsFor(plantName: string): { name: string; reason: string }[] {
  const normalized = plantName.toLowerCase();
  return companionRelations
    .filter(
      (r) =>
        r.relationship === 'beneficial' &&
        (r.plantA.toLowerCase() === normalized || r.plantB.toLowerCase() === normalized)
    )
    .map((r) => ({
      name: r.plantA.toLowerCase() === normalized ? r.plantB : r.plantA,
      reason: r.reason,
    }));
}

export function getAntagonistsFor(plantName: string): { name: string; reason: string }[] {
  const normalized = plantName.toLowerCase();
  return companionRelations
    .filter(
      (r) =>
        r.relationship === 'harmful' &&
        (r.plantA.toLowerCase() === normalized || r.plantB.toLowerCase() === normalized)
    )
    .map((r) => ({
      name: r.plantA.toLowerCase() === normalized ? r.plantB : r.plantA,
      reason: r.reason,
    }));
}
