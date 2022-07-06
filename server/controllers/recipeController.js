require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


/**
 * GET /
 * Homepage
 */
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const smoothie = await Recipe.find({ 'category': 'Smoothie' }).limit(limitNumber);
    const salad = await Recipe.find({ 'category': 'Salad' }).limit(limitNumber);
    const  breakfast= await Recipe.find({ 'category': 'Breakfast' }).limit(limitNumber);

    const food = { latest, smoothie, salad, breakfast };

    res.render('index', { title: 'Healthy Food - Home', categories, food } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}



/**
 * GET / categories
 * Categories
 */
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 6;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', { title: 'Healthy Food - Categories', categories } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


/**
 * GET / categories/:id
 * Categories By Id
 */
 exports.exploreCategoriesById = async(req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 6;
    const categoryById = await Recipe.find({ 'category': categoryId}).limit(limitNumber);
    res.render('categories', { title: 'Healthy Food - Categories', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


/**
 * GET / recipe/:id
 * Recipe
 */
 exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Healthy Food - Recipe', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


/**
 * POST /search
 * Search
 */
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Healthy Food - Search', recipe} );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured"});
  }
}


/**
 * GET / explore-latest
 * Explore Latest
 */
 exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 6;
    const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    res.render('explore-latest', { title: 'Healthy Food - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


/**
 * GET / explore-random
 * Explore Random as JSON
 */
 exports.exploreRandom = async(req, res) => {
  try {

    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Healthy Food - Explore Random', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


/**
 * GET / submit-recipe
 * submit recipe
 */
 exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors'); 
  const infoSubmitObj = req.flash('infoSubmit'); 
  res.render('submit-recipe', { title: 'Healthy Food - Submit Recipe', infoErrorsObj, infoSubmitObj } );
 }

 
/**
 * POST/ submit-recipe on post
 * submit recipe
 */
 exports.submitRecipeOnPost = async(req, res) => {
  try{

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
    console.log('No Files were uploaded.');
    }
    else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err)
      {
        if(err) return res.satus(500).send(err);
      })
    }
    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });

    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    req.flash('infoErrors',error);
    res.redirect('/submit-recipe');
  }
 }


 /**
  * GET /about
  * about
  */
 exports.about = async(req, res) => {
  res.render('about', { title: 'Healthy Food = About'});
 }


 /**
  * GET /contact
  * contact
  */
  exports.contact = async(req, res) => {
    res.render('contact', { title: 'Healthy Food = Contact'});
   }
  
  
 /**
  * GET /articles
  * contact
  */
  exports.articles = async(req, res) => {
    res.render('articles', { title: 'Healthy Food = Articles'});
   }


   /**
    * UPDATE
  */
   async function updateRecipe(){
    try{
      const res = await Recipe.updateOne({ name: 'abcd'}, {name: 'pqrs'});
      res.n;            //no.of documents matched
      res.nModified;    //no.of documents modified
    } catch (error) {
      console.log(error);

    }
   } 
   updateRecipe();

   
   /**
    * DELETE
  */
    async function deleteRecipe(){
      try{
        await Recipe.deleteOne( {name: 'pqrs'});
      } catch (error) {
        console.log(error);
      }
     } 
     deleteRecipe();
  
