import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { ArticleEntity } from "./article.entity";

@Entity("article_classify_table")
export class ClassifyEntity {
    /*分类Id*/
    @PrimaryGeneratedColumn() id: number;

    /*分类名称*/
    @Column({ nullable: false, length: 120 }) title: string;

    /*分类别名*/
    @Column({ nullable: false, length: 120 }) classifyAlias: string;

    /*内链*/
    @Column({ nullable: true, length: 200 }) chainUrl: string;

    /*描述*/
    @Column({ nullable: true, length: 200 }) describe: string;

    /*颜色*/
    @Column({ nullable: true, length: 40 }) color: string;

    /*父节点*/
    @Column({ nullable: true }) groupId: number;

    /*层级*/
    @Column({ nullable: true }) level: number;

    /*是否显示当前分类文章*/
    @Column({ nullable: true }) isCurrentType: boolean;

    /*是否显示子级分类文章*/
    @Column({ nullable: true }) isChildType: boolean;

    /*是否显示全局置顶文章*/
    @Column({ nullable: true }) isAllTop: boolean;

    /*是否显示上级置顶文章*/
    @Column({ nullable: true }) isPreTop: boolean;

    @OneToMany(type => ClassifyEntity, classifyEntity => classifyEntity.parent, { cascadeInsert: true })
    children: ClassifyEntity[];

    @ManyToOne(type => ClassifyEntity, classifyEntity => classifyEntity.children, { cascadeInsert: true })
    parent: ClassifyEntity;

    /*创建时间*/
    @CreateDateColumn() createAt: Date;

    /*修改时间*/
    @UpdateDateColumn() updateAt: Date;

    @OneToMany(type => ArticleEntity, articleEntity => articleEntity.classifications)
    articles: ArticleEntity[];
}
