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

        if(req.file?.icon && category.icon){
            const filePath = path.join( process.cwd(), category.icon );
            
            if( fs.existsSync(filePath) ) { fs.unlinkSync(filePath) }
        }

        await category.update({
            name : name ?? category.name ,
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


