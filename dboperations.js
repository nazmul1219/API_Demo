var config = require('./dbconfig');
const sql = require('mssql');


async function getvideo(){

    try{
        let pool= await sql.connect(config);
        let video= await pool.request().query("select * from Video_");
        return video.recordsets;
    }
    catch(error){
    console.log(error);

    }
    }


    async function getvideoid(vdoid){

        try{
            let pool= await sql.connect(config);
            let video= await pool.request()
            .input('input_parameter',sql.NVarChar,vdoid)
            .query("SELECT * FROM TV_List where DeviceID=@input_parameter");
            return video.recordsets;
        }
        catch(error){
        console.log(error);
        }    
        }
        async function PostID(device){
                
            try{
                let pool= await sql.connect(config);
                let inputids= await pool.request()
                .input('D_ID',sql.NVarChar,device.D_ID)
                .execute('inputid')
                return inputids.recordsets;
            }
            catch(error){
            console.log(error);
            }    
            }


    module.exports={

        getvideo:getvideo,
        getvideoid:getvideoid,
        PostID:PostID

    }