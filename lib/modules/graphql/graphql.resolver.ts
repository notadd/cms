import {Mutation, Query, Resolver} from "@nestjs/graphql";
import {ArticleService} from "../article/article.service";
import {ArticleEntity} from "../entity/article.entity";
import {ClassifyService} from "../classify/classify.service";
import {ClassifyEntity} from "../entity/classify.entity";
import {PageService} from "../page/page.service";
import {PageEntity} from "../entity/page.entity";
import {PageClassifyEntity} from "../entity/pageClassify.entity";
import {PageContentEntity} from "../entity/page.content.entity";
import {ContentMap} from "../common/param.dto";
import {MessageCodeError} from "../errorMessage/error.interface";

@Resolver()
export class GraphqlResolver{
    constructor(private readonly articleService:ArticleService,
                private readonly classifyService:ClassifyService,
                private readonly pageService:PageService){}

    /**
     * 文章的查询方法
     * @param obj
     * @param arg
     * @returns {Promise<ArticleEntity[]>}
     */

    @Query()
    getArticles(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let getArticle=map.get('getArticleAll');
        if(getArticle!=null || getArticle!=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getArticle);
            const result=this.articleService.getArticleAll(amap.get('limitNum'),amap.get('hidden'));
            return result;
        }
        let keywordsSerach=map.get('keywordsSerach');
        if(keywordsSerach!=null || keywordsSerach!=undefined){
            let amap=new Map();
            amap=this.objToStrMap(keywordsSerach);
            const result=this.articleService.serachArticles(amap.get('keywords'),amap.get('limitNum'));
            return result;
        }
        let recycleFind=map.get('recycleFind');
        if(recycleFind!=null || recycleFind !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(recycleFind);
            const result=this.articleService.recycleFind(amap.get('limitNum'));
            return result;
        }
        let reductionGetByClassifyId=map.get('reductionGetByClassifyId');
        if(reductionGetByClassifyId!=null || reductionGetByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(reductionGetByClassifyId);
            const result=this.articleService.reductionClassity(amap.get('id'),amap.get('limitNum'));
            return result;
        }
        let showNext=map.get('showNext');
        if(showNext!=null || showNext !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(showNext);
            const result=this.classifyService.showNextTitle(amap.get('id'));
            return result;
        }
        let getArticleByClassifyId=map.get('getArticleByClassifyId');
        if(getArticleByClassifyId!=null || getArticleByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getArticleByClassifyId);
            const result=this.classifyService.getArticelsByClassifyId(amap.get('id'),amap.get('limitNum'));
            return result;
        }
        let findTopPlace=map.get('findTopPlace');
        if(findTopPlace!=null || findTopPlace !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(findTopPlace);
            const result= this.articleService.findTopPlace(amap.get('limitNum'));
            return result;
        }
        let getArticleById=map.get('getArticleById');
        if(getArticleById!=null || getArticleById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getArticleById);
            const result= this.articleService.getArticleById(amap.get('id'));
            return result;
        }
        let superiorArticle=map.get('superiorArticle');
        if(getArticleById!=null || getArticleById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(superiorArticle);
            const result= this.classifyService.showBeforeTitle(amap.get('id'));
            return result;
        }
    }

    /**
     * 获取分类
     * @param obj
     * @param arg
     * @returns {any}
     */
    @Query()
    getClassifys(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let getAllClassify=map.get('getAllClassify');
        if(getAllClassify!=null || getAllClassify !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getAllClassify);
            let useFor:string=amap.get('useFor');
            let id:number=amap.get('id');
            if(id==null || id==0){
                id=1;
            }
            let result;
            if(useFor=='art'){
                result=this.classifyService.findAllClassifyArt(id);
            }else if(useFor=='page'){
                result=this.classifyService.findAllClassifyPage(id);
            }
            return result;
        }
    }

    /**
     * 获取页面
     * @param obj
     * @param arg
     * @returns {Promise<PageEntity[]>}
     */
    @Query()
    getPages(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let getAllPage=map.get('getAllPage');
        if(getAllPage!=null || getAllPage !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getAllPage);
            const result=this.pageService.getAllPage(amap.get('limitNum'));
            return result;
        }
        let serachPages=map.get('serachPages');
        if(serachPages!=null || serachPages !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(serachPages);
            const result=this.pageService.serachKeywords(amap.get('keywords'),amap.get('limitNum'));
            return result;
        }
        let getPagesByClassifyId=map.get('getPagesByClassifyId');
        if(getPagesByClassifyId!=null || getPagesByClassifyId !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(getPagesByClassifyId);
            const result=this.pageService.findPageByClassifyId(amap.get('id'),amap.get('limitNum'));
            return result;
        }
        let findPageById=map.get('findPageById');
        if(findPageById!=null || findPageById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(findPageById);
            const result=this.pageService.findPageById(amap.get('id'));
            return result;
        }
    }

    /**
     * 文章的增加和修改
     * @param obj
     * @param arg
     * @returns {Promise<string>}
     * @constructor
     */
    @Mutation()
    async ArticleCU(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let createArt=map.get('createArt');
        if(createArt!=null || createArt !=undefined){
            let art:ArticleEntity=createArt;
            let date:string=art.publishedTime.toString();
            art.publishedTime=new Date(Date.parse(date.replace(/-/g,"/")));
            let newArticle:ArticleEntity=art;
            const result=await this.articleService.createArticle(newArticle).then(a=>{return a});
            let final:string=JSON.stringify(result);
            return final;
        }
        let updateArt=map.get('updateArt');
        if(updateArt!=null || updateArt !=undefined){
            let art:ArticleEntity=updateArt;
            let date:string=art.publishedTime.toString();
            art.publishedTime=new Date(Date.parse(date.replace(/-/g,"/")));
            let newArticle:ArticleEntity=art;
            const result=await this.articleService.updateArticle(newArticle).then(a=>{return a});
            let final:string=JSON.stringify(result);
            return final;
        }
        let deleteById=map.get('deleteById');
        if(deleteById!=null || deleteById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(deleteById);
            let array:[number]=amap.get('id');
            let result:number=await this.articleService.deleteArticles(array).then(a=>{return a});
            let strResult:string=`已成功将${JSON.stringify(result)}条数据放入回收站`;
            return strResult;
        }
        let recycleDelete=map.get('recycleDelete');
        if(recycleDelete!=null || recycleDelete !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(recycleDelete);
            let array:[number]=amap.get('id');
            let num:number=await this.articleService.recycleDelete(array);
            let string=`已经成功删除${num}条数据`;
            return string;
        }
        let reductionArticle=map.get('reductionArticle');
        if(reductionArticle!=null || reductionArticle !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(reductionArticle);
            let array:[number]=amap.get('id');
            const num=await this.articleService.reductionArticle(array);
            let result:string=`成功将${num}条数据还原`;
            return result;
        }
    }

    /**
     * 分类的增加、修改 分文章和页面两种
     * @param obj
     * @param arg
     * @returns {any}
     * @constructor
     */
    @Mutation()
    ClassifyCU(obj,arg){
        const str:string=JSON.stringify(arg);
        let bToJSon=JSON.parse(str);
        let map =new Map();
        map=this.objToStrMap(bToJSon);
        let createArt=map.get('createClass');
        if(createArt!=null || createArt !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(createArt);
            let useFor:string=amap.get('useFor');
            let result;
            let id:number=amap.get('id');
            if(id==null || id==0){
                id=1;
            }
            if(useFor=='art'){
                let newClass:ClassifyEntity=amap.get('createClass');
                result=this.classifyService.createClassifyArt(newClass,id);
            }else if(useFor=='page'){
                let newClass:PageClassifyEntity=amap.get('createClass');
                result=this.classifyService.createClassifyPage(newClass,id);
            }
            return result;
        }
        let updateClass=map.get('updateClass');
        if(updateClass!=null || updateClass !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(updateClass);
            let useFor:string=amap.get('useFor');
            let id:number=amap.get('id');
            if(id==null || id==0){
                id=1;
            }
            let result;
            if(useFor=='art'){
                let newClass:ClassifyEntity=amap.get('updateClass');
                result=this.classifyService.updateClassifyArt(newClass,id);
            }else if(useFor=='page'){
                let newClass:PageClassifyEntity=amap.get('updateClass');
                result=this.classifyService.updateClassifyPage(newClass,id);
            }
            return result;
        }
        let deleteClassifyById=map.get('deleteClassifyById');
        if(deleteClassifyById!=null || deleteClassifyById !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(deleteClassifyById);
            let useFor:string=amap.get('useFor');
            let id:number=amap.get('id');
            if(id==null || id==0){
                id=1;
            }
            if(id==1)throw new MessageCodeError('drop:table:ById1');
            let result;
            if(useFor=='art'){
                result=this.classifyService.deleteMethodFirst(id);
            }else if(useFor=='page'){
                result=this.classifyService.deleteMethodSecond(id);
            }
            return result;
        }
        let mobileTheClassify=map.get('mobileTheClassify');
        if(mobileTheClassify!=null || mobileTheClassify !=undefined){
            let amap=new Map();
            amap=this.objToStrMap(mobileTheClassify);
            let useFor:string=amap.get('useFor');
            let id:number=amap.get('id');
            let parentId:number=amap.get('parentId')
            if(parentId==null || parentId==0){
                parentId=1;
            } let result;
            if(useFor=='art'){
                result=this.classifyService.mobileClassifyArt(id,parentId);
            }else if(useFor=='page'){
                result=this.classifyService.mobileClassifyPage(id,parentId);
            }
            return result;
        }

    }
    @Mutation()
    PageCUD(obj,arg) {
        const str: string = JSON.stringify(arg);
        let bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        let createPages = map.get('createPages');
        if (createPages != null || createPages != undefined) {
            let amap = new Map();
            amap = this.objToStrMap(createPages);
            let page:PageEntity=new PageEntity();
            page.title=amap.get('title');
            page.alias=amap.get('alias');
            page.classify=amap.get('classify');
            page.classifyId=amap.get('classifyId');
            let contents:PageContentEntity[]=[];
            let strFinal:string[]=amap.get('content');
            for(let t in strFinal){
                let newContent:PageContentEntity=new PageContentEntity;
                newContent.content=strFinal[t];
                contents.push(newContent);
            }
            const result=this.pageService.createPages(page,contents,amap.get('limitNum'));
            return result;
        }
        let updatePages=map.get('updatePages');
        if(updatePages != null || updatePages != undefined){
            let amap = new Map();
            amap = this.objToStrMap(updatePages);
            let page:PageEntity=new PageEntity();
            page.id=amap.get('id');
            page.title=amap.get('title');
            page.alias=amap.get('alias');
            page.classify=amap.get('classify');
            page.classifyId=amap.get('classifyId');
            let contents:PageContentEntity[]=[];
            let strFinal:ContentMap[]=amap.get('content');
            for(let t in strFinal){
                let newContent:PageContentEntity=new PageContentEntity;
                newContent.content=strFinal[t].content;
                newContent.id=strFinal[t].id;
                contents.push(newContent);
            }
            const result=this.pageService.updatePages(page,contents,amap.get('limitNum'));
            return result;
        }
        let deletePages=map.get('deletePages');
        if(deletePages != null || deletePages != undefined) {
            let amap = new Map();
            amap = this.objToStrMap(deletePages);
            let array:[number]=amap.get('id');
            const result=this.pageService.deletePages(array,amap.get('limitNum'));
            return result;

        }
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