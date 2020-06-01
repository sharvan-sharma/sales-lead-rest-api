const passport = require('passport')
const models = require('./models')
const Staff = models.Staff
const Admin = models.Admin
const findStaff = require('./helpers').findStaff


passport.serializeUser((user,done)=>{
    console.log('serialize',user.email)
    done(null,{_id:user._id,account_type:user.account_type})
})

passport.deserializeUser((session_data,done)=>{
    if(session_data.account_type === 'admin'){
        Admin.findById(session_data._id,(err,user)=>{
            if(err){done(err,null)}
            else{
                console.log('admin deserialize',user.email)
                done(null,user)
            }
        })
    }else{
        const promise = findStaff(session_data._id)
        promise.then(userobj=>{
            done(null,userobj)
        })
       
    }
    
})

let staffStrategy = Staff.createStrategy()
staffStrategy.name = 'local-staff'

let adminStrategy = Admin.createStrategy()
adminStrategy.name = 'local-admin'

passport.use(staffStrategy)
passport.use(adminStrategy)

module.exports = passport