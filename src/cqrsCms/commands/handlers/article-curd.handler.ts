import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { PageRepository } from "../../repository/pageRepository";
import { ArticleService } from "../../service/article.service";
import { ClassifyService } from "../../service/classify.service";
import { ArticleParamCommand } from "../impl/article-param.command";

@CommandHandler(ArticleParamCommand)
export class ArticleCurdHandler implements ICommandHandler<ArticleParamCommand> {
    constructor(
        private readonly repositoty: PageRepository,
        private readonly publisher: EventPublisher,
        private readonly articleService: ArticleService,
        private readonly classifyService: ClassifyService,
    ) {
    }

    async execute(command: ArticleParamCommand, resolver: (value) => void): Promise<any> {
        const id = "0";
        const page = this.publisher.mergeObjectContext(await this.repositoty.find(id));
        let result;
        /*增删改需要重新写*/
        if (!command.article.getAllArticles) {
            let value, messageCodeError;
            /*增加、修改、删除、文章*/
            if (command.article.createArticle) {
                const result = await this.articleService
                    .CurdArticleCheck(
                        command.article.createArticle.article.classifyId,
                        0,
                    );
                value = result.Continue;
                messageCodeError = result.MessageCodeError;
            }
            if (command.article.updateArticle) {
                const result = await this.articleService
                    .CurdArticleCheck(
                        command.article.updateArticle.article.classifyId,
                        command.article.updateArticle.article.id,
                    );
                value = result.Continue;
                messageCodeError = result.MessageCodeError;
            }
            if (command.article.pictureUpload) {
                const result = await this.articleService.upLoadPicture(command.article.pictureUpload.url,
                    command.article.pictureUpload.bucketName,
                    command.article.pictureUpload.rawName,
                    command.article.pictureUpload.base64,
                    command.article.pictureUpload.id);
                value = false;
                resolver(result);
            }
            if (value === undefined) { value = true; }
            if (value) { page.createArticle(command.article); }
            resolver({ MessageCodeError: messageCodeError, Continue: value });
        }
        /*分页获取全部文章：可以选择是否隐藏*/
        if (command.article.getAllArticles && command.article.getArticles.getArticleAll) {
            result = await this.articleService.getArticleAll(command.article.limitNum, command.article.getArticles.hidden, command.article.pages);
        }
        /*根据id获取单独页面*/
        if (command.article.getAllArticles && command.article.getArticles.getArticleById) {
            result = await this.articleService.getArticleById(command.article.getArticles.getArticleById);
        }

        /*回收站获取文章*/
        if (command.article.getAllArticles && command.article.getArticles.recycleFind) {
            result = await this.articleService.recycleFind(command.article.limitNum, command.article.pages).then(a => {
                return a;
            });
        }
        /*回收站内根据分类id获取文章*/
        if (command.article.getAllArticles && command.article.getArticles.reductionGetByClassifyId) {
            result = await this.articleService.reductionClassity(command.article.getArticles.reductionGetByClassifyId,
                command.article.limitNum, command.article.pages);
        }
        /*页面内根据分类id获取文章，可以选择是否包含置顶文章*/
        if (command.article.getAllArticles && command.article.getArticles.getArticleByClassifyId) {
            result = await this.classifyService.getArticelsByClassifyId(
                command.article.getArticles.getArticleByClassifyId.classifyId,
                command.article.limitNum,
                command.article.getArticles.getArticleByClassifyId.top,
                command.article.pages,
                command.article.getArticles.getArticleByClassifyId.name);
        }
        /*获取置顶文章*/
        if (command.article.getAllArticles && command.article.getArticles.findTopPlace) {
            result = await this.articleService.findTopPlace(command.article.limitNum, command.article.pages);
        }
        /*显示子级分类文章*/
        if (command.article.getAllArticles && command.article.getArticles.showNext) {
            result = await this.classifyService.showNextTitle(command.article.getArticles.showNext);
        }
        /*显示上级分类文章以及置顶到上级的文章*/
        if (command.article.getAllArticles && command.article.getArticles.superiorArticle) {
            result = await this.classifyService.showBeforeTitle(command.article.getArticles.superiorArticle);
        }
        /*显示当前分类文章*/
        if (command.article.getAllArticles && command.article.getArticles.getCurrentClassifyArticles) {
            result = await this.classifyService.showCurrentArticles(command.article.getArticles.getCurrentClassifyArticles);
        }
        /*关键字搜索活动和资讯*/
        if (command.article.getArticles && command.article.getArticles.keywordSearch) {
            result = await this.articleService.searchArticles(
                command.article.getArticles.keywordSearch.keywords,
                command.article.limitNum,
                command.article.pages);
        }
        /*显示分类层级 暂未确定是否开放*/
        /*  if(command.article.getAllArticles && command.article.getArticles.getLevelByClassifyId){
              result=await this.articleService.getLevelByClassifyId(command.article.getArticles.getLevelByClassifyId);
          }*/
        resolver(result);
        page.commit();

    }
}
