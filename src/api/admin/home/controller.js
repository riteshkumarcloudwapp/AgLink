import models from "../../../models/index.js";

/**
 * @method POST
 * @description Adding Category
*/
export const addCategory = async (req, res) => {
    try {
        const {name} = req.body;
        
        const category = await models.Category.findOne({ where: {name} });
        if(category){
            return res.send({ status:false, message: "Category already exist" });
        }

        const icon = req.file?.path;
        if(!icon){
            return res.send({ status:false, message: "Category Icon required" });
        };

        await models.Category.create({
            name : name,
            icon : icon
        });

        return res.send({ status: true, message: "Category added successfully" });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}

/**
 * @method POST
 * @description Edit Category
*/
export const editCategory = async (req, res) => {
    try {
        const {name} = req.body;
        const category_id = req.params.id;
        
        const category = await models.Category.findByPk(category_id);
        if(!category){
            return res.send({ status:false, message: "Category not found" });
        }

        //delete old icon
        if(req.file && category.icon){
            const filePath = path.join( process.cwd(), category.icon );
            
            if( fs.existsSync(filePath) ) { fs.unlinkSync(filePath) }
        }

        await category.update({
            name: name && name.trim() !== "" ? name : category.name,
            icon : req.file?.path ?? category.icon
        });

        return res.send({ status: true, message: "Category updated successfully" });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}

/**
 * @method GET
 * @description Get Category
*/
export const getAllCategory = async (req, res) => {
    try {
        const category = await models.Category.findAll({
            where : { status: "active" } ,
            order: [["created_at", "DESC"]]
        });

        return res.send({ status: true, message: "Category fetched successfully", data:category });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}

/**
 * @method POST
 * @description Delete Category
*/
export const deleteCategory = async (req, res) => {
    try {
        const {id} = req.params;
        
        const category = await models.Category.findByPk(id);
        if(!category){
            return res.send({ status:false, message: "Category not found" });
        }

        //delete icon from assets folder
        if (category.icon) {
            const filePath = path.join(process.cwd(), category.icon);

            if (fs.existsSync(filePath)) { fs.unlinkSync(filePath) }
        }

        await category.destroy();

        return res.send({ status: true, message: "Category deleted successfully" });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}


/**
 * @method POST
 * @description Adding Sub-Category
*/
export const addSubCategory = async (req, res) => {
    try {
        const {name, category_id} = req.body;
        
        const category = await models.Category.findByPk(category_id);
            if (!category) {
            return res.send({ status: false, message: "Category not found" });
        }

        const subCategory = await models.SubCategory.findOne({ where: {name, category_id} });
        if(subCategory){
            return res.send({ status:false, message: "subCategory already exist" });
        }

        const image = req.file?.path;
        if(!image){
            return res.send({ status:false, message: "subCategory image required" });
        };

        await models.SubCategory.create({
            name  : name,
            image : image,
            category_id : category_id
        });

        return res.send({ status: true, message: "subCategory added successfully" });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}

/**
 * @method POST
 * @description Edit Sub-Category
*/
export const editSubCategory = async (req, res) => {
    try {
        const {name} = req.body;
        const sub_category_id = req.params.id;
        
        const subCategory = await models.SubCategory.findByPk(sub_category_id);
        if(!subCategory){
            return res.send({ status:false, message: "subCategory not found" });
        }

        if(req.file && subCategory.image){
            const filePath = path.join( process.cwd(), subCategory.image );
            
            if( fs.existsSync(filePath) ) { fs.unlinkSync(filePath) }
        }

        await subCategory.update({
            name : name && name.trim() !== "" ? name : subCategory.name ,
            image : req.file?.path ?? subCategory.image
        });

        return res.send({ status: true, message: "subCategory updated successfully" });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}

/**
 * @method GET
 * @description Get Sub-Category
*/
export const getAllSubCategory = async (req, res) => {
    try {
        const subCategory = await models.SubCategory.findAll({
            where : { status: "active" } ,
            order: [["created_at", "DESC"]]
        });

        return res.send({ status: true, message: "subCategory fetched successfully", data:subCategory });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}

/**
 * @method POST
 * @description Delete Sub-Category
*/
export const deleteSubCategory = async (req, res) => {
    try {
        const {id} = req.params;
        
        const subCategory = await models.SubCategory.findByPk(id);
        if(!subCategory){
            return res.send({ status:false, message: "subCategory not found" });
        }

        //delete icon from assets folder
        if (subCategory.image) {
            const filePath = path.join(process.cwd(), subCategory.image);

            if (fs.existsSync(filePath)) { fs.unlinkSync(filePath) }
        }

        await subCategory.destroy();

        return res.send({ status: true, message: "subCategory deleted successfully" });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}

/**
 * @method POST
 * @description Adding Varieties
*/
export const addVarieties = async (req, res) => {
    try {
        const {name, sub_category_id} = req.body;
        
        const subCategory = await models.SubCategory.findByPk(sub_category_id);
            if (!subCategory) {
            return res.send({ status: false, message: "subCategory not found" });
        }

        const variety = await models.Variety.findOne({ where: {name, sub_category_id} });
        if(variety){
            return res.send({ status:false, message: "variety already exist" });
        }

        const image = req.file?.path;
        if(!image){
            return res.send({ status:false, message: "variety image required" });
        };

        await models.Variety.create({
            name  : name,
            image : image,
            sub_category_id : sub_category_id
        });

        return res.send({ status: true, message: "variety added successfully" });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}

/**
 * @method POST
 * @description Edit Varieties
*/
export const editVarieties = async (req, res) => {
    try {
        const {name} = req.body;
        const {id} = req.params;
        
        const variety = await models.Variety.findByPk(id);
        if(!variety){
            return res.send({ status:false, message: "variety not found" });
        }

        if(req.file && variety.image){
            const filePath = path.join( process.cwd(), variety.image );
            
            if( fs.existsSync(filePath) ) { fs.unlinkSync(filePath) }
        }

        await variety.update({
            name : name && name.trim() !== "" ? name : variety.name ,
            image : req.file?.path ?? variety.image
        });

        return res.send({ status: true, message: "variety updated successfully" });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}

/**
 * @method GET
 * @description Get Varieties
*/
export const getAllVarieties = async (req, res) => {
    try {
        const variety = await models.Variety.findAll({
            where : { status: "active" } ,
            order: [["created_at", "DESC"]]
        });

        return res.send({ status: true, message: "variety fetched successfully", data:variety });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}

/**
 * @method POST
 * @description Delete Varieties
*/
export const deleteVarieties = async (req, res) => {
    try {
        const {id} = req.params;
        
        const variety = await models.Variety.findByPk(id);
        if(!variety){
            return res.send({ status:false, message: "variety not found" });
        }

        //delete icon from assets folder
        if (variety.image) {
            const filePath = path.join(process.cwd(), variety.image);

            if (fs.existsSync(filePath)) { fs.unlinkSync(filePath) }
        }

        await variety.destroy();

        return res.send({ status: true, message: "variety deleted successfully" });

    } catch (error) {
     return res.send({ status: false, message: error.message});   
    }
}
