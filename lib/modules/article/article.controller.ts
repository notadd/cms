import {Body, Controller, Get, HttpStatus, Post, Response} from "@nestjs/common";
import {ApiOperation} from "@nestjs/swagger";
import {ArticleService} from "./article.service";
import {GetLimit} from "../common/param.dto";
import {CreateArticle} from "../common/param.dto";
import {DeleteArticleId} from "../common/param.dto";
import {UpdateArticle} from "../common/param.dto";
import {KeyWords} from "../common/param.dto";
import {ArticleEntity} from "../entity/article.entity";

@Controller('article')
export class ArticleController{
    constructor(private  readonly articleService:ArticleService){};

    /**
     * 分页所有所有文章
     * @param res
     * @param {GetLimit} limitNum
     */
    @ApiOperation({title:"find All articles"})
    @Post('findAll')
    public async getArticleAll(@Response() res,@Body() limitNum:GetLimit){
        let findAll:ArticleEntity[]=await this.articleService.getArticleAll(limitNum.limitNumber);
        return res.status(HttpStatus.OK).send(JSON.stringify(findAll));
    }

    /**
     * 关键字分页获取文章
     * @param res
     * @param {KeyWords} key
     */
    @ApiOperation({title:"Keyword search"})
    @Post('serach')
    public async keywordsSerach(@Response() res,@Body() key:KeyWords){
        let findAll:ArticleEntity[]=await this.articleService.serachArticles(key.keyWords,key.limitNumber);
        return res.status(HttpStatus.OK).send(JSON.stringify(findAll));
    }

    /**
     * 移出数据到回收站
     * @param res
     * @param {DeleteArticleId} idArray
     */
    @ApiOperation({title:'Delete data according to Id.'})
    @Post('deleteById')
    public async deleteById(@Response() res,@Body() idArray:DeleteArticleId){
        let result:number= await this.articleService.deleteArticles(idArray.id);
        let countNum:string=`已成功将${result}条数据放入回收站`;
      return res.status(HttpStatus.OK).send(JSON.stringify(countNum));
    }

    /**
     * 添加文章
     * @param res
     * @param {CreateArticle} article
     */
    @ApiOperation({title:'Add the article'})
    @Post('createArticle')
    public async createArticle(@Response() res,@Body() article:CreateArticle){
        let art =new ArticleEntity();
        art.name=article.name;
        art.classifyId=article.classifyId;
        art.classify =article.classifyName;
        art.abstract=article.abstractArticle;
        art.topPlace =article.topPlace;
        art.hidden =article.hidden;
        art.content = article.content;
        art.publishedTime =new Date(Date.parse(article.publishedTime.replace(/-/g,"/")));
        art.source = article.source;
        art.sourceUrl =article.sourceUrl;
        let result:ArticleEntity[]= await this.articleService.createArticle(art);
        console.log('result='+JSON.stringify(result));
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 修改文章
     * @param res
     * @param {UpdateArticle} article
     */
    @ApiOperation({title:'Update the article'})
    @Post('updateArticle')
    public updateArticle(@Response() res,@Body() article:UpdateArticle){
        let art =new ArticleEntity();
        art.id =article.id;
        art.name=article.name;
        art.classifyId=article.classifyId;
        art.classify =article.classifyName;
        art.abstract=article.abstractArticle;
        art.topPlace =article.topPlace;
        art.hidden =article.hidden;
        art.content = article.content;
        art.publishedTime =new Date(Date.parse(article.publishedTime.replace(/-/g,"/")));
        art.source = article.source;
        art.sourceUrl =article.sourceUrl;
        const result=this.articleService.updateArticle(art);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 回收站获取文章
     * @param res
     * @param {GetLimit} limit
     */
    @ApiOperation({title:'The article in the recycle bin.'})
    @Post('recycle')
    public async recycleFind(@Response() res,@Body() limit:GetLimit){
        let result:ArticleEntity[] =await this.articleService.recycleFind(limit.limitNumber);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }

    /**
     * 回收站内批量或者单个删除数据
     * @param res
     * @param {DeleteArticleId} array
     */
    @ApiOperation({title:'Delete data in recycle bin.'})
    @Post('recycleDelete')
    public async recycleDelete(@Response() res,@Body() array:DeleteArticleId){
     let result:number =await this.articleService.recycleDelete(array.id);
     let deleteNum:string =`已经成功删除${result}条数据`;
      return res.status(HttpStatus.OK).send(deleteNum);
    }

    /**
     * 批量或者单个还原回收站文章
     * @param res
     * @param {DeleteArticleId} array
     */
    @ApiOperation({title:'The article was restored at the recycle bin.'})
    @Post('recycleRestore')
    public async reductionArticle(@Response() res,@Body() array:DeleteArticleId){
        let result:ArticleEntity[]= await this.articleService.reductionArticle(array.id);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }
    /**
     * 分页获取置顶文章
     * @param res
     * @param {GetLimit} getLimit
     * @returns {Promise<void>}
     */
    @ApiOperation({title:'Get the top article for pagination.'})
    @Post('findTopPlace')
    public async findTopPlace(@Response() res,@Body() getLimit:GetLimit){
        let result:ArticleEntity[]= await this.articleService.findTopPlace(getLimit.limitNumber);
        return res.status(HttpStatus.OK).send(JSON.stringify(result));
    }
}