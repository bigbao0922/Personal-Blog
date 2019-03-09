const Article = require('../Models/article')
const Comment = require('../Models/comment')
const User = require('../Models/user')

const fs = require('fs');
const {join} = require('path');



exports.index = async (ctx) => {
    if(ctx.session.isNew){
        ctx.status = 404
        return await ctx.render('404', {title: '404'})
    }
    
    //获取动态id
    const id = ctx.params.id;
    let flag = false;
    const arr = fs.readdirSync(join(__dirname,'../views/admin'));
    arr.forEach(v => {
        const name = v.replace(/^(admin\-)|(\.pug)$/g, "")
        if(name === id){
            flag = true
        }
    })

    if(flag){
        await ctx.render("./admin/admin-" + id, {
            role: ctx.session.role
        })
    }else{        
        ctx.status = 404
        await ctx.render("404", {title: '404'})
    }
} 