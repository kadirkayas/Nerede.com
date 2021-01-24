var express =require("express");
var app=express();
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var girilendukkanid;
var mesaj=" ";
var urunler=[];

//Database bağlantısı
var sql=require('mssql');
const { render } = require("ejs");
 var dbconfig={
     server:"DESKTOP-CGCP4D7",
     database:"nerede",
     user:"admin",
     password:"root"
 };

 
app.get("/",function(req,res){
    console.log(girilendukkanid);
    res.render("anasayfa.ejs",{mesaj:mesaj});
});

app.get("/dukkankayit",function(req,res){
    res.render("dukkankayit.ejs");
});
app.get("/stokekle",function(req,res){
    if(girilendukkanid==null){
        console.log("Giriş Yapınız");
        res.render("dukkangiris.ejs");
    }
    else{      
        res.render("stokekle.ejs");
        urunler=null;
    }
});
app.get("/urunekle",function(req,res){
    if(girilendukkanid==null){
        console.log("Giriş Yapınız");
        res.render("dukkangiris.ejs");
    }
    else{
        console.log("Başarılı");
        res.render("urunekle.ejs");
    }
});
app.get("/dukkangiris",function(req,res){
    res.render("dukkangiris.ejs");
});


app.post("/giris",function(req,res){
    var kullaniciAdi=req.body.kullaniciAdi;
    var sifre=req.body.sifre;
    var connection = new sql.Connection(dbconfig, function(err) {
    var sorgu = new sql.Request(connection);
        sorgu.input('kullaniciAdi',sql.VarChar,kullaniciAdi);
        sorgu.input('sifre',sql.VarChar,sifre);
        sorgu.multiple = true;
        sorgu.query("Select dukkanId From Giris where kullaniciAdi=@kullaniciAdi And sifre=@sifre",function(err,rows,fields) {
            if(err){
                console.log("Hata");
                mesaj="Kullanıcı Adı veya Şifre Hatalı";
                res.render("anasayfa.ejs",{mesaj:mesaj});
            }
            else{
                console.log("Giriş Başarılı");
                girilendukkanid=rows[0][0].dukkanId;
                console.log(girilendukkanid);
                mesaj="Giriş Başarılı";
                res.render("anasayfa.ejs",{mesaj:mesaj});
            }
            connection.close();
        });
    }); 
});


app.post("/dburunekle",function(req,res){
    var urunAdi=req.body.urunAdi;
    var urunAciklama=req.body.urunAciklama;
    var urunKategori=req.body.urunKategori;
    var urunDurum=req.body.urunDurum;
    var connection = new sql.Connection(dbconfig, function(err) {
    var sorgu = new sql.Request(connection);
        sorgu.input('urunAdi',sql.VarChar,urunAdi);
        sorgu.input('urunAciklama',sql.VarChar,urunAciklama);
        sorgu.input('kategoriId',sql.VarChar,urunKategori);
        sorgu.input('urunDurum',sql.VarChar,urunDurum);
        sorgu.multiple = true;
        sorgu.query("INSERT INTO Urunler(urunAdi,urunAciklama,kategoriId,urunDurum) values (@urunAdi,@urunAciklama,@kategoriId,@urunDurum)",function(err,recordsets) {
            if(err){
                console.log("Hata");
                mesaj="Ürün Kaydolurken Bir hata oluştu";
                res.render("anasayfa.ejs",{mesaj:mesaj});
            }
            else{
                console.log("Urun kaydoldu");
                mesaj="Ürün Kaydoldu";
                res.render("anasayfa.ejs",{mesaj:mesaj});
            }
            connection.close();
        });
    }); 
});
app.post("/dbstokekle",function(req,res){
    var urunadi=req.body.urunadi;
    var stokAdet=parseInt(req.body.stokAdet) ;
    var fiyat=parseInt(req.body.fiyat);
    var indirimTutari=parseInt(req.body.indirimTutari);
    var connection = new sql.Connection(dbconfig, function(err) {
        var sorgu = new sql.Request(connection);
        sorgu.input('urunAdi',sql.VarChar,urunadi);
        sorgu.input('stokAdet',sql.Int,stokAdet);
        sorgu.input('fiyat',sql.Int,fiyat);
        sorgu.input('indirimTutari',sql.Int,indirimTutari);
        sorgu.input('dukkanId',sql.Int,girilendukkanid)
        sorgu.multiple = true;
        sorgu.query("INSERT INTO Stok(stokAdet,fiyat,indirimTutari,dukkanId) values (@stokAdet,@fiyat,@indirimTutari,@dukkanId)",function(err,recordsets) {
            if(err){
                console.log("Hata");
                mesaj="Kayıt Başarısız";
                res.render("anasayfa.ejs",{mesaj:mesaj});}
            else{
                console.log("Stok kaydoldu")
                mesaj="Stok Eklendi";
                res.render("anasayfa.ejs",{mesaj:mesaj});
            }
            connection.close();
        });
       sorgu.query("INSERT INTO Urunler(urunAdi) values (@urunAdi)",function(err,recordsets) {
        if(err)
            console.log("Hata");
        else
            console.log("Urun eklendi")
        connection.close();
        }); 
    });
});
app.post("/dukkanekle",function(req,res){
    var dukkanad=req.body.dukkanAdi;
    var kullaniciad=req.body.kullaniciAdi;
    var password=req.body.sifre;
    var dukkanid;

    var connection = new sql.Connection(dbconfig, function(err) {
        var sorgu = new sql.Request(connection);
        sorgu.input('kullaniciAdi',sql.VarChar,kullaniciad);
        sorgu.input('sifre',sql.VarChar,password);
        sorgu.input('dukkanAdi',sql.VarChar,dukkanad);
        sorgu.multiple = true;
       
        sorgu.query("INSERT INTO Dukkan(dukkanAdi) values (@dukkanAdi)",function(err,recordsets) {
            if(err)
                console.log("Hata");
            else
                console.log("Dukkan eklendi")
            connection.close();
        });
        sorgu.query("INSERT INTO Giris(kullaniciAdi,sifre) values (@kullaniciAdi,@sifre)",function(err,recordsets) {
            if(err)
                console.log("Hata");
            else
                console.log("kullanici eklendi")
            connection.close();
        });
    });
});



var server=app.listen(3000,function(){
    console.log("Sunucu su anda porttda : %d",server.address().port);
});
