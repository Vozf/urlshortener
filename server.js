var app =require("express")();
var url = require("url");
var mongo = require('mongodb').MongoClient;
   
 var validUrl = require('valid-url');
 
var i=1;
app.get("/",function(req,res){
    
    res.end("Enter link");
});
app.get("/:id",function(req,res){
    var id=+req.params.id;
    var out="def";
    mongo.connect("mongodb://localhost:27017/urlshortener", function(err, db) {
       // res.write("data");
        if(err) console.log(err)

        if(isNaN(id) )
        {
              res.end("Wrong ID")
              db.close();
              return;
        }
      db.collection('urls').find({
        _id:id
        
      },
      {
        _id:0
      }).toArray(function(err, documents) {
            console.log(documents);
            if(documents.length==0){
                res.end("Not Found");
                db.close();
                return;
            }
          out=documents[0].url;
     //res.redirect(out);
    // res.redirect('https:vk.com');
    
    res.redirect(out);
    res.end();
    

    
      db.close();
    });
    });
    
    

});


app.get("/new/*",function(req,res){
    var maybelink=req.originalUrl.slice(5);
    console.log(maybelink);



if (!validUrl.isUri(maybelink)){
    res.end("Not a link");
    return;
    
}

        
    var link=url.parse(maybelink);
    
   

    mongo.connect("mongodb://localhost:27017/urlshortener", function(err, db)
    {
        if(err) console.log(err);
        var obj={ 
            _id:i,
            url:link.href
            
        };
      db.collection('urls').insert(obj,function(err,doc){
              if(err)console.log(err);
              i++;
                console.log(doc);
          });
    
      db.close();
      
      
    
    });
    
    
    
    
    
    // if(!isURL(req.originalUrl.slice(1)))
    // throw new Error("Wrong link");
    // }
var lin='https://urlshortener-vozf.c9users.io/'+(i);
    res.end('<a href="'+lin+'">'+lin+'</a>');     //because of async i instead of i-1
    //res.write("<p>"+lin+"</p>");

});
 mongo.connect("mongodb://localhost:27017/urlshortener", function(err, db) {
     if(err) console.log(err);
    // db.dropDatabase();
    (db.collection('urls').find({}).sort({_id:-1}).toArray(function(err,val){
          if(err) console.log(err);
    
        
       if(val.length!==0)
        i=val[0]._id+1;
        else
        i=1;
        console.log("starting from "+i);
    }));
   //  i= db.collection('urls').find({}).sort({_id:-1}).toArray()[0].url;
      db.close();

    });



app.listen("8080");

