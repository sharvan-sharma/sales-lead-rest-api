
const models = require('../../../src/config/models')
const {Roles,RoleRights} = models
const winslogger = require('../../../src/logger')

function createRole(req,res,next){
    if(!req.body.role_name || req.body.role_name < 3 || req.body.role_name.includes(' ')){
        res.json({status:423,type:'role_name'})
    }else if(req.user.account_type !== 'admin'){
        res.json({status:423,type:'unauthorized'})
    }else if(!req.body.rightsArray || !Array.isArray(req.body.rightsArray)){
        res.json({status:423,type:'rightsArray'})
    }else{
        Roles.create({
            name:req.body.role_name,
            status:'A',
            description:req.body.description || ''
        },(err,role)=>{
            if(err){res.jons({status:500})}
            else{
                RoleRights.create({role_id:role._id,right_id:req.body.rightsArray},(err,rolerights)=>{
                    if(err){
                        res.json({status:500})
                        winslogger.error(`admin ${req.user.email} error while creating role with name ${req.body.role_name}`)
                    }
                    else{
                        res.json({status:200,role_id:role._id,role_rights_id:rolerights._id})
                    }
                })
            }          
        })
    }
}

module.exports = createRole
