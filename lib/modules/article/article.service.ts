import {Component, HttpException, Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {ArticleEntity} from "../entity/article.entity";
import {MessageCodeError} from "../errorMessage/error.interface";
import {ClassifyService} from "../classify/classify.service";
import {ClassifyEntity} from "../entity/classify.entity";
import {StoreComponentProvider} from "../ext-local-store/src/export/StoreComponentProvider";
import {LocalModule} from "../ext-local-store/src/LocalModule";
import {ImagePreProcessInfo, RequestClass} from "../common/error.interface";
import {request} from "http";
const clc=require('cli-color');

@Component()
export class ArticleService{
constructor(@Inject('ArticleRepositoryToken') private readonly respository:Repository<ArticleEntity>,
            private readonly classifyService:ClassifyService,
        /*    private readonly storeService:StoreComponent*/
            @Inject('StoreComponentToken') private storeService){}

    /**
     * 返回所有数据,依据提供limit进行分页
     * @returns {Promise<ArticleEntity[]>}
     */
    async  getArticleAll(limit?:number,hidden?:boolean,pages?:number){
        let title:number=0;
        let resultAll:ArticleEntity[]=[];
        if(hidden==true){
            let newArray:ArticleEntity[]=[];
            let newresult:ArticleEntity[] = await this.respository.createQueryBuilder().where('"recycling"<> :recycling and hidden=true',{recycling:false}).orderBy('"publishedTime"','DESC').skip(limit*(pages-1)).take(limit).getMany();
            for(let t in newresult){
                if(newresult[t].hidden){
                    newArray.push(newresult[t]);
                }
            }
            title= await this.respository.createQueryBuilder().where('"recycling"<> :recycling and hidden=true',{recycling:false}).getCount();
            resultAll.push(...newArray);
        }
        if(hidden==false){
            console.log('false='+hidden);
            let newresult:ArticleEntity[] = await this.respository.createQueryBuilder().where('"recycling"<> :recycling  and hidden=false',{recycling:false}).orderBy('"publishedTime"','DESC').skip(limit*(pages-1)).take(limit).getMany();
            title=await this.respository.createQueryBuilder().where('"recycling"<> :recycling and hidden=false',{recycling:false}).getCount();
            resultAll.push(...newresult);
        }
        if(hidden==undefined){
            console.log('undefined='+hidden);
            let newresult:ArticleEntity[] = await this.respository.createQueryBuilder().where('recycling=false or recycling is null').orderBy('"publishedTime"','DESC').skip(limit*(pages-1)).take(limit).getMany();
            title=await this.respository.createQueryBuilder().where('recycling=false or recycling is null').getCount();
            resultAll.push(...newresult);
        }
        return {articles:resultAll,totalItems:title};
    }

    /**
     * 全局搜索
     * @param {string} name
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
    async serachArticles(name:string,limit?:number,pages?:number){
        let str:string=`%${name}%`;
        let resultAll:ArticleEntity[]=await this.respository.createQueryBuilder().where('"name"like :name',{name:str,}).andWhere('"recycling"<> :recycling or recycling isnull',{recycling:false}).orderBy('"publishedTime"','DESC').skip(limit*(pages-1)).take(limit).getMany();
        let title:number=await this.respository.createQueryBuilder().where('"name"like :name',{name:str,}).andWhere('"recycling"<> :recycling or recycling isnull',{recycling:false}).getCount();
        return {articles:resultAll,totalItems:title};
    }

    /**
     * 修改数据状态为回收站
     * @param {[number]} array
     * @returns {Promise<number>}
     */
     async deleteArticles(array:number[]):Promise<number>{
        let count:number=0;
        for(let t in array){
            let article:ArticleEntity=await this.respository.findOneById(array[t]);
            if(article==null) throw new MessageCodeError('delete:recycling:idMissing');
            article.recycling=true;
            let time =new Date();
            article.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
            let newArticle:ArticleEntity=article;
            this.respository.updateById(newArticle.id,newArticle);
            count++;
        }
        return count;
      }

    /**
     * 添加文章
     * @param {ArticleEntity} article
     * @returns {Promise<void>}
     */
      async createArticle(article:ArticleEntity,requestUrl?:any,bucketName?:string,rawName?:string,baseb4?:string){
        let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(article.classifyId);
        if(article.classifyId!=null && article.classifyId!=0 && entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        //if(article.publishedTime<new Date() && article.publishedTime!=null) throw new MessageCodeError('create:publishedTime:lessThan');
        let num:number=await this.classifyService.findLevel(article.classifyId);
        let level:string=this.classifyService.interfaceChange(num);
        if(article.topPlace==null){
            article.topPlace='cancel';
        }
        let levelGive:string=article.topPlace.toString();
        if(level=='level1' && levelGive=='level2' || levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
        if(level=='level2' && levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
        if(article.classifyId==0 ||article.classifyId==null)
            article.classifyId=await this.classifyService.findTheDefaultByAlias('默认分类','art');
            article.classify='默认分类';
        let time =new Date();
        if(article.publishedTime){
            time=article.publishedTime;
            article.publishedTime=new Date(time.getTime()-time.getTimezoneOffset()*60*1000)
        }
        if(article.publishedTime==null){
            article.publishedTime=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
        }
        if(article.startTime){
            time=article.startTime;
            article.startTime=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
        }
        if(article.endTime){
            time=article.endTime;
            article.endTime=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
        }
        article.recycling=false;
        let create:number=await this.respository.createQueryBuilder().insert().into(ArticleEntity).values(article).output('id').execute().then(a=>{return a});
        let str:string=JSON.stringify(create).split(':')[1];
        let numb:string=str.substring(0,str.lastIndexOf('}'));
        let newId:number=Number(numb);

        if(bucketName){
            this.upLoadPicture(requestUrl,bucketName,rawName,baseb4,newId);
        }
      }

    /**
     * 修改文章
     * @param {ArticleEntity} article
     * @returns {Promise<void>}
     */
      async updateArticle(article:ArticleEntity,requestUrl?:any,bucketName?:string,rawName?:string,baseb4?:string){
          let art:ArticleEntity =await this.respository.findOneById(article.id);
          if(art==null) throw new MessageCodeError('delete:recycling:idMissing');
          let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(article.classifyId);
          if(article.classifyId!=null && article.classifyId!=0 && entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
          if(article.classifyId==0 ||article.classifyId==null)
            article.classifyId=await this.classifyService.findTheDefaultByAlias('默认分类','art');
            article.classify='默认分类';
          let num:number=await this.classifyService.findLevel(article.classifyId);
          let level:string=this.classifyService.interfaceChange(num);
          let levelGive:string=article.topPlace;
        if(level=='level1' && levelGive=='level2' || levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
          if(level=='level2' && levelGive=='level3') throw new MessageCodeError('create:level:lessThanLevel');
          let time =new Date();
          article.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
        if(article.startTime){
            time=article.startTime;
            article.startTime=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
        }
        if(article.endTime){
            time=article.endTime;
            article.endTime=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
        }
        if(article.publishedTime){
            time=article.publishedTime;
            article.publishedTime=new Date(time.getTime()-time.getTimezoneOffset()*60*1000)
        }
          let newArt:ArticleEntity =article;
          await this.respository.updateById(newArt.id,newArt);
        if(bucketName){
            this.upLoadPicture(requestUrl,bucketName,rawName,baseb4,article.id);
        }
      }

    /**
     * 分页获取回收站内所有文章
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
      async recycleFind(limit?:number,pages?:number){
          let result:ArticleEntity[]=await this.respository.createQueryBuilder().where('"recycling"= :recycling',{recycling:true}).orderBy('"publishedTime"','ASC').skip(limit*(pages-1)).take(limit).getMany();
          let title:number=await this.respository.createQueryBuilder().where('"recycling"= :recycling',{recycling:true}).getCount();
          return {articles:result,totalItems:title};
      }

    /**
     * 回收站内删除数据，记入历史表
     * @param {[number]} array
     * @returns {Promise<number>}
     */
    async recycleDelete(array:number[]){
        let result;
        try{
             result=await this.respository.createQueryBuilder().delete()
                 .from(ArticleEntity).whereInIds(array)
                 .output('id').execute()
                 .then(a=>{return a});
        }catch (err){
            throw new HttpException('删除错误'+err.toString(),401);
        }
        return result;
    }

    /**
     * 回收站内批量或者单个还原数据，目前限制分页为0
     * @param {[number]} array
     * @returns {Promise<ArticleEntity[]>}
     */
    async reductionArticle(array:number[]):Promise<number>{
        let num:number=0;
        for(let t in array){
            let article:ArticleEntity=await this.respository.findOneById(array[t]);
            if(article==null) throw new MessageCodeError('delete:recycling:idMissing');
            article.recycling=false;
            let time =new Date();
            article.updateAt=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
            let newArticle:ArticleEntity=article;
            this.respository.updateById(newArticle.id,newArticle);
            num++;
        }
        //批量修改的方法
        //await this.respository.createQueryBuilder().update().set(ArticleEntity).whereInIds(array).output('id').execute();
        return num;
    }

    /**
     * 分批获取置顶文章
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
    async findTopPlace(limit?:number,pages?:number){
        let result:ArticleEntity[]=await this.respository.createQueryBuilder().where('"topPlace"= :topPlace',{topPlace:'global'}).orderBy('"updateAt"','DESC').skip(limit*(pages-1)).take(limit).getMany();
        let title:number=await this.respository.createQueryBuilder().where('"topPlace"= :topPlace',{topPlace:'global'}).getCount();
        return {articles:result,totalItems:title};
    }

    /**
     * 回收站内根据分类查找当前分类及子分类下的文章
     * @param {number} id
     * @param {number} limit
     * @returns {Promise<ArticleEntity[]>}
     */
    async reductionClassity(id:number,limit?:number,pages?:number){
        let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(id);
        if(entity==null) throw new MessageCodeError('page:classify:classifyIdMissing');
        let array:number[]=await this.classifyService.getClassifyId(id).then(a=>{return a});
        array.push(id);
        let newArray:number[]=Array.from(new Set(array));
        let result:ArticleEntity[]=await this.respository.createQueryBuilder().where('"classifyId" in (:classifyId)  and recycling=true',{classifyId:newArray}).orderBy('id','ASC').skip(limit*(pages-1)).take(limit).getMany();
        let title:number=await this.respository.createQueryBuilder().where('"classifyId" in (:classifyId)  and recycling=true',{classifyId:newArray}).getCount();
        return {articles:result,totalItems:title}
    }

    /**
     * 根据id获取文章
     * @param {number} id
     * @returns {Promise<ArticleEntity>}
     */
    async getArticleById(id:number):Promise<ArticleEntity[]>{
        let Array:ArticleEntity[]=[];
        let article:ArticleEntity=await this.respository.findOneById(id);
        if(article==null) throw new MessageCodeError('delete:recycling:idMissing');
       /* let parent:ClassifyEntity=await this.classifyService.findOneByIdArt(article.classifyId);
        if(parent==null) throw new MessageCodeError('delete:recycling:idMissing');
        let num:number=await this.classifyService.findLevel(article.classifyId).then(a=>{return a});
        let level:string=this.classifyService.interfaceChange(num);
        if(level=='level1'){
            article.topPlace=`cancel,global,current`;
        }else if(level=='level2'){
            article.topPlace=`cancel,global,level1,current`;
        }else if(level=='level3'){
            article.topPlace=`cancel,global,level1,current,level2`;
        }else{
            article.topPlace=`cancel,global,level1,level2,level3,current`;
        }*/
        let newArticle:ArticleEntity=article;
        Array.push(newArticle);
        return Array;
    }

    /**
     * 根据分类id获取层级
     * @param {number} id
     * @returns {Promise<string>}
     */
    async getLevelByClassifyId(id:number):Promise<string>{
        let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(id);
        if(entity==null) throw new MessageCodeError('delete:recycling:idMissing');
        let num:number=await this.classifyService.findLevel(entity.id).then(a=>{return a});
        let level:string=this.classifyService.interfaceChange(num);
        let topPlace:string='';
        if(level=='level1'){
            topPlace=`global,current`;
        }else if(level=='level2'){
           topPlace=`global,level1,current`;
        }else if(level=='level3'){
            topPlace=`global,level1,current,level2`;
        }else{
            topPlace=`global,level1,level2,level3,current`;
        }
        return topPlace;
    }

    /**
     * 文章修改基本校验
     * @param {number} classifyId
     * @param {number} id
     * @returns {Promise<{MessageCodeError: string; Continue: boolean}>}
     * @constructor
     */
    async CurdArticleCheck(classifyId?:number,id?:number){
        let result:string;
        let update:boolean=true;
        if(id>0){
            let aliasEntity:ArticleEntity=await this.respository.findOneById(id);
            if(aliasEntity==null) result="当前文章不存在";update=false;
        }
        if(classifyId>0){
            let entity:ClassifyEntity=await this.classifyService.findOneByIdArt(classifyId);
            console.log('entity='+JSON.stringify(entity));
            if(entity==null) result="对应分类不存在";update=false;
        }
        if(!result){
            update=true;
        }
        return {MessageCodeError:result,Continue:update};
    }

    /**
     * 上传图片
     * @param {string} bucketName
     * @param {string} rawName
     * @param {string} base64
     * @returns {Promise<{bucketName: string; name: string; type: string}>}
     */
    async upLoadPicture(req:any,bucketName: string, rawName: string, base64: string,id?:number ){
        try {
            let entity:ArticleEntity=await this.respository.findOneById(id);
            //删除图片
            if(entity.bucketName!=null){
                await this.storeService.delete(entity.bucketName,entity.pictureName,entity.type)
            }
            let imagePreProcessInfo=new ImagePreProcessInfo();
            imagePreProcessInfo.watermark=false;
            //上传图片
            let result=await this.storeService.upload(bucketName,rawName,base64,imagePreProcessInfo).then(a=>{return a});
            let map=this.objToStrMap(result);
            let bucket=map.get('bucketName');
            let name=map.get('name');
            let type=map.get('type');
            let str:string=req.toString();
            //获取图片地址
            let protocal=str.split(':')[0];
            let host=str.substring(str.lastIndexOf('/')+1,str.length);
            let requestClass=new RequestClass();
            requestClass.host=host;
            let request={protocol:protocal,host:host};
            let url=await this.storeService.getUrl(request,bucket,name,type,imagePreProcessInfo).then(a=>{return a});
            entity.type=type;
            entity.bucketName=bucket;
            entity.pictureName=name;
            entity.pictureUrl=url;
           await this.respository.updateById(entity.id,entity);
        }catch(err) {
            console.log(err);
          console.log(clc.redBright(JSON.stringify(err)));
        }
       // return result;
    }
    /**
     * JSON----Map
     * @param obj
     * @returns {Map<string, string>}
     */
    objToStrMap(obj):Map<string,string> {
        let strMap=new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }

}