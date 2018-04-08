import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticleEntity } from "../entity/article.entity";
import { PageEntity } from "../entity/page.entity";
import { SitemapEntity } from "../entity/sitemap.entity";

@Component()
export class SitemapService {
    constructor(@InjectRepository(ArticleEntity) private readonly artRepository: Repository<ArticleEntity>,
                @InjectRepository(PageEntity) private readonly pageRepository: Repository<PageEntity>,
                @InjectRepository(SitemapEntity) private readonly siteRepository: Repository<SitemapEntity>
    ) {
    }

    /**
     * 设置参数
     * @param array_baidu_sitemap_options
     * @param {string} url
     * @returns {Promise<void>}
     */
    public async commitXML(array_baidu_sitemap_options, url: string) {
        let sitemap: SitemapEntity = await this.siteRepository.findOneById(1);
        if (sitemap == null) {
            sitemap = array_baidu_sitemap_options;
            let fileName: string;
            if (array_baidu_sitemap_options[ 'lc_XML_FileName' ]) {
                fileName = 'sitemap_baidu';
            } else {
                fileName = 'sitemap';
            }
            sitemap.lc_XML_FileName = fileName;
            await this.siteRepository.insert(sitemap);
        } else {
            sitemap = array_baidu_sitemap_options;
            let fileName: string;
            if (array_baidu_sitemap_options[ 'lc_XML_FileName' ]) {
                fileName = 'sitemap_baidu';
            } else {
                fileName = 'sitemap';
            }
            sitemap.lc_XML_FileName = fileName;
            if (array_baidu_sitemap_options[ 'lc_is_Enabled_XML_Sitemap' ]) sitemap.lc_is_Enabled_XML_Sitemap = array_baidu_sitemap_options[ 'lc_is_Enabled_XML_Sitemap' ];
            if (array_baidu_sitemap_options[ 'lc_page_select' ]) sitemap.lc_page_select = array_baidu_sitemap_options[ 'lc_page_select' ];
            if (array_baidu_sitemap_options[ 'lc_post_select' ]) sitemap.lc_post_select = array_baidu_sitemap_options[ 'lc_post_select' ];
            if (array_baidu_sitemap_options[ 'lc_is_update_sitemap_when_post' ]) sitemap.lc_is_update_sitemap_when_post = array_baidu_sitemap_options[ 'lc_is_update_sitemap_when_post' ];
            if (array_baidu_sitemap_options[ 'lc_post_limit1000' ]) sitemap.lc_post_limit1000 = array_baidu_sitemap_options[ 'lc_post_limit1000' ];
            await this.siteRepository.updateById(1, sitemap);
        }
    }

    public async UpdateXMLFile($mes = 0, url: string) {
        let sitemap: SitemapEntity = await this.siteRepository.findOneById(1);
        if (sitemap.lc_is_Enabled_XML_Sitemap) {
            this.buildSitemapXml(url);
        }
    }

    /**
     * 函数判断
     * @returns {any[]}
     */
    public async getBaiduOptions(getBaiduOptions?) {
        getBaiduOptions = await this.siteRepository.findOneById(1);
        let array_baidu_sitemap_options = new Array();
        if (getBaiduOptions) {
            array_baidu_sitemap_options = getBaiduOptions;
        } else {
            if (!array_baidu_sitemap_options[ 'lc_XML_FileName' ]) {
                array_baidu_sitemap_options[ 'lc_XML_FileName' ] = 'sitemap_baidu';
            }
            if (!array_baidu_sitemap_options[ 'lc_is_Enabled_XML_Sitemap' ]) {
                array_baidu_sitemap_options[ 'lc_is_Enabled_XML_Sitemap' ] = '1';
            }
            if (!array_baidu_sitemap_options[ 'lc_is_update_sitemap_when_post' ]) {
                array_baidu_sitemap_options[ 'lc_is_update_sitemap_when_post' ] = '1';
            }
            if (!array_baidu_sitemap_options[ 'lc_post_limit1000' ]) {
                array_baidu_sitemap_options[ 'lc_post_limit1000' ] = '1';
            }
            if (!array_baidu_sitemap_options[ 'lc_post_select' ]) {
                array_baidu_sitemap_options[ 'lc_post_select' ] = '1';
            }
            if (!array_baidu_sitemap_options[ 'lc_page_select' ]) {
                array_baidu_sitemap_options[ 'lc_page_select' ] = '1';
            }
            if (!array_baidu_sitemap_options[ 'lc_category_select' ]) {
                array_baidu_sitemap_options[ 'lc_category_select' ] = '1';
            }
        }
        return array_baidu_sitemap_options;
    }

    /**
     * 生成xml文件
     * @param $xml_contents
     * @param $mes
     */
    public async buildSitemapXml(url: string) {
        let array_baidu_sitemap_options = await this.getBaiduOptions().then(a => {
            return a
        });
        let lc_limit: number;
        //只更新最近1000篇文章
        if (array_baidu_sitemap_options[ 'lc_post_limit1000' ]) {
            lc_limit = 1000;
        } else {
            lc_limit = 10000;
        }
        let fs = require('fs');
        let file = `${(__dirname).substring(0, (__dirname).lastIndexOf('/'))}/public/`;
        let ws = fs.createWriteStream(`${file}${array_baidu_sitemap_options[ 'lc_XML_FileName' ]}.xml`);
        let builder = require('xmlbuilder');
        let root = builder.create('urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
        let num: number = 1;
        //链接包括文章
        if (array_baidu_sitemap_options[ 'lc_post_select' ]) {
            let mini: ArticleEntity[] = await this.artRepository.createQueryBuilder('art').orderBy('art.updateAt', 'DESC').limit(lc_limit / 2).getMany();
            for (let t in mini) {
                let newTime: Date = mini[ t ].updateAt;
                let update: Date = new Date(newTime.getTime() + newTime.getTimezoneOffset() * 2 * 30 * 1000);
                let item = root.ele('url');
                let sequence = num++;
                item.ele('sequence', sequence);
                item.ele('loc', `${url.replace('"', "").replace('"', '')}/${mini[ t ].name}`);
                //item.ele('loc','https://docs.nestjs.com/recipes/cqrs');
                item.ele('changefreq', 'weekly');
                item.ele('lastmod', `${update.toLocaleDateString()} ${update.toLocaleTimeString()}`);
            }
        }
        //链接包括页面
        if (array_baidu_sitemap_options[ 'lc_page_select' ]) {
            let mini: PageEntity[] = await this.pageRepository.createQueryBuilder('page').orderBy('page.updateAt', 'DESC').limit(lc_limit / 2).getMany();
            for (let t in mini) {
                let newTime: Date = mini[ t ].updateAt;
                let update: Date = new Date(newTime.getTime() + newTime.getTimezoneOffset() * 2 * 30 * 1000);
                let item = root.ele('url');
                let sequence = num++;
                item.ele('sequence', sequence);
                item.ele('loc', `${url.replace('"', "").replace('"', '')}/${mini[ t ].title}`);
                // item.ele('loc','https://docs.nestjs.com/recipes/cqrs');
                item.ele('changefreq', 'weekly');
                item.ele('lastmod', `${update.toLocaleDateString()} ${update.toLocaleTimeString()}`);
            }
        }
        root.end({ pretty: false });
        ws.write(`<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="./sitemap.xsl"?>\n${root.toString().substring(0, root.toString().lastIndexOf('urlset') + 6)}>`);
        ws.end();
    }
}
