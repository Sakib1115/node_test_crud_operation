const staticRouter=require("express").Router();
const staticController=require('../Controller/staticController');

staticRouter.get('/staticList',staticController.staticList);
staticRouter.get('/viewStatic',staticController.viewStatic);
staticRouter.put('/editStatic',staticController.editStatic);

module.exports=staticRouter;